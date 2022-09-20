import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MdsrRoutingModule } from "./mdsr-routing.module";
import { ResourcesComponent } from './Resources/resources/resources.component';

@NgModule({
	declarations: [ResourcesComponent],
	imports: [CommonModule, MdsrRoutingModule]
})
export class MdsrModule {}
