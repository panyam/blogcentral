declare var Handlebars: any;
import { AddPostDialog } from "./AddPostDialog";
import { PostListView } from "./PostListView";
import { ensureElement } from "../utils";
import { Int, Nullable } from "../types";
import { SiteType, Site, Post } from "../models";
import { ServiceCatalog } from "../catalog";

export class ActivityIndicator {
  modalElement: any;
  bgColor: any;
  imageUrl: string;
  zIndex: Int;
  modalId: string;

  constructor(model_elem: any, config: any = null) {
    config = config || {};
    this.modalElement = model_elem;
    this.zIndex = config.zIndex || 500;
    this.bgColor = config.bgColor || "rgba(10, 10, 10, .6)";
    this.imageUrl = config.imageUrl || "http://i.stack.imgur.com/FhHRx.gif";
    this.modalId = config.modalId || "modal";
    this.setupViews();
  }

  setupViews() {
    this.modalElement.css("position", "absolute");
    this.modalElement.css("z-index", this.zIndex);
    this.modalElement.css("left", "0px");
    this.modalElement.css("top", "0px");
    this.modalElement.css("bottom", "0px");
    this.modalElement.css("right", "0px");
    this.modalElement.css(
      "background",
      this.bgColor +
        "\n" +
        "url('" +
        this.imageUrl +
        "')\n" +
        "50% 50%\n" +
        "no-repeat"
    );
    this.modalElement.hide();
  }

  show() {
    // this.modalElement.css("height", "100%");
    // this.modalElement.css("width", "100%");
    this.modalElement.show();
  }

  hide() {
    this.modalElement.hide();
  }
}
