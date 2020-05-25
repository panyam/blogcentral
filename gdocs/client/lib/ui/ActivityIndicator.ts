import { View } from "./Views";
import { Int } from "../types";

export class ActivityIndicator extends View<any> {
  bgColor: any;
  imageUrl: string;
  zIndex: Int;
  modalId: string;

  constructor(modal_elem: any, config: any = null) {
    super(modal_elem, null, null);
    config = config || {};
    this.zIndex = config.zIndex || 500;
    this.bgColor = config.bgColor || "rgba(10, 10, 10, .6)";
    this.imageUrl = config.imageUrl || "http://i.stack.imgur.com/FhHRx.gif";
    this.modalId = config.modalId || "modal";
  }

  setupViews() {
    super.setupViews();
    this.rootElement.css("position", "absolute");
    this.rootElement.css("z-index", this.zIndex);
    this.rootElement.css("left", "0px");
    this.rootElement.css("top", "0px");
    this.rootElement.css("bottom", "0px");
    this.rootElement.css("right", "0px");
    this.rootElement.css(
      "background",
      this.bgColor +
        "\n" +
        "url('" +
        this.imageUrl +
        "')\n" +
        "50% 50%\n" +
        "no-repeat"
    );
    this.rootElement.hide();
  }

  show() {
    // this.rootElement.css("height", "100%");
    // this.rootElement.css("width", "100%");
    this.rootElement.show();
  }

  hide() {
    this.rootElement.hide();
  }
}
