
// import "webpack-jquery-ui/button";
// import "webpack-jquery-ui/css";
import { Int, Nullable } from "./types";
import { SiteLoginDialog } from "./ui/SiteLoginDialog";
import { SitesPanel } from "./ui/SitesPanel";
import { PostSelector } from "./ui/SiteListView";
import { PostsPanel } from "./ui/PostsPanel";
import { Post, Site, } from "./models";
import { SiteGateway } from "./gateway";
import { ServiceCatalog } from "./catalog";

export class App implements PostSelector {
    sitesPanel : SitesPanel
    postsPanel : PostsPanel
    services : ServiceCatalog

    constructor(services : ServiceCatalog) {
        this.services = services;
        this.sitesPanel = new SitesPanel("sites_panel_div", services);
        this.sitesPanel.siteListView.postSelector = this;
        this.postsPanel = new PostsPanel("posts_panel_div", services);
        services.siteLoginProvider = new SiteLoginDialog("site_login_dialog", services);
    }

    /**
     * Lets one select one or more posts in a site.
     */
    async selectPosts(site : Site, index : Int) {
        var posts : Post[] = await this.postsPanel.open(site);
        return [];
    }
};
