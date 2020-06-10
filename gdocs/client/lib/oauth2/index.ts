import { App } from "../app";
import { Nullable } from "../types";
import { AuthConfig } from "../authclients";
import { OAuth2AuthConfig, OAuth2AuthClient } from "./client";
import { OAuth2AuthDetailView } from "./ui";

import { AUTH_TYPE_OAUTH2 } from "./core";

export function registerApp(app: App) {
  app.authViewFactories[AUTH_TYPE_OAUTH2] = (
    app : App,
    _purpose: string,
    elem_or_id: any,
    _entity: Nullable<AuthConfig>
  ) => {
    return new OAuth2AuthDetailView(elem_or_id).setup();
  };

  app.authClientFactories[AUTH_TYPE_OAUTH2] = (config: OAuth2AuthConfig) => {
    return new OAuth2AuthClient(config);
  };
}
