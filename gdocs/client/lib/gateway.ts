
import { Int, Nullable, Undefined } from "./types"
import { Site, SiteService } from "./models";
import { SiteLoginDialog } from "./views";
import { Request, Response, HttpClient } from "./net";

export class SiteGateway {
    siteService : SiteService
    siteLoginDialog : SiteLoginDialog
    httpClient : HttpClient

    constructor(siteService : SiteService, siteLoginDialog : SiteLoginDialog, httpClient : HttpClient) {
        this.siteService = siteService;
        this.siteLoginDialog = siteLoginDialog;
        this.httpClient = httpClient
    }

    async ensureLoggedIn(site : Site) {
        var siteToken = site.config.token || null;
        if (siteToken == null) {
            site.config.token = await this.loginToWordpress(site);
            if (site.config.token == null) {
                return null;
            }
            site.config.tokenTimestamp = Date.now();
        }

        // validate token
        var validated = await this.validateToken(site);
        if (!validated) {
            return null;
        }

        await this.siteService.saveSite(site);
        return site;
    }

    async loginToWordpress(site : Site) {
        var self = this;
        this.siteLoginDialog.site = site;
        var credentials : any = await this.siteLoginDialog.open();
        while (credentials != null) {
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
            try {
                var response = await this.httpClient.send(request);
                this.siteLoginDialog.close();
                return response.data;
            } catch (e) {
                console.log("Received Exception: ", e);
                var errorMessage = e.responseJSON.message;
                self.siteLoginDialog.errorMessage = errorMessage;
                credentials = await this.siteLoginDialog.open();
            }
        }
        return null;
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
            var response = await this.httpClient.send(request);
            site.config.tokenValidatedAt = Date.now();
            return true;
        } catch (e) {
            site.config.tokenValidatedAt = 0;
            console.log("Validation Exception: ", e);
            return false;
        }
    }

    async getPosts(site : Site) {
        var result = await this.ensureLoggedIn(site);
        var apiHost = site.site_host + '/wp-json';
        var url = apiHost + '/wp/v2/posts/';
        var headers = {
            "Authorization" : "Bearer " + site.config.token
        };
        var request = new Request(url, { "headers": headers });
        try {
            var response = await this.httpClient.send(request);
            return response.data;
        } catch (e) {
            console.log("Get Posts Exception: ", e);
            throw e;
        }
    }
};
