
import { App } from "../app";
import { Nullable } from "../types";
import { AuthConfig } from "../authclients";
import { LoginAuthClient } from "./client";
import { LoginAuthDetailView } from "./ui";

export const AUTH_TYPE_LOGIN = "AUTH_TYPE_LOGIN";

export function registerApp(app: App) {
  app.authViewFactories[AUTH_TYPE_LOGIN] = (
    _purpose: string,
    elem_or_id: any,
    _entity: Nullable<AuthConfig>
  ) => {
    return new LoginAuthDetailView(elem_or_id).setup();
  };

  app.authClientFactories[AUTH_TYPE_LOGIN] = (config: Nullable<AuthConfig>) => {
    return new LoginAuthClient(app.httpClient, config);
  };
}
