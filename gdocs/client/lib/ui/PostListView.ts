
declare var Handlebars : any;
import { ensureElement } from "./utils";
import { Int, Nullable } from "../types";
import { SiteType, Site, Post } from "../models";
import { ServiceCatalog } from "../catalog";

export interface PostListViewDelegate {
    postSelected(plv : PostListView, post : Post) : void
}

export class PostListView {
    rootElement : any
    services : ServiceCatalog
    _posts : Post[] = []
    site : Site
    delegate : Nullable<PostListViewDelegate> = null;

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
                <h3 class="post_title"> 
                    <a target="_blank" href="{{ this.options.link }}">
                        {{{ this.options.title.rendered }}} 
                    </a>
                </h3>
                <span class="post_created_at">
                    Created: {{this.options.date}}
                </span>
                <span class="post_modified_at">
                    Modified: {{this.options.modified}}
                </span>
            </td>
            <td width="50px">
                <button class = "select_post_button"
                        id = "select_post_{{@index}}">Select</button>
                <!--
                <br/>
                <button class="remove_post_button ui-button ui-widget ui-corner-all ui-button-icon-only" title="Remove Post" id = "remove_post_{{@index}}">
                    <span class="ui-icon ui-icon-trash"></span> Remove
                </button>
                -->
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
            self.onSelectPostClicked(event);
        });

        var remove_post_buttons = this.rootElement.find(".remove_post_button");
        remove_post_buttons.on( "click", function( event : any) {
            self.onRemovePostClicked(event);
        });
    }

    async onRemovePostClicked(event : any) {
        var self = this;
        var services = this.services;
        var index = parseInt(event.currentTarget.id.substring("remove_post_".length));
        var post = self._posts[index];
        console.log("Removing Post at: ", index);
        await services.siteGateway.removePost(this.site, post.id);
        this._posts.splice(index, 1);
        this.refresh();
    }

    async onSelectPostClicked(event : any) {
        var services = this.services;
        var index = parseInt(event.currentTarget.id.substring("remove_post_".length));
        var post = this._posts[index];
        console.log("Post Selected: ", index, post);
        if (this.delegate != null) this.delegate.postSelected(this, post);
    }
}

