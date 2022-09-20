import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, ReplaySubject, of } from "rxjs";
import { State } from "../../models/locality/state";
import { take, tap } from "rxjs/operators";
import { api } from "../../utilities/api";

@Injectable({
	providedIn: "root"
})
export class StateService {
	private _states: State[] = [];
	private _statesObservable: Subject<State[]> = new ReplaySubject(1);

	list = this._statesObservable.asObservable();

	constructor(private http: HttpClient) {}

	private set states(districts: State[]) {
		this._states = districts;
		this._statesObservable.next(this._states);
	}

	getStates() {
		const url = api.locality.block.common;

		const params = {
			obj: JSON.stringify({
				type: "getStates"
			})
		};

		return this.http
			.get<State[]>(url, { params })
			.pipe(tap(response => (this.states = response)));
	}
	}
