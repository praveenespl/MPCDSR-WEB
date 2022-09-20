import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { NationaldashboardComponent } from './nationaldashboard/nationaldashboard.component';
import { MapstillbirthComponent } from './mapstillbirth/mapstillbirth.component';
import { StatedashboardComponent } from './statedashboard/statedashboard.component';
import { FacilitydashboardComponent } from './facilitydashboard/facilitydashboard.component';
import { Routes, RouterModule } from "@angular/router";
import { MatIconModule, MatPaginatorModule, MatSortModule, MatTableModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { PartialsModule } from '../../../../../views/partials/partials.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { BasicinformationComponent } from './Dashboard-Parts-Component/basicinformation/basicinformation.component';
import { PregnancycareComponent } from './Dashboard-Parts-Component/pregnancycare/pregnancycare.component';
import { LabourbirthComponent } from './Dashboard-Parts-Component/labourbirth/labourbirth.component';
import { CauseofdeathComponent } from './Dashboard-Parts-Component/causeofdeath/causeofdeath.component';
import { AssociatedfactorsComponent } from './Dashboard-Parts-Component/associatedfactors/associatedfactors.component';
const routes: Routes = [
	{ path: "national", component: NationaldashboardComponent },
	{ path: "state", component: StatedashboardComponent },
	{ path: "facility", component: FacilitydashboardComponent }
];
@NgModule({
  declarations: [
    DashboardComponent,
    NationaldashboardComponent,
    MapstillbirthComponent,
    StatedashboardComponent,
    FacilitydashboardComponent,
    BasicinformationComponent,
    PregnancycareComponent,
    LabourbirthComponent,
    CauseofdeathComponent,
    AssociatedfactorsComponent,
   ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
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
