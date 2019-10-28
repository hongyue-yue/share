import pathToRegexp from "path-to-regexp";
import { createLocation } from "history";

export  const matchPath=(pathname, options = {})=>{
    if (typeof options === "string" || Array.isArray(options)) {
      options = { path: options };
    }
  
    const { path, exact = false, strict = false, sensitive = false } = options;
  
    const paths = [].concat(path);
  
    return paths.reduce((matched, path) => {
      if (!path) return null;
      if (matched) return matched;
      
      const keys = [];
      const regexp =  pathToRegexp(path, keys, { end: exact });
      const match = regexp.exec(pathname);
  
      if (!match) return null;
      const [url, ...values] = match;
      const isExact = pathname === url;
  
      if (exact && !isExact) return null;
  
      return {
        path, // the path used to match
        url: path === "/" && url === "" ? "/" : url, // the matched portion of the URL
        isExact, // whether or not we matched exactly
        params: keys.reduce((memo, key, index) => {
          memo[key.name] = values[index];
          return memo;
        }, {})
      };
    }, null);
}

export const resolveToLocation = (to, currentLocation) =>
typeof to === "function" ? to(currentLocation) : to;

export const normalizeToLocation = (to, currentLocation) => {
return typeof to === "string"
  ? createLocation(to, null, null, currentLocation)
  : to; 
};