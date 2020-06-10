import "../../styles/SiteSummaryView";
import { SiteManager, Site } from "../siteapis";
import { ActivityIndicator } from "./ActivityIndicator";
import { View } from "./Views";

export class SiteSummaryView extends View<Site> {
  publishPostButton: any;
  selectPostButton: any;
  removeButton: any;
  activityIndicator: ActivityIndicator;
  progressbar: any;
  siteManager: SiteManager;

  constructor(elem_or_id: any, siteManager: SiteManager, site : Site) {
    super(elem_or_id, "site", site);
    this.siteManager = siteManager;
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
      self.onPublishPostClicked(this);
    });

    if (this.selectPostButton && this.selectPostButton >= 0) {
      this.selectPostButton.button().on("click", (_event: any) => {
        self.onSelectPostClicked(this);
      });
    }

    this.removeButton.button().on("click", (_event: any) => {
      self.onRemoveSiteClicked(this);
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

  async onSelectPostClicked(siteView: SiteSummaryView) {
    var site = siteView.entity!!;
    if (this.siteManager != null) {
      await this.siteManager.selectPost(site);
      this.onSitesChanged();
    }
  }

  async onPublishPostClicked(siteView: SiteSummaryView) {
    var site = siteView.entity!!;
    var siteApi = this.siteManager.apiForSite(site);
    // select a post if possible
    if (site.selectedPost == null && siteApi.canGetPosts) {
      await this.onSelectPostClicked(siteView);
    }

    if (site.selectedPost == null) {
      // perhaps we cannot get posts - so kick off a
      // post creation
    }

    return this.siteManager.publishPost(site);
  }

  onRemoveSiteClicked(siteView: SiteSummaryView) {
    var self = this;
    var siteService = this.siteManager.app.siteService;
    var site = siteView.entity!!;
    console.log("Removing Site: ", site);
    siteService.remove(site).then(() => self.onSitesChanged());
  }

  onSitesChanged() {
    this.refreshViews();
  }
}
