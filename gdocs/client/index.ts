// import `.scss` files
// var $ = import("jquery"); import("jquery-ui");

import './styles/global';

import { BCJS } from './lib/index';

// export default UserList class
// I used `defaultExport` to state that variable name doesn't matter
export default BCJS;

declare var CLIENT_ENV : string;

$(function() {
    var store = null;
    if (CLIENT_ENV == "gdocs") {
        store = new BCJS.Stores.PropertiesStore();
    } else {
        store = new BCJS.Stores.LocalStore();
    }
    const app = new BCJS.App.App(store);
});
