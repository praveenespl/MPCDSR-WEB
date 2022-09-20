import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './filter.component';
import { FormFilterComponent } from './form-filter/form-filter.component';
import { FormioModule } from 'angular-formio';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { PartialsModule } from '../../../../views/partials/partials.module';
import { MatDialogModule } from '@angular/material';
import { ReportFiliterComponent } from './report-filiter/report-filiter.component';
import { NgSelectModule } from '@ng-select/ng-select';

// const routes: Routes = [
// 	{
// 		path: '',
// 		component: FilterComponent,
// 		children: [
// 			{
// 				path: 'formfilter',
// 				component: FormFilterComponent
// 			},
// 		]
// 	}
// ];

@NgModule({
  declarations: [FilterComponent, FormFilterComponent, ReportFiliterComponent],
  imports: [
    CommonModule,
    FormioModule, 
    PartialsModule,
    HttpClientModule,
	//RouterModule.forChild(routes),
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    MatDialogModule
  
  ],
  entryComponents:[
    FormFilterComponent,
    ReportFiliterComponent
  ]
})
export class FilterModule { }
