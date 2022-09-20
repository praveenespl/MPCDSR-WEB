import {
	Component,
	OnInit,
	ViewChild,
	ElementRef,
	ChangeDetectorRef,
	ViewChildren,
	QueryList,
	EventEmitter
} from "@angular/core";
import GeneralInformationConfig from "./form4-1-general-information.json";
import patientHistoryConfig from "./form4-2-patient-history.json";
import OnAdmissionConfig from "./form4-3-on-admission.json";
import ConditionOnAdmissionConfig from "./form4-4-condition-on-admission.json";
import Diagnosis1Config from "./form4-5-1-diagnosis.json";
import Diagnosis2Config from "./form4-5-2-diagnosis.json";
import Diagnosis3Config from "./form4-5-3-diagnosis.json";
import Diagnosis4Config from "./form4-5-4-diagnosis.json";
import InterventionsConfig from "./form4-6-interventions.json";
import OtherConfig from "./form4-7-other.json";
import DoctorConfig from "./form4-8-doctor-details.json";
import FormFilter from "./form4-filter.json";
import { FormioComponent } from "angular-formio";
import {
	localizationApiEndPoint,
	apiEndPoint
} from "../../../../../utilities/api.js";
import { replaceStringWith } from "../../../../../utilities/decorators/replace-string-with.js";
import { Form4Service } from "../../../../../services/mdsr/form4.service.js";
import { Form1Object } from "../../../../../models/forms/mdsr/form1.js";
import { Form1Service } from "../../../../../services/mdsr/form1.service.js";
import { ReferralService } from "../../../../../services/referral/referral.service.js";
import { MatPaginator, MatSort } from "@angular/material";
import { Form4Object } from "../../../../../models/forms/mdsr/form4";
import { AlertService } from "../../../../../utilities/alert.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { UsermasterService } from "../../../../../services/usermaster/usermaster.service";

