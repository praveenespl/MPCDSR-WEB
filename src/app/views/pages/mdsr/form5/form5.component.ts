import { Router } from '@angular/router';
import { Form1Service } from './../../../../services/mdsr/form1.service';
import { Form4Service } from './../../../../services/mdsr/form4.service';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from "@angular/core";
// import { Form5Service } from "../../../../services/mdsr/form5.service";
import * as objectPath from "object-path";
import { MatPaginator, MatSort, MatDialog } from "@angular/material";
import { merge, of } from "rxjs";
import { startWith, switchMap, map, catchError } from "rxjs/operators";
import { DataList } from "../../../../models/views/data-list";
import { Form5Service } from "../../../../services/mdsr/form5.service";
import moment from 'moment';
import { FormFilterComponent } from '../filter/form-filter/form-filter.component';

@Component({
	selector: "kt-form5",
	templateUrl: "./form5.component.html",
	styleUrls: ["./form5.component.scss"]
})
export class Form5Component implements OnInit, DataList {
	readonly pageSize = 50;
	readonly columns: DataList['columns'] = [
		{ name: 'block', isActionField: true },
		{ name: 'UID', key: 'uuid' },
		{ name: 'Deceased Woman Name', isActionField: true },
		{ name: 'Age', key: 'age' },
		{ name: 'Village', key: 'village_id.villagename' },
		{ name: 'Place of Death', key: 'place_of_death' },
		{ name: 'Death Date Time', isActionField: true },
		{ name: 'IsMaternal', isActionField: true },
		// { name: 'Verify', isActionField: true },
		//{ name: 'action', isActionField: true },
		{ name: 'form5Submitted', isActionField: true },
		//{ name: 'form4', isActionField: true },
		//{ name: 'form5', isActionField: true },
		//{ name: 'form6', isActionField: true },
		{ name: "form6Submitted", isActionField: true }
	]
	// readonly columns: DataList["columns"] = [
	// 	{ name: "block", isActionField: true },
	// 	{ name: "Woman Name", isActionField: true },
	// 	{ name: "Husband", key: "husband_name" },
	// 	{ name: "Age", isActionField: true },
	// 	{ name: "Death Date Time", isActionField: true },
	// 	{ name: "Place Of Death", key: "place_of_death" },
	// 	{ name: "When Death Occured", key: "when_death_occur" },
	// 	{ name: "Primary Informant", key: "reporting_person" },
	// 	{ name: "Designation", key: "designation" },
	// 	{ name: "action", isActionField: true }
	// ];
	readonly columnsToDisplay = this.columns.map(c => c.name);
	dataSource = [];
	currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
	projectToDate = sessionStorage.getItem("ptd");
	readonly objectPath = objectPath;
	stateName = "";
	districtName = "";
	blockName = "";
	fromDate;
	toDate;
	totalRecords = 0;
	isLoadingResults = true;
	isMaxLimitReached = false;

	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: false }) sort: MatSort;

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private form4Service: Form4Service,
		private form5Service: Form5Service, public dialog: MatDialog,
		private form1Service: Form1Service,
		private router: Router
	) { }

	ngAfterViewInit() {
		// this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

		// merge(this.sort.sortChange, this.paginator.page)
		// 	.pipe(
		// 		startWith({}),
		// 		switchMap(() => {
		// 			this.isLoadingResults = true;
		// 			return of([]);
		// 			// this.form5Service.getList({
		// 			// 	skip: this.paginator.pageIndex * this.pageSize,
		// 			// 	limit: this.pageSize
		// 			// });

		// 			// (this.sort.active, this.sort.direction, this.paginator.pageIndex);
		// 		}),
		// 		map(data => {
		// 			// Flip flag to show that loading has finished.
		// 			this.isLoadingResults = false;
		// 			this.isMaxLimitReached = false;
		// 			// this.resultsLength = data.total_count;

		// 			return data;
		// 		}),
		// 		catchError(() => {
		// 			this.isLoadingResults = false;
		// 			// Catch if the GitHub API has reached its rate limit. Return empty data.
		// 			this.isMaxLimitReached = true;
		// 			return of([]);
		// 		})
		// 	)
		// 	.subscribe(data => {
		// 		// this.dataSource = data;

		// 		this.changeDetectorRef.detectChanges();
		// 	});
	}

	ngOnInit() {
		this.getList();
	}
	toDateWithAddOneDay: any;
	getList() {
		let mon = moment().month() + 1;
		let day;
		let block_id, district_id, state_id;
		if (moment().date() >= 10) {
			day = moment().date();
		} else {
			day = "0" + moment().date();
		}
		console.log('this.currentUser', this.currentUser);
		if (this.currentUser.accessupto == "Block") {
			this.blockName = this.currentUser.user_block_id.subdistrictname;
			this.stateName = this.currentUser.user_state_id.statename;
			this.districtName = this.currentUser.user_district_id.districtname;
			//state_id=this.currentUser.user_state_id.statecode;
			//district_id=this.currentUser.user_district_id.districtcode;
			block_id = this.currentUser.user_block_id.subdistrictcode;
		} else if (this.currentUser.accessupto == "District") {
			this.stateName = this.currentUser.user_state_id.statename;
			this.districtName = this.currentUser.user_district_id.districtname;
			district_id = this.currentUser.user_district_id.districtcode;
		} else if (this.currentUser.accessupto == "State") {
			this.stateName = this.currentUser.user_state_id.statename;
			state_id = this.currentUser.user_state_id.statecode;
		} else {
			this.stateName = "All States";
		}
		this.fromDate = moment(this.projectToDate).format("DD-MM-YYYY");
		this.toDate = day + "-" + mon + "-" + moment().year();
		this.toDateWithAddOneDay = moment().year() + "-" + mon + "-" + day;
		let where = {
			"place_of_death": { inq: ["Home", "Transit", "Other"] },
			"state_id.statecode": state_id ? state_id : undefined,
			"district_id.districtcode": district_id ? district_id : undefined,
			"block_id.subdistrictcode": block_id ? block_id : undefined,
			updatedAt: { between: [moment(this.projectToDate), moment(this.toDateWithAddOneDay).add(1, 'days')] },
			"is_maternal_death": true
		}
		this.form1Service.getList({
			where,
			include: [
				{ relation: "state" },
				{ relation: "district" },
				{ relation: "block" },
				{
					relation: "mdsrForm5s",
					scope: {
						include: [
							{ relation: "referraldetails" },
							{ relation: "state" },
							{ relation: "district" },
							{ relation: "block" },
							{ relation: "facility" }
						]
					}
				}
			]
		} as any).subscribe(response => {
			this.dataSource = response;
			this.changeDetectorRef.detectChanges();
		})

		this.getTableFooterCount(where);
		// this.form5Service.getList({
		// 	//	skip: this.paginator.pageIndex * this.pageSize,
		// 	//	limit: this.pageSize,
		// 	where: where,
		// 	include: { relation: "mdsrForm1" } as any
		// }).pipe(
		// 	map(data => {
		// 		return this.form4Service.canEdit(data,this.currentUser);
		// 	})
		// ).subscribe(response => {
		// 	this.dataSource = response;
		// 	this.changeDetectorRef.detectChanges();
		// });
	}
	showFilters(): void {
		const dialogRef = this.dialog.open(FormFilterComponent, {
			width: '80%',
			height: '40%',
			data: "",
			panelClass: ['filterPopup'],
			hasBackdrop: true,
			disableClose: false
		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			if (res && res.action === 1) {
				this.stateName = res.data.state_id ? res.data.state_id.statename : undefined;
				this.districtName = res.data.district_id ? res.data.district_id.districtname : undefined;
				this.blockName = res.data.block_id ? res.data.block_id.subdistrictname : undefined;
				this.fromDate = moment(res.data.from_date).format('DD-MM-YYYY');
				this.toDate = moment(res.data.to_date).format('DD-MM-YYYY')
				let where = {
					"place_of_death": { inq: ["Home", "Transit", "Other"] },
					"state_id.statecode": res.data.state_id ? res.data.state_id.statecode : undefined,
					"district_id.districtcode": res.data.district_id
						? res.data.district_id.districtcode
						: undefined,
					"block_id.subdistrictcode": res.data.block_id ? res.data.block_id.subdistrictcode : undefined,
					"updatedAt": { between: [moment(res.data.from_date).format('YYYY-MM-DD'), moment(res.data.to_date).add(1, 'days').format('YYYY-MM-DD')] } as any,
					"is_maternal_death": true
				};
				this.form1Service.getList({
					where,
					include: [
						{ relation: "state" },
						{ relation: "district" },
						{ relation: "block" },
						{
							relation: "mdsrForm5s",
							scope: {
								include: [
									{ relation: "referraldetails" },
									{ relation: "state" },
									{ relation: "district" },
									{ relation: "block" },
									{ relation: "facility" }
								]
							}
						}
					]
				} as any).subscribe(response => {
					this.dataSource = response;
					this.changeDetectorRef.detectChanges();
				})

				this.getTableFooterCount(where)
				// merge(this.sort.sortChange, this.paginator.page)
				// 	.pipe(
				// 		startWith({}),
				// 		switchMap(() => {
				// 			this.isLoadingResults = true;
				// 			return this.form5Service.getList({
				// 				//	skip: this.paginator.pageIndex * this.pageSize,
				// 				//	limit: this.pageSize,
				// 				where: where,
				// 				include: { relation: "mdsrForm1" } as any
				// 			});

				// 			// (this.sort.active, this.sort.direction, this.paginator.pageIndex);
				// 		}),
				// 		map(data => {
				// 			// Flip flag to show that loading has finished.
				// 			this.isLoadingResults = false;
				// 			this.isMaxLimitReached = false;
				// 			// this.resultsLength = data.total_count;
				// 			return this.form4Service.canEdit(data, this.currentUser);
				// 		}),
				// 		catchError(() => {
				// 			this.isLoadingResults = false;
				// 			// Catch if the GitHub API has reached its rate limit. Return empty data.
				// 			this.isMaxLimitReached = true;
				// 			return of([]);
				// 		})
				// 	)
				// 	.subscribe(data => {
				// 		this.dataSource = data as any[];

				// 		this.changeDetectorRef.detectChanges();
				// 	});
			}

			//this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
			//	this.loadRolesList();
		});
	}
	getTableFooterCount(where: any) {
		this.form1Service.count(where).subscribe(({ count }) => {
			this.totalRecords = count;
			this.changeDetectorRef.detectChanges();
		});
	}

	editForm(data: any) {
		const { id } = data;
		this.router.navigateByUrl(`/mdsr/form5/${id}`)
	}

	// viewForm(e:any) {
	viewForm(id: string) {
		console.log("Id is --> ", id)
		console.log(`/mdsr/form1/view/${id}`);
		this.router.navigateByUrl(`/mdsr/form1/view/${id}`);
	}
	addForm(data) {
		const { row } = data;
		localStorage.removeItem("data");
		localStorage.setItem("data", JSON.stringify(row));
		this.router.navigateByUrl("/mdsr/form5/add", { state: { row } })
	}
}
