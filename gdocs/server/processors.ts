import { Printer } from "./printers";

export interface ElementContainer {
  getNumChildren(): number;
  getChild(childIndex: number): GoogleAppsScript.Document.Element;
}

function debugBlock(id: string, callback: any) {
  Logger.log("BEGIN: ", id);
  callback();
  Logger.log("END: ", id);
}

export class Processor {
  printer: Printer;
  tagStack: string[] = [];
  debug: boolean = false;
  footnoteSections: GoogleAppsScript.Document.FootnoteSection[] = [];

  constructor(printer: Printer, debug = false) {
    this.printer = printer;
    this.debug = debug;
  }

  printAttributes(attribs: any, name: string) {
    if (this.debug) {
      Logger.log(name, ", Attribs: ");
      for (var key in attribs) {
        var value = attribs[key];
        Logger.log("        " + key + " -> " + value);
      }
    }
  }

  processChildren(elem: ElementContainer) {
    var numChildren = elem.getNumChildren();
    for (var i = 0; i < numChildren; i++) {
      var child = elem.getChild(i);
      this.processElement(child);
    }
  }

  processElement(elem: GoogleAppsScript.Document.Element) {
    var elemType = elem.getType();

    switch (elemType) {
      case DocumentApp.ElementType.BODY_SECTION:
        this.processBody(elem.asBody());
        break;
      case DocumentApp.ElementType.COMMENT_SECTION:
        this.processComment(elem);
        break;
      case DocumentApp.ElementType.EQUATION:
        this.processEquation(elem.asEquation());
        break;
      case DocumentApp.ElementType.EQUATION_FUNCTION:
        this.processEquationFunction(elem.asEquationFunction());
        break;
      case DocumentApp.ElementType.EQUATION_FUNCTION:
        this.processEquationSymbol(elem.asEquationSymbol());
        break;
      case DocumentApp.ElementType.EQUATION_FUNCTION_ARGUMENT_SEPARATOR:
        this.processEquationFunctionArgumentSeparator(
          elem.asEquationFunctionArgumentSeparator()
        );
        break;
      case DocumentApp.ElementType.HEADER_SECTION:
        this.processHeaderSection(elem.asHeaderSection());
        break;
      case DocumentApp.ElementType.FOOTER_SECTION:
        this.processFooterSection(elem.asFooterSection());
        break;
      case DocumentApp.ElementType.FOOTNOTE:
        this.processFootnote(elem.asFootnote());
        break;
      case DocumentApp.ElementType.FOOTNOTE_SECTION:
        this.processFootnoteSection(elem.asFootnoteSection());
        break;
      case DocumentApp.ElementType.HORIZONTAL_RULE:
        this.processHorizontalRule(elem.asHorizontalRule());
        break;
      case DocumentApp.ElementType.INLINE_IMAGE:
        this.processInlineImage(elem.asInlineImage());
        break;
      case DocumentApp.ElementType.INLINE_DRAWING:
        this.processInlineDrawing(elem.asInlineDrawing());
        break;
      case DocumentApp.ElementType.LIST_ITEM:
        this.processListItem(elem.asListItem());
        break;
      case DocumentApp.ElementType.PAGE_BREAK:
        this.processPageBreak(elem.asPageBreak());
        break;
      case DocumentApp.ElementType.PARAGRAPH:
        this.processParagraph(elem.asParagraph());
        break;
      case DocumentApp.ElementType.TABLE:
        this.processTable(elem.asTable());
        break;
      case DocumentApp.ElementType.TABLE_ROW:
        this.processTableRow(elem.asTableRow());
        break;
      case DocumentApp.ElementType.TABLE_CELL:
        this.processTableCell(elem.asTableCell());
        break;
      case DocumentApp.ElementType.TABLE_OF_CONTENTS:
        this.processTableOfContents(elem.asTableOfContents());
        break;
      case DocumentApp.ElementType.TEXT:
        this.processText(elem.asText());
        break;
      default:
        throw new Error("Invalid case: " + elemType);
    }
  }

