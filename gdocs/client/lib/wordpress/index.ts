import { App } from "../app";
import { Nullable } from "../types";
import { Site } from "../siteapis";
import { HttpClient } from "../net";
import { AuthClient } from "../authclients";
import { PublicWPRestApi, HostedWPRestApi } from "./api";
import { PublicWPSiteInputView, HostedWPSiteInputView } from "./ui";
import { PublicWPSiteSummaryView, HostedWPSiteSummaryView } from "./ui";
import { SITE_TYPE_WP_PUBLIC, SITE_TYPE_WP_HOSTED } from "./core";

export function registerApp(app: App) {
  app.siteApiFactories[SITE_TYPE_WP_PUBLIC] = (site : Site, authClient : AuthClient, httpClient : HttpClient) => {
    return new PublicWPRestApi(site, authClient, httpClient);
  };
  app.siteApiFactories[SITE_TYPE_WP_HOSTED] = (site : Site, authClient : AuthClient, httpClient : HttpClient) => {
    return new HostedWPRestApi(site, authClient, httpClient);
  };
  app.siteViewFactories[SITE_TYPE_WP_PUBLIC] = (
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
  app.siteViewFactories[SITE_TYPE_WP_HOSTED] = (
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
