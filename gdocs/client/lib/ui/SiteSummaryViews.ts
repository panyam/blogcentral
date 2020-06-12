import "../../styles/SiteSummaryView";
import { SiteManager, Post, Site, SiteApi } from "../siteapis";
import { ActivityIndicator } from "./ActivityIndicator";
import { View } from "./Views";
import { Nullable } from "../types";

export class SiteSummaryView extends View<Site> {
  publishPostButton: any;
  selectPostButton: any;
  removeButton: any;
  activityIndicator: ActivityIndicator;
  progressbar: any;
  siteManager: SiteManager;
  siteApi: SiteApi;

  constructor(elem_or_id: any, siteManager: SiteManager, site: Site) {
    super(elem_or_id, "site", site);
    this.siteManager = siteManager;
    this.siteApi = this.siteManager.apiForSite(site);
  }

  setupViews(self: this = this) {
    super.setupViews();
    this.progressbar = this.findElement(".progressbar");
    var aidiv = this.findElement(".activity_indicator");
    this.activityIndicator = new ActivityIndicator(aidiv).setup();
    this.publishPostButton = this.findElement(".publish_post_button");
    this.selectPostButton = this.findElement(".select_post_button");
    this.removeButton = this.findElement(".remove_site_button");

    this.showProgress(false);
    this.publishPostButton.button().on("click", (_event: any) => {
      self.onPublishPostClicked();
    });

    this.removeButton.button().on("click", (_event: any) => {
      self.onRemoveSiteClicked();
    });

    if (this.selectPostButton && this.selectPostButton.length >= 0) {
      this.selectPostButton.button().on("click", (_event: any) => {
        self.onSelectPostClicked();
      });
    }
  }

  showBusy(busy: boolean) {
    if (busy) this.activityIndicator.show();
    else this.activityIndicator.hide();
  }

  showProgress(busy: boolean) {
    this.publishPostButton.prop("disabled", busy);
    this.removeButton.prop("disabled", busy);
    if (busy) {
      this.progressbar.progressbar("option", "value", false);
      this.progressbar.show();
    } else {
      this.progressbar.hide();
    }
  }

  /**
   * Lets one select one or more posts in a site.
   */
  async onSelectPostClicked() {
    var site = this.entity!!;
    // if our api is create-only then selecting posts doesnt make sense.
    if (!this.siteApi.canUpdatePosts) {
      return null;
    }
    var app = this.siteManager.app;
    var siteService = app.siteService;
    var post = (await app.postsPanel.open(site)) as Nullable<Post>;
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

  async onPublishPostClicked() {
    var site = this.entity!!;
    var app = this.siteManager.app;
    var siteApi = this.siteApi;
    // select a post if possible
    if (site.selectedPost == null) {
      if (siteApi.canUpdatePosts) {
        await this.onSelectPostClicked();
      } else {
        // then show the "new Post" view
        site.selectedPost = await this.siteManager.obtainNewPost();
      }
    }

    if (site.selectedPost == null) {
      // Then it was cancelled
      return false;
    }

    this.activityIndicator.show();
    var html = await app.contentExtractor.extractHtml(site);
    console.log("Published Post, HTML: ", html);

    // Now publish it!
    if (await app.ensureLoggedIn(site)) {
      var result: any;
      if (siteApi.canUpdatePosts) {
        result = await siteApi.updatePost(site.selectedPost.id, {
          content: html,
        });
      } else {
        result = await siteApi.createPost(site.selectedPost, {
          content: html,
        });
      }
      console.log("Published Post, Result: ", result);
    }
    this.activityIndicator.hide();
    return true;
  }

  onRemoveSiteClicked() {
    var self = this;
    var siteService = this.siteManager.app.siteService;
    var site = this.entity!!;
    var siteMan = this.siteManager;
    console.log("Removing Site: ", site);
    siteService.remove(site).then(() => {
      siteMan.app.eventHub.triggerOn("SiteRemoved", self, site);
    });
  }
}
