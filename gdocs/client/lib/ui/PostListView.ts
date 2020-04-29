
declare var Handlebars : any;
import { ensureElement } from "../utils";
import { Int, Nullable } from "../types";
import { SiteType, Site, Post } from "../models";
import { ServiceCatalog } from "../catalog";

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

