import { Site } from "./models";

export interface ContentExtractor {
  extractHtml(site: Site): Promise<any>;
}
