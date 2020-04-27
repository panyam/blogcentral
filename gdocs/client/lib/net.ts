
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

