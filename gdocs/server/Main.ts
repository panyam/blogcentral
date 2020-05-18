import { Printer } from "./printers";
import { WPProcessor } from "./processors";
import { getGoogleDocumentAsHTML } from "./utils";

export function onChange(e: any) {
  Logger.log("On Change Now: ", e);
}

export function onInstall() {
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

export function doc2content(site: any, post: any, usingDrive = true) {
  console.log("Site: ", site);
  console.log("Post: ", post);
  var doc = DocumentApp.getActiveDocument();
  if (usingDrive) {
    var id = doc.getId();
    return getGoogleDocumentAsHTML(id);
  } else {
    var body = doc.getBody();
    var printer = new Printer();
    var processor = new WPProcessor(printer);
    processor.debug = true;
    processor.processElement(body);
    return processor.printer.value;
  }
}
