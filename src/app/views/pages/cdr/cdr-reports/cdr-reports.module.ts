import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdrReportsComponent } from './cdr-reports/cdr-reports.component';
import { RouterModule } from "@angular/router";
import { FilterModule } from '../../mdsr/filter/filter.module';
import { MatIconModule, MatPaginatorModule , MatSortModule, MatTableModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { PartialsModule } from '../../../../views/partials/partials.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { CdrReportBreakUpComponent } from './cdr-report-break-up/cdr-report-break-up.component';


@NgModule({
  declarations: [CdrReportsComponent, CdrReportBreakUpComponent],
  imports: [
    CommonModule,
    PartialsModule,
    FilterModule,
    NgbModule,
    NgbModule,
    FormsModule,
    MatCardModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    RouterModule.forChild([
      {
        path: '',
        component: CdrReportsComponent
      },
      {
        path: 'breakUp',
        component: CdrReportBreakUpComponent
      },
    ])
  ],
   schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class CdrReportsModule { }
