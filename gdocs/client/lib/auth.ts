
import { Nullable } from "./types"
import { Request, URLBuilder, HttpClient } from "./net";

export interface Authenticator {
    ensureLoggedIn() : Promise<boolean>;
}

export class OAuthenticator implements Authenticator {
  httpClient: HttpClient;
  clientId: string;
  clientSecret: string;
  requestTokenUrl: string;
  authorizeUrl: string;
  authenticateUrl: string;

  constructor(
    httpClient: HttpClient,
    clientId: string,
    clientSecret: string,
    requestTokenUrl: string,
    authorizeUrl: string,
    authenticateUrl: string
  ) {
    this.httpClient = httpClient;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.requestTokenUrl = requestTokenUrl;
    this.authorizeUrl = authorizeUrl;
    this.authenticateUrl = authenticateUrl;
  }

  async ensureLoggedIn() { return false; }
}

export class JWTAuthenticator implements Authenticator {
  httpClient: HttpClient;
  baseUrl: string;
  tokenPath: string;
  validatePath: string;
  token: Nullable<string> = null;
  tokenValidatedAt : Nullable<number> = null;

  constructor(
    httpClient: HttpClient,
    baseUrl: string,
    tokenPath: string = "wp-json/jwt-auth/v1/token/",
    validatePath: string = "wp-json/jwt-auth/v1/token/validate"
  ) {
    this.httpClient = httpClient;
    this.baseUrl = baseUrl;
    this.tokenPath = tokenPath;
    this.validatePath = validatePath;
  }

  newRequest(method: string, path: string, payload: any = null): Request {
    var url = new URLBuilder(this.baseUrl).appendPath(path).build();
    // see if we have a valid token
    var headers: any = {};
    if (this.token) {
      headers["Authorization"] = "Bearer " + this.token;
    }
    var request = new Request(url, {
      method: method,
      contentType: "application/json",
      headers: headers,
    });
    if (payload) {
      request.body = payload;
    }
    return request;
  }

  async ensureLoggedIn() { return false; }

  async login(username: string, password: string) {
    var payload = {
      username: username,
      password: password,
    };
    var request = this.newRequest("post", this.tokenPath, payload);
    var response = await this.httpClient.send(request);
    return response.data.token;
  }

  async validateToken() {
    var request = this.newRequest("post", this.validatePath);
    return await this.httpClient.send(request);
  }
}
