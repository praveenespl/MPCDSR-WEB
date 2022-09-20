import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { api } from "../../utilities/api";
import { tap, refCount } from "rxjs/operators";

@Injectable({
	providedIn: "root"
})
export class UsermasterService {
	private _user: any;

	constructor(private http: HttpClient) {
		const user = sessionStorage.getItem("currentUser");
		if (user) {
			this._user = JSON.parse(user);
		}
	}

	get user() {
		return this._user;
	}

	get token(): string {
		if (this._user) {
			return this._user.accessToken.id;
		}
		return;
	}
	//	Method for Login
	login(options: any): Observable<any> {
		const url = api.userMaster.login;
		return this.http
			.post(url, {
				username: options.username,
				password: options.password
			})
			.pipe(
				tap(
					() => { },
					({ error: { error } }) => {
						//alert(error.message);
					}
				)
			);
	}
	//	Method for Logout
	logout() {
		this._user = undefined;
		setTimeout(() => window.location.reload(), 300)
		// const url = api.userMaster.logout;

		// return this.http.post(url, {}).pipe(
		// 	tap(
		// 		() => {},
		// 		({ error: { error } }) => {
		// 			alert(error.message);
		// 		}
		// 	)
		// );
	}
	getList(filter?: any) {
		const url = api.userMaster.common;
		const params = { filter: JSON.stringify(filter || {}) };
		return this.http
			.get<any[]>(url, { params })
			.pipe(
				tap(
					() => { },
					({ error: { error } }) => {
						alert(error.message);
					}
				),
			);
	}

}
