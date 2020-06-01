
import { ITokenAuthDetailView } from "../tokenauth/interfaces"

export interface ILoginAuthDetailView extends ITokenAuthDetailView {
    tokenUrl : string
    validateUrl : string
}
