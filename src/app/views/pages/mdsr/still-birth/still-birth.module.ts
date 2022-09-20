//import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormComponent } from "./form/form.component";
import { Routes, RouterModule } from "@angular/router";
import { StillBirthComponent } from "./still-birth.component";
import { SharedComponentsModule } from "../../../../components/shared-components.module";
import {StillBirthRoutingModule } from "./still-birth-routing.module"

const routes: Routes = [
	{ path: "", component: StillBirthComponent },
	{ path: "add", component: FormComponent },
	{ path: ":id", component: FormComponent },
	//{ path: "Stillbirth/dashboard", component: DashboardComponent }
];

@NgModule({
	declarations: [StillBirthComponent, FormComponent,
		// DashboardComponent
	],
	imports: [CommonModule, RouterModule.forChild(routes), SharedComponentsModule,StillBirthRoutingModule]
})
export class StillBirthModule {}
