
import { Store } from "./stores";
import { HttpClient } from "./net";
import { ContentExtractor } from "./extractors";

export class ServiceCatalog {
    store : Store
    siteService : SiteService
    httpClient : HttpClient
    contentExtractor : ContentExtractor

    constructor(store : Store, httpClient : HttpClient) {
        this.store = store;
        this.httpClient = httpClient;
        this.siteService = new SiteService(store);
    }
}

