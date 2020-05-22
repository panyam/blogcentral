declare var Handlebars: any;
import { ensureElement } from "./utils";
import { Int, Nullable } from "../types";
import { Site, Post } from "../sites";
import { ServiceCatalog } from "../catalog";
import { SiteView } from "./SiteView";

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

export class SiteListView {
  rootElement: any;
  services: ServiceCatalog;
  delegate: Nullable<SiteListViewDelegate> = null;
  siteViews: SiteView[];

  constructor(elem_or_id: any, services: ServiceCatalog) {
    this.rootElement = ensureElement(elem_or_id);
    this.services = services;
    this.refresh();
  }

  get template(): string {
    return `{{# each sites }}<div class = "site_div" id = "site_div_{{@index}}"> </div> {{/each}}`;
  }

  refresh() {
    var self = this;
    var siteService = this.services.siteService;
    var siteServiceTemplate = Handlebars.compile(this.template);
    var html = siteServiceTemplate({
      sites: siteService.sites,
    });
    this.rootElement.html(html);

    this.siteViews = this.rootElement
      .find(".site_div")
      .map((i: Int, elem: any) => {
        var siteView = new SiteView(elem, siteService.sites[i], i);
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
    var siteService = this.services.siteService;
    var site = siteView.site;
    console.log("Removing Site: ", site);
    siteService.remove(site.id).then(() => self.refresh());
  }
}
