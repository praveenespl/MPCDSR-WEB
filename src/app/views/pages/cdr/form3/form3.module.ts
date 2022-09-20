import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { SharedComponentsModule } from "../../../../../app/components/shared-components.module";

const routes: Routes = [
	{
		path: "a",
		loadChildren: () =>
			import("./form-a/form-a.module").then(m => m.FormAModule)
	},
	{
		path: "b",
		loadChildren: () =>
			import("./form-b/form-b.module").then(m => m.FormBModule)
	},
	{
		path: "c",
		loadChildren: () =>
			import("./form-c/form-c.module").then(m => m.FormCModule)
	},
	{
		path: "",
		redirectTo: "a"
	}
];

@NgModule({
	declarations: [],
	imports: [CommonModule, RouterModule.forChild(routes), SharedComponentsModule]
})
export class Form3Module {}
