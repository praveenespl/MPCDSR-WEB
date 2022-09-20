import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { SharedComponentsModule } from "../../../../components/shared-components.module";
import { UnlistedComponent } from "./unlisted.component";

const routes: Routes = [{ path: "", component: UnlistedComponent }];

@NgModule({
	declarations: [UnlistedComponent],
	imports: [CommonModule, RouterModule.forChild(routes), SharedComponentsModule]
})
export class UnlistedModule {}
