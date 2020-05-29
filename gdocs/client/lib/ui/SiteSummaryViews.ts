import "../../styles/SiteSummaryView";
import { Site } from "../models";
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
    this.progressbar = this.rootElement.find(".progressbar");
    var aidiv = this.rootElement.find(".activity_indicator");
    this.activityIndicator = new ActivityIndicator(aidiv).setup();
    this.publishPostButton = this.rootElement.find(".publish_post_button");
    this.selectPostButton = this.rootElement.find(".select_post_button");
    this.removeButton = this.rootElement.find(".remove_site_button");
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