let stateDisabledStatus: boolean = false;
let districtDisabledStatus: boolean = false;
let blockDisabledStatus: boolean = false;
@Component({
	selector: "kt-form",
	templateUrl: "./form.component.html",
	styleUrls: ["./form.component.scss"]
})
export class FormComponent implements OnInit {
	// String replacement for Filter JSON
	@replaceStringWith({
		string: [
			"{{url}}",
			"{{stateDisabled}}",
			"{{districtDisabled}}",
			"{{blockDisabled}}"
		],
		replaceWith: [
			localizationApiEndPoint,
			stateDisabledStatus,
			districtDisabledStatus,
			blockDisabledStatus
		],
		accessUpto: JSON.parse(sessionStorage.getItem("currentUser"))
			? [JSON.parse(sessionStorage.getItem("currentUser")).accessupto]
			: [""]
	})
	formFilter: Object = FormFilter;
	// String replacement for General Information modification JSON
	@replaceStringWith({
		string: [
			"{{url}}",
			"{{urlOld}}",
			"{{stateDisabled}}",
			"{{districtDisabled}}",
			"{{blockDisabled}}"
		],
		replaceWith: [
			localizationApiEndPoint,
			apiEndPoint,
			stateDisabledStatus,
			districtDisabledStatus,
			blockDisabledStatus
		],
		accessUpto: JSON.parse(sessionStorage.getItem("currentUser"))
			? [JSON.parse(sessionStorage.getItem("currentUser")).accessupto]
			: [""]
	})
	generalInformationForm: Object = GeneralInformationConfig;
	// String replacement for General Patient history JSON
	@replaceStringWith({
		string: ["{{url}}"],
		replaceWith: [localizationApiEndPoint],
		accessUpto: JSON.parse(sessionStorage.getItem("currentUser"))
			? [JSON.parse(sessionStorage.getItem("currentUser")).accessupto]
			: [""]
	})
	patientHistoryForm: Object = patientHistoryConfig;
	// String replacement for On admission JSON
	@replaceStringWith({
		string: ["{{url}}"],
		replaceWith: [localizationApiEndPoint],
		accessUpto: JSON.parse(sessionStorage.getItem("currentUser"))
			? [JSON.parse(sessionStorage.getItem("currentUser")).accessupto]
			: [""]
	})
	onAdmissionForm: Object = OnAdmissionConfig;
	// String replacement for Diagnosis 1  JSON
	@replaceStringWith({
		string: ["{{url}}"],
		replaceWith: [localizationApiEndPoint],
		accessUpto: JSON.parse(sessionStorage.getItem("currentUser"))
			? [JSON.parse(sessionStorage.getItem("currentUser")).accessupto]
			: [""]
	})
	diagnosisForm1: Object = Diagnosis1Config;
	// String replacement for Diagnosis 2 JSON
	@replaceStringWith({
		string: ["{{url}}"],
		replaceWith: [localizationApiEndPoint],
		accessUpto: JSON.parse(sessionStorage.getItem("currentUser"))
			? [JSON.parse(sessionStorage.getItem("currentUser")).accessupto]
			: [""]
	})
	diagnosisForm2: Object = Diagnosis2Config;
	// String replacement for Diagnosis 3 JSON
	@replaceStringWith({
		string: ["{{url}}"],
		replaceWith: [localizationApiEndPoint],
		accessUpto: JSON.parse(sessionStorage.getItem("currentUser"))
			? [JSON.parse(sessionStorage.getItem("currentUser")).accessupto]
			: [""]
	})
	diagnosisForm3: Object = Diagnosis3Config;
	// String replacement for Diagnosis 4 JSON
	@replaceStringWith({
		string: ["{{url}}"],
		replaceWith: [localizationApiEndPoint],
		accessUpto: JSON.parse(sessionStorage.getItem("currentUser"))
			? [JSON.parse(sessionStorage.getItem("currentUser")).accessupto]
			: [""]
	})
	diagnosisForm4: Object = Diagnosis4Config;
	// String replacement for Intervension JSON
	@replaceStringWith({
		string: ["{{url}}"],
		replaceWith: [localizationApiEndPoint],
		accessUpto: JSON.parse(sessionStorage.getItem("currentUser"))
			? [JSON.parse(sessionStorage.getItem("currentUser")).accessupto]
			: [""]
	})
	interventionsForm: Object = InterventionsConfig;
	// String replacement for Cause of Death JSON
	@replaceStringWith({
		string: ["{{url}}", "{{urlOld}}"],
		replaceWith: [localizationApiEndPoint, apiEndPoint],
		accessUpto: JSON.parse(sessionStorage.getItem("currentUser"))
			? [JSON.parse(sessionStorage.getItem("currentUser")).accessupto]
			: [""]
	})
	otherForm: Object = OtherConfig;
	// String replacement for Cause of Death JSON
	@replaceStringWith({
		string: ["{{url}}", "{{urlOld}}"],
		replaceWith: [apiEndPoint, localizationApiEndPoint],
		accessUpto: JSON.parse(sessionStorage.getItem("currentUser"))
			? [JSON.parse(sessionStorage.getItem("currentUser")).accessupto]
			: [""]
	})
	doctorDetailsForm: Object = DoctorConfig;
	@replaceStringWith({
		string: ["{{url}}", "{{urlOld}}"],
		replaceWith: [apiEndPoint, localizationApiEndPoint],
		accessUpto: JSON.parse(sessionStorage.getItem("currentUser"))
			? [JSON.parse(sessionStorage.getItem("currentUser")).accessupto]
			: [""]
	})
	conditionOnAdmissionForm: Object = ConditionOnAdmissionConfig;
	refreshForm = new EventEmitter();

	case_summary: string;
	place_of_death: any;
	@ViewChild("wizard", { static: true }) el: ElementRef;
	@ViewChildren("form4Ref") private forms: QueryList<FormioComponent>;

