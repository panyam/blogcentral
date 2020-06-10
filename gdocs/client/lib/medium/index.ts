import { App } from "../app";
import { Nullable } from "../types";
import { Site, SiteManager } from "../siteapis";
import { AuthClient } from "../authclients";
import { MediumApi } from "./api";
import { View } from "../ui/Views";
import { MediumSiteInputView } from "./ui";
import { MediumSiteSummaryView } from "./ui";

export const SITE_TYPE_MEDIUM = "SITE_TYPE_MEDIUM";

export class MediumSiteManager extends SiteManager {
  createSiteView(
    purpose: string,
    elem_or_id: any,
    site: Nullable<Site>
  ): View<Site> {
    if (purpose == "input") {
      return new MediumSiteInputView(elem_or_id, this).setup();
    } else {
      return new MediumSiteSummaryView(elem_or_id, this, site!!).setup();
    }
  }

  createSiteApi(site: Site, authClient: AuthClient): MediumApi {
    return new MediumApi(site, authClient, this);
  }
}

export function registerApp(app: App) {
  app.siteManagers[SITE_TYPE_MEDIUM] = new MediumSiteManager(app);
}
