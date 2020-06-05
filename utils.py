
from flask import request, Flask, Blueprint, render_template, redirect, jsonify, make_response, session, json
from werkzeug.routing import RequestRedirect, MethodNotAllowed, NotFound
import requests, logging, base64, datetime, urllib.parse

class JsonEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.strftime(DEFAULT_DATETIME_FORMAT)
        elif isinstance(obj, bytes):
            return base64.b64encode(obj).decode()
        elif hasattr(obj, "to_json"):
            return obj.to_json()
        elif isinstance(obj, bytes):
            return obj.decode()
        else:
            pass
        return super(JsonEncoder, self).default(obj)

def urlfetch():
    payload = {}
    if request.data:
        payload = request.json
    url = request.args.get("url") or payload["url"]
    method = (request.args.get("method") or payload.get("method", "get")).lower()
    headers = payload.get("headers", {})
    body = payload.get("body", None)

    methodfunc = getattr(requests, method)
    response = methodfunc(url, data = body, headers = headers)
    # import ipdb ; ipdb.set_trace()
    out = {
        "status": response.status_code,
        "statusText": response.reason,
        "contentType": response.headers["content-type"],
        "headers": dict(response.headers.items()),
        "data": base64.b64encode(response.content).decode("utf-8")
    }
    return jsonify(out)

def get_view_function(app, url, host = "localhost", method='GET'):
    """Match a url and return the view and arguments
    it will be called with, or None if there is no view.
    """
    adapter = app.url_map.bind(host)
    try:
        match = adapter.match(url, method=method)
    except RequestRedirect as e:
        # recursively match redirects
        return get_view_function(app, e.new_url, host, method)
    except (MethodNotAllowed, NotFound):
        # no match
        return None,None

    try:
        # return the view function and arguments
        return app.view_functions[match[0]], match[1]
    except KeyError:
        # no view is associated with the endpoint
        return None,None

class OAuth2Handler(object):
    def __init__(self, app, **kwargs):
        self.app = app
        self.site = kwargs['site']
        self.success_uri = kwargs.get("success_uri", "/")
        self.client_id = kwargs["client_id"]
        self.client_secret = kwargs["client_secret"]
        self.redirect_uri = kwargs["redirect_uri"]
        self.token_url = kwargs["token_url"]
        self.__name__ = f"{self.site}_oauth2_redirect_handler"

    def __call__(self, *args, **kwargs):
        code = request.args.get("code")
        state = request.args.get("state", "")

        # Hack to work around medium's not allowing localhost URLs
        # So we forward to localhost if we are not currently running on 
        # localhost and the state param this flag
        if state:
            js = json.loads(state)
            forward_host = js.get("forward_host", None)
            logging.debug("Forward Host: ", forward_host)
            logging.debug("Request Host: ", request.host)
            if forward_host and forward_host != request.host:
                new_url = f"{request.scheme}://{request.host}{request.path}"
                if request.query_string:
                    new_url += "?" + request.query_string.decode("utf-8")
                return redirect(new_url)

        redirect_uri = f"{request.scheme}://{request.host}{self.redirect_uri}"
        data = {
            "grant_type": "authorization_code",
            "redirect_uri": redirect_uri,
            "code": code,
            "client_id": self.client_id,
            "client_secret": self.client_secret
        }
        response = requests.post(self.token_url, data = data)
        return self.handle_access_token(state, response.json())

    def handle_access_token(self, state, response):
        session["auth_results"] = urllib.parse.quote(json.dumps([{
            'state': state,
            'response': response
        }]))
        return redirect(self.success_uri);
        """
        viewfunc, vfargs = get_view_function(self.app, self.success_uri, request.host)
        return viewfunc(auth_results = auth_results)
        """
