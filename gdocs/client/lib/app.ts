
// import "webpack-jquery-ui/button";
// import "webpack-jquery-ui/css";
import { Int, Nullable } from "./types";
import { SitesPanel, SiteLoginDialog, PostsPanel, PostSelector } from "./views";
import { Post, Site, } from "./models";
import { SiteGateway } from "./gateway";
import { ServiceCatalog } from "./catalog";

export class App implements PostSelector {
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
        this.sitesPanel.siteListView.postSelector = this;

        this.postsPanel = new PostsPanel("posts_panel_div", services);
        this.siteGateway = new SiteGateway(this.services, this.siteLoginDialog);
    }

    /**
     * Lets one select one or more posts in a site.
     */
    async selectPosts(site : Site, index : Int) {
        var posts : Post[] = await this.postsPanel.open();
        return [];
    }
};
