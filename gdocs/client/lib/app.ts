
// import "webpack-jquery-ui/button";
// import "webpack-jquery-ui/css";
import { Int, Nullable } from "./types";
import { SitesPanel, SiteLoginDialog, PostsPanel } from "./views";
import { Post, Site, } from "./models";
import { SiteGateway } from "./gateway";
import { ServiceCatalog } from "./catalog";

export class App {
    postsPanelDiv : any
    sitesPanel : SitesPanel
    postsPanel : PostsPanel
    siteLoginDialog : SiteLoginDialog
    siteGateway : SiteGateway
    services : ServiceCatalog

    constructor(services : ServiceCatalog) {
        this.services = services;
        this.siteLoginDialog = new SiteLoginDialog("site_login_dialog");
        this.sitesPanel = new SitesPanel("sites_panel_div", services);
        this.postsPanel = new PostsPanel("posts_panel_div", services);

        var self = this;
        var siteListView = this.sitesPanel.siteListView;
        siteListView.onConnectSite = function(site : Site, index : Int) {
            self.postsPanel.show();
            /*
            $("div").animate({left: '250px'});

            siteListView.setConnecting(index, true);
            self.siteGateway.getPosts(site)
            .then((posts : Post[]) => {
                console.log("Connected to Site: ", site);
                siteListView.setConnecting(index, false);
            });
           */
        };
        this.siteGateway = new SiteGateway(this.services, this.siteLoginDialog);
    }
};
