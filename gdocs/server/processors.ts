import { Printer } from "./printers";
export interface ElementContainer {
  getNumChildren(): number;
  getChild(childIndex: number): GoogleAppsScript.Document.Element;
}

let Attribute = GoogleAppsScript.Document.Attribute;

const styleMapping: any = {};
styleMapping[Attribute.BACKGROUND_COLOR.toString()] = "background-color";
styleMapping[Attribute.FOREGROUND_COLOR.toString()] = "color";
styleMapping[Attribute.FONT_SIZE.toString()] = "font-size";
styleMapping[Attribute.FONT_FAMILY.toString()] = "font-family";
styleMapping[Attribute.BOLD.toString()] = "font-weight";
styleMapping[Attribute.ITALIC.toString()] = "font-style";
styleMapping[Attribute.MARGIN_BOTTOM.toString()] = "margin-bottom";
styleMapping[Attribute.MARGIN_LEFT.toString()] = "margin-left";
styleMapping[Attribute.MARGIN_RIGHT.toString()] = "margin-right";
styleMapping[Attribute.MARGIN_TOP.toString()] = "margin-top";
styleMapping[Attribute.PADDING_BOTTOM.toString()] = "padding-bottom";
styleMapping[Attribute.PADDING_LEFT.toString()] = "padding-left";
styleMapping[Attribute.PADDING_RIGHT.toString()] = "padding-right";
styleMapping[Attribute.PADDING_TOP.toString()] = "padding-top";
styleMapping[Attribute.HORIZONTAL_ALIGNMENT.toString()] = "text-align";
styleMapping[Attribute.HEIGHT.toString()] = "height";
styleMapping[Attribute.WIDTH.toString()] = "width";
styleMapping[Attribute.MINIMUM_HEIGHT.toString()] = "min-height";
styleMapping[Attribute.BORDER_COLOR.toString()] = "border-color";
styleMapping[Attribute.BORDER_WIDTH.toString()] = "border-width";

// use text-decoration
// styleMapping[Attribute.STRIKETHROUGH.toString()] = "The strike-through setting, for rich text.";
// styleMapping[Attribute.UNDERLINE.toString()] = "The underline setting, for rich text.";

// use https://www.w3schools.com/css/css_align.asp
// styleMapping[Attribute.VERTICAL_ALIGNMENT.toString()] = "The vertical alignment setting, for table cell elements.";

// Use text-indent + left + right
// styleMapping[Attribute.INDENT_END.toString()] = "The end indentation setting in points, for paragraph elements.";
// styleMapping[Attribute.INDENT_FIRST_LINE.toString()] = "The first line indentation setting in points, for paragraph elements.";
// styleMapping[Attribute.INDENT_START.toString()] = "The start indentation setting in points, for paragraph elements.";

// line-height - use as a multiplier of the "default" height?
// styleMapping[Attribute.LINE_SPACING.toString()] = "The line spacing setting as a multiplier, for paragraph elements.";

// styleMapping[Attribute.CODE.toString()] = "The code contents, for equation elements.";
// styleMapping[Attribute.HEADING.toString()] = "The heading type, for paragraph elements for example, DocumentApp.ParagraphHeading.HEADING1).";

// styleMapping[Attribute.GLYPH_TYPE.toString()] = "The glyph type, for list item elements.";
// styleMapping[Attribute.LEFT_TO_RIGHT.toString()] = "The text direction setting, for rich text.";
// styleMapping[Attribute.LINK_URL.toString()] = "The link URL, for rich text. The default link style foreground color, underline) is automatically applied.";
// styleMapping[Attribute.LIST_ID.toString()] = "The ID of the encompassing list, for list item elements.";
// styleMapping[Attribute.NESTING_LEVEL.toString()] = "The item nesting level, for list item elements.";
// styleMapping[Attribute.SPACING_AFTER.toString()] = "The bottom spacing setting in points, for paragraph elements.";
// styleMapping[Attribute.SPACING_BEFORE.toString()] = "The top spacing setting in points, for paragraph elements.";
// styleMapping[Attribute.PAGE_HEIGHT.toString()] = "The page height setting in points, for documents.";
// styleMapping[Attribute.PAGE_WIDTH.toString()] = "The page width setting in points, for documents.";

function hasAttrib(
  attribs: any,
  attrib: GoogleAppsScript.Document.Attribute
): boolean {
  return attrib.toString() in attribs;
}

