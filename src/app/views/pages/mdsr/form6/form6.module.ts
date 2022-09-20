import { SharedComponentsModule } from './../../../../components/shared-components.module';
import { MaterialModule } from './../../../../material.module';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Form6Component } from "./form6.component";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { PartialsModule } from "../../../../views/partials/partials.module";
import { FormioModule } from "angular-formio";
import { FormComponent } from "./form/form.component";

import { FilterModule } from '../filter/filter.module';
import { UploadModule } from '../upload/upload.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ViewComponent } from './view/view.component';
import { AngularFormioPdfModule } from 'angular-formio-pdf';
import { PdfComponent } from './pdf/pdf.component';
const routes: Routes = [
	{ path: "", component: Form6Component },
	{ path: "add", component: FormComponent },
	{ path: ":id", component: FormComponent },
	{ path: "view/:id", component: ViewComponent },
	{ path: "pdf/:id", component: PdfComponent },
];


@NgModule({
  declarations: [Form6Component, FormComponent, ViewComponent, PdfComponent],
  imports: [
    CommonModule,
		RouterModule.forChild(routes),
		FormsModule,
		PartialsModule,
		FormioModule,
		//
		FilterModule,
		UploadModule,
		PdfViewerModule,
		AngularFormioPdfModule,
		MaterialModule,
		SharedComponentsModule
  ]
})
export class Form6Module { }
