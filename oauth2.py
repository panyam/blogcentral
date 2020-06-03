
from flask import request, Flask, Blueprint, render_template, redirect, jsonify, make_response
import requests

class OAuth2Handler(object):
    def __init__(self, **kwargs):
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
        import json, urllib.parse
        qstate = urllib.parse.quote(json.dumps(state))
        qresponse = urllib.parse.quote(json.dumps(response))
        # redir_url = f"{self.success_uri}?oauth2_state={qstate}&oauth2_response={qresponse}"
        redir_response = make_response(redirect(self.success_uri))
        redir_response.set_cookie("auth_state", qstate);
        redir_response.set_cookie("auth_response", qresponse);
        return redir_response
