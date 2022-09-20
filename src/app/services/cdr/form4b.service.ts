import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { api } from "../../utilities/api";
import { tap, map } from "rxjs/operators";
import { CdrForm4B } from "../../models/forms/cdr/form4b";

@Injectable({
	providedIn: "root",
})
export class CdrForm4BService {
	constructor(private http: HttpClient) {}

	add(request: CdrForm4B) {
		const url = api.cdr.form4b.common;

		return this.http.post<any[]>(url, request).pipe(
			tap(
				() => {},
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}

	update(request: Partial<CdrForm4B>, id: string) {
		const url = api.cdr.form4b.byId(id);

		const _request = Object.assign({}, request);

		return this.http.patch<CdrForm4B>(url, _request).pipe(
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
		const url = api.cdr.form4b.common;
		// console.log(url);
		const params = { filter: JSON.stringify(filter || {}) };
		// console.log(params);
		return this.http
			.get<CdrForm4B[]>(url, { params })
			.pipe(
				tap(
					() => {},
					({ error: { error } }) => {
						alert(error.message);
					}
				),
				map((data) => data.map((i) => new CdrForm4B(i)))
			);
	}

	getOne(id: string, filter?: any) {
		const url = api.cdr.form4b.byId(id);

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
				map((data) => new CdrForm4B(data))
			);
	}

	count(where?: any) {
		const url = api.cdr.form4b.count;
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
