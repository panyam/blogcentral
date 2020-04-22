
import { Int, Nullable, Timestamp, Undefined } from "./types"

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

    constructor() {
        this.loadAll();
    }

    /**
     * Save all the sites
     */
    saveAll() {
    }

    loadAll() {
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
        this.save();
        return index;
    }

    /**
     * Removes the site at a given index and returns it.
     */
    removeAt(index : Int) : Site {
        return this.sites.splice(index, 1)[0];
    }

    loadSites(callback : SiteCallback) {
        /*
        var site_keys = window.localStorage.getItem("site_keys");
        this.site_keys = [];
        this.site_map = {};
        var us = this;
        if (site_keys != null) {
            var site_keys_list : string[] = JSON.parse(site_keys);
            site_keys_list ?.forEach(function(siteid : string, index : Int) {
                var key = "site_details_" + siteid;
                var details = window.localStorage.getItem(key);
                // var site = new Site(SiteType.WORDPRESS, details)
                // us.addSite(site);
            });
        }
       */
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
