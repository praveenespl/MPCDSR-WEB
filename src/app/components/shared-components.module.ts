import { RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ShowErrorComponent } from "./show-error/show-error.component";
import { PartialsModule } from "../views/partials/partials.module";
import { MaterialModule } from "../material.module";
import { NgBootstrapDatetimeAngularModule } from "ng-bootstrap-datetime-angular";

import {
	FormsModule,
	ReactiveFormsModule,
	NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormInputComponent } from "./form-input/form-input.component";
import { QuillModule } from "ngx-quill";
import { FilterModule } from "../views/pages/mdsr/filter/filter.module";
import { OnlyNumberDirective } from "./only-number.directive";
import { OnlyCharacterDirective } from "./only-character.directive";
import {
	OwlDateTimeModule,
	OwlNativeDateTimeModule,
	DateTimeAdapter,
	OWL_DATE_TIME_LOCALE,
	OWL_DATE_TIME_FORMATS,
} from "ng-pick-datetime";
import { MomentDateTimeAdapter } from "ng-pick-datetime-moment";
import { NotificationIndexTableComponent } from './notification-index-table/notification-index-table.component';
import { StateInputComponent } from './state-input/state-input.component';


// Format custom
export const MY_CUSTOM_FORMATS = {
	parseInput: "DD/MM/YYYY HH:mm:ss",
	fullPickerInput: "DD/MM/YYYY HH:mm:ss",
	datePickerInput: "DD/MM/YYYY",
	timePickerInput: " HH:mm:ss",
	monthYearLabel: "MMM YYYY",
	dateA11yLabel: "LL",
	monthYearA11yLabel: "MMMM YYYY",
};
@NgModule({
	declarations: [
		ShowErrorComponent,
		FormInputComponent,
		OnlyNumberDirective,
		OnlyCharacterDirective,
		NotificationIndexTableComponent,
		StateInputComponent
	],
	imports: [
		CommonModule,
		PartialsModule,
		FormsModule,
		ReactiveFormsModule,
		NgbModule,
		NgSelectModule,
		NgBootstrapDatetimeAngularModule,
		OwlDateTimeModule,
		OwlNativeDateTimeModule,
		MaterialModule,
		RouterModule
	],
	exports: [
		OnlyNumberDirective,
		OnlyCharacterDirective,
		PartialsModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		NgbModule,
		NgSelectModule,
		// Custom
		ShowErrorComponent,
		FormInputComponent,
		QuillModule,
		FilterModule,
		NgBootstrapDatetimeAngularModule,
		OwlDateTimeModule,
		OwlNativeDateTimeModule,
		NotificationIndexTableComponent,
		StateInputComponent,
		RouterModule
		//
	],
	providers: [
		{
			provide: DateTimeAdapter,
			useClass: MomentDateTimeAdapter,
			deps: [OWL_DATE_TIME_LOCALE],
		},
		{ provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
	],
})
export class SharedComponentsModule {}
