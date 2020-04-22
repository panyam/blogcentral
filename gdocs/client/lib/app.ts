
// import "webpack-jquery-ui/button";
// import "webpack-jquery-ui/css";
import { AddSiteDialog, SiteListView } from "./views";
import { Site, SiteList } from "./models";

export class App {
    newSiteDialog : AddSiteDialog
    siteListView : SiteListView
    siteList : SiteList

    constructor() {
        var self = this;
        this.siteList = new SiteList();
        this.newSiteDialog = new AddSiteDialog("new_site_dialog");
        this.newSiteDialog.onConfirm = function(site : Site) {
            self.siteList.addSite(site);
            self.siteListView.refresh();
        };
        this.siteListView = new SiteListView("site_list_div", this.siteList);

        if (!this.localStorageExists) {
            $("#site_list_div").html("You do not have local storage enabled.");
        } else {
        }
        ($( "#add_site_button" ) as any).button().on( "click", function() {
            self.newSiteDialog.open();
        });
    }

    get localStorageExists() : boolean {
        return typeof(Storage) !== "undefined";
    }
}
