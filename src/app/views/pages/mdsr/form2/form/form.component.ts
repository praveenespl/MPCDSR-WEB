import {
	Component,
	OnInit,
	ChangeDetectorRef,
	ViewChild,
	ViewChildren,
	QueryList,
	EventEmitter,
	AfterViewInit
} from "@angular/core";
import FormGeneratorConfig from "./form2-generator-config.json";
import FormConfig from "./form2-config.json";
import * as objectPath from "object-path";
import * as XLSX from "xlsx";

import { replaceStringWith } from "../../../../../utilities/decorators/replace-string-with";
import { localizationApiEndPoint } from "../../../../../utilities/api";
import {
	Form2ObjectExtended,
	Form2Object
} from "../../../../..//models/forms/mdsr/form2";
import { Form1Service } from "../../../../../services/mdsr/form1.service";
import {
	Form1Filter,
	Form1Object
} from "../../../../../models/forms/mdsr/form1";
import moment from "moment";
import { FormioComponent } from "angular-formio";
import { Form2Service } from "../../../../../services/mdsr/form2.service";
import { MatPaginator, MatSort } from "@angular/material";
import { DataList } from "../../../../../models/views/data-list";
import { FormGroup, FormBuilder } from "@angular/forms";
import { merge, of } from "rxjs";
import { startWith, switchMap, map, catchError } from "rxjs/operators";
import { AlertService } from "../../../../../utilities/alert.service";
import { ActivatedRoute } from "@angular/router";
import { NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";
import { collapsed } from "../../../../../utilities/animations/collapsed.animation";
import { Form4Service } from '../../../../../services/mdsr/form4.service.js';
import { Form5Service } from '../../../../../services/mdsr/form5.service.js';
import { Location } from '@angular/common';
let stateDisabledStatus: boolean = false;
let districtDisabledStatus: boolean = false;
let blockDisabledStatus: boolean = false;
@Component({
	selector: "kt-form",
	templateUrl: "./form.component.html",
	styleUrls: ["./form.component.scss"],
	animations: [collapsed]
})
export class FormComponent implements OnInit, AfterViewInit {

	@replaceStringWith({ string: ["{{url}}", "{{stateDisabled}}", "{{districtDisabled}}", "{{blockDisabled}}"], replaceWith: [localizationApiEndPoint, stateDisabledStatus, districtDisabledStatus, blockDisabledStatus], accessUpto: JSON.parse(sessionStorage.getItem("currentUser")) ? [JSON.parse(sessionStorage.getItem("currentUser")).accessupto] : [""] })

	filterForm: Object = FormGeneratorConfig;
	@replaceStringWith({ string: ["{{url}}", "{{stateDisabled}}", "{{districtDisabled}}", "{{blockDisabled}}"], replaceWith: [localizationApiEndPoint, stateDisabledStatus, districtDisabledStatus, blockDisabledStatus], accessUpto: JSON.parse(sessionStorage.getItem("currentUser")) ? [JSON.parse(sessionStorage.getItem("currentUser")).accessupto] : [""] })

	form: Object = FormConfig;

	records: { submission: Form2ObjectExtended; data: Form1Object }[] = [];

	@ViewChild("filterFormRef", { static: true })
	filterFormRef: FormioComponent;
	@ViewChildren("recordFormRef") recordFormRef: QueryList<FormioComponent>;

	refreshForm = new EventEmitter();

	readonly pageSize = 50;
	expandedElement: any;
	form2Submitted: boolean = false;
	mdsrForm2FormGroup: FormGroup;
	mdsrForm2Object: Form2Object;
	today: Date = new Date();
	buttonText: string = "Save";

	projectToDate: string;

	readonly columns: DataList["columns"] = [
		// { name: "Village", key:"village.villagename" },
		{ name: "Name of Deceased", isActionField: true },
		// { name: "Father", key: "husband_name" },
		{ name: "Husband", key: "husband_name" },
		// { name: "DOB", isActionField: true },
		{ name: "Age", isActionField: true },
		// { name: "MCTS", key: "mcts_id" },
		// { name: "Mobile", key: "mobile" },
		{ name: "Death Date Time", isActionField: true },
		{ name: "Place Of Death", key: "place_of_death" },
		{ name: "When Death Occured", key: "when_death_occur" },
		{ name: "isMaternal", isActionField: true },
		// { name: "Cause of Death", isActionField: true },
		{ name: "Primary Informant", key: "reporting_person" },
		{ name: "Designation", key: "designation" },
		// { name: "Reported Date", isActionField: true },
		{ name: "Submitted", isActionField: true }
		// { name: "action", isActionField: true }
	];
	readonly columnsToDisplay = this.columns.map(c => c.name);
	dataSource = [];
	isShowFilter: boolean = false;
	readonly objectPath = objectPath;

	totalRecords = 0;
	isLoadingResults = false;
	isMaxLimitReached = false;

	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: false }) sort: MatSort;

	currentUser: any;

	isShowForm: boolean;
	place_of_death: any;
	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private form1Service: Form1Service,
		private form2Service: Form2Service,
		private form4Service: Form4Service,
		private form5Service: Form5Service,
		private fb: FormBuilder,
		private alertService: AlertService,
		private activatedRoute: ActivatedRoute,
		private ngbDateParserFormatter: NgbDateParserFormatter,
		private _location: Location
	) { }
	filterData: any;
	fromDate: moment.Moment = null;
	toDate: moment.Moment = null;
	title: string = '';
	filterChange({ data, isValid }) {
		this.filterData = {
			data: data,
			isValid: isValid
		}
		if (data && isValid) {
			let where: Partial<any>;
			where = {
				"place_of_death": this.place_of_death,
				"state_id.statecode": data.stateid ? data.stateid.statecode : undefined,
				"district_id.districtcode": data.districtid ? data.districtid.districtcode : undefined,
				"block_id.subdistrictcode": data.blockid ? data.blockid.subdistrictcode : undefined,
				updatedAt: { between: [moment(data.fromDate), moment(data.todDate)] } as any
			};
			this.fromDate = moment(data.fromDate);
			this.toDate = moment(data.toDate);
			this.title = `Form 2: Block Level MDR Register for All Women’s Death (15-49 Years) - <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`
			this.isLoadingResults = true;

			this.sort.sortChange.subscribe(
				() => (this.paginator.pageIndex = 0)
			);
			this.getTableFooterCount(where);
			merge(this.sort.sortChange, this.paginator.page)
				.pipe(
					startWith({}),
					switchMap(() => {
						this.isLoadingResults = true;
						let relations: any = [
							{
								relation: "mdsrForm2s"
							}
						];
						return this.form1Service.getList({
							where: where,
							include: relations,
							skip: this.paginator.pageIndex * this.pageSize,
							limit: this.pageSize
						});
						// (this.sort.active, this.sort.direction, this.paginator.pageIndex);
					}),
					map(data => {
						// Flip flag to show that loading has finished.
						this.isLoadingResults = false;
						this.isMaxLimitReached = false;
						return data;
					}),
					catchError(() => {
						this.isLoadingResults = false;
						// Catch if the GitHub API has reached its rate limit. Return empty data.
						this.isMaxLimitReached = true;
						return of([]);
					})
				)
				.subscribe(data => {
					this.dataSource = data;
					this.changeDetectorRef.detectChanges();
				});
		} else {
			this.records = [];
		}
	}

	private add(data: Form2Object[]) {
		this.form2Service.add(data).subscribe(response => {
			this.alertService.fireAlert({
				icon: "success",
				title: "Data Submitted Successfully"
			});
		});
	}

	ngOnInit() {
		this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
		this.projectToDate = sessionStorage.getItem("ptd");
		if (this.currentUser.designation == "BMO" || this.currentUser.designation == "ASHA" || this.currentUser.designation == "ANM") {
			this.place_of_death = { inq: ["Home", "Transit", "Other"] }
		} else if (this.currentUser.designation == "Facility" || this.currentUser.designation == "FNO") {
			this.place_of_death = { inq: ["Health Facility"] }
		} else {
			this.place_of_death = { inq: ["Home", "Transit", "Other", "Health Facility"] }
		}
		this.activatedRoute.params.subscribe(({ id }) => {
			if (id) {
				this.isShowForm = false;
				this.form1Service
					.getOne(id, {
						include: [
							{
								relation: "mdsrForm2s"
							}
						]
					})
					.subscribe(data => {
						this.dataSource = [data];
						this.expendRow(data);
						this.changeDetectorRef.detectChanges();
					});
			} else {
				this.isShowForm = true;

				const data = {
					stateid:
						this.currentUser && (this.currentUser.accessupto === "Block" || this.currentUser.accessupto === "District" || this.currentUser.accessupto === "State")
							? this.currentUser.user_state_id
							: null,
					districtid:
						this.currentUser && (this.currentUser.accessupto === "Block" || this.currentUser.accessupto === "District")
							? this.currentUser.user_district_id
							: null,
					blockid:
						this.currentUser && this.currentUser.accessupto === "Block"
							? {
								"subdistrictcode": this.currentUser.user_block_id.subdistrictcode,
								"subdistrictname": this.currentUser.user_block_id.subdistrictname
							} as Block
							: null,
					fromDate: moment(this.projectToDate),
					toDate: moment()
				};
				this.title = `Form 2: Block Level MDR Register for All Women’s Death (15-49 Years) - <small>${data.fromDate} - ${data.toDate.format('DD-MM-YYYY')}</small>`;
				setTimeout(() => {
					this.refreshForm.emit({
						form: this.filterForm,
						submission: {
							data
						}
					});
				}, 1000);
			}
		});
	}

	ngAfterViewInit(): void {
		setTimeout(() => {
			this.changeDetectorRef.detectChanges();
		}, 1000);

		document.querySelectorAll("formio-loader").forEach(el => {
			el.parentElement.remove();
		});
	}

	expendRow(selectedRow) {
		if (this.expandedElement !== selectedRow) {
			this.expandedElement = selectedRow;
			let reason = "";
			let action_taken = "";
			//let field_investigation_date=null;
			this.getMdsrForm2(this.expandedElement);

			this.mdsrForm2FormGroup = this.fb.group({
				id: [null],
				reason: [reason],
				action_taken: [action_taken],
				state_id: [this.expandedElement.state_id],
				district_id: [this.expandedElement.district_id],
				block_id: [this.expandedElement.block_id],
				village_id: [this.expandedElement.village_id],
				deceased_women_id: [this.expandedElement.id],
				month: [parseInt(moment().format("MM"))],
				year: [parseInt(moment().format("YYYY"))],
				field_investigation_date: [new Date()]
			});
		}
	}

	private updtate(data: Form2Object) {
		this.form2Service.update(data).subscribe(response => {
			this.alertService.fireAlert({
				icon: "success",
				title: "Data Updated Successfully"
			});
		});
	}

	private getMdsrForm2(params: object) {
		this.form2Service
			.getList({
				where: {
					deceased_women_id: params["id"]
				}
			})
			.subscribe(res => {
				if (res.length > 0) {
					this.mdsrForm2Object = res[0];
					// let month = moment(
					// 	this.mdsrForm2Object.field_investigation_date
					// ).format("MM");
					// let day = moment(
					// 	this.mdsrForm2Object.field_investigation_date
					// ).format("DD");
					// let year = moment(
					// 	this.mdsrForm2Object.field_investigation_date
					// ).format("YYYY");

					// let field_investigation_date = {
					// 	year: parseInt(year),
					// 	month: parseInt(month),
					// 	day: parseInt(day)
					// };
					//console.log('field_investigation_date',field_investigation_date);
					this.mdsrForm2FormGroup.patchValue({
						reason: this.mdsrForm2Object.reason,
						action_taken: this.mdsrForm2Object.action_taken,
						field_investigation_date: this.mdsrForm2Object.field_investigation_date,
						id: this.mdsrForm2Object.id
					});
					this.buttonText = "Update";
				} else {
					//getting field investigation date
					//if form 4 existng for deceased women id then get createdAt date of the form 4
					//else get the field investigate date from the form 5
					this.getFieldInvestigateDate(params["id"]);
					this.buttonText = "Save";
				}
				this.changeDetectorRef.detectChanges();
			});
	}
	getFieldInvestigateDate(id) {
		this.form4Service.getList({
			where: {
				"deceased_women_id": id
			},
			fields: {
				createdAt: true
			}
		}).subscribe(form4Res => {
			if (form4Res.length > 0) {
				let date = moment(form4Res[0].createdAt).format("YYYY-MM-DD");

				this.mdsrForm2FormGroup.patchValue({
					field_investigation_date: {
						"year": parseInt(date.split("-")[0]),
						"month": parseInt(date.split("-")[1]),
						"day": parseInt(date.split("-")[2])
					}
				})
			} else {
				this.form5Service.getList({
					where: {
						"deceased_women_id": id
					},
					fields: {
						"generalinformation": true
					}
				}).subscribe(form5Res => {
					if (form5Res.length > 0) {
						let date = moment(form5Res[0].generalinformation.investigation_date).format("YYYY-MM-DD");

						this.mdsrForm2FormGroup.patchValue({
							field_investigation_date: {
								"year": parseInt(date.split("-")[0]),
								"month": parseInt(date.split("-")[1]),
								"day": parseInt(date.split("-")[2])
							}
						})
					}

					this.changeDetectorRef.detectChanges();
				})
			}
		})
	}
	saveAndUpdateMdsrForm2() {
		//converting NgbDate Object to iso Date
		let ngbDate = this.mdsrForm2FormGroup.controls[
			"field_investigation_date"
		].value;
		let myDate = new Date(ngbDate); // e.g. myDate = 2017-01-01
		this.mdsrForm2FormGroup.patchValue({
			field_investigation_date: myDate
		});
		if (this.mdsrForm2FormGroup.value.id) {
			this.updtate(this.mdsrForm2FormGroup.value);
		} else {
			this.add(this.mdsrForm2FormGroup.value);
			this.filterChange(this.filterData)
		}
		this.expandedElement = null;
		this.changeDetectorRef.detectChanges();
	}

	getTableFooterCount(where: any) {
		this.form1Service.count(where).subscribe(({ count }) => {
			this.totalRecords = count;
			this.changeDetectorRef.detectChanges();
		});
	}

	backClicked() {
		this._location.back();
	}

	exportToExcel() {
		console.log(this.dataSource)
		let dataToExport = this.dataSource.map((x) => ({
			"Block": x.block_id.subdistrictname,
			"Deceased Women Name": x.getName,
			"Age": x.getAge,
			"Date of Death": moment(x.death_date_time).format('DD-MM-YYYY'),
			"Address": x.deceased_women_current_address,
			"Husband Name": x.husband_name,
			"Cause of Death": x.is_maternal_death ? 'Maternal' : 'Non-Maternal',
			"Primary Informant": x.reporting_person,
			"Designation": x.designation,
			"Investigation Date": x.mdsrForm2s && x.mdsrForm2s[0] ? x.mdsrForm2s[0].getFieldInvestigationDate : '',
			"Reason": x.mdsrForm2s && x.mdsrForm2s[0] ? x.mdsrForm2s[0].reason : '',
			"Action Taken": x.mdsrForm2s && x.mdsrForm2s[0] ? x.mdsrForm2s[0].action_taken : ''
		}));
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "Block Level MDR Register for All Women’s Death(15-49 years).xlsx");
	}
}
