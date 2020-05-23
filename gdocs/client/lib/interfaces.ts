
import { Nullable } from "./types"
import { Request, Response } from "./net";

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
}

export interface HttpClient {
    send(_request : Request) : Promise<Response>
}

import { Post, Site } from "./sites";
export interface ContentExtractor {
  extractHtml(site: Site): Promise<any>;
}

export enum SiteType {
  WORDPRESS,
  MEDIUM,
  LINKEDIN,
}

export abstract class SiteApi {
  name: string;
  config: any;
  constructor(name: string, config: any) {
    this.name = name;
    this.config = config || {};
  }

  abstract createPostRequest(post: Post, options: any): Request;
  abstract updatePostRequest(postid: String, options: any): Request;
  abstract getPostsRequest(options: any): Request;
  abstract removePostRequest(id: any): Request;
}

export class Store {
    keyprefix : string
    constructor(keyprefix : string) {
        this.keyprefix = keyprefix
    }

    normalizedKey(key : string) : string {
        return this.keyprefix + ":" + key;
    }

    async get(_key : string) { return null as any; } 
    async set(_key : string, _value : Nullable<any>) { return null as any; }
    async remove(_key : string) { return null as any; }
};

