export function ensureParam(params: any, key: string): any {
  if (!(key in params)) {
    throw new Error("'" + key + "' not found.");
  }
  return params[key];
}

export function valOrDefault(value: any, defval: any): any {
  if (value == null || value == "") return defval;
  return value;
}

export function dateDelta(time: any, delta: number = 1, units: string = "s") {
  if (units == "s" || units == "seconds") {
    delta = delta * 1000;
  } else if (units == "m" || units == "minutes") {
    delta = delta * (60 * 1000);
  } else if (units == "h" || units == "hours") {
    delta = delta * (3600 * 1000);
  } else if (units == "d" || units == "days") {
    delta = delta * (24 * 60 * 60 * 1000);
  } else if (units == "w" || units == "weeks") {
    delta = delta * (7 * 24 * 60 * 60 * 1000);
  }
  return time + delta;
}

const JSON_DECODE = { oauth2_state: true, oauth2_response: true };

export function parseQP(qpstring: string) {
  var out: any = {};
  if (qpstring.startsWith("?")) {
    qpstring = qpstring.substring(1);
  }
  var qps = qpstring.split("&");
  for (var i = 0; i < qps.length; i++) {
    var parts = qps[i].split("=");
    var key = parts[0];
    if (key.length > 0) {
      if (parts.length == 1) {
        out[key] = "";
      } else {
        out[key] = decodeURIComponent(parts[1]);
        if (key in JSON_DECODE) {
          out[key] = JSON.parse(out[key]);
        }
      }
    }
  }
  return out;
}

export function parseCookies() {
  var out: any = {};
  // var decodedCookie = decodeURIComponent(document.cookie);
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var parts = cookies[i].split("=");
    var key = parts[0].trim();
    if (key.length > 0) {
      if (parts.length == 1) {
        out[key] = "";
      } else {
        out[key] = decodeURIComponent(parts[1].trim());
        if (key in JSON_DECODE) {
          out[key] = JSON.parse(out[key]);
        }
      }
    }
  }
  return out;
}
