import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, ReplaySubject } from "rxjs";
import { tap } from "rxjs/operators";
import { api } from "../../utilities/api";

@Injectable({
	providedIn: "root"
})
export class DistrictService {
	private _districts: District[] = [];
	private _districtsObservable: Subject<District[]> = new ReplaySubject(1);

	list = this._districtsObservable.asObservable();

	constructor(private http: HttpClient) {}

	private set districts(districts: District[]) {
		this._districts = districts;
		this._districtsObservable.next(this._districts);
	}


	getDistricts(statecode: string | number) {
		const url = api.locality.district.common;
		const params = {
			obj: JSON.stringify({
				"type": "getDistricts",
				"statecode":statecode
			})
		};
		return this.http
			.get<District[]>(url, { params })
			.pipe(tap(response => (this.districts = response)));
	}
}
