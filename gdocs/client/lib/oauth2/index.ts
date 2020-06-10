import { App } from "../app";
import { Nullable } from "../types";
import { View } from "../ui/Views";
import { AuthManager, AuthClient, AuthConfig } from "../authclients";
import { OAuth2AuthConfig, OAuth2AuthClient } from "./client";
import { OAuth2AuthDetailView } from "./ui";

import { AUTH_TYPE_OAUTH2 } from "./core";

class OAuthAuthManager extends AuthManager {
  /**
   * Creates the auth client given the right AuthConfig.
   */
  createAuthClient(config: OAuth2AuthConfig): AuthClient {
    return new OAuth2AuthClient(config);
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
    return new OAuth2AuthDetailView(elem_or_id).setup();
  }
}

export function registerApp(app: App) {
  app.authManagers[AUTH_TYPE_OAUTH2] = new OAuthAuthManager(app);
}
