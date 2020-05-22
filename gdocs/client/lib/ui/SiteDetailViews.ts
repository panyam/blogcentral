declare var Handlebars: any;
import { ensureElement, setEnabled, setVisible } from "./utils";
import { Nullable } from "../types";
import { Site } from "../sites";
import { ActivityIndicator } from "./ActivityIndicator";

export class SiteDetailView {
  rootElement: any;
  activityIndicator: ActivityIndicator;
  allFields: JQuery<any>;
  readonly site: Site;

  constructor(elem_or_id: any, site: Nullable<Site> = null) {
    this.rootElement = ensureElement(elem_or_id);
    this.setupViews();
    this.site = site || new Site({});
  }

  onSiteChanged() {}

  setupViews() {
    var template = Handlebars.compile(this.template);
    var html = template({
      site: this.site,
    });
    this.rootElement.html(html);
  }

  get template() {
    return "";
  }
}

export class WPSiteDetailView extends SiteDetailView {
  tokenLabel: JQuery<HTMLElement>;
  tokenElem: JQuery<HTMLElement>;
  expiresAtLabel: JQuery<HTMLElement>;
  expiresAtElem: JQuery<HTMLElement>;

  setupViews() {
    super.setupViews();
    this.tokenElem = this.rootElement.find("#token");
    this.tokenLabel = this.rootElement.find("label[for='token']");
    this.expiresAtElem = this.rootElement.find("#expiresAt");
    this.expiresAtLabel = this.rootElement.find("label[for='expiresAt']");
  }

  onSiteChanged() {
  }

  get template(): string {
    return ` `;
  }
}

export class LISiteDetailView extends SiteDetailView {
  setupViews() {
    super.setupViews();
  }

  onSiteChanged() {
  }

  get template(): string {
    return ` `;
  }
}

export class MediumSiteDetailView extends SiteDetailView {
  setupViews() {
    super.setupViews();
  }

  onSiteChanged() {
  }

  get template(): string {
    return ` `;
  }
}
