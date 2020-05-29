import { App } from "../app";
import { Nullable } from "../types";
import { Site, SiteConfig } from "../siteapis";
import { MediumApi } from "./api";
import { MediumSiteInputView } from "./ui";
import { MediumSiteSummaryView } from "./ui";

export const SITE_TYPE_MEDIUM = "SITE_TYPE_MEDIUM";

export function registerApp(app: App) {
  app.siteApiFactories[SITE_TYPE_MEDIUM] = (config: SiteConfig) => {
    return new MediumApi(config);
  };
  app.siteViewFactories[SITE_TYPE_MEDIUM] = (
    purpose: string,
    elem_or_id: any,
    site: Nullable<Site>
  ) => {
    if (purpose == "input") {
      return new MediumSiteInputView(elem_or_id, app).setup();
    } else {
      return new MediumSiteSummaryView(elem_or_id, site!!).setup();
    }
  };
}
