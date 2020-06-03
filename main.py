from flask import request, Flask, Blueprint, render_template, redirect, jsonify
import requests


# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__)

def common_properties():
    gsuite_marketplace_id = "712411571237"
    return dict(
        company_name = "Blog Central",
        gsuite_marketplace_id = f"{gsuite_marketplace_id}",
        gsuite_marketplace_url = f"https://gsuite.google.com/marketplace/app/blogcentral/{gsuite_marketplace_id}",
        last_updated_date = "March-16-2020",
        servers_locations_label = "US",
        retention_period_string = "30 days",
        contact_email = "sri.panyam@gmail.com"
        )

@app.route('/terms-of-service/')
def tos():
    return render_template("tos.html", **common_properties())

@app.route('/privacypolicy/')
def privacypolicy():
    return render_template("privacy.html", **common_properties())

@app.route('/client/')
def client():
    return render_template("client/index.flask.html", **common_properties())

@app.route('/')
def homepage():
    return render_template("homepage.html", **common_properties())

class OAuth2Api:
    def __init__(self, **kwargs):
        self.client_id = kwargs["client_id"]
        self.client_secret = kwargs["client_secret"]
        self.redirect_uri = kwargs["redirect_uri"]
        self.token_url = kwargs["token_url"]

    def get(self):
        data = {
            "grant_type": "authorization_code",
            "redirect_uri": self.redirect_uri,
            "code": code,
            "client_id": self.client_id,
            "client_secret": self.client_secret
        }
        import ipdb ; ipdb.set_trace()
        response = requests.post(self.token_url, data = data)

        # if token is valid save it so it can be sent next time

        # Redirect back to home page (or manage state to go to right place)
        return render_template("homepage.html", **common_properties())

app.route("/oauth2/wordpress/redirect")(OAuth2Api(**wpconfigs))

if __name__ == '__main__':
    import os, sys
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = "1"

    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
