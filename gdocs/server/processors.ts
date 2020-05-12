import { Printer } from "./printers";

export interface ElementContainer {
  getNumChildren(): number;
  getChild(childIndex: number): GoogleAppsScript.Document.Element;
}

function debugBlock(id: string, callback: any) {
  console.log("BEGIN: ", id);
  callback();
  console.log("END: ", id);
}

export class Processor {
  printer: Printer;
  constructor(printer: Printer) {
    this.printer = printer;
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
    var self = this;

    switch (elemType) {
      case DocumentApp.ElementType.BODY_SECTION:
        debugBlock("Body", () => {
          self.processBody(elem.asBody());
        });
        break;
      case DocumentApp.ElementType.COMMENT_SECTION:
        debugBlock("Comment", () => {
          self.processComment(elem);
        });
        break;
      case DocumentApp.ElementType.EQUATION:
        debugBlock("Equation", () => {
          self.processEquation(elem.asEquation());
        });
        break;
      case DocumentApp.ElementType.EQUATION_FUNCTION:
        debugBlock("EquationFunction", () => {
          self.processEquationFunction(elem.asEquationFunction());
        });
        break;
      case DocumentApp.ElementType.EQUATION_FUNCTION:
        debugBlock("EquationSymbol", () => {
          self.processEquationSymbol(elem.asEquationSymbol());
        });
        break;
      case DocumentApp.ElementType.EQUATION_FUNCTION_ARGUMENT_SEPARATOR:
        this.processEquationFunctionArgumentSeparator(
          elem.asEquationFunctionArgumentSeparator()
        );
        break;
      case DocumentApp.ElementType.HEADER_SECTION:
        debugBlock("HeaderSection", () => {
          self.processHeaderSection(elem.asHeaderSection());
        });
        break;
      case DocumentApp.ElementType.FOOTER_SECTION:
        debugBlock("FooterSection", () => {
          self.processFooterSection(elem.asFooterSection());
        });
        break;
      case DocumentApp.ElementType.FOOTNOTE:
        debugBlock("Footnote", () => {
          self.processFootnote(elem.asFootnote());
        });
        break;
      case DocumentApp.ElementType.FOOTNOTE_SECTION:
        debugBlock("FootnoteSection", () => {
          self.processFootnoteSection(elem.asFootnoteSection());
        });
        break;
      case DocumentApp.ElementType.HORIZONTAL_RULE:
        debugBlock("HorizontalRule", () => {
          self.processHorizontalRule(elem.asHorizontalRule());
        });
        break;
      case DocumentApp.ElementType.INLINE_IMAGE:
        debugBlock("InlineImage", () => {
          self.processInlineImage(elem.asInlineImage());
        });
        break;
      case DocumentApp.ElementType.INLINE_DRAWING:
        debugBlock("InlineDrawing", () => {
          self.processInlineDrawing(elem.asInlineDrawing());
        });
        break;
      case DocumentApp.ElementType.LIST_ITEM:
        debugBlock("ListItem", () => {
          self.processListItem(elem.asListItem());
        });
        break;
      case DocumentApp.ElementType.PAGE_BREAK:
        debugBlock("PageBreak", () => {
          self.processPageBreak(elem.asPageBreak());
        });
        break;
      case DocumentApp.ElementType.PARAGRAPH:
        debugBlock("Paragraph", () => {
          self.processParagraph(elem.asParagraph());
        });
        break;
      case DocumentApp.ElementType.TABLE:
        debugBlock("Table", () => {
          self.processTable(elem.asTable());
        });
        break;
      case DocumentApp.ElementType.TABLE_CELL:
        debugBlock("TableCell", () => {
          self.processTableCell(elem.asTableCell());
        });
        break;
      case DocumentApp.ElementType.TABLE_OF_CONTENTS:
        debugBlock("TableOfContents", () => {
          self.processTableOfContents(elem.asTableOfContents());
        });
        break;
      case DocumentApp.ElementType.TEXT:
        debugBlock("Text", () => {
          self.processText(elem.asText());
        });
        break;
      default:
        throw new Error("Invalid case: " + elemType);
    }
  }

