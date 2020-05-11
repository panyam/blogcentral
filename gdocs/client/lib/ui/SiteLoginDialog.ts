
import { Dialog } from "./Dialog";
import { SiteLoginProvider } from "../auth";
import { Nullable } from "../types";
import { Site } from "../models";
import { ServiceCatalog } from "../catalog";

const TOKEN_VALIDATION_FREQUENCY = 600000;

export class SiteLoginDialog extends Dialog implements SiteLoginProvider {
    rootElement : any
    usernameElem : JQuery<HTMLElement>
    passwordElem : JQuery<HTMLElement>
    errorMessageElem : JQuery<HTMLElement>
    allFields : JQuery<any>
    dialog : any
    form : any
    _site : Nullable<Site> = null;
    services : ServiceCatalog

    constructor(elem_or_id : any, services : ServiceCatalog) {
        super(elem_or_id);
        this.services = services;
    }

    get site() : Nullable<Site> {
        return this._site;
    }

    set site(s : Nullable<Site>) {
        this._site = s;
        if (s != null) {
            this.usernameElem.val(s.username);
        }
    }

    get credentials() : any {
        // var siteType : string = this.siteTypeElem.val() as string;
        var username : string = this.usernameElem.val() as string;
        var password : string = this.passwordElem.val() as string;
        return {
            'username': username,
            'password': password
        }
    }

    get errorMessage() : string {
        return this.errorMessageElem.html();
    }

    set errorMessage(html : string) {
        this.errorMessageElem.html(html);
    }

    get template() : string {
        return `
          <form>
            <fieldset class = "dialog_fields">
              <label for="site_username">Username</label>
              <input type="text" name="site_username" id="site_username" value="username" class="text ui-widget-content ui-corner-all">

              <label for="site_password">Password</label>
              <input type="password" name="site_password" 
                     id="site_password" 
                     value=""
                     class="text ui-widget-content ui-corner-all">


              <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
              <span id = "error_message_span"></span>
            </fieldset>
          </form>
        `
    }

    buttons() : any {
        var self = this;
        return {
            "Login": function() {
                self.errorMessageElem.html("");
                if (self.resolveFunc != null) {
                    self.resolveFunc(self.credentials);
                }
            },
            Cancel: function() { self.close(null); }
        };
    }

    setupViews() {
        var self = this;
        this.rootElement.html(this.template);
        this.usernameElem  = this.rootElement.find("#site_username");
        this.passwordElem  = this.rootElement.find("#site_password");
        this.errorMessageElem = this.rootElement.find("#error_message_span");
        this.allFields = $( [] )
                         .add( this.usernameElem )
                         .add( this.passwordElem );
        this.dialog = this.rootElement.dialog({
            autoOpen: false,
            position: { "my": "center top", "at": "center top", "of": window },
            modal: true,
            close: function() {
                self.form[0].reset();
                self.allFields.removeClass( "ui-state-error" );
            }
        });

        this.form = this.dialog.find( "form" ).on( "submit", function( event : any) {
            event.preventDefault();
        });

        return this;
    }

    /** LoginProvider interface */
    async ensureLoggedIn(site : Site) {
        var gateway = this.services.siteGateway;
        while (true) {
            site.config.token = site.config.token || null;
            if (site.config.token == null) {
                this.site = site;
                var credentials : any = await this.open();
                if (credentials == null) return false;
                try {
                    site.config.token = await gateway.loginToWordpress(site, credentials);
                    this.close();
                    if (site.config.token == null) {
                        // cancelled
                        return false;
                    } else {
                        site.config.tokenTimestamp = Date.now();
                        // Save what we have so far
                        await this.services.siteService.saveSite(site);
                    }
                } catch (e) {
                    console.log("Received Exception: ", e);
                    var resjson = e.responseJSON || {};
                    var message = resjson.message || e.statusText;
                    this.errorMessage = message;
                }
            }

            if (site.config.token != null) {
                // validate token if too old needed
                var validatedDelta = Date.now() - (site.config.tokenValidatedAt || 0);
                if (validatedDelta > TOKEN_VALIDATION_FREQUENCY) {
                    var validated = await gateway.validateToken(site);
                    if (validated) {
                        await this.services.siteService.saveSite(site);
                        return true;
                    } else {
                        // validation failed - may be token is invalid
                        site.config.token = null;
                    }
                } else {
                    return true;
                }
            }
        }
        return true;
    }
}