	dataSource = [];
	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: false }) sort: MatSort;
	step = 0;
	stepToEnable = false;
	diagnosisStep4Enable = false;
	showFiliter: boolean = true;
	records: Form1Object[] = [];
	selectedRecord: Form1Object;
	editRecordValue: Form4Object;
	showOnEdit: boolean = true;
	//only declare not used in code
	isLoadingResults;
	isMaxLimitReached;
	season;
	isShowFilterForm: boolean = true;

	currentUser?: any;

	/**
	 * @description General Information
	 */
	step1refresh = new EventEmitter();
	/**
	 * @description Pate]ient history
	 */
	step2refresh = new EventEmitter();
	/**
	 * @description On admission
	 */
	step3refresh = new EventEmitter();
	/**
	 * @description Condition on admission
	 */
	step4refresh = new EventEmitter();
	/**
	 * @description Diagnosis Form 1
	 */
	step5refresh_1 = new EventEmitter();
	/**
	 * @description Diagnosis Form 2
	 */
	step5refresh_2 = new EventEmitter();
	/**
	 * @description Diagnosis Form 3
	 */
	step5refresh_3 = new EventEmitter();
	/**
	 * @description Diagnosis Form 4
	 */
	step5refresh_4 = new EventEmitter();
	/**
	 * @description Interventions
	 */
	step6refresh = new EventEmitter();
	/**
	 * @description Other
	 */
	step7refresh = new EventEmitter();
	/**
	 * @description doctor-details
	 */
	step8refresh = new EventEmitter();


	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private activatedRoute: ActivatedRoute,
		private form4Service: Form4Service,
		private form1Service: Form1Service,
		private referralService: ReferralService,
		private alertService: AlertService,
		private router: Router,
		private _location: Location,
		private usermasterService: UsermasterService
	) { }

	// below function is useless right now
	onChange({ data }) {}

	onStep3Change({ data }) {
		if (data) {
			const {
				on_admission: { period_of_gestation }
			} = data;

			if (
				~[
					"Post - Partum up to 24hrs",
					"Post-natal 24hrs - 1 week",
					"Post-natal-More than 1 week to 42 days"
				].indexOf(period_of_gestation)
			) {
				this.diagnosisStep4Enable = true;
			} else {
				this.diagnosisStep4Enable = false;
			}
		}
	}

	fillFormDetails(data: Form1Object) {
		let formData: Form4Object;
		if (data.mdsrForm4s) {
			if (Array.isArray(data.mdsrForm4s)) {
				if (data.mdsrForm4s.length) formData = data.mdsrForm4s[0];
			} else {
				formData = data.mdsrForm4s;
			}
		}
		if (formData) {
			this.setFormData(formData);
		} else {
			this.step1refresh.emit({
				submission: {
					data: {
						state: data.state_id,
						district: data.district_id,
						block: data.block_id,
						deceased_women_id: data.id,

						general_information: {
							...data,
							state: data.state_id,
							district: data.district_id,
							block: data.block_id,

							//
							mobile: data.mobile,

							//
							facility_type: this.currentUser
								? this.currentUser.health_facility_type
								: undefined,
							facility: this.currentUser
								? {
									health_facility_code: this.currentUser
										.health_facility_primary_key_id
								}
								: undefined,
							name_of_nodal_person: this.currentUser
								? `${this.currentUser.firstname} ${this.currentUser.middlename} ${this.currentUser.lastname}`.replace(
									/\s\s/g,
									" "
								)
								: undefined,
							mobile_of_nodal_person: this.currentUser
								? this.currentUser.mobilenumber
								: undefined
						}
					}
				}
			});
			this.step2refresh.emit({
				submission: {
					data: {
						patient_history: {
							death_date_time: data.death_date_time
						}
					}
				}
			});
		}
	}
	closeForm: boolean = false;
	onSubmit(closeForm?: boolean) {
		this.closeForm = closeForm;
		const data: any = this.getFormObject();
		const _data: any = new Form4Object(data);
		let refObj = {
			deceased_women_id: _data.deceased_women_id,
			form_name: "Form 4",
			home_or_village: data.home_or_village,
			facility1: data.facility1,
			facility2: data.facility2,
			facility3: data.facility3,
			facility4: data.facility4,
			facility5: data.facility5
		};
		delete _data.home_or_village;
		delete _data.facility1;
		delete _data.facility2;
		delete _data.facility3;
		delete _data.facility4;
		delete _data.facility5;
		delete _data.referraldetails;

		_data.case_summary = this.case_summary;
		if (this.editRecordValue) {
			_data.id = this.editRecordValue.id;
			this.updateRecord(new Form4Object(_data), refObj,closeForm);
		} else {
			_data.deceased_women_id = this.selectedRecord['id'];
			if (this.selectedRecord.hasOwnProperty("id")) {
				_data.deceased_women_id_new = this.selectedRecord['id'];
			} else { _data.deceased_women_id_new = this.selectedRecord; }

			this.addRecord(new Form4Object(_data), refObj,closeForm);
		}

	}

	private addRecord(request: Form4Object, refObj,closeForm?:boolean) {
		this.form4Service.add(request).subscribe(res => {
			refObj["form_id"] = res["id"];
			this.addUpdateReferralTable(refObj, "add", closeForm?"Record added successfully! Now You can Submit form 6":'Record added successfully.');
		});
	}

	private updateRecord(request: Form4Object, refObj,closeForm?:boolean) {
		this.form4Service.update(request).subscribe(response => {
			refObj["form_id"] = response["id"];
			this.addUpdateReferralTable(
				refObj,
				"update",
				closeForm?"Record updated successfully! Now you can submit form 6":"Record updated successfully!"
			);
		});
	}

	private onSuccess(title: string, formId?: string, type?: string) {
		this.alertService.fireAlert({ title, icon: "success" });
		const nextStep = this.wizard.getStep()+1;
		if (formId && type === 'add') {
			this.router.navigateByUrl(`/mdsr/form4/${formId}?next=${nextStep}`);
		}else if(formId && type === 'update'){
			this.router.navigateByUrl(`/mdsr/form4/${formId}?next=${nextStep}`);
		}
		this.wizard.goTo(nextStep);
		if (this.closeForm) {
			this.router.navigateByUrl("/mdsr/form4");
		}
	}

	private addUpdateReferralTable(
		object: any,
		type: "add" | "update",
		successMessage: string
	) {
		if (type == "add") {
			this.referralService.add(object).subscribe(() => {
				this.onSuccess(successMessage, object["form_id"], type);
			});
		} else {
			const referral = Array.isArray(this.editRecordValue.referraldetails)
				? this.editRecordValue.referraldetails[0]
				: this.editRecordValue.referraldetails;
			this.referralService.update(object, referral.id).subscribe(() => {
				this.onSuccess(successMessage, object['form_id'],type);
			});
		}
	}

	private setFormData(object: Form4Object) {
		this.editRecordValue = object;
		this.case_summary = object.case_summary;
		const referral = Array.isArray(object.referraldetails)
			? object.referraldetails[0]
			: object.referraldetails;
		this.step1refresh.emit({
			submission: {
				data: {
					state: object.general_information.state,
					district: object.general_information.district,
					block: object.general_information.block,
					facility_type: object.general_information.facility_type,
					facility: object.general_information.facility,
					month: object.month,
					year: object.year,
					mobile: object.mobile,
					address: object.address,
					fbmdr_no: object.fbmdr_no,
					name_of_nodal_person: object.name_of_nodal_person,
					general_information: {
						...object.general_information
					}
				}
			}
		});
		//

		this.step2refresh.emit({
			submission: {
				data: {
					patient_history: {
						...object.patient_history,
						admission_date_time: object.patient_history.admission_date_time && object.patient_history.admission_date_time!=="1970-01-01T00:00:00.000Z"?object.patient_history.admission_date_time:null,
						delivery_date_time: object.patient_history.delivery_date_time && object.patient_history.delivery_date_time!=="1970-01-01T00:00:00.000Z"?object.patient_history.delivery_date_time:null
						//death_date_time: object.general_information.death_date_time
					}
				}
			}
		});
		//
		this.step3refresh.emit({
			submission: {
				data: {
					on_admission: {
						...object.on_admission,
						abortion_have_total: object.on_admission.total_abortion > 0,
						alive_children_have_total:
							object.on_admission.alive_children_total > 0
					}
				}
			}
		});
		//
		this.step4refresh.emit({
			submission: {
				data: {
					condition_on_admission: {
						...object.condition_on_admission
					},
					...referral
				}
			}
		});
		//
		this.step5refresh_1.emit({
			submission: {
				data: {
					diagnosis: {
						hemorrhage: object.diagnosis.hemorrhage,
						hypertensive: object.diagnosis.hypertensive,
						hypertensive_cause: {
							gestationalHypertension:
								object.diagnosis.hypertensive_cause.gestationalHypertension,
							preEclampsia: object.diagnosis.hypertensive_cause.preEclampsia,
							eclampsia: object.diagnosis.hypertensive_cause.eclampsia,
							others: object.diagnosis.hypertensive_cause.others
						},
						hypertensive_other: object.diagnosis.hypertensive_other,
						labour: object.diagnosis.labour,
						medical_disorder: object.diagnosis.medical_disorder,
						infection: object.diagnosis.infection,
						incidental: object.diagnosis.incidental,
						other: object.diagnosis.other,
						hemorrhage_causes: object.diagnosis.hemorrhage_causes,
						hemorrhage_placental_cause:
							object.diagnosis.hemorrhage_placental_cause,
						hemorrhage_late_pregnancy:
							object.diagnosis.hemorrhage_late_pregnancy,
						hemorrhage_late_pregnancy_other:
							object.diagnosis.hemorrhage_late_pregnancy_other,
						hemorrhage_postpartum: object.diagnosis.hemorrhage_postpartum,
						labour_cause: object.diagnosis.labour_cause,
						labour_other: object.diagnosis.labour_other,
						medical_disorders_cause: object.diagnosis.medical_disorders_cause,
						medical_disorders_other: object.diagnosis.medical_disorders_other,
						infection_cause: object.diagnosis.infection_cause,
						infection_causes_other: object.diagnosis.infection_causes_other,
						incidental_specify: object.diagnosis.incidental_specify,
						other_specify: object.diagnosis.other_specify
					}
				}
			}
		});
		//
		this.step5refresh_2.emit({
			submission: {
				data: {
					abortion: {
						...object.abortion
					}
				}
			}
		});
		//
		this.step5refresh_3.emit({
			submission: {
				data: {
					antenatal_care: {
						...object.antenatal_care
					}
				}
			}
		});
		//
		this.step5refresh_4.emit({
			submission: {
				data: {
					neonatal_info: {
						...object.neonatal_info
					}
				}
			}
		});
		//
		this.step6refresh.emit({
			submission: {
				data: {
					interventions: {
						...object.interventions
					}
				}
			}
		});

		this.step8refresh.emit({
			submission: {
				data: {
					doctor: {
						...object.doctor
					}
				}
			}
		});
		//
		const _obj: any = Object.assign({}, object);

		delete _obj.state;
		delete _obj.district;
		delete _obj.block;
		delete _obj.facility_type;
		delete _obj.facility;
		delete _obj.month;
		delete _obj.year;
		delete _obj.mobile;
		delete _obj.address;
		delete _obj.fbmdr_no;
		delete _obj.name_of_nodal_person;
		delete _obj.general_information;
		delete _obj.patient_history;
		delete _obj.on_admission;
		delete _obj.condition_on_admission;
		delete _obj.diagnosis;
		delete _obj.interventions;
		delete _obj.abortion;
		delete _obj.antenatal_care;
		delete _obj.neonatal_info;

		this.step7refresh.emit({
			submission: {
				data: { ..._obj }
			}
		});
		//
		setTimeout(() => {
			this.changeDetectorRef.detectChanges();
		}, 1000);
	}

	// SECTION 5::START
	setStep(index: number) {
		this.step = index;
	}

	nextStep(skip?: boolean) {
		!skip ? this.step++ : (this.step += 2);
	}

	prevStep(skip?: boolean) {
		!skip ? this.step-- : (this.step -= 2);
	}

	diagnosisForm1Change($event) {
		if ($event.data && $event.data.diagnosis.hemorrhage === "yes")
			this.stepToEnable = $event.data.diagnosis.hemorrhage_causes.abortion;
		else this.stepToEnable = false;
	}
	// SECTION 5::END

	formLoaded() {
		setTimeout(() => {
			this.changeDetectorRef.detectChanges();
		}, 500);
	}

	ngOnInit() {
		this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
		setTimeout(() => this.changeDetectorRef.detectChanges(), 500);
	}
	wizard;
	saveAndNextStep;
	ngAfterViewInit(): void {
		this.activatedRoute.queryParams.subscribe(res => {
			this.saveAndNextStep = res['next'];
		})
		// Initialize form wizard
		this.wizard = new KTWizard(this.el.nativeElement, {
			startStep: this.saveAndNextStep || 1,
			clickable: false,
			navigation: false
		});

		// Validation before going to next page
		this.wizard.on("beforeNext", function (wizardObj) {
			// https://angular.io/guide/forms
			// https://angular.io/guide/form-validation
			// validate the form and use below function to stop the wizard's step
			// wizardObj.stop();
		});

		// Change event
		this.wizard.on("change", function (wizard) {
			setTimeout(function () {
				KTUtil.scrollTop();
				var elementLeft = wizard.steps[wizard.currentStep - 1].offsetLeft;
				var scollContainer = document.getElementById("scrollbar");
				if (scollContainer) {
					scollContainer.scrollLeft = elementLeft - scollContainer.offsetLeft - 52;
				}
			}, 300);
		});

		this.activatedRoute.params.subscribe(({ id }) => {
			if (id) {
				this.form4Service
					.getOne(id, {
						include: [
							"referraldetails",
							"state",
							"district",
							"block",
							"facility"
						]
					})
					.subscribe(response => {
						this.showFiliter = false;
						this.showOnEdit = false;
						this.setFormData(response);
					});
			}else{
				let data: Form1Object;
				if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras) {
					data = <Form1Object>this.router.getCurrentNavigation().extras.state.data;
				}
				data = !data ? <Form1Object>JSON.parse(localStorage.getItem("data")) : data;
				this.selectedRecord = data;
				this.editRecordValue = null;
				this.fillFormDetails(data);
			}
		});
	}
	backClicked() {
		//this._location.back();
		this.router.navigateByUrl("/mdsr/form4");
	}
	onClick() {
		this.isShowFilterForm = !this.isShowFilterForm;
		this.changeDetectorRef.detectChanges();
	}

	nextButton() {
		const data = this.getFormObject();
		const form4Object = new Form4Object(data);
		this.form4Service.add(form4Object).subscribe(res => {

		})
	}

	getFormObject() {
		const forms = this.forms.toArray();
		const data: any = forms.reduce((accumulator, currentValue) => {
			const obj = {
				...accumulator,
				...currentValue.formio.submission.data
			};
			return obj;
		}, {});
		return data;
	}

	pdfGeneration(){
		this.router.navigateByUrl(`/mdsr/form4/pdf/${this.editRecordValue.id}`);
	}
}
