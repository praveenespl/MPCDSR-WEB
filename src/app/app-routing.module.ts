// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './views/theme/base/base.component';
import { ErrorPageComponent } from './views/theme/content/error-page/error-page.component';
// Auth
import { AuthGuard } from './core/auth';

const routes: Routes = [
	{path: '', loadChildren: () => import('./views/pages/guest/guest.module').then(m => m.GuestModule)},

	{
		path: '',
		component: BaseComponent,
		canActivate: [],
		children: [
			{
				path: 'dashboard',
				redirectTo: '/mdsr/dashboard'
			},
			{
				path: 'common-dashboard',
				loadChildren: () => import('./views/pages/common-dashboard/dashboard/dashboard.module').then(m => m.DashboardModule)
			},
			{
				path: 'mdsr',
				loadChildren: () => import('./views/pages/mdsr/mdsr.module').then(m => m.MdsrModule)
			},
			{
				path: 'cdr',
				loadChildren: () => import('./views/pages/cdr/cdr.module').then(m => m.CdrModule)
			},
			{
				path: 'reports',
				loadChildren: () => import('./views/pages/reports/reports.module').then(m => m.ReportsModule)
			},
			{
				path:'mnm',
				loadChildren: () => import('./views/pages/mnm/mnm.module').then(m=>m.MnmModule)
			},
			{
				path: '',
				loadChildren: () => import('./views/pages/user-management/user-management.module').then(m => m.UserManagementModule)
			},
			{
				path: 'error/403',
				component: ErrorPageComponent,
				data: {
					'type': 'error-v6',
					'code': 403,
					'title': '403... Access forbidden',
					'desc': 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator'
				}
			},
			// {path: 'error/:type', component: ErrorPageComponent},
			// {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
			// {path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
		]
	},

	{path: '**', redirectTo: 'error/403', pathMatch: 'full'},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { useHash: true })
	],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
