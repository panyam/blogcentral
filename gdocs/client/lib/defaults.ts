import { Site } from "./models";
import { JWTAuthClient } from "./authclients";
import { WPRestApi } from "./siteapis";
import { SiteType, AuthType } from "./enums";

export function defaultSite(): Site {
  return new Site("My Amazing Site", {
    siteType: SiteType.WORDPRESS,
    siteConfig: WPRestApi.defaultConfig(),
    authType: AuthType.JWT,
    authConfig: JWTAuthClient.defaultConfig(),
  });
}
