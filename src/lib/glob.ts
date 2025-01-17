import { basename } from "path";

/** Takes a hash returned from import.meta.glob, and shortens its keys to basenames only. */
export function mapImportsToBasenames<M>(globResult: Record<string, M>) {
  return Object.entries(globResult).reduce((map, [key, value]) => {
    map[basename(key, ".astro")] = value;
    return map;
  }, {} as typeof globResult);
}
