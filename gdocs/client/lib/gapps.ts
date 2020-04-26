
import { Nullable } from "./types"
import { Store } from "./stores"
import { Request, Response, HttpClient } from "./net"

declare var google : any;
export class PropertiesStore extends Store {
    async get(key : string) {
        key = this.normalizedKey(key);
        return new Promise((resolve, reject) => {
            google.script.run
                  .withFailureHandler(reject)
                  .withSuccessHandler(function(value : any) {
                        if (value != null)
                            value = JSON.parse(value);
                        resolve(value);
                  })
                  .getUserProperty(key);
        });
    }

    async set(key : string, value : Nullable<any>) {
        key = this.normalizedKey(key);
        return new Promise((resolve, reject) => {
            google.script.run
                  .withSuccessHandler(resolve)
                  .withFailureHandler(reject)
                  .setUserProperty(key, JSON.stringify(value));
        });
    }
};

export class GAppsHttpClient extends HttpClient {
    async send(request : Request) : Promise<Response> {
        var options : any = {
            "method": request.method,
            "url": request.url,
            "headers": request.headers,
            "muteHttpExceptions": false
        };
        if (request.body != null) {
            if (request.contentType == "application/json") {
                options.payload = JSON.stringify(request.body);
            } else {
                options.payload = request.body;
            }
        }
        var response = await $.ajax(options);
        return this.toResponse(response);
    }

    toResponse(response : any) : Response {
        return new Response();
    }
}
