
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

function processElement(elem, printer) {
    var elemType = elem.getType();
    var numChildren = elem.getNumChildren();

    for (var i = 0;i < numChildren;i++) {
        var child = elem.getChild(i);
        processElement(child, printer);
    }
}

function doc2content(site, post) {
    console.log("Site: ", site);
    console.log("Post: ", post);
    var printer = new Printer();
    var doc = DocumentApp.getActiveDocument();
    var body = doc.getBody();
    processElement(body, printer)
}

