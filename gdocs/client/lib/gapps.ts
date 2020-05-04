
import { Nullable } from "./types"
import { Store } from "./stores"
import { Request, Response, HttpClient } from "./net"

declare var google : any;
declare var UrlFetchApp : any;
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
            "headers": request.headers,
            "muteHttpExceptions": false
        };
        if (request.contentType) {
            options.contentType = request.contentType;
        }
        if (request.body != null) {
            if (request.contentType == "application/json") {
                options.payload = JSON.stringify(request.body);
            } else {
                options.payload = request.body;
            }
        }
        var self = this;
        return new Promise((resolve, reject) => {
            google.script.run
                    .withSuccessHandler((response : any) => {
                        resolve(self.toResponse(request, response));
                    })
                    .withFailureHandler(reject)
                    .urlfetch(request.url, options);
        });
    }

    toResponse(_request : Request, response : any) : Response {
        console.log("Response: ", response);
        var out = new Response(response.status, "", response.data);
        out.headers = response.headers;
        return out;
    }
}
