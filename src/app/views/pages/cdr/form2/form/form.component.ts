import {
	Component,
	OnInit,
	ViewChild,
	ElementRef,
	AfterViewInit,
	ChangeDetectorRef,
} from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { startWith, pairwise, take, switchMap } from "rxjs/operators";
import { getValueChangesInObjects } from "../../../../../utilities/functions";
import { investigationReportForm } from "./spec/form";
import { StateService } from "../../../../../services/locality/state.service";
import { DistrictService } from "../../../../../services/locality/district.service";
import { BlockService } from "../../../../../services/locality/block.service";
import { VillageService } from "../../../../../services/locality/village.service";
import { CdrForm2Service } from "../../../../../services/cdr/form2.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from "../../../../../utilities/alert.service";
import { CdrForm1Service } from "../../../../../services/cdr/form1.service";
import moment from "moment";

@Component({
	selector: "kt-form",
	templateUrl: "./form.component.html",
	styleUrls: ["./form.component.scss"],
})
export class FormComponent implements OnInit, AfterViewInit {
	form: FormGroup;

	viewOnly = false;
	isSubmitted: boolean = false;

	states: State[] = [];
	districts: District[] = [];
	blocks: Block[] = [];
	villages: Village[] = [];

	today: any;

	readonly causedOfDeath = [
		{
			key: "diarrhoea",
			label: "Diarrhoea",
		},
		{
			key: "pneumonia",
			label: "Pneumonia",
		},
		{
			key: "malaria",
			label: "Malaria",
		},
		{
			key: "measles",
			label: "Measles",
		},
		{
			key: "septicemia",
			label: "Septicemia (Infection)",
		},
		{
			key: "meningitis",
			label: "Meningitis",
		},
		{
			key: "injury",
			label: "Injury",
		},
	];

	@ViewChild("wizard", { static: true }) el: ElementRef;

	constructor(
		private stateService: StateService,
		private districtService: DistrictService,
		private blockService: BlockService,
		private villageService: VillageService,
		private cdrForm2Service: CdrForm2Service,
		private cdrForm1Service: CdrForm1Service,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private alertService: AlertService,
		private changeDetectorRef: ChangeDetectorRef
	) {
		this.today = new Date();
	}


	onSubmit() {
		
		if (this.form.invalid) {
			this.isSubmitted = true;
			this.alertService.fireAlert({ icon: "error", title: "Form is invalid. Please fill the mandatory inputs." });
			return;
		}
		this.isSubmitted = false;
		const data = this.form.value;
		//console.log("value is ",JSON.stringify(data));
		//state
		data.cdr_id = this.cdr_id;
		data.sectionA.address.statecode = data.sectionA.address.state.statecode;
		data.sectionA.address.statename = data.sectionA.address.state.statename;
		delete data.sectionA.address.state;

		// district
		data.sectionA.address.districtcode =
			data.sectionA.address.district.districtcode;
		data.sectionA.address.districtname =
			data.sectionA.address.district.districtname;
		delete data.sectionA.address.district;

		// block
		data.sectionA.address.subdistrictcode =
			data.sectionA.address.block.subdistrictcode;
		data.sectionA.address.subdistrictname =
			data.sectionA.address.block.subdistrictname;
		delete data.sectionA.address.block;

		// village
		data.sectionA.address.villagecode =
			data.sectionA.address.village.villagecode;
		data.sectionA.address.villagename =
			data.sectionA.address.village.villagename;
		delete data.sectionA.address.village;

		// deligate
		data.statecode = data.sectionA.address.statecode;
		data.districtcode = data.sectionA.address.districtcode;
		data.subdistrictcode = data.sectionA.address.subdistrictcode;
		data.villagecode = data.sectionA.address.villagecode;

		let isEdit = false;
		this.activatedRoute.params
			.pipe(
				take(1),
				switchMap(({ id }) => {
					if (id) {
						isEdit = true;
						return this.cdrForm2Service.update(data, id);
					}
					return this.cdrForm2Service.add(data);
				})
			)
			.subscribe((response) => {
				this.alertService.fireAlert({
					icon: "success",
					title: `Record ${isEdit ? "updated" : "added"} successfully!`,
					showConfirmButton: false,
				});
				this.router.navigate(["/cdr/form2"]);
			});
	}

	private getStates() {
		this.stateService.getStates().subscribe((response) => {
			this.states = response;
		});
	}

