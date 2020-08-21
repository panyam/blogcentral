

class OAuth2Service {
    readonly serviceName : string;
    readonly params : any = {}
    readonly tokenHeaders : any = {}
    authorizationBaseUrl : string;
    tokenUrl : string
    refreshUrl : string
    authCallbackFunction : string
    clientId : string
    clientSecret : string

    constructor(name : string) {
        this.serviceName = name;
    }
}
