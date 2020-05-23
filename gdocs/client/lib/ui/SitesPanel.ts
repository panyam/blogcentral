import { SiteDetailDialog } from "./SiteDetailDialog";
import { ActivityIndicator } from "./ActivityIndicator";
import { SiteListView, SiteListViewDelegate } from "./SiteListView";
import { ensureElement } from "./utils";
import { Nullable } from "../types";
import { PostsPanel } from "./PostsPanel";
import { Site, Post } from "../sites";
import { App } from "../app";

export class SitesPanel implements SiteListViewDelegate {
  rootElement: any;
  postsPanel: PostsPanel;
  addSiteDialog: SiteDetailDialog;
  addButton: any;
  siteListView: SiteListView;
  app: App;
  activityIndicator: ActivityIndicator;

  constructor(elem_or_id: string, app: App) {
    this.rootElement = ensureElement(elem_or_id);
    this.app = app;
    this.setupViews();
  }

  setupViews() {
    var self = this;
    var aidiv = this.rootElement.find(".activity_indicator");
    this.activityIndicator = new ActivityIndicator(aidiv);

    var addSiteDialogElem: any = ensureElement(
      "add_site_dialog",
      this.rootElement
    );
    if (addSiteDialogElem.length == 0) {
      addSiteDialogElem = $("<div id='add_site_dialog'></div>");
      this.rootElement.append(addSiteDialogElem);
    }
    this.addSiteDialog = new SiteDetailDialog(addSiteDialogElem, this.app);

    var postsPanelElem = ensureElement("posts_panel_div", this.rootElement);
    this.postsPanel = new PostsPanel(postsPanelElem, this.app);

    var siteListDiv = this.rootElement.find("#site_list_div");
    this.siteListView = new SiteListView(siteListDiv, this.app);
    this.siteListView.delegate = this;

    this.addButton = this.rootElement.find("#add_button");
    this.addButton.button().on("click", function () {
      self.addSiteDialog.open().then((site: Site) => {
        if (site != null) {
          self.app.siteService.addSite(site as Site).then(() => {
            self.siteListView.refresh();
          });
        }
      });
    });

    this.app.siteService.loadAll().then(() => {
      self.siteListView.refresh();
    });
  }

  /**
   * Lets one select one or more posts in a site.
   */
  async selectPost(site: Site) {
    var siteService = this.app.siteService;
    var post = (await this.postsPanel.open(site)) as Nullable<Post>;
    console.log("Post Selected from Panel: ", post);
    if (post != null) {
      site.selectedPost = {
        id: post.id,
        title: post.options.title,
        link: post.options.link,
      };
      // await siteService.saveSite(site);
      await siteService.saveAll();
    }
    return post;
  }

  /**
   * Kicks of publishing of content to the given site.
   */
  async publishPost(site: Site) {
    var app = this.app;
    if (site.selectedPost == null) {
      alert("Please select a post for this site to publish to");
      return null;
    }

    this.activityIndicator.show();
    var html = await this.app.contentExtractor.extractHtml(site);
    console.log("Published Post, HTML: ", html);

    // Now publish it!
    if (await app.ensureLoggedIn(site)) {
      var result = await app.updatePost(site, site.selectedPost.id, {
        content: html,
      });
      console.log("Published Post, Result: ", result);
    }
    this.activityIndicator.hide();
    return true;
  }
}
