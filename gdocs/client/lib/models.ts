
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
    config : any
    selectedPosts : Post[] = [];

    constructor(site_type : SiteType,
                site_host : string,
                username : string,
                config : Nullable<any> = null) {
        this.site_type = site_type;
        this.site_host = site_host;
        this.username = username;
        this.config = config || {};
    }

    get payload() : any {
        var selectedPosts = this.selectedPosts;
        return {
            "site_type": this.site_type, 
            "site_host": this.site_host, 
            "username": this.username,
            "selectedPosts": selectedPosts.map(p => p.payload),
            "config": this.config || {}
        };
    }

    get id() : string {
        return this.site_host + ":" + this.username
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
                        value["config"] || {});
    }

    async saveSite(site : Site) {
        // now save the site itself
        return this.store.set("site:" + site.id, site.payload);
    }

    async saveSiteIds() {
        var siteids = this.sites.map(function(v, _i) { return v.id; });
        return this.store.set("siteids", siteids);
    }

    async loadSiteIds() {
        return this.store.get("siteids");
    }
}


export class Post {
    id : Nullable<string>
    config : any
    constructor(id : Nullable<string> = null, config : any = null) {
        config = config || {};
        this.id = id;
        this.config = config;
    }

    get payload() : any {
        return {
            "id": this.id,
            "config": this.config
        };
    }
}

export class PostService {
    posts : Post[] = []
    store : Store

    constructor(store : Store) {
        this.store = store;
    }

    /** 
     * Return the post at the given index.
     */
    postAt(index : Int) : Post {
        return this.posts[index];
    }

    /**
     * Find the index of the post given its ID.
     * Returns the index or -1 if not found.
     */
    indexOf(id : string) : Int {
        for (var i = this.posts.length - 1;i >= 0;i--) {
            if (this.posts[i].id == id) {
                return i;
            }
        }
        return -1;
    }

    async loadAll() {
        var self = this;
        var postids = await this.loadPostIds()
        var postPromises = postids.map(async function(id : string, _index : Int) { return self.loadPost(id); });
        this.posts = await Promise.all(postPromises);
        return true;
    }

    /**
     * Add a new post.
     */
    async addPost(post : Post) {
        return 0;
    }

    /**
     * Removes the post at a given index and returns it.
     */
    async removeAt(index : Int) {
        var post : Post = this.posts.splice(index, 1)[0];
        await this.savePostIds();
        await this.store.remove("post:" + post.id);
        return post;
    }

    async loadPost(id : string) : Promise<Post> {
        var value : any = await this.store.get("post:" + id);
        return new Post(null);
    }

    async savePost(post : Post) {
        return 0;
    }

    async savePostIds() {
        var postids = this.posts.map(function(v, _i) { return v.id; });
        return this.store.set("postids", postids);
    }

    async loadPostIds() {
        return this.store.get("postids");
    }
}
