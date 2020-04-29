
import { Site } from "./models";
import { Request } from "./net";
import { ServiceCatalog } from "./catalog";

export class SiteGateway {
    services : ServiceCatalog

    constructor(services : ServiceCatalog) {
        this.services = services;
    }

    async ensureLoggedIn(site : Site) {
        var siteToken = site.config.token || null;
        if (siteToken == null) {
            var loginProvider = this.services.siteLoginProvider;
            var credentials : any = await loginProvider.startLogin(site);
            while (credentials != null) {
                try {
                    site.config.token = await this.loginToWordpress(site, credentials);
                    loginProvider.cancelLogin();
                    if (site.config.token == null) {
                        // cancelled
                        return null;
                    } else {
                        site.config.tokenTimestamp = Date.now();
                        return site;
                    }
                } catch (e) {
                    console.log("Received Exception: ", e);
                    loginProvider.loginFailed(e, e.responseJSON.message);
                    credentials = await loginProvider.startLogin(site);
                }
            }
        }

        // validate token
        var validated = await this.validateToken(site);
        if (!validated) {
            return null;
        }

        await this.services.siteService.saveSite(site);
        return site;
    }

    async loginToWordpress(site : Site, credentials : any) {
        var self = this;
        var httpClient = this.services.httpClient;
        var payload = {
            username: site.username,
            password: credentials.password
        };
        var apiHost = site.site_host + '/wp-json';
        var url = apiHost + '/jwt-auth/v1/token';
        var request = new Request(url, {
            "method": "post",
            "contentType" : "application/json",
            "body": payload
        });
        var response = await httpClient.send(request);
        return response.data;
    }

    async validateToken(site : Site) {
        var apiHost = site.site_host + '/wp-json';
        var url = apiHost + '/jwt-auth/v1/token/validate';

        // see if we have a valid token
        var headers = {
            "Authorization" : "Bearer " + site.config.token
        };
        var request = new Request(url, {
            "method": "post",
            "contentType" : "application/json",
            "headers": headers
        });
        try {
            var httpClient = this.services.httpClient;
            var response = await httpClient.send(request);
            site.config.tokenValidatedAt = Date.now();
            return true;
        } catch (e) {
            site.config.tokenValidatedAt = 0;
            console.log("Validation Exception: ", e);
            return false;
        }
    }

    async getPosts(site : Site) {
        var httpClient = this.services.httpClient;
        var result = await this.ensureLoggedIn(site);
        var apiHost = site.site_host + '/wp-json';
        var url = apiHost + '/wp/v2/posts/';
        var headers = {
            "Authorization" : "Bearer " + site.config.token
        };
        var request = new Request(url, { "headers": headers });
        try {
            var response = await httpClient.send(request);
            return response.data;
        } catch (e) {
            console.log("Get Posts Exception: ", e);
            throw e;
        }
    }
};
