import { Request, Response, URLBuilder } from "../net";
import { Post, SiteApi } from "../siteapis";

export class MediumApi extends SiteApi {
  userDetails: any = null;
  async ensureUserId() {
    if (this.userDetails == null) {
      var url = "https://api.medium.com/v1/me";
      var request = new Request(url, { contentType: "application/json" });
      request = this.authClient.decorateRequest(request);
      var response = await this.app.httpClient.send(request);
      this.userDetails = response.data.data;
    }
    return this.userDetails.id;
  }

  get canGetPosts(): boolean {
    return false;
  }
  get canDeletePosts(): boolean {
    return false;
  }
  get canUpdatePosts(): boolean {
    return false;
  }

  get currentUserId() {
    return this.userDetails.id || null;
  }

  async getPosts(options: any) {
    await this.ensureUserId();
    return super.getPosts(options);
  }

  async createPost(post: Post, options: any) {
    await this.ensureUserId();
    return super.createPost(post, options);
  }

  async updatePost(postid: String, options: any) {
    await this.ensureUserId();
    return super.updatePost(postid, options);
  }

  async removePost(id: any) {
    await this.ensureUserId();
    return super.removePost(id);
  }

  getPostsRequest(_options: any) {
    var builder = new URLBuilder("https://api.medium.com/v1")
      .appendPath("users")
      .appendPath(this.userDetails.id)
      .appendPath("publications");
    var url = builder.build();
    return new Request(url, { contentType: "application/json" });
  }

  processGetPosts(response: Response, _options: any) {
    return response.data.data.map((p: any) => {
      return new Post(p.id, p);
    });
  }

  createPostRequest(post: Post, options: any = null) {
    //github.com/Medium/medium-api-docs#33-posts
    var builder = new URLBuilder("https://api.medium.com/v1/users/")
      .appendPath(this.currentUserId)
      .appendPath("posts");
    options = options || {};
    var request = new Request(builder.build(), options);
    request.options.method = "post";
    request.body = {};
    request.body.title = options.title || post.options.title;
    request.body.contentFormat = "html";
    request.body.publishStatus = "draft";
    request.body.content = options.content || "<h1>Hello World</h1>";
    return request;
  }

  updatePostRequest(postid: String, options: any = null) {
    throw new Error("Not Implemented");
    return new Request("", {});
  }

  removePostRequest(id: any) {
    throw new Error("Not Implemented");
    return new Request("", {});
  }
}
