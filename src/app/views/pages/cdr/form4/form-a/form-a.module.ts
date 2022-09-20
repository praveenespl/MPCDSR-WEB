import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

import { ViewComponent } from "./view.component";
import { FormComponent } from "./form/form.component";
import { SharedComponentsModule } from '../../../../../components/shared-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QuillModule } from 'ngx-quill';
import { MaterialModule } from "../../../../../material.module";
import { PartialsModule } from "./../../../../partials/partials.module";
const routes: Routes = [
	{
		path: "",
		component: ViewComponent
	},
	{
		path: "add/:cdrForm1Id",
		component: FormComponent
	},
	{
		path: ":id",
		component: FormComponent
	}
];

@NgModule({
	declarations: [ViewComponent, FormComponent],
	imports: [CommonModule, RouterModule.forChild(routes), SharedComponentsModule,
		PartialsModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		NgSelectModule,
		NgbModule,
		QuillModule]
})
export class FormAModule {}
