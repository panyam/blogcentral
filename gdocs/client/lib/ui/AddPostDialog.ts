import { FormDialog } from "./Views";
import { Post } from "../siteapis";

export class AddPostDialog extends FormDialog<Post> {
  titleElem: JQuery<HTMLElement>;
  passwordElem: JQuery<HTMLElement>;
  excerptElem: JQuery<HTMLElement>;
  slugElem: JQuery<HTMLElement>;

  constructor(elem_or_id: any) {
    super(elem_or_id, "post", null);
    this.addButton("Create Post").addButton("Cancel");
  }

  setupViews() {
    super.setupViews();
    this.titleElem = this.findElement("#post_title");
    this.passwordElem = this.findElement("#post_password");
    this.excerptElem = this.findElement("#post_excerpt");
    this.slugElem = this.findElement("#post_slug");
    this.allFields
      .add(this.titleElem)
      .add(this.passwordElem)
      .add(this.excerptElem)
      .add(this.slugElem);
  }

  template() {
    return `
        <label for="post_title">Title</label>
        <input type="url" name="post_title" id="post_title" 
                value = "{{post.options.title}}"/>

        <label for="post_excerpt">Excerpt</label>
        <textarea name="post_excerpt" id="post_excerpt" 
                  rows="5" 
                  placeholder = "Enter your amazing excerpt here!!!">{{post.options.excerpt}}</textarea>

        <label for="post_slug">Slug</label>
        <input type="url" name="post_slug" id="post_slug" 
               value="{{post.options.slug}}" 
               />

        <label for="post_password">Password</label>
        <input type="password" name="post_password" 
               id="post_password" 
               value="{{post.options.password}}" 
               />
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
