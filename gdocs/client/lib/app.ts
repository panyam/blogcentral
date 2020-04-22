
// import "webpack-jquery-ui/button";
// import "webpack-jquery-ui/css";
import { Store } from "./stores";
import { AddSiteDialog, SiteListView } from "./views";
import { Site, SiteList } from "./models";

export class App {
    newSiteDialog : AddSiteDialog
    siteListView : SiteListView
    siteList : SiteList
    store : Store
    addSiteButton : any

    constructor(store : Store) {
        var self = this;
        this.store = store;
        this.siteList = new SiteList(store);
        this.newSiteDialog = new AddSiteDialog("new_site_dialog");
        this.newSiteDialog.onConfirm = function(site : Site) {
            self.siteList.addSite(site);
            self.siteListView.refresh();
        };

        this.addSiteButton = $( "#add_site_button" )
        this.addSiteButton.button().on( "click", function() {
            self.newSiteDialog.open();
        });

        this.siteListView = new SiteListView("site_list_div", this.siteList);
        this.siteList.loadAll(function() {
            self.siteListView.refresh();
        });
    }
};
