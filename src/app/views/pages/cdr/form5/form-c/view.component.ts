import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
// import { CdrForm4Service } from "../../../../../services/cdr/form4.service";
import { DataList } from "../../../../../models/views/data-list";
import { MatDialog, MatPaginator, MatSort } from "@angular/material";
import * as objectPath from "object-path";
import { merge, of } from "rxjs";
import { startWith, switchMap, map, catchError } from "rxjs/operators";
import { FormFilterComponent } from '../../../mdsr/filter/form-filter/form-filter.component';
import { CdrForm1Service } from "../../../../../services/cdr/form1.service";
import {getAllCDRDeathWhose3A3BOr4A4BDone } from "../../../../../utilities/functions";
import moment from "moment";
import * as XLSX from "xlsx";
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
		{ name: "lastWeight", isActionField: true },
		{ name: "immunization_status", isActionField: true },
		{ name: "date_of_birth", isActionField: true },
		{ name: "date_of_add", isActionField: true },
		{ name: "date_of_death", isActionField: true },
		{ name: "probableCauseOfDeath", isActionField: true },
		{ name: "finalCauseOfDeath", isActionField: true },
		{ name: "verbalAutopsy", isActionField: true },
		{ name: "nameOfTreated", isActionField: true },
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
		private changeDetectorRef: ChangeDetectorRef,
		private cdrForm1Service: CdrForm1Service,
		public dialog: MatDialog
	) { }

	ngAfterViewInit() {
		// this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.getList();
	}
	getList() {
		let where: Partial<any>;
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
						include: ['cdrForm4as', 'cdrForm4bs'],//relations,
						skip: this.paginator.pageIndex * this.pageSize,
						limit: this.pageSize,
					});
				}),
				map((data) => {
					// Flip flag to show that loading has finished.
					this.isLoadingResults = false;
					this.isMaxLimitReached = false;
					// this.resultsLength = data.total_count;

					const whose4AOr4BFilled = getAllCDRDeathWhose3A3BOr4A4BDone(data, 'cdrForm4as', "cdrForm4bs");

					return whose4AOr4BFilled;//cdrDeaths;
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
		this.tabularViewTitle = `Form 5C: Facility Level Reporting Form <small>${this.fromDate} - ${this.toDate}</small>`


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
				this.tabularViewTitle = `Form 5C: Facility Level Reporting Form <small>${this.fromDate} - ${this.toDate}</small>`

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
								include: ['cdrForm4as', 'cdrForm4bs'],//relations,
								skip: this.paginator.pageIndex * this.pageSize,
								limit: this.pageSize,
							});
						}),
						map((data) => {
							// Flip flag to show that loading has finished.
							this.isLoadingResults = false;
							this.isMaxLimitReached = false;
							// this.resultsLength = data.total_count;

							const whose4AOr4BFilled = getAllCDRDeathWhose3A3BOr4A4BDone(data, 'cdrForm4as', "cdrForm4bs");

							return whose4AOr4BFilled;//cdrDeaths;
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
		});
	}

	ExportTable() {
		let exportArray = [];
		this.dataSource.forEach(element => {
			let mctsId; let category; let lastWeight; let immunizationStatus; let dateOfAdmission; let treatDoctor; let autopsy = 'NO'; let probableCauseOfDeath; let finalDiagnosis;
			if (element['cdrForm4as'].length > 0) {
				mctsId = element['cdrForm4as'][0]['sectionA']['inpatient_number'] ? element['cdrForm4as'][0]['sectionA']['inpatient_number'] : '----';
				category = element['cdrForm4as'][0]['sectionA']['category'] ? element['cdrForm4as'][0]['sectionA']['category'] : '----';
				immunizationStatus = element['cdrForm4as'][0]['sectionA']['immunisation_history'] ? element['cdrForm4as'][0]['sectionA']['immunisation_history'] : '----';
				lastWeight = element['cdrForm4as'][0]['sectionA']['child_weight_at_birth'] ? element['cdrForm4as'][0]['sectionA']['child_weight_at_birth'] : '----';
				dateOfAdmission = element['cdrForm4as'][0]['sectionA']['date_of_admission'] ? element['cdrForm4as'][0]['sectionA']['date_of_admission'] : '----';
				autopsy = 'YES';
				treatDoctor = element['cdrForm4as'][0]['sectionA']['certified_by'] ? element['cdrForm4as'][0]['sectionA']['certified_by'] : '----';
				element['cdrForm4as'][0]['sectionF']['probable_direct_cause_of_death'].forEach(element => {
					probableCauseOfDeath = probableCauseOfDeath + ', ' + element.disease_name
				});
				element['cdrForm4as'][0]['sectionF']['final_diagnosis'].forEach(element => {
					finalDiagnosis = finalDiagnosis + ', ' + element.disease_name
				});
			} else if (element['cdrForm4bs'].length > 0) {
				mctsId = element['cdrForm4bs'][0]['sectionA']['inpatient_number'] ? element['cdrForm4bs'][0]['sectionA']['inpatient_number'] : '----';
				category = element['cdrForm4bs'][0]['sectionA']['category'] ? element['cdrForm4bs'][0]['sectionA']['category'] : '----';
				lastWeight = element['cdrForm4bs'][0]['sectionA']['child_weight_at_birth'] ? element['cdrForm4bs'][0]['sectionA']['child_weight_at_birth'] : '----';
				immunizationStatus = element['cdrForm4bs'][0]['sectionA']['immunisation_history'] ? element['cdrForm4bs'][0]['sectionA']['immunisation_history'] : '----';
				dateOfAdmission = element['cdrForm4bs'][0]['sectionA']['date_of_admission'] ? element['cdrForm4bs'][0]['sectionA']['date_of_admission'] : '----';
				autopsy = 'YES';
				treatDoctor = element['cdrForm4bs'][0]['sectionA']['certified_by'] ? element['cdrForm4bs'][0]['sectionA']['certified_by'] : '----';
				element['cdrForm4bs'][0]['sectionE']['probable_direct_cause_of_death'].forEach(element => {
					probableCauseOfDeath = probableCauseOfDeath + ', ' + element.disease_name
				});
				element['cdrForm4bs'][0]['sectionE']['final_diagnosis'].forEach(element => {
					finalDiagnosis = finalDiagnosis + ', ' + element.disease_name
				});
			}
			exportArray.push({
				mctsId: mctsId,
				category: category,
				name: element.name,
				mother_name: element.mother_name,
				sex: element.sex,
				age: element.age,
				palce_of_death: element.palce_of_death ? element.palce_of_death : '----',
				lastWeight: lastWeight,
				immunizationStatus: immunizationStatus,
				dateOfAdmission: dateOfAdmission,
				date_of_death: element.date_of_death ? element.date_of_death : '----',
				probableCauseOfDeath: probableCauseOfDeath,
				finalDiagnosis: finalDiagnosis,
				autopsy: autopsy,
				treatDoctor: treatDoctor
			});
			console.log('exportArray', exportArray);
		});
		let dataToExport = exportArray.map((x) => ({
			"MCTS/RCH-ID": x.mctsId,
			"Category": x.category,
			"Name": x.name,
			"Mother Name": x.mother_name,
			"Sex": x.sex,
			"Age": x.age,
			"place_of_death": x.palce_of_death,
			"Birth weight (kg)": x.lastWeight,
			"Immunisation Status": x.immunizationStatus,
			"Date of Admission": x.dateOfAdmission,
			"Date of Death": x.date_of_death,
			"Probable Cause Of Death": x.probableCauseOfDeath,
			"Final Diagnosis": x.finalDiagnosis,
			"Facility Based CDR conducted": x.autopsy,
			"Name of the treating Doctor": x.treatDoctor
		}));
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "Block and district level line list.xlsx");
	}
}
