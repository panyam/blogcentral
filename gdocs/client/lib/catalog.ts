
import { SiteService } from "./models";
import { SiteGateway } from "./gateway";
import { Store } from "./stores";
import { HttpClient } from "./net";
import { SiteLoginProvider } from "./auth";
import { ContentPublisher } from "./publishers";

export class ServiceCatalog {
    store : Store
    siteService : SiteService
    httpClient : HttpClient
    siteLoginProvider : SiteLoginProvider
    siteGateway : SiteGateway
    contentPublisher : ContentPublisher

    constructor(store : Store, httpClient : HttpClient) {
        this.store = store;
        this.httpClient = httpClient;
        this.siteService = new SiteService(store);
    }
}

