import { App } from "../app";
import { Nullable } from "../types";
import { AuthConfig } from "../authclients";
import { TokenAuthClient } from "./client";
import { TokenAuthDetailView } from "./ui";

export const AUTH_TYPE_TOKEN = "AUTH_TYPE_TOKEN";

export function registerApp(app: App) {
  app.authViewFactories[AUTH_TYPE_TOKEN] = (
    _purpose: string,
    elem_or_id: any,
    _entity: Nullable<AuthConfig>
  ) => {
    return new TokenAuthDetailView(elem_or_id).setup();
  };

  app.authClientFactories[AUTH_TYPE_TOKEN] = (config: Nullable<AuthConfig>) => {
    return new TokenAuthClient(config);
  };
}
