// Angular
import { Component, Input, OnInit } from "@angular/core";
// RxJS
import { Observable } from "rxjs";
// NGRX
import { select, Store } from "@ngrx/store";
// State
import { AppState } from "../../../../../core/reducers";
import { Router } from "@angular/router";
import { UsermasterService } from "../../../../../services/usermaster/usermaster.service";
// import { currentUser, Logout, User } from '../../../../../core/auth';

@Component({
	selector: "kt-user-profile",
	templateUrl: "./user-profile.component.html"
})
export class UserProfileComponent implements OnInit {
	// Public properties
	// user$: Observable<User>;
	_user: any = {
		fullname: "Jibreel"
	};

	@Input() avatar: boolean = true;
	@Input() greeting: boolean = true;
	@Input() badge: boolean;
	@Input() icon: boolean;

	/**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 */
	constructor(
		private router: Router,
		private usermasterService: UsermasterService
	) {}
	user = JSON.parse(sessionStorage.getItem("currentUser"));
	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		
		
		// this.user$ = this.store.pipe(select(currentUser));
	}
  
	/**
	 * Log out
	 */
	logout() {
		sessionStorage.clear();
		this.router.navigate(['/']);
		this.usermasterService.logout();
		//location.reload();
		// this.usermasterService.logout().subscribe(
		// 	(res)=>{
		// 		sessionStorage.clear();
		// 		this.router.navigate(['/'])
		// 	},
		// 	(err)=>{
		// 		sessionStorage.clear();
		// 		this.router.navigate(['/'])
		// 	}
		// )

		// this.store.dispatch(new Logout());
	}
}
