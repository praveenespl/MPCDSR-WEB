import { NgModule, forwardRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { MaterialModule } from "../../../../material.module";
import { PartialsModule } from "../../../partials/partials.module";

import { ViewComponent } from "./view.component";
import { FormComponent } from "./form/form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { SharedComponentsModule } from '../../../../components/shared-components.module';

const routes: Routes = [
	{
		path: "",
		component: ViewComponent
	},
	{
		path: "add",
		component: FormComponent
	},
	{
		path: ":id",
		component: FormComponent
	}
];

@NgModule({
	declarations: [ViewComponent, FormComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		PartialsModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		NgbModule,
		NgSelectModule,
		SharedComponentsModule
	],
	providers: []
})
export class Form1Module {}
