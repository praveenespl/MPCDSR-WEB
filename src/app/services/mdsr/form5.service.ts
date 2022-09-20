import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { api } from "../../utilities/api";
import { tap, map } from "rxjs/operators";
import { Form5Object } from "../../models/forms/mdsr/form5";
import { Filter as FilterCommon } from "../../models/filter";

export interface Filter extends FilterCommon<Form5Object> {}

@Injectable({
	providedIn: "root",
})
export class Form5Service {
	constructor(private http: HttpClient) {}

	add(request: Form5Object) {
		const url = api.mdsr.form5.common;

		return this.http.post<Form5Object>(url, request).pipe(
			tap(
				() => {},
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}

	update(request: Form5Object) {
		const url = api.mdsr.form5.byId(request.id);

		const _request = Object.assign({}, request);
		delete _request.id;

		return this.http.patch<Form5Object>(url, _request).pipe(
			tap(
				() => {},
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}

	getList(filter?: Filter) {
		const url = api.mdsr.form5.common;

		const params = { filter: JSON.stringify(filter || {}) };
		return this.http
			.get<Form5Object[]>(url, { params })
			.pipe(
				tap(
					() => {},
					({ error: { error } }) => {
						alert(error.message);
					}
				),
				map((data) => data.map((i) => new Form5Object(i)))
			);
	}

	getOne(id: string, filter?: Filter) {
		const url = api.mdsr.form5.byId(id);

		const params = { filter: JSON.stringify(filter || {}) };

		return this.http
			.get<Form5Object>(url, { params })
			.pipe(
				tap(
					() => {},
					({ error: { error } }) => {
						alert(error.message);
					}
				),
				map((data) => new Form5Object(data))
			);
	}

	count(where) {
		const url = api.mdsr.form5.count;

		return this.http
			.get<any>(url, { params: { where: JSON.stringify(where) } })
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
