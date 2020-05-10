import { Printer } from "./printers";

export interface ElementContainer {
  getNumChildren(): number;
  getChild(childIndex: number): GoogleAppsScript.Document.Element;
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
    throw new Error("'Body' Not Supported");
  }
  processComment(elem: GoogleAppsScript.Document.Element) {
    throw new Error("'Comment' Not Supported");
  }
  processEquation(elem: GoogleAppsScript.Document.Equation) {
    throw new Error("'Equation' Not Supported");
  }
  processEquationFunction(elem: GoogleAppsScript.Document.EquationFunction) {
    throw new Error("'EquationFunction' Not Supported");
  }
  processEquationSymbol(elem: GoogleAppsScript.Document.EquationSymbol) {
    throw new Error("'EquationSymbol' Not Supported");
  }
  processEquationFunctionArgumentSeparator(
    elem: GoogleAppsScript.Document.EquationFunctionArgumentSeparator
  ) {
    throw new Error("'EquationFunctionArgumentSeparator' Not Supported");
  }
  processHeaderSection(elem: GoogleAppsScript.Document.HeaderSection) {
    throw new Error("'HeaderSection' Not Supported");
  }
  processFooterSection(elem: GoogleAppsScript.Document.FooterSection) {
    throw new Error("'FooterSection' Not Supported");
  }
  processFootnote(elem: GoogleAppsScript.Document.Footnote) {
    throw new Error("'Footnote' Not Supported");
  }
  processFootnoteSection(elem: GoogleAppsScript.Document.FootnoteSection) {
    throw new Error("'FootnoteSection' Not Supported");
  }
  processHorizontalRule(elem: GoogleAppsScript.Document.HorizontalRule) {
    throw new Error("'HorizontalRule' Not Supported");
  }
  processInlineImage(elem: GoogleAppsScript.Document.InlineImage) {
    throw new Error("'InlineImage' Not Supported");
  }
  processInlineDrawing(elem: GoogleAppsScript.Document.InlineDrawing) {
    throw new Error("'InlineDrawing' Not Supported");
  }
  processListItem(elem: GoogleAppsScript.Document.ListItem) {
    throw new Error("'ListItem' Not Supported");
  }
  processPageBreak(elem: GoogleAppsScript.Document.PageBreak) {
    throw new Error("'PageBreak' Not Supported");
  }
  processParagraph(elem: GoogleAppsScript.Document.Paragraph) {
    throw new Error("'Paragraph' Not Supported");
  }
  processTable(elem: GoogleAppsScript.Document.Table) {
    throw new Error("'Table' Not Supported");
  }
  processTableCell(elem: GoogleAppsScript.Document.TableCell) {
    throw new Error("'TableCell' Not Supported");
  }
  processTableOfContents(elem: GoogleAppsScript.Document.TableOfContents) {
    throw new Error("'TableOfContents' Not Supported");
  }
  processText(elem: GoogleAppsScript.Document.Text) {
    throw new Error("'Text' Not Supported");
  }
}

export class WPProcessor extends Processor {}
