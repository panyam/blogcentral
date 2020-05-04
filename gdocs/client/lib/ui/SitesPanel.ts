
import { AddSiteDialog } from "./AddSiteDialog";
import { SiteListView, SiteListViewDelegate  } from "./SiteListView";
import { ensureElement } from "../utils";
import { Int, Nullable } from "../types";
import { PostsPanel } from "./PostsPanel";
import { Site, Post } from "../models";
import { ServiceCatalog } from "../catalog";

export class SitesPanel implements SiteListViewDelegate {
    rootElement : any
    postsPanel : PostsPanel
    addSiteDialog : AddSiteDialog
    addButton : any
    siteListView : SiteListView
    services : ServiceCatalog

    constructor(elem_or_id : string, services : ServiceCatalog) {
        this.rootElement = ensureElement(elem_or_id);
        this.services = services
        this.setupViews();
    }

    setupViews() {
        var self = this;
        var addSiteDialogElem : any = ensureElement("add_site_dialog", this.rootElement);
        if (addSiteDialogElem.length == 0) {
            addSiteDialogElem = $("<div id='add_site_dialog'></div>");
            this.rootElement.append(addSiteDialogElem);
        }

        this.addSiteDialog = new AddSiteDialog(addSiteDialogElem);
        var postsPanelElem = ensureElement("posts_panel_div", this.rootElement);
        this.postsPanel = new PostsPanel(postsPanelElem, this.services);

        var siteListDiv = this.rootElement.find("#site_list_div");
        this.siteListView = new SiteListView(siteListDiv, this.services);
        this.siteListView.delegate = this;

        this.addButton = this.rootElement.find("#add_button");
        this.addButton.button().on("click", function() {
            self.addSiteDialog.open()
                .then((site : Site) => {
                    self.services.siteService.addSite(site as Site).then(() => {
                        self.siteListView.refresh();
                    });
                });
        });

        this.services.siteService.loadAll().then(() => {
            self.siteListView.refresh();
        });
    }

    /**
     * Lets one select one or more posts in a site.
     */
    async selectPost(site : Site, index : Int) {
        var siteService = this.services.siteService;
        var post = await this.postsPanel.open(site) as Nullable<Post>;
        site.selectedPost = post;
        await siteService.saveSite(site);
        return post;
    }
};
