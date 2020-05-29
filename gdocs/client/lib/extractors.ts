import { Site } from "./siteapis";
export interface ContentExtractor {
  extractHtml(site: Site): Promise<any>;
}
