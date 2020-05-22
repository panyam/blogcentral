// import "webpack-jquery-ui/button";
// import "webpack-jquery-ui/css";
import { Int, Nullable } from "./types";
import { SiteDetailDialog } from "./ui/SiteDetailDialog";
import { SitesPanel } from "./ui/SitesPanel";
import { ServiceCatalog } from "./catalog";

export class App {
  sitesPanel: SitesPanel;
  services: ServiceCatalog;

  constructor(services: ServiceCatalog) {
    this.services = services;
    this.sitesPanel = new SitesPanel("sites_panel_div", services);
    services.siteLoginProvider = new SiteDetailDialog(
      "site_login_dialog",
      services
    );
  }
}
