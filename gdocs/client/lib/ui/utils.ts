
export function ensureElement(elem_or_id : any, root : any = null) {
    if (typeof(elem_or_id) === "string") {
        if (root != null)
            return root.find("#"+ elem_or_id);
        else
            return $("#" + elem_or_id);
    } else {
        if (elem_or_id.find) {
            return elem_or_id;
        } else {
            return $(elem_or_id);
        }
    }
}

export function ensureCreated(elem_or_id : any, root : any = null) {
    var out = ensureElement(elem_or_id, root);
    if (out == null) {
        // creat it then
    }
    return out;
}

export function setEnabled(elem : any, enable : boolean) {
    elem.prop('disabled', !enable);
    return elem;
}

export function setVisible(elem : any, show : boolean = true) {
    if (show) { elem.show(); }
    else { elem.hide(); }
    return elem;
}
