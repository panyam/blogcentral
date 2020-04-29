
declare var Handlebars : any;
import { Dialog } from "./Dialog";
import { ensureElement } from "../utils";
import { Int, Nullable } from "../types";
import { SiteType, Site, Post } from "../models";
import { ServiceCatalog } from "../catalog";

export class SiteLoginDialog extends Dialog {
    rootElement : any
    usernameElem : JQuery<HTMLElement>
    passwordElem : JQuery<HTMLElement>
    errorMessageElem : JQuery<HTMLElement>
    allFields : JQuery<any>
    dialog : any
    form : any
    _site : Nullable<Site> = null;

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
              <input type="password" name="site_password" id="site_password" class="text ui-widget-content ui-corner-all">


              <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
              <span id = "error_message_span"></span>
            </fieldset>
          </form>
        `
    }

    buttons() {
        var self = this;
        return {
            "Login": function() {
                self.errorMessageElem.html("");
                if (this.resolveFunc != null) {
                    this.resolveFunc(self.credentials);
                }
            },
            Cancel: function() {
                self.close(null);
            }
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
}
