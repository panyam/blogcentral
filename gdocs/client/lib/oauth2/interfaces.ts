
import { IAuthDetailView } from "../ui/AuthDetailViews"

export interface IOAuth2AuthDetailView extends IAuthDetailView {
  authBaseUrl : string
  clientId : string
  tokenUrl : string
  authorizeUrl : string
  authenticateUrl : string
}
