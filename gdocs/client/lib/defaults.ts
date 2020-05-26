import { Site } from "./models";
import { JWTAuthClient } from "./authclients";
import { WPRestApi } from "./siteapis";
import { SiteType, AuthType } from "./enums";
import { Defaults } from "../../defvals";

export function loadDefaults() {
  return Defaults;
}

export function defaultSite(): Site {
  return new Site(Defaults.WPRestApi.Title, {
    siteType: SiteType.WORDPRESS,
    siteConfig: WPRestApi.defaultConfig(),
    authType: AuthType.JWT,
    authConfig: JWTAuthClient.defaultConfig(),
  });
}
