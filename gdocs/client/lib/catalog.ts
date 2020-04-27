
import { SiteService, PostService } from "./models";
import { Store } from "./stores";
import { HttpClient } from "./net";

export class ServiceCatalog {
    store : Store
    siteService : SiteService
    postService : PostService
    httpClient : HttpClient

    constructor(store : Store, httpClient : HttpClient) {
        this.store = store;
        this.httpClient = httpClient;
        this.siteService = new SiteService(store);
        this.postService = new PostService(store);
    }
}

