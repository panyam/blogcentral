
export function ensureParam(params : any, key : string) : any {
  if (!(key in params)) {
    throw new Error("'" + key + "' not found.");
  }
  return params[key];
}
