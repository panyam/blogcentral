
declare var Handlebars : any;
import { AddPostDialog } from "./AddPostDialog";
import { PostListView } from "./PostListView";
import { ensureElement } from "../utils";
import { Int, Nullable } from "../types";
import { SiteType, Site, Post } from "../models";
import { ServiceCatalog } from "../catalog";

export class PostsPanel {
    rootElement : any
    addPostDialog : AddPostDialog
    addButton : any
    searchBarDiv : any
    searchButton : any
    searchField : any
    orderByField : any
    orderField : any
    searchInField : any
    prevButton : any
    nextButton : any
    closeButton : any
    postListView : PostListView
    services : ServiceCatalog
    resolveFunc : any
    rejectFunc : any
    site : Nullable<Site> = null;

    constructor(elem_or_id : string, services : ServiceCatalog) {
        this.rootElement = ensureElement(elem_or_id);
        this.services = services
        this.setupViews();
    }

    async open(site : Site) : Promise<Post[]> {
        var parent = this.rootElement.parent();
        /*
        var margins = parseInt(parent.css("margin-left")) + 
                      parseInt(parent.css("margin-right"));
        */
        var width = "100%"; // (parent.width() + margins) + "px";
        this.rootElement.animate({ width: width });
        var self = this;
        self.site = site;
        return new Promise((resolve, reject) => {
            self.resolveFunc = resolve;
            self.rejectFunc = reject;
        });
    }

    close(data : any = []) {
        if (this.resolveFunc != null) {
            this.resolveFunc(data);
        }
        this.rootElement.animate({
            width: "0px"
        });
    }

    setupViews() {
        var self = this;
        var postService = this.services.postService;

        this.searchBarDiv = ensureElement("search_bar_div", this.rootElement);
        this.orderByField = ensureElement("search_bar_div", this.rootElement);
        this.orderField = ensureElement("search_bar_div", this.rootElement);
        this.searchInField = ensureElement("search_bar_div", this.rootElement);

        this.searchButton = ensureElement("search_button", this.searchBarDiv);
        this.searchButton.button().on("click", function() {
            self.searchPosts();
        });

        this.searchField = ensureElement("search_field", this.searchBarDiv);
        this.searchField.on("input", function() {
            var v = ($(this).val() as any).trim();
            self.searchButton.html(v.length == 0 ? "Refresh" : "Search");
        });

        var addPostDialogElem : any = ensureElement("add_post_dialog", this.rootElement);
        if (addPostDialogElem.length == 0) {
            addPostDialogElem = $("<div id='add_post_dialog'></div>");
            this.rootElement.append(addPostDialogElem);
        }

        this.addPostDialog = new AddPostDialog(addPostDialogElem);

        var postListDiv = this.rootElement.find("#post_list_div");
        this.postListView = new PostListView(postListDiv, this.services);

        this.prevButton = this.rootElement.find("#prev_button");
        this.prevButton.button().on("click", function() {
        });
        this.prevButton.hide();

        this.nextButton = this.rootElement.find("#next_button");
        this.nextButton.button().on("click", function() {
        });
        this.nextButton.hide();

        this.addButton = this.rootElement.find("#add_button");
        this.addButton.button().on("click", function() {
        });

        this.closeButton = this.rootElement.find("#close_button");
        this.closeButton.button().on("click", function() {
            self.close();
        });
    }

    searchPosts() {
        var orderBy = this.orderByField.val();
        var orderField = this.orderField.val();
        var searchIn = this.searchInField.val();
        var query = this.searchField.val();
    }
};
