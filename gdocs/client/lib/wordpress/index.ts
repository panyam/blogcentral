import { App } from "../app";
import { Nullable } from "../types";
import { Site, SiteConfig } from "../siteapis";
import { PublicWPRestApi, HostedWPRestApi } from "./api";
import { PublicWPSiteInputView, HostedWPSiteInputView } from "./ui";
import { PublicWPSiteSummaryView, HostedWPSiteSummaryView } from "./ui";
import { PUBLIC_WP, HOSTED_WP } from "./core";

export function registerApp(app: App) {
  app.siteApiFactories[PUBLIC_WP] = (config: SiteConfig) => {
    return new PublicWPRestApi(config);
  };
  app.siteApiFactories[HOSTED_WP] = (config: SiteConfig) => {
    return new HostedWPRestApi(config);
  };
  app.siteViewFactories[PUBLIC_WP] = (
    purpose: string,
    elem_or_id: any,
    site: Nullable<Site>
  ) => {
    if (purpose == "input") {
      return new PublicWPSiteInputView(elem_or_id, app).setup();
    } else {
      return new PublicWPSiteSummaryView(elem_or_id, site!!).setup();
    }
  };
  app.siteViewFactories[HOSTED_WP] = (
    purpose: string,
    elem_or_id: any,
    site: Nullable<Site>
  ) => {
    if (purpose == "input") {
      return new HostedWPSiteInputView(elem_or_id, app).setup();
    } else {
      return new HostedWPSiteSummaryView(elem_or_id, site!!).setup();
    }
  };
}
