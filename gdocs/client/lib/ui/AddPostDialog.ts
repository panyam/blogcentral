
declare var Handlebars : any;
import { Dialog } from "./Dialog";
import { ensureElement } from "./utils";
import { Int, Nullable } from "../types";
import { SiteType, Site, Post } from "../sites";
import { ServiceCatalog } from "../catalog";

export class AddPostDialog extends Dialog {
    rootElement : any
    allFields : JQuery<any>
    dialog : any
    form : any
    titleElem : JQuery<HTMLElement>
    passwordElem : JQuery<HTMLElement>
    excerptElem : JQuery<HTMLElement>

    get template() : string {
        return `
          <form>
            <fieldset class = "dialog_fields">
              <label for="post_title">Title</label>
              <input type="url" name="post_title" id="post_title" value="Awesome Title!" class="text ui-widget-content ui-corner-all"/>

              <label for="post_excerpt">Excerpt</label>
              <textarea name="post_excerpt" id="post_excerpt" value="New Post" class="text ui-widget-content ui-corner-all" rows="5">Enter your amazing excerpt here!!!</textarea>

              <label for="post_slug">Slug</label>
              <input type="url" name="post_slug" id="post_slug" value="" class="text ui-widget-content ui-corner-all"/>

              <label for="post_password">Password</label>
              <input type="password" value = "password" name="post_password" id="post_password" value="New Post" class="text ui-widget-content ui-corner-all"/>

              <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
            </fieldset>
          </form>
        `
    }

    get post() : Post {
        var title = this.titleElem.val() as string;
        var password = this.passwordElem.val() as string;
        var excerpt = this.excerptElem.val() as string;
        return new Post(null, {
            "title": title,
            "password": password,
            "excerpt": excerpt,
        });
    }

    buttons() : any {
        var self = this;
        return {
            "Create Post": function() {
                self.close(self.post);
            },
            Cancel: function() { self.close(null); }
        };
    }

    setupViews() {
        var self = this;
        this.rootElement.html(this.template);
        this.titleElem = this.rootElement.find("#post_title");
        this.passwordElem = this.rootElement.find("#post_password");
        this.excerptElem = this.rootElement.find("#post_excerpt");
        this.allFields = $( [] )
                         .add( this.titleElem )
                         .add( this.passwordElem )
                         .add( this.excerptElem );
        this.dialog = this.rootElement.dialog({
            title: "Add Post",
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
