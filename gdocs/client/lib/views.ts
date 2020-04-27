
declare var Handlebars : any;
import { ensureElement } from "./utils";
import { Int, Nullable } from "./types";
import { SiteType, Site, Post } from "./models";
import { ServiceCatalog } from "./catalog";

export class Dialog {
    rootElement : any
    dialog : any
    promise : Promise<any>

    constructor(elem_or_id : any) {
        this.rootElement = ensureElement(elem_or_id);
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

    buttons(resolve : any, reject : any) {
        var self = this;
        return {
            "Login": function() {
                self.errorMessageElem.html("");
                if (resolve != null) {
                    resolve(self.credentials);
                }
            },
            Cancel: function() {
                self.close(null, resolve, reject);
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

export class SitesPanel {
    rootElement : any
    addSiteDialog : AddSiteDialog
    addButton : any
    siteListView : SiteListView
    services : ServiceCatalog

    constructor(elem_or_id : string, services : ServiceCatalog) {
        this.rootElement = ensureElement(elem_or_id);
        this.services = services
        this.setupViews();
    }

    setupViews() {
        var self = this;
        var addSiteDialogElem : any = ensureElement("add_site_dialog", this.rootElement);
        if (addSiteDialogElem.length == 0) {
            addSiteDialogElem = $("<div id='add_site_dialog'></div>");
            this.rootElement.append(addSiteDialogElem);
        }

        this.addSiteDialog = new AddSiteDialog(addSiteDialogElem);

        var siteListDiv = this.rootElement.find("#site_list_div");
        this.siteListView = new SiteListView(siteListDiv, this.services);

        this.addButton = this.rootElement.find("#add_button");
        this.addButton.button().on("click", function() {
            self.addSiteDialog.open()
                .then((site : Site) => {
                    self.services.siteService.addSite(site as Site).then(() => {
                        self.siteListView.refresh();
                    });
                });
        });

        this.services.siteService.loadAll().then(() => {
            self.siteListView.refresh();
        });
    }
};

export class SiteListView {
    rootElement : any
    services : ServiceCatalog
    onConnectSite : any

    constructor(elem_or_id : any, services : ServiceCatalog) {
        this.rootElement = ensureElement(elem_or_id);
        this.services = services;
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
                        <center>
                            <div class = "progressbar"
                                 id="progressbar_{{@index}}"></div>
                        </center>
                    </td>
                </tr>
            </table>
            <hr/>
            {{/each}}
        `
    }

    setConnecting(index : Int, connecting : boolean) {
        var progressbar = this.rootElement.find("#progressbar_" + index);
        var connect_button = this.rootElement.find("#connect_site_" + index);
        var delete_button = this.rootElement.find("#delete_site_" + index);
        connect_button.prop('disabled', connecting);
        delete_button.prop('disabled', connecting);
        if (connecting) {
            progressbar.progressbar( "option", "value", false );
            progressbar.show();
        } else {
            progressbar.hide();
        }
    }

    refresh() {
        var self = this;
        var siteServiceTemplate = Handlebars.compile(this.template);
        var siteService = this.services.siteService;
        var html = siteServiceTemplate({
            "siteService" : siteService
        });
        this.rootElement.html(html);
        var connect_buttons = this.rootElement.find(".site_connect_button");
        var delete_buttons = this.rootElement.find(".site_delete_button");
        var progressbars = this.rootElement.find(".progressbar");
        progressbars.progressbar({ value: false });
        progressbars.hide();
        connect_buttons.on( "click", function( event : any) {
            var index = parseInt(event.currentTarget.id.substring("connect_site_".length));
            var site = siteService.siteAt(index);
            if (self.onConnectSite != null) {
                self.onConnectSite(site, index);
            }
        });
        delete_buttons.on( "click", function( event : any) {
            var index = parseInt(event.currentTarget.id.substring("delete_site_".length));
            console.log("Removing Site at: ", index);
            siteService.removeAt(index).then(() => self.refresh());
        });
    }
}


export class AddPostDialog extends Dialog {
    rootElement : any
    allFields : JQuery<any>
    dialog : any
    form : any
    titleElem : JQuery<HTMLElement>

    get template() : string {
        return `
          <form>
            <fieldset class = "dialog_fields">
              <label for="post_title">Post Title</label>
              <input type="url" name="post_title" id="post_title" value="New Post" class="text ui-widget-content ui-corner-all">

              <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
            </fieldset>
          </form>
        `
    }

    get post() : Post {
        var title = this.titleElem.val() as string;
        return new Post(null, {
            "title": title
        });
    }

    buttons(resolve : any, reject : any) {
        var self = this;
        return {
            "Create Post": function() {
                self.close(self.post, resolve, reject);
            },
            Cancel: function() {
                self.close(null, resolve, reject);
            }
        };
    }

    setupViews() {
        var self = this;
        this.rootElement.html(this.template);
        this.titleElem = this.rootElement.find("#post_title");
        this.allFields = $( [] )
                         .add( this.titleElem );
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

export class PostsPanel {
    rootElement : any
    addPostDialog : AddPostDialog
    addButton : any
    refreshButton : any
    closeButton : any
    postListView : PostListView
    services : ServiceCatalog

    constructor(elem_or_id : string, services : ServiceCatalog) {
        this.rootElement = ensureElement(elem_or_id);
        this.services = services
        this.setupViews();
    }

    show() {
        var parent = this.rootElement.parent();
        var margins = parseInt(parent.css("margin-left")) + 
                      parseInt(parent.css("margin-right"));
        var width = parent.width() + margins;
        this.rootElement.animate({
            width: width + "px"
        });
    }

    hide() {
        this.rootElement.animate({
            width: "0px"
        });
    }

    setupViews() {
        var self = this;
        var postService = this.services.postService;
        var addPostDialogElem : any = ensureElement("add_post_dialog", this.rootElement);
        if (addPostDialogElem.length == 0) {
            addPostDialogElem = $("<div id='add_post_dialog'></div>");
            this.rootElement.append(addPostDialogElem);
        }

        this.addPostDialog = new AddPostDialog(addPostDialogElem);

        var postListDiv = this.rootElement.find("#post_list_div");
        this.postListView = new PostListView(postListDiv, this.services);

        this.addButton = this.rootElement.find("#add_button");
        this.addButton.button().on("click", function() {
        });

        this.refreshButton = this.rootElement.find("#refresh_button");
        this.refreshButton.button().on("click", function() {
        });

        this.closeButton = this.rootElement.find("#close_button");
        this.closeButton.button().on("click", function() {
            self.hide();
        });
    }
};

export class PostListView {
    rootElement : any
    services : ServiceCatalog
    onConnectSite : any

    constructor(elem_or_id : any, services : ServiceCatalog) {
        this.rootElement = ensureElement(elem_or_id);
        this.services = services;
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
                        <center>
                            <div class = "progressbar"
                                 id="progressbar_{{@index}}"></div>
                        </center>
                    </td>
                </tr>
            </table>
            <hr/>
            {{/each}}
        `
    }

    setConnecting(index : Int, connecting : boolean) {
        var progressbar = this.rootElement.find("#progressbar_" + index);
        var connect_button = this.rootElement.find("#connect_site_" + index);
        var delete_button = this.rootElement.find("#delete_site_" + index);
        connect_button.prop('disabled', connecting);
        delete_button.prop('disabled', connecting);
        if (connecting) {
            progressbar.progressbar( "option", "value", false );
            progressbar.show();
        } else {
            progressbar.hide();
        }
    }

    refresh() {
        var self = this;
        var siteService = this.services.siteService;
        var siteServiceTemplate = Handlebars.compile(this.template);
        var html = siteServiceTemplate({
            "siteService" : siteService
        });
        this.rootElement.html(html);
        var connect_buttons = this.rootElement.find(".site_connect_button");
        var delete_buttons = this.rootElement.find(".site_delete_button");
        var progressbars = this.rootElement.find(".progressbar");
        progressbars.progressbar({ value: false });
        progressbars.hide();
        connect_buttons.on( "click", function( event : any) {
            var index = parseInt(event.currentTarget.id.substring("connect_site_".length));
            var site = siteService.siteAt(index);
            if (self.onConnectSite != null) {
                self.onConnectSite(site, index);
            }
        });
        delete_buttons.on( "click", function( event : any) {
            var index = parseInt(event.currentTarget.id.substring("delete_site_".length));
            console.log("Removing Site at: ", index);
            siteService.removeAt(index).then(() => self.refresh());
        });
    }
}

