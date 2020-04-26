// import `.scss` files
// var $ = import("jquery"); import("jquery-ui");

import './styles/global';

import { BCJS } from './lib/index';
import { LocalStore, JQHttpClient } from "./lib/flask";

$(function() {
    var store = new LocalStore("BC");
    var httpClient = new JQHttpClient();
    const app = new BCJS.App.App(store, httpClient);
});

// export default UserList class
// I used `defaultExport` to state that variable name doesn't matter
// export default BCJS;
