
import './styles/global';

import { BCJS } from './lib/index';
import { ServiceCatalog } from "./lib/catalog";
import { PropertiesStore, GAppsHttpClient } from "./lib/gapps";

$(function() {
    var store = new PropertiesStore("BC");
    var httpClient = new GAppsHttpClient();
    var catalog = new ServiceCatalog(store, httpClient);
    const app = new BCJS.App.App(catalog);
});

// export default UserList class
// I used `defaultExport` to state that variable name doesn't matter
// export default BCJS;
