// import `.scss` files
// var $ = import("jquery"); import("jquery-ui");

import './scss/styles.scss';

import { BCJS } from './lib/index';

// export default UserList class
// I used `defaultExport` to state that variable name doesn't matter
export default BCJS;

$(function() {
    alert("Here");
    const app = new BCJS.App.App();
});