	private initForm() {
		this.form = investigationReportForm();
		this.form.valueChanges
			.pipe(startWith(this.form.value), pairwise())
			.subscribe(([prevValue, nextValue]) => {
				const changes = getValueChangesInObjects(prevValue, nextValue);

				// console.log({ changes });

				// SECTION A::START
				if (changes.sectionA) {
					const sectionA = changes.sectionA;

					if (sectionA.hasOwnProperty("date_of_birth")) {
						// TODO: calculate age
					}

					if (sectionA.address) {
						if (sectionA.address.state) {
							this.form.patchValue({
								sectionA: {
									address: { district: "", block: "", village: "" },
								},
							});
							this.districts = [];
							this.blocks = [];
							this.villages = [];

							this.districtService
								.getDistricts(sectionA.address.state.statecode)
								.subscribe((response) => {
									this.districts = response;
								});
						}

						if (sectionA.address.district) {
							this.form.patchValue({
								sectionA: {
									address: { block: "", village: "" },
								},
							});
							this.blocks = [];
							this.villages = [];

							this.blockService
								.getBlocks(sectionA.address.district.districtcode)
								.subscribe((response) => {
									this.blocks = response;
								});
						}

						if (sectionA.address.block) {
							this.form.patchValue({
								sectionA: {
									address: { village: "" },
								},
							});
							this.villages = [];

							this.villageService
								.getVillages(sectionA.address.block.subdistrictcode)
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
						}
					}

					if (sectionA.hasOwnProperty("any_ho_illness_injury")) {
						if (sectionA.any_ho_illness_injury == "Yes") {
							this.form
								.get("sectionA.nature_of_illness")
								.setValidators([Validators.required]);
							//
							this.form.patchValue({
								sectionA: {
									symptoms_during_illness: this.form.value.sectionA
										.symptoms_during_illness,
									treatment_for_illness_was_taken: this.form.value.sectionA
										.treatment_for_illness_was_taken,
								},
							});
						} else {
							this.form.get("sectionA.nature_of_illness").setValidators([]);
							this.form
								.get("sectionA.nature_of_illness")
								.updateValueAndValidity({ emitEvent: false });
							//
							[
								"inability_to_feed",
								"fever",
								"loose_stools",
								"vomiting",
								"fast_breathing",
								"convulsions",
								"appearance_of_skin_rashes",
								"injury",
								"other",
							].forEach((key) => {
								const field = this.form.get(
									`sectionA.symptoms_during_illness.${key}_days`
								);
								field.setValidators([]);
								field.updateValueAndValidity({ emitEvent: false });
							});
						}
						//
					}

					if (sectionA.hasOwnProperty("symptoms_during_illness")) {
						const symptomsDuringIllness = sectionA.symptoms_during_illness;

						[
							"inability_to_feed",
							"fever",
							"loose_stools",
							"vomiting",
							"fast_breathing",
							"convulsions",
							"appearance_of_skin_rashes",
							"injury",
							"other",
						].forEach((key) => {
							if (symptomsDuringIllness.hasOwnProperty(key)) {
								const field = this.form.get(
									`sectionA.symptoms_during_illness.${key}_days`
								);
								if (key == "other" && symptomsDuringIllness[key]) {
									field.setValidators([Validators.required]);
								} else if (symptomsDuringIllness[key] == "Yes") {
									field.setValidators([Validators.required]);
								} else {
									field.setValidators([]);
								}
								field.updateValueAndValidity();
							}
						});

						if (sectionA.hasOwnProperty("treatment_for_illness_was_taken")) {
							if (sectionA.treatment_for_illness_was_taken == "Yes") {
								this.form
									.get("sectionA.where_was_child_treated")
									.setValidators([Validators.required]);
							} else {
								this.form
									.get("sectionA.where_was_child_treated")
									.setValidators([]);
							}
							this.form
								.get("sectionA.where_was_child_treated")
								.updateValueAndValidity({ emitEvent: false });
						}
					}
				}
				// SECTION A::END

				// SECTION B::START
				if (changes.hasOwnProperty("sectionB")) {
					const sectionBForm = this.form.get("sectionB");
					const causesLength = Object.entries(sectionBForm.value).filter(
						([key, value]) => {
							return (
								~this.causedOfDeath.findIndex((i) => i.key == key) && value
							);
						}
					).length;
					if (!causesLength && !sectionBForm.value.other) {
						sectionBForm.patchValue(
							{ no_identifiable_cause: true },
							{ emitEvent: false }
						);
					} else {
						sectionBForm.patchValue(
							{ no_identifiable_cause: false },
							{ emitEvent: false }
						);
					}
				}
				// SECTION B::END
			});
	}
	cdr_id;
	ngOnInit() {
		this.getStates();
		this.initForm();
		const view = this.activatedRoute.snapshot.queryParams.view;
		if (view == "true") {
			this.viewOnly = true;
		} else {
			this.viewOnly = false;
		}
		this.activatedRoute.params.pipe(take(1)).subscribe(({ id, cdrForm1Id }) => {
			if (id) {
				this.cdrForm2Service.getOne(id).subscribe((response) => {
					this.form.patchValue(response);
					const state = {
						statecode: response.sectionA.address.statecode,
						statename: response.sectionA.address.statename,
					};

					this.form.patchValue({ sectionA: { address: { state } } });

					const district = {
						districtcode: response.sectionA.address.districtcode,
						districtname: response.sectionA.address.districtname,
					};

					this.form.patchValue({ sectionA: { address: { district } } });

					const block = {
						subdistrictcode: response.sectionA.address.subdistrictcode,
						subdistrictname: response.sectionA.address.subdistrictname,
					};

					this.form.patchValue({ sectionA: { address: { block } } });

					const village = {
						villagecode: response.sectionA.address.villagecode,
						villagename: response.sectionA.address.villagename,
					};

					this.form.patchValue({ sectionA: { address: { village } } });

					setTimeout(() => {
						this.changeDetectorRef.detectChanges();
					}, 500);
				});
			}
			if (cdrForm1Id) {
				this.cdrForm1Service.getOne(cdrForm1Id).subscribe((response) => {
					this.cdr_id = cdrForm1Id;
					const age = moment(response.date_of_death).diff(response.date_of_birth, "days") + " Days";
					this.form.patchValue({
						sectionA: {
							age: age, //response.age,
							child_name: response.name,
							date_of_birth: response.date_of_birth,
							sex: response.sex,
							address: {
								colony: response.address.colony,
								house_number: response.address.house_number,
								landmark: response.address.landmark,
								pincode: response.address.pincode,
							},
						},
					});
					const state = {
						statecode: response.address.statecode,
						statename: response.address.statename,
					};

					this.form.patchValue({ sectionA: { address: { state } } });

					const district = {
						districtcode: response.address.districtcode,
						districtname: response.address.districtname,
					};

					this.form.patchValue({ sectionA: { address: { district } } });

					const block = {
						subdistrictcode: response.address.subdistrictcode,
						subdistrictname: response.address.subdistrictname,
					};

					this.form.patchValue({ sectionA: { address: { block } } });

					const village = {
						villagecode: response.address.villagecode,
						villagename: response.address.villagename,
					};

					this.form.patchValue({ sectionA: { address: { village } } });
					console.log("--------------------------------");
					console.log(JSON.stringify(this.form.value));
					setTimeout(() => {
						this.changeDetectorRef.detectChanges();
					}, 500);
				});
			}
		});

		// for getting details form 1
	}

