
import './styles/global';

import { BCJS } from './lib/index';
import { ServiceCatalog } from "./lib/catalog";
import { SiteGateway } from "./lib/gateway";
import { PropertiesStore } from "./lib/gapps";
import { GAppsHttpClient } from "./lib/gapps";
// import { JQHttpClient } from "./lib/flask";

$(function() {
    var store = new PropertiesStore("BC");
    var httpClient = new GAppsHttpClient();
    // var httpClient = new JQHttpClient();
    var catalog = new ServiceCatalog(store, httpClient);
    catalog.siteGateway = new SiteGateway(catalog);
    (window as any).bcApp = new BCJS.App.App(catalog)
});

// export default UserList class
// I used `defaultExport` to state that variable name doesn't matter
// export default BCJS;
