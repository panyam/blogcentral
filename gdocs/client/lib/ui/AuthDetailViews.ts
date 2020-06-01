import { ActivityIndicator } from "./ActivityIndicator";
import { View } from "./Views";
import { setVisible } from "./utils";

export interface IAuthDetailView  {
  showField(_fieldName : string, _show : boolean) : this
  enableField(_fieldName : string, _show : boolean) : this
}

export class AuthDetailView extends View<any> implements IAuthDetailView {
  activityIndicator: ActivityIndicator;
  allFields: JQuery<any>;

  constructor(elem_or_id: any, authConfig: any = null) {
    super(elem_or_id, "authConfig", authConfig || {});
  }

  elementsFor(_fieldName : string) : any[] { return [] }
  showField(fieldName : string, show : boolean = true) { 
   var fields = this.elementsFor(fieldName);
   fields.forEach((v : any) => {
       setVisible(v, show);
   });
   return this;
  }
  enableField(fieldName : string, enabled : boolean = true) {
   var fields = this.elementsFor(fieldName);
   fields.forEach((v : any) => {
       setVisible(v, enabled);
   });
   return this;
  }
}
