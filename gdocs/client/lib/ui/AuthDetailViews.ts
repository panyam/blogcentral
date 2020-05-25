import { ActivityIndicator } from "./ActivityIndicator";
import { View } from "./Views";
import { valOrDefault } from "../utils"

export class AuthDetailView extends View<any> {
  activityIndicator: ActivityIndicator;
  allFields: JQuery<any>;

  constructor(elem_or_id: any, authConfig: any = null) {
    super(elem_or_id, authConfig || {});
    this.renderAsTemplate = true;
    this.entityName = "authConfig";
  }
}

export class TokenAuthDetailView extends AuthDetailView {
  tokenLabel: JQuery<HTMLElement>;
  tokenElem: JQuery<HTMLElement>;
  expiresAtLabel: JQuery<HTMLElement>;
  expiresAtElem: JQuery<HTMLElement>;

  setupViews() {
    super.setupViews();
    this.tokenElem = this.rootElement.find("#token");
    this.tokenLabel = this.rootElement.find("label[for='token']");
    this.expiresAtElem = this.rootElement.find("#expiresAt");
    this.expiresAtLabel = this.rootElement.find("label[for='expiresAt']");
  }

  extractEntity() {
    return { token: this.tokenElem.val() || "" } as any;
    // this._entity["expiresAt"] = this.expiresAtElem.val();
  }

  protected updateViews(entity: any) {
    this.tokenElem.val(entity.token || "");
    // this.expiresAtElem.val(_entity.expiresAt);
  }

  template(): string {
    return `
        <label for="token">Token</label>
        <input type="text" name="token" id="token" class="text ui-widget-content ui-corner-all" />
    <!--
        <label for="expiresAt">Expires At</label>
        <input type="date" name="expiresAt" id="expiresAt" value="" class="text ui-widget-content ui-corner-all" />
        -->
      `;
  }
}

/**
 * A view to capture details about logging into publicly hosted wordpress site.
 */
export class JWTAuthDetailView extends TokenAuthDetailView {
  tokenUrlLabel: JQuery<HTMLElement>;
  tokenUrlElem: JQuery<HTMLElement>;
  validateUrlLabel: JQuery<HTMLElement>;
  validateUrlElem: JQuery<HTMLElement>;

  setupViews() {
    super.setupViews();
    this.tokenUrlElem = this.rootElement.find("#tokenUrl");
    this.tokenUrlLabel = this.rootElement.find("label[for='tokenUrl']");
    this.validateUrlElem = this.rootElement.find("#validateUrl");
    this.validateUrlLabel = this.rootElement.find("label[for='validateUrl']");
    this.tokenLabel.html("Current Token (optional)");
  }

  extractEntity() {
    var entity: any = super.extractEntity();
    entity["tokenUrl"] = valOrDefault(this.tokenUrlElem.val(),"/wp-json/jwt-auth/v1/token");
    entity["validateUrl"] = valOrDefault(this.validateUrlElem.val(), "/wp-json/jwt-auth/v1/token/validate");
    return entity;
  }

  protected updateViews(entity: any) {
    super.updateViews(entity);
    this.tokenUrlElem.val(valOrDefault(entity.tokenUrl, "/wp-json/jwt-auth/v1/token"));
    this.validateUrlElem.val(valOrDefault(entity.validateUrl, "/wp-json/jwt-auth/v1/token/validate"));
  }

  template(): string {
    return (
      `
        <label for="tokenUrl">Token URL</label>
        <input type="text" name="tokenUrl" id="tokenUrl" class="text ui-widget-content ui-corner-all" />
        <label for="validateUrl">Validate URL</label>
        <input type="text" name="validateUrl" id="validateUrl" class="text ui-widget-content ui-corner-all" />
    ` + super.template()
    );
  }
}

export class OAuth2AuthDetailView extends AuthDetailView {
  template(): string {
    return `
    I Got nothing yet!!!
      `;
  }
}
