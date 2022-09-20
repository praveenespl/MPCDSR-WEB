import { Injectable } from "@angular/core";
import { Village } from "../../models/locality/village";
import { Subject, ReplaySubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { api } from "../../utilities/api";
import { take, tap } from "rxjs/operators";
import { environment } from "../../../environments/environment";

export const localizationApiEndPoint = environment.localizationApiEndPoint;

@Injectable({
	providedIn: "root"
})
export class VillageService {
	private _village: Village[] = [];
	private _villageObservable: Subject<Village[]> = new ReplaySubject(1);

	constructor(private http: HttpClient) {}

	private set village(districts: Village[]) {
		this._village = districts;
		this._villageObservable.next(this._village);
	}

	getVillages(subdistrictcode: number | string) {
		const url = localizationApiEndPoint;

		const params = {
			obj: JSON.stringify({
				type: "getVillages",
				subdistrictcode
			})
		};

		return this.http
			.get<Village[]>(url, { params })
			.pipe(tap(response => (this.village = response)));
	}
}
