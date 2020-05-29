import { App } from "../app";
import { Nullable } from "../types";
import { AuthConfig } from "../authclients";
import { TokenAuthConfig, TokenAuthClient } from "./client";
import { TokenAuthDetailView } from "./ui";
import { AUTH_TYPE_TOKEN } from "./core";

export function registerApp(app: App) {
  app.authViewFactories[AUTH_TYPE_TOKEN] = (
    _purpose: string,
    elem_or_id: any,
    _entity: Nullable<AuthConfig>
  ) => {
    return new TokenAuthDetailView(elem_or_id).setup();
  };

  app.authClientFactories[AUTH_TYPE_TOKEN] = (config: TokenAuthConfig) => {
    return new TokenAuthClient(config);
  };
}
