import { setEnabled } from "./utils";
import { FormDialog } from "./Views";
import {
  SiteInputView,
  WPSiteInputView,
  MediumSiteInputView,
  LISiteInputView,
} from "./SiteInputViews";
import { Nullable } from "../types";
import { SiteType } from "../interfaces";
import { Site } from "../sites";
import { App } from "../app";

export class SiteInputDialog extends FormDialog {
  siteTypeElem: JQuery<HTMLElement>;
  siteDetailElem: JQuery<HTMLElement>;
  siteInputView: SiteInputView;
  app: App;
  addingSiteMode: boolean = true;

  constructor(elem_or_id: any, app: App, addingSiteMode: boolean) {
    super(elem_or_id, {
      template: `
        <label for="platform">Platform</label>
        <select id = "platform">
            <option value="WORDPRESS">WordPress Blog</option>
            <option value="MEDIUM">Medium</option>
            <option value="LINKEDIN">LinkedIn</option>
        </select>
        <div class = "site_details_view"></div>
    `,
    });
    this.app = app;
    this.addingSiteMode = addingSiteMode;
  }

  set selectedSiteType(siteType: SiteType) {
    if (siteType == SiteType.WORDPRESS) {
      this.siteTypeElem.val("WORDPRESS");
    } else if (siteType == SiteType.LINKEDIN) {
      this.siteTypeElem.val("LINKEDIN");
    } else if (siteType == SiteType.MEDIUM) {
      this.siteTypeElem.val("MEDIUM");
    }
    this.onSiteTypeChanged();
  }

  get selectedSiteType(): SiteType {
    var siteType = this.siteTypeElem.val();
    if (siteType == "WORDPRESS") {
      return SiteType.WORDPRESS;
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

    // show the different view based on the type
    this.siteDetailElem = this.rootElement.find(".site_details_view");
    if (siteType == SiteType.WORDPRESS)
      this.siteInputView = new WPSiteInputView(this.siteDetailElem).setup();
    else if (siteType == SiteType.MEDIUM)
      this.siteInputView = new MediumSiteInputView(this.siteDetailElem).setup();
    else if (siteType == SiteType.LINKEDIN)
      this.siteInputView = new LISiteInputView(this.siteDetailElem).setup();
  }

  get site() {
    return this.siteInputView ? this.siteInputView.site : null;
  }
  set site(s: Nullable<Site>) {
    if (s != null) {
      this.selectedSiteType = s.siteType;
    } else {
      this.selectedSiteType = SiteType.WORDPRESS;
    }
    setEnabled(this.siteTypeElem, s == null);
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
        self.close(self.site);
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

  setup(): this {
    var self = super.setup();
    this.allFields.add(this.siteTypeElem);
    this.siteTypeElem = this.rootElement.find("select");
    if (this.site != null) {
      this.selectedSiteType = this.site.siteType;
    } else {
      this.selectedSiteType = SiteType.WORDPRESS;
    }
    this.siteTypeElem.change(function (_evt: any) {
      self.onSiteTypeChanged();
    });
    this.onSiteTypeChanged();
    return this;
  }
}