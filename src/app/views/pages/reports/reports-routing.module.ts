import { ViewMOMDRUDCMComponent } from './view-momdrudcm/view-momdrudcm.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { StatsComponent } from "./stats/stats.component";
import { NotifyVsReviewedComponent } from './notify-vs-reviewed/notify-vs-reviewed.component';
import { MOMFBMDRCComponent } from "./mom-fbmdrc/mom-fbmdrc.component";
import { MOMDMDRCComponent } from "./mom-dmdrc/mom-dmdrc.component";
import { MOMDRUDCMComponent } from "./mom-drudcm/mom-drudcm.component";
import { AlertComponent } from "./alert/alert.component";

const routes: Routes = [
	{
		path: "",
		redirectTo: "stats"
	},
	{
		path: "stats",
		component: StatsComponent
	},
	{
		path: "notifiedvsreviewed",
		component: NotifyVsReviewedComponent
	},
	{
		path: "MOM-FBMDRC",
		component: MOMFBMDRCComponent
	},
	{
		path: "MOM-DMDRC",
		component: MOMDMDRCComponent
	},
	{
		path: "MOM-DRUDCM",
		component: MOMDRUDCMComponent
	},
	{
		path: "viewMOM-FBMDRC",
		component: ViewMOMDRUDCMComponent
	},
	{
		path: "viewMOM-DMDRC",
		component: ViewMOMDRUDCMComponent
	},
	{
		path: "viewMOM-DRUDRC",
		component: ViewMOMDRUDCMComponent
	},
	{
		path: "alert",
		component: AlertComponent
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ReportsRoutingModule {}
