import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { api } from "../../utilities/api";
import { tap, map } from "rxjs/operators";
import { forkJoin, Observable } from 'rxjs';
import { Stillbirth } from "../../models/forms/stillbirth/stillbirth";
import { stillBirthAutoId } from "../../models/forms/stillbirth/stillBirthAutoId";

@Injectable({
	providedIn: "root",
})

export class StillbirthService {
	constructor(private http: HttpClient) { }

	add(request: any) {
		const url = api.stillbirth.common;

		return this.http.post<any[]>(url, request).pipe(
			tap(
				() => { },
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}

	update(request: Partial<any>, id: string) {
		const url = api.stillbirth.byId(id);

		const _request = Object.assign({}, request);

		return this.http.patch<any>(url, _request).pipe(
			tap(
				() => { },
				({ error: { error } }) => {
					alert(error.message);
				}
			)
		);
	}

	getList(filter?: any) {
		const url = api.stillbirth.common;
		// console.log(url);
		const params = { filter: JSON.stringify(filter || {}) };
		//console.log(params);
		return this.http
			.get<any[]>(url, { params })
			.pipe(
				tap(
					() => { },
					({ error: { error } }) => {
						alert(error.message);
					}
				),
				map((data) => data.map((i) => new Stillbirth(i)))
			);
	}

	getOne(id: string, filter?: any) {
		const url = api.stillbirth.byId(id);

		const params = { filter: JSON.stringify(filter || {}) };

		return this.http
			.get<any>(url, { params })
			.pipe(
				tap(
					() => { },
					({ error: { error } }) => {
						alert(error.message);
					}
				),
				map((data) => new Stillbirth(data))
			);
	}

	// count(where?: any) {
	// 	const url = api.stillbirth.count;
	// 	const params = { where: JSON.stringify(where || {}) };

	// 	return this.http
	// 		.get<any>(url, { params })
	// 		.pipe(
	// 			tap(
	// 				() => {},
	// 				({ error: { error } }) => {
	// 					alert(error.message);
	// 				}
	// 			)
	// 		);
	// }
	getStillBirthAutoId(filter: any) {
		const url = api.stillBirthAutoId.getSBId;
		const params = { params: JSON.stringify(filter || {}) };
		console.log('params',params);
		return this.http.get<any>(url, { params })
			.pipe(
				tap(
					() => { },
					({ error: { error } }) => {
						alert(error.message);
					}
				),
			);
	}


	uploadImage(/*applicantId: string,*/ containerName: string, myFiles: any) {

		const formData = new FormData();
		for (var i = 0; i < myFiles.length; i++) { 
			formData.append("file", myFiles[i]);
			formData.append('fields', "multipleFiles");
		  }
		//formData.append('file', fileUpload, fileUpload.name);
		//formData.append('fields', "5ffd3be1c661303a1d7fb8ae");
		const url = api.container.common + '/' + containerName + '/upload';

		return this.http.post(url, formData, {
			reportProgress: true,
			observe: 'events'
		});

	}

	getImageForPreview(imageName: any) {
		let url = api.container.downloadStillbirth + imageName;
		return this.http.get(url, { responseType: 'blob' });
	}

	getNotificationCount(filter?: any) {
		console.log('filter', filter);
		const url = api.stillbirth.getNotificationCount;
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


}