// import `.scss` files
// var $ = import("jquery"); import("jquery-ui");

import './styles/global';

import { BCJS } from './lib/index';

// export default UserList class
// I used `defaultExport` to state that variable name doesn't matter
export default BCJS;

$(function() {
    const app = new BCJS.App.App();
});
