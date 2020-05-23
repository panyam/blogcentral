import { Nullable } from "./types";
import { Store, ContentExtractor, HttpClient } from "./interfaces";
import { Request, Response } from "./net";
import { Site } from "./sites";

declare var Quill: any;
export class LocalStore extends Store {
  async get(key: string) {
    key = this.normalizedKey(key);
    var value = window.localStorage.getItem(key);
    if (value != null) value = JSON.parse(value);
    return value;
  }

  async set(key: string, value: Nullable<any>) {
    key = this.normalizedKey(key);
    window.localStorage.setItem(key, JSON.stringify(value));
    return null as any;
  }

  async remove(key: string) {
    key = this.normalizedKey(key);
    window.localStorage.removeItem(key);
    return null as any;
  }
}

export class JQHttpClient implements HttpClient {
  async send(request: Request): Promise<Response> {
    var options: any = {
      url: request.url,
      method: request.method,
      headers: request.headers,
    };
    if (request.body != null) {
      options.data = request.body;
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

  toResponse(_response: any): Response {
    return new Response();
  }
}

export class LocalExtractor implements ContentExtractor {
  elemid: string;
  quill: any;

  get toolbarOptions() {
    return [
      // [{ 'font': fonts }],
      // [{ 'header': 1 }, { 'header': 2 }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],

      [{ list: "ordered" }, { list: "bullet" }],
      // [{ 'script': 'sub'}, { 'script': 'super' }],
      // [{ 'indent': '-1'}, { 'indent': '+1' }],
      // [{ 'direction': 'rtl' }],

      [{ color: [] }, { background: [] }],

      // [{align: []}],
      // [{ 'align': [false, 'right', 'center', 'justify'] }],
      [
        { align: "" },
        { align: "right" },
        { align: "center" },
        { align: "justify" },
      ],
      ["image", "video"],
      ["clean"], // remove formatting button
      ["fullscreen"],
    ];
  }

  constructor(elemid: string) {
    this.elemid = elemid;
    /*
    this.quill = new Quill("#" + elemid, {
      theme: "snow",
      debug: "info",
      placeholder: 'Enter Post Content Here...',
      scrollingContainer: '#quill_editor',
      modules: { toolbar: this.toolbarOptions } // "#quill_editor > #toolbar", },
    });
   */
  }
  async extractHtml(_site: Site) {
    var self = this;
    return new Promise((resolve, _reject) => {
      var val = $("#" + self.elemid).val();
      resolve(val);
    });
  }
}
