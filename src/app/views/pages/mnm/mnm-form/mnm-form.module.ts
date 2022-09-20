import { PartialsModule } from './../../../partials/partials.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,Routes } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { MnmViewComponent } from './mnm-view.component';
import { FormComponent } from './form/form.component';
import { SharedComponentsModule } from './../../../../components/shared-components.module';
import { FormioModule } from "angular-formio";

const routes: Routes = [
	{
		path:'',
		component: MnmViewComponent
	},
	{
		path: 'add',
		component: FormComponent
	},
	{
		path:':id',
		component: FormComponent
	}
];

@NgModule({
	declarations: [MnmViewComponent,FormComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		PartialsModule,
		MaterialModule,
		SharedComponentsModule,
		FormioModule
	],
	providers: []
})
export class MnmFormModule {}
