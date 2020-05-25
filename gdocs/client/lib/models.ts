import { Int, Nullable } from "./types";
import { Store, SiteType, AuthType } from "./interfaces";
import { ensureParam } from "./utils";

export class Post {
  id: Nullable<string>;
  options: any;
  constructor(id: Nullable<string> = null, options: any = null) {
    options = options || {};
    this.id = id;
    this.options = options;
  }

  get payload(): any {
    return {
      id: this.id,
      options: this.options,
    };
  }
}

export class Site {
  title: string;
  siteType: SiteType;
  siteConfig: any;
  authType: AuthType;
  authConfig: any;
  selectedPost: any = null;

  constructor(title: string, configs: any) {
    this.title = title;
    configs = configs || {};
    this.siteType = ensureParam(configs, "siteType");
    this.authType = ensureParam(configs, "authType");
    this.siteConfig = ensureParam(configs, "siteConfig");
    this.authConfig = ensureParam(configs, "authConfig");
  }

  equals(another: Site): boolean {
    return (
      this.title == another.title &&
      this.siteType == another.siteType &&
      this.authType == another.authType &&
      this.authConfig == another.authConfig &&
      this.siteConfig == another.siteConfig
    );
  }

  get config(): any {
    return {
      title: this.title,
      config: {
        siteType: this.siteType,
        authType: this.authType,
        siteConfig: this.siteConfig,
        authConfig: this.authConfig,
      },
    };
  }
}

export class SiteService {
  sites: Site[] = [];
  store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  /**
   * Return the site at the given index.
   */
  siteAt(index: Int): Site {
    return this.sites[index];
  }

  /**
   * Find the index of the site given its ID.
   * Returns the index or -1 if not found.
   */
  indexOf(site: Site): Int {
    for (var i = this.sites.length - 1; i >= 0; i--) {
      if (this.sites[i].equals(site)) {
        return i;
      }
    }
    return -1;
  }

  async saveSite(_site: Site) {
    return this.saveAll();
  }

  async saveAll() {
    var configs = this.sites.map((site: Site) => {
      return site.config;
    });
    return this.store.set("sites", configs);
  }

  async loadAll() {
    var sites = (await this.store.get("sites")) || [];
    this.sites = sites.map(function (data: any, _index: Int) {
      return new Site(data.title, data.config);
    });
    return true;
  }

  /**
   * Add a new site.
   */
  async addSite(site: Site) {
    var index = this.indexOf(site);
    if (index >= 0) {
      this.sites[index] = site;
    } else {
      index = this.sites.length;
      this.sites.push(site);
    }
    await this.saveAll();
    return index;
  }

  async remove(site: Site) {
    var index = this.indexOf(site);
    return this.removeAt(index);
  }

  /**
   * Removes the site at a given index and returns it.
   */
  async removeAt(index: Int) {
    if (index < 0) {
      return null;
    } else {
      var site: Site = this.sites.splice(index, 1)[0];
      // await this.saveSiteIds();
      // await this.store.remove("site:" + site.id);
      await this.saveAll();
      return site;
    }
  }
}
