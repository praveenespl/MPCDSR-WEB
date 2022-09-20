import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

import { ViewComponent } from "./view.component";
import { FormComponent } from "./form/form.component";
import { SharedComponentsModule } from '../../../../../components/shared-components.module';

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
	imports: [CommonModule, RouterModule.forChild(routes), SharedComponentsModule]
})
export class FormCModule {}
