import { Nullable } from "./types";
import { Request, Response } from "./net";

export enum AuthResult {
  SUCCESS,
  FAILURE,
  CANCELLED,
}

export enum AuthType {
  TOKEN,
  JWT,
  OAUTH2,
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
  validateAuth(site: Site): Promise<boolean>;

  /**
   * Begin's the auth flow for a particular site.
   * Returns true if auth resulted in valid credentials false otherwise.
   */
  startAuthFlow(site: Site): Promise<AuthResult>;
}

export interface HttpClient {
  send(_request: Request): Promise<Response>;
}

import { Post, Site } from "./models";
export interface ContentExtractor {
  extractHtml(site: Site): Promise<any>;
}

export enum SiteType {
  WORDPRESS,
  MEDIUM,
  LINKEDIN,
}

export abstract class SiteApi {
  config: any;
  constructor(config: any) {
    this.config = config || {};
  }

  abstract createPostRequest(post: Post, options: any): Request;
  abstract updatePostRequest(postid: String, options: any): Request;
  abstract getPostsRequest(options: any): Request;
  abstract removePostRequest(id: any): Request;
}

export class Store {
  keyprefix: string;
  constructor(keyprefix: string) {
    this.keyprefix = keyprefix;
  }

  normalizedKey(key: string): string {
    return this.keyprefix + ":" + key;
  }

  async get(_key: string) {
    return null as any;
  }
  async set(_key: string, _value: Nullable<any>) {
    return null as any;
  }
  async remove(_key: string) {
    return null as any;
  }
}
