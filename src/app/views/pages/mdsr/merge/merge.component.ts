import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { MatDialog } from "@angular/material";
import { FormFilterComponent } from "../filter/form-filter/form-filter.component";
import moment from "moment";
import { SimilarRecordsComponent } from "./similar-records/similar-records.component";
import { Form1Object } from "../../../../models/forms/mdsr/form1";
import { merge, of } from "rxjs";
import { startWith, switchMap, map, catchError } from "rxjs/operators";
import { Form1Service } from "../../../../services/mdsr/form1.service";

@Component({
	selector: "kt-merge",
	templateUrl: "./merge.component.html",
	styleUrls: ["./merge.component.scss"]
})
export class MergeComponent implements OnInit {
	columns = [
		// "radio",
		"name",
		"husband",
		"state",
		"district",
		"block",
		"village",
		"place_of_death",
		"action"
	];
	dataSource: any[] = [];

	blockName: string;
	stateName: string;
	districtName: string;
	fromDate: string;
	toDate: string;

	currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

	constructor(
		private dialog: MatDialog,
		private form1Service: Form1Service,
		private changeDetectorRef: ChangeDetectorRef
	) {}

	getList(where?: any) {
		// this.form1Service.count({ where }).subscribe(({ count }) => {
		// 	this.totalRecords = count;
		// });

		merge()
			.pipe(
				startWith({}),
				switchMap(() => {
					// this.isLoadingResults = true;
					return this.form1Service.getList({
						where: where,
						// skip: this.paginator.pageIndex * this.pageSize,
						// limit: this.pageSize,
						include: [{ relation: "village" }]
					});
					// (this.sort.active, this.sort.direction, this.paginator.pageIndex);
				}),
				map(data => {
					// Flip flag to show that loading has finished.
					// this.isLoadingResults = false;
					// this.isMaxLimitReached = false;

					return data;
				}),
				catchError(() => {
					// this.isLoadingResults = false;
					// this.isMaxLimitReached = true;
					return of([]);
				})
			)
			.subscribe(data => {
				this.dataSource = (data as any[]).map((i: any) => ({
					...i,
					getName: i.getName,
					newState: "",
					newDistrict: "",
					newBlock: ""
				}));
				this.changeDetectorRef.detectChanges();
			});
	}

	showFilers(): void {
		const dialogRef = this.dialog.open(FormFilterComponent, {
			width: "80%",
			height: "50%",
			data: "",
			panelClass: ["filterPopup"],
			hasBackdrop: true,
			disableClose: false
		});
		dialogRef.afterClosed().subscribe(res => {
			let where: Partial<any>;
			if (!res) {
				return;
			}
			if (res && res.action === 1) {
				this.stateName = res.data.state_id
					? res.data.state_id.statename
					: undefined;
				this.districtName = res.data.district_id
					? res.data.district_id.districtname
					: undefined;
				this.blockName = res.data.block_id
					? res.data.block_id.subdistrictname
					: undefined;
				this.fromDate = moment(res.data.from_date).format("DD-MM-YYYY");
				this.toDate = moment(res.data.to_date).format("DD-MM-YYYY");

				where = {
					"state_id.statecode": res.data.state_id
						? res.data.state_id.statecode
						: undefined,
					"district_id.districtcode": res.data.district_id
						? res.data.district_id.districtcode
						: undefined,
					"block_id.subdistrictcode": res.data.block_id
						? res.data.block_id.subdistrictcode
						: undefined,
					death_date_time: {
						between: [
							moment(res.data.from_date).format("YYYY-MM-DD"),
							moment(res.data.to_date).format("YYYY-MM-DD")
						]
					} as any
				};

				this.getList(where);
			}
			//this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
			//	this.loadRolesList();
		});
	}

	viewSimilar(record: Form1Object) {
		const dialogRef = this.dialog.open(SimilarRecordsComponent, {
			data: { record },
			minWidth: "90%",
			disableClose: true
		});
	}

	ngOnInit() {
		// this.stateService.getStates().subscribe(states => {
		// 	this.states = states;
		// });

		// let where: Partial<any>;
		let mon = moment().month() + 1;
		let day;
		let block_id, district_id, state_id;

		if (moment().date() >= 10) {
			day = moment().date();
		} else {
			day = "0" + moment().date();
		}
		if (this.currentUser.accessupto == "Block") {
			//
			this.columns.splice(this.columns.indexOf("state"), 1);
			this.columns.splice(this.columns.indexOf("district"), 1);
			this.columns.splice(this.columns.indexOf("block"), 1);
			//
			this.blockName = this.currentUser.user_block_id
				? this.currentUser.user_block_id.subdistrictname
				: undefined;
			this.stateName = this.currentUser.user_state_id
				? this.currentUser.user_state_id.statename
				: undefined;
			this.districtName = this.currentUser.user_district_id
				? this.currentUser.user_district_id.districtname
				: undefined;
			block_id = this.currentUser.user_block_id
				? this.currentUser.user_block_id
				: undefined;
		} else if (this.currentUser.accessupto == "District") {
			//
			this.columns.splice(this.columns.indexOf("new_state"), 1);
			this.columns.splice(this.columns.indexOf("new_district"), 1);
			//
			this.stateName = this.currentUser.user_state_id
				? this.currentUser.user_state_id.statename
				: undefined;
			this.districtName = this.currentUser.user_district_id
				? this.currentUser.user_district_id.districtname
				: undefined;
			district_id = this.currentUser.user_district_id
				? this.currentUser.user_district_id
				: undefined;
		} else if (this.currentUser.accessupto == "State") {
			//
			this.columns.splice(this.columns.indexOf("new_state"), 1);
			//
			this.stateName = this.currentUser.user_state_id
				? this.currentUser.user_state_id.statename
				: undefined;
			state_id = this.currentUser.user_state_id
				? this.currentUser.user_state_id
				: undefined;
		} else {
			this.stateName = "All States";
		}
		this.fromDate = "01" + "-" + mon + "-" + moment().year();
		this.toDate = day + "-" + mon + "-" + moment().year();
		const where = {
			"state_id.statecode": state_id ? state_id.statecode : undefined,
			"district_id.districtcode": district_id
				? district_id.districtcode
				: undefined,
			"block_id.subdistrictcode": block_id
				? block_id.subdistrictcode
				: undefined,
			// death_date_time
			createdAt: {
				between: [moment().year() + "-" + mon + "-01", new Date()]
			}
		};
		//
		this.getList(where);
	}
}