  processBody(elem: GoogleAppsScript.Document.Body) {
    // var attribs = elem.getAttributes(); Logger.log("Body Attribs: ", attribs);
    this.processChildren(elem);
    // throw new Error("'Body' Not Supported");
  }
  processComment(elem: GoogleAppsScript.Document.Element) {
    // var attribs = elem.getAttributes(); Logger.log("Attribs: ", attribs);
    throw new Error("'Comment' Not Supported");
  }
  processEquation(elem: GoogleAppsScript.Document.Equation) {
    this.startTag("math", elem.getAttributes());
    this.processChildren(elem);
    this.endTag();
  }
  processEquationFunction(elem: GoogleAppsScript.Document.EquationFunction) {
    // var attribs = elem.getAttributes(); Logger.log("Attribs: ", attribs);
    this.startTag("math", elem.getAttributes());
    this.processChildren(elem);
    throw new Error("'EquationFunction' Not Supported");
  }
  processEquationSymbol(elem: GoogleAppsScript.Document.EquationSymbol) {
    // var attribs = elem.getAttributes(); Logger.log("Attribs: ", attribs);
    this.startTag("mi");
    this.printer.write(elem.getCode());
    this.endTag();
  }
  processEquationFunctionArgumentSeparator(
    elem: GoogleAppsScript.Document.EquationFunctionArgumentSeparator
  ) {
    var attribs = elem.getAttributes();
    this.printAttributes(attribs, "FuncArgSeperator");
    this.printer.write(", ");
  }
  processHeaderSection(elem: GoogleAppsScript.Document.HeaderSection) {
    // var attribs = elem.getAttributes(); Logger.log("Attribs: ", attribs);
    console.warn("'HeaderSection' Not Supported");
  }
  processFooterSection(elem: GoogleAppsScript.Document.FooterSection) {
    // var attribs = elem.getAttributes(); Logger.log("Attribs: ", attribs);
    console.warn("'FooterSection' Not Supported");
  }
  processFootnote(elem: GoogleAppsScript.Document.Footnote) {
    var attribs = elem.getAttributes();
    this.printAttributes(attribs, "Footnote");
    this.footnoteSections.push(elem.getFootnoteContents());
    // TODO: Create a link to a footnote anchor at the end
    this.startTag("a", attribs, true);
  }
  processFootnoteSection(elem: GoogleAppsScript.Document.FootnoteSection) {
    // var attribs = elem.getAttributes(); Logger.log("Attribs: ", attribs);
    this.processChildren(elem);
    throw new Error("'FootnoteSection' Not Supported");
  }
  processHorizontalRule(elem: GoogleAppsScript.Document.HorizontalRule) {
    var attribs = elem.getAttributes();
    Logger.log("Attribs: ", attribs);
    this.startTag("hr", attribs, true);
  }
  processInlineImage(elem: GoogleAppsScript.Document.InlineImage) {
    var attribs = elem.getAttributes();
    this.startTag("img", attribs, true);
  }
  processInlineDrawing(elem: GoogleAppsScript.Document.InlineDrawing) {
    this.startTag("drawing", elem.getAttributes(), true);
    // this.processParagraph(elem.asParagraph());
  }
  processListItem(elem: GoogleAppsScript.Document.ListItem) {
    var attribs = elem.getAttributes();
    this.startTag("li", attribs);
    this.processChildren(elem);
    this.endTag();
  }
  processPageBreak(elem: GoogleAppsScript.Document.PageBreak) {
    // var attribs = elem.getAttributes(); Logger.log("Attribs: ", attribs);
    this.startTag("br", null, true);
  }

  processParagraph(elem: GoogleAppsScript.Document.Paragraph) {
    var heading = elem.getHeading();
    var tag = "div";
    if (heading == DocumentApp.ParagraphHeading.NORMAL) {
      tag = "p";
    } else if (heading == DocumentApp.ParagraphHeading.HEADING1) {
      tag = "h1";
    } else if (heading == DocumentApp.ParagraphHeading.HEADING2) {
      tag = "h2";
    } else if (heading == DocumentApp.ParagraphHeading.HEADING3) {
      tag = "h3";
    } else if (heading == DocumentApp.ParagraphHeading.HEADING4) {
      tag = "h4";
    } else if (heading == DocumentApp.ParagraphHeading.HEADING5) {
      tag = "h5";
    } else if (heading == DocumentApp.ParagraphHeading.HEADING6) {
      tag = "h6";
    }

    this.startTag(tag, elem.getAttributes());
    this.processChildren(elem);
    this.endTag();
  }
  processTable(elem: GoogleAppsScript.Document.Table) {
    // var attribs = elem.getAttributes(); Logger.log("Attribs: ", attribs);
    var attribs = elem.getAttributes();
    this.startTag("table", attribs);
    this.processChildren(elem);
    this.endTag();
  }
  processTableRow(elem: GoogleAppsScript.Document.TableRow) {
    var attribs = elem.getAttributes();
    this.startTag("tr", attribs);
    this.processChildren(elem);
    this.endTag();
  }
  processTableCell(elem: GoogleAppsScript.Document.TableCell) {
    var attribs = elem.getAttributes();
    this.startTag("td", attribs);
    this.processChildren(elem);
    this.endTag();
  }
  processTableOfContents(elem: GoogleAppsScript.Document.TableOfContents) {
    var attribs = elem.getAttributes();
    Logger.log("Attribs: ", attribs);
    this.startTag("div", attribs);
    this.processChildren(elem);
    this.endTag();
  }
  processText(elem: GoogleAppsScript.Document.Text) {
    var attribs = elem.getAttributes();
    this.startTag("span", attribs);
    this.printer.write(elem.getText());
    this.endTag();
  }

  startTag(tag: string, attribs: any = null, end: boolean = false) {
    this.tagStack.push(tag);
    var suffix = "";
    if (attribs != null) {
      for (var key in attribs) {
        var value = attribs[key];
        if (value != null) {
          suffix += " " + key + " = ";
          if (typeof value === "string") {
            suffix += "'" + value + "'";
          } else {
            suffix += value;
          }
        }
      }
    }
    this.printer.nextline();
    this.printer.indentBy(1);
    if (suffix.length > 0) {
      this.printer.write("<" + tag + suffix + " >");
    } else {
      this.printer.write("<" + tag + ">");
    }
    if (end) this.endTag();
  }

  endTag() {
    var tag = this.tagStack.pop();
    this.printer.nextline();
    this.printer.indentBy(-1);
    this.printer.write("</" + tag + ">");
  }
}

export class WPProcessor extends Processor {}
