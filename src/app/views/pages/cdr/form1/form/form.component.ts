import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { notificationForm } from "./specs/form";
import { FormGroup, Validators } from "@angular/forms";
import { StateService } from "../../../../../services/locality/state.service";
import { DistrictService } from "../../../../../services/locality/district.service";
import { BlockService } from "../../../../../services/locality/block.service";
import { VillageService } from "../../../../../services/locality/village.service";
import { FacilityService } from "../../../../../services/facility.service";
import { pairwise, startWith, take, switchMap, map } from "rxjs/operators";
import moment from "moment";
import { getValueChangesInObjects, getAge } from "../../../../../utilities/functions";
import { CdrForm1Service } from "../../../../../services/cdr/form1.service";
import { AlertService } from "../../../../../utilities/alert.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
	selector: "kt-form",
	templateUrl: "./form.component.html",
	styleUrls: ["./form.component.scss"],
})
export class FormComponent implements OnInit {
	form: FormGroup;
	submited = false;

	viewOnly = false;

	today: any;
	minDateOfBirth: any;

	states: State[];
	districts: District[];
	blocks: Block[];
	villages: Village[];
	facilities: Facility[];

	currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

	constructor(
		private stateService: StateService,
		private districtService: DistrictService,
		private blockService: BlockService,
		private villageService: VillageService,
		private cdrForm1Service: CdrForm1Service,
		private alertService: AlertService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private changeDetectorRef: ChangeDetectorRef,
		private facilityService: FacilityService
	) {
		const date = new Date();
		this.today = new Date();
		this.minDateOfBirth = new Date(moment().add(-5, "years").toString());
	}
	isSubmitted: boolean = false;
	onSubmit() {
		this.isSubmitted = true;
		//console.log("this.form : ",this.form);
		if (this.form.invalid) {
			return false;
		}
		const data = this.form.value;
		//state
		data.address.statecode = data.address.state.statecode;
		data.address.statename = data.address.state.statename;
		delete data.address.state;

		// district
		data.address.districtcode = data.address.district.districtcode;
		data.address.districtname = data.address.district.districtname;
		delete data.address.district;

		// block
		data.address.subdistrictcode = data.address.block.subdistrictcode;
		data.address.subdistrictname = data.address.block.subdistrictname;
		delete data.address.block;

		// village
		data.address.villagecode = data.address.village.villagecode;
		data.address.villagename = data.address.village.villagename;
		delete data.address.village;
 
		// deligate
		data.statecode = data.address.statecode;
		data.districtcode = data.address.districtcode;
		data.subdistrictcode = data.address.subdistrictcode;
		data.villagecode = data.address.villagecode;

		data.createdBy = this.currentUser.id


		
		let isEdit = false;
		this.activatedRoute.params
			.pipe(
				take(1),
				switchMap(({ id }) => {
					if (id) {
						isEdit = true;
						return this.cdrForm1Service.update(JSON.parse(JSON.stringify(data)), id);
					}
					return this.cdrForm1Service.add(JSON.parse(JSON.stringify(data)));
				})
			)
			.subscribe((response) => {
				this.isSubmitted = false;
				this.alertService.fireAlert({
					icon: "success",
					title: `Record ${isEdit ? "updated" : "added"} successfully!`,
					showConfirmButton: false,
				});
				this.router.navigate(["/cdr/form1"]);
			});
		}

	//
	private getStates() {
		this.stateService.getStates().subscribe((response) => {
			this.states = response;
		});
		this.districtService.list.subscribe(response => {
			this.districts = response;
		});
		// this.blockService.list.subscribe(response => {
		// 	this.blocks = response;
		// });
		// this.villageService.getVillages().subscribe(response => {
		// 	this.villages = response;
		// });
	}

