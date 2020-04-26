
import { Int, Nullable, Undefined } from "./types"
declare var CLIENT_ENV : string;

export class Request {
    method : string
    url : string
    headers : any;
    options : any;
    body : any;

    constructor(url : string, options : any) {
        this.url = url;
        this.options = options || {};
        this.method = options.method || "GET";
        this.headers = options.headers || {};
        this.body = options.body || null;
    }

    get contentType() : string {
        return this.options.contentType;
    }
}

export class Response {
    status : Int
    body : any
    headers : any

    constructor(status : Int = 200, body : any = null) {
        this.status = status;
        this.body = body;
    }

    get bodyAsJson() : any {
        return JSON.parse(this.body);
    }
}

export class HttpClient {
    async send(request : Request) : Promise<Response> {
        return new Response();
    }
}

