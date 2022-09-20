import { Injectable } from '@angular/core';
import { Facility } from '../models/facility';
import { Subject, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { api } from '../utilities/api';

@Injectable({
  providedIn: 'root'
})
export class FacilityService {
  private _facility: Facility[] = [];
	private _facilityObservable: Subject<Facility[]> = new ReplaySubject(1);

	constructor(private http: HttpClient) {}

	list(filter?: any) {
		if (!this._facility.length) {
			const url = api.locality.state.common;
			const params = { obj: JSON.stringify(filter || {}) };
			this.http.get<Facility[]>(url,{params}).subscribe(response => {
				this._facility = response;
				this._facilityObservable.next(this._facility);
			});
		}

		return this._facilityObservable.asObservable().pipe(take(1));
	}
}
