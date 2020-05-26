import { Site } from "./models";
import { JWTAuthClient } from "./authclients";
import { WPRestApi } from "./siteapis";
import { SiteType, AuthType } from "./enums";

declare var BCDefaults: any;

export function defaultSite(): Site {
  return new Site(BCDefaults.WPRestApi.Title, {
    siteType: SiteType.WORDPRESS,
    siteConfig: WPRestApi.defaultConfig(),
    authType: AuthType.JWT,
    authConfig: JWTAuthClient.defaultConfig(),
  });
}
