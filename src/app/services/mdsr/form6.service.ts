import { Injectable } from '@angular/core';
import { api } from "../../utilities/api";
import { tap, map } from "rxjs/operators";
import { Form6Object } from "../../models/forms/mdsr/form6";
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../../utilities/alert.service';
export interface Filter {
	skip?: string | number;
	limit?: string | number;
	where?: Partial<Form6Object>;
	include?: any;
}
@Injectable({
  providedIn: 'root'
})
export class Form6Service {

  constructor(private http: HttpClient,private alertService:AlertService) { }
  add(request: Form6Object) {
		const url = api.mdsr.form6.common;
		return this.http.post<Form6Object[]>(url, request).pipe(
			tap(
				() => {},
				({ error: { error } }) => {
          this.errorHandler(error)
				}
			)
		);
	}

	update(request: Form6Object) {
		const url = api.mdsr.form6.byId(request.id);

		const _request = Object.assign({}, request);
		delete _request.id;

		return this.http.patch<Form6Object>(url, _request).pipe(
			tap(
				() => {},
				({ error: { error } }) => {
          this.errorHandler(error)
				}
			)
		);
  }
  getList(filter?: Filter) {
		const url = api.mdsr.form6.common;

		const params = { filter: JSON.stringify({ ...filter }) };

		return this.http
			.get<Form6Object[]>(url, { params })
			.pipe(
				tap(
					() => {},
					({ error: { error } }) => {
						this.errorHandler(error)
					}
				),
				map(data=>data.map(i=>new Form6Object(i)))
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
  getOne(id: string, filter?: Filter) {
		const url = api.mdsr.form6.byId(id);

		const params = { filter: JSON.stringify(filter || {}) };

		return this.http
			.get<Form6Object>(url, { params })
			.pipe(
				tap(
					() => {},
					({ error: { error } }) => {
						alert(error.message);
					}
				),
				map(data=>new Form6Object(data))
			);
	}

	count(where) {
		const url = api.mdsr.form6.count;
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
