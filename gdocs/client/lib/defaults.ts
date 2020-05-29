import { Site } from "./models";
import { JWTAuthClient } from "./authclients";
import { PublicWPRestApi } from "./siteapis";
import { SiteType, AuthType } from "./enums";

declare var BCDefaults: any;

export function defaultSite(): Site {
  return new Site(BCDefaults.PublicWPRestApi.Title, {
    siteType: SiteType.PUBLIC_WORDPRESS,
    siteConfig: PublicWPRestApi.defaultConfig(),
    authType: AuthType.JWT,
    authConfig: JWTAuthClient.defaultConfig(),
  });
}
