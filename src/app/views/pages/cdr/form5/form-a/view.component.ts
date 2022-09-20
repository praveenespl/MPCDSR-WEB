import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
// import { CdrForm4Service } from "../../../../../services/cdr/form4.service";
import { DataList } from "../../../../../models/views/data-list";
import { MatDialog, MatPaginator, MatSort } from "@angular/material";
import * as objectPath from "object-path";
import { merge, of } from "rxjs";
import { startWith, switchMap, map, catchError } from "rxjs/operators";
import { CdrForm1Service } from "../../../../../services/cdr/form1.service";
import { getAllCDRDeathBasedOnDays, getAllCDRDeathWhose3A3BOr4A4BDone } from "../../../../../utilities/functions";
import * as XLSX from "xlsx";
import { FormFilterComponent } from '../../../mdsr/filter/form-filter/form-filter.component';
import moment from "moment";
@Component({
	selector: "kt-view",
	templateUrl: "./view.component.html",
	styleUrls: ["./view.component.scss"],
})
export class ViewComponent implements OnInit {
	projectToDate: string = sessionStorage.getItem("ptd");
	pageSize: number;
	tabularViewTitle : string;
	columns: DataList["columns"] = [
		{ name: "District", key: "address.districtname" },
		{ name: "Sub-District", key: "address.subdistrictname" },
		{ name: "indicators", isActionField: true },
		{ name: "mcts", isActionField: true },
		{ name: "category", isActionField: true },
		{ name: "Name", key: "name" },
		{ name: "Mother name", key: "mother_name" },
		{ name: "Sex", key: "sex" },
		{ name: "Age", key: "age" },
		{ name: "Village", key: "address.villagename" },
		{ name: "Mobile", key: "mobile" },
		{ name: "phc", isActionField: true },
		{ name: "subcentre", isActionField: true },
		{ name: "placeOfBirth", isActionField: true },
		{ name: "lastWeight", isActionField: true },
		{ name: "immunization_status", isActionField: true },
		{ name: "date_of_birth", isActionField: true },
		{ name: "date_of_death", isActionField: true },
		{ name: "Place of Death", key: "palce_of_death" },
		{ name: "probableCauseOfDeath", isActionField: true },
		{ name: "levelOfDelay", isActionField: true },
		{ name: "firstBreifInvestigationCarried", isActionField: true },
		{ name: "verbalAutopsy", isActionField: true },
		{ name: "assignCauseOfDeath", isActionField: true },
		{ name: "date_of_notification", isActionField: true },
		{ name: "Primary Informant", key: "primary_informant_name" },
		// { name: "action", isActionField: true },
	];
	totalRecords: number;
	isLoadingResults: boolean = false;
	isMaxLimitReached: boolean;
	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: false }) sort: MatSort;
	columnsToDisplay: string[] = this.columns.map((c) => c.key || c.name);
	dataSource: any[];
	stateName = "";
	districtName = "";
	blockName = "";
	fromDate;
	toDate;
	readonly objectPath = objectPath;
	currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
	constructor(
		// private cdrForm4Service: CdrForm4Service,
		private cdrForm1Service: CdrForm1Service,
		private changeDetectorRef: ChangeDetectorRef,
		public dialog: MatDialog
	) { }

	ngAfterViewInit() {
		this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
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
						include: ['cdrForm2s', 'cdrForm3s', 'cdrForm3bs'],//relations,
						skip: this.paginator.pageIndex * this.pageSize,
						limit: this.pageSize,
					});
				}),
				map((data) => {
					// Flip flag to show that loading has finished.
					this.isLoadingResults = false;
					this.isMaxLimitReached = false;
					// this.resultsLength = data.total_count;

					const whose3AOr3BFilled = getAllCDRDeathWhose3A3BOr4A4BDone(data, 'cdrForm3s', "cdrForm3bs");

					return whose3AOr3BFilled;//cdrDeaths;
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
				console.log("this.dataSource", this.dataSource);
				this.totalRecords = data.length;
				this.changeDetectorRef.detectChanges();
			});
	}

	place_of_death: any;
	ngOnInit() {

		let mon = moment().month() + 1;
		let day;
		if (moment().date() >= 10) {
			day = moment().date();
		} else {
			day = "0" + moment().date();
		}
		this.fromDate = moment(this.projectToDate).format("DD-MM-YYYY");
		this.toDate = day+"-" + mon + "-" +moment().year();
		this.tabularViewTitle = `Form 5A: Block and district level line list <small>${this.fromDate} - ${this.toDate}</small>`

		if (this.currentUser.designation == "BMO" || this.currentUser.designation == "ASHA" || this.currentUser.designation == "ANM") {
			this.place_of_death = { inq: ["Home", "In transit", "Other"] }
		} else if (this.currentUser.designation == "Facility" || this.currentUser.designation == "FNO") {
			this.place_of_death = { inq: ["Health Facility", "Hospital"] }
		} else {
			this.place_of_death = { inq: ["Home", "In transit", "Other", "Health Facility", "Hospital"] }
		}
	}

	/** Show Filters code */
	showFilers() {
		const dialogRef = this.dialog.open(FormFilterComponent, {
			width: "80%",
			height: "50%",
			data: "",
			panelClass: ["filterPopup"],
			hasBackdrop: true,
			disableClose: false,
		});
		dialogRef.afterClosed().subscribe((res) => {
			let where: any;
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

				this.tabularViewTitle = `Form 5A: Block and district level line list <small>${this.fromDate} - ${this.toDate}</small>`


				where = {
					or: [{
					"palce_of_death": this.place_of_death,
					"address.statecode": res.data.state_id
						? res.data.state_id.statecode
						: undefined,
					"address.districtcode": res.data.district_id
						? res.data.district_id.districtcode
						: undefined,
					"address.subdistrictcode": res.data.block_id
						? res.data.block_id.subdistrictcode
						: undefined,
					updatedAt: {
						between: [
							moment(res.data.from_date).format("YYYY-MM-DD"),
							moment(res.data.to_date).add(1, 'days').format("YYYY-MM-DD"),
						],
					} as any,
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
								include: ['cdrForm2s', 'cdrForm3s', 'cdrForm3bs'],//relations,
								skip: this.paginator.pageIndex * this.pageSize,
								limit: this.pageSize,
							});
						}),
						map((data) => {
							// Flip flag to show that loading has finished.
							this.isLoadingResults = false;
							this.isMaxLimitReached = false;
							// this.resultsLength = data.total_count;

							const whose3AOr3BFilled = getAllCDRDeathWhose3A3BOr4A4BDone(data, 'cdrForm3s', "cdrForm3bs");

							return whose3AOr3BFilled;//cdrDeaths;
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
						console.log("this.dataSource---------", this.dataSource);
						this.totalRecords = data.length;
						this.changeDetectorRef.detectChanges();
					});
			}
		});
	}

	ExportTable() {
		let exportArray = []; let mctsId; let placeOfBirth; let autopsy = 'NO'; let causeOfDeath;
		this.dataSource.forEach(element => {
			if (element['cdrForm3s'].length > 0) {
				mctsId = element['cdrForm3s'][0]['basic']['mcts_number'] ? element['cdrForm3s'][0]['basic']['mcts_number'] : '----';
				placeOfBirth = element['cdrForm3s'][0]['sectionB']['place_of_birth'] ? element['cdrForm3s'][0]['sectionB']['place_of_birth'] : '----';
				autopsy = 'YES';
				element['cdrForm3s'][0]['sectionC']['cause_of_death'].forEach(element => {
					causeOfDeath = causeOfDeath + '/' + element.disease_name
				});
			} else if (element['cdrForm3bs'].length > 0) {
				mctsId = element['cdrForm3bs'][0]['basic']['mcts_number'] ? element['cdrForm3bs'][0]['basic']['mcts_number'] : '----';
				placeOfBirth = element['cdrForm3bs'][0]['sectionB']['place_of_birth'] ? element['cdrForm3s'][0]['sectionB']['place_of_birth'] : '----';
				autopsy = 'YES';
				element['cdrForm3bs'][0]['sectionC']['assigned_cause_of_death'].forEach(element => {
					causeOfDeath = causeOfDeath + '/' + element.disease_name
				});
			}
			exportArray.push({
				mctsId: mctsId,
				district : element.address.districtname ? element.address.districtname : '----',
				subDistrict : element.address.subdistrictname ? element.address.subdistrictname : '----',
				category: element['cdrForm2s'][0]['sectionA']['belongs_to'] ? element['cdrForm2s'][0]['sectionA']['belongs_to'] : '----',
				name: element.name,
				mother_name: element.mother_name,
				sex: element.sex,
				age: element['cdrForm2s'][0]['sectionA']['age'] ? element['cdrForm2s'][0]['sectionA']['age'] : '----',
				villagename: element.address.villagename ? element.address.villagename : '----',
				mobile: element.mobile ? element.mobile : '----',
				phc: element['cdrForm2s'][0]['sectionA']['phc_area_name'] ? element['cdrForm2s'][0]['sectionA']['phc_area_name'] : '----',
				subCenter: element['cdrForm2s'][0]['sectionA']['sub_center_name'] ? element['cdrForm2s'][0]['sectionA']['sub_center_name'] : '----',
				placeOfBirth: placeOfBirth,
				lastWeight: element['cdrForm2s'][0]['sectionA']['weight'] ? element['cdrForm2s'][0]['sectionA']['weight'] : '----',
				immunization_status: element['cdrForm2s'][0]['sectionA']['immunization_status'] ? element['cdrForm2s'][0]['sectionA']['immunization_status'] : '----',
				date_of_death: element.date_of_death ? element.date_of_death : '----',
				date_of_birth: element.date_of_birth ? element.date_of_birth : '----',
				palce_of_death: element.palce_of_death ? element.palce_of_death : '----',
				levelOfDelay: element['cdrForm2s'][0]['sectionD']['delay_at_home'] == true ? 'Home' : '' || element['cdrForm2s'][0]['sectionD']['delay_in_transportation'] == true ? 'In Transport' : '' || element['cdrForm2s'][0]['sectionD']['delay_at_facility'] == true ? 'Facility' : '',
				fbirDone: element['cdrForm2s'][0]['updatedAt'],
				autopsy: autopsy,
				causeOfDeath: causeOfDeath,
				notiDate: element['date_of_notification'],
				primaryInfo: element['primary_informant_name']
			});
			console.log('exportArray', exportArray);
		});
		let dataToExport = exportArray.map((x) => ({
			"MCTS ID": x.mctsId,
			"District" : x.district,
			"Sub-District" : x.subDistrict,
			"Category": x.category,
			"Name": x.name,
			"Mother Name": x.mother_name,
			"Sex": x.sex,
			"Age": x.age,
			"Village Name": x.villagename,
			"Mobile": x.mobile,
			"PHC": x.phc,
			"Sub-centre area": x.subCenter,
			"Place of Birth": x.placeOfBirth,
			"Last weight recorded in MCP card (forchildren < 3 years)": x.lastWeight,
			"Immunisation Status": x.immunization_status,
			"Date of Birth": x.date_of_birth,
			"Date of Death": x.date_of_death,
			"Place of Death": x.palce_of_death,
			"Level of delay": x.levelOfDelay,
			"Date on which First Brief Investigation carried out": x.fbirDone,
			"Case selected for Verbal Autopsy": x.autopsy,
			"Assigned Cause of death": x.causeOfDeath,
			"Date of Notification": x.notiDate,
			"Primary Informant": x.primaryInfo
		}));
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "Block and district level line list.xlsx");
	}
}
