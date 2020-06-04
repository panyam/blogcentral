import { TokenAuthDetailView } from "../tokenauth/ui";
import { AUTH_TYPE_LOGIN } from "./core";
import { ILoginAuthDetailView } from "./interfaces";

/**
 * A view to capture details about logging into publicly hosted wordpress site.
 */
export class LoginAuthDetailView extends TokenAuthDetailView
  implements ILoginAuthDetailView {
  tokenUrlLabel: any;
  tokenUrlElem: any;
  validateUrlLabel: any;
  validateUrlElem: any;

  setupViews() {
    super.setupViews();
    this.tokenUrlElem = this.findElement("#tokenUrl");
    this.tokenUrlLabel = this.findElement("label[for='tokenUrl']");
    this.validateUrlElem = this.findElement("#validateUrl");
    this.validateUrlLabel = this.findElement("label[for='validateUrl']");
    this.tokenLabel.html("Current Token (optional)");
  }

  get tokenUrl() {
    return this.tokenUrlElem.val() as string;
  }
  set tokenUrl(t: string) {
    this.tokenUrlElem.val(t);
  }
  get validateUrl() {
    return this.validateUrlElem.val() as string;
  }
  set validateUrl(t: string) {
    this.validateUrlElem.val(t);
  }

  elementsFor(fieldName: string): any[] {
    if (fieldName == "tokenUrl") {
      return [this.tokenUrlLabel, this.tokenUrlElem];
    } else if (fieldName == "validateUrl") {
      return [this.validateUrlLabel, this.validateUrlElem];
    }
    return super.elementsFor(fieldName);
  }

  extractEntity() {
    var entity: any = super.extractEntity();
    entity["authType"] = AUTH_TYPE_LOGIN;
    entity["tokenUrl"] = this.tokenUrlElem.val();
    entity["validateUrl"] = this.validateUrlElem.val();
    return entity;
  }

  template(): string {
    return `
        <label for="authBaseUrl">Auth Base Url</label>
        <input type="text" name="authBaseUrl" id="authBaseUrl" 
               class="text ui-widget-content ui-corner-all" 
               value = "{{eitherVal authConfig.authBaseUrl Defaults.TokenAuthClient.AuthBaseUrl }}"/>

        <label for="tokenUrl">Token URL</label>
        <input type="text" name="tokenUrl" id="tokenUrl" class="text ui-widget-content ui-corner-all" 
               value = "{{ eitherVal authConfig.tokenUrl Defaults.LoginAuthClient.TokenUrl }}"/>

        <label for="validateUrl">Validate URL</label>
        <input type="text" name="validateUrl" id="validateUrl" class="text ui-widget-content ui-corner-all" 
               value = "{{ eitherVal authConfig.validateUrl Defaults.LoginAuthClient.ValidateUrl }}"/>

        <label for="token">Token</label>
        <input type="text" name="token" id="token" 
               class="text ui-widget-content ui-corner-all" 
               value = "{{authConfig.token}}"/>
    `;
  }
}
