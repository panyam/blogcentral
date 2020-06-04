import { URLBuilder, Request, Response, HttpClient } from "./net";

export class ProxyHttpClient implements HttpClient {
  endpoint: string;
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async send(request: Request): Promise<Response> {
    var builder = new URLBuilder(this.endpoint)
      .addParam("url", request.url)
      .addParam("method", request.method || "GET");
    var options: any = {
      url: builder.build(),
      data: {
        headers: request.headers,
      },
    };

    if (request.body != null) {
      options.data.body = request.body;
    }

    return new Promise((resolve: any, reject: any) => {
      $.ajax(options)
        .done((data, textStatus, jqXHR) => {
          var response = new Response(jqXHR.status, jqXHR.statusText, data);
          response.headers = jqXHR.getAllResponseHeaders();
          resolve(response);
        })
        .fail((jqXHR, textStatus, errorThrown) => {
          var response = new Response(jqXHR.status, jqXHR.statusText);
          response.headers = jqXHR.getAllResponseHeaders();
          response.error = errorThrown;
          reject(response);
        });
    });
  }
}
