
// import "webpack-jquery-ui/button";
// import "webpack-jquery-ui/css";
import { Int, Nullable } from "./types";
import { SiteLoginDialog } from "./ui/SiteLoginDialog";
import { SitesPanel } from "./ui/SitesPanel";
import { PostSelector } from "./ui/SiteListView";
import { PostsPanel } from "./ui/PostsPanel";
import { Post, Site, } from "./models";
import { SiteGateway } from "./gateway";
import { SiteLoginProvider } from "./auth";
import { ServiceCatalog } from "./catalog";

export class App implements PostSelector, SiteLoginProvider {
    sitesPanel : SitesPanel
    postsPanel : PostsPanel
    siteLoginDialog : SiteLoginDialog
    services : ServiceCatalog

    constructor(services : ServiceCatalog) {
        this.services = services;
        this.siteLoginDialog = new SiteLoginDialog("site_login_dialog");
        this.sitesPanel = new SitesPanel("sites_panel_div", services);
        this.sitesPanel.siteListView.postSelector = this;
        services.siteLoginProvider = this;

        this.postsPanel = new PostsPanel("posts_panel_div", services);
    }

    /**
     * Lets one select one or more posts in a site.
     */
    async selectPosts(site : Site, index : Int) {
        var posts : Post[] = await this.postsPanel.open(site);
        return [];
    }

    async startLogin(site : Site) : Promise<Nullable<Site>> {
        this.siteLoginDialog.site = site;
        var credentials : any = await this.siteLoginDialog.open();
        return credentials;
    }

    cancelLogin() : void {
        this.siteLoginDialog.close();
    }

    loginFailed(error : Nullable<Error> = null, message : string = "") : void {
        this.siteLoginDialog.errorMessage = message;
    }
};
