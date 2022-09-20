import { Component, OnInit, ViewChild, ChangeDetectorRef, EventEmitter, AfterViewInit } from '@angular/core';
import { replaceStringWith } from "../../../../../utilities/decorators/replace-string-with";
import { Form1Service } from "../../../../../services/mdsr/form1.service.js";
import { Form1Object } from "../../../../../models/forms/mdsr/form1.js";
import FormFilter from "./form6-filter.json";
import { localizationApiEndPoint } from "../../../../../utilities/api";
import FormConfig from "./form6.json";
import { Form6Object } from "../../../../../models/forms/mdsr/form6";
import { Form6Service } from '../../../../../services/mdsr/form6.service';
import { DataList } from '../../../../../models/views/data-list';
import { MatPaginator, MatSort } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../../utilities/alert.service';
import { Location } from '@angular/common';
let stateDisabledStatus: boolean = false;
let districtDisabledStatus: boolean = false;
let blockDisabledStatus: boolean = false;
@Component({
	selector: 'kt-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, AfterViewInit {

	@replaceStringWith({ string: ["{{url}}", "{{stateDisabled}}", "{{districtDisabled}}", "{{blockDisabled}}"], replaceWith: [localizationApiEndPoint, stateDisabledStatus, districtDisabledStatus, blockDisabledStatus], accessUpto: JSON.parse(sessionStorage.getItem("currentUser")) ? [JSON.parse(sessionStorage.getItem("currentUser")).accessupto, JSON.parse(sessionStorage.getItem("currentUser")).reporting_level] : [""] })
	formFilter: Object = FormFilter;
	place_of_death: any;
	@replaceStringWith({ string: ["{{url}}", "{{stateDisabled}}", "{{districtDisabled}}", "{{blockDisabled}}"], replaceWith: [localizationApiEndPoint, stateDisabledStatus, districtDisabledStatus, blockDisabledStatus], accessUpto: JSON.parse(sessionStorage.getItem("currentUser")) ? [JSON.parse(sessionStorage.getItem("currentUser")).accessupto, JSON.parse(sessionStorage.getItem("currentUser")).reporting_level] : [""] })
	form: object = FormConfig;

	recordToUse: Form1Object;
	showFiliter: boolean = true;
	mdsrForm6Obj: object = {};
	refreshForm = new EventEmitter();
	currentUser?: any;
	readonly columns: DataList["columns"] = [
		{ name: "action", isActionField: true },
		{ name: "block", isActionField: true },
		{ name: "Name of Deceased", key: 'deceased_women_fname' },
		{ name: "Husband", key: "husband_name" },
		{ name: "Age", key: 'age' },
		{ name: "MCTS", key: "mcts_id" },
		{ name: "Mobile", key: "mobile" },
		{ name: "Death Date Time", key: 'death_date_time' },
		{ name: "Place Of Death", key: "place_of_death" },
		{ name: "Submitted", isActionField: true },
	];
	readonly columnsToDisplay = this.columns.map(c => c.name);
	dataSource = [];
	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: false }) sort: MatSort;
	//
	setp1refresh = new EventEmitter();
	isShowFilter: boolean = true;
	showOnEdit: boolean = true;
	// DUMMY
	duringAbortion = false;
	duringDelivery = false;
	duringPregnancy = false;
	within42DaysAfterDelivery = false;
	// DUMMY

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private form1Service: Form1Service,
		private form6Service: Form6Service,
		private activatedRoute: ActivatedRoute,
		private alertService: AlertService,
		private router: Router,
		private _location: Location
	) { }

	fillFormDetails(record) {
		const { deceased_women_fname, deceased_women_mname, deceased_women_lname, mdsrForm4s, mdsrForm5s } = record;
		const name = `${deceased_women_fname} ${deceased_women_mname ? deceased_women_mname : ''}${deceased_women_lname ? deceased_women_lname : ''}`;
		const mcts_id = mdsrForm4s && mdsrForm4s[0] && mdsrForm4s[0].general_information ? mdsrForm4s[0].general_information.mcts_id : mdsrForm5s && mdsrForm5s[0] && mdsrForm5s[0].general_information ? mdsrForm5s[0].general_information.mcts_id : '';
		if (record.mdsrForm6s.length > 0) {
			this.setp1refresh.emit({
				submission: {
					data: {
						...new Form6Object(record.mdsrForm6s[0]),
						mcts_id,
						deceased_women_name: name,
						age: record.age,
						place_of_death: record.place_of_death,
						death_date_time:record.death_date_time,
					}
				}
			});
		} else if (record) {
			this.setp1refresh.emit({
				submission: {
					data: {
						...new Form6Object(),
						state_id: record.state_id,
						district_id: record.district_id,
						block_id: record.block_id,
						facility_id: record.facility_id,
						mcts_id,
						deceased_women_current_address: record.deceased_women_current_address,
						deceased_women_native_address: record.deceased_women_native_address,
						deceased_women_id: record.id,
						age: record.age,
						deceased_women_name: name,
						investigators: record.investigators ? record.investigators : [{}, {}, {}],
						religion: record.religion ? record.religion : '',
						caste: record.caste ? record.caste : '',
						place_of_death: record.place_of_death,
						death_date_time: record.death_date_time,
						gravida: record.gravida ? record.gravida : 0,
						para: record.gravida ? record.para : 0,
						alive_children: record.gravida ? record.alive_children_total : 0,
						infant_outcome: record.gravida ? record.infant_outcome : 0,
						induced_abortion: record.induced_abortion ? record.induced_abortion : 0,
						spontaneous_abortion: record.spontaneous_abortion ? record.spontaneous_abortion : 0,
						user_designation: this.currentUser.designation
					}
				}
			});
		}
		setTimeout(() => this.changeDetectorRef.detectChanges(), 500);

	}

	onSubmit(event: any) {
		const data = Object.assign({}, event.data);
		if (data.id) {
			this.update(data);
		} else {
			this.add(data);
		}
	}
	private add(request: Form6Object) {
		delete request.createdAt;
		delete request.updatedAt;
		delete request.investigators;
		delete request.religion;
		delete request.caste;
		this.form6Service.add(request).subscribe(response => {
			this.alertService.fireAlert({
				icon: 'success',
				title: 'Data Submitted Successfully'
			})
			this.router.navigate(['mdsr/form6'])
		});
	}

	private update(request: Form6Object) {
		delete request.investigators;
		delete request.religion;
		delete request.caste;
		this.form6Service.update(request).subscribe(response => {
			if (response) {
				this.alertService.fireAlert({
					icon: 'success',
					title: 'Record updated successfully!'
				})
			} else {
				this.alertService.fireAlert({
					icon: 'warning',
					title: 'Issue found during updation!'
				})
			}
			this.router.navigate(['mdsr/form6'])
		}, err => {
			this.alertService.fireAlert({
				icon: 'warning',
				title: 'Issue found during updation!'
			})
		});
		this.router.navigate(['mdsr/form6'])
	}

	changeStep(step) {}

	ngOnInit() {
		this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'))
		if (this.currentUser.designation == "Facility" || this.currentUser.designation == "FNO") {
			this.place_of_death = { '$in': ["Health Facility"] }
		} else {
			this.place_of_death = { '$in': ["Home", "Transit", "Other", "Health Facility"] }
		}
	}
	ngAfterViewInit(): void {
		this.activatedRoute.params.subscribe(({ id }) => {
			if (id) {
				this.form6Service
					.getOne(id, {
						include: [{
							relation: 'mdsrForm1'
						}]
					})
					.subscribe(data => {
						this.form1Service.getOne(data.deceased_women_id, {
							include: ["mdsrForm4s", "mdsrForm5s", "mdsrForm6s"]
						}).subscribe(form1Res => {
							console.log('form6Res', form1Res)
							this.recordToUse = data.mdsrForm1;
							this.showFiliter = false;
							this.showOnEdit = false;
							this.fillFormDetails(form1Res)
						})
					});
			} else {
				let data: Form1Object;
				if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras) {
					data = <Form1Object>this.router.getCurrentNavigation().extras.state.data;
				}
				data = !data ? <Form1Object>JSON.parse(localStorage.getItem("data")) : data;
				this.recordToUse = data;
				this.fillFormDetails(this.recordToUse)
			}
		});
		setTimeout(() => this.changeDetectorRef.detectChanges(), 500)
	}

	backClicked() {
		this.router.navigateByUrl("/mdsr/form6")
	}

}


