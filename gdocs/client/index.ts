// import `.scss` files
// var $ = import("jquery"); import("jquery-ui");

import './scss/styles.scss';

import { BCJS } from './lib/index';

// export default UserList class
// I used `defaultExport` to state that variable name doesn't matter
export default BCJS;

var localStorageExists = typeof(Storage) !== "undefined";
function setupUi(callback : any) {
    if (!localStorageExists) {
        $("#site_list").html("You do not have local storage enabled.");
    } else {
    }
    callback();
}

// function addNewSite() { alert("ok"); }

// Attach click handlers after the Sidebar has loaded in Google Docs
$(function() {
    alert("Loaded Everything");
    /*
    var newSiteDialog = new AddSiteDialog("new_site_dialog");
    setupUi(function() {
        $( "#add_site_button" ).button().on( "click", function() {
            newSiteDialog.open();
        });
    });
    */
});
