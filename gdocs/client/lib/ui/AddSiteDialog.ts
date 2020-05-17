
import { Dialog } from "./Dialog"
import { SiteType, Site } from "../models";

export class AddSiteDialog extends Dialog {
    rootElement : any
    siteTypeElem : JQuery<HTMLElement>
    siteHostElem : JQuery<HTMLElement>
    usernameElem : JQuery<HTMLElement>
    allFields : JQuery<any>
    dialog : any
    form : any

    get site() : Site {
        // var siteType : string = this.siteTypeElem.val() as string;
        var username : string = this.usernameElem.val() as string;
        var siteHost : string = this.siteHostElem.val() as string;
        return new Site(SiteType.WORDPRESS, siteHost, username);
    }

    get template() : string {
        return `
          <form>
            <fieldset class = "dialog_fields">
              <label for="site_type">Site Type</label>
              <select id = "site_type">
                <option>WordPress Blog</option>
              </select>

              <label for="site_host">Site Host</label>
              <input type="url" name="site_host" id="site_host" class="text ui-widget-content ui-corner-all">

              <label for="site_username">Username</label>
              <input type="url" name="site_username" id="site_username" value="" class="text ui-widget-content ui-corner-all">

              <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
            </fieldset>
          </form>
        `
    }

    buttons() : any {
        var self = this;
        return {
            "Add Site": function() {
                self.close(self.site);
            },
            Cancel: function() { self.close(null); }
        };
    }

    setupViews() {
        var self = this;
        this.rootElement.html(this.template);
        this.siteTypeElem = this.rootElement.find("select");
        this.siteHostElem  = this.rootElement.find("#site_host");
        this.usernameElem  = this.rootElement.find("#site_username");
        this.allFields = $( [] )
                         .add( this.siteTypeElem )
                         .add( this.siteHostElem )
                         .add( this.usernameElem );
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

        this.dialog.find("#site_type").selectmenu();
        return this;
    }
}
