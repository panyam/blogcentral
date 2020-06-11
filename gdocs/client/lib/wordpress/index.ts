import { App } from "../app";
import { Nullable } from "../types";
import { View, FormDialog } from "../ui/Views";
import { ensureCreated } from "../ui/utils";
import { SiteManager, Site, Post } from "../siteapis";
import { AuthClient } from "../authclients";
import { PublicWPRestApi, HostedWPRestApi } from "./api";
import { PublicWPSiteInputView, HostedWPSiteInputView } from "./ui";
import { PublicWPSiteSummaryView, HostedWPSiteSummaryView } from "./ui";
import { SITE_TYPE_WP_PUBLIC, SITE_TYPE_WP_HOSTED } from "./core";

abstract class WPSiteManager extends SiteManager {
  async obtainNewPost(post : Nullable<Post> = null) : Promise<Nullable<Post>> {
    // Show a dialog asking for token
    var elem = ensureCreated("add_wp_post_dialog");
    elem.addClass("form_dialog");
    var postDialog = new FormDialog<Post>(elem, "post", post)
      .addButton("Create")
      .addButton("Cancel")
      .setTemplate(
        `
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
        `
      )
      .setup();
    postDialog.title = "Create New Post";
    var titleElem = postDialog.findElement("#post_title");
    var passwordElem = postDialog.findElement("#post_password");
    var excerptElem = postDialog.findElement("#post_excerpt");
    var slugElem = postDialog.findElement("#post_slug");
    postDialog.shouldClose = (button: any) => {
      if (button == null || button.text == "Cancel") return true;
      var title = (titleElem as any).val().trim();
      return title.length > 0;
    };
    var result = (await postDialog.open()) as any;
    if (result.text == "Cancel") return null;
    var title = (titleElem as any).val().trim();
    var password = (passwordElem as any).val().trim();
    var excerpt = (excerptElem as any).val().trim();
    var slug = (slugElem as any).val().trim();

    // use this to get token
    return new Post(null, {
      title: title,
      password: password,
      excerpt: excerpt,
      slug: slug,
    });
  }
}

class PublicWPSiteManager extends WPSiteManager {
  createSiteView(
    purpose: string,
    elem_or_id: any,
    site: Nullable<Site>
  ) : View<Site> {
    if (purpose == "input") {
      return new PublicWPSiteInputView(elem_or_id, this).setup();
    } else {
      return new PublicWPSiteSummaryView(elem_or_id, this, site!!).setup();
    }
  }

  createSiteApi(site: Site, authClient: AuthClient): PublicWPRestApi{
    return new PublicWPRestApi(site, authClient, this);
  }

  /*
  async showAddPostDialog() {
    if (this.addPostDialog == null) {
      var addPostDialogElem: any = ensureCreated(
        "add_post_dialog",
        this.rootElement
      );
      if (!addPostDialogElem.attr("title")) {
        addPostDialogElem.attr("title", "Add new post");
      }
      this.addPostDialog = new AddPostDialog(addPostDialogElem).setup();
    }
    return this.addPostDialog.open();
  }
  */
}

class HostedWPSiteManager extends WPSiteManager {
  createSiteView(
    purpose: string,
    elem_or_id: any,
    site: Nullable<Site>
  ) : View<Site> {
    if (purpose == "input") {
      return new HostedWPSiteInputView(elem_or_id, this).setup();
    } else {
      return new HostedWPSiteSummaryView(elem_or_id, this, site!!).setup();
    }
  }

  createSiteApi(site: Site, authClient: AuthClient): HostedWPRestApi{
    return new HostedWPRestApi(site, authClient, this);
  }
}

export function registerApp(app: App) {
  app.siteManagers[SITE_TYPE_WP_PUBLIC] = new PublicWPSiteManager(app);
  app.siteManagers[SITE_TYPE_WP_HOSTED] = new HostedWPSiteManager(app);
}
