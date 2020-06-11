import "../../styles/SiteSummaryView";
import { SiteManager, Site, SiteApi } from "../siteapis";
import { ActivityIndicator } from "./ActivityIndicator";
import { View } from "./Views";

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

    if (this.selectPostButton && this.selectPostButton >= 0) {
      this.selectPostButton.button().on("click", (_event: any) => {
        self.onSelectPostClicked();
      });
    }

    this.removeButton.button().on("click", (_event: any) => {
      self.onRemoveSiteClicked();
    });
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

  async onSelectPostClicked() {
    var site = this.entity!!;
    await this.siteManager.selectPost(site);
    this.siteManager.app.eventHub.triggerOn("PostSelected", this, site);
  }

  async onPublishPostClicked() {
    var site = this.entity!!;
    // select a post if possible
    if (site.selectedPost == null) {
      if (this.siteApi.canGetPosts) {
        await this.onSelectPostClicked();
      } else {
        // then show the "new Post" view
      }
    }

    if (site.selectedPost == null) {
      // perhaps we cannot get posts - so kick off a
      // post creation
    }

    return this.siteManager.publishPost(site);
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