	backClicked() {
		this.router.navigateByUrl("/cdr/form2");
	}

	ngAfterViewInit(): void {
		// Initialize form wizard
		const wizard = new KTWizard(this.el.nativeElement, {
			startStep: 1,
		});

		// Validation before going to next page
		wizard.on("beforeNext", (wizardObj) => {
			// https://angular.io/guide/forms
			// https://angular.io/guide/form-validation
			// validate the form and use below function to stop the wizard's step
			let invalid = true;
			switch (wizardObj.currentStep) {
				case 1:
					invalid = this.form.get("sectionA").invalid;
					break;
				case 2:
					invalid = this.form.get("sectionB").invalid;
					break;

				case 3:
					invalid = this.form.get("sectionC").invalid;
					break;

				case 4:
					invalid = this.form.get("sectionD").invalid;
					break;

				default:
					break;
			}
			if (invalid) {
				this.isSubmitted = true;
				this.alertService.fireAlert({
					icon: "error",
					title: "Form is invalid. Please fill the mandatory inputs.",
				});
				this.changeDetectorRef.detectChanges();
				wizardObj.stop();
			}else {
				this.isSubmitted = false;
			}
		});

		// Change event
		wizard.on("change", function (wizard) {
			setTimeout(function () {
				KTUtil.scrollTop();
				var elementLeft = wizard.steps[wizard.currentStep - 1].offsetLeft;
				var scollContainer = document.getElementById("scrollbar");
				scollContainer.scrollLeft =
					elementLeft - scollContainer.offsetLeft - 52;
			}, 500);
		});
	}
}
