import { IAuthDetailView } from "../ui/AuthDetailViews";

export interface ITokenAuthDetailView extends IAuthDetailView {
  token: string;
  authBaseUrl: string;
}
