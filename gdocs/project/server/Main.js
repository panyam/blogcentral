
function onChange(e) {
  Logger.log("On Change Now: ", e);
}

function onInstall(e) {
    onOpen();
}

function onOpen() {
    DocumentApp.getUi()
    .createAddonMenu()
    .addItem("Start", "startBlogCentral")
    .addToUi();
}

function startBlogCentral() {
  var html = HtmlService.createTemplateFromFile("client/main")
    .evaluate()
    .setTitle("Blog Central"); // The title shows in the sidebar
  DocumentApp.getUi().showSidebar(html); // userInterface, title)showSidebar(html);
}
