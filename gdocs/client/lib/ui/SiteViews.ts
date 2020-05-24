declare var Handlebars: any;
import { SiteType } from "../interfaces";
import { Site } from "../sites";
import { ActivityIndicator } from "./ActivityIndicator";
import { View } from "./Views";

export function createSiteView(elem_or_id: any, site: Site, tag: any = null) {
  if (site.siteType == SiteType.WORDPRESS) {
    return new WPSiteView(elem_or_id, site, tag).setup();
  } else if (site.siteType == SiteType.MEDIUM) {
    return new MediumSiteView(elem_or_id, site, tag).setup();
  } else if (site.siteType == SiteType.LINKEDIN) {
    return new LISiteView(elem_or_id, site, tag).setup();
  }
  throw new Error("Unsupported Site Type: " + site.siteType);
}

export class SiteView extends View {
  readonly site: Site;
  publishPostButton: any;
  selectPostButton: any;
  removeButton: any;
  activityIndicator: ActivityIndicator;
  tag: any = null;
  progressbar: any;

  constructor(elem_or_id: any, site: Site, tag: any = null) {
    super(elem_or_id);
    this.site = site;
    this.tag = tag;
    this.refresh();
  }

  refresh() {}

  setup(): this {
    super.setup();
    this.progressbar = this.rootElement.find(".progressbar");
    var aidiv = this.rootElement.find(".activity_indicator");
    this.activityIndicator = new ActivityIndicator(aidiv).setup();
    this.publishPostButton = this.rootElement.find(".publish_post_button");
    this.selectPostButton = this.rootElement.find(".select_post_button");
    this.removeButton = this.rootElement.find(".remove_site_button");
    return this;
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
}

export class WPSiteView extends SiteView {
  siteTitleCellElem: JQuery<HTMLElement>;
  setup(): this {
    super.setup();
    this.siteTitleCellElem = this.rootElement.find(".site_title_cell");
    return this;
  }

  refresh() {
    this.siteTitleCellElem.html(this.site.title);
  }

  template(): string {
    return `
      <div class = "activity_indicator" />
      <div class = "site_title_cell" style="border: solid 1px red">{{this.site.title }}</div>
      <div class = "site_title_cell" style="border: solid 1px red">{{this.site.apiUrl }}</div>
      <div class = "site_selected_post_div">
        <h3 style="margin-bottom: 0px">Post:</h3>
        <a target="_blank" href="{{ this.site.selectedPost.link }}">
            {{this.site.selectedPost.id}} : {{{ this.site.selectedPost.title.rendered }}} 
        </a>
      </div>
      <div class = "site_buttons_div" style="border: solid 1px red">
        <center>
            <button class="remove_site_button ui-button ui-widget ui-corner-all ui-button-icon-only" title="Remove Site">
                <span class="ui-icon ui-icon-trash"></span> Remove Site
            </button>
            <button class = "select_post_button ui-button ui-widget ui-corner-all" title="Select Post">Posts</button>
            <button class = "publish_post_button ui-button ui-widget ui-corner-all" >Publish</button>
        </center>
      </div>
        <!--<tr>
          <td colspan = 3>
            <center> <div class = "progressbar"></div> </center>
          </td>
        </tr>-->
      `;
  }
}

export class MediumSiteView extends SiteView {
  template(): string {
    return `
      <div class = "activity_indicator" />
      <table width="100%" class = "site_table"">
        <tr>
          <td class = "td_param_name">Site Title: </td>
          <td> {{this.site.site_host}} td>
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

export class LISiteView extends SiteView {
  template(): string {
    return `
      <div class = "activity_indicator" />
      <table width="100%" class = "site_table"">
        <tr>
          <td class = "td_param_name">Site Title: </td>
          <td> {{this.site.site_host}} td>
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
