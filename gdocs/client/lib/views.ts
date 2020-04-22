
declare var Handlebars : any;
import { Int, Nullable } from "./types";
import { SiteType, Site, SiteList } from "./models";

export class Dialog {
    elemid : string
    onConfirm : any
    onCancel : any
    element : any
    dialog : any

    constructor(elemid : string) {
        this.elemid = elemid;
        this.onConfirm = null;
        this.onCancel = null;
        this.construct();
    }

    construct() {
    }

    confirmClicked(data : Nullable<any> = null) {
        if (this.onConfirm != null) {
            this.onConfirm(data);
        }
        this.close();
    }

    open() {
        this.dialog.dialog( "open" );
    }

    close() {
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

    construct() {
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
            buttons: {
                "Add Site": function() {
                    self.confirmClicked(self.site);
                },
                Cancel: function() {
                    self.close();
                }
            },
            close: function() {
                self.form[0].reset();
                self.allFields.removeClass( "ui-state-error" );
            }
        });

        this.form = this.dialog.find( "form" ).on( "submit", function( event : any) {
            event.preventDefault();
            this.addUser();
        });

        this.dialog.find("#site_type").selectmenu();
        return this;
    }
}

export class SiteListView {
    elemid : string
    element : any
    siteList : SiteList

    constructor(elemid : string, siteList : SiteList) {
        this.elemid = elemid;
        this.siteList = siteList;
        this.element = $("#" + this.elemid);
        this.refresh();
    }

    get template() : string {
        return `
            {{# each siteList.sites }}
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
        var siteListTemplate = Handlebars.compile(this.template);
        var html = siteListTemplate({
            "siteList" : this.siteList
        });
        this.element.html(html);
        var connect_buttons = this.element.find(".site_connect_button");
        var delete_buttons = this.element.find(".site_delete_button");
        connect_buttons.on( "click", function( event : any) {
            console.log("connect button clicked: ", event);
        });
        delete_buttons.on( "click", function( event : any) {
            var index = parseInt(event.currentTarget.id.substring("delete_site_".length));
            console.log("Removing Site at: ", index);
            self.siteList.removeAt(index);
            self.refresh();
        });
    }
}
