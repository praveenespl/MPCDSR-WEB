import { SharedComponentsModule } from './../../../../components/shared-components.module';
import { MaterialModule } from './../../../../material.module';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
// import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { FormioModule } from "angular-formio";
import { AngularFormioPdfModule } from "angular-formio-pdf";

import { PartialsModule } from "../../../../views/partials/partials.module";
import { Form1Component } from "./form1.component";
import { FormComponent } from "./form/form.component";
import { FilterModule } from "../filter/filter.module";
import { ViewComponent } from "./view/view.component";
import { VerifyPopupComponent } from "./verify-popup/verify-popup.component";
import { FormsModule } from "@angular/forms";
import { UploadModule } from "../upload/upload.module";
import { PdfComponent } from "./pdf/pdf.component";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { DuplicatePopupComponent } from './duplicate-popup/duplicate-popup.component';

const routes: Routes = [
	{ path: "", component: Form1Component },
	{ path: "view/:id", component: ViewComponent },
	{ path: "pdf/:id", component: PdfComponent },
	{ path: "add", component: FormComponent },
	{ path: ":id", component: FormComponent },
];

@NgModule({
	declarations: [
		Form1Component,
		FormComponent,
		ViewComponent,
		VerifyPopupComponent,
		DuplicatePopupComponent,
		PdfComponent
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		FormioModule,
		AngularFormioPdfModule,
		PartialsModule,

		FilterModule,
		//

		FormsModule,
		MaterialModule,
		SharedComponentsModule,
		UploadModule,
		//
		PdfViewerModule
	],
	exports:[Form1Component],
	entryComponents: [VerifyPopupComponent, DuplicatePopupComponent]
})
export class Form1Module {}
