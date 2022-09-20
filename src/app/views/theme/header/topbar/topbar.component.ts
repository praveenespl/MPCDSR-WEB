// Angular
import { Component } from '@angular/core';

@Component({
	selector: 'kt-topbar',
	templateUrl: './topbar.component.html',
	styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
	currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
}
