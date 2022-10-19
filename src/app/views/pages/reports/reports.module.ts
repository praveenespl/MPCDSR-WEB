import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ReportsRoutingModule } from "./reports-routing.module";
import { StatsComponent } from "./stats/stats.component";
import { PartialsModule } from "../../partials/partials.module";
import { NotifyVsReviewedComponent } from "./notify-vs-reviewed/notify-vs-reviewed.component";
import { FilterModule } from "../mdsr/filter/filter.module";
import { SharedComponentsModule } from "../../../components/shared-components.module";
import { MOMFBMDRCComponent } from './mom-fbmdrc/mom-fbmdrc.component';
import { MatButtonModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatSelectModule, MatTooltipModule } from "@angular/material";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MOMDMDRCComponent } from './mom-dmdrc/mom-dmdrc.component';
import { MOMDRUDCMComponent } from './mom-drudcm/mom-drudcm.component';
import { AlertComponent } from './alert/alert.component';
import { ViewMOMDRUDCMComponent } from './view-momdrudcm/view-momdrudcm.component';

@NgModule({
	declarations: [StatsComponent,FilterModule, NotifyVsReviewedComponent, MOMFBMDRCComponent, MOMDMDRCComponent, MOMDRUDCMComponent, AlertComponent, ViewMOMDRUDCMComponent],
	imports: [
		CommonModule,
		ReportsRoutingModule,
		PartialsModule,
		MatFormFieldModule,
		FormsModule,
		ReactiveFormsModule,
		MatInputModule,
		NgbModule,
		FilterModule,
		SharedComponentsModule,
		MatButtonModule,
		MatTooltipModule,
		MatButtonModule,
		MatSelectModule,
		MatRadioModule
	]
})
export class ReportsModule {}
