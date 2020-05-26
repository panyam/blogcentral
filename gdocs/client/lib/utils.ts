
export function ensureParam(params : any, key : string) : any {
  if (!(key in params)) {
    throw new Error("'" + key + "' not found.");
  }
  return params[key];
}

export function valOrDefault(value : any, defval : any) : any {
    if (value == null ||value == "") return defval;
    return value;
}

export function dateDelta(time : any, delta : number = 1, units : string = "s") {
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
