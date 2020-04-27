
export function ensureElement(elem_or_id : any, root : any = null) {
    if (typeof(elem_or_id) === "string") {
        if (root != null)
            return root.find("#"+ elem_or_id);
        else
            return $("#" + elem_or_id);
    } else {
        return elem_or_id;
    }
}
