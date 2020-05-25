import { View } from "./Views";
import { Int, Nullable } from "../types";
import { Site, Post } from "../sites";
import { App } from "../app";
import { createSiteSummaryView, SiteSummaryView } from "./SiteSummaryViews";

export interface SiteListViewDelegate {
  /**
   * Lets one select one or more posts in a site.
   */
  selectPost(site: Site): Promise<Nullable<Post>>;

  /**
   * Kicks of publishing of content to the given site.
   */
  publishPost(site: Site): Promise<Nullable<boolean>>;
}

export class SiteListView extends View<Site[]> {
  app: App;
  delegate: Nullable<SiteListViewDelegate> = null;
  siteViews: SiteSummaryView[];

  constructor(elem_or_id: any, app: App) {
    super(elem_or_id, app.siteService.sites);
    this.app = app;
    this.renderAsTemplate = true;
    this.entityName = "sites";
  }

  template() {
    return `{{# each sites }}<div class = "site_div" id = "site_div_{{@index}}"> </div> {{/each}}`;
  }

  setupViews(self: this = this) {
    super.setupViews();
    this.siteViews = this.rootElement
      .find(".site_div")
      .map((i: Int, elem: any) => {
        var siteView = createSiteSummaryView(
          elem,
          self.app.siteService.sites[i]
        );
        siteView.showProgress(false);
        siteView.selectPostButton.button().on("click", (_event: any) => {
          self.onSelectPostClicked(siteView);
        });

        siteView.publishPostButton.button().on("click", (_event: any) => {
          self.onPublishPostClicked(siteView);
        });

        siteView.removeButton.button().on("click", (_event: any) => {
          self.onRemoveSiteClicked(siteView);
        });
        return siteView;
      });
  }

  async onSelectPostClicked(siteView: SiteSummaryView) {
    var site = siteView.entity!!;
    if (this.delegate != null) {
      await this.delegate.selectPost(site);
      this.refreshViews();
    }
  }

  async onPublishPostClicked(siteView: SiteSummaryView) {
    var site = siteView.entity!!;
    if (site.selectedPost == null) {
      if (this.delegate != null) {
        await this.delegate.selectPost(site);
        this.refreshViews();
      }
    }
    if (this.delegate == null) {
      throw new Error("Delegate for SiteListView not found");
    }
    return this.delegate.publishPost(site);
  }

  onRemoveSiteClicked(siteView: SiteSummaryView) {
    var self = this;
    var siteService = this.app.siteService;
    var site = siteView.entity!!;
    console.log("Removing Site: ", site);
    siteService.remove(site).then(() => self.refreshViews());
  }
}
