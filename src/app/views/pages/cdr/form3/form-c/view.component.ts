import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { CdrForm3CService } from "../../../../../services/cdr/form3c.service";
import { CdrForm1Service } from "../../../../../services/cdr/form1.service";
import { DataList } from "../../../../../models/views/data-list";
import { MatPaginator, MatSort } from "@angular/material";
import * as objectPath from "object-path";
import { merge, of } from "rxjs";
import { startWith, switchMap, map, catchError } from "rxjs/operators";
import {getAllCDRDeathWhoseFbirDone } from "../../../../../utilities/functions";
import moment from "moment";
@Component({
	selector: "kt-view",
	templateUrl: "./view.component.html",
	styleUrls: ["./view.component.scss"],
})
export class ViewComponent implements OnInit, DataList {
	projectToDate: string = sessionStorage.getItem("ptd");
	pageSize: number;
	columns: DataList["columns"] = [
		{ name: "State", key: "address.statename" },
		{ name: "District", key: "address.districtname" },
		{ name: "Sub-District", key: "address.subdistrictname" },
		{ name: "Name", key: "name" },
		{ name: "Mother name", key: "mother_name" },
		{ name: "Village", key:"address.villagename"},
		{ name: "Mobile", key: "mobile" },
		{ name: "date_of_death", isActionField: true},
		{ name:"Age", key:"age"},
		{ name: "Place of Death", key: "palce_of_death" },
		{ name: "date_of_notification", isActionField: true },
		{ name: "Primary Informant", key: "primary_informant_name" },
		{ name: "action", isActionField: true },
	];
	totalRecords: number;
	isLoadingResults: boolean = false;
	isMaxLimitReached: boolean;
	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: false }) sort: MatSort;
	columnsToDisplay: string[] = this.columns.map((c) => c.key || c.name);
	dataSource: any[];
	fromDate;
	toDate;
	readonly objectPath = objectPath;
	currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
	constructor(
		private cdrForm3CService: CdrForm3CService,
		private cdrForm1Service: CdrForm1Service,
		private changeDetectorRef: ChangeDetectorRef
	) {}

	ngAfterViewInit() {
		this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.getList();
	}
	getList() {
		let where: any;
		let mon = moment().month() + 1;
		let day;
		let block_id=this.currentUser.user_block_id,
		 district_id=this.currentUser.user_district_id,
		  state_id=this.currentUser.user_state_id;
		if (moment().date() >= 10) {
			day = moment().date();
		} else {
			day = "0" + moment().date();
		}
		this.fromDate = moment(this.projectToDate).format("YYYY-MM-DD");
		this.toDate = moment().year() + "-" + mon + "-" + day;
		where = {
			or: [{
				"palce_of_death": this.place_of_death,
			 "address.statecode": state_id ? state_id.statecode : undefined,
			 "address.districtcode": district_id ? district_id.districtcode : undefined,
			 "address.subdistrictcode": block_id ? block_id.subdistrictcode : undefined,
			 "updatedAt": {
				 "between": [moment(this.projectToDate), moment(new Date()).add('days', 1)],
			 },
		 },
		 {
			 "createdBy": this.currentUser.id,
		 }]
			 };
		merge(this.sort.sortChange, this.paginator.page)
			.pipe(
				startWith({}),
				switchMap(() => {
					this.isLoadingResults = true;
					return this.cdrForm1Service.getList({
						where: where,
						include:['cdrForm2s','cdrForm3cs'],
						skip: this.paginator.pageIndex * this.pageSize,
						limit: this.pageSize,
						// include: [{ relation: "village" }, { relation: "fileLibrary" }]
					});
					// (this.sort.active, this.sort.direction, this.paginator.pageIndex);
				}),
				map((data) => {
					// Flip flag to show that loading has finished.
					this.isLoadingResults = false;
					this.isMaxLimitReached = false;
					// this.resultsLength = data.total_count;
					const cdrDeathsWhoseFBIRDone = getAllCDRDeathWhoseFbirDone(data, 'cdrForm2s');
					return cdrDeathsWhoseFBIRDone;
				}),
				catchError(() => {
					this.isLoadingResults = false;
					// Catch if the GitHub API has reached its rate limit. Return empty data.
					this.isMaxLimitReached = true;
					return of([]);
				})
			)
			.subscribe((data) => {
				this.dataSource = data;
				this.totalRecords = data.length;
				this.changeDetectorRef.detectChanges();
			});
	}

	place_of_death:any;
	ngOnInit() {
		if (this.currentUser.designation == "BMO" || this.currentUser.designation == "ASHA" || this.currentUser.designation == "ANM") {
			this.place_of_death = { inq: ["Home", "In transit", "Other"] }
		} else if (this.currentUser.designation == "Facility" || this.currentUser.designation == "FNO") {
			this.place_of_death = { inq: ["Health Facility","Hospital"] }
		} else {
			this.place_of_death = { inq: ["Home", "In transit", "Other", "Health Facility","Hospital"] }
		}
	}
}
