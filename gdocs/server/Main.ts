export function onChange(e) {
  Logger.log("On Change Now: ", e);
}

export function onInstall(e) {
  onOpen();
}

export function onOpen() {
  DocumentApp.getUi()
    .createAddonMenu()
    .addItem("Start", "startBlogCentral")
    .addToUi();
}

export function startBlogCentral() {
  var html = HtmlService.createTemplateFromFile("client/index.gdocs.html")
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setTitle("Blog Central"); // The title shows in the sidebar
  DocumentApp.getUi().showSidebar(html); // userInterface, title)showSidebar(html);
}

export function processElement(elem, printer) {
  var elemType = elem.getType();
  var numChildren = elem.getNumChildren();

  switch (elemType) {
    case DocumentApp.ElementType.BODY_SECTION:
      processBody(elem.asBody(), printer);
      break;
    case DocumentApp.ElementType.COMMENT_SECTION:
      processBody(elem.asComment(), printer);
      break;
  }

  for (var i = 0; i < numChildren; i++) {
    var child = elem.getChild(i);
    processElement(child, printer);
  }
}

export function doc2content(site, post) {
  console.log("Site: ", site);
  console.log("Post: ", post);
  var printer = new Printer();
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  processElement(body, printer);
}
