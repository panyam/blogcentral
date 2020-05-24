declare var Handlebars: any;
import { View } from "./Views";
import { Int, Nullable } from "../types";
import { Site, Post } from "../sites";
import { App } from "../app";
import { createSiteView, SiteView } from "./SiteViews";

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

export class SiteListView extends View {
  app: App;
  delegate: Nullable<SiteListViewDelegate> = null;
  siteViews: SiteView[];

  constructor(elem_or_id: any, app: App) {
    super(elem_or_id);
    this.app = app;
  }

  template(): string {
    return `{{# each sites }}<div class = "site_div" id = "site_div_{{@index}}"> </div> {{/each}}`;
  }

  setup(): this {
    super.setup();
    this.refresh();
    return this;
  }

  refresh() {
    var self = this;
    var siteService = this.app.siteService;
    var siteServiceTemplate = Handlebars.compile(this.template());
    var html = siteServiceTemplate({
      sites: siteService.sites,
    });
    this.rootElement.html(html);

    this.siteViews = this.rootElement
      .find(".site_div")
      .map((i: Int, elem: any) => {
        var siteView = createSiteView(elem, siteService.sites[i], i);
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

  async onSelectPostClicked(siteView: SiteView) {
    var site = siteView.site;
    if (this.delegate != null) {
      await this.delegate.selectPost(site);
      this.refresh();
    }
  }

  async onPublishPostClicked(siteView: SiteView) {
    var site = siteView.site;
    if (site.selectedPost == null) {
      if (this.delegate != null) {
        await this.delegate.selectPost(site);
        this.refresh();
      }
    }
    if (this.delegate == null) {
      throw new Error("Delegate for SiteListView not found");
    }
    return this.delegate.publishPost(site);
  }

  onRemoveSiteClicked(siteView: SiteView) {
    var self = this;
    var siteService = this.app.siteService;
    var site = siteView.site;
    console.log("Removing Site: ", site);
    siteService.remove(site).then(() => self.refresh());
  }
}
