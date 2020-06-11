import "../../styles/PostsPanel";
import { View } from "./Views";
import { ActivityIndicator } from "./ActivityIndicator";
import { PostListView, PostListViewDelegate } from "./PostListView";
import { setVisible, setEnabled, ensureElement } from "./utils";
import { Int, Nullable } from "../types";
import { App } from "../app";
import { SiteManager, Site, Post } from "../siteapis";

const PAGE_LENGTH = 5;

export class PostsPanel extends View<any> implements PostListViewDelegate {
  searchBarDiv: any;
  searchButton: any;
  searchField: any;
  orderbyField: any;
  orderField: any;
  searchInField: any;
  prevButton: any;
  nextButton: any;
  postListView: PostListView;
  app: App;
  resolveFunc: any;
  rejectFunc: any;
  site: Site;
  selectedPost: Nullable<Post> = null;
  activityIndicator: ActivityIndicator;
  currentPage = 1;
  hasNextPage = false;
  siteManager: SiteManager;

  constructor(elem_or_id: string, app: App) {
    super(elem_or_id, null, null);
    this.app = app;
  }

  async open(site: Site): Promise<Nullable<Post>> {
    var width = "100%"; // (parent.width() + margins) + "px";
    this.rootElement.animate({ width: width });
    var self = this;
    self.siteManager = this.app.managerForSite(site.siteType);
    self.site = site;
    self.postListView.site = site;
    self.postListView.entity = [];
    self.selectedPost = null;
    setVisible(this.prevButton, false);
    setVisible(this.nextButton, false);
    return new Promise((resolve, reject) => {
      self.resolveFunc = resolve;
      self.rejectFunc = reject;
    });
  }

  close(data: any = null) {
    if (this.resolveFunc != null) {
      this.resolveFunc(data);
    }
    this.rootElement.animate({
      width: "0px",
    });
  }

  setupViews() {
    var self = this;
    this.searchBarDiv = ensureElement("search_bar_div", this.rootElement);
    this.orderbyField = ensureElement("orderby", this.rootElement);
    this.orderField = ensureElement("order", this.rootElement);
    this.searchInField = ensureElement("searchin", this.rootElement);

    this.searchButton = ensureElement("search_button", this.searchBarDiv);
    this.searchButton.button().on("click", function () {
      self.enableButtons(false);
      self.searchPosts(self.currentPage);
    });

    this.searchField = ensureElement("search_field", this.searchBarDiv);
    this.searchField.on("input", function () {
      var v = ($(this).val() as any).trim();
      self.searchButton.html(v.length == 0 ? "Refresh" : "Search");
    });

    var postListDiv = this.findElement("#post_list_div");
    this.postListView = new PostListView(postListDiv, this.app).setup();
    this.postListView.delegate = this;

    this.prevButton = this.findElement("#prev_button");
    this.prevButton.button().on("click", function () {
      self.enableButtons(false);
      self.searchPosts(self.currentPage - 1);
    });
    this.prevButton.hide();

    this.nextButton = this.findElement("#next_button");
    this.nextButton.button().on("click", function () {
      self.enableButtons(false);
      self.searchPosts(self.currentPage + 1);
    });
    this.nextButton.hide();

    this.findElement("#add_button").button().on("click", () => {
      self.onAddPost();
    });

    this.findElement("#confirm_button").button().on("click", () => {
      self.close(self.selectedPost);
    });

    this.findElement("#cancel_button").button().on("click", () => {
      self.close(null);
    });

    var aidiv = this.findElement(".activity_indicator");
    this.activityIndicator = new ActivityIndicator(aidiv).setup();
  }

  async searchPosts(page: Int) {
    var orderBy = this.orderbyField.val();
    var order = this.orderField.val();
    var searchIn = this.searchInField.val();
    var query = this.searchField.val();

    var site = this.site;
    var app = this.app;
    if (site != null) {
      var siteApi = this.siteManager.apiForSite(site);
      if (await app.ensureLoggedIn(site)) {
        this.activityIndicator.show();
        var posts = await siteApi.getPosts({
          order: order,
          orderby: orderBy,
          searchIn: searchIn,
          query: query,
          page: page,
          per_page: PAGE_LENGTH + 1,
        });
        console.log("Fetched Posts: ", posts);
        if (posts.length > 0) {
          this.hasNextPage = posts.length > PAGE_LENGTH;
          this.currentPage = page;
          setVisible(this.prevButton, page > 1);
          setVisible(this.nextButton, this.hasNextPage);
          this.postListView.entity = posts;
        }
      }
    }
    this.activityIndicator.hide();
    this.enableButtons();
  }

  async onAddPost() {
    var site = this.site;
    if (site == null) return;
    var newPost = await this.siteManager.obtainNewPost()
    if (newPost != null) {
      try {
        var siteApi = this.siteManager.apiForSite(site);
        console.log("Creating New Post: ", newPost);
        this.activityIndicator.show();
        await siteApi.createPost(newPost!!, {});
      } catch (e) {
        console.log("Create Post Exception: ", e);
      }
      this.activityIndicator.hide();
    }
  }

  enableButtons(enable: boolean = true) {
    var opacity = enable ? 1 : 0.5;
    setEnabled(this.searchButton, enable).css("opacity", opacity);
    setEnabled(this.prevButton, enable).css("opacity", opacity);
    setEnabled(this.nextButton, enable).css("opacity", opacity);
  }

  postSelected(_plv: PostListView, post: Post): void {
    console.log("Here...: ", post);
    this.selectedPost = post;
  }
}
