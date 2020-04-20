
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
  var html = HtmlService.createTemplateFromFile("client/index.gdocs.html")
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setTitle("Blog Central"); // The title shows in the sidebar
  DocumentApp.getUi().showSidebar(html); // userInterface, title)showSidebar(html);
}
