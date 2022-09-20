import { AlertService } from './../../utilities/alert.service';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { api } from "../../utilities/api";
import { tap, map } from "rxjs/operators";
import { Form1Object } from "../../models/forms/mdsr/form1";
import { Filter as FilterCommon } from "../../models/filter";
import { forkJoin } from "rxjs";

export interface Filter extends FilterCommon<Form1Object> { }

@Injectable({
	providedIn: "root"
})
export class Form1Service {
	constructor(private http: HttpClient, private alertService: AlertService) { }

	add(request: Form1Object) {
		const url = api.mdsr.form1.common;

		return this.http.post<Form1Object[]>(url, request).pipe(
			tap(
				() => { },
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}

	update(request: Partial<Form1Object>) {
		const url = api.mdsr.form1.byId(request.id);

		const _request = Object.assign({}, request);
		delete _request.id;

		return this.http.patch<Form1Object>(url, _request).pipe(
			tap(
				() => { },
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}

	updateMiltple(requests: Partial<Form1Object>[]) {
		return forkJoin(requests.map(i => this.update(i)));
	}

	// TODO: create request model
	backup(request: any) {
		const url = api.mdsr.form1Backup.common;
		const _request = Object.assign({}, request);
		delete _request.id;

		return this.http.post<Form1Object>(url, _request).pipe(
			tap(
				() => { },
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}

	getList(filter?: Filter) {
		const url = api.mdsr.form1.common;
		const params = { filter: JSON.stringify(filter || {}) };
		return this.http
			.get<Form1Object[]>(url, { params })
			.pipe(
				tap(
					() => { },
					({ error: { error } }) => {
						alert(error.message);
					}
				),
				map(data => data.map(i => new Form1Object(i)))
			);
	}

	getOne(id: string, filter?: Filter) {
		const url = api.mdsr.form1.byId(id);

		const params = { filter: JSON.stringify(filter || {}) };

		return this.http
			.get<Form1Object>(url, { params })
			.pipe(
				tap(
					() => { },
					({ error: { error } }) => {
						alert(error.message);
					}
				),
				map(data => new Form1Object(data))
			);
	}

	count(filter?: Filter) {
		const url = api.mdsr.form1.count;
		const params = { where: JSON.stringify(filter || {}) };

		return this.http
			.get<any>(url, { params })
			.pipe(
				tap(
					() => { },
					({ error: { error } }) => {
						alert(error.message);
					}
				)
			);
	}

	getDashboardData(filter?: any) {
		console.log("filter : ----------------",filter);
		const url = api.mdsr.form1.getDashboardData;
		const params = { params: JSON.stringify(filter || {}) };
		return this.http.get<any>(url, { params }).pipe(
			tap(
				() => { },
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}

	//get Expected Vs Acutal Statewise Dta
	getExpectedVsActual(query: any) {
		const url = api.mdsr.form1.getExpectedVsActual;
		const params = { params: JSON.stringify(query) };
		return this.http
			.get<any>(url, { params })
			.pipe(
				tap(
					() => { },
					({ error: { error } }) => {
						alert(error.message);
					}
				)
			);
	}
	// get Form4 data if 4 not exist then Form5 Data
	getFormData(filter: any) {
		const url = api.mdsr.form1.getFormsData;
		const params = { params: JSON.stringify(filter) };
		return this.http
			.get<any>(url, { params })
			.pipe(
				tap(
					() => { },
					({ error: { error } }) => {
						alert(error.message);
					}
				)
			);
	}

	// get NotificationVsReviewData
	getNotificationVsReviewData(filter: any) {
		const url = api.mdsr.form1.getNotificationVsReviewData;
		const params = { params: JSON.stringify(filter) };
		return this.http
			.get<any>(url, { params })
			.pipe(
				tap(
					() => { },
					({ error: { error } }) => {
						alert(error.message);
					}
				)
			);
	}

	// Send Messages and mail notifications done by ravi on 02-01-2020
	sendMessagesAndMailsNotifications(filter: any) {
		const url = api.mailcontent.sendMessagesAndMailsNotifications;
		const params = { params: JSON.stringify(filter) };
		return this.http
			.get<any>(url, { params })
			.pipe(
				tap(
					() => { },
					({ error: { error } }) => {
						alert(error.message);
					}
				)
			);
	}

	getNotificationCount(filter?: any) {
		const url = api.mdsr.form1.getNotificationCount;
		const params = { params: JSON.stringify(filter || {}) };
		return this.http.get<any>(url, { params }).pipe(
			tap(
				() => { },
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}

	getNotificationDetails(filter?: any) {
		const url = api.mdsr.form1.getNotificationDetails;
		const params = { params: JSON.stringify(filter || {}) };
		return this.http.get<any>(url, { params }).pipe(
			tap(
				() => { },
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}

	getCodesCategorywise() {
		const url = api.icd10codes.getCodesCategorywise;
		//const params = { params: JSON.stringify(filter || {}) };
		return this.http.get<any>(url).pipe(
			tap(
				() => { },
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}

	getMaternalCauseOfdeaths(filter?: any) {
		const url = api.mdsr.form1.getMaternalCauseOfdeaths;
		const params = { params: JSON.stringify(filter || {}) };
		return this.http.get<any>(url, { params }).pipe(
			tap(
				() => { },
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}

	getMostAndLeastDistrictsDeaths(filter?: any) {
		const url = api.mdsr.form1.getMostAndLeastDistrictsDeaths;
		const params = { params: JSON.stringify(filter || {}) };
		return this.http.get<any>(url, { params }).pipe(
			tap(
				() => { },
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}

	getDeathsWhereCbmdsrAndFbmdsrConducted(filter?: any) {
		console.log("filter ; ",filter);
		const url = api.mdsr.form1.getDeathsWhereCbmdsrAndFbmdsrConducted;
		const params = { params: JSON.stringify(filter || {}) };
		return this.http.get<any>(url, { params }).pipe(
			tap(
				() => { },
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}

	getMaternalCauseOfdeathsFor6Months(filter?: any) {
		const url = api.mdsr.form1.getMaternalCauseOfdeathsFor6Months;
		const params = { params: JSON.stringify(filter || {}) };
		return this.http.get<any>(url, { params }).pipe(
			tap(
				() => { },
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}

	getSubmittedFormsStatus(filter?: any) {
		const url = api.mdsr.form1.getSubmittedFormsStatus;
		const params = { params: JSON.stringify(filter || {}) };
		return this.http.get<any>(url, { params }).pipe(
			tap(
				() => { },
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}
	//end done by ravi
	getPlaceOfDeath(filter: any){
		const url = api.mdsr.form1.getPlaceOfDeath;
		const params = { params: JSON.stringify(filter || {}) };
		return this.http.get(url,{params}).pipe(
			tap(
				() => {},
				({ error: { error } }) => {
					this.errorHandler(error)
				}
			)
		);
	}

	getMaternalDeathTypesGraphData(filter: any){
		const url = api.mdsr.form1.maternalDeathTypesGraphData;
		const params = { params: JSON.stringify(filter || {}) };
		return this.http.get(url,{params}).pipe(
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