function extractStyles(attribs: any): any {
  var styles: any = {};
  for (var key in attribs) {
    var value = attribs[key];
    if (value != null && key in styleMapping) {
      styles[styleMapping[key]] = value;
    }
  }

  if (
    hasAttrib(attribs, Attribute.BORDER_COLOR) ||
    hasAttrib(attribs, Attribute.BORDER_WIDTH)
  ) {
    styles["border-style"] = "solid";
  }

  // styleMapping[Attribute.STRIKETHROUGH.toString()] = "The strike-through setting, for rich text.";
  // styleMapping[Attribute.UNDERLINE.toString()] = "The underline setting, for rich text.";
  if (attribs[Attribute.STRIKETHROUGH.toString()]) {
    styleMapping["text-decoration"] = "line-through";
  }
  if (attribs[Attribute.UNDERLINE.toString()]) {
    styleMapping["text-decoration"] = "underline";
  }

  // check for "combined ones"
  return styles;
}

export class Processor {
  printer: Printer;
  tagStack: string[] = [];
  debug: boolean = false;

  // Holds styles
  styleMap: any = {};

  // Holds the body as JSON
  // bodyContent: any = {};

  footnoteSections: GoogleAppsScript.Document.FootnoteSection[] = [];

  constructor(printer: Printer, debug = false) {
    this.printer = printer;
    this.debug = debug;
  }

  logAttributes(attribs: any, name: string) {
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
    this.processChildren(elem);
  }
  processComment(elem: GoogleAppsScript.Document.Element) {
    throw new Error("'Comment' Not Supported");
  }
  processEquation(elem: GoogleAppsScript.Document.Equation) {
    var attribs = elem.getAttributes();
    var params: any = {};
    var styles = extractStyles(attribs);
    this.startTag("math", params, styles);
    this.processChildren(elem);
    this.endTag();
  }
  processEquationFunction(elem: GoogleAppsScript.Document.EquationFunction) {
    // var params : any = {}; var styles = extractStyles(elem.getAttributes()); Logger.log("Attribs: ", attribs);
    var attribs = elem.getAttributes();
    var params: any = {};
    var styles = extractStyles(attribs);
    this.startTag("math", params, styles);
    this.processChildren(elem);
    throw new Error("'EquationFunction' Not Supported");
  }
  processEquationSymbol(elem: GoogleAppsScript.Document.EquationSymbol) {
    var attribs = elem.getAttributes();
    var params: any = {};
    var styles = extractStyles(attribs);
    this.startTag("mi", params, styles);
    this.printer.write(elem.getCode());
    this.endTag();
  }
  processEquationFunctionArgumentSeparator(
    elem: GoogleAppsScript.Document.EquationFunctionArgumentSeparator
  ) {
    var attribs = elem.getAttributes();
    var params: any = {};
    var styles = extractStyles(attribs);
    this.logAttributes(attribs, "FuncArgSeperator");
    this.printer.write(", ");
  }
  processHeaderSection(elem: GoogleAppsScript.Document.HeaderSection) {
    // var params : any = {}; var styles = extractStyles(elem.getAttributes()); Logger.log("Attribs: ", attribs);
    console.warn("'HeaderSection' Not Supported");
  }
  processFooterSection(elem: GoogleAppsScript.Document.FooterSection) {
    // var params : any = {}; var styles = extractStyles(elem.getAttributes()); Logger.log("Attribs: ", attribs);
    console.warn("'FooterSection' Not Supported");
  }
  processFootnote(elem: GoogleAppsScript.Document.Footnote) {
    var attribs = elem.getAttributes();
    this.logAttributes(attribs, "Footnote");
    var params: any = {};
    var styles = extractStyles(attribs);
    this.footnoteSections.push(elem.getFootnoteContents());
    // TODO: Create a link to a footnote anchor at the end
    this.startTag("a", params, styles, true);
  }
  processFootnoteSection(elem: GoogleAppsScript.Document.FootnoteSection) {
    // var params : any = {}; var styles = extractStyles(elem.getAttributes()); Logger.log("Attribs: ", attribs);
    this.processChildren(elem);
    throw new Error("'FootnoteSection' Not Supported");
  }
  processHorizontalRule(elem: GoogleAppsScript.Document.HorizontalRule) {
    var attribs = elem.getAttributes();
    var params: any = {};
    var styles = extractStyles(attribs);
    Logger.log("HR Attribs: ", params, styles);
    this.startTag("hr", params, styles, true);
  }
  processInlineImage(elem: GoogleAppsScript.Document.InlineImage) {
    var params: any = {};
    var styles = extractStyles(elem.getAttributes());
    var title = elem.getAltTitle();
    var desc = elem.getAltDescription();
    var url = elem.getLinkUrl();
    var width = elem.getWidth();
    var height = elem.getHeight();

    if (width != null) params["width"] = width;
    if (height != null) params["height"] = height;
    if (title != null) params["alt"] = title;
    if (url != null) params["src"] = url;
    this.startTag("img", params, styles);
    this.printer.write(desc);
    this.endTag();
  }
  processInlineDrawing(elem: GoogleAppsScript.Document.InlineDrawing) {
    var attribs = elem.getAttributes();
    var params: any = {};
    var styles = extractStyles(attribs);
    this.startTag("drawing", params, styles, true);
    // this.processParagraph(elem.asParagraph());
  }
  processListItem(elem: GoogleAppsScript.Document.ListItem) {
    var attribs = elem.getAttributes();
    var params: any = {};
    var styles = extractStyles(attribs);
    this.startTag("li", params, styles);
    this.processChildren(elem);
    this.endTag();
  }
  processPageBreak(elem: GoogleAppsScript.Document.PageBreak) {
    // var params : any = {}; var styles = extractStyles(elem.getAttributes()); Logger.log("Attribs: ", attribs);
    var attribs = elem.getAttributes();
    var params: any = {};
    var styles = extractStyles(attribs);
    this.startTag("br", params, styles, true);
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
    } else if (heading == DocumentApp.ParagraphHeading.TITLE) {
      tag = "h1";
    } else if (heading == DocumentApp.ParagraphHeading.SUBTITLE) {
      tag = "h2";
    } else {
    }

