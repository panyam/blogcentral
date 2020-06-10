import { App } from "../app";
import { Nullable } from "../types";
import { LoginAuthConfig, LoginAuthClient } from "./client";
import { LoginAuthDetailView } from "./ui";
import { AUTH_TYPE_LOGIN } from "./core";

export function registerApp(app: App) {
  app.authViewFactories[AUTH_TYPE_LOGIN] = (
    _app : App,
    _purpose: string,
    elem_or_id: any,
    _entity: Nullable<LoginAuthConfig>
  ) => {
    return new LoginAuthDetailView(elem_or_id).setup();
  };

  app.authClientFactories[AUTH_TYPE_LOGIN] = (config: LoginAuthConfig) => {
    return new LoginAuthClient(app.httpClient, config);
  };
}
