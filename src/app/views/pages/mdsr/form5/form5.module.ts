import { MaterialModule } from './../../../../material.module';
import { SharedComponentsModule } from './../../../../components/shared-components.module';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Form5Component } from "./form5.component";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { PartialsModule } from "../../../../views/partials/partials.module";
import { FormioModule } from "angular-formio";
import { FormComponent } from "./form/form.component";
import { FilterModule } from '../filter/filter.module';
import { QuillModule } from 'ngx-quill';
import { AngularFormioPdfModule } from "angular-formio-pdf";
import { PdfComponent } from './pdf/pdf.component';

const routes: Routes = [
	{ path: "", component: Form5Component },
	{ path: "add", component: FormComponent },
	{ path: ":id", component: FormComponent },
	{ path: "pdf/:id", component: PdfComponent }
];

@NgModule({
	declarations: [Form5Component, FormComponent, PdfComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		FormsModule,
		PartialsModule,
		FormioModule,
		//
		FilterModule,
		QuillModule,
		SharedComponentsModule,
		MaterialModule,
		AngularFormioPdfModule
	]
})
export class Form5Module { }
