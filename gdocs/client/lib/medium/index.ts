import { App } from "../app";
import { Nullable } from "../types";
import { Post, Site, SiteManager } from "../siteapis";
import { AuthClient } from "../authclients";
import { MediumApi } from "./api";
import { View, FormDialog } from "../ui/Views";
import { ensureCreated } from "../ui/utils";
import { MediumSiteInputView } from "./ui";
import { MediumSiteSummaryView } from "./ui";

export const SITE_TYPE_MEDIUM = "SITE_TYPE_MEDIUM";

export class MediumSiteManager extends SiteManager {
  createSiteView(
    purpose: string,
    elem_or_id: any,
    site: Nullable<Site>
  ): View<Site> {
    if (purpose == "input") {
      return new MediumSiteInputView(elem_or_id, this).setup();
    } else {
      return new MediumSiteSummaryView(elem_or_id, this, site!!).setup();
    }
  }

  createSiteApi(site: Site, authClient: AuthClient): MediumApi {
    return new MediumApi(site, authClient, this);
  }

  async obtainNewPost(post: Nullable<Post> = null): Promise<Nullable<Post>> {
    // Show a dialog asking for token
    var elem = ensureCreated("add_wp_post_dialog");
    elem.addClass("form_dialog");
    var postDialog = new FormDialog<Post>(elem, "post", post)
      .addButton("Create")
      .addButton("Cancel")
      .setTemplate(
        `
        <label for="post_title">Title</label>
        <input type="text" name="post_title" id="post_title" 
                value = "{{post.options.title}}"/>

        <label for="post_tags">Tags (Comma Seperated)</label>
        <input type="text" name="post_tags" id="post_tags" 
                value = "{{post.options.tags}}"/>

        <div style="text-align: justify; background-color: pink; padding: 10px; margin-top: 10px">
        <h3 style="text-align: center">Sorry Authors</h3>
        Medium does <a href="https://medium.com/the-partnered-pen/medium-update-you-can-no-longer-delete-and-re-post-old-content-e4882ddf2bd5">NOT allow reposting or updating</a> existing content.  So this plugin will only create content in draft mode.  Once you are ready to publish please go to your Medium account and mark the status as public.
        </div>
        `
      )
      .setup();
    postDialog.title = "Create New Post";
    var titleElem = postDialog.findElement("#post_title");
    var tagsElem = postDialog.findElement("#post_tags");
    postDialog.shouldClose = (button: any) => {
      if (button == null || button.text == "Cancel") return true;
      var title = (titleElem as any).val().trim();
      return title.length > 0;
    };
    var result = (await postDialog.open()) as any;
    if (result.text == "Cancel") return null;
    var title = (titleElem as any).val().trim();
    var tags = (tagsElem as any).val().trim().split(",");

    // use this to get token
    return new Post(null, {
      title: title,
      tags: tags,
    });
  }
}

export function registerApp(app: App) {
  app.siteManagers[SITE_TYPE_MEDIUM] = new MediumSiteManager(app);
}
