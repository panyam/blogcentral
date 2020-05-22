
import { Store } from "./stores";
import { HttpClient } from "./net";
import { SiteService, Site } from "./sites";
import { ContentExtractor } from "./extractors";

export interface SiteLoginProvider {
  ensureLoggedIn(site: Site) : Promise<boolean>
}

export class ServiceCatalog {
    store : Store
    siteService : SiteService
    httpClient : HttpClient
    contentExtractor : ContentExtractor
    siteLoginProvider : SiteLoginProvider

    constructor(store : Store, httpClient : HttpClient) {
        this.store = store;
        this.httpClient = httpClient;
        this.siteService = new SiteService(store);
    }
}

