import { ActivityIndicator } from "./ActivityIndicator";
import { View } from "./Views";

export class AuthDetailView extends View<any> {
  activityIndicator: ActivityIndicator;
  allFields: JQuery<any>;

  constructor(elem_or_id: any, authConfig: any = null) {
    super(elem_or_id, "authConfig", authConfig || {});
  }
}
