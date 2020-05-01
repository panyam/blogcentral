
import { Int, Nullable, Undefined } from "./types"
declare var CLIENT_ENV : string;

export class Request {
    url : string
    options : any;

    constructor(url : string, options : any) {
        this.url = url;
        this.options = options || {};
        this.options.headers = this.options.headers || {};
        this.options.body = this.options.body || null;
    }

    get method() : string {
        return this.options.method || "GET";
    }

    set method(method : string) {
        this.options.method = method;
    }

    get body() : any {
        return this.options.body;
    }

    set body(body : any) {
        this.options.body = body;
    }

    get headers() : any {
        return this.options.headers;
    }

    get contentType() : string {
        return this.options.contentType;
    }
}

export class Response {
    status : Int
    statusText : string
    headers : any = {}
    data : any = null
    error : any = null

    constructor(status : Int = 200, statusText : string = "", data : any = null) {
        this.status = status;
        this.statusText = statusText;
        this.data = data;
    }
}

export class HttpClient {
    async send(request : Request) : Promise<Response> {
        return new Response();
    }
}

