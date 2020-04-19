
import { Int, Nullable, Timestamp, Undefined } from "./types"

export type SiteCallback = () => Undefined<boolean>;

export enum SiteType {
    WORDPRESS,
    LINKEDIN,
    MEDIUM
};

export class WordpressSiteConfig {
    site_host : string
    constructor(site_host : string) {
        this.site_host = site_host;
    }
}

export class Site {
    id : string
    site_type : SiteType
    site_config : any

    constructor(siteid : string, site_type : SiteType, site_config : any) {
        this.id = siteid;
        this.site_type = site_type;
        this.site_config = site_config;
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
    site_keys : string[] = []
    site_map : { [key : string] : Site } = { }

    constructor() { }

    getSite(index : Int) : Site {
        return this.site_map[this.site_keys[index]];
    }

    /**
     * Add a new site.
     */
    addSite(site :Site) {
        this.site_keys.push(site.id);
        this.site_map[site.id] = site;
    }

    loadSites(callback : SiteCallback) {
        var site_keys = window.localStorage.getItem("site_keys");
        this.site_keys = [];
        this.site_map = {};
        var us = this;
        if (site_keys != null) {
            var site_keys_list : string[] = JSON.parse(site_keys);
            site_keys_list ?.forEach(function(siteid : string, index : Int) {
                var key = "site_details_" + siteid;
                var details = window.localStorage.getItem(key);
                var site = new Site(siteid, SiteType.WORDPRESS, details)
                us.addSite(site);
            });
        }
    }

    /**
     * Save the site given by the specific ID.
     */
    saveSite(siteid : string, callback : SiteCallback) {
        var site = this.site_map[siteid];
    }
}

export class LocalSiteService {
    getSites(callback : SiteCallback) {
    }

    addSite(site : Site, callback : SiteCallback) {
    }

    removeSite(site : Site, callback : SiteCallback) {
    }
};
