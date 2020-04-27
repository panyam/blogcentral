
// import "webpack-jquery-ui/button";
// import "webpack-jquery-ui/css";
import { Int, Nullable } from "./types";
import { Store } from "./stores";
import { AddSiteDialog, SiteListView, SiteLoginDialog } from "./views";
import { Post, Site, SiteService } from "./models";
import { SiteGateway } from "./gateway";
import { HttpClient } from "./net";

export class App {
    addSiteDialog : AddSiteDialog
    siteListView : SiteListView
    siteLoginDialog : SiteLoginDialog
    siteService : SiteService
    httpClient : HttpClient
    siteGateway : SiteGateway
    store : Store
    addSiteButton : any

    constructor(store : Store, httpClient : HttpClient) {
        var self = this;
        this.store = store;
        this.httpClient = httpClient;
        this.siteService = new SiteService(store);

        this.addSiteDialog = new AddSiteDialog("add_site_dialog");

        this.addSiteButton = $( "#add_site_button" )
        this.addSiteButton.button().on( "click", function() {
            self.addSiteDialog.open()
                .then(site => {
                    self.siteService.addSite(site as Site).then(() => {
                        self.siteListView.refresh();
                    });
                });
        });

        this.siteLoginDialog = new SiteLoginDialog("site_login_dialog");

        this.siteListView = new SiteListView("site_list_div", this.siteService);
        this.siteService.loadAll().then(() => {
            self.siteListView.refresh();
        });
        this.siteListView.onConnectSite = function(site : Site, index : Int) {
            self.siteListView.setConnecting(index, true);
            self.siteGateway.getPosts(site)
            .then((posts : Post[]) => {
                console.log("Connected to Site: ", site);
                self.siteListView.setConnecting(index, false);
            });
        };
        this.siteGateway = new SiteGateway(this.siteService, this.siteLoginDialog, this.httpClient);
    }
};
