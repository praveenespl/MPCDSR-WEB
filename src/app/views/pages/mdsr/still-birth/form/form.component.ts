import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { investigationReportForm } from "./specs/form";
import { Router, ActivatedRoute } from "@angular/router";
import { StillbirthService } from "../../../../../services/stillbirth/stillbirth.service";
import { AlertService } from "../../../../../utilities/alert.service";
import { pairwise, startWith, take, switchMap, map } from "rxjs/operators";
import { FormioComponent } from "angular-formio";
import { NgbTypeaheadWindow } from "@ng-bootstrap/ng-bootstrap/typeahead/typeahead-window";
import { StateService } from "../../../../../services/locality/state.service";
import { BlockService } from "../../../../../services/locality/block.service";
import { VillageService } from "../../../../../services/locality/village.service";
import { DistrictService } from "../../../../../services/locality/district.service";
import { HttpClient, HttpEventType } from "@angular/common/http";
import Swal from "sweetalert2";
import { any } from "@amcharts/amcharts4/.internal/core/utils/Array";
import { getValueChangesInObjects } from "./../../../../../utilities/functions";
import moment from 'moment';
import { api } from "../../../../../utilities/api";
@Component({
	selector: "kt-form",
	templateUrl: "./form.component.html",
	styleUrls: ["./form.component.scss"]
})
export class FormComponent implements OnInit {
	form: FormGroup;

	providerStillBirthUrl: any;
	imageProgressCaste: any;
	isImageProgessShowCaste: any;
	isDisableUpdateBtnCaste: any;
	selectedFile: any;
	casteCertificateForImageView: any;
	isDisableUploadBtnCaste: any;
	showCasteUploadBtn: any;
	imageToShow: any;

	minImageSize = 0;
	maxImageSize = 200;
	isShowSubmitBtn = true;
	submited = false;
	viewOnly = false;
	systolic: boolean = false;
	diastolic: boolean = false;
	past_history_details: boolean = false;
	stillBirthType: boolean = false;
	showbirthDefect: boolean = false;
	familyRelated: boolean = false;
	isSubmitted: boolean = false;
	medicalCollageShow: boolean = false;
	states: State[];
	districts: District[];
	blocks: Block[];
	villages: Village[];
	stillBisthautoId: any;
	selectedState: any;
	selectedDistrict: any;
	selectedBlock: any;
	selectedVillage: any;
	items: any;
	itemsStillBirth: any;
	birthDefectItems: any;
	today: any;
	isShowClearImage: boolean = true;
	@ViewChild("wizard", { static: true }) el: ElementRef;
	@ViewChildren("form4Ref") private forms: QueryList<FormioComponent>;

	currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
	constructor(private activatedRoute: ActivatedRoute,
		private changeDetectorRef: ChangeDetectorRef,
		private stillbirthService: StillbirthService,
		private alertService: AlertService,
		private stateService: StateService,
		private districtService: DistrictService,
		private blockService: BlockService,
		private villageService: VillageService,
		private router: Router, private http: HttpClient) {
		//this.today = new Date();
	}

	private initForm() {
		this.form = investigationReportForm();
	}

