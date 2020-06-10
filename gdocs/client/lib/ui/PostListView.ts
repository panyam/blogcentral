import { View } from "./Views";
import { Nullable } from "../types";
import { Site, Post } from "../siteapis";
import { App } from "../app";

export interface PostListViewDelegate {
  postSelected(plv: PostListView, post: Post): void;
}

export class PostListView extends View<Post[]> {
  app: App;
  site: Site;
  delegate: Nullable<PostListViewDelegate> = null;

  constructor(elem_or_id: any, app: App) {
    super(elem_or_id, "posts", []);
    this.app = app;
  }

  template() {
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
        `;
  }

  setupViews(self: this = this) {
    super.setupViews();
    var select_post_buttons = this.findElement(".select_post_button");
    select_post_buttons.on("click", function (event: any) {
      self.onSelectPostClicked(event);
    });

    var remove_post_buttons = this.findElement(".remove_post_button");
    remove_post_buttons.on("click", function (event: any) {
      self.onRemovePostClicked(event);
    });
  }

  async onRemovePostClicked(event: any) {
    var app = this.app;
    var index = parseInt(
      event.currentTarget.id.substring("remove_post_".length)
    );
    var posts = this.entity!!;
    var post = posts[index];
    console.log("Removing Post at: ", index);
    var siteManager = app.managerForSite(this.site.siteType);
    var siteApi = siteManager.apiForSite(this.site);
    await siteApi.removePost(post.id);
    posts.splice(index, 1);
    this.refreshViews();
  }

  async onSelectPostClicked(event: any) {
    var index = parseInt(
      event.currentTarget.id.substring("remove_post_".length)
    );
    var posts = this.entity!!;
    var post = posts[index];
    console.log("Post Selected: ", index, post);
    if (this.delegate != null) this.delegate.postSelected(this, post);
  }
}
