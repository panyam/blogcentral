
const path = require("path");
const fs = require("fs");

const GAppsJSWrapperSchema = {
}

/**
 * In Google Apps Script, a js cannot be included but has to be "printed" from a .js.html file.
 * This plugin takes a .js file and creates the equivalent .js.html file that looks like:
 * <script>contents of .js file </script>
 */
class GAppsJSWrapperPlugin {
    // constructor(options = {}){ validateOptions(GAppsJSWrapperSchema, options, 'GApps JS Wrapper Plugin'); }
    constructor(options) {
        this.options = options;
        this.sourceFile = options.source || null;
        this.destFile = options.dest || null;
        if (this.sourceFile == null) {
            throw new Error("'source' parameter MUST be provided");
        }
        if (this.destFile == null) {
            this.destFile = this.sourceFile + ".html"
        }
    }

    copyFile(distpath) {
        var self = this;
        console.log("DistPath: ", distpath, typeof(distpath), self.destFile, typeof(self.destFile));
        var sourcePath = path.resolve(distpath, self.sourceFile);
        var destPath = path.resolve(distpath, self.destFile);
        fs.readFile(sourcePath, function(err, contents) {
            if (err) throw err;
            fs.writeFile(destPath, "<script>\n", function(err) {
                if (err) throw err;
                fs.appendFile(destPath, contents, function(err) {
                    if (err) throw err;
                    fs.appendFile(destPath, "\n</script>", function(err) {
                        if (err) throw err;
                        console.log("File generated: ", destPath);
                    });
                });
            });
        });
    }

    apply(compiler) {
        var self = this;
        compiler.hooks.afterEmit.tap('GAppsJSWrapperPlugin', (compilation) => {
            var asset = compilation.assets[self.sourceFile] || null;
            if (asset == null) {
                throw new Error("Asset '" + self.sourceFile + "' not found after compilation");
            }
            self.copyFile(compilation.compiler.outputPath);
        });

        compiler.hooks.assetEmitted.tap('GAppsJSWrapperPlugin', (file, info) => {
            // console.log(content); // <Buffer 66 6f 6f 62 61 72>
            if (file == self.sourceFile) {
                console.log("File: ", file);
                console.log("Source: ", info.source);
                console.log("OutputPath: ", info.outputPath);
                console.log("TargetPath: ", info.targetPath);
                console.log("Compilation: ", info.compilation);
            }
        });
    }
}


module.exports = GAppsJSWrapperPlugin 
