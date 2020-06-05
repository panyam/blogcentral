import { URLBuilder, Request, Response, HttpClient } from "./net";

export class ProxyHttpClient implements HttpClient {
  endpoint: string;
  useQueryParams: boolean = false;
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async send(request: Request): Promise<Response> {
    var builder = new URLBuilder(this.endpoint);
    var data: any = {};
    if (this.useQueryParams) {
      builder
        .addParam("url", request.url)
        .addParam("method", request.method || "GET");
    } else {
      data["url"] = request.url;
      data["method"] = request.method || "GET";
    }
    if (request.headers) {
      data["headers"] = request.headers;
    }
    if (request.body != null) {
      data.body = request.body;
    }
    var options: any = {
      url: builder.build(),
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(data),
    };

    return new Promise((resolve: any, reject: any) => {
      $.ajax(options)
        .done((data, _textStatus, _jqXHR) => {
          var realBody = atob(data.data);
          if (data.contentType.startsWith("application/json")) {
            realBody = JSON.parse(realBody);
          }
          var response = new Response(data.status, data.statusText, realBody);
          response.headers = data.headers || {};
          if (response.status >= 200 && response.status <= 299) {
            resolve(response);
          } else if (response.status >= 400) {
            reject(response);
          } else {
            throw new Error("Not sure how to handle 1xx and 3xx");
          }
        })
        .fail((jqXHR, _textStatus, errorThrown) => {
          var response = new Response(jqXHR.status, jqXHR.statusText);
          response.headers = jqXHR.getAllResponseHeaders();
          response.error = errorThrown;
          reject(response);
        });
    });
  }
}
