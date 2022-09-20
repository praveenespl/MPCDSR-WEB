import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
const routes: Routes = [
	{
		path: "dashboard",
		loadChildren: () => import("./dashboard/dashboard.module").then(m => m.DashboardModule)
	},
	{
		path: "form1",
		loadChildren: () => import("./form1/form1.module").then(m => m.Form1Module)
	},
	{
		path: "form2",
		loadChildren: () => import("./form2/form2.module").then(m => m.Form2Module)
	},
	{
		path: "form3",
		loadChildren: () => import("./form3/form3.module").then(m => m.Form3Module)
	},
	{
		path: "form4",
		loadChildren: () => import("./form4/form4.module").then(m => m.Form4Module)
	},
	{
		path: "form5",
		loadChildren: () => import("./form5/form5.module").then(m => m.Form5Module)
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CdrRoutingModule {}