  processBody(elem: GoogleAppsScript.Document.Body) {
    // var attribs = elem.getAttributes(); console.log("Body Attribs: ", attribs);
    this.processChildren(elem);
    // throw new Error("'Body' Not Supported");
  }
  processComment(elem: GoogleAppsScript.Document.Element) {
    // var attribs = elem.getAttributes(); console.log("Attribs: ", attribs);
    throw new Error("'Comment' Not Supported");
  }
  processEquation(elem: GoogleAppsScript.Document.Equation) {
    // var attribs = elem.getAttributes(); console.log("Attribs: ", attribs);
    this.processChildren(elem);
    throw new Error("'Equation' Not Supported");
  }
  processEquationFunction(elem: GoogleAppsScript.Document.EquationFunction) {
    // var attribs = elem.getAttributes(); console.log("Attribs: ", attribs);
    this.processChildren(elem);
    throw new Error("'EquationFunction' Not Supported");
  }
  processEquationSymbol(elem: GoogleAppsScript.Document.EquationSymbol) {
    // var attribs = elem.getAttributes(); console.log("Attribs: ", attribs);
    throw new Error("'EquationSymbol' Not Supported");
  }
  processEquationFunctionArgumentSeparator(
    elem: GoogleAppsScript.Document.EquationFunctionArgumentSeparator
  ) {
    // var attribs = elem.getAttributes(); console.log("Attribs: ", attribs);
    throw new Error("'EquationFunctionArgumentSeparator' Not Supported");
  }
  processHeaderSection(elem: GoogleAppsScript.Document.HeaderSection) {
    // var attribs = elem.getAttributes(); console.log("Attribs: ", attribs);
    this.processChildren(elem);
    throw new Error("'HeaderSection' Not Supported");
  }
  processFooterSection(elem: GoogleAppsScript.Document.FooterSection) {
    // var attribs = elem.getAttributes(); console.log("Attribs: ", attribs);
    this.processChildren(elem);
    throw new Error("'FooterSection' Not Supported");
  }
  processFootnote(elem: GoogleAppsScript.Document.Footnote) {
    // var attribs = elem.getAttributes(); console.log("Attribs: ", attribs);
    throw new Error("'Footnote' Not Supported");
  }
  processFootnoteSection(elem: GoogleAppsScript.Document.FootnoteSection) {
    // var attribs = elem.getAttributes(); console.log("Attribs: ", attribs);
    this.processChildren(elem);
    throw new Error("'FootnoteSection' Not Supported");
  }
  processHorizontalRule(elem: GoogleAppsScript.Document.HorizontalRule) {
    // var attribs = elem.getAttributes(); console.log("Attribs: ", attribs);
    throw new Error("'HorizontalRule' Not Supported");
  }
  processInlineImage(elem: GoogleAppsScript.Document.InlineImage) {
    // var attribs = elem.getAttributes(); console.log("Attribs: ", attribs);
    throw new Error("'InlineImage' Not Supported");
  }
  processInlineDrawing(elem: GoogleAppsScript.Document.InlineDrawing) {
    // var attribs = elem.getAttributes(); console.log("Attribs: ", attribs);
    throw new Error("'InlineDrawing' Not Supported");
  }
  processListItem(elem: GoogleAppsScript.Document.ListItem) {
    // var attribs = elem.getAttributes(); console.log("Attribs: ", attribs);
    this.processChildren(elem);
    throw new Error("'ListItem' Not Supported");
  }
  processPageBreak(elem: GoogleAppsScript.Document.PageBreak) {
    // var attribs = elem.getAttributes(); console.log("Attribs: ", attribs);
    throw new Error("'PageBreak' Not Supported");
  }
  processParagraph(elem: GoogleAppsScript.Document.Paragraph) {
    var attribs = elem.getAttributes();
    var heading = elem.getHeading();
    var tag = "p";
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

    this.printer.write("<" + tag + ">");
    this.processChildren(elem);
    this.printer.writeLn("</" + tag + ">");
  }
  processTable(elem: GoogleAppsScript.Document.Table) {
    // var attribs = elem.getAttributes(); console.log("Attribs: ", attribs);
    this.processChildren(elem);
    throw new Error("'Table' Not Supported");
  }
  processTableCell(elem: GoogleAppsScript.Document.TableCell) {
    // var attribs = elem.getAttributes(); console.log("Attribs: ", attribs);
    this.processChildren(elem);
    throw new Error("'TableCell' Not Supported");
  }
  processTableOfContents(elem: GoogleAppsScript.Document.TableOfContents) {
    // var attribs = elem.getAttributes(); console.log("Attribs: ", attribs);
    this.processChildren(elem);
    throw new Error("'TableOfContents' Not Supported");
  }
  processText(elem: GoogleAppsScript.Document.Text) {
    var attribs = elem.getAttributes();
    console.log("Text Attribs: ", attribs);
    console.log("Text: ", elem.getText());
    this.printer.write("<span>");
    this.printer.write(elem.getText());
    this.printer.write("</span>");
  }
}

export class WPProcessor extends Processor {}
