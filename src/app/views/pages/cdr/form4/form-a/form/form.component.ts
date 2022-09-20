import { sectionC, sectionD } from './../../../../mdsr/still-birth/form/specs/form';
import {
	Component,
	OnInit,
	AfterViewInit,
	ViewChild,
	ElementRef,
	ChangeDetectorRef,
} from "@angular/core";
import { neonatalDeathdReviewForm } from "./specs/form";
import { FormGroup } from "@angular/forms";
import { startWith, pairwise, take, switchMap } from "rxjs/operators";
import { getValueChangesInObjects } from "../../../../../../utilities/functions";
import { StateService } from "../../../../../../services/locality/state.service";
import { DistrictService } from "../../../../../../services/locality/district.service";
import { BlockService } from "../../../../../../services/locality/block.service";
import { VillageService } from "../../../../../../services/locality/village.service";
import { ActivatedRoute, Router } from '@angular/router';
import { CdrForm4Service } from '../../../../../../services/cdr/form4.service';
import { AlertService } from "../../../../../../utilities/alert.service";
import { CdrForm1Service } from "../../../../../../services/cdr/form1.service";
import moment from "moment";
@Component({
	selector: "kt-form",
	templateUrl: "./form.component.html",
	styleUrls: ["./form.component.scss"],
})
export class FormComponent implements OnInit, AfterViewInit {
	@ViewChild("wizard", { static: true }) el: ElementRef;

	form: FormGroup;
	max = new Date()
	states: State[];
	districts: District[] = [];
	blocks: Block[] = [];
	villages: Village[] = [];
	addressStates: State[];
	addressDistricts: District[] = [];
	addressBlocks: Block[] = [];
	addressVillages: Village[] = [];
	today: any;
	isSubmitted: boolean = false;
	viewOnly: boolean = false;
	readonly: boolean = true;
	inborn: boolean;
	constructor(
		private stateService: StateService,
		private districtService: DistrictService,
		private blockService: BlockService,
		private villageService: VillageService,
		private activatedRoute: ActivatedRoute,
		private cdrForm4Service: CdrForm4Service,
		private cdrForm1Service: CdrForm1Service,
		private alertService: AlertService,
		private router: Router,
		private changeDetectorRef: ChangeDetectorRef
	) {
		const date = new Date();
		this.today = {
			year: date.getFullYear(),
			month: date.getMonth() + 1,
			day: date.getDate(),
		};
	}

	onSubmit() {
		if (this.form.invalid) {
			this.isSubmitted = true;
			this.alertService.fireAlert({ icon: "error", title: "Form is invalid. Please fill the mandatory inputs." });
			return;
		}
		this.isSubmitted = false;
		const data = this.form.value;
		data.cdr_id = this.cdr_id;
		// basic - state
		if (data.basic.state) {
			data.basic.statecode = data.basic.state.statecode;
			data.basic.statename = data.basic.state.statename;
		}
		delete data.basic.state;

		// basic - district
		if (data.basic.district) {
			data.basic.districtcode = data.basic.district.districtcode;
			data.basic.districtname = data.basic.district.districtname;
		}
		delete data.basic.district;

		// basic - block
		if (data.basic.block) {
			data.basic.subdistrictcode = data.basic.block.subdistrictcode;
			data.basic.subdistrictname = data.basic.block.subdistrictname;
		}
		delete data.basic.block;

		// basic - village
		if (data.basic.village) {
			data.basic.villagecode = data.basic.village.villagecode;
			data.basic.villagename = data.basic.village.villagename;
		}
		delete data.basic.village;

		// section A - state
		if (data.sectionA.address.state) {
			data.sectionA.address.statecode = data.sectionA.address.state.statecode;
			data.sectionA.address.statename = data.sectionA.address.state.statename;
		}
		delete data.sectionA.address.state;

		// section A - district
		if (data.sectionA.address.district) {
			data.sectionA.address.districtcode =
				data.sectionA.address.district.districtcode;
			data.sectionA.address.districtname =
				data.sectionA.address.district.districtname;
		}
		delete data.sectionA.address.district;

		// section A - block
		if (data.sectionA.address.block) {
			data.sectionA.address.subdistrictcode =
				data.sectionA.address.block.subdistrictcode;
			data.sectionA.address.subdistrictname =
				data.sectionA.address.block.subdistrictname;
		}
		delete data.sectionA.address.block;

		// section A - village
		if (data.sectionA.address.village) {
			data.sectionA.address.villagecode =
				data.sectionA.address.village.villagecode;
			data.sectionA.address.villagename =
				data.sectionA.address.village.villagename;
		}
		delete data.sectionA.address.village;

		console.log("[form 4A]", JSON.stringify(data));
		let isEdit = false;
		this.activatedRoute.params
			.pipe(
				take(1),
				switchMap(({ id }) => {
					if (id) {
						isEdit = true;
						return this.cdrForm4Service.update(data, id);
					}
					return this.cdrForm4Service.add(data);
				})
			)
			.subscribe((response) => {
				this.alertService.fireAlert({
					icon: "success",
					title: `Record ${isEdit ? "updated" : "added"} successfully!`,
					showConfirmButton: false,
				});
				this.router.navigate(["/cdr/form4/a"]);
			});
	}

