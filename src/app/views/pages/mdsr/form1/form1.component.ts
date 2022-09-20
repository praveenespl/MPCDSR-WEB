import { Component, OnInit, ChangeDetectorRef, ViewChild } from "@angular/core";
import { SubheaderService } from "../../../../core/_base/layout";
import { Form1Service } from "../../../../services/mdsr/form1.service";
import * as objectPath from "object-path";
import { MatPaginator, MatSort, MatDialog } from "@angular/material";
import { merge, of } from "rxjs";
import { startWith, switchMap, map, catchError } from "rxjs/operators";
import { DataList } from "../../../../models/views/data-list";
import moment from "moment";
import { FormFilterComponent } from "../filter/form-filter/form-filter.component";
// import { Form1Object } from "src/app/models/forms/mdsr/form1";
import { VerifyPopupComponent } from "./verify-popup/verify-popup.component";
import { AlertService } from "../../../../utilities/alert.service";
import { FileLibraryService } from "../../../../services/upload/file-library.service";
import { NavigationEnd, Router } from '@angular/router';
import { FormComponent } from '../form4/form/form.component';
import { filter } from 'rxjs/operators';

@Component({
	selector: "kt-form1",
	templateUrl: "./form1.component.html",
	styleUrls: ["./form1.component.scss"]
})
export class Form1Component implements OnInit, DataList {
	readonly pageSize = 50;
	readonly columns: DataList["columns"] = [
		{ name: "block", isActionField: true },
		{ name: "UID", key: "uuid" },
		{ name: "Deceased Woman Name", isActionField: true },
		{ name: "Age", key: "age" },
		//{ name: "Husband Name", key: "husband_name" },
		{ name: "Village", key: "village_id.villagename" },
		{ name: "Place of Death", key: "place_of_death" },
		{ name: "Death Date Time", isActionField: true },// key: "death_date_time" },
		{ name: "IsMaternal", isActionField: true },
		//{ name: "verify", isActionField: true },
		{ name: "action", isActionField: true },
		{ name: "form4Submitted", isActionField: true },
		{ name: "form5Submitted", isActionField: true },
		{ name: "form6Submitted", isActionField: true }
	];
	readonly columnsToDisplay = this.columns.map(c => c.name);
	dataSource = [];
	currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
	projectToDate: string = sessionStorage.getItem("ptd");

