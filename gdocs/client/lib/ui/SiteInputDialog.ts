import { setEnabled } from "./utils";
import { View, FormDialog } from "./Views";
import { Site, SiteType } from "../siteapis";
import { App } from "../app";

export class SiteInputDialog extends FormDialog<Site> {
  siteTypeElem: JQuery<HTMLElement>;
  siteDetailElem: JQuery<HTMLElement>;
  siteInputView: View<Site>;
  app: App;
  addingSiteMode: boolean = true;

  constructor(elem_or_id: any, app: App, addingSiteMode: boolean) {
    super(elem_or_id, "site", null, {
      template: `
        <label for="platform">Platform</label>
        <select id = "platform">
            {{#eachInMap App.siteApiFactories}}
            <option value="{{key}}">{{key}}</option>
            {{/eachInMap}}
        </select>
        <div class = "site_details_view"></div>
    `,
    });
    this.app = app;
    this.addingSiteMode = addingSiteMode;
  }

  enrichViewParams(viewParams: any): any {
    viewParams = super.enrichViewParams(viewParams);
    viewParams["App"] = this.app;
    return viewParams;
  }

  setupViews() {
    var self = this;
    super.setupViews();
    this.allFields.add(this.siteTypeElem);
    this.siteTypeElem = this.findElement("select");
    if (this.entity != null) {
      this.selectedSiteType = this.entity.siteType;
    }
    this.siteTypeElem.change(function (_evt: any) {
      self.onSiteTypeChanged();
    });
    this.onSiteTypeChanged();
  }

  set selectedSiteType(siteType: SiteType) {
    this.siteTypeElem.val(siteType);
    this.onSiteTypeChanged();
  }

  get selectedSiteType(): SiteType {
    return this.siteTypeElem.val() as SiteType;
  }

  onSiteTypeChanged() {
    var siteType = this.selectedSiteType;
    console.log("Selected Type: ", siteType);

    setEnabled(this.siteTypeElem, this.addingSiteMode);
    // show the different view based on the type
    this.siteDetailElem = this.findElement(".site_details_view");
    this.siteInputView = this.app.createSiteView(
      siteType,
      "input",
      this.siteDetailElem,
      null
    );
  }

  extractEntity() {
    return this.siteInputView ? this.siteInputView.entity : null;
  }

  buttons(): any {
    var self = this;
    var out: any = {
      Cancel: function () {
        self.close(null);
      },
    };
    if (this.addingSiteMode) {
      out["Add Site"] = function () {
        self.close(self.entity);
      };
    } else {
      out["Login"] = function () {
        self.errorMessageElem.html("");
        if (self.resolveFunc != null) {
          self.resolveFunc(null /*self.credentials*/);
        }
      };
    }
    return out;
  }
}
