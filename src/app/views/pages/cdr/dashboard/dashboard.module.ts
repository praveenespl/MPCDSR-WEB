import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { PartialsModule } from '../../../../views/partials/partials.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { CDRMapComponent } from './cdrmap/cdrmap.component';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import { MatIconModule, MatPaginatorModule, MatSortModule, MatTableModule } from '@angular/material';
import { StateDashboardComponent } from './state-dashboard/state-dashboard.component';
import { NationalDashboardComponent } from './national-dashboard/national-dashboard.component';
import { DistrictDashboardComponent } from './district-dashboard/district-dashboard.component';
import { BlockDashboardComponent } from './block-dashboard/block-dashboard.component';

const routes: Routes = [
  { path: "", component: StateDashboardComponent },
  { path: "national-dashboard", component: NationalDashboardComponent },
  { path: "state-dashboard", component: StateDashboardComponent },
  { path: "district-dashboard", component: DistrictDashboardComponent },
  { path: "block-dashboard", component: BlockDashboardComponent }

];

@NgModule({
  declarations: [CDRMapComponent,
    StateDashboardComponent,PieChartComponent,BarChartComponent, NationalDashboardComponent, DistrictDashboardComponent, BlockDashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PartialsModule,
    NgbModule,
    FormsModule,
    MatCardModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
  ]
})
export class DashboardModule { }
