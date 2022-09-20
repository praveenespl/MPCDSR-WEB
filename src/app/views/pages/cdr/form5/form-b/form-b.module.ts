import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

import { ViewComponent } from "./view.component";
import { SharedComponentsModule } from "../../../../../components/shared-components.module";

const routes: Routes = [
	{
		path: "",
		component: ViewComponent,
	},
];

@NgModule({
	declarations: [ViewComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		SharedComponentsModule,
	],
})
export class FormBModule {}
