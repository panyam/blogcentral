import { ensureElement } from "./utils";
import { Nullable } from "../types";

export class View<EntityType> {
  rootElement: any;
  protected _template: any;
  readonly configs: any;
  readonly zIndex: number;
  protected _entity: Nullable<EntityType>;
  private entityUpdated = true;
  private _viewsCreated = false;

  constructor(
    elem_or_id: any,
    entity: Nullable<EntityType>,
    configs: any = null
  ) {
    configs = configs || {};
    this._entity = entity;
    this.configs = configs;
    this.zIndex = configs.zIndex || 1000;
    this.rootElement = ensureElement(elem_or_id);
    this._template = configs.template || "<div>Hello World</div>";
  }

  get viewsCreated() {
    return this._viewsCreated;
  }

  setUpdated() {
    this.entityUpdated = true;
    if (this._entity != null) {
      this.updateViews(this._entity);
    } else {
      this.clearViews();
    }
  }

  get entity(): Nullable<EntityType> {
    if (this.entityUpdated) {
      this._entity = this.extractEntity();
      this.entityUpdated = false;
    }
    return this._entity;
  }

  set entity(entity: Nullable<EntityType>) {
    if (this.isEntityValid(entity)) {
      this._entity = entity;
      this.setUpdated();
    }
  }

  protected isEntityValid(_entity: Nullable<EntityType>) {
    return true;
  }

  protected extractEntity(): Nullable<EntityType> {
    return this._entity;
  }

  protected clearViews() {}

  protected updateViews(_entity: EntityType) {}

  /**
   * This method is called to create the view hierarchy of this view.
   * When this method is called the binding to the model has not yet
   * happened and should not expect any presence of data/models
   * to populate the views with.
   */
  setup(): this {
    this.setupViews();
    this._viewsCreated = true;
    return this;
  }

  protected setupViews() {
    this.rootElement.html(this.html());
    this.rootElement.css("z-Index", this.zIndex);
  }

  html() {
    return this._template;
  }
}

export class Dialog<EntityType> extends View<EntityType> {
  dialog: any;
  resolveFunc: any;
  rejectFunc: any;
  protected _buttons: any;

  setup(): this {
    super.setup();
    var self = this;
    this.dialog = this.rootElement.dialog({
      autoOpen: false,
      position: { my: "center top", at: "center top", of: window },
      modal: true,
      close: function () {
        self.onClosed();
      },
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

  close(data: Nullable<any> = null) {
    if (this.resolveFunc != null) {
      this.resolveFunc(data);
    }
    this.dialog.dialog("close");
  }

  buttons() {
    return this._buttons;
  }
}

export class FormDialog<EntityType> extends Dialog<EntityType> {
  errorMessageElem: JQuery<HTMLElement>;
  allFields: JQuery<any>;
  form: any;
  dialog: any;
  html() {
    return (
      `<form>
        <fieldset class = "dialog_fields">` +
      super.html() +
      `     <input type="submit" tabindex="-1" 
                   style="position:absolute; top:-1000px">
            <span class = "error_message_span"></span>
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

  setup(): this {
    super.setup();
    this.errorMessageElem = this.rootElement.find(".error_message_span");
    this.allFields = $([]);
    this.form = this.dialog.find("form").on("submit", function (e: any) {
      e.preventDefault();
    });
    return this;
  }

  onClosed() {
    this.form[0].reset();
    this.allFields.removeClass("ui-state-error");
  }
}
