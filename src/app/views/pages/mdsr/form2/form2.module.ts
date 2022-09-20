import { AngularFormioPdfModule } from 'angular-formio-pdf';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormioModule } from 'angular-formio';

import { PartialsModule } from '../../../../views/partials/partials.module';
import { Form2Component } from './form2.component';
import { FormComponent } from './form/form.component';
import { MatButtonModule, MatTableModule, MatProgressSpinnerModule, MatPaginatorModule, MatIconModule, MatSortModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { SharedComponentsModule } from '../../../../components/shared-components.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { PdfComponent } from './pdf/pdf.component';

const routes: Routes = [
	{ path: "", component: Form2Component },
	{ path: "add", component: FormComponent },
	{ path: ":id", component: FormComponent },
	{ path: "pdf/:id", component: PdfComponent },
];

@NgModule({
	declarations: [Form2Component, FormComponent, PdfComponent],
	imports: [
		CommonModule,
		//BrowserAnimationsModule,
		RouterModule.forChild(routes),
		FormioModule,
		PartialsModule,
		ReactiveFormsModule,
		//
		MatButtonModule,
		MatTableModule,
		MatProgressSpinnerModule,
		MatPaginatorModule,
		MatIconModule,
		MatSortModule,
		NgbModule,
		//SharedComponentsModule,
		OwlDateTimeModule,
		OwlNativeDateTimeModule,
		PdfViewerModule,
		AngularFormioPdfModule
	]
})
export class Form2Module { }
