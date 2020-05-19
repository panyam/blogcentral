
import { ensureElement } from "./utils";
import { Nullable } from "../types";

export class Dialog {
    rootElement : any
    dialog : any
    resolveFunc : any
    rejectFunc : any

    constructor(elem_or_id : any) {
        this.rootElement = ensureElement(elem_or_id);
        this.setupViews();
        this.rootElement.css("z-Index", 1000);
    }

    setupViews() {
    }

    async open() {
        var self = this;
        return new Promise((resolve, reject) => {
            self.resolveFunc = resolve;
            self.rejectFunc = reject;
            this.dialog
                .dialog( "option", "buttons", self.buttons())
                .dialog( "open" );
        });
    }

    buttons() {
        var self = this;
        return {
            Cancel: function() {
                self.close(null);
            }
        };
    }

    close(data : Nullable<any> = null) {
        if (this.resolveFunc != null) {
            this.resolveFunc(data);
        }
        this.dialog.dialog( "close" );
    }
}
