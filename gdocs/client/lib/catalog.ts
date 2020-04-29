
import { SiteService, PostService } from "./models";
import { SiteGateway } from "./gateway";
import { Store } from "./stores";
import { HttpClient } from "./net";
import { SiteLoginProvider } from "./auth";

export class ServiceCatalog {
    store : Store
    siteService : SiteService
    postService : PostService
    httpClient : HttpClient
    siteLoginProvider : SiteLoginProvider
    siteGateway : SiteGateway

    constructor(store : Store, httpClient : HttpClient) {
        this.store = store;
        this.httpClient = httpClient;
        this.siteService = new SiteService(store);
        this.postService = new PostService(store);
    }
}

