declare var Handlebars: any;
import { SiteType } from "../interfaces";
import { Nullable } from "../types";
import { View } from "./Views";
import { Site } from "../sites";
import { ActivityIndicator } from "./ActivityIndicator";

export class SiteInputView extends View {
  activityIndicator: ActivityIndicator;
  allFields: JQuery<any>;

  constructor(elem_or_id: any, site: Nullable<Site> = null) {
    super(elem_or_id);
    this.site = site || Site.defaultSite();
  }

  get siteFromView() {
    return Site.defaultSite();
  }

  set site(_site: Site) {}
}

export class WPSiteInputView extends SiteInputView {
  titleElem: any;
  apiUrlElem: any;

  setup(): this {
    super.setup();
    this.titleElem = this.rootElement.find("#title");
    this.apiUrlElem = this.rootElement.find("#apiUrl");
    return this;
  }

  get siteFromView() {
    return new Site(this.titleElem.val() || "", {
      siteType: SiteType.WORDPRESS,
      siteConfig: {
        apiUrl: this.apiUrlElem.val() || "",
      },
    });
  }

  set site(_site: Site) {}

  template(): string {
    return `
        <label for="title">Title</label>
        <input type="text" name="title" id="title" class="text ui-widget-content ui-corner-all" value = "My Amazing Site" />
        <label for="apiUrl">API Endpoint</label>
        <input type="text" name="apiUrl" id="apiUrl" class="text ui-widget-content ui-corner-all" value = "https://examplesite.com/wp-json/" />
      `;
  }
}

export class LISiteInputView extends SiteInputView {
  template(): string {
    return `LI Site`;
  }
}

export class MediumSiteInputView extends SiteInputView {
  template(): string {
    return `Medium Site`;
  }
}
