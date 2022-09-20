import { ResourcesComponent } from './Resources/resources/resources.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UnlistedComponent } from "./unlisted/unlisted.component";

const routes: Routes = [
	{
		path: "dashboard",
		loadChildren: () =>
			import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
	},
	{
		path: "form1",
		loadChildren: () =>
			import("./form1/form1.module").then((m) => m.Form1Module),
	},
	{
		path: "form2",
		loadChildren: () =>
			import("./form2/form2.module").then((m) => m.Form2Module),
	},
	{
		path: "form3",
		loadChildren: () =>
			import("./form3/form3.module").then((m) => m.Form3Module),
	},
	{
		path: "form4",
		loadChildren: () =>
			import("./form4/form4.module").then((m) => m.Form4Module),
	},
	{
		path: "form5",
		loadChildren: () =>
			import("./form5/form5.module").then((m) => m.Form5Module),
	},
	{
		path: "form6",
		loadChildren: () =>
			import("./form6/form6.module").then((m) => m.Form6Module),
	},
	{
		path: "still-birth",
		loadChildren: () =>
			import("./still-birth/still-birth.module").then(
				(m) => m.StillBirthModule
			),
	},
	{
		path: "unlisted",
		loadChildren: () =>
			import("./unlisted/unlisted.module").then((m) => m.UnlistedModule),
	},
	{
		path: "merge",
		loadChildren: () =>
			import("./merge/merge.module").then((m) => m.MergeModule),
	},
	{
		path: "filter",
		loadChildren: () =>
			import("./filter/filter.module").then((m) => m.FilterModule),
	},
	{
		path: "upload",
		loadChildren: () =>
			import("./upload/upload.module").then((m) => m.UploadModule),
	},
	{
		path: "districtMMRMeeting",
		loadChildren: () =>
			import("./district-mdr-meeting/district-mdr-meeting.module").then(
				(m) => m.DistrictMdrMeetingModule
			),
	},
	{path: "resources", component : ResourcesComponent}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class MdsrRoutingModule {}