	backClicked() {
		this.router.navigateByUrl("/mdsr/still-birth");
	}
	ngAfterViewInit(): void {
		// Initialize form wizard
		const wizard = new KTWizard(this.el.nativeElement, {
			startStep: 1,
		});

		//Validation before going to next page
		wizard.on("beforeNext", (wizardObj) => {
			// https://angular.io/guide/forms
			// https://angular.io/guide/form-validation
			// validate the form and use below function to stop the wizard's step
			console.log("this.form : ", this.form.value);
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

				case 5:
					invalid = this.form.get("sectionE").invalid;
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
	ngOnInit() {
		this.today = new Date().toISOString().slice(0, 10);
		this.getStates();
		//this.getStillBirthAutoId();
		this.initForm();
		const view = this.activatedRoute.snapshot.queryParams.view;
		if (view == "true") {
			this.isShowSubmitBtn = false;
			this.viewOnly = true;
			this.isShowClearImage = false;
		} else {
			this.isShowSubmitBtn = true;
			this.viewOnly = false;
			this.isShowClearImage = true;
		}
		this.activatedRoute.params.pipe(take(1)).subscribe(({ id, view }) => {
			if (id) {
				this.stillbirthService.getOne(id).subscribe((response) => {
					//console.log("response :",response);
					//this.form.patchValue(response);
					this.setEditAndViewValueInForm(response);
					setTimeout(() => {
						this.changeDetectorRef.detectChanges();
					}, 500);
				});
			} else {
				this.getStillBirthAutoId();
			}
		});
		setTimeout(() => {
			this.changeDetectorRef.detectChanges();
		}, 500);
	}

	getStates() {
		this.stateService.getStates().subscribe((response) => {
			this.states = response;
			//const index = this.states.findIndex((i)=> i.statecode == this.currentUser.user_state_id.statecode)
			//this.selectedState = this.states[index];
			//this.form.value.sectionA.state=this.selectedState;
			//this.getDistricts(this.form.value.sectionA.state.statecode);
		});


	}

	getDistricts(val) {
		this.districtService.getDistricts(val.statecode).subscribe((response) => {
			this.districts = response;
			//const index = this.districts.findIndex((i)=> i.districtcode == this.currentUser.user_district_id.districtcode)
			//this.selectedDistrict= this.districts[index];
			//this.form.value.sectionA.district=this.selectedDistrict;
			//this.getBlocks(this.form.value.sectionA.district.districtcode);
		});
	}

	getBlocks(val) {
		this.blockService.getBlocks(val.districtcode).subscribe((response) => {
			this.blocks = response;
			//const index = this.blocks.findIndex((i)=> i.subdistrictcode == this.currentUser.user_block_id.subdistrictcode)
			//this.selectedBlock= this.blocks[index];
			//this.form.value.sectionA.block=this.selectedBlock;
			//this.getVillages(this.form.value.sectionA.district.districtcode);
		});
	}
	// private getVillages(val) {
	// 	this.villageService.getVillages(val).subscribe((response) => {
	// 		this.villages = response;
	// 		this.form.value.sectionA.villages=this.villages;
	// 	});
	// }

	//Get StillBirthAutoId
	private getStillBirthAutoId() {
		this.stillbirthService.getStillBirthAutoId(this.currentUser.user_state_id as any).subscribe((response) => {
			console.log('response', response);
			let stillbirthNo = response ? response.stateNamePrefix + response.value : '-----';
			this.stillBisthautoId = stillbirthNo;
			this.form.get(["sectionA", "stillBirthNo"]).setValue(this.stillBisthautoId);
		});
	}


	fetalDeath() {
		if (this.form.value.sectionD.maternal_condition_associated_with_fetal_death.value == "M1") {
			this.items = ['Placenta previa',
				'Other forms of placental separation and hemorrhage',
				'Placental dysfunction,infarction,insufficiency',
				'Fetal-placental transfusion syndromes',
				'Prolapsed cord,other compression of umbilical cord',
				'Chorioamnionitis',
				'Other complications of membranes',
				'Incompetent cervix'];
		} else if (this.form.value.sectionD.maternal_condition_associated_with_fetal_death.value == "M2") {
			this.items = ['Preterm rupture of membranes',
				'Oligohydramnios/polyhydramnios',
				'Ectopic pregnancy',
				'Multiple pregnancy',
				'Maternal death',
				'Malpresentation before labour',
				'Other complications of pregnancy'];
		} else if (this.form.value.sectionD.maternal_condition_associated_with_fetal_death.value == "M3") {
			this.items = ['Breech delivery and extraction',
				'Other malpresentation,malposition and disproportion during labour and delivery',
				'Forceps delivery/vacuum extraction',
				'Caesarean delivery',
				'Precipitate delivery',
				'Preterm labour and delivery',
				'Other complications of labour and delivery,including termination of pregnancy'];
		} else if (this.form.value.sectionD.maternal_condition_associated_with_fetal_death.value == "M4") {
			this.items = ['Pre-eclampsia, eclampsia',
				'Gestational hypertension',
				'Other hypertensive disorders',
				'Renal and urinary tract diseases',
				'Infectious and parasitic disease',
				'Circulatory and respiratory disease',
				'Nutritional disorders',
				'Injury',
				'Surgical procedure',
				'Other medical procedures',
				'Maternal diabetes, including gestational diabetes',
				'Maternal anaesthesia and analgesia',
				'Maternal medication',
				'Tobacco/alcohol/drugs of addiction',
				'Nutritional chemical substances',
				'Environmental chemical substance'];
		} else if (this.form.value.sectionD.maternal_condition_associated_with_fetal_death.value == "M5") {
			this.items = ['None'];
		}

	}

	StillBirth() {
		if (this.form.value.sectionD.type_of_still_birth == "Ante-Partum / Macerated Stillbirth (MSB)") {
			this.stillBirthType = true
			this.itemsStillBirth = [
				{ label: 'A1 : Birth Defect', value: 'A1' },
				{ label: 'A2 : Infection', value: 'A2' },
				{ label: 'A3 : Antepartum Hypoxia', value: 'A3' },
				{
					label: 'A4 : Other Specified Antepartum Disorder',
					value: 'A4'
				},
				{
					label: 'A5 : Disorders Related to Fetal Growth',
					value: 'A5'
				},
				{
					label:
						'A6 : Unspecified Cause of Antepartum Death',
					value: 'A6'
				}
			]
		} else if (this.form.value.sectionD.type_of_still_birth == "Intra-Partum / Fresh Stillbirth (FSB)") {
			this.stillBirthType = true
			this.itemsStillBirth = [
				{ label: 'I1 : Birth Defect', value: 'I1' },
				{ label: 'I2 : Birth Trauma', value: 'I2' },
				{
					label: 'I3 : Acute Intrapartum Event',
					value: 'I3'
				},
				{ label: 'I4 : Infection', value: 'I4' },
				{
					label:
						'I5 : Other Specified Intrapartum Disorder',
					value: 'I5'
				},
				{
					label: 'I6 : Disorder Related to Fetal Growth',
					value: 'I6'
				},
				{ label: 'I7 : Other', value: 'Other' }
			]
		}
	}

	bpDone() {
		if (this.form.value.sectionC.examination_on_admission.blood_pressure == "Done") {
			this.systolic = true;
			this.diastolic = true;
		} else if (this.form.value.sectionC.examination_on_admission.blood_pressure == "Not Done") {
			this.systolic = false;
			this.diastolic = false;
			this.form.get(["sectionC", "examination_on_admission", "systolic"]).setValue("");
			this.form.get(["sectionC", "examination_on_admission", "diastolic"]).setValue("");
		}
	}

	pastHistory() {
		if (this.form.value.sectionB.past_history == "Yes") {
			this.past_history_details = true;
		} else if (this.form.value.sectionB.past_history == "No") {
			this.past_history_details = false;
			this.form.get(["sectionB", "past_history_details"]).setValue("");
		}
	}
	birthDefect() {
		if (this.form.value.sectionD.birthDefect == "Yes") {
			this.showbirthDefect = true;
			this.birthDefectItems = ['Abdominal Wall Defects',
				'Hypospadias (Urethral opening away from the tip of penis)',
				'Imperforate Anus (improperly developed anus)',
				'Hydrocephalus (head size too large > 38 cms (full term))',
				'Microcephaly (head Size too small < 32 cms (full term))',
				'Neural Tube Defects (NTDs)',
				'Cleft lip/ cleft palate/ cleft lip and palate',
				'Reduction Defects of Limbs (Absence of a whole or part of upper/lower limb)',
				'Talipes Equinovarus (Club foot)',
				'Ambiguous genitalia (uncertain genitalia)',
				'Bladder exstrophy (bladder not covered)',
				'Others, specify'
			]
		} else if (this.form.value.sectionD.birthDefect == "No") {
			this.showbirthDefect = false;
			this.form.get(["sectionD", "birthDefectOption"]).setValue("");
		}
	}

	modifiable_factors() {
		if (this.form.value.sectionE.modifiable_factors == "Yes") {
			this.familyRelated = true;
		} else {
			this.familyRelated = false;
			this.form.get(["sectionE", "family_related"]).setValue("");
			this.form.get(["sectionE", "administration_related"]).setValue("");
			this.form.get(["sectionE", "provider_related"]).setValue("");
		}

	}
	medicalCollage() {
		if (this.form.value.sectionA.type_of_facility == "Medical College (MC)") {
			this.medicalCollageShow = true;
		} else {
			this.medicalCollageShow = false;
			this.form.get(["sectionD", "details_of_MCAWFD"]).setValue("");

		}


	}
	myFiles: string[] = [];
	imageShowArray: string[] = [];
	selectFile(event) {
		this.imageProgressCaste = "";
		this.isImageProgessShowCaste = false;
		this.isDisableUpdateBtnCaste = false;
		// this.selectedFile = <File>event.target.files[0];
		// let ImageSizeInKB = this.selectedFile.size / 1024;
		// if (
		// 	ImageSizeInKB >= this.minImageSize &&
		// 	ImageSizeInKB <= this.maxImageSize
		// ) {
		// 	const fileExtension: string = this.selectedFile.name.substring(
		// 		this.selectedFile.name.lastIndexOf(".") + 1
		// 	);

		// 	if (fileExtension.toLowerCase() == "pdf") {
		// 		this.casteCertificateForImageView = false;
		// 		this.isDisableUploadBtnCaste = false;
		// 		this.showCasteUploadBtn = true;
		// 	} else if (fileExtension.toLowerCase() == "jpg") {
		// 		this.casteCertificateForImageView = true;
		// 		this.isDisableUploadBtnCaste = false;
		// 		this.showCasteUploadBtn = true;
		// 		Swal.fire({
		// 			title: "Error!",
		// 			text:"Only JPG,PNG and PDF Attachment Allowed !",
		// 			//type: "error",
		// 			confirmButtonText: "Ok"
		// 		});
		// 	}
		//Show Image Preview
		if (event.target.files && event.target.files[0]) {
			var filesAmount = event.target.files.length;
			for (let i = 0; i < filesAmount; i++) {
				this.myFiles.push(event.target.files[i]);
				var reader = new FileReader();
				reader.onload = (event: any) => {
					//console.log(event.target.result);
					this.imageShowArray.push(event.target.result);
					this.changeDetectorRef.detectChanges();
				}
				reader.readAsDataURL(event.target.files[i]);
			}
			this.changeDetectorRef.detectChanges();
		}
		// } else {
		// 	this.imageToShow = "";
		// 	this.selectedFile = undefined;
		// 	this.casteCertificateForImageView = false;
		// 	this.isDisableUploadBtnCaste = true;
		// 	this.showCasteUploadBtn = false;
		// 	Swal.fire({
		// 		title: "Error!",
		// 		text: `Image and PDF Size Should be Smaller To ${this.maxImageSize} KB Only`,
		// 		//type: "error",
		// 		confirmButtonText: "Ok"
		// 	});
		// }

	}

	removeUploadedStillBirth(index) {
		//this.form.patchValue({ providerPANCard: "" });
		//this.providerStillBirthUrl = "";
		this.imageShowArray.splice(index, 1);
		this.myFiles.splice(index, 1);
		this.imgObj.splice(index, 1);
		const Toast = Swal.mixin({
			toast: true,
			position: "top-end",
			showConfirmButton: false,
			timer: 4000,
			timerProgressBar: true,
		});
		Toast.fire({
			icon: "info",
			title: `File removed successfully !!`
		});
	}


	isImageProgessShowStill: any;
	imageProgressStill: any;
	showStillBirthUploadBtn: any;
	isDisableUploadBtnStillBirth: any;
	isDisableSubmitBtnStill: any;
	imgObj: string[] = [];
	upload(imageName: string) {
		if (imageName == "stillBirth") {
			this.isImageProgessShowStill = true;
			this.stillbirthService
				.uploadImage(
					"Stillbirth",
					this.myFiles,
				)
				.subscribe(
					events => {
						console.log("events : ", events);
						if (events.type === HttpEventType.UploadProgress) {
							console.log(
								"Uploaded : " +
								Math.round(
									(events.loaded / events.total) * 100
								)
							);
							this.imageProgressStill = Math.round(
								(events.loaded / events.total) * 100
							);
							this.changeDetectorRef.detectChanges();
						} else if (events.type === HttpEventType.Response) {
							this.isDisableUploadBtnStillBirth = true;
							console.log('events.body', events.body);
							let eventBody = events.body as any;
							eventBody.forEach(element => {
								this.imgObj.push(element);
							});
							if (events.status == 200) {
								this.isDisableSubmitBtnStill = true;
								this.isDisableSubmitBtnStill = true;

								const Toast = Swal.mixin({
									toast: true,
									position: "top-end",
									showConfirmButton: false,
									timer: 4000,
									timerProgressBar: true,
								});
								Toast.fire({
									icon: "success",
									title: `StillBirth uploaded successfully !!`
								});
							}
							this.changeDetectorRef.detectChanges();
						}
					},
					err => {
						const Toast = Swal.mixin({
							toast: true,
							position: "top-end",
							showConfirmButton: false,
							timer: 4000,
							timerProgressBar: true,
						});
						Toast.fire({
							icon: "error",
							title: `Network Error in Pancard, Pease Upload image once again !!`
						});
					}
				);
		}
	}





	onSubmit() {


		const data = this.form.value;
		let state = {};
		let district = {};
		let block = {};
		//let village={};
		state['statecode'] = data.sectionA.state.statecode;
		state['statename'] = data.sectionA.state.statename;
		district['districtcode'] = data.sectionA.district.districtcode;
		district['districtname'] = data.sectionA.district.districtname;
		block['subdistrictcode'] = data.sectionA.block.subdistrictcode;
		block['subdistrictname'] = data.sectionA.block.subdistrictname;
		//village['villagecode'] = data.sectionA.village.villagecode;
		//village['villagename'] = data.sectionA.village.villagename;

		const data1 = {
			state: state,
			district: district,
			block: block,
			other_block_name: data.sectionA.other_block_name,
			//village : village,
			//center_name : data.sectionA.center_name, 
			name_of_facility: data.sectionA.name_of_facility,
			type_of_facility: data.sectionA.type_of_facility,
			stillBirthNo: data.sectionA.stillBirthNo,
			//deliveries_in_month: data.sectionA.deliveries_in_month,
			baby_hospital_record_no: data.sectionA.baby_hospital_record_no,
			mother_hospital_record_no: data.sectionA.mother_hospital_record_no,
			basic_information: {
				date_of_still_birth: data.sectionA.date_of_still_birth,
				intramural: data.sectionA.intramural,
				mother_age: data.sectionA.mother_age,
				consanguineous_marriage: data.sectionA.consanguineous_marriage
			},
			pregnancy_care: {
				obstetrical_history: {
					gravida: data.sectionB.obstetrical_history.gravida,
					para: data.sectionB.obstetrical_history.para,
					abortion: data.sectionB.obstetrical_history.abortion
				},
				past_history: data.sectionB.past_history,
				past_history_details: data.sectionB.past_history_details,
				previous_still_birth: data.sectionB.previous_still_birth,
				previous_birth_defect: data.sectionB.previous_birth_defect,
				prev_c_section: data.sectionB.prev_c_section,
				rh_negative: data.sectionB.rh_negative,
				antenatal_care_received: data.sectionB.antenatal_care_received,
				tt_Vaccination: data.sectionB.tt_Vaccination,
				iron_folic_acid: data.sectionB.iron_folic_acid,
				syphilis_test: data.sectionB.syphilis_test,
				hemoglobin: data.sectionB.hemoglobin,
				hiv_Status: data.sectionB.hiv_Status,
				malaria: data.sectionB.malaria,
				gestational_diabetes_mellitus: data.sectionB.gestational_diabetes_mellitus,
				//diagnosed_with: data.sectionB.diagnosed_with,
				pre_natal_ultrasound: data.sectionB.pre_natal_ultrasound
			},
			examination: {
				examination_on_admission: {
					fetal_heart_sound: data.sectionC.examination_on_admission.fetal_heart_sound,
					blood_pressure: data.sectionC.examination_on_admission.blood_pressure,
					systolic: data.sectionC.examination_on_admission.systolic,
					diastolic: data.sectionC.examination_on_admission.diastolic,
					per_vaginal_bleeding: data.sectionC.examination_on_admission.per_vaginal_bleeding,
					fever: data.sectionC.examination_on_admission.fever
				},
				delivery_details: {
					partograph_used: data.sectionC.delivery_details.partograph_used,
					type_of_labour: data.sectionC.delivery_details.type_of_labour,
					mode_of_delivery: data.sectionC.delivery_details.mode_of_delivery
				},
				birth_details: {
					baby_weight: data.sectionC.birth_details.baby_weight,
					sex_of_baby: data.sectionC.birth_details.sex_of_baby,
					gestation_age_week: data.sectionC.birth_details.gestation_age_week,
					gestation_age_days: data.sectionC.birth_details.gestation_age_days,
					confirmation_of_gestation_age_by: data.sectionC.birth_details.confirmation_of_gestation_age_by
				}

			},
			details_of_still_birth: {
				type_of_still_birth: data.sectionD.type_of_still_birth,
				maternal_condition_associated_with_fetal_death: data.sectionD.maternal_condition_associated_with_fetal_death,
				details_of_MCAWFD: data.sectionD.details_of_MCAWFD,
				fetal_death_main_cause: data.sectionD.fetal_death_main_cause,
				birthDefect: data.sectionD.birthDefect,
				birthDefectOption: data.sectionD.birthDefectOption,
				birthDefectOptionOther: data.sectionD.birthDefectOptionOther ? data.sectionD.birthDefectOptionOther : 'NA',
				//other_associated_conditions : data.sectionE.other_associated_conditions, 
				modifiable_factors: data.sectionE.modifiable_factors,
				family_related: data.sectionE.family_related,
				administration_related: data.sectionE.administration_related,
				provider_related: data.sectionE.provider_related,
				critical_delay: data.sectionE.critical_delay,
			},
			filled_by: data.sectionE.filled_by,
			filled_date: new Date(data.sectionE.filled_date),
			imgObj: this.imgObj
		}
		let isEdit = false;
		this.activatedRoute.params
			.pipe(
				take(1),
				switchMap(({ id }) => {
					if (id) {
						isEdit = true;
						return this.stillbirthService.update(JSON.parse(JSON.stringify(data1)), id);
					}
					return this.stillbirthService.add(JSON.parse(JSON.stringify(data1)));
				})
			)
			.subscribe((response) => {
				this.alertService.fireAlert({
					icon: "success",
					title: `Record ${isEdit ? "updated" : "added"} successfully!`,
					showConfirmButton: false,
				});
				this.router.navigate(["/mdsr/still-birth"]);
			});
	}


	// code done by ravindra on 23-03-21
	imageURL: string[] = [];
	modifiedFileNameArray: string[] = [];
	setEditAndViewValueInForm(param) {
		let sillBirthdate = moment(param.basic_information.date_of_still_birth).format('yyyy-MM-DD');
		let basicInformationTab = {
			state: param.state,
			district: param.district,
			block: param.block,
			other_block_name: param.other_block_name,
			name_of_facility: param.name_of_facility,
			type_of_facility: param.type_of_facility,
			stillBirthNo: param.stillBirthNo,
			//deliveries_in_month: param.deliveries_in_month,
			baby_hospital_record_no: param.baby_hospital_record_no,
			mother_hospital_record_no: param.mother_hospital_record_no,
			date_of_still_birth: sillBirthdate.toString(),
			intramural: param.basic_information.intramural,
			mother_age: param.basic_information.mother_age,
			consanguineous_marriage: param.basic_information.consanguineous_marriage
		}
		let pregnancyCareTab = {
			obstetrical_history: {
				gravida: param.pregnancy_care.obstetrical_history.gravida,
				para: param.pregnancy_care.obstetrical_history.para,
				abortion: param.pregnancy_care.obstetrical_history.abortion
			},
			past_history: param.pregnancy_care.past_history,
			past_history_details: param.pregnancy_care.past_history_details,
			previous_still_birth: param.pregnancy_care.previous_still_birth,
			previous_birth_defect: param.pregnancy_care.previous_birth_defect,
			prev_c_section: param.pregnancy_care.prev_c_section,
			rh_negative: param.pregnancy_care.rh_negative,
			antenatal_care_received: param.pregnancy_care.antenatal_care_received,
			tt_Vaccination: param.pregnancy_care.tt_Vaccination,
			iron_folic_acid: param.pregnancy_care.iron_folic_acid,
			syphilis_test: param.pregnancy_care.syphilis_test,
			hemoglobin: param.pregnancy_care.hemoglobin,
			hiv_Status: param.pregnancy_care.hiv_Status,
			malaria: param.pregnancy_care.malaria,
			gestational_diabetes_mellitus: param.pregnancy_care.gestational_diabetes_mellitus,
			//diagnosed_with: data.pregnancy_care.diagnosed_with,
			pre_natal_ultrasound: param.pregnancy_care.pre_natal_ultrasound
		}
		let labourAndBirthTab = {
			examination_on_admission: {
				fetal_heart_sound: param.examination.examination_on_admission.fetal_heart_sound,
				blood_pressure: param.examination.examination_on_admission.blood_pressure,
				systolic: param.examination.examination_on_admission.systolic,
				diastolic: param.examination.examination_on_admission.diastolic,
				per_vaginal_bleeding: param.examination.examination_on_admission.per_vaginal_bleeding,
				fever: param.examination.examination_on_admission.fever
			},
			delivery_details: {
				partograph_used: param.examination.delivery_details.partograph_used,
				type_of_labour: param.examination.delivery_details.type_of_labour,
				mode_of_delivery: param.examination.delivery_details.mode_of_delivery
			},
			birth_details: {
				baby_weight: param.examination.birth_details.baby_weight,
				sex_of_baby: param.examination.birth_details.sex_of_baby,
				gestation_age_week: param.examination.birth_details.gestation_age_week,
				gestation_age_days: param.examination.birth_details.gestation_age_days,
				confirmation_of_gestation_age_by: param.examination.birth_details.confirmation_of_gestation_age_by
			}
		}

		let causeOfDeathTab = {
			type_of_still_birth: param.details_of_still_birth.type_of_still_birth,
			maternal_condition_associated_with_fetal_death: param.details_of_still_birth.maternal_condition_associated_with_fetal_death,
			details_of_MCAWFD: param.details_of_still_birth.details_of_MCAWFD,
			fetal_death_main_cause: param.details_of_still_birth.fetal_death_main_cause,
			birthDefect: param.details_of_still_birth.birthDefect,
			birthDefectOption: param.details_of_still_birth.birthDefectOption,
			birthDefectOptionOther: param.details_of_still_birth.hasOwnProperty('birthDefectOptionOther') ? param.details_of_still_birth.birthDefectOptionOther : 'NA'
		}
		let filleddate = moment(param.filled_date).format('yyyy-MM-DD');
		let associatedFactorTab = {
			//other_associated_conditions : data.sectionE.other_associated_conditions, 
			modifiable_factors: param.details_of_still_birth.modifiable_factors,
			family_related: param.details_of_still_birth.family_related,
			administration_related: param.details_of_still_birth.administration_related,
			provider_related: param.details_of_still_birth.provider_related,
			critical_delay: param.details_of_still_birth.critical_delay,
			filled_by: param.filled_by,
			filled_date: filleddate.toString()
		}
		this.form.patchValue({ sectionA: basicInformationTab, sectionB: pregnancyCareTab, sectionC: labourAndBirthTab, sectionD: causeOfDeathTab, sectionE: associatedFactorTab });
		if (param.imgObj) {
			param.imgObj.forEach(element => {
				this.stillbirthService.getImageForPreview(element.modified_file_name).subscribe(
					res => {
						console.log(res);
						res["name"] = param.imgObj.original_file_name;
						res["lastModifiedDate"] = new Date();
						this.myFiles.push(element);
						this.imgObj.push(element);
						this.createImageFromBlobForStillbirth(res);
					},
					err => {
						console.log(err);
					}
				);
				this.imageURL.push(api.container.downloadStillbirth + element.modified_file_name);
			});
		}

		this.pastHistory();
		this.bpDone();
		this.fetalDeath();
		this.StillBirth();
		this.birthDefect();
		this.modifiable_factors();
		this.medicalCollage();
	}

	createImageFromBlobForStillbirth(image: Blob) {
		let reader = new FileReader();
		reader.addEventListener(
			"load",
			() => {
				this.imageShowArray.push(reader.result.toString());
				//this.providerStillBirthUrl = reader.result.toString();
			},
			false
		);

		if (image) {
			reader.readAsDataURL(image);
		}
	}

	viewCastImage(url) {
		window.open(
			url,
			"Title but its not working",
			"toolbar=yes, resizable=yes, scrollbars=yes, width=400, height=400, top=200 , left=500"
		);
	}

	//END




}
