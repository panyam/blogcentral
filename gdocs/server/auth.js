

function loginToWordPress(site, credentials) {
    var token = null;
    try {
        var response = UrlFetchApp.fetch(url, options);
        var data = JSON.parse(response)
        token = data.token;
        setSiteProperty(site, "token", token);
        console.log('got valid connection token' );
    } catch(error) {
        console.log( 'invalid user or password: url: '+ url +' err: ' + error.toString());
    }
    return token;
}

