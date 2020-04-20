
// import "jquery-ui/ui/widgets/dialog";
// import "webpack-jquery-ui/css";

// import { SiteType } from "./models";

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

    confirmClicked() {
        if (this.onConfirm != null) {
            this.onConfirm();
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

    get template() : string {
        return `
          <form>
            <fieldset class = "dialog_fields">
              <label for="site_type">Site Type</label>
              <select id = "site_type" class = "ui-widget-content ui-corner-all">
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
            modal: true,
            buttons: {
                "Add Site": function() { self.confirmClicked(); },
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
        return this;
    }
}

export class SiteListView {
    divid : string
    constructor(divid : string) {
        this.divid = divid;
    }
}