    var params: any = {};
    var styles = extractStyles(elem.getAttributes());
    this.startTag(tag, params, styles);
    this.processChildren(elem);
    this.endTag();
  }
  processTable(elem: GoogleAppsScript.Document.Table) {
    // var params : any = {}; var styles = extractStyles(elem.getAttributes()); Logger.log("Attribs: ", attribs);
    this.startTag("figure", { class: "wp-block-table" });
    var attribs = elem.getAttributes();
    var params: any = {};
    var styles = extractStyles(attribs);
    this.startTag("table", params, styles);
    this.processChildren(elem);
    this.endTag();
    this.endTag();
  }
  processTableRow(elem: GoogleAppsScript.Document.TableRow) {
    var attribs = elem.getAttributes();
    var params: any = {};
    var styles = extractStyles(attribs);
    this.startTag("tr", params, styles);
    this.processChildren(elem);
    this.endTag();
  }
  processTableCell(elem: GoogleAppsScript.Document.TableCell) {
    var attribs = elem.getAttributes();
    var params: any = {};
    var styles = extractStyles(attribs);
    this.startTag("td", params, styles);
    this.processChildren(elem);
    this.endTag();
  }
  processTableOfContents(elem: GoogleAppsScript.Document.TableOfContents) {
    var attribs = elem.getAttributes();
    var params: any = {};
    var styles = extractStyles(attribs);
    this.startTag("div", params, styles);
    this.processChildren(elem);
    this.endTag();
  }
  processText(elem: GoogleAppsScript.Document.Text) {
    var attribs = elem.getAttributes();
    var params: any = {};
    var styles = extractStyles(attribs);
    this.startTag("span", params, styles);
    this.printer.write(elem.getText());
    this.endTag();
  }

  /**
   * Starts a new tag into our running content printer as well as creating any style
   * classes if required.
   * The idea is that instead of creating a style entry for every tag we will create
   * IDs for each tag (that has attributes) and add the styles into that instead.
   */
  startTag(
    tag: string,
    params: any = null,
    styles: any = null,
    end: boolean = false
  ) {
    var tagClass = "gdocs_" + tag;
    if (!(tagClass in this.styleMap)) {
      this.styleMap[tagClass] = {};
    }

    var stylesString = "";
    for (var key in styles || {}) {
      var value = styles[key];
      if (value != null) {
        stylesString += " " + key + ": " + value + ";";
      }
    }

    // if there are any attributes - then also
    this.tagStack.push(tag);
    var paramsString = "";
    for (var key in params || {}) {
      var value = params[key];
      if (value != null) {
        paramsString += " " + key + " = ";
        if (typeof value === "string") {
          paramsString += "'" + value + "'";
        } else {
          paramsString += value;
        }
      }
    }

    this.printer.nextline();
    this.printer.indentBy(1);
    var tagString = "<" + tag;
    if (paramsString.length > 0) {
      tagString += paramsString;
    }
    if (stylesString.length > 0) {
      tagString += ' style="' + stylesString + '"';
    }
    tagString += ">";
    this.printer.write(tagString);
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
