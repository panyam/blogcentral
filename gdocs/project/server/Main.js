
function onChange(e) {
  Logger.log("On Change Now: ", e);
}

function onInstall(e) {
    onOpen();
}

function onOpen() {
//    SpreadsheetApp.getUi()
//    .createMenu('Project Plan')
//    .addItem("Refresh Calendar", "redrawCalendar")
//    .addToUi();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var activeSheet = ss.getActiveSheet();
    Logger.log("Active Sheet: ", activeSheet);
    SpreadsheetApp.getUi()
    .createAddonMenu()
    .addItem("Start", "startBlogCentral")
    .addToUi();
}

function startBlogCentral() {
  var html = HtmlService.createTemplateFromFile("client/main")
    .evaluate()
    .setTitle("Blog Central"); // The title shows in the sidebar
  SpreadsheetApp.getUi().showModalDialog(html, "Start Tracker in this Sheet"); // userInterface, title)showSidebar(html);
}
