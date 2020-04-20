
// import "webpack-jquery-ui/button";
// import "webpack-jquery-ui/css";
import { AddSiteDialog } from "./views";

export class App {
    localStorageExists : boolean = false
    newSiteDialog : AddSiteDialog
    constructor() {
        var self = this;
        this.localStorageExists = typeof(Storage) !== "undefined";
        this.newSiteDialog = new AddSiteDialog("new_site_dialog");
        if (!this.localStorageExists) {
            $("#site_list").html("You do not have local storage enabled.");
        } else {
        }
        ($( "#add_site_button" ) as any).button().on( "click", function() {
            self.newSiteDialog.open();
        });
    }
}
