import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { FormioModule } from "angular-formio";
import {
	MatButtonModule,
	MatTableModule,
	MatProgressSpinnerModule,
	MatPaginatorModule,
	MatIconModule,
	MatSortModule
} from "@angular/material";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { PartialsModule } from "../../../../views/partials/partials.module";
import { Form3Component } from "./form3.component";
import { FormComponent } from "./form/form.component";
import { ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
const routes: Routes = [
	{ path: "", component: Form3Component },
	{ path: "add", component: FormComponent },
	{ path: ":id", component: FormComponent }
];

@NgModule({
	declarations: [Form3Component, FormComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		FormioModule,
		PartialsModule,
		//
		MatButtonModule,
		MatTableModule,
		MatProgressSpinnerModule,
		MatPaginatorModule,
		MatIconModule,
		MatSortModule,
		NgbModule,
		ReactiveFormsModule,
		OwlDateTimeModule, OwlNativeDateTimeModule
	]
})
export class Form3Module {}
