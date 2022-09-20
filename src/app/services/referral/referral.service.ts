import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { api } from "../../utilities/api";
import { HttpClient } from "@angular/common/http";

@Injectable({
	providedIn: "root"
})
export class ReferralService {
	constructor(private http: HttpClient) {}

	add(request: any) {
		const url = api.referral.common;

		return this.http.post<any>(url, request).pipe(
			tap(
				() => {},
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}

	update(request: any, id?: string) {
		if (!id) {
			return this.add(request);
		}

		const url = api.referral.byId(id);

		return this.http.patch<any>(url, request).pipe(
			tap(
				() => {},
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}
}
