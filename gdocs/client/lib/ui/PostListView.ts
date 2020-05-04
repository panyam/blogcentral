
declare var Handlebars : any;
import { ensureElement } from "../utils";
import { Int, Nullable } from "../types";
import { SiteType, Site, Post } from "../models";
import { ServiceCatalog } from "../catalog";

export class PostListView {
    rootElement : any
    services : ServiceCatalog
    _posts : Post[] = []

    constructor(elem_or_id : any, services : ServiceCatalog) {
        this.rootElement = ensureElement(elem_or_id);
        this.services = services;
        this.refresh();
    }

    set posts(posts : Post[]) {
        this._posts = posts;
        this.refresh();
    }

    get template() : string {
        return `
        {{# each posts }}
        <table class = "post_table" width="100%" id = "post_table_{{@index}}" >
        <tr>
            <td>
                <span class="post_title"> {{{ this.title.rendered }}} </span>
            </td>
            <td width="50px">
                <button class = "select_post_button"
                        id = "select_post_{{@index}}">Select</button>
            </td>
        </tr>
        </table>
        <hr/>
        {{/each}}
        `
    }

    refresh() {
        var self = this;
        var postsListTemplate = Handlebars.compile(this.template);
        var html = postsListTemplate({
            "posts" : this._posts
        });
        this.rootElement.html(html);
        var select_post_buttons = this.rootElement.find(".select_post_button");
        select_post_buttons.on( "click", function( event : any) {
            var index = parseInt(event.currentTarget.id.substring("select_post_".length));
            var post = self._posts[index];
            console.log("Selected Post: ", index, post);
        });
    }
}

