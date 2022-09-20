import {
	Component,
	OnInit,
	AfterViewInit,
	ViewChild,
	ElementRef,
	ChangeDetectorRef,
} from "@angular/core";
import { neonatalDeathdForm } from "./specs/form";
import { FormGroup,Validators } from "@angular/forms";
import { startWith, pairwise, take, switchMap } from "rxjs/operators";
import { getValueChangesInObjects } from "../../../../../../utilities/functions";
import { StateService } from "../../../../../../services/locality/state.service";
import { DistrictService } from "../../../../../../services/locality/district.service";
import { BlockService } from "../../../../../../services/locality/block.service";
import { VillageService } from "../../../../../../services/locality/village.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CdrForm3BService } from "../../../../../../services/cdr/form3b.service";
import { CdrForm1Service } from "../../../../../../services/cdr/form1.service";
import { AlertService } from "../../../../../../utilities/alert.service";

@Component({
  selector: 'kt-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, AfterViewInit {
	@ViewChild("wizard", { static: true }) wizard: ElementRef;

	form: FormGroup;

	districts: District[] = [];
	blocks: Block[] = [];
	villages: Village[] = [];

	addressStates: State[];
	addressDistricts: District[] = [];
	addressBlocks: Block[] = [];
	addressVillages: Village[] = [];
	isSubmitted: boolean = false;
	viewOnly: boolean = false;
	today: Date = new Date();
	constructor(
		private stateService: StateService,
		private districtService: DistrictService,
		private blockService: BlockService,
		private villageService: VillageService,
		private changeDetectorRef: ChangeDetectorRef,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private cdrForm3BService: CdrForm3BService,
		private cdrForm1Service: CdrForm1Service,
		private alertService: AlertService
	) {}
	cdr_id;
	onSubmit() {
		if (this.form.invalid) {
			this.isSubmitted=true;
			this.alertService.fireAlert({ icon: "error", title: "Form is invalid. Please fill the mandatory inputs." });
			return;
		}
		this.isSubmitted = false;
		const data = this.form.value;

		data.cdr_id = this.cdr_id;
		// basic - district
		data.basic.districtcode = data.basic.district.districtcode;
		data.basic.districtname = data.basic.district.districtname;
		delete data.basic.district;

		// basic - block
		data.basic.subdistrictcode = data.basic.block.subdistrictcode;
		data.basic.subdistrictname = data.basic.block.subdistrictname;
		delete data.basic.block;

		// basic - village
		data.basic.villagecode = data.basic.village.villagecode;
		data.basic.villagename = data.basic.village.villagename;
		delete data.basic.village;

		// section A - state
		data.sectionA.address.statecode = data.sectionA.address.state.statecode;
		data.sectionA.address.statename = data.sectionA.address.state.statename;
		delete data.sectionA.address.state;

		// section A - district
		data.sectionA.address.districtcode =
			data.sectionA.address.district.districtcode;
		data.sectionA.address.districtname =
			data.sectionA.address.district.districtname;
		delete data.sectionA.address.district;

		// section A - block
		data.sectionA.address.subdistrictcode =
			data.sectionA.address.block.subdistrictcode;
		data.sectionA.address.subdistrictname =
			data.sectionA.address.block.subdistrictname;
		delete data.sectionA.address.block;

		// section A - village
		data.sectionA.address.villagecode =
			data.sectionA.address.village.villagecode;
		data.sectionA.address.villagename =
			data.sectionA.address.village.villagename;
		delete data.sectionA.address.village;

		// // deligate
		// data.statecode = data.sectionA.address.statecode;
		// data.districtcode = data.sectionA.address.districtcode;
		// data.subdistrictcode = data.sectionA.address.subdistrictcode;
		// data.villagecode = data.sectionA.address.villagecode;

		console.log("[form 3B]", JSON.stringify(data));
		let isEdit = false;
		this.activatedRoute.params
			.pipe(
				take(1),
				switchMap(({ id }) => {
					if (id) {
						isEdit = true;
						return this.cdrForm3BService.update(data, id);
					}
					return this.cdrForm3BService.add(data);
				})
			)
			.subscribe((response) => {
				this.alertService.fireAlert({
					icon: "success",
					title: `Record ${isEdit ? "updated" : "added"} successfully!`,
					showConfirmButton: false,
				});
				this.router.navigate(["/cdr/form3/b"]);
			});
	}

	private initForm() {
		this.form = neonatalDeathdForm;

		this.form.valueChanges
			.pipe(startWith(this.form.value), pairwise())
			.subscribe(([prevValue, nextValue]) => {
				const changes = getValueChangesInObjects(prevValue, nextValue);

				// Basic:start
				if (changes.hasOwnProperty("basic")) {
					const basic = changes.basic;

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
								let vill=[];
								response.forEach(element => {
									vill.push({
										"villagename":element['villagename'],
										"villagecode":element['villagecode']
									})
								});
								this.villages=vill;
							});
					}
				}
				// Basic:end

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
									let addVill=[];
									response.forEach(element => {
										addVill.push({
											"villagename":element['villagename'],
											"villagecode":element['villagecode']
										})
									});
									this.addressVillages=addVill;
								});
						}
					}
					// Address:end
					// actual place of death set start
					// if (sectionA.hasOwnProperty("place_of_death")) {
					// 	if (sectionA["place_of_death"] == "On way to health facility/in transit") {
					// 		this.form.get(["sectionA", "actual_place_of_death"]).setValidators([Validators.required]);
					// 		this.form.get(["sectionA", "actual_place_of_death"]).updateValueAndValidity();
					// 	} else {
					// 		(<FormGroup>this.form.controls['sectionA']).controls['actual_place_of_death'].patchValue('');
							//this.form.get(["sectionA","actual_place_of_death"]).setValue("");
					// 		this.form.get(["sectionA", "actual_place_of_death"]).setValidators([]);
					// 		this.form.get(["sectionA", "actual_place_of_death"]).updateValueAndValidity();
					// 	}
					// }
					//end actual death of work
				}
				// Section A:end
			});
	}

	ngAfterViewInit(): void {
		// Initialize form wizard
		const wizard = new KTWizard(this.wizard.nativeElement, {
			startStep: 1,
		});

		// Validation before going to next page
		wizard.on("beforeNext", (wizardObj) => {
			// https://angular.io/guide/forms
			// https://angular.io/guide/form-validation
			// validate the form and use below function to stop the wizard's step
			console.log('this.form',this.form);
			console.log('this.form.value',this.form.value);
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
			}else{
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
	icd10CdrCode:any;
	ngOnInit() {
		this.initForm();

		const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
		let statecode: string;
		if (currentUser) {
			statecode = currentUser.user_state_id.statecode;
		}

		this.stateService.getStates().subscribe((response) => {
			this.addressStates = response;
		});
		this.districtService.getDistricts(statecode).subscribe((response) => {
			this.districts = response;
		});

		this.cdrForm1Service.getIC10CdrCodes().subscribe((response) => {
			this.icd10CdrCode = response;
			console.log('this.icd10CdrCode',this.icd10CdrCode);
		});

		this.activatedRoute.params.pipe(take(1)).subscribe(({ id, cdrForm1Id }) => {
			if (id) {
				console.log("id", id);

				this.cdrForm3BService.getOne(id).subscribe((response) => {
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

			if(cdrForm1Id){
				let filter = { include: ['cdrForm2s'] }
				this.cdrForm1Service.getOne(cdrForm1Id,filter).subscribe((response) => {
					this.form.patchValue(response);
					console.log('responseresponse',response);
					this.cdr_id = cdrForm1Id;
					const state = {
						statecode: response.address.statecode,
						statename: response.address.statename,
					};

					const district = {
						districtcode: response.address.districtcode,
						districtname: response.address.districtname,
					};

					const block = {
						subdistrictcode: response.address.subdistrictcode,
						subdistrictname: response.address.subdistrictname,
					};

					const village = {
						villagecode: response.address.villagecode,
						villagename: response.address.villagename,
					};

					
					const basicDistrict = {
						districtcode: response.address.districtcode,
						districtname: response.address.districtname,
					};

					const basisBlock = {
						subdistrictcode: response.address.subdistrictcode,
						subdistrictname: response.address.subdistrictname,
					};

					const basicVillage = {
						villagecode: response.address.villagecode,
						villagename: response.address.villagename,
					};

					const basic = {
						deceased_name: response.name,
						deceased_mother_name:response.mother_name,
						district: basicDistrict,
						block: basisBlock,
						village: basicVillage,
						phc: response['cdrForm2s'][0]['sectionA']['phc_area_name'],
						sub_centre: response['cdrForm2s'][0]['sectionA']['sub_center_name'],
						date:this.today
					};
					// basic,
					const address = { 
						state, 
						district, 
						block, 
						village,
						colony:response.address.colony,						
						house_number: response.address.house_number,
						pincode: response.address.pincode,
						landmark: response.address.landmark
					};
					this.form.patchValue(
						{ 
							basic, 
							sectionA: { 
								category:response['cdrForm2s'][0]['sectionA']['belongs_to'],
								address,
								deceased_sex:response.sex,
								date_of_birth:response.date_of_birth,
								date_of_death:response.date_of_death
							} 
						},
						{ emitEvent: false }
					);					
					setTimeout(() => {
						this.changeDetectorRef.detectChanges();
					}, 500);
				});
			}
		});
	}

	backClicked() {
		this.router.navigateByUrl("/cdr/form3/b");
	}
}