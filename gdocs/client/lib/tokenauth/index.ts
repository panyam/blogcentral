import { App } from "../app";
import { Nullable } from "../types";
import { View } from "../ui/Views";
import { AuthManager, AuthClient, AuthConfig } from "../authclients";
import { TokenAuthConfig, TokenAuthClient } from "./client";
import { TokenAuthDetailView } from "./ui";
import { AUTH_TYPE_TOKEN } from "./core";

class TokenAuthManager extends AuthManager {
  /**
   * Creates the auth client given the right AuthConfig.
   */
  createAuthClient(config: TokenAuthConfig): AuthClient {
    return new TokenAuthClient(config);
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
    return new TokenAuthDetailView(elem_or_id).setup();
  }
}

export function registerApp(app: App) {
  app.authManagers[AUTH_TYPE_TOKEN] = new TokenAuthManager(app);
}
