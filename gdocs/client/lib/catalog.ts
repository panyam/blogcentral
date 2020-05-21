
import { SiteService } from "./models";
import { SiteGateway } from "./gateway";
import { Store } from "./stores";
import { HttpClient } from "./net";
import { ContentExtractor } from "./extractors";

export class ServiceCatalog {
    store : Store
    siteService : SiteService
    httpClient : HttpClient
    siteGateway : SiteGateway
    contentExtractor : ContentExtractor

    constructor(store : Store, httpClient : HttpClient) {
        this.store = store;
        this.httpClient = httpClient;
        this.siteService = new SiteService(store);
    }
}

