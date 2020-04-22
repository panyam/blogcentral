
import { Nullable } from "./types"

export class Store {
    get(_key : string, _callback : any) { } 
    set(_key : string, _value : Nullable<any>, _callback : any) { }
};

export class LocalStore extends Store {
    get(key : string, callback : any) {
        var value = window.localStorage.getItem(key);
        if (value != null) 
            value = JSON.parse(value);
        callback(value);
    }

    set(key : string, value : Nullable<any>, callback : any) {
        window.localStorage.setItem(key, JSON.stringify(value));
        callback();
    }
};

declare var google : any;
export class PropertiesStore extends Store {
    constructor() {
        super();
    }

    get(key : string, callback : any) {
        google.script.run
              .withSuccessHandler(function(value : any) {
                    if (value != null)
                        value = JSON.parse(value);
                    callback(value);
              })
              .getUserProperty(key);
    }

    set(key : string, value : Nullable<any>, callback : any) {
        google.script.run
              .withSuccessHandler(callback)
              .setUserProperty(key, JSON.stringify(value));
    }
};