	getStates() {
		this.stateService.getStates().subscribe((response) => {
			this.states = response;
			this.addressStates = response;
		});
	}

	private initForm() {
		this.form = neonatalDeathdReviewForm;
		this.form.patchValue({ 'basic': { 'year': this.today['year'] } })
		this.form.valueChanges.pipe(startWith(this.form.value), pairwise()).subscribe(([prevValue, nextValue]) => {
			const changes = getValueChangesInObjects(prevValue, nextValue);

			// Basic:start
			// Basic:start
			if (changes.hasOwnProperty("basic")) {
				const basic = changes.basic;

				if (basic.hasOwnProperty("state")) {
					this.form.patchValue(
						{ basic: { districts: "", block: "", village: "" } },
						{ emitEvent: false }
					);
					this.districts = [];
					this.blocks = [];
					this.villages = [];

					this.districtService
						.getDistricts(basic.state.statecode)
						.subscribe((response) => {
							this.districts = response;
						});
				}

				if (basic.hasOwnProperty("district")) {
					this.form.patchValue(
						{ basic: { block: "", village: "" } },
						{ emitEvent: false }
					);
					this.blocks = [];
					this.villages = [];

					this.blockService
						.getBlocks(basic.district.districtcode)
						.subscribe((response) => {
							this.blocks = response;
						});
				}

				if (basic.block) {
					this.form.patchValue(
						{
							basic: { village: "" },
						},
						{ emitEvent: false }
					);
					this.villages = [];

					this.villageService
						.getVillages(basic.block.subdistrictcode)
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

			// Section A:start
			if (changes.hasOwnProperty("sectionA")) {
				const sectionA = changes.sectionA;
				// Address:start
				if (sectionA.hasOwnProperty("address")) {
					const address = sectionA.address;

					if (address.hasOwnProperty("state")) {
						this.form.patchValue(
							{
								sectionA: {
									address: { district: "", block: "", village: "" },
								},
							},
							{ emitEvent: false }
						);
						this.addressDistricts = [];
						this.addressBlocks = [];
						this.addressVillages = [];

						this.districtService
							.getDistricts(address.state.statecode)
							.subscribe((response) => {
								this.addressDistricts = response;
							});
					}

					if (address.hasOwnProperty("district")) {
						this.form.patchValue(
							{ sectionA: { address: { block: "", village: "" } } },
							{ emitEvent: false }
						);
						this.addressBlocks = [];
						this.addressVillages = [];

						this.blockService
							.getBlocks(address.district.districtcode)
							.subscribe((response) => {
								this.addressBlocks = response;
							});
					}

					if (address.block) {
						this.form.patchValue(
							{ sectionA: { address: { village: "" } } },
							{ emitEvent: false }
						);
						this.addressVillages = [];

						this.villageService
							.getVillages(address.block.subdistrictcode)
							.subscribe((response) => {
								//this.addressVillages = response;
								let addVill = [];
								response.forEach(element => {
									addVill.push({
										"villagename": element['villagename'],
										"villagecode": element['villagecode']
									})
								});
								this.addressVillages = addVill;
							});
					}
				}
				// Address:end
			}
			// Section A:end
			console.log("Malik-->", this.form.controls.sectionC.value.referred == "Yes")
			//Section D:Start
			if (this.form.controls.sectionC.value.referred == "No") {
				this.inborn = false;
			}else{
				this.inborn = true;
				 this.form.get("sectionD").valid;
			}
			//Section D: End
		});
	}
	cdr_id;
	icd10CdrCode: any;
	ngOnInit() {
		this.initForm();
		this.getStates();

		this.stateService.getStates().subscribe((response) => {
			this.addressStates = response;
			this.states = response;
		});

		this.cdrForm1Service.getIC10CdrCodes().subscribe((response) => {
			this.icd10CdrCode = response;
		});

		const view = this.activatedRoute.snapshot.queryParams.view;
		if (view == "true") {
			this.viewOnly = true;
			this.readonly = true;
		} else {
			this.viewOnly = false;
			this.readonly = false;
		}

		this.activatedRoute.params.pipe(take(1)).subscribe(({ id, cdrForm1Id }) => {
			if (id) {
				this.cdrForm4Service.getOne(id).subscribe((response) => {
					console.log(response)
					console.log(response.sectionA.date_of_death)
					this.form.patchValue(response);


					const state = {
						statecode: response.sectionA.address.statecode,
						statename: response.sectionA.address.statename,
					};

					const district = {
						districtcode: response.sectionA.address.districtcode,
						districtname: response.sectionA.address.districtname,
					};

					const block = {
						subdistrictcode: response.sectionA.address.subdistrictcode,
						subdistrictname: response.sectionA.address.subdistrictname,
					};

					const village = {
						villagecode: response.sectionA.address.villagecode,
						villagename: response.sectionA.address.villagename,
					};

					//
					const basicState = {
						statecode: response.basic.statecode,
						statename: response.basic.statename,
					};

					const basicDistrict = {
						districtcode: response.basic.districtcode,
						districtname: response.basic.districtname,
					};

					const basisBlock = {
						subdistrictcode: response.basic.subdistrictcode,
						subdistrictname: response.basic.subdistrictname,
					};

					const basicVillage = {
						villagecode: response.basic.villagecode,
						villagename: response.basic.villagename,
					};


					const basic = {
						state: basicState,
						district: basicDistrict,
						block: basisBlock,
						village: basicVillage,
					};
					const address = { state, district, block, village };
					this.form.patchValue(
						{ basic, sectionA: { address } },
						{ emitEvent: false }
					);

					setTimeout(() => {
						this.changeDetectorRef.detectChanges();
					}, 500);
				});
			}
			if (cdrForm1Id) {
				this.cdrForm1Service.getOne(cdrForm1Id).subscribe((response) => {
					console.log();
					this.cdr_id = cdrForm1Id;
					const age = moment(response.date_of_death).diff(response.date_of_birth, "days");
					this.form.patchValue({
						sectionA: {
							age: age, //response.age,
							newborn_name: response.name,
							mother_name: response.mother_name,
							date_of_birth: response.date_of_birth,
							date_of_death: response.date_of_death,
							//time_of_death: response.time_of_death,
							sex: response.sex,
							address: {
								colony: response.address.colony,
								house_number: response.address.house_number,
								landmark: response.address.landmark,
								pincode: response.address.pincode,
							},
						},
					});
					console.log(response.date_of_death);
					const state = {
						statecode: response.address.statecode,
						statename: response.address.statename,
					};
					this.form.patchValue({ basic: { state } });
					this.form.patchValue({ sectionA: { address: { state } } });

					const district = {
						districtcode: response.address.districtcode,
						districtname: response.address.districtname,
					};
					this.form.patchValue({ basic: { district } });
					this.form.patchValue({ sectionA: { address: { district } } });

					const block = {
						subdistrictcode: response.address.subdistrictcode,
						subdistrictname: response.address.subdistrictname,
					};
					this.form.patchValue({ basic: { block } });
					this.form.patchValue({ sectionA: { address: { block } } });

					const village = {
						villagecode: response.address.villagecode,
						villagename: response.address.villagename,
					};
					this.form.patchValue({ basic: { village } });
					this.form.patchValue({ sectionA: { address: { village } } });
					setTimeout(() => {
						this.changeDetectorRef.detectChanges();
					}, 500);

				});
			}
		});
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
			// wizardObj.stop();
			let invalid = true;
			switch (wizardObj.currentStep) {
				case 1:
					invalid = this.form.get("basic").invalid;
					break;
				case 2:
					invalid = this.form.get("sectionA").invalid;
					break;

				case 3:
					invalid = this.form.get("sectionB").invalid;
					break;

				case 4:
					invalid = this.form.get("sectionC").invalid;
					break;

				case 5:
					invalid = this.form.get("sectionD").invalid;
					break;

				case 6:
					invalid = this.form.get("sectionE").invalid;
					break;

				case 7:
					invalid = this.form.get("sectionF").invalid;
					break;

				default:
					break;
			}
			console.log('invalid', invalid);
			if (invalid) {
				this.isSubmitted = true;
				this.alertService.fireAlert({
					icon: "error",
					title: "Form is invalid. Please fill the mandatory inputs.",
				});
				this.changeDetectorRef.detectChanges();
				wizardObj.stop();
			} else {
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

	backClicked() {
		this.router.navigateByUrl("/cdr/form4/a");
	}
}
