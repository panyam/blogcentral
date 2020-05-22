import { ensureElement } from "./utils";
import { Nullable } from "../types";

export class Dialog {
  rootElement: any;
  dialog: any;
  resolveFunc: any;
  rejectFunc: any;
  readonly _buttons: any;
  readonly _template: any;

  constructor(elem_or_id: any, configs: any = null) {
    configs = configs || {};
    var self = this;
    this.rootElement = ensureElement(elem_or_id);
    this._template = configs.template || "<div>Hello World</div>";
    this._buttons = configs.buttons || {
      Cancel: function () {
        self.close(null);
      },
    };

    this.setupViews();
    this.rootElement.css("z-Index", 1000);
  }

  get template() {
    return this._template;
  }

  renderTemplate() {
    return this.template;
  }

  setupViews() {
    var self = this;
    this.rootElement.html(this.renderTemplate());
    this.dialog = this.rootElement.dialog({
      autoOpen: false,
      position: { my: "center top", at: "center top", of: window },
      modal: true,
      close: self.onClosed(),
    });
    return this;
  }

  onClosed() {}

  async open() {
    var self = this;
    return new Promise((resolve, reject) => {
      self.resolveFunc = resolve;
      self.rejectFunc = reject;
      this.dialog.dialog("option", "buttons", self.buttons()).dialog("open");
    });
  }

  buttons() {
    return this._buttons;
  }

  close(data: Nullable<any> = null) {
    if (this.resolveFunc != null) {
      this.resolveFunc(data);
    }
    this.dialog.dialog("close");
  }
}

export class FormDialog extends Dialog {
  errorMessageElem: JQuery<HTMLElement>;
  allFields: JQuery<any>;
  form: any;
  dialog: any;
  renderTemplate() {
    return (
      `<form>
        <fieldset class = "dialog_fields">` +
      super.renderTemplate() +
      `
            <input type="submit" tabindex="-1" 
                   style="position:absolute; top:-1000px">
            <span id = "error_message_span"></span>
        </fieldset>
      </form>`
    );
  }

  get errorMessage(): string {
    return this.errorMessageElem.html();
  }

  set errorMessage(html: string) {
    this.errorMessageElem.html(html);
  }

  setupViews() {
    var self = super.setupViews();
    this.errorMessageElem = this.rootElement.find("#error_message_span");
    this.allFields = $([]);
    this.form = this.dialog.find("form").on("submit", function (e: any) {
      e.preventDefault();
    });
    return self;
  }

  onClosed() {
    this.form[0].reset();
    this.allFields.removeClass("ui-state-error");
  }
}
