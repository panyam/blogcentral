import { FormDialog } from "./Views";
import { Post } from "../sites";

export class AddPostDialog extends FormDialog<Post> {
  titleElem: JQuery<HTMLElement>;
  passwordElem: JQuery<HTMLElement>;
  excerptElem: JQuery<HTMLElement>;
  slugElem: JQuery<HTMLElement>;

  constructor(elem_or_id: any) {
    super(elem_or_id, "post", null);
    var self = this;
    this._buttons = {
      "Create Post": function () {
        self.close(self.entity);
      },
      Cancel: function () {
        self.close(null);
      },
    };
  }

  setupViews() {
    super.setupViews();
    this.titleElem = this.rootElement.find("#post_title");
    this.passwordElem = this.rootElement.find("#post_password");
    this.excerptElem = this.rootElement.find("#post_excerpt");
    this.slugElem = this.rootElement.find("#post_slug");
    this.allFields
      .add(this.titleElem)
      .add(this.passwordElem)
      .add(this.excerptElem)
      .add(this.slugElem);
  }

  html() {
    return `
        <label for="post_title">Title</label>
        <input type="url" name="post_title" id="post_title" value="Awesome Title!" class="text ui-widget-content ui-corner-all" value = "{{post.options.title}}"/>

        <label for="post_excerpt">Excerpt</label>
        <textarea name="post_excerpt" id="post_excerpt" 
                  class="text ui-widget-content ui-corner-all" rows="5" 
                  placeholder = "Enter your amazing excerpt here!!!">{{post.options.excerpt}}</textarea>

        <label for="post_slug">Slug</label>
        <input type="url" name="post_slug" id="post_slug" value="{{post.options.slug}}" 
               class="text ui-widget-content ui-corner-all"/>

        <label for="post_password">Password</label>
        <input type="password" name="post_password" 
               id="post_password" 
               value="{{post.options.password}}" 
               class="text ui-widget-content ui-corner-all"/>
        `;
  }

  extractEntity() {
    var title = this.titleElem.val() as string;
    var password = this.passwordElem.val() as string;
    var excerpt = this.excerptElem.val() as string;
    var slug = this.slugElem.val() as string;
    return new Post(null, {
      title: title,
      password: password,
      excerpt: excerpt,
      slug: slug,
    });
  }
}
