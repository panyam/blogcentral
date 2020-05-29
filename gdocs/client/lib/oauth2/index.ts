
import { App } from "../app";
import { Nullable } from "../types";
import { AuthConfig } from "../authclients";
import { OAuth2AuthClient } from "./client";
import { OAuth2AuthDetailView } from "./ui";

export const AUTH_TYPE_OAUTH2 = "AUTH_TYPE_OAUTH2";

export function registerApp(app: App) {
  app.authViewFactories[AUTH_TYPE_OAUTH2] = (
    _purpose: string,
    elem_or_id: any,
    _entity: Nullable<AuthConfig>
  ) => {
    return new OAuth2AuthDetailView(elem_or_id).setup();
  };

  app.authClientFactories[AUTH_TYPE_OAUTH2] = (config: Nullable<AuthConfig>) => {
    return new OAuth2AuthClient(config);
  };
}
