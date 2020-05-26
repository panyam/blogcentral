import "../../styles/SitesPanel";
import { SiteInputDialog } from "./SiteInputDialog";
import { ActivityIndicator } from "./ActivityIndicator";
import { SiteListView, SiteListViewDelegate } from "./SiteListView";
import { ensureElement, ensureCreated } from "./utils";
import { View } from "./Views";
import { Nullable } from "../types";
import { PostsPanel } from "./PostsPanel";
import { Site, Post } from "../models";
import { App } from "../app";

export class SitesPanel extends View<null> implements SiteListViewDelegate {
  postsPanel: PostsPanel;
  addSiteDialog: SiteInputDialog;
  addButton: any;
  siteListView: SiteListView;
  app: App;
  activityIndicator: ActivityIndicator;

  constructor(elem_or_id: string, app: App) {
    super(elem_or_id, null, null);
    this.app = app;
  }

  setupViews() {
    var self = this;
    var aidiv = this.rootElement.find(".activity_indicator");
    this.activityIndicator = new ActivityIndicator(aidiv).setup();

    var postsPanelElem = ensureElement("posts_panel_div", this.rootElement);
    this.postsPanel = new PostsPanel(postsPanelElem, this.app).setup();

    var siteListDiv = this.rootElement.find("#site_list_div");
    this.siteListView = new SiteListView(siteListDiv, this.app).setup();
    this.siteListView.delegate = this;

    this.addButton = this.rootElement.find("#add_button");
    this.addButton.button().on("click", function () {
      self.showAddSiteDialog().then((site: Site) => {
        if (site != null) {
          self.app.siteService.addSite(site as Site).then(() => {
            self.siteListView.refreshViews();
          });
        }
      });
    });

    this.app.siteService.loadAll().then(() => {
      self.siteListView.entity = self.app.siteService.sites;
    });
  }

  async showAddSiteDialog() {
    var addSiteDialogElem: any = ensureCreated(
      "add_site_dialog",
      this.rootElement
    );
    this.addSiteDialog = new SiteInputDialog(
      addSiteDialogElem,
      this.app,
      true
    ).setup();
    return this.addSiteDialog.open();
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
