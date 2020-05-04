
// import "webpack-jquery-ui/button";
// import "webpack-jquery-ui/css";
import { Int, Nullable } from "./types";
import { SiteLoginDialog } from "./ui/SiteLoginDialog";
import { SitesPanel } from "./ui/SitesPanel";
import { ServiceCatalog } from "./catalog";

export class App {
    sitesPanel : SitesPanel
    services : ServiceCatalog

    constructor(services : ServiceCatalog) {
        this.services = services;
        this.sitesPanel = new SitesPanel("sites_panel_div", services);
        services.siteLoginProvider = new SiteLoginDialog("site_login_dialog", services);
    }
};
