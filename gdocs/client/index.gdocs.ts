
import './styles/global';

import { BCJS } from './lib/index';
import { PropertiesStore, GAppsHttpClient } from "./lib/gapps";

$(function() {
    var store = new PropertiesStore("BC");
    var httpClient = new GAppsHttpClient();
    const app = new BCJS.App.App(store, httpClient);
});

// export default UserList class
// I used `defaultExport` to state that variable name doesn't matter
// export default BCJS;
