
declare var Handlebars : any;
import { ensureElement } from "./utils";
import { Int, Nullable } from "./types";
import { SiteType, Site, Post } from "./models";
import { ServiceCatalog } from "./catalog";

export class Dialog {
    rootElement : any
    dialog : any
    resolveFunc : any
    rejectFunc : any

    constructor(elem_or_id : any) {
        this.rootElement = ensureElement(elem_or_id);
        this.setupViews();
    }

    setupViews() {
    }

    async open() {
        var self = this;
        return new Promise((resolve, reject) => {
            self.resolveFunc = resolve;
            self.rejectFunc = reject;
            this.dialog
                .dialog( "option", "buttons", self.buttons())
                .dialog( "open" );
        });
    }

    buttons() {
        var self = this;
        return {
            Cancel: function() {
                self.close(null);
            }
        };
    }

    close(data : Nullable<any> = null) {
        if (this.resolveFunc != null) {
            this.resolveFunc(data);
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

    buttons() {
        var self = this;
        return {
            "Add Site": function() {
                self.close(self.site);
            },
            Cancel: function() {
                self.close(null);
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

export interface PostSelector {
    /**
     * Lets one select one or more posts in a site.
     */
    selectPosts(site : Site, index : Int) : Promise<Post[]>;
}

export class SiteListView {
    rootElement : any
    services : ServiceCatalog
    postSelector : any

    constructor(elem_or_id : any, services : ServiceCatalog) {
        this.rootElement = ensureElement(elem_or_id);
        this.services = services;
        this.postSelector = null;
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
                    <td rowspan = 2>
                        <button class="remove_site_button ui-button ui-widget ui-corner-all ui-button-icon-only" title="Remove Site" id = "remove_site_{{@index}}">
                            <span class="ui-icon ui-icon-trash"></span> Remove Site
                        </button>
                    </td>
                </tr>
                <tr>
                    <td class = "site_param_name"> Username: </td>
                    <td> {{this.username}} </td>
                </tr>
                <tr>
                    <td colspan = 2>
                        <center>
                            <button class = "select_post_button"
                                    id = "select_post_{{@index}}">Posts</button>
                            <button class = "publish_post_button"
                                    id = "publish_post_{{@index}}">Publish</button>
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
        var publish_post_button = this.rootElement.find("#publish_post_" + index);
        var remove_button = this.rootElement.find("#remove_site_" + index);
        publish_post_button.prop('disabled', connecting);
        remove_button.prop('disabled', connecting);
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

        var progressbars = this.rootElement.find(".progressbar");
        progressbars.progressbar({ value: false });
        progressbars.hide();

        var select_post_buttons = this.rootElement.find(".select_post_button");
        select_post_buttons.button().on( "click", (event : any) => {
            self.onSelectPostClicked(event);
        });

        var publish_post_buttons = this.rootElement.find(".publish_post_button");
        publish_post_buttons.button().on( "click", (event : any) => {
            self.onPublishPostClicked(event);
        });

        var remove_buttons = this.rootElement.find(".remove_site_button");
        remove_buttons.button().on( "click", (event : any) => {
            self.onRemoveSiteClicked(event);
        });
    }

    onSelectPostClicked(event : any) {
        var self = this;
        var siteService = this.services.siteService;
        var index = parseInt(event.currentTarget.id.substring("select_post_".length));
        var site = siteService.siteAt(index);
        if (self.postSelector != null) {
            self.postSelector.selectPosts(site, index)
            .then((posts : Post[]) => {
                site.selectedPosts = posts;
                siteService.saveSite(site);
                self.refresh();
            });
        }
    }

    onPublishPostClicked(event : any) {
        var self = this;
        var siteService = this.services.siteService;
        var index = parseInt(event.currentTarget.id.substring("publish_post_".length));
        var site = siteService.siteAt(index);
        console.log("Publish to site: ", index, site);
    }

    onRemoveSiteClicked(event : any) {
        var self = this;
        var siteService = this.services.siteService;
        var index = parseInt(event.currentTarget.id.substring("remove_site_".length));
        console.log("Removing Site at: ", index);
        siteService.removeAt(index).then(() => self.refresh());
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

    buttons() {
        var self = this;
        return {
            "Create Post": function() {
                self.close(self.post);
            },
            Cancel: function() {
                self.close(null);
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
    searchBarDiv : any
    searchButton : any
    searchField : any
    orderByField : any
    orderField : any
    searchInField : any
    prevButton : any
    nextButton : any
    closeButton : any
    postListView : PostListView
    services : ServiceCatalog
    resolveFunc : any
    rejectFunc : any

    constructor(elem_or_id : string, services : ServiceCatalog) {
        this.rootElement = ensureElement(elem_or_id);
        this.services = services
        this.setupViews();
    }

    async open() : Promise<Post[]> {
        var parent = this.rootElement.parent();
        /*
        var margins = parseInt(parent.css("margin-left")) + 
                      parseInt(parent.css("margin-right"));
        */
        var width = "100%"; // (parent.width() + margins) + "px";
        this.rootElement.animate({ width: width });
        var self = this;
        return new Promise((resolve, reject) => {
            self.resolveFunc = resolve;
            self.rejectFunc = reject;
        });
    }

    close(data : any = []) {
        if (this.resolveFunc != null) {
            this.resolveFunc(data);
        }
        this.rootElement.animate({
            width: "0px"
        });
    }

    setupViews() {
        var self = this;
        var postService = this.services.postService;

        this.searchBarDiv = ensureElement("search_bar_div", this.rootElement);
        this.orderByField = ensureElement("search_bar_div", this.rootElement);
        this.orderField = ensureElement("search_bar_div", this.rootElement);
        this.searchInField = ensureElement("search_bar_div", this.rootElement);

        this.searchButton = ensureElement("search_button", this.searchBarDiv);
        this.searchButton.button().on("click", function() {
            self.searchPosts();
        });

        this.searchField = ensureElement("search_field", this.searchBarDiv);
        this.searchField.on("input", function() {
            var v = ($(this).val() as any).trim();
            self.searchButton.html(v.length == 0 ? "Refresh" : "Search");
        });

        var addPostDialogElem : any = ensureElement("add_post_dialog", this.rootElement);
        if (addPostDialogElem.length == 0) {
            addPostDialogElem = $("<div id='add_post_dialog'></div>");
            this.rootElement.append(addPostDialogElem);
        }

        this.addPostDialog = new AddPostDialog(addPostDialogElem);

        var postListDiv = this.rootElement.find("#post_list_div");
        this.postListView = new PostListView(postListDiv, this.services);

        this.prevButton = this.rootElement.find("#prev_button");
        this.prevButton.button().on("click", function() {
        });
        this.prevButton.hide();

        this.nextButton = this.rootElement.find("#next_button");
        this.nextButton.button().on("click", function() {
        });
        this.nextButton.hide();

        this.addButton = this.rootElement.find("#add_button");
        this.addButton.button().on("click", function() {
        });

        this.closeButton = this.rootElement.find("#close_button");
        this.closeButton.button().on("click", function() {
            self.close();
        });
    }

    searchPosts() {
        var orderBy = this.orderByField.val();
        var orderField = this.orderField.val();
        var searchIn = this.searchInField.val();
        var query = this.searchField.val();
    }
};

export class PostListView {
    rootElement : any
    services : ServiceCatalog

    constructor(elem_or_id : any, services : ServiceCatalog) {
        this.rootElement = ensureElement(elem_or_id);
        this.services = services;
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
                            <button class = "publish_post_button"
                                    id = "publish_post_{{@index}}">Connect</button>
                            <button class = "remove_site_button"
                                    id = "remove_site_{{@index}}">Remove</button>
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
        var publish_post_button = this.rootElement.find("#publish_post_" + index);
        var remove_button = this.rootElement.find("#remove_site_" + index);
        publish_post_button.prop('disabled', connecting);
        remove_button.prop('disabled', connecting);
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
        var publish_post_buttons = this.rootElement.find(".publish_post_button");
        var remove_buttons = this.rootElement.find(".remove_site_button");
        var progressbars = this.rootElement.find(".progressbar");
        progressbars.progressbar({ value: false });
        progressbars.hide();
        publish_post_buttons.on( "click", function( event : any) {
            var index = parseInt(event.currentTarget.id.substring("publish_post_".length));
            var site = siteService.siteAt(index);
        });
        remove_buttons.on( "click", function( event : any) {
            var index = parseInt(event.currentTarget.id.substring("remove_site_".length));
            console.log("Removing Site at: ", index);
            siteService.removeAt(index).then(() => self.refresh());
        });
    }
}

