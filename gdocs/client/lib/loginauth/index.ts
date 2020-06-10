import { App } from "../app";
import { Nullable } from "../types";
import { View } from "../ui/Views";
import { AuthManager, AuthClient, AuthConfig } from "../authclients";
import { LoginAuthConfig, LoginAuthClient } from "./client";
import { LoginAuthDetailView } from "./ui";
import { AUTH_TYPE_LOGIN } from "./core";

class LoginAuthManager extends AuthManager {
  /**
   * Creates the auth client given the right AuthConfig.
   */
  createAuthClient(config: LoginAuthConfig): AuthClient {
    return new LoginAuthClient(this.app.httpClient, config);
  }

  /**
   * Called to create a new view for a given purpose specific to this
   * auth type
   */
  createAuthView(
    _purpose: string,
    elem_or_id: any,
    _entity: Nullable<AuthConfig>
  ): View<AuthConfig> {
    return new LoginAuthDetailView(elem_or_id).setup();
  }
}

export function registerApp(app: App) {
  app.authManagers[AUTH_TYPE_LOGIN] = new LoginAuthManager(app);
}
