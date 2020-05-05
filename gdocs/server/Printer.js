
class Printer {
    constructor(options) {
        this.options = options = options || {};
        this.level = options.level || 0;
        this.col = 0;
        this.row = 0;
        this.value = "";
        this.tab_size = options.tab_size || 2;
    }

    get atFirstCol() {
        return this.col == this.tab_size * this.level
    }

    indentString(level) {
        level = level || this.level;
        return " ".repeat(this.tab_size * level);
    }

    writeLn(text) {
        this.write(text)
        this.nextline()
    }

    write(text) {
        var lines = text.split("\n");
        var nlines = lines.length;
        for (var index = 0;index < nlines;index++) {
            var line = lines[index];
            this.value += line
            this.col += len(line)
            if (index != nlines - 1)  // we have more lines
                this.nextline()
        }
        return nlines
    }

    nextline() {
        this.value += "\n"
        this.row += 1
        var indent = this.indent_string()
        this.col = len(indent)
        this.value += indent
    }

    indent(delta, end_with_nl, block) {
        if (this.atFirstCol) {
            // first col so add more spaces
            var indent_string = this.indent_string(delta);
            this.value += indent_string;
            this.col += len(indent_string);
        }
        this.level += this.delta;

        try {
            block();

            if (this.atFirstCol) {
                // first col so "remove" trailing spaces
                var indent_string = writer.indent_string(delta);
                if (this.value.endsWith(indent_string)) {
                    L = indent_string.length;
                    this.value = this.value.slice(0, -L);
                    this.col -= L;
                }
            }
            this.level -= this.delta;
            if (this.end_with_nl) this.nextline();
        } catch (e) {
            this.level = 0;
            this.nextline();
            this.write("EXCEPTION:");
            this.nextline();
            throw e;
        }
    }
};

