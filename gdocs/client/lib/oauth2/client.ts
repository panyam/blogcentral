import { AuthConfig, AuthResult, AuthClient } from "../authclients";
import { Request } from "../net";
import { ensureParam } from "../utils";

export class OAuth2AuthClient implements AuthClient {
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
  requestTokenUrl: string;
  authorizeUrl: string;
  authenticateUrl: string;

  constructor(config: AuthConfig) {
    this.clientId = ensureParam(config, "clientId");
    this.clientSecret = ensureParam(config, "clientSecret");
    this.requestTokenUrl = ensureParam(config, "requestTokenUrl");
    this.redirectUrl = ensureParam(config, "redirectUrl");
    this.authorizeUrl = ensureParam(config, "authorizeUrl");
    this.authenticateUrl = ensureParam(config, "authenticateUrl");
  }

  decorateRequest(request: Request): Request {
    return request;
  }

  /**
   * Checks if auth credentials are valid asynchronously.
   * Returns true if auth credentials are valid and requests can
   * be signed with respective credentials going forward.
   */
  async validateAuth() {
    // throw new Error("Not Implemented");
    return false;
  }

  /**
   * Begin's the auth flow
   * Returns true if auth resulted in valid credentials false otherwise.
   */
  async startAuthFlow() {
    // throw new Error("Not Implemented");
    return AuthResult.CANCELLED;
  }
}
