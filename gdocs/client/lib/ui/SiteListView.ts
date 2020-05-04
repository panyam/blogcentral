
declare var Handlebars : any;
import { ensureElement } from "../utils";
import { Int, Nullable } from "../types";
import { SiteType, Site, Post } from "../models";
import { ServiceCatalog } from "../catalog";

export interface SiteListViewDelegate {
    /**
     * Lets one select one or more posts in a site.
     */
    selectPost(site : Site, index : Int) : Promise<Nullable<Post>>;
}

export class SiteListView {
    rootElement : any
    services : ServiceCatalog
    delegate : Nullable<SiteListViewDelegate> = null

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
                    <td class = "td_param_name"> Site Host: </td>
                    <td> {{this.site_host}} </td>
                    <td rowspan = 2>
                        <button class="remove_site_button ui-button ui-widget ui-corner-all ui-button-icon-only" title="Remove Site" id = "remove_site_{{@index}}">
                            <span class="ui-icon ui-icon-trash"></span> Remove Site
                        </button>
                    </td>
                </tr>
                <tr>
                    <td class = "td_param_name"> Username: </td>
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

    async onSelectPostClicked(event : any) {
        var self = this;
        var siteService = this.services.siteService;
        var index = parseInt(event.currentTarget.id.substring("select_post_".length));
        var site = siteService.siteAt(index);
        if (this.delegate != null) {
            var post = await this.delegate.selectPost(site, index);
            this.refresh();
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

