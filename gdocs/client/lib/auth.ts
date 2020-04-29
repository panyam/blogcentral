
import { Site } from "./models";
import { Nullable } from "./types"

export interface SiteLoginProvider {
    ensureLoggedIn(site : Site) : Promise<boolean>
}
