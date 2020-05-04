
declare var Handlebars : any;
import { AddPostDialog } from "./AddPostDialog";
import { PostListView } from "./PostListView";
import { ensureElement } from "../utils";
import { Int, Nullable } from "../types";
import { SiteType, Site, Post } from "../models";
import { ServiceCatalog } from "../catalog";

export class ActivityIndicator {
    // Which element do we want to cover?
    rootElement : any
    modalElement : any
    aiElement : any
    bgColor : any
    imageUrl : string
    zIndex : Int
    modalId : string

    constructor(elem_or_id : string, config : any = null) {
        this.rootElement = ensureElement(elem_or_id);
        config = config || {};
        this.zIndex = config.zIndex || 500;
        this.bgColor = config.bgColor || "rgba(10, 10, 10, .6)";
        this.imageUrl = config.imageUrl || "http://i.stack.imgur.com/FhHRx.gif";
        this.modalId = config.modalId || "modal";
        this.setupViews();
    }
    
    setupViews() {
        this.modalElement = ensureElement(this.modalId, this.rootElement);
        if (this.modalElement.length == 0) {
            this.modalElement = $("<div id = '" + this.modalId + "'></div>");
            this.rootElement.append(this.modalElement);
        }
        this.modalElement.css("position", "fixed");
        this.modalElement.css("z-index", this.zIndex);
        this.modalElement.css("left", "0px");
        this.modalElement.css("top", "0px");
        this.modalElement.css("height", "0px");
        this.modalElement.css("width", "0px");
        this.modalElement.css("background", 
                                this.bgColor + "\n" +
                                "url('" + this.imageUrl + "')\n" +
                                "50% 50%\n" +
                                "no-repeat");
    }

    show() {
        this.modalElement.css("height", "100%");
        this.modalElement.css("width", "100%");
        this.modalElement.show(); 
    }

    hide() {
        this.modalElement.hide(); 
    }
};
