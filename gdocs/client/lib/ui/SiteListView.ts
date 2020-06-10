import { View } from "./Views";
import { SiteSummaryView } from "./SiteSummaryViews";
import { Int } from "../types";
import { Site } from "../siteapis";
import { App } from "../app";

export class SiteListView extends View<Site[]> {
  app: App;
  siteViews: SiteSummaryView[];

  constructor(elem_or_id: any, app: App) {
    super(elem_or_id, "sites", app.siteService.sites);
    this.app = app;
  }

  template() {
    return `{{# each sites }}<div class = "site_div" id = "site_div_{{@index}}"> </div> {{/each}}`;
  }

  setupViews(self: this = this) {
    super.setupViews();
    this.siteViews = this.findElement(".site_div").map((i: Int, elem: any) => {
      var site = self.app.siteService.sites[i];
      var siteManager = self.app.managerForSite(site);
      var siteView = siteManager.createSiteView(
        "summary",
        elem,
        self.app.siteService.sites[i]
      ) as SiteSummaryView;
      return siteView;
    });
  }
}
