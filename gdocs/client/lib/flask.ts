
import { Nullable } from "./types"
import { Store } from "./stores"
import { Request, Response, HttpClient } from "./net"

export class LocalStore extends Store {
    async get(key : string) {
             key = this.normalizedKey(key);
        var value = window.localStorage.getItem(key);
        if (value != null) 
            value = JSON.parse(value);
        return value;
    }

    async set(key : string, value : Nullable<any>) {
        key = this.normalizedKey(key);
        window.localStorage.setItem(key, JSON.stringify(value));
        return null as any;
    }

    async remove(key : string) {
        key = this.normalizedKey(key);
        window.localStorage.removeItem(key);
        return null as any;
    }
};

export class JQHttpClient extends HttpClient {
    async send(request : Request) : Promise<Response> {
        var options : any = {
            "url": request.url,
            "method": request.method,
            "headers": request.headers
        };
        if (request.body != null) {
            options.data = request.body;
        }
        return new Promise((resolve : any, reject : any) => {
            $.ajax(options).done((data, textStatus, jqXHR) => {
                var response = new Response(jqXHR.status, jqXHR.statusText, data);
                response.headers = jqXHR.getAllResponseHeaders();
                resolve(response);
            }).fail((jqXHR, textStatus, errorThrown) => {
                var response = new Response(jqXHR.status, jqXHR.statusText);
                response.headers = jqXHR.getAllResponseHeaders();
                response.error = errorThrown;
                reject(response);
            });
        });
    }

    toResponse(response : any) : Response {
        return new Response();
    }
}

