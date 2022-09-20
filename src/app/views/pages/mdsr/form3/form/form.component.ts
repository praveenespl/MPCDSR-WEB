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
import FormFilter from "./form3-filter.json";
import FormConfig from "./form3-config.json";
import * as objectPath from "object-path";
import * as XLSX from "xlsx";

import { replaceStringWith } from "../../../../../utilities/decorators/replace-string-with";
import { apiEndPoint, localizationApiEndPoint } from "../../../../../utilities/api";
import { Form1Filter } from "../../../../../models/forms/mdsr/form1.js";
import { Form1Service } from "../../../../../services/mdsr/form1.service.js";
import { Form3Service } from "../../../../../services/mdsr/form3.service.js";
import { Form4Service } from '../../../../../services/mdsr/form4.service.js';
import { Form5Service } from "../../../../../services/mdsr/form5.service.js";
import {
	Form3ObjectExtended,
	Form3Object
} from "../../../../../models/forms/mdsr/form3.js";
import moment from "moment";
import { FormioComponent } from "angular-formio";
import { DataList } from "../../../../../models/views/data-list.js";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatPaginator, MatSort } from "@angular/material";
import { merge, of } from "rxjs";
import { startWith, switchMap, map, catchError } from "rxjs/operators";
import { NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";
import { AlertService } from "../../../../../utilities/alert.service.js";
import { ActivatedRoute } from "@angular/router";
import { collapsed } from "../../../../../utilities/animations/collapsed.animation";
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

	//	@replaceStringWith({ string: "{{url}}", replaceWith: localizationApiEndPoint,accessUpto: "Block" })
	formFilter: Object = FormFilter;
	@replaceStringWith({ string: ["{{url}}", "{{stateDisabled}}", "{{districtDisabled}}", "{{blockDisabled}}"], replaceWith: [apiEndPoint, stateDisabledStatus, districtDisabledStatus, blockDisabledStatus], accessUpto: JSON.parse(sessionStorage.getItem("currentUser")) ? [JSON.parse(sessionStorage.getItem("currentUser")).accessupto] : [""] })

	//@replaceStringWith({ string: "{{url}}", replaceWith: apiEndPoint,accessUpto: "Block" })
	form: Object = FormConfig;

	@ViewChild("filterFormRef", { static: true })
	filterFormRef: FormioComponent;
	@ViewChildren("recordFormRef") recordFormRef: QueryList<FormioComponent>;

	records: { submission: Form3ObjectExtended }[] = [];

	refreshForm = new EventEmitter();

	readonly pageSize = 50;
	expandedElement: any;
	form2Submitted: boolean = false;
	mdsrForm3FormGroup: FormGroup;
	mdsrForm3Object: Form3Object;
	today: Date = new Date();
	buttonText: string = "Save";
	readonly columns: DataList["columns"] = [
		{ name: "Name of Deceased", isActionField: true },
		{ name: "Husband", key: "husband_name" },
		{ name: "Age", isActionField: true, width: "70px" },
		{ name: "Death Date Time", isActionField: true },
		{ name: "Place Of Death", key: "place_of_death" },
		{ name: "When Death Occured", key: "when_death_occur" },
		{ name: "Primary Informant", key: "reporting_person" },
		{ name: "Designation", key: "designation" },
		{ name: "Submitted", isActionField: true }
	];

	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: false }) sort: MatSort;

	readonly columnsToDisplay = this.columns.map(c => c.name);
	dataSource = [];

	readonly objectPath = objectPath;

	totalRecords = 0;
	isLoadingResults = false;
	isMaxLimitReached = false;
	mdr_type: string = "";
	mdrTypeValue: any;
	facilityCommunityDisabled: boolean = false;
	user;
	title: string = '';
	fromDate: moment.Moment = null;
	toDate: moment.Moment = null;
	projectToDate: string;
	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private form1Service: Form1Service,
		private form3Service: Form3Service,
		private form5Service: Form5Service,
		private form4Service: Form4Service,
		private fb: FormBuilder,
		private ngbDateParserFormatter: NgbDateParserFormatter,
		private alertService: AlertService,
		private activatedRoute: ActivatedRoute,
		private _location: Location
	) { }
	isEditing: boolean = false;
	filterData: any;
	isshowForm: boolean;
	place_of_death: any;
	facilityId: any;
	filterChange({ data, isValid }) {
		if (!this.isEditing) {
			this.filterData = {
				data: data,
				isValid: isValid
			}

			if (data && isValid) {
				if (data.hasOwnProperty("facility")) {
					this.facilityId = data.facility.health_facility_primary_key_id;
				} else {
					this.facilityId = undefined;
				}
				const { fromDate, toDate } = data;
				let where: Partial<Form1Filter> & { [key: string]: any } = {
					"place_of_death": this.place_of_death,
					"state_id.statecode": data.state.statecode,
					"district_id.districtcode": data.district.districtcode,
					is_maternal_death: true,
					"block_id.subdistrictcode": data.mdrtype === 'community' || data.mdrtype === 'facility' ? data.block.subdistrictcode : undefined,
					"facility_id.health_facility_primary_key_id": data.mdrtype === 'facility' ? this.facilityId : undefined
				};
				if (fromDate && toDate) {
					this.fromDate = moment(data.fromDate);
					this.toDate = moment(data.toDate);
					this.title = `Form 3: MDR Line Listing Form for All Cases of Maternal Death Data (15-49 Years) - <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`
					where['updatedAt'] = { between: [this.fromDate, this.toDate] } as any;


					let whereNew = where as any;
					this.mdr_type = data.mdrtype;
					this.isLoadingResults = true;
					this.form1Service.count(whereNew).subscribe(({ count }) => {
						this.totalRecords = count;
					});
					this.sort.sortChange.subscribe(
						() => (this.paginator.pageIndex = 0)
					);
					merge(this.sort.sortChange, this.paginator.page)
						.pipe(
							startWith({}),
							switchMap(() => {
								this.isLoadingResults = true;
								let relations: any = [
									{
										relation: "mdsrForm3s"
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
								//console.log(data);
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
							if (data.length > 0) {
								this.dataSource = data;
							} else {
								this.dataSource = [];
								this.alertService.fireAlert({
									icon: "info",
									title: "Data not available"
								})
							}
							this.changeDetectorRef.detectChanges();
						});
				}
			}
		}
	}

	private add(data: Form3Object[]) {
		this.form3Service.add(data).subscribe(response => {
			this.alertService.fireAlert({
				icon: "success",
				title: "Data Submitted Successfully"
			});
		});
	}

	private updtate(data: Form3Object) {
		this.form3Service.update(data).subscribe(response => {
			this.alertService.fireAlert({
				icon: "success",
				title: "Data Updated Successfully"
			});
		});
	}

	ngOnInit() {
		this.user = JSON.parse(sessionStorage.getItem("currentUser"));
		this.projectToDate = sessionStorage.getItem("ptd");
		if (this.user.designation == "BMO" || this.user.designation == "ASHA" || this.user.designation == "ANM") {
			this.place_of_death = { inq: ["Home", "Transit", "Other"] }
			this.mdrTypeValue = "community";
			this.facilityCommunityDisabled = true;
		} else if (this.user.designation == "Facility" || this.user.designation == "FNO") {
			this.place_of_death = { inq: ["Health Facility"] }
			this.mdrTypeValue = "facility";
			this.facilityCommunityDisabled = true;
		} else {
			this.place_of_death = { inq: ["Home", "Transit", "Other", "Health Facility"] }
			this.mdrTypeValue = undefined;
			this.facilityCommunityDisabled = false;
		}
		this.fromDate = moment(this.projectToDate);
		this.toDate = moment()
		this.title = `Form 3: MDR Line Listing Form for All Cases of Maternal Death Data (15-49 Years) - <small>${moment(this.fromDate).format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`

		this.activatedRoute.params.subscribe(({ id }) => {
			if (id) {
				this.isshowForm = false;
				this.isEditing = true;
				this.form1Service
					.getOne(id, {
						include: [
							{
								relation: "mdsrForm3s"
							}
						]
					})
					.subscribe(data => {
						this.dataSource = [data];
						this.mdr_type = data.mdsrForm3s[0].mdr_type;
						this.expendRow(data);
						this.changeDetectorRef.detectChanges();
					});
			} else {
				this.isshowForm = true;
				this.isEditing = false;
				setTimeout(() => {
					const data = {
						state:
							this.user && (this.user.accessupto === "Block" || this.user.accessupto === "District" || this.user.accessupto === "State")
								? this.user.user_state_id
								: null,
						district:
							this.user && (this.user.accessupto === "Block" || this.user.accessupto === "District")
								? this.user.user_district_id
								: null,
						block:
							this.user && this.user.accessupto === "Block"
								? {
									"subdistrictcode": this.user.user_block_id.subdistrictcode,
									"subdistrictname": this.user.user_block_id.subdistrictname
								}
								: null,
						mdrtype: this.mdrTypeValue,
						fromDate: this.fromDate.format("YYYY-MM-DD"),
						toDate: this.toDate
					};
					this.refreshForm.emit({
						form: this.formFilter,
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
			let status_of_newborn = "";
			let name_of_investigator = "";
			let facility_id = {};
			//let field_investigation_date=null;
			if (this.mdr_type == "facility") {
				facility_id = this.expandedElement.facility_id;
			}
			this.mdsrForm3FormGroup = this.fb.group({
				//id: [null],
				status_of_newborn: ['', Validators.required],
				name_of_investigator: ['', Validators.required],
				date_of_interview: [null, Validators.required],
				mdr_type: this.mdr_type,
				state_id: [this.expandedElement.state_id],
				district_id: [this.expandedElement.district_id],
				block_id: [this.expandedElement.block_id],
				//village_id: [this.expandedElement.village_id],
				//facility_id: facility_id,
				deceased_women_id: [this.expandedElement.id],
				month: [parseInt(moment().format("MM"))],
				year: [parseInt(moment().format("YYYY"))],
				//field_investigation_date: [null]
			});
			this.getMdsrForm3(this.expandedElement);

		}
		setTimeout(() => {
			this.changeDetectorRef.detectChanges();
		}, 500);
	}

	private getMdsrForm3(params: object) {
		this.form3Service
			.getList({
				where: {
					deceased_women_id: params["id"]
				}
			})
			.subscribe(res => {

				if (res.length > 0) {
					this.mdsrForm3Object = res[0];
					// let month = moment(
					// 	this.mdsrForm3Object.date_of_interview
					// ).format("MM");
					// let day = moment(
					// 	this.mdsrForm3Object.date_of_interview
					// ).format("DD");
					// let year = moment(
					// 	this.mdsrForm3Object.date_of_interview
					// ).format("YYYY");

					// let date_of_interview = {
					// 	year: parseInt(year),
					// 	month: parseInt(month),
					// 	day: parseInt(day)
					// };

					this.mdsrForm3FormGroup.patchValue({
						status_of_newborn: this.mdsrForm3Object
							.status_of_newborn,
						name_of_investigator: this.mdsrForm3Object
							.name_of_investigator,
						date_of_interview: this.mdsrForm3Object
							.date_of_interview,
						id: this.mdsrForm3Object.id
					});

					this.buttonText = "Update";
					this.changeDetectorRef.detectChanges();
				} else {
					// this.exampleOptions.defaultDate=null;
					this.buttonText = "Save";
					console.log("buttonText......", params["id"])
					this.getForm3Values(params["id"]);
					this.changeDetectorRef.detectChanges();
				}
			});
	}
	// getting the form 3 values form form4 & form 5
	/**
	 * 1. If form 4 is submitted for the selected deceased woman id then below information is getting in the form 2 from form 4
	 *  Status of New Born (Outcome of the delivery) = patient_history.outcome_of_pregnancy
	 *  Name of Investigator = general_information.name_of_nodal_person
	 *  Date of Interview = createdAt
	 *
	 * 2. if form 4 is not submitted for the selected deceased woman id then below information is getting in the form 2 from form 5
	 *  Status of New Born (Outcome of the delivery) = module1.current_pregnancy.outcome_of_pregnancy
	 *  Name of Investigator = generalinformation.investigators[0].investigator_name
	 *  Date of Interview = generalinformation.investigation_date
	 */

	getForm3Values(id) {
		this.form4Service.getList({
			where: {
				"deceased_women_id": id
			},
			fields: {
				createdAt: true,
				patient_history: true,
				name_of_nodal_person: true
			}
		}).subscribe(form4Res => {
			//console.log(form4Res);
			if (form4Res.length > 0) {
				let date = moment(form4Res[0].createdAt).format("YYYY-MM-DD");
				this.mdsrForm3FormGroup.patchValue({
					status_of_newborn: form4Res[0].patient_history.outcome_of_pregnancy,
					name_of_investigator: form4Res[0].name_of_nodal_person,
					date_of_interview: {
						"year": parseInt(date.split("-")[0]),
						"month": parseInt(date.split("-")[1]),
						"day": parseInt(date.split("-")[2])
					}

				})
			} else {
				this.form5Service.getList({
					where: {
						"deceased_women_id": id
					}
				}).subscribe(form5Res => {
					//console.log(form5Res)
					if (form5Res.length > 0) {
						let date = moment(form5Res[0].generalinformation.investigation_date).format("YYYY-MM-DD");
						this.mdsrForm3FormGroup.patchValue({
							status_of_newborn: form5Res[0].module1.current_pregnancy.infant_survival,
							name_of_investigator: form5Res[0].generalinformation.investigators[0].investigator_name,
							date_of_interview: {
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
	isSubmitted: boolean = false;
	saveAndUpdateMdsrForm3() {
		//converting NgbDate Object to iso Date
		this.isSubmitted = true;

		//if (this.mdsrForm3FormGroup.valid) {
		let ngbDate = this.mdsrForm3FormGroup.controls["date_of_interview"]
			.value;
		let myDate = new Date(ngbDate); // e.g. myDate = 2017-01-01
		this.mdsrForm3FormGroup.patchValue({
			date_of_interview: myDate
		});
		if (this.mdsrForm3FormGroup.value.id) {
			this.updtate(this.mdsrForm3FormGroup.value);
		} else {

			this.add(this.mdsrForm3FormGroup.value);
		}
		this.filterChange(this.filterData);
		this.isSubmitted = false;
		this.expandedElement = null;
		this.changeDetectorRef.detectChanges();
		//}
	}

	backClicked() {
		this._location.back();
	}
	getTotalTableFooterCount(where: any) {
		this.form3Service.count(where).subscribe(({ count }) => {
			this.totalRecords = count;
		});
		this.changeDetectorRef.detectChanges();
	}

	exportToExcel() {
		console.log(this.dataSource)
		let dataToExport = this.dataSource.map((x) => ({
			"Block": x.block_id.subdistrictname,
			"Deceased Women Name": x.getName,
			"Husband Name": x.husband_name,
			"Age": x.getAge,
			"Date of Death": moment(x.death_date_time).format('DD-MM-YYYY HH:MM a'),
			//"MDR Type": x.mdr_type,
			"Place of Death": x.place_of_death,
			"When Death Occur": x.when_death_occur,
			"Cause of Death": x.is_maternal_death ? 'Maternal' : 'Non-Maternal',
			"Primary Informant": x.reporting_person,
			"Designation": x.designation,
			"Status of Newborn": x.mdsrForm3s && x.mdsrForm3s[0] && x.mdsrForm3s[0].status_of_newborn ? x.mdsrForm3s[0].status_of_newborn : '',
			"Investigator Name": x.mdsrForm3s && x.mdsrForm3s[0] && x.mdsrForm3s[0].name_of_investigator ? x.mdsrForm3s[0].name_of_investigator : '',
			"Interview Date": x.mdsrForm3s && x.mdsrForm3s[0] && x.mdsrForm3s[0].getInterviewDate ? x.mdsrForm3s[0].getInterviewDate : ''
		}));
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "MDR Line Listing Form for All Cases of Maternal Death Data.xlsx");
	}
}
