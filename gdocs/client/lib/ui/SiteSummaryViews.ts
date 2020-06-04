import "../../styles/SiteSummaryView";
import { Site } from "../siteapis";
import { ActivityIndicator } from "./ActivityIndicator";
import { View } from "./Views";

export class SiteSummaryView extends View<Site> {
  publishPostButton: any;
  selectPostButton: any;
  removeButton: any;
  activityIndicator: ActivityIndicator;
  progressbar: any;

  constructor(elem_or_id: any, site: Site) {
    super(elem_or_id, "site", site);
  }

  setupViews() {
    super.setupViews();
    this.progressbar = this.findElement(".progressbar");
    var aidiv = this.findElement(".activity_indicator");
    this.activityIndicator = new ActivityIndicator(aidiv).setup();
    this.publishPostButton = this.findElement(".publish_post_button");
    this.selectPostButton = this.findElement(".select_post_button");
    this.removeButton = this.findElement(".remove_site_button");
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
}
