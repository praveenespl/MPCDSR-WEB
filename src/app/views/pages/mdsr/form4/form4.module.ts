import { MaterialModule } from './../../../../material.module';
import { SharedComponentsModule } from './../../../../components/shared-components.module';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Form4Component } from "./form4.component";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { PartialsModule } from "../../../../views/partials/partials.module";
// import { CoreModule } from '../../../../core/core.module';
import { FormioModule } from "angular-formio";
import { FormComponent } from "./form/form.component";
import { FilterModule } from "../filter/filter.module";
import { QuillModule } from "ngx-quill";
import { PdfComponent } from './pdf/pdf.component';
import { AngularFormioPdfModule } from "angular-formio-pdf";
const routes: Routes = [
	{ path: "", component: Form4Component },
	{ path: "add", component: FormComponent },
	{ path: ":id", component: FormComponent },
	{ path: "pdf/:id", component: PdfComponent }
];
@NgModule({
	declarations: [Form4Component, FormComponent, PdfComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		FormsModule,
		PartialsModule,
		// CoreModule,
		FormioModule,
		SharedComponentsModule,
		MaterialModule,
		FilterModule,
		QuillModule,
		AngularFormioPdfModule
	]
})
export class Form4Module {}
