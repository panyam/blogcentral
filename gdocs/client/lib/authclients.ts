import { Request } from "./net";

export enum AuthResult {
  SUCCESS,
  FAILURE,
  CANCELLED,
}

export type AuthType = string;

export interface AuthConfig {
  authType: AuthType;
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
}