	private initForm() {
		this.form = notificationForm();
		this.form.valueChanges
			.pipe(startWith(this.form.value), pairwise())
			.subscribe(([prevValue, nextValue]) => {
				const changes = getValueChangesInObjects(prevValue, nextValue);
				//const hospital_name = this.currentUser.
				if (changes.address) {
					if (changes.address.state) {
						this.form.patchValue(
							{
								address: { district: "", block: "", village: "" },
							},
							{ emitEvent: false }
						);
						this.districts = [];
						this.blocks = [];
						this.villages = [];

						this.districtService
							.getDistricts(changes.address.state.statecode)
							.subscribe((response) => {
								this.districts = response;
							});
					}

					if (changes.address.district) {
						this.form.patchValue(
							{
								address: { block: "", village: "" },
							},
							{ emitEvent: false }
						);
						this.blocks = [];
						this.villages = [];

						this.blockService
							.getBlocks(changes.address.district.districtcode)
							.subscribe((response) => {
								this.blocks = response;
							});
					}

					if (changes.address.block) {
						this.form.patchValue(
							{
								address: { village: "" },
							},
							{ emitEvent: false }
						);
						this.villages = [];
						this.villageService
							.getVillages(changes.address.block.subdistrictcode)
							.subscribe((response) => {
								//this.villages = response;
								let vill = [];
								response.forEach(element => {
									vill.push({
										"villagename": element['villagename'],
										"villagecode": element['villagecode']
									})
								});
								this.villages = vill;
							});
						const statecode = prevValue.address.state.statecode;
						const districtcode = prevValue.address.district.districtcode;
						const subdistrictcode = changes.address.block.subdistrictcode;
						this.facilities = [];
						this.facilityService
							.list({
								type: "getHealthFacilities",
								statecode,
								districtcode,
								subdistrictcode,
								villagecode: 0,
							}).pipe(
								map(data => {
									const facilities = [];
									data.forEach(item => {
										facilities.push({
											health_facility_name: item.health_facility_name,
											health_facility_primary_key_id: item.health_facility_primary_key_id
										})
									})
									return facilities.sort(this.sortByName)
								}),
							)
							.subscribe((response) => {
								this.facilities = response;
							});
					}
					// if(changes.hospital_name){
					// 	this.form.patchValue({
					// 		health_facility_name:changes.health_facility_name,
					// 		health_facility_primary_key_id:changes.health_facility_primary_key_id
					// 	})
					// }
				}

				if (changes.date_of_birth || changes.date_of_death) {
					// Get years

					if (nextValue.date_of_death && nextValue.date_of_birth) {
						this.form.patchValue({ age: getAge(nextValue.date_of_death, nextValue.date_of_birth) });
					}
				} else {
					if (nextValue.date_of_death != prevValue.date_of_death || nextValue.date_of_birth != prevValue.date_of_birth) {
						this.form.patchValue({ age: getAge(nextValue.date_of_death, nextValue.date_of_birth) });
					}
				}

				this.form
					.get("age")
					.updateValueAndValidity({ emitEvent: false });
				this.form
					.get("date_of_birth")
					.updateValueAndValidity({ emitEvent: false });
				this.form
					.get("date_of_death")
					.updateValueAndValidity({ emitEvent: false });
				this.form
					.get("date_of_notification")
					.updateValueAndValidity({ emitEvent: false });

				if (changes.palce_of_death) {
					if (changes["palce_of_death"] == "Hospital") {
						this.form.get("hospital_name").setValidators([]);
						this.form.get("hospital_name").updateValueAndValidity();
					} else {
						this.form.get("hospital_name").setValidators([]);
						this.form.get("hospital_name").updateValueAndValidity();
					}
				}
				if (changes.palce_of_death) {
					if (changes["palce_of_death"] == "In transit") {
						this.form.get("actual_palce_of_death").setValidators([Validators.required]);
						this.form.get("actual_palce_of_death").updateValueAndValidity();
					} else {
						this.form.patchValue({ actual_palce_of_death: "" });
						this.form.get("actual_palce_of_death").setValidators([]);
						this.form.get("actual_palce_of_death").updateValueAndValidity();
					}
				}
			});
	}

	ngOnInit() {
		this.getStates();
		this.initForm();
		const view = this.activatedRoute.snapshot.queryParams.view;
		if (view == "true") {
			this.viewOnly = true;
		} else {
			this.viewOnly = false;
		}
		this.activatedRoute.params.pipe(take(1)).subscribe(({ id, view }) => {
			if (id) {
				this.cdrForm1Service.getOne(id).subscribe((response) => {
					this.form.patchValue(response);
					const state = response.address.statecode
						? {
							statecode: response.address.statecode,
							statename: response.address.statename,
						}
						: "";

					this.form.patchValue({ address: { state } });

					const district = response.address.districtcode
						? {
							districtcode: response.address.districtcode,
							districtname: response.address.districtname,
						}
						: "";

					this.form.patchValue({ address: { district } });

					const block = response.address.subdistrictcode
						? {
							subdistrictcode: response.address.subdistrictcode,
							subdistrictname: response.address.subdistrictname,
						}
						: "";

					this.form.patchValue({ address: { block } });

					const village = response.address.villagecode
						? {
							villagecode: response.address.villagecode,
							villagename: response.address.villagename,
						}
						: "";

					this.form.patchValue({ address: { village } });
					if(this.viewOnly){
						this.form.controls.address.disable()
					}
					setTimeout(() => {
						this.changeDetectorRef.detectChanges();
					}, 500);
				});
			} else {
				const state =
					this.currentUser &&
						(this.currentUser.accessupto === "Block" ||
							this.currentUser.accessupto === "District" ||
							this.currentUser.accessupto === "State")
						? this.currentUser.user_state_id
						: null;

				if (state) this.form.patchValue({ address: { state } });

				const district =
					this.currentUser &&
						(this.currentUser.accessupto === "Block" ||
							this.currentUser.accessupto === "District")
						? this.currentUser.user_district_id
						: null;

				if (district) this.form.patchValue({ address: { district } });

				const block =
					this.currentUser && this.currentUser.accessupto === "Block"
						? ({
							subdistrictcode: this.currentUser.user_block_id.subdistrictcode,
							subdistrictname: this.currentUser.user_block_id.subdistrictname,
						} as Block)
						: null;

				if (block) this.form.patchValue({ address: { block } });
			}
		});
	}
	// sorting the facility name
	sortByName = (a, b) => {
		const nameA = a.health_facility_name.toLocaleUpperCase();
		const nameB = b.health_facility_name.toLocaleUpperCase();
		return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
	}

}
