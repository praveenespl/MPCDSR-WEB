import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { api } from "../../utilities/api";
import { tap, map } from "rxjs/operators";
import { Form2Object } from "../../models/forms/mdsr/form2";
import { AlertService } from '../../utilities/alert.service';
@Injectable({
	providedIn: "root"
})
export class Form2Service {
	constructor(private http: HttpClient,private alertService:AlertService) {}

	add(request: Form2Object | Form2Object[]) {
		const url = api.mdsr.form2.common;

		return this.http.post<Form2Object[]>(url, request).pipe(
			tap(
				() => {},
				({ error: { error } }) => {
					this.errorHandler(error)
				}
			)
		);
	}

	update(request: Form2Object) {
		const url = api.mdsr.form2.byId(request.id);

		const _request = Object.assign({}, request);
		delete _request.id;

		return this.http.patch<Form2Object>(url, _request).pipe(
			tap(
				() => {},
				({ error: { error } }) => {
					this.errorHandler(error)
				}
			)
		);
	}

	getList(filter?: {
		include?:any,
		skip?: string | number;
		limit?: string | number;
		where?: Partial<Form2Object>;
	}) {
		const url = api.mdsr.form2.common;


		const params = { filter: JSON.stringify({ ...filter }) };

		return this.http
			.get<Form2Object[]>(url, { params })
			.pipe(
				tap(
					() => {},
					({ error: { error } }) => {
						this.errorHandler(error)
					}
				),
				map(data=>data.map(i=>new Form2Object(i)))
			);
	}

	getOne(id: string) {
		const url = api.mdsr.form2.byId(id);

		const params = {};

		return this.http
			.get<Form2Object>(url, { params })
			.pipe(
				tap(
					() => {},
					({ error: { error } }) => {
						this.errorHandler(error)
					}
				)
			);
	}

	count(filter:any) {
		const url = api.mdsr.form2.count;
		const params = { where: JSON.stringify(filter || {}) };
		return this.http.get<any>(url, { params }).pipe(
			tap(
				() => {},
				({ error: { error } }) => {
					this.errorHandler(error)
				}
			)
		);
	}

	errorHandler(error){
		this.alertService.fireAlert({
			icon:'error',
			title:error.message,
			timer:3000,
			showConfirmButton:false
		})
	}
}
