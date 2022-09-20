import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { api } from "../../utilities/api";
import { tap, map } from "rxjs/operators";
import { CdrForm2 } from "../../models/forms/cdr/form2";

@Injectable({
	providedIn: "root",
})
export class CdrForm2Service {
	constructor(private http: HttpClient) {}

	add(request: CdrForm2) {
		const url = api.cdr.form2.common;

		return this.http.post<any[]>(url, request).pipe(
			tap(
				() => {},
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}

	update(request: Partial<CdrForm2>, id: string) {
		const url = api.cdr.form2.byId(id);

		const _request = Object.assign({}, request);

		return this.http.patch<CdrForm2>(url, _request).pipe(
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
		const url = api.cdr.form2.common;
		// console.log(url);
		const params = { filter: JSON.stringify(filter || {}) };
		// console.log(params);
		return this.http
			.get<CdrForm2[]>(url, { params })
			.pipe(
				tap(
					() => {},
					({ error: { error } }) => {
						alert(error.message);
					}
				),
				map((data) => data.map((i) => new CdrForm2(i)))
			);
	}

	getOne(id: string, filter?: any) {
		const url = api.cdr.form2.byId(id);

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
				map((data) => new CdrForm2(data))
			);
	}

	count(where?: any) {
		const url = api.cdr.form2.count;
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

	getCDRMajorCases(param :any){
		const url = api.cdr.form2.getCDRMajorCausesPrevious;
		const params = { params: JSON.stringify(param || {}) };

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
