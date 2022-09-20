import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
// Core Module
import { CoreModule } from "../../../../core/core.module";
import { PartialsModule } from "../../../partials/partials.module";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { CommonNationalDashboardComponent } from "./common-national-dashboard/common-national-dashboard.component";
import { MatCardModule } from "@angular/material";

@NgModule({
	declarations: [DashboardComponent, CommonNationalDashboardComponent],
	imports: [
		CommonModule,
		PartialsModule,
		CoreModule,
		MatCardModule,
		RouterModule.forChild([
			{
				path: "",
				component: DashboardComponent,
			},
			{
				path: "common-national-dashboard",
				component: CommonNationalDashboardComponent,
			},
		]),
	],
})
export class DashboardModule {}
