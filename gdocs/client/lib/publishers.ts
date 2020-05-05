
import { Site, Post } from "./models"

export interface ContentPublisher {
    publishToSite(site : Site, content : any) : Promise<any>
};

