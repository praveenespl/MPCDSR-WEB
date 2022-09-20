import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { api } from "../../utilities/api";
import { tap, map } from "rxjs/operators";
import { CdrForm3C } from "../../models/forms/cdr/form3c";

@Injectable({
	providedIn: "root",
})
export class CdrForm3CService {
	constructor(private http: HttpClient) {}

	add(request: CdrForm3C) {
		const url = api.cdr.form3c.common;

		return this.http.post<any[]>(url, request).pipe(
			tap(
				() => {},
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}

	update(request: Partial<CdrForm3C>, id: string) {
		const url = api.cdr.form3c.byId(id);

		const _request = Object.assign({}, request);

		return this.http.patch<CdrForm3C>(url, _request).pipe(
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
		const url = api.cdr.form3c.common;
		// console.log(url);
		const params = { filter: JSON.stringify(filter || {}) };
		// console.log(params);
		return this.http
			.get<CdrForm3C[]>(url, { params })
			.pipe(
				tap(
					() => {},
					({ error: { error } }) => {
						alert(error.message);
					}
				),
				map((data) => data.map((i) => new CdrForm3C(i)))
			);
	}

	getOne(id: string, filter?: any) {
		const url = api.cdr.form3c.byId(id);

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
				map((data) => new CdrForm3C(data))
			);
	}

	count(where?: any) {
		const url = api.cdr.form3c.count;
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
