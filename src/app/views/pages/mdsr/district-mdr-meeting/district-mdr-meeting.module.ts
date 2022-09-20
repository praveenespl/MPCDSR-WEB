import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DistrictMdrMeetingComponent } from "./district-mdr-meeting.component";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
	OwlDateTimeModule,
	OwlNativeDateTimeModule,
	DateTimeAdapter,
	OWL_DATE_TIME_LOCALE,
	OWL_DATE_TIME_FORMATS,
} from "ng-pick-datetime";
import { MomentDateTimeAdapter } from "ng-pick-datetime-moment";
import { PartialsModule } from "../../../../../../src/app/views/partials/partials.module";
import { SharedComponentsModule } from "../../../../../../src/app/components/shared-components.module";
import {
	MatButtonModule,
	MatIconModule,
	MatTooltipModule,
} from "@angular/material";
const routes: Routes = [{ path: "", component: DistrictMdrMeetingComponent }];
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
	declarations: [DistrictMdrMeetingComponent],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		PartialsModule,
		OwlDateTimeModule,
		OwlNativeDateTimeModule,
		MatButtonModule,
		MatIconModule,
		MatTooltipModule,
		SharedComponentsModule,
		RouterModule.forChild(routes),
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
export class DistrictMdrMeetingModule {}
