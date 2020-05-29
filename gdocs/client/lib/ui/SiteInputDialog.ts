import { setEnabled } from "./utils";
import { FormDialog } from "./Views";
import { SiteInputView, createSiteInputView } from "./SiteInputViews";
import { SiteType } from "../enums";
import { Site } from "../models";
import { App } from "../app";

export class SiteInputDialog extends FormDialog<Site> {
  siteTypeElem: JQuery<HTMLElement>;
  siteDetailElem: JQuery<HTMLElement>;
  siteInputView: SiteInputView;
  app: App;
  addingSiteMode: boolean = true;

  constructor(elem_or_id: any, app: App, addingSiteMode: boolean) {
    super(elem_or_id, "site", null, {
      template: `
        <label for="platform">Platform</label>
        <select id = "platform">
            <option value="PUBLIC_WORDPRESS">Public WordPress Blog</option>
            <option value="HOSTED_WORDPRESS">Hosted WordPress Blog</option>
            <option value="MEDIUM">Medium</option>
            <option value="LINKEDIN">LinkedIn</option>
        </select>
        <div class = "site_details_view"></div>
    `,
    });
    this.app = app;
    this.addingSiteMode = addingSiteMode;
  }

  setupViews() {
    var self = this;
    super.setupViews();
    this.allFields.add(this.siteTypeElem);
    this.siteTypeElem = this.rootElement.find("select");
    if (this.entity != null) {
      this.selectedSiteType = this.entity.siteType;
    } else {
      this.selectedSiteType = SiteType.HOSTED_WORDPRESS;
    }
    this.siteTypeElem.change(function (_evt: any) {
      self.onSiteTypeChanged();
    });
    this.onSiteTypeChanged();
  }

  set selectedSiteType(siteType: SiteType) {
    if (siteType == SiteType.HOSTED_WORDPRESS) {
      this.siteTypeElem.val("HOSTED_WORDPRESS");
    } else if (siteType == SiteType.PUBLIC_WORDPRESS) {
      this.siteTypeElem.val("PUBLIC_WORDPRESS");
    } else if (siteType == SiteType.LINKEDIN) {
      this.siteTypeElem.val("LINKEDIN");
    } else if (siteType == SiteType.MEDIUM) {
      this.siteTypeElem.val("MEDIUM");
    }
    this.onSiteTypeChanged();
  }

  get selectedSiteType(): SiteType {
    var siteType = this.siteTypeElem.val();
    if (siteType == "HOSTED_WORDPRESS") {
      return SiteType.HOSTED_WORDPRESS;
    } else if (siteType == "PUBLIC_WORDPRESS") {
      return SiteType.PUBLIC_WORDPRESS;
    } else if (siteType == "MEDIUM") {
      return SiteType.MEDIUM;
    } else if (siteType == "LINKEDIN") {
      return SiteType.LINKEDIN;
    }
    return -1;
  }

  onSiteTypeChanged() {
    var siteType = this.selectedSiteType;
    console.log("Selected Type: ", siteType);

    setEnabled(this.siteTypeElem, this.addingSiteMode);
    // show the different view based on the type
    this.siteDetailElem = this.rootElement.find(".site_details_view");
    this.siteInputView = createSiteInputView(siteType, this.siteDetailElem);
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
