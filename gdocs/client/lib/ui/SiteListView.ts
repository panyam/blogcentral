declare var Handlebars: any;
import { ensureElement } from "./utils";
import { Int, Nullable } from "../types";
import { Site, Post } from "../models";
import { ServiceCatalog } from "../catalog";
import { SiteView } from "./SiteView";
import { ActivityIndicator } from "./ActivityIndicator";

export interface SiteListViewDelegate {
  /**
   * Lets one select one or more posts in a site.
   */
  selectPost(site: Site, index: Int): Promise<Nullable<Post>>;

  /**
   * Kicks of publishing of content to the given site.
   */
  publishPost(site: Site, index: Int): Promise<Nullable<boolean>>;
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
    return `
      {{# each sites }}
        <div class = "site_div" id = "site_div_{{@index}}"> </div>
      {{/each}}`;
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
        siteView.selectPostButton.button().on("click", (event: any) => {
          self.onSelectPostClicked(event);
        });

        siteView.publishPostButton.button().on("click", (event: any) => {
          self.onPublishPostClicked(event);
        });

        siteView.removeButton.button().on("click", (event: any) => {
          self.onRemoveSiteClicked(event);
        });
        return siteView;
      });
  }

  async onSelectPostClicked(event: any) {
    var siteService = this.services.siteService;
    var index = parseInt(
      event.currentTarget.id.substring("select_post_".length)
    );
    var site = siteService.siteAt(index);
    if (this.delegate != null) {
      var post = await this.delegate.selectPost(site, index);
      this.refresh();
    }
  }

  async onPublishPostClicked(event: any) {
    var siteService = this.services.siteService;
    var index = parseInt(
      event.currentTarget.id.substring("publish_post_".length)
    );
    var site = siteService.siteAt(index);
    if (site.selectedPost == null) {
      if (this.delegate != null) {
        var post = await this.delegate.selectPost(site, index);
        this.refresh();
      }
    }
    if (this.delegate == null) {
      throw new Error("Delegate for SiteListView not found");
    }
    return this.delegate.publishPost(site, index);
  }

  onRemoveSiteClicked(event: any) {
    var self = this;
    var siteService = this.services.siteService;
    var index = parseInt(
      event.currentTarget.id.substring("remove_site_".length)
    );
    console.log("Removing Site at: ", index);
    siteService.removeAt(index).then(() => self.refresh());
  }
}
