import { AddPostDialog } from "./AddPostDialog";
import { ActivityIndicator } from "./ActivityIndicator";
import { PostListView, PostListViewDelegate } from "./PostListView";
import { setVisible, setEnabled, ensureElement } from "../utils";
import { Int, Nullable } from "../types";
import { Site, Post } from "../models";
import { ServiceCatalog } from "../catalog";

const PAGE_LENGTH = 5;

export class PostsPanel implements PostListViewDelegate {
  rootElement: any;
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
  services: ServiceCatalog;
  resolveFunc: any;
  rejectFunc: any;
  site: Site;
  selectedPost: Nullable<Post> = null;
  activityIndicator: ActivityIndicator;
  currentPage = 1;
  hasNextPage = false;

  constructor(elem_or_id: string, services: ServiceCatalog) {
    this.rootElement = ensureElement(elem_or_id);
    this.services = services;
    this.setupViews();
  }

  async open(site: Site): Promise<Nullable<Post>> {
    /*
        var parent = this.rootElement.parent();
        var margins = parseInt(parent.css("margin-left")) + 
                      parseInt(parent.css("margin-right"));
        */
    var width = "100%"; // (parent.width() + margins) + "px";
    this.rootElement.animate({ width: width });
    var self = this;
    self.site = site;
    self.postListView.site = site;
    self.postListView.posts = [];
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

    var addPostDialogElem: any = ensureElement(
      "add_post_dialog",
      this.rootElement
    );
    if (addPostDialogElem.length == 0) {
      addPostDialogElem = $("<div id='add_post_dialog'></div>");
      this.rootElement.append(addPostDialogElem);
    }

    this.addPostDialog = new AddPostDialog(addPostDialogElem);

    var postListDiv = this.rootElement.find("#post_list_div");
    this.postListView = new PostListView(postListDiv, this.services);
    this.postListView.delegate = this;

    this.prevButton = this.rootElement.find("#prev_button");
    this.prevButton.button().on("click", function () {
      self.enableButtons(false);
      self.searchPosts(self.currentPage - 1);
    });
    this.prevButton.hide();

    this.nextButton = this.rootElement.find("#next_button");
    this.nextButton.button().on("click", function () {
      self.enableButtons(false);
      self.searchPosts(self.currentPage + 1);
    });
    this.nextButton.hide();

    this.addButton = this.rootElement.find("#add_button");
    this.addButton.button().on("click", function () {
      self.onAddPost();
    });

    this.confirmButton = this.rootElement.find("#confirm_button");
    this.confirmButton.button().on("click", function () {
      self.close(self.selectedPost);
    });

    this.cancelButton = this.rootElement.find("#cancel_button");
    this.cancelButton.button().on("click", function () {
      self.close(null);
    });

    var aidiv = this.rootElement.find(".activity_indicator");
    this.activityIndicator = new ActivityIndicator(aidiv);
  }

  async searchPosts(page: Int) {
    var orderBy = this.orderbyField.val();
    var order = this.orderField.val();
    var searchIn = this.searchInField.val();
    var query = this.searchField.val();

    var site = this.site;
    var services = this.services;
    if (site != null) {
      if (await services.siteLoginProvider.ensureLoggedIn(site)) {
        this.activityIndicator.show();
        var posts = await services.siteGateway.getPosts(site, {
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
          this.postListView.posts = posts;
        }
      }
    }
    this.activityIndicator.hide();
    this.enableButtons();
  }

  async onAddPost() {
    var site = this.site;
    if (site == null) return;

    var services = this.services;
    var newPost = (await this.addPostDialog.open()) as Post;
    if (newPost == null) return;

    try {
      console.log("Creating New Post: ", newPost);
      this.activityIndicator.show();
      var post = await services.siteGateway.createPost(site, newPost);
    } catch (e) {
      console.log("Create Post Exception: ", e);
    }
    this.activityIndicator.hide();
  }

  enableButtons(enable: boolean = true) {
    var opacity = enable ? 1 : 0.5;
    setEnabled(this.searchButton, enable).css("opacity", opacity);
    setEnabled(this.prevButton, enable).css("opacity", opacity);
    setEnabled(this.nextButton, enable).css("opacity", opacity);
  }

  postSelected(plv: PostListView, post: Post): void {
    console.log("Here...: ", post);
    this.selectedPost = post;
  }
}
