
declare var Handlebars : any;
import { Dialog } from "./Dialog";
import { AddSiteDialog } from "./AddSiteDialog";
import { SiteListView } from "./SiteListView";
import { ensureElement } from "../utils";
import { Int, Nullable } from "../types";
import { SiteType, Site, Post } from "../models";
import { ServiceCatalog } from "../catalog";

export class SitesPanel {
    rootElement : any
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

        var siteListDiv = this.rootElement.find("#site_list_div");
        this.siteListView = new SiteListView(siteListDiv, this.services);

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
};
