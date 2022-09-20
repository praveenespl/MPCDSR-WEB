import { MaterialModule } from './../../../../material.module';
import { SharedComponentsModule } from './../../../../components/shared-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PartialsModule } from '../../../../views/partials/partials.module';
import { DashboardComponent } from './dashboard.component';
import { MapComponent } from './map/map.component';
import { StateDashboardComponent } from './state-dashboard/state-dashboard.component';
import { DistrictDashboardComponent } from './district-dashboard/district-dashboard.component';
import { BlockDashboardComponent } from './block-dashboard/block-dashboard.component';
import { NationalDashboardComponent } from './national-dashboard/national-dashboard.component';
import { StackBarComponent } from './charts/stack-bar/stack-bar.component';
import { LineChartComponent } from './charts/line-chart/line-chart.component';
import { Form1Module } from '../form1/form1.module';
import { FormioModule } from 'angular-formio';
import { MainMapComponent } from './main-map/main-map.component';

const routes: Routes = [
	{ path: "", component: DashboardComponent },
	{ path: "national-dashboard", component: NationalDashboardComponent },
	{ path: "state-dashboard", component: StateDashboardComponent },
	{ path: "district-dashboard", component: DistrictDashboardComponent },
	{ path: "block-dashboard", component: BlockDashboardComponent },
	{ path: "main-map", component: MainMapComponent }

];
@NgModule({
	declarations: [DashboardComponent, MapComponent, StateDashboardComponent, DistrictDashboardComponent, BlockDashboardComponent, NationalDashboardComponent, StackBarComponent, LineChartComponent, MainMapComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		PartialsModule,
		NgbModule,
		FormioModule,
		SharedComponentsModule
		//Form1Module
	],
	exports: [MapComponent, StackBarComponent, LineChartComponent]
})
export class DashboardModule { }
