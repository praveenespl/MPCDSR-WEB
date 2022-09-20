import { api } from './../../../../../utilities/api';
import {
	Component,
	OnInit,
	AfterViewInit,
	ChangeDetectorRef,
	EventEmitter
} from "@angular/core";
import FormConfig from "./form1-config.json";
import { Form1Service } from "../../../../../services/mdsr/form1.service";
import { Form1Object } from "../../../../../models/forms/mdsr/form1";
import { ActivatedRoute, Router } from "@angular/router";
import { replaceStringWith } from "../../../../../utilities/decorators/replace-string-with";
import { localizationApiEndPoint } from "../../../../../utilities/api";
import Swal from "sweetalert2";
import { Location } from "@angular/common";
import { MatDialog } from "@angular/material";
import { DuplicatePopupComponent } from "../duplicate-popup/duplicate-popup.component";

let stateDisabledStatus: boolean = false;
let districtDisabledStatus: boolean = false;
let blockDisabledStatus: boolean = false;
let requiredStatus: boolean = false;

@Component({
	selector: "kt-form",
	templateUrl: "./form.component.html",
	styleUrls: ["./form.component.scss"]
})
export class FormComponent implements OnInit, AfterViewInit {
	currentUser: any;

	@replaceStringWith({
		string: [
			"{{url}}",
			"{{stateDisabled}}",
			"{{districtDisabled}}",
			"{{blockDisabled}}",
			"{{requiredStatus}}",
			"{{apiEndPoint}}"
		],
		replaceWith: [
			localizationApiEndPoint,
			stateDisabledStatus,
			districtDisabledStatus,
			blockDisabledStatus,
			requiredStatus,
			`${api.mdsr.form1.getPlaceOfDeathValues}`
		],
		accessUpto: JSON.parse(sessionStorage.getItem("currentUser"))
			? [
				JSON.parse(sessionStorage.getItem("currentUser")).accessupto,
				JSON.parse(sessionStorage.getItem("currentUser")).reporting_level
			]
			: [""],
	}, "Form 1")
	form: object = FormConfig;
	refreshForm = new EventEmitter();

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private form1Service: Form1Service,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private _location: Location,
		private dialog: MatDialog
	) { }

	ngOnInit() {
	}
	value: Form1Object;
	private initForm(value?: Form1Object) {
		this.refreshForm.emit({
			// form: this.form,
			submission: {
				data: new Form1Object({
					...value,
					state_id: value.state_id,
					block_id: value.block_id,
					district_id: value.district_id,
					village_id: value.village_id,
					created_by: value.created_by ? value.created_by : this.currentUser.id,
					user_designation: value.user_designation ? value.user_designation : this.currentUser.designation
				})
			}
		});
		this.changeDetectorRef.detectChanges();
	}

	onSubmit($event) {

		const data = Object.assign({}, $event.data);
		const stateinfo = data.state_id;
		const districtinfo = data.district_id;
		const blockinfo = data.block_id;
		const facilityinfo = data.facility_id;
		data.state_id = {
			statecode: stateinfo.statecode,
			statename: stateinfo.statename
		};

		data.block_id = {
			subdistrictcode: blockinfo.subdistrictcode,
			subdistrictname: blockinfo.subdistrictname
		};

		data.district_id = {
			districtname: districtinfo.districtname,
			districtcode: districtinfo.districtcode
		};
		if(this.currentUser.designation==='FNO'){
			data.facility_id = {
				health_facility_name: this.currentUser.firstname
				//health_facility_type: facilityinfo.health_facility_type
			};
		}else{
			data.facility_id = {
				health_facility_primary_key_id:
					facilityinfo.health_facility_primary_key_id,
				health_facility_name: facilityinfo.health_facility_name,
				health_facility_type: facilityinfo.health_facility_type
			};
		}

		data.is_maternal_death = data.when_death_occur != "None";
		if (data.designation == "Individual") {
			data.reporting_person_id = "";
			data.reporting_person = data.reporting_person;
		} else {
			data.reporting_person_id = "";
			data.reporting_person = data.reporting_person;
			data.reporting_person_mobile = data.reporting_person_mobile;
		}
		data.deceased_women_info =
			data.state_id.statename +
			"#" +
			data.district_id.districtname +
			"#" +
			data.block_id.subdistrictname +
			"#" +
			data.facility_id.health_facility_name +
			"#" +
			data.deceased_women_fname +
			"#" +
			data.deceased_women_mname +
			"#" +
			data.deceased_women_lname +
			"#" +
			data.mcts_id;
		delete data.reporting_person1;
		if (data['date_of_birth'] == "" || data['date_of_birth'] == undefined || data['date_of_birth'] == null) {
			data['date_of_birth'] = '1900-01-01';
		}
		if (data['date'] == "" || data['date'] == undefined || data['date'] == null) {
			data['date'] = new Date();
		}
		if (data.id) {
			this.update(data);
		} else {
			this.form1Service
				.getList({
					where: <any>{
						or: [
							{
								"state_id.statecode": data.state_id.statecode,
								"district_id.districtcode": data.district_id.districtcode,
								"block_id.subdistrictcode": data.block_id.subdistrictcode,
								husband_name: {
									like: data.husband_name,
									options: "i"
								},
								deceased_women_fname: {
									like: data.deceased_women_fname,
									options: "i"
								}
							},
							data.mcts_id
								? {
									mcts_id: data.mcts_id
								}
								: undefined
						].filter(i => i)
					}
				})
				.subscribe(response => {
					if (response.length) {
						const dialogRef = this.dialog.open(DuplicatePopupComponent, {
							data: response,
							width: "90%",
							disableClose: true
						});
						dialogRef.afterClosed().subscribe(isDuplicate => {
							if (!isDuplicate) {
								this.add(data);
							}
						});
					} else {
						this.add(data);
					}
				});
		}
	}

	private add(request: Form1Object) {
		this.form1Service.add(request).subscribe(response => {
			const designation = this.currentUser.designation;
			const msg = ['Facility', 'FNO'].includes(designation) ? 'Form 4 to be submitted within 48 hours' : '';
			Swal.fire({
				icon: "success",
				title: `Record added successfully!`,
				html: `<span class="text-info h4">${msg}</span>`,

				showConfirmButton: true,
			});
			this.router.navigate(["mdsr/form1"]);
		});
	}

	private update(request: Form1Object) {
		this.form1Service.update(request).subscribe(
			response => {
				if (!response) {
					Swal.fire({
						icon: "warning",
						title: "Issue found during updation!",
						showConfirmButton: false,
						timer: 1500
					});
				} else {
					Swal.fire({
						icon: "success",
						title: "Record updated successfully!",
						showConfirmButton: false,
						timer: 1500
					});
				}
			},
			err => {
				Swal.fire({
					icon: "warning",
					title: "Issue found during updation!",
					showConfirmButton: false,
					timer: 1500
				});
			}
		);
		this.router.navigate(["mdsr/form1"]);
	}

	ngAfterViewInit() {
		this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
		this.activatedRoute.params.subscribe(({ id }) => {
			if (id) {
				this.form1Service
					.getOne(id, {
						include: [
							{ relation: "state" },
							{ relation: "block" },
							{ relation: "district" },
							{ relation: "facility" },
							{ relation: "healthworker" }
						]
					})
					.subscribe(response => {
						this.initForm(response);
						setTimeout(() => {
							this.changeDetectorRef.detectChanges();
						}, 500);
					});
			} else {
				const data = {
					state_id:
						this.currentUser &&
							(this.currentUser.accessupto === "Block" ||
								this.currentUser.accessupto === "District" ||
								this.currentUser.accessupto === "State")
							? this.currentUser.user_state_id
							: null,
					district_id:
						this.currentUser &&
							(this.currentUser.accessupto === "Block" ||
								this.currentUser.accessupto === "District")
							? this.currentUser.user_district_id
							: null,
					block_id:
						this.currentUser && this.currentUser.accessupto === "Block"
							? ({
								subdistrictcode: this.currentUser.user_block_id
									.subdistrictcode,
								subdistrictname: this.currentUser.user_block_id
									.subdistrictname
							} as Block)
							: null,
					created_by: this.currentUser.id,
					user_designation: this.currentUser.designation
				};
				this.refreshForm.emit({
					submission: {
						data
					}
				});
			}
		});
	}
	onChange($event) { }
	backClicked() {
		this._location.back();
	}
}
