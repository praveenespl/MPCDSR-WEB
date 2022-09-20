import { Router } from '@angular/router';
import { Form1Service } from './../../../../services/mdsr/form1.service';
import {
	Component,
	OnInit,
	ChangeDetectorRef,
	ViewChild,
	AfterViewInit,
} from "@angular/core";
// import { Form5Service } from "../../../../services/mdsr/form5.service";
import * as objectPath from "object-path";
import { MatPaginator, MatSort, MatDialog } from "@angular/material";
import { merge, of } from "rxjs";
import { startWith, switchMap, map, catchError } from "rxjs/operators";
import { DataList } from "../../../../models/views/data-list";
import { Form4Service } from "../../../../services/mdsr/form4.service";
import moment from "moment";
import { FormFilterComponent } from "../filter/form-filter/form-filter.component";

@Component({
	selector: "kt-form4",
	templateUrl: "./form4.component.html",
	styleUrls: ["./form4.component.scss"],
})
export class Form4Component {
	readonly pageSize = 50;
	readonly columns: DataList["columns"] = [
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
		{ name: 'form4Submitted', isActionField: true },
		//{ name: 'form5Submitted', isActionField: true },
		{ name: 'form6Submitted', isActionField: true },
		//{ name: 'form4', isActionField: true },
		//{ name: 'form5', isActionField: true },
		//{ name: 'form6', isActionField: true },
	]

	readonly columnsToDisplay = this.columns.map((c) => c.name);
	dataSource = [];
	currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
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
		private form1Service: Form1Service,
		public dialog: MatDialog,
		private router: Router
	) { }

	ngAfterViewInit() {
		//this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

		// merge(this.sort.sortChange, this.paginator.page)
		// 	.pipe(
		// 		startWith({}),
		// 		switchMap(() => {
		// 			this.isLoadingResults = true;
		// 			return of([]);
		// 		}),
		// 		map((data) => {
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
		// 	.subscribe((data) => {
		// 		// this.dataSource = data;

		// 		this.changeDetectorRef.detectChanges();
		// 	});
	}

	ngOnInit() {
		this.getList();
	}
	getList() {
		let mon = moment().month() + 1;
		let day;
		let block_id, district_id, state_id;
		if (moment().date() >= 10) {
			day = moment().date();
		} else {
			day = "0" + moment().date();
		}
		if (this.currentUser.accessupto == "Block") {
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
			this.stateName = this.currentUser.user_state_id
				? this.currentUser.user_state_id.statename
				: undefined;
			state_id = this.currentUser.user_state_id
				? this.currentUser.user_state_id
				: undefined;
		} else {
			this.stateName = "All States";
		}
		this.fromDate = moment(this.projectToDate).format("DD-MM-YYYY");
		this.toDate = day + "-" + mon + "-" + moment().year();

		// let where = {
		// 	'general_information.state.statecode': state_id ? state_id.statecode : undefined,
		// 	'general_information.district.districtcode': district_id ? district_id.districtcode : undefined,
		// 	'general_information.block.subdistrictcode': block_id ? block_id.subdistrictcode : undefined,
		// 	updatedAt: {
		// 		between: [
		// 			moment().year() + "-" + mon + "-01",
		// 			moment().year() +
		// 			"-" +
		// 			mon +
		// 			"-" +
		// 			(+day + 1).toString().padStart(2, "0"),
		// 		],
		// 	},
		// };

		let where = {
			"place_of_death": { inq: ["Health Facility"] },
			"state_id.statecode": state_id ? state_id.statecode : undefined,
			"district_id.districtcode": district_id ? district_id.districtcode : undefined,
			"block_id.subdistrictcode": block_id ? block_id.subdistrictcode : undefined,
			//"updatedAt": { between: [moment().year() + "-04-01", moment().year() + "-" + mon + "-" + (+day + 1).toString().padStart(2, "0")] },
			"updatedAt": { between: [moment(this.projectToDate), moment().add(1, 'day').format('YYYY-MM-DD')] },

			"is_maternal_death": true

		} as any;

		this.form1Service.count(where).subscribe(({ count }) => {
			this.totalRecords = count;
		});

		this.form1Service
			.getList({
				//	skip: this.paginator.pageIndex * this.pageSize,
				//	limit: this.pageSize,
				where: where as any,
				include: ["mdsrForm4s", "mdsrForm5s"],
			})
			// .pipe(
			// 	map(data => {
			// 		return this.form4Service.canEdit(data, this.currentUser);
			// 	})
			// )
			.subscribe((response) => {
				this.dataSource = response;
				this.changeDetectorRef.detectChanges();
			});
	}
	showFilters(): void {
		const dialogRef = this.dialog.open(FormFilterComponent, {
			width: "80%",
			height: "40%",
			data: "",
			panelClass: ["filterPopup"],
			hasBackdrop: true,
			disableClose: false,
		});
		dialogRef.afterClosed().subscribe((res) => {
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
				let where = {
					"place_of_death": { inq: ["Health Facility"] },
					"state_id.statecode": res.data.state_id
						? res.data.state_id.statecode
						: undefined,
					"district_id.districtcode": res.data.district_id
						? res.data.district_id.districtcode
						: undefined,
					"block_id.subdistrictcode": res.data.block_id
						? res.data.block_id.subdistrictcode
						: undefined,
					"is_maternal_death": true,
					updatedAt: {
						between: [
							moment(res.data.from_date).format("YYYY-MM-DD"),
							moment(res.data.to_date).add(1, "day").format("YYYY-MM-DD"),
						],
					} as any,
				} as any;


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

				this.form1Service.count(where).subscribe(({ count }) => {
					this.totalRecords = count;
				});

				// merge(this.sort.sortChange, this.paginator.page)
				// 	.pipe(
				// 		startWith({}),
				// 		switchMap(() => {
				// 			this.isLoadingResults = true;
				// 			return this.form4Service.getList({
				// 				//	skip: this.paginator.pageIndex * this.pageSize,
				// 				//	limit: this.pageSize,
				// 				where: where,
				// 				include: { relation: "mdsrForm1" } as any,
				// 			});

				// 			// (this.sort.active, this.sort.direction, this.paginator.pageIndex);
				// 		}),
				// 		map((data) => {
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
				// 	.subscribe((data) => {
				// 		this.dataSource = data as any[];

				// 		this.changeDetectorRef.detectChanges();
				// 	});
			}

			//this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
			//	this.loadRolesList();
		});
	}

	editForm(data: any) {
		const { id, form } = data;
		this.router.navigateByUrl(`/mdsr/${form}/${id}`)
	}

	addForm(data: any) {
		const { row, form } = data;
		localStorage.removeItem("data");
		localStorage.setItem("data", JSON.stringify(row));
		this.router.navigateByUrl(`/mdsr/${form}/add`, { state: { row } })
	}
}
