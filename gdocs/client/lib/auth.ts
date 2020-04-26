
import { Int, Nullable, Undefined } from "./types"
import { Site, SiteService } from "./models";
import { SiteLoginDialog } from "./views";
declare var CLIENT_ENV : string;

export class SiteGateway {
    siteService : SiteService
    siteLoginDialog : SiteLoginDialog

    constructor(siteService : SiteService, siteLoginDialog : SiteLoginDialog) {
        var self = this;
        this.siteService = siteService;
        this.siteLoginDialog = siteLoginDialog;
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
        if (await this.validateToken(site)) {
            await this.siteService.saveSite(site);
            return site;
        }
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
            if (CLIENT_ENV == "gdocs") {
                var options = {
                  'method': 'post',
                  "contentType" : "application/json",
                  'payload': JSON.stringify(payload),
                  'muteHttpExceptions': false
                }
                return null;
            } else {
                try {
                    var response = await $.ajax({
                        "method": "POST",
                        "url": url,
                        "data": payload
                    });
                    this.siteLoginDialog.close();
                    return response.token;
                } catch (e) {
                    console.log("Received Exception: ", e);
                    var errorMessage = e.responseJSON.message;
                    self.siteLoginDialog.errorMessage = errorMessage;
                    credentials = await this.siteLoginDialog.open();
                }
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
        if (CLIENT_ENV == "gdocs") {
            var options = {
              'method': 'post',
              "contentType" : "application/json",
              "headers": headers,
              'muteHttpExceptions': false
            };
            return false;
        } else {
            try {
                var response = await $.ajax({
                    "method": "POST",
                    "url": url,
                    "headers": headers
                });
                site.config.tokenValidatedAt = Date.now();
                return true;
            } catch (e) {
                site.config.tokenValidatedAt = 0;
                console.log("Validation Exception: ", e);
                return false;
            }
        }
    }

    async getPosts(site : Site) {
        var result = await this.ensureLoggedIn(site);
        return []
    }
};
