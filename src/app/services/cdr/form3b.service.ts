import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { api } from "../../utilities/api";
import { tap, map } from "rxjs/operators";
import { CdrForm3B } from "../../models/forms/cdr/form3b";

@Injectable({
	providedIn: "root",
})
export class CdrForm3BService {
	constructor(private http: HttpClient) {}

	add(request: CdrForm3B) {
		const url = api.cdr.form3b.common;

		return this.http.post<any[]>(url, request).pipe(
			tap(
				() => {},
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}

	update(request: Partial<CdrForm3B>, id: string) {
		const url = api.cdr.form3b.byId(id);

		const _request = Object.assign({}, request);

		return this.http.patch<CdrForm3B>(url, _request).pipe(
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
		const url = api.cdr.form3b.common;
		// console.log(url);
		const params = { filter: JSON.stringify(filter || {}) };
		// console.log(params);
		return this.http
			.get<CdrForm3B[]>(url, { params })
			.pipe(
				tap(
					() => {},
					({ error: { error } }) => {
						alert(error.message);
					}
				),
				map((data) => data.map((i) => new CdrForm3B(i)))
			);
	}

	getOne(id: string, filter?: any) {
		const url = api.cdr.form3b.byId(id);

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
				map((data) => new CdrForm3B(data))
			);
	}

	count(where?: any) {
		const url = api.cdr.form3b.count;
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
