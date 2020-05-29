import { TokenAuthDetailView } from "../tokenauth/ui";
import { valOrDefault } from "../utils";

/**
 * A view to capture details about logging into publicly hosted wordpress site.
 */
export class LoginAuthDetailView extends TokenAuthDetailView {
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
