import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { api } from "../utilities/api";
import { tap, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AlertService {

	constructor(private http: HttpClient) { }
  getList(filter?: any) {
		const url = api.Alerts.common;
		const params = { filter: JSON.stringify(filter || {}) };
		return this.http
			.get<any[]>(url, { params })
			.pipe(
				tap(
					() => { },
					({ error: { error } }) => {
						alert(error.message);
					}
				),
			);
	}
	sendEmailAndMessage(data: any){
		const url = api.Alerts.sendEmailAndMessage;
		return this.http.post(url,{parameters:data}).pipe(
			tap(
				() => {},
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}
	
}
