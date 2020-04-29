
import { Site } from "./models";
import { Nullable } from "./types"

export interface SiteLoginProvider {
    startLogin(site : Site) : Promise<Nullable<Site>>
    cancelLogin() : void
    loginFailed(error : Nullable<Error>, message : string) : void
}
