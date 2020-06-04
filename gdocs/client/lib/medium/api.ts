import { Request } from "../net";
import { Post, SiteConfig, SiteApi } from "../siteapis";

declare var BCDefaults: any;

export class MediumApi extends SiteApi {
  ensureUserId() {
  }

  createPostRequest(post: Post, options: any = null) {
    throw new Error("Not Implemented");
    return new Request("", {});
  }

  updatePostRequest(postid: String, options: any = null) {
    throw new Error("Not Implemented");
    return new Request("", {});
  }

  getPostsRequest(options: any) {
    throw new Error("Not Implemented");
    return new Request("", {});
  }

  removePostRequest(id: any) {
    throw new Error("Not Implemented");
    return new Request("", {});
  }
}
