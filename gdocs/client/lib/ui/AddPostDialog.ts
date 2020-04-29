
declare var Handlebars : any;
import { Dialog } from "./Dialog";
import { ensureElement } from "../utils";
import { Int, Nullable } from "../types";
import { SiteType, Site, Post } from "../models";
import { ServiceCatalog } from "../catalog";

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
