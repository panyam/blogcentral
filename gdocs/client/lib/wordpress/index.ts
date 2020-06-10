import { App } from "../app";
import { Nullable } from "../types";
import { View } from "../ui/Views";
import { SiteManager, Site } from "../siteapis";
import { AuthClient } from "../authclients";
import { PublicWPRestApi, HostedWPRestApi } from "./api";
import { PublicWPSiteInputView, HostedWPSiteInputView } from "./ui";
import { PublicWPSiteSummaryView, HostedWPSiteSummaryView } from "./ui";
import { SITE_TYPE_WP_PUBLIC, SITE_TYPE_WP_HOSTED } from "./core";

class PublicWPSiteManager extends SiteManager {
  createSiteView(
    purpose: string,
    elem_or_id: any,
    site: Nullable<Site>
  ) : View<Site> {
    if (purpose == "input") {
      return new PublicWPSiteInputView(elem_or_id, this.app).setup();
    } else {
      return new PublicWPSiteSummaryView(elem_or_id, this, site!!).setup();
    }
  }

  createSiteApi(site: Site, authClient: AuthClient): PublicWPRestApi{
    return new PublicWPRestApi(site, authClient, this);
  }
}

class HostedWPSiteManager extends SiteManager {
  createSiteView(
    purpose: string,
    elem_or_id: any,
    site: Nullable<Site>
  ) : View<Site> {
    if (purpose == "input") {
      return new HostedWPSiteInputView(elem_or_id, this.app).setup();
    } else {
      return new HostedWPSiteSummaryView(elem_or_id, this, site!!).setup();
    }
  }

  createSiteApi(site: Site, authClient: AuthClient): HostedWPRestApi{
    return new HostedWPRestApi(site, authClient, this);
  }
}

export function registerApp(app: App) {
  app.siteManagers[SITE_TYPE_WP_PUBLIC] = new PublicWPSiteManager(app);
  app.siteManagers[SITE_TYPE_WP_HOSTED] = new HostedWPSiteManager(app);
}
