
// import "webpack-jquery-ui/button";
// import "webpack-jquery-ui/css";
import { Store } from "./stores";
import { AddSiteDialog, SiteListView, SiteLoginDialog } from "./views";
import { Site, SiteService } from "./models";
import { SiteConnector } from "./auth";
declare var CLIENT_ENV : string;

export class App {
    addSiteDialog : AddSiteDialog
    siteLoginDialog : SiteLoginDialog
    siteListView : SiteListView
    siteService : SiteService
    siteConnector : SiteConnector
    store : Store
    addSiteButton : any

    constructor(store : Store) {
        var self = this;
        this.store = store;
        this.siteService = new SiteService(store);

        this.addSiteDialog = new AddSiteDialog("add_site_dialog");
        this.addSiteDialog.onConfirm = function(site : Site) {
            self.siteService.addSite(site).then(() => {
                self.siteListView.refresh();
            });
        };

        this.addSiteButton = $( "#add_site_button" )
        this.addSiteButton.button().on( "click", function() {
            self.addSiteDialog.open();
        });

        this.siteLoginDialog = new SiteLoginDialog("site_login_dialog");

        this.siteListView = new SiteListView("site_list_div", this.siteService);
        this.siteService.loadAll().then(() => {
            self.siteListView.refresh();
        });
        this.siteListView.onConnectSite = function(site : Site) {
            console.log("Connecting to Site at: ", site);
            self.siteLoginDialog.site = site;
            self.siteLoginDialog.open();
        };
        this.siteLoginDialog.onConfirm = function(credentials : any) {
            var site = self.siteLoginDialog.site;
            console.log("Login Confirmed: ", site, credentials, CLIENT_ENV);
        };
    }
};
