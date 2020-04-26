

function loginToWordPress(site, credentials) {
    var payload = {
        username: site.username,
        password: credentials.password
    };
    var options = {
      'method': 'post',
      "contentType" : "application/json",
      'payload': JSON.stringify(payload),
      'muteHttpExceptions': false
    }
    var apiHost = site.site_host + '/wp-json';
    var url = apiHost + '/jwt-auth/v1/token';
    var ui = DocumentApp.getUi();
    try {
        var response = UrlFetchApp.fetch(url, options);
        var data = JSON.parse(response)
        var token = data.token;
        setSiteProperty(site, "token", token);
        var result = ui.alert( 'got valid connection token' );
    } catch(error) {
        var result = ui.alert( 'invalid user or password: url: '+ url +' err: ' + error.toString());
    }
}

