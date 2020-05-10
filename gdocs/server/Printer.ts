export class Printer {
  options = {};
  level = 0;
  col = 0;
  row = 0;
  value = "";
  tab_size = 2;

  constructor(options: any) {
    this.options = options = options || {};
    this.level = options.level || 0;
    this.tab_size = options.tab_size || 2;
  }

  get atFirstCol() {
    return this.col == this.tab_size * this.level;
  }

  indentString(level: number = -1) {
    if (level < 0) level = this.level;
    return " ".repeat(this.tab_size * level);
  }

  writeLn(text: string) {
    this.write(text);
    this.nextline();
  }

  write(text: string) {
    var lines = text.split("\n");
    var nlines = lines.length;
    for (var index = 0; index < nlines; index++) {
      var line = lines[index];
      this.value += line;
      this.col += line.length;
      if (index != nlines - 1)
        // we have more lines
        this.nextline();
    }
    return nlines;
  }

  nextline() {
    this.value += "\n";
    this.row += 1;
    var indent = this.indentString();
    this.col = indent.length;
    this.value += indent;
  }

  indent(delta: number, end_with_nl: boolean, block: any) {
    if (this.atFirstCol) {
      // first col so add more spaces
      var indent_string = this.indentString(delta);
      this.value += indent_string;
      this.col += indent_string.length;
    }
    this.level += delta;

    try {
      block(this);

      if (this.atFirstCol) {
        // first col so "remove" trailing spaces
        var indent_string = this.indentString(delta);
        if (this.value.endsWith(indent_string)) {
          var L = indent_string.length;
          this.value = this.value.slice(0, -L);
          this.col -= L;
        }
      }
      this.level -= delta;
      if (end_with_nl) this.nextline();
    } catch (e) {
      this.level = 0;
      this.nextline();
      this.write("EXCEPTION:");
      this.nextline();
      throw e;
    }
  }
}
