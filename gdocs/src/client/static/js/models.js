const SiteType = {
    WORDPRESS: "WordPress",
    LINKEDIN: "LinkedIn",
    MEDIUM: "Medium"
};

class WordpressSiteConfig {
    constructor(site_host) {
        this.site_host = site_host;
    }
}

class Site {
    constructor(siteid, site_type, site_config) {
        this.siteid = siteid;
        this.site_type = site_type;
        this.site_config = site_config;
    }
}

class Article {
    constructor(id, config) {
        config = config || {};
        this.id = id;
        this.site_type = config.site_type;
        this.site_host = config.site_host;
        this.config = config;
    }
}

class SiteList {
    constructor() {
        this.site_keys = [];
        this.site_map = [];
    }

    getSite(index) {
        return this.site_map[this.site_keys[index]];
    }

    /**
     * Add a new site.
     */
    addSite(site) {
        this.site_keys.push(site.id);
        this.site_map[site.id] = site;
    }

    loadSites(callback) {
        var site_keys = window.localStorage.getItem("site_keys");
        this.site_keys = [];
        this.site_map = {};
        var us = this;
        if (site_keys != null) {
            site_keys = JSON.parse(site_keys);
            site_keys.forEach(function(siteid, index) {
                var key = "site_details_" + siteid;
                var details = window.localStorage.getItem(key);
                var site = new Site(siteid, details)
                us.addSite(site);
            });
        }
    }

    /**
     * Save the site given by the specific ID.
     */
    saveSite(siteid, callback) {
        var site = this.site_map[siteid];
    }
}

class LocalSiteService {
    getSites(callback) {
    }

    addSite(site, callback) {
    }

    removeSite(site, callback) {
    }
};

var localSiteService = new LocalSiteService()
