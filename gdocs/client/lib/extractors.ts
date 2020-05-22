import { Site } from "./sites";

export interface ContentExtractor {
  extractHtml(site: Site): Promise<any>;
}
