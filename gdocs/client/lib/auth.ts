
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
            var _ = await this.loginToWordpress(site);
            // validate it
        } else {
            // login
        }
        return site;
    }

    async loginToWordpress(site : Site) {
        var self = this;
        this.siteLoginDialog.site = site;
        var credentials : any = await this.siteLoginDialog.open();
        if (credentials == null) {
            return null;
        }
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
        } else {
            $.ajax({
                "method": "POST",
                "url": url,
                "data": payload
            }).done(function(response) {
                console.log("Received Payload: ",response);
            });
        }

        return null;
    }

    async getPosts(site : Site) {
        site = await this.ensureLoggedIn(site);
        return []
    }
};
