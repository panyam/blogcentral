
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

export class SiteService {
    sites : Site[] = []
    store : Store

    constructor(store : Store) {
        this.store = store;
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
    indexOf(id : string) : Int {
        for (var i = this.sites.length - 1;i >= 0;i--) {
            if (this.sites[i].id == id) {
                return i;
            }
        }
        return -1;
    }

    async loadAll() {
        var self = this;
        var siteids = await this.loadSiteIds()
        var sitePromises = siteids.map(async function(id : string, _index : Int) { return self.loadSite(id); });
        this.sites = await Promise.all(sitePromises);
        return true;
    }

    /**
     * Add a new site.
     */
    async addSite(site : Site) {
        var self = this;
        var index = this.indexOf(site.id);
        if (index >= 0) {
            this.sites[index] = site;
        } else {
            index = this.sites.length;
            this.sites.push(site);
        }
        await this.saveSiteIds();
        await self.saveSite(site);
        return index;
    }

    /**
     * Removes the site at a given index and returns it.
     */
    async removeAt(index : Int) {
        var site : Site = this.sites.splice(index, 1)[0];
        await this.saveSiteIds();
        await this.store.remove("site:" + site.id);
        return site;
    }

    async loadSite(id : string) : Promise<Site> {
        var value : any = await this.store.get("site:" + id);
        return new Site(value["site_type"],
                        value["site_host"],
                        value["username"],
                        value["site_config"]);
    }

    async saveSite(site : Site) {
        // now save the site itself
        var payload = {
            "site_type": site.site_type, 
            "site_host": site.site_host, 
            "username": site.username,
            "site_config": site.site_config
        };
        return this.store.set("site:" + site.id, payload);
    }

    async saveSiteIds() {
        var siteids = this.sites.map(function(v, _i) { return v.id; });
        return this.store.set("siteids", siteids);
    }

    async loadSiteIds() {
        return this.store.get("siteids");
    }
}

