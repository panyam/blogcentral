import { SiteInputView } from "../ui/SiteInputViews";
import { SiteSummaryView } from "../ui/SiteSummaryViews";
import { SiteConfig } from "../siteapis";
import { LINKEDIN } from "./core";

export class LISiteInputView extends SiteInputView {
  usernameElem: any;

  setupViews() {
    super.setupViews();
    this.usernameElem = this.rootElement.find("#username");
    this.onAuthTypeChanged();
  }

  get siteConfig() {
    return {
      siteType: LINKEDIN
    } as SiteConfig;
  }

  template(): string {
    return `
        <label for="title">Title</label>
        <input type="text" name="title" id="title" class="text ui-widget-content ui-corner-all" value = "My Medium Site" />
        <label for="username">Username</label>
        @<input type="text" name="title" id="username" class="text ui-widget-content ui-corner-all" value = "mediumuser" />

        <div class = "auth_details_view"></div>
        `;
  }
}

export class LISiteSummaryView extends SiteSummaryView {
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
