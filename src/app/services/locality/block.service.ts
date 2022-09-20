import { Injectable } from "@angular/core";
import { Subject, ReplaySubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { api } from "../../utilities/api";
import { take, tap } from "rxjs/operators";

@Injectable({
	providedIn: "root"
})
export class BlockService {
	private _blocks: Block[] = [];
	private _blocksObservable: Subject<Block[]> = new ReplaySubject(1);

	list = this._blocksObservable.asObservable();

	constructor(private http: HttpClient) {}

	private set blocks(blocks: Block[]) {
		this._blocks = blocks;
		this._blocksObservable.next(this._blocks);
	}

	getBlocks(districtcode: string | number) {
		const url = api.locality.block.common;
		const params = {
			// TODO: remove hard coded district code
			obj: JSON.stringify({
				type: "getSubDistricts",
				districtcode:districtcode
			})
		};

		return this.http
			.get<Block[]>(url, { params })
			.pipe(tap(response => (this.blocks = response)));
	}
}
