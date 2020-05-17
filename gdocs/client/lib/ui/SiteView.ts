
declare var Handlebars: any;
import { ensureElement } from "./utils";
import { Int, Nullable } from "../types";
import { SiteType, Site, Post } from "../models";
import { ServiceCatalog } from "../catalog";
import { ActivityIndicator } from "./ActivityIndicator";

export class SiteView {
  rootElement: any;
  site : Site
  progressbar : any
  publishPostButton : any
  selectPostButton : any
  removeButton : any
  activityIndicator: ActivityIndicator;
  tag : any = null

  constructor(elem_or_id : any, site : Site, tag : any = null) {
    this.rootElement = ensureElement(elem_or_id);
    this.site = site;
    this.tag = tag;
    this.setupViews();
  }
  
  setupViews() {
    var siteTemplate = Handlebars.compile(this.template);
    var html = siteTemplate({
        site : this.site
    });
    this.rootElement.html(html);

    this.progressbar = this.rootElement.find(".progressbar");
    var aidiv = this.rootElement.find(".activity_indicator");
    this.activityIndicator = new ActivityIndicator(aidiv);
    this.publishPostButton = this.rootElement.find(".publish_post_button");
    this.selectPostButton = this.rootElement.find(".select_post_button");
    this.removeButton = this.rootElement.find(".remove_site_button");
  }

  showBusy(busy: boolean) {
    if (busy) this.activityIndicator.show();
    else this.activityIndicator.hide();
  }

  showProgress(busy: boolean) {
    this.publishPostButton.prop("disabled", busy);
    this.removeButton.prop("disabled", busy);
    if (busy) {
      this.progressbar.progressbar("option", "value", false);
      this.progressbar.show();
    } else {
      this.progressbar.hide();
    }
  }

  get template(): string {
    return `
      <div class = "activity_indicator" />
      <table width="100%" class = "site_table"">
        <tr>
          <td class = "td_param_name"> Site Host: </td>
          <td> {{this.site.site_host}} </td>
          <td rowspan = 2>
            <center>
            <button class="remove_site_button ui-button ui-widget ui-corner-all ui-button-icon-only" title="Remove Site">
                <span class="ui-icon ui-icon-trash"></span> Remove Site
            </button><br/>
            <button class = "select_post_button ui-button ui-widget ui-corner-all" title="Select Post">Posts</button>
            </center>
          </td>
        </tr>
        <tr>
          <td class = "td_param_name"> Username: </td>
          <td> {{this.site.username}} </td>
        </tr>
        {{# if this.site.selectedPost }}
        <tr>
          <td colspan = 2>
            <h3 style="margin-bottom: 0px">Post:</h3>
              <a target="_blank" href="{{ this.site.selectedPost.link }}">
                {{this.site.selectedPost.id}} : {{{ this.site.selectedPost.title.rendered }}} 
              </a>
          </td>
          <td>
            <center>
              <button class = "publish_post_button ui-button ui-widget ui-corner-all" >Publish</button>
            </center>
          </td>
        </tr>
        {{/if}}
        <!--<tr>
          <td colspan = 3>
            <center> <div class = "progressbar"></div> </center>
          </td>
        </tr>-->
      </table>
      `;
  }
}

