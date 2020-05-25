
import {Site} from "./models"
import { SiteType, AuthType } from "./interfaces";
import { JWTAuthClient } from "./authclients";
import { WPRestApi } from "./siteapis";

export function defaultSite(): Site {
return new Site("My Amazing Site", {
  siteType: SiteType.WORDPRESS,
  siteConfig: WPRestApi.defaultConfig(),
  authType: AuthType.JWT,
  authConfig: JWTAuthClient.defaultConfig(),
});
}
