import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MdsrRoutingModule } from "./mdsr-routing.module";
import { ResourcesComponent } from './Resources/resources/resources.component';
import { FilterModule } from "./filter/filter.module";

@NgModule({
	declarations: [ResourcesComponent],
	imports: [CommonModule, MdsrRoutingModule],
	exports : [FilterModule]
})
export class MdsrModule {}
