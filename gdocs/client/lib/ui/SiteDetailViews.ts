declare var Handlebars: any;
import { View } from "./Views";
import { Nullable } from "../types";
import { Site } from "../sites";
import { ActivityIndicator } from "./ActivityIndicator";

export class SiteDetailView extends View {
  activityIndicator: ActivityIndicator;
  allFields: JQuery<any>;
  readonly site: Site;

  constructor(elem_or_id: any, site: Nullable<Site> = null) {
    super(elem_or_id);
    this.site = site || Site.defaultSite();
  }

  renderTemplate() {
    var template = Handlebars.compile(this.template);
    var html = template({
      site: this.site,
    });
    return html;
  }
}

export class WPSiteDetailView extends SiteDetailView {
  get template(): string {
    return `WP Site`;
  }
}

export class LISiteDetailView extends SiteDetailView {
  setupViews() {
    return super.setupViews();
  }

  get template(): string {
    return `LI Site`;
  }
}

export class MediumSiteDetailView extends SiteDetailView {
  get template(): string {
    return `Medium Site`;
  }
}
