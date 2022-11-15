import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { api } from "../../utilities/api";
import { tap, map } from "rxjs/operators";
import { CdrForm1 } from "../../models/forms/cdr/form1";
import { forkJoin, Observable } from 'rxjs';
import { CdrForm2Service } from './form2.service';
import { CdrForm3Service } from './form3.service';
import { CdrForm3BService } from './form3b.service';
import { CdrForm4Service } from './form4.service';
import { CdrForm4BService } from './form4b.service';


@Injectable({
	providedIn: "root",
})
export class CdrForm1Service {
	constructor(private http: HttpClient,private cdrForms2Service: CdrForm2Service,
		private cdrForm3Service: CdrForm3Service,
		private cdrForm3BService: CdrForm3BService,
		private cdrForm4Service: CdrForm4Service,
		private cdrForm4BService: CdrForm4BService,	) {}

	add(request: any) {
		const url = api.cdr.form1.common;

		return this.http.post<any[]>(url, request).pipe(
			tap(
				() => {},
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}

	update(request: Partial<any>, id: string) {
		const url = api.cdr.form1.byId(id);

		const _request = Object.assign({}, request);

		return this.http.patch<any>(url, _request).pipe(
			tap(
				() => {},
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}

	getList(filter?: any) {
		const url = api.cdr.form1.common;
		// console.log(url);
		const params = { filter: JSON.stringify(filter || {}) };
		//console.log(params);
		return this.http
			.get<any[]>(url, { params })
			.pipe(
				tap(
					() => {},
					({ error: { error } }) => {
						alert(error.message);
					}
				),
				map((data) => data.map((i) => new CdrForm1(i)))
			);
	}

	getOne(id: string, filter?: any) {
		const url = api.cdr.form1.byId(id);

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
				map((data) => new CdrForm1(data))
			);
	}

	count(where?: any) {
		const url = api.cdr.form1.count;
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

	getCDRDeathAgeWise(criteria:any):Observable<any>{
		const url = api.cdr.form1.getCDRDeathAgeWise;
		const params = { params: JSON.stringify(criteria) || {}};
		return this.http.post(url,params).pipe(
			tap(
				() => {},
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}


	// Getting CDR Dashobard Block 4 Value
	getDashboardBlockCount(filter?:any){
		// CDR Death Count
		// return forkJoin(
		// 	//CDR Count API
		// 	this.count(where),	
		// 	//CDR Verified Count API
		// 	this.cdrForms2Service.count(where),
		// 	// Community CDR Done
		// 	this.cdrForm3Service.count(where),
		// 	this.cdrForm3BService.count(where),
		// 	//Facility CDR Done
		// 	this.cdrForm4Service.count(where),
		// 	this.cdrForm4BService.count(where),
		// ).pipe(
		// 	tap(
		// 		() => {},
		// 		({ error: { error } }) => {
		// 			alert(error.message);
		// 		}
		// 	)
		// );
		const url = api.cdr.form1.getDashboardData;
		const params = { params: JSON.stringify(filter || {}) };
		return this.http.get<any>(url, { params }).pipe(
			tap(
				() => {},
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}

	// Getting CDR Dashboard Map Data
	getCDRDeathForMap(criteria:any):Observable<any>{
		const url = api.cdr.form1.getCDRDeathForMap;
		const params = { params: criteria || {}};
		return this.http.post(url,params).pipe(
			tap(
				() => {},
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}

	//Code done by ravindra on 23-01-2021
	getDeathsWhereCbmdsrAndFbmdsrConducted(filter?: any) {
		const url = api.cdr.form1.getDeathsWhereCbmdsrAndFbmdsrConducted;
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
		const url = api.cdr.form1.getNotificationDetails;
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
		const url = api.cdr.form1.getSubmittedFormsStatus;
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

	getIC10CdrCodes(filter?:any) {
		const feildsParam= {fields: {id: true, selectedListNumber: true, disease_name: true}} 
		const url = api.icd10Cdrcodes.common+'?filter='+JSON.stringify(feildsParam || {});
		//const params = { params: JSON.stringify(feildsParam || {}) };
		return this.http.get<any>(url).pipe(
			tap(
				() => { },
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}
	//Code end by ravindra
	getCdrReportsDetails(criteria?:any) {
		const url = api.cdr.form1.getCdrReportsDetails;
		const params = { params: JSON.stringify(criteria || {})};
		console.log(params)
		return this.http.get<any>(url,{ params }).pipe(
			tap(
				() => {},
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}

	getFormStatusReport(criteria?:any) {
	const url = api.cdr.form1.getFormStatusReport;
	const params = { params: JSON.stringify(criteria || {})};
	console.log(params)
	return this.http.get<any>(url,{ params }).pipe(
		tap(
			() => {},
			({ error: { error } }) => {
				alert(error.message);
			}
		)
	);
}
}
