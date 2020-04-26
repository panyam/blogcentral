
import { Nullable } from "./types"

export class Store {
    keyprefix : string
    constructor(keyprefix : string) {
        this.keyprefix = keyprefix
    }

    normalizedKey(key : string) : string {
        return this.keyprefix + ":" + key;
    }

    async get(_key : string) { return null as any; } 
    async set(_key : string, _value : Nullable<any>) { return null as any; }
    async remove(_key : string) { return null as any; }
};

export class LocalStore extends Store {
    async get(key : string) {
             key = this.normalizedKey(key);
        var value = window.localStorage.getItem(key);
        if (value != null) 
            value = JSON.parse(value);
        return value;
    }

    async set(key : string, value : Nullable<any>) {
        key = this.normalizedKey(key);
        window.localStorage.setItem(key, JSON.stringify(value));
        return null as any;
    }

    async remove(key : string) {
        key = this.normalizedKey(key);
        window.localStorage.removeItem(key);
        return null as any;
    }
};

declare var google : any;
export class PropertiesStore extends Store {
    async get(key : string) {
        key = this.normalizedKey(key);
        return new Promise((resolve, reject) => {
            google.script.run
                  .withFailureHandler(reject)
                  .withSuccessHandler(function(value : any) {
                        if (value != null)
                            value = JSON.parse(value);
                        resolve(value);
                  })
                  .getUserProperty(key);
        });
    }

    async set(key : string, value : Nullable<any>) {
        key = this.normalizedKey(key);
        return new Promise((resolve, reject) => {
            google.script.run
                  .withSuccessHandler(resolve)
                  .withFailureHandler(reject)
                  .setUserProperty(key, JSON.stringify(value));
        });
    }
};

