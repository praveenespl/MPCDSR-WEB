import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedComponentsModule } from '../../../../components/shared-components.module';

import { MergeComponent } from './merge.component';
import { SimilarRecordsComponent } from './similar-records/similar-records.component';

const routes: Routes = [{ path: "", component: MergeComponent }];

@NgModule({
  declarations: [MergeComponent, SimilarRecordsComponent],
  imports: [
    CommonModule,RouterModule.forChild(routes), SharedComponentsModule
	],
	entryComponents:[SimilarRecordsComponent]
})
export class MergeModule { }
