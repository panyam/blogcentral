import "../../styles/SitesPanel";
import { SiteInputDialog } from "./SiteInputDialog";
import { ActivityIndicator } from "./ActivityIndicator";
import { SiteListView } from "./SiteListView";
import { ensureElement, ensureCreated } from "./utils";
import { View } from "./Views";
import { Nullable } from "../types";
import { PostsPanel } from "./PostsPanel";
import { Site } from "../siteapis";
import { App } from "../app";

declare var AuthResults: any[];

export class SitesPanel extends View<null> {
  addSiteDialog: Nullable<SiteInputDialog> = null;
  clearButton: any;
  addButton: any;
  siteListView: SiteListView;
  app: App;
  activityIndicator: ActivityIndicator;

  constructor(elem_or_id: string, app: App) {
    super(elem_or_id, null, null);
    this.app = app;
  }

  setupViews() {
    var self = this;
    var aidiv = this.findElement(".activity_indicator");
    this.activityIndicator = new ActivityIndicator(aidiv).setup();

    var siteListDiv = this.findElement("#site_list_div");
    this.siteListView = new SiteListView(siteListDiv, this.app).setup();

    this.clearButton = this.findElement("#clear_button");
    this.clearButton.button().on("click", function () {
      self.app.siteService.clear();
    });

    this.addButton = this.findElement("#add_button");
    this.addButton.button().on("click", function () {
      self.showAddSiteDialog().then((site: Site) => {
        if (site != null) {
          self.app.siteService.addSite(site as Site).then(() => {
            self.siteListView.refreshViews();
          });
        }
      });
    });

    var siteService = this.app.siteService;
    siteService.loadAll().then(() => {
      siteService.sites.forEach((site: Site) => {
        var authManager = self.app.managerForAuth(site.authType);
        var client = authManager.createAuthClient(site.authConfig);
        AuthResults.forEach((authResult: any) => {
          if (typeof authResult["state"] === "string")
            authResult["state"] = JSON.parse(authResult["state"]);
          client.completeAuthFlow(authResult);
        });
      });
      self.siteListView.entity = self.app.siteService.sites;
    });
  }

  async showAddSiteDialog() {
    if (this.addSiteDialog == null) {
      var addSiteDialogElem: any = ensureCreated(
        "add_site_dialog",
        this.rootElement
      );
      this.addSiteDialog = new SiteInputDialog(
        addSiteDialogElem,
        this.app,
        true
      ).setup();
    }
    this.addSiteDialog.refreshViews();
    return this.addSiteDialog.open();
  }
}
