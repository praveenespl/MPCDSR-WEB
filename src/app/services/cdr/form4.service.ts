import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { api } from "../../utilities/api";
import { tap, map } from "rxjs/operators";
import { CdrForm4A } from "../../models/forms/cdr/form4";

@Injectable({
	providedIn: "root",
})
export class CdrForm4Service {
	constructor(private http: HttpClient) {}

	add(request: CdrForm4A) {
		const url = api.cdr.form4a.common;

		return this.http.post<any[]>(url, request).pipe(
			tap(
				() => {},
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}

	update(request: Partial<CdrForm4A>, id: string) {
		const url = api.cdr.form4a.byId(id);

		const _request = Object.assign({}, request);

		return this.http.patch<CdrForm4A>(url, _request).pipe(
			tap(
				() => {},
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}

	// updateMiltple(requests: Partial<any>[]) {
	// 	return forkJoin(requests.map((i) => this.update(i)));
	// }

	getList(filter?: any) {
		const url = api.cdr.form4a.common;
		// console.log(url);
		const params = { filter: JSON.stringify(filter || {}) };
		 console.log(params);
		return this.http
			.get<CdrForm4A[]>(url, { params })
			.pipe(
				tap(
					() => {},
					({ error: { error } }) => {
						alert(error.message);
					}
				),
				map((data) => data.map((i) => new CdrForm4A(i)))
			);
	}

	getOne(id: string, filter?: any) {
		const url = api.cdr.form4a.byId(id);

		const params = { filter: JSON.stringify(filter || {}) };

		return this.http
			.get<any>(url, { params })
			.pipe(
				tap(
					() => {},
					({ error: { error } }) => {
						alert(error.message);
					}
				),
				map((data) => new CdrForm4A(data))
			);
	}

	count(where?: any) {
		const url = api.cdr.form4a.count;
		const params = { where: JSON.stringify(where || {}) };

		return this.http
			.get<any>(url, { params })
			.pipe(
				tap(
					() => {},
					({ error: { error } }) => {
						alert(error.message);
					}
				)
			);
	}
}
