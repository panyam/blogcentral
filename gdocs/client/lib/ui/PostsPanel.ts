import "../../styles/PostsPanel";
import { View } from "./Views";
import { AddPostDialog } from "./AddPostDialog";
import { ActivityIndicator } from "./ActivityIndicator";
import { PostListView, PostListViewDelegate } from "./PostListView";
import { setVisible, setEnabled, ensureElement, ensureCreated } from "./utils";
import { Int, Nullable } from "../types";
import { App } from "../app";
import { SiteManager, Site, Post } from "../siteapis";

const PAGE_LENGTH = 5;

export class PostsPanel extends View<any> implements PostListViewDelegate {
  addPostDialog: AddPostDialog;
  addButton: any;
  searchBarDiv: any;
  searchButton: any;
  searchField: any;
  orderbyField: any;
  orderField: any;
  searchInField: any;
  prevButton: any;
  nextButton: any;
  confirmButton: any;
  cancelButton: any;
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

    this.addButton = this.findElement("#add_button");
    this.addButton.button().on("click", function () {
      self.onAddPost();
    });

    this.confirmButton = this.findElement("#confirm_button");
    this.confirmButton.button().on("click", function () {
      self.close(self.selectedPost);
    });

    this.cancelButton = this.findElement("#cancel_button");
    this.cancelButton.button().on("click", function () {
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

    var app = this.app;
    var button = await this.showAddPostDialog();
    if (button.title == "Cancel") return;
    var newPost = this.addPostDialog.entity;
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
