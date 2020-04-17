#!/usr/bin/env bash

set -e

dist_dir="dist"
mkdir -p ${dist_dir}/server
mkdir -p ${dist_dir}/client/static/js
mkdir -p ${dist_dir}/client/static/css

server () {
    cp src/appsscript.json ${dist_dir}
    cp src/server/*.js ${dist_dir}/server
}

client () {
    echo "Building Client Html..."
    cp project/client/*.html ${dist_dir}/client
    js
}

js () {
    echo "Building JS Bundle..."
    input_files="project/client/static/js/*.js"
    output_min_file="${dist_dir}/client/bundle.min.js.html"
    output_file="${dist_dir}/client/bundle.js.html"

    echo "<script>" > ${output_file}
    browserify --debug ${input_files} --standalone GSJS >> ${output_file}
    echo "</script>" >> ${output_file}

    echo "<script>" > ${output_min_file}
    browserify -t 'uglifyify' ${input_files} --standalone GSJS | uglifyjs >> ${output_min_file}
    echo "</script>" >> ${output_min_file}
}

css () {
    echo "CSS Done"
}

css2 () {
    output_file="${dist_dir}/client/styles.html"

    optimizations="optimizeBackground:off;"
    optimizations+="replaceMultipleZeros:off;"
    optimizations+="specialComments:off"

    # wrap all theme css in style tags and bundle into html
    echo "<html>" > ${output_file}
    for filename in node_modules/highlight.js/styles/*.css; do
        theme_name=$(basename "${filename}" .css)
        if [[ ${theme_name} != 'darkula' ]]; then
            theme="<style id=\"${theme_name}\">"
            theme+=$(cleancss --debug -O1 ${optimizations} "${filename}")
            theme+="</style>"
            echo ${theme} >> ${output_file}
        fi
    done
    echo "</html>" >> ${output_file}
}

case "$1" in
    "server")    server;;
    "client")    client;;
    *)
        echo "invalid command: $1"
        exit 1
        ;;
esac
