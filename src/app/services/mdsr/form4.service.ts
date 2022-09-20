import { Injectable } from "@angular/core";
import { Form4Object } from "../../models/forms/mdsr/form4";
import { HttpClient } from "@angular/common/http";
import { AlertService } from "../../utilities/alert.service";
import { api } from "../../utilities/api";
import { tap, map } from "rxjs/operators";
import moment from "moment";
export interface Filter {
	skip?: string | number;
	limit?: string | number;
	where?: Partial<Form4Object>;
	include?: any;
}
@Injectable({
	providedIn: "root",
})
export class Form4Service {
	constructor(private http: HttpClient, private alertService: AlertService) {}
	add(request: Form4Object) {
		const url = api.mdsr.form4.common;
		return this.http.post<Form4Object[]>(url, request).pipe(
			tap(
				() => {},
				({ error: { error } }) => {
					this.errorHandler(error);
				}
			)
		);
	}

	update(request: Form4Object) {
		const url = api.mdsr.form4.byId(request.id);

		const _request = Object.assign({}, request);
		delete _request.id;

		return this.http.patch<Form4Object>(url, _request).pipe(
			tap(
				() => {},
				({ error: { error } }) => {
					this.errorHandler(error);
				}
			)
		);
	}
	getList(filter?: {
		include?: any;
		skip?: string | number;
		limit?: string | number;
		where?: Partial<Form4Object>;
		fields?: any;
	}) {
		const url = api.mdsr.form4.common;

		const params = { filter: JSON.stringify({ ...filter }) };

		return this.http
			.get<any>(url, { params })
			.pipe(
				tap(
					() => {},
					({ error: { error } }) => {
						this.errorHandler(error);
					}
				)
				//	map(data=>data.map(i=>new Form4Object(i)))
			);
	}
	errorHandler(error) {
		this.alertService.fireAlert({
			icon: "error",
			title: error.message,
			timer: 3000,
			showConfirmButton: false,
		});
	}
	getOne(id: string, filter?: Filter) {
		const url = api.mdsr.form4.byId(id);

		const params = { filter: JSON.stringify(filter || {}) };

		return this.http
			.get<Form4Object>(url, { params })
			.pipe(
				tap(
					(data) => {
						console.log("form 4 raw response", data);
					},
					({ error: { error } }) => {
						alert(error.message);
					}
				),
				map((data) => new Form4Object(data))
			);
	}
	count(where) {
		const url = api.mdsr.form4.count;

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

	canEdit(data:any,user:any){
		return data.map(item => {
			if(item && item.mdsrForm1 && item.mdsrForm1.death_date_time){
				const dayDiff = moment.utc().diff(item.mdsrForm1.death_date_time, 'days');
				item.canEdit = user.accessupto === 'District' && dayDiff > 45 ? false : true;
			}
			return item;
		});
	}
	fbmdrVsCbmdrSubmitted(filter:any) {
		const url = api.mdsr.form4.fbmdrVsCbmdrSubmitted;
console.log("filter : ",filter);
		const params = { params: JSON.stringify({ ...filter }) };

		return this.http
			.get<any>(url, { params })
			.pipe(
				tap(
					() => {},
					({ error: { error } }) => {
						this.errorHandler(error);
					}
				)
				//	map(data=>data.map(i=>new Form4Object(i)))
			);
	}

}
