import { Form1Service } from './../../../../services/mdsr/form1.service';
import { Router } from '@angular/router';
import { Form4Service } from './../../../../services/mdsr/form4.service';
import {
	Component,
	OnInit,
	ChangeDetectorRef,
	ViewChild
} from '@angular/core';
import { catchError, map, switchMap, startWith } from 'rxjs/operators';
import { of, merge } from 'rxjs';
import { MatSort, MatPaginator, MatDialog } from '@angular/material';
import { DataList } from "../../../../models/views/data-list";
import * as objectPath from "object-path";
import { Form6Service } from '../../../../services/mdsr/form6.service';
import { FormFilterComponent } from '../filter/form-filter/form-filter.component';
import moment from 'moment';
import { UploadFileComponent } from '../upload/upload-file/upload-file.component';
import { FileLibraryService } from '../../../../services/upload/file-library.service';

@Component({
	selector: 'kt-form6',
	templateUrl: './form6.component.html',
	styleUrls: ['./form6.component.scss']
})
export class Form6Component implements OnInit, DataList {
	readonly pageSize = 50;
	// readonly columns: DataList["columns"] = [
	// 	{ name: "block", isActionField: true },
	// 	{ name: "Name of Deceased", isActionField: true },
	// 	{ name: "Husband Name", isActionField: true },
	// 	{ name: "Age", isActionField: true },
	// 	// { name: "MCTS", isActionField: true  },
	// 	// { name: "Place of death", isActionField: true  },
	// 	{ name: "Death Date Time", isActionField: true },
	// 	{ name: "action", isActionField: true },
	// 	{ name: "upload", isActionField: true }
	// ];
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
		{ name: 'form4_form5', isActionField: true },
		{ name: 'form6Submitted', isActionField: true }
		//{ name: 'form4', isActionField: true },
		//{ name: 'form5', isActionField: true },
		//{ name: 'form6', isActionField: true },
	]
	currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
	projectToDate = sessionStorage.getItem("ptd");
	readonly columnsToDisplay = this.columns.map(c => c.name);
	dataSource = [];

	readonly objectPath = objectPath;
	stateName = "";
	districtName = "";
	blockName = "";
	fromDate;
	ImageForDownload;
	toDate
	totalRecords = 0;
	isLoadingResults = true;
	isMaxLimitReached = false;

	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: false }) sort: MatSort;

	constructor(private changeDetectorRef: ChangeDetectorRef, private form1Service: Form1Service, private form4Service: Form4Service,
		public dialog: MatDialog, private fileLibrary: FileLibraryService, private router: Router
	) { }

	ngAfterViewInit() {
		//this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.getList();
	}
	toDateAddOneDay: any;
	place_of_death: any;
	getList() {
		let mon = moment().month() + 1;
		let day: any;
		let block_id: number, district_id: number, state_id: number;
		if (moment().date() > 10) {
			day = moment().date();
		} else {
			day = "0" + moment().date();
		}
		if (this.currentUser.accessupto == "Block") {
			this.blockName = this.currentUser.user_block_id.subdistrictname;
			this.stateName = this.currentUser.user_state_id.statename;
			this.districtName = this.currentUser.user_district_id.districtname;
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
		this.toDateAddOneDay = moment().year() + "-" + mon + "-" + day
		let where = {
			"place_of_death": this.place_of_death,
			"state_id.statecode": state_id ? state_id : undefined,
			"district_id.districtcode": district_id
				? district_id
				: undefined,
			"block_id.subdistrictcode": block_id ? block_id : undefined,
			"is_maternal_death": true,
			"updatedAt": { between: [moment(this.projectToDate), moment(this.toDateAddOneDay).add(2, 'days')] } as any
		} as any;


		this.form1Service.getList({
			where,
			include: ["mdsrForm4s", "mdsrForm5s", "mdsrForm6s"]
		}).subscribe(data => {
			this.dataSource = data;
			this.changeDetectorRef.detectChanges();
		})
		this.getTableFooterCount(where)
		// merge(this.sort.sortChange, this.paginator.page)
		// 	.pipe(
		// 		startWith({}),
		// 		switchMap(() => {
		// 			this.isLoadingResults = true;
		// 			let relations = [{
		// 				relation: 'mdsrForm1'
		// 			}, {
		// 				relation: 'fileLibrary'
		// 			}]
		// 			return this.form6Service.getList({
		// 				where: where,
		// 				include: relations,
		// 				skip: this.paginator.pageIndex * this.pageSize,
		// 				limit: this.pageSize,
		// 			});

		// 		}),
		// 		map(data => {
		// 			// Flip flag to show that loading has finished.
		// 			this.isLoadingResults = false;
		// 			this.isMaxLimitReached = false;
		// 			// this.resultsLength = data.total_count;
		// 			return this.form4Service.canEdit(data,this.currentUser);
		// 		}),
		// 		catchError(() => {
		// 			this.isLoadingResults = false;
		// 			// Catch if the GitHub API has reached its rate limit. Return empty data.
		// 			this.isMaxLimitReached = true;
		// 			return of([]);
		// 		})
		// 	)
		// 	.subscribe(data => {
		// 		console.log(data)
		// 		this.dataSource = data;

		// 		this.changeDetectorRef.detectChanges();
		// 	});
	}

	ngOnInit() {
		this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'))
		if (this.currentUser.designation == "Facility" || this.currentUser.designation == "FNO") {
			this.place_of_death = { inq: ["Health Facility"] }
		} else {
			this.place_of_death = { inq: ["Home", "Transit", "Other", "Health Facility"] }
		}
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
				this.stateName = res.data.state_id ? res.data.state_id.statename : 'All';
				this.districtName = res.data.district_id ? res.data.district_id.districtname : 'All';
				this.blockName = res.data.block_id ? res.data.block_id.subdistrictname : 'All';
				this.fromDate = moment(res.data.from_date).format('DD-MM-YYYY');
				this.toDate = moment(res.data.to_date).format('DD-MM-YYYY');
				let where = {
					"place_of_death": this.place_of_death,
					"state_id.statecode": res.data.state_id ? res.data.state_id.statecode : undefined,
					"district_id.districtcode": res.data.district_id
						? res.data.district_id.districtcode
						: undefined,
					"block_id.subdistrictcode": res.data.block_id ? res.data.block_id.subdistrictcode : undefined,
					"updatedAt": { between: [moment(res.data.from_date).format('YYYY-MM-DD'), moment(res.data.to_date).format('YYYY-MM-DD')] } as any
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
				// 			let relations = [{
				// 				relation: 'mdsrForm1'
				// 			}, {
				// 				relation: 'fileLibrary'
				// 			}]
				// 			return this.form6Service.getList({
				// 				where: where,
				// 				include: relations,
				// 				skip: this.paginator.pageIndex * this.pageSize,
				// 				limit: this.pageSize
				// 			});

				// 			// (this.sort.active, this.sort.direction, this.paginator.pageIndex);
				// 		}),
				// 		map(data => {
				// 			// Flip flag to show that loading has finished.
				// 			this.isLoadingResults = false;
				// 			this.isMaxLimitReached = false;
				// 			// this.resultsLength = data.total_count;
				// 			return this.form4Service.canEdit(data,this.currentUser);
				// 		}),
				// 		catchError(() => {
				// 			this.isLoadingResults = false;
				// 			// Catch if the GitHub API has reached its rate limit. Return empty data.
				// 			this.isMaxLimitReached = true;
				// 			return of([]);
				// 		})
				// 	)
				// 	.subscribe(data => {
				// 		this.dataSource = data;

				// 		this.changeDetectorRef.detectChanges();
				// 	});
			}

			//this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
			//	this.loadRolesList();
		});
	}
	showUploadFile(id) {
		const dialogRef = this.dialog.open(UploadFileComponent, {
			width: '50%',
			height: '50%',
			data: id,
			panelClass: ['filterPopup'],
			hasBackdrop: true,
			disableClose: false,

		});
		dialogRef.afterClosed().subscribe(res => {

			if (!res) {
				return;
			}
			this.getList();
		});
	}
	downloadFile(id) {
		//	window.open(window.location.origin + '/view/'+id);

		this.ImageForDownload = this.fileLibrary.downloadFile(id);
		//	window.open('view/',id)
		window.open(this.ImageForDownload, "Title but its not working", 'toolbar=yes, resizable=yes, scrollbars=yes, width=400, height=400, top=200 , left=500');
	}
	getTableFooterCount(where: any) {
		this.form1Service.count(where).subscribe(({ count }) => {
			this.totalRecords = count;
			this.changeDetectorRef.detectChanges();
		});
	}

	editForm(data: any) {
		const { id } = data;
		this.router.navigateByUrl(`/mdsr/form6/${id}`)
	}
	viewForm(id: string) {
		this.router.navigateByUrl(`/mdsr/form6/view/${id}`)
	}
	addForm(data) {
		const { row } = data;
		localStorage.removeItem("data");
		localStorage.setItem("data", JSON.stringify(row));
		this.router.navigateByUrl("/mdsr/form6/add", { state: { row } })
	}


}
