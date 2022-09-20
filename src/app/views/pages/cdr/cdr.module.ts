import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdrRoutingModule } from './cdr-routing.module';
import { MaterialModule } from '../../../material.module';
import { DashboardModule } from '../mdsr/dashboard/dashboard.module';
import { FormsModule } from '@angular/forms';
import { SharedComponentsModule } from './../../../components/shared-components.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CdrRoutingModule,
    MaterialModule,
    DashboardModule,
    FormsModule,
    SharedComponentsModule
  ],
})
export class CdrModule { }
