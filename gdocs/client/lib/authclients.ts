import { App } from "./app";
import { Nullable } from "./types"
import { Request } from "./net";
import { View } from "./ui/Views";

export enum AuthResult {
  SUCCESS,
  FAILURE,
  CANCELLED,
}

export type AuthType = string;

export interface AuthConfig {
  authType: AuthType;
}

export abstract class AuthManager {
  app: App;
  constructor(app : App) {
      this.app = app
  }

  /**
   * Creates the auth client given the right AuthConfig.
   */
  abstract createAuthClient(entity: AuthConfig) : AuthClient;

  /**
   * Called to create a new view for a given purpose specific to this
   * auth type
   */
  abstract createAuthView(
    purpose: string,
    elem_or_id: any,
    entity: Nullable<AuthConfig>
    ) : View<AuthConfig>;
}

export interface AuthClient {
  /**
   * Creates a request decorated with all auth details.
   */
  decorateRequest(request: Request): Request;

  /**
   * Checks if a site's auth credentials are valid asynchronously.
   * Returns true if site's auth credentials are valid and requests can
   * be signed with respective credentials going forward.
   */
  validateAuth(): Promise<boolean>;

  /**
   * Begin's the auth flow for a particular site.
   * Returns true if auth resulted in valid credentials false otherwise.
   */
  startAuthFlow(): Promise<AuthResult>;

  /**
   * Completes the auth flow with finalized auth results.
   */
  completeAuthFlow(authResult : any) : boolean
}
