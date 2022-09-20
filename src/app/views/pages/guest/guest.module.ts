import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { BotDetectCaptchaModule } from 'angular-captcha';

import { GuestComponent } from './guest.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

const routes: Routes = [
	{
		path: '',
		component: GuestComponent,
		children: [
			{
				path: '',
				component: HomeComponent
			},
			{
				path: 'login',
				component: LoginComponent
			}
		]
	}
];

@NgModule({
	declarations: [GuestComponent, HomeComponent, LoginComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		NgbModule,
		// BotDetectCaptchaModule,
		FormsModule,
		ReactiveFormsModule,
		MatProgressSpinnerModule
	]
})
export class GuestModule {}
