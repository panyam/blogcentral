
declare var Handlebars : any;
import { Nullable } from "./types";
import { SiteType, Site, SiteService } from "./models";

export class Dialog {
    elemid : string
    element : any
    dialog : any
    promise : Promise<any>

    constructor(elemid : string) {
        this.elemid = elemid;
        this.setupViews();
    }

    setupViews() {
    }

    async open() {
        var self = this;
        return new Promise((resolve, reject) => {
            this.dialog
                .dialog( "option", "buttons", self.buttons(resolve, reject))
                .dialog( "open" );
        });
    }

    buttons(resolve : any, reject : any) {
        var self = this;
        return {
            Cancel: function() {
                self.close(null, resolve, reject);
            }
        };
    }

    close(data : Nullable<any> = null, resolve : any = null, reject : any = null) {
        if (resolve != null) {
            resolve(data);
        }
        this.dialog.dialog( "close" );
    }
}

export class AddSiteDialog extends Dialog {
    element : any
    siteTypeElem : JQuery<HTMLElement>
    siteHostElem : JQuery<HTMLElement>
    usernameElem : JQuery<HTMLElement>
    allFields : JQuery<any>
    dialog : any
    form : any

    constructor(elemid : string) {
        super(elemid);
    }

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
              <input type="url" name="site_host" id="site_host" value="https://leetcoach.com/" class="text ui-widget-content ui-corner-all">

              <label for="site_username">Username</label>
              <input type="url" name="site_username" id="site_username" value="panyam" class="text ui-widget-content ui-corner-all">

              <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
            </fieldset>
          </form>
        `
    }

    buttons(resolve : any, reject : any) {
        var self = this;
        return {
            "Add Site": function() {
                self.close(self.site, resolve, reject);
            },
            Cancel: function() {
                self.close(null, resolve, reject);
            }
        };
    }

    setupViews() {
        var self = this;
        this.element = $("#" + this.elemid);
        this.element.html(this.template);
        this.siteTypeElem = this.element.find("select");
        this.siteHostElem  = this.element.find("#site_host");
        this.usernameElem  = this.element.find("#site_username");
        this.allFields = $( [] )
                         .add( this.siteTypeElem )
                         .add( this.siteHostElem )
                         .add( this.usernameElem );
        this.dialog = this.element.dialog({
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

export class SiteLoginDialog extends Dialog {
    element : any
    usernameElem : JQuery<HTMLElement>
    passwordElem : JQuery<HTMLElement>
    allFields : JQuery<any>
    dialog : any
    form : any
    _site : Nullable<Site> = null;

    constructor(elemid : string) {
        super(elemid);
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

    get template() : string {
        return `
          <form>
            <fieldset class = "dialog_fields">
              <label for="site_username">Username</label>
              <input type="text" name="site_username" id="site_username" value="panyam" class="text ui-widget-content ui-corner-all">

              <label for="site_password">Password</label>
              <input type="password" name="site_password" id="site_password" value="panyam" class="text ui-widget-content ui-corner-all">


              <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
            </fieldset>
          </form>
        `
    }

    buttons(resolve : any, reject : any) {
        var self = this;
        return {
            "Login": function() {
                self.close(self.credentials, resolve, reject);
            },
            Cancel: function() {
                self.close(null, resolve, reject);
            }
        };
    }

    setupViews() {
        var self = this;
        this.element = $("#" + this.elemid);
        this.element.html(this.template);
        this.usernameElem  = this.element.find("#site_username");
        this.passwordElem  = this.element.find("#site_password");
        this.allFields = $( [] )
                         .add( this.usernameElem )
                         .add( this.passwordElem );
        this.dialog = this.element.dialog({
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


export class SiteListView {
    elemid : string
    element : any
    siteService : SiteService
    onConnectSite : any

    constructor(elemid : string, siteService : SiteService) {
        this.elemid = elemid;
        this.siteService = siteService;
        this.element = $("#" + this.elemid);
        this.onConnectSite = null;
        this.refresh();
    }

    get template() : string {
        return `
            {{# each siteService.sites }}
            <table class = "site_table"
                   id = "site_table_{{@index}}" >
                <tr>
                    <td class = "site_param_name"> Site Host: </td>
                    <td> {{this.site_host}} </td>
                </tr>
                <tr>
                    <td class = "site_param_name"> Username: </td>
                    <td> {{this.username}} </td>
                </tr>
                <tr>
                    <td colspan = 2>
                        <center>
                            <button class = "site_connect_button"
                                    id = "connect_site_{{@index}}">Connect</button>
                            <button class = "site_delete_button"
                                    id = "delete_site_{{@index}}">Delete</button>
                        </center>
                    </td>
                </tr>
            </table>
            <hr/>
            {{/each}}
        `
    }

    refresh() {
        var self = this;
        var siteServiceTemplate = Handlebars.compile(this.template);
        var html = siteServiceTemplate({
            "siteService" : this.siteService
        });
        this.element.html(html);
        var connect_buttons = this.element.find(".site_connect_button");
        var delete_buttons = this.element.find(".site_delete_button");
        connect_buttons.on( "click", function( event : any) {
            var index = parseInt(event.currentTarget.id.substring("connect_site_".length));
            var site = self.siteService.siteAt(index);
            if (self.onConnectSite != null) {
                self.onConnectSite(site);
            }
        });
        delete_buttons.on( "click", function( event : any) {
            var index = parseInt(event.currentTarget.id.substring("delete_site_".length));
            console.log("Removing Site at: ", index);
            self.siteService.removeAt(index).then(() => self.refresh());
        });
    }
}