	readonly objectPath = objectPath;
	stateName = "";
	districtName = "";
	blockName = "";
	fromDate;
	toDate;
	totalRecords = 0;
	isLoadingResults = true;
	isMaxLimitReached = false;
	place_of_death: any;
	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: false }) sort: MatSort;
	@ViewChild(FormComponent, { static: false }) formComponent: FormComponent;
	isShowAddButton: boolean = false;
	constructor(
		private subheaderService: SubheaderService,
		private changeDetectorRef: ChangeDetectorRef,
		private form1Service: Form1Service,
		public dialog: MatDialog,
		private alertService: AlertService,
		private fileLibraryService: FileLibraryService,
		private router: Router
	) { }

	ngOnInit() {
		if (this.currentUser.designation == "BMO" || this.currentUser.designation == "ASHA" || this.currentUser.designation == "ANM") {
			this.place_of_death = { inq: ["Home", "Transit", "Other", "Health Facility"] }
		} else {
			this.columns.splice(4, 0, { name: "Husband Name", key: "husband_name" });
			this.columnsToDisplay.splice(4, 0, 'Husband Name');
			this.columnsToDisplay.splice(6, 1);
			this.columnsToDisplay.splice(this.columnsToDisplay.length - 2, 1)
			this.place_of_death = { inq: ["Health Facility"] }
		}
		this.isShowAddButton = this.router.url.includes('form1');

	}

	ngAfterViewInit() {
		//this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.getList();
	}
	getList() {
		let where: Partial<any>;
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

		where = {
			"place_of_death": this.place_of_death,
			"created_by" : this.currentUser.id,
			// "state_id.statecode": state_id ? state_id.statecode : undefined,
			// "district_id.districtcode": district_id
			// 	? district_id.districtcode
			// 	: undefined,
			// "block_id.subdistrictcode": block_id
			// 	? block_id.subdistrictcode
			// 	: undefined,
			updatedAt: { between: [moment(this.projectToDate), moment(new Date()).add('days', 1)] }
		};

		this.getTableFooterCount(where);
		this.form1Service.getList({
			where,
			include: ["fileLibrary", "mdsrForm4s", "mdsrForm5s", "mdsrForm6s"]
		}).subscribe(data => {
			this.dataSource = data;
			this.changeDetectorRef.detectChanges();
		});
		// merge(this.sort.sortChange, this.paginator.page)
		// 	.pipe(
		// 		startWith({}),
		// 		switchMap(() => {
		// 			this.isLoadingResults = true;
		// 			return this.form1Service.getList({
		// 				where: where,
		// 				skip: this.paginator.pageIndex * this.pageSize,
		// 				limit: this.pageSize,
		// 				include: [{ relation: "village" }, { relation: "fileLibrary" }, { relation: "mdsrForm4s" },{ relation: "mdsrForm5s" },{ relation: "mdsrForm6s" }]
		// 			});
		// 			// (this.sort.active, this.sort.direction, this.paginator.pageIndex);
				// 		}),
				// 		map(data => {
		// 			// Flip flag to show that loading has finished.
					// this.isLoadingResults = false;
					// this.isMaxLimitReached = false;
		// 			// this.resultsLength = data.total_count;

			// 		return data;
			// 	}),
			// 	catchError(() => {
			// 		this.isLoadingResults = false;
			// 		// Catch if the GitHub API has reached its rate limit. Return empty data.
			// 		this.isMaxLimitReached = true;
			// 		return of([]);
			// 	})
			// )
			// .subscribe(data => {
			// 	this.dataSource = data;
			// 	this.changeDetectorRef.detectChanges();
			// });
	}

	showFilters(): void {
		const dialogRef = this.dialog.open(FormFilterComponent, {
			width: "80%",
			height: "40%",
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
					"place_of_death": this.place_of_death,
					"created_by" : this.currentUser.id,
					// "state_id.statecode": res.data.state_id
					// 	? res.data.state_id.statecode
					// 	: undefined,
					// "district_id.districtcode": res.data.district_id
					// 	? res.data.district_id.districtcode
					// 	: undefined,
					// "block_id.subdistrictcode": res.data.block_id
					// 	? res.data.block_id.subdistrictcode
					// 	: undefined,
					updatedAt: {
						between: [
							moment(res.data.from_date).format("YYYY-MM-DD"),
							moment(res.data.to_date).add(1, 'days').format("YYYY-MM-DD")
						]
					} as any
				};

				this.getTableFooterCount(where);
				this.form1Service.getList({
					where: where,
					include: ["fileLibrary", "mdsrForm4s", "mdsrForm5s", "mdsrForm6s"],
					//skip: this.paginator.pageIndex * this.pageSize,
					//limit: this.pageSize
				}).subscribe(data => {
					this.dataSource = data as any[];
					this.changeDetectorRef.detectChanges();
				});
				// merge(this.sort.sortChange, this.paginator.page)
				// 	.pipe(
				// 		startWith({}),
				// 		switchMap(() => {
				// 			this.isLoadingResults = true;
				// 			let relations = [
				// 				{ relation: "village" },
				// 				{ relation: "fileLibrary" }
				// 			] as any[];
				// 			return this.form1Service.getList({
				// 				include: relations,
				// 				skip: this.paginator.pageIndex * this.pageSize,
				// 				limit: this.pageSize,
				// 				where: where
				// 			});

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

	verifyRecord(record) {
		const dialogRef = this.dialog.open(VerifyPopupComponent, {
			data: record,
			width: "500px"
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.alertService.fireAlert({
					icon: "success",
					text: "Verified successfully"
				});
			}
		});
	}

	downloadFile(id: string) {
		const file = this.fileLibraryService.downloadFile(id);
		window.open(
			file,
			"Title but its not working",
			"toolbar=yes, resizable=yes, scrollbars=yes, top=0 , left=0"
		);
	}
	addForm(data) {
		const { form, row } = data;
		const canSubmitForm = row.mdsrForm4s.length || row.mdsrForm5s.length;
		if (!canSubmitForm && form === 'form6') {
			this.alertService.fireAlert({
				title: "Permission Error",
				html: `<span style="font-size:1rem;font-weight:600;">To fill Form 6, please submit either Form 4 (Facility Form) or Form 5 (Community Form)</span>`,
				timer: 30000,
				showConfirmButton: true
			})
			return;
		}
		localStorage.removeItem("data");
		localStorage.setItem("data", JSON.stringify(row));
		this.router.navigateByUrl(`/mdsr/${form}/add`, { state: { row } })
	}
	editForm(data) {
		const { id, form } = data;
		console.log(`/mdsr/${form}/${id}`)
		this.router.navigateByUrl(`/mdsr/${form}/${id}`);
	}
	viewForm(id: string) {
		console.log("Id is --> ", id)
		console.log(`/mdsr/form1/view/${id}`);
		this.router.navigateByUrl(`/mdsr/form1/view/${id}`);
	}

	getToForm4(row) {
		this.router.navigateByUrl('/mdsr/form4', row.id);
		this.formComponent.selectedRecord = row.id;
		this.formComponent.fillFormDetails(row);
	}

	getToForm5(row) {
		this.router.navigateByUrl('/mdsr/form5', row.id);
		this.formComponent.selectedRecord = row.id;
		this.formComponent.fillFormDetails(row);
	}

	getToForm6(row) {
		this.router.navigateByUrl('/mdsr/form6', row.id);
		this.formComponent.selectedRecord = row.id;
		this.formComponent.fillFormDetails(row);
	}
}
