
import { Store } from "./stores"
import { Int, Nullable, Undefined } from "./types"

export type SiteCallback = () => Undefined<boolean>;

export enum SiteType {
    WORDPRESS,
    LINKEDIN,
    MEDIUM
};

export class Site {
    site_type : SiteType
    site_host : string
    username : string
    site_config : any

    constructor(site_type : SiteType,
                site_host : string,
                username : string,
                site_config : Nullable<any> = null) {
        this.site_type = site_type;
        this.site_host = site_host;
        this.username = username;
        this.site_config = site_config || {};
    }

    get id() : string {
        return this.site_host + ":" + this.username
    }
}

export class Article {
    id : string
    config : any
    constructor(id : string, config : any) {
        config = config || {};
        this.id = id;
        this.config = config;
    }
}

export class SiteList {
    sites : Site[] = []
    store : Store

    constructor(store : Store) {
        this.store = store;
    }

    /**
     * Save all the sites
     */
    saveAll(callback : any) {
        var payload = this.sites.map(function(v, i) {
            return {
                "site_type": v.site_type, 
                "site_host": v.site_host, 
                "username": v.username,
                "site_config": v.site_config
            };
        });
        this.store.set("sites", payload, callback);
    }

    loadAll(callback : any) {
        var self = this;
        this.store.get("sites", function(payload : any) {
            payload = payload || [];
            self.sites = payload.map(function(v : any, _index : Int) {
                return new Site(v["site_type"],
                                v["site_host"],
                                v["username"],
                                v["site_config"]);
            }); 
            callback();
        });
    }

    /** 
     * Return the site at the given index.
     */
    siteAt(index : Int) : Site {
        return this.sites[index];
    }

    /**
     * Find the index of the site given its ID.
     * Returns the index or -1 if not found.
     */
    findSite(id : string) : Int {
        for (var i = this.sites.length - 1;i >= 0;i--) {
            if (this.sites[i].id == id) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Add a new site.
     */
    addSite(site : Site) : Int {
        var index = this.findSite(site.id);
        if (index >= 0) {
            this.sites[index] = site;
        } else {
            index = this.sites.length;
            this.sites.push(site);
        }
        return index;
    }

    /**
     * Removes the site at a given index and returns it.
     */
    removeAt(index : Int) : Site {
        return this.sites.splice(index, 1)[0];
    }
}

