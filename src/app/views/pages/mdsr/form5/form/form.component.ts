import {
	Component,
	OnInit,
	ChangeDetectorRef,
	ViewChild,
	ElementRef,
	AfterViewInit,
	EventEmitter,
	ViewChildren,
	QueryList
} from "@angular/core";
import FormFilter from "./form5-filter.json";
import GeneralInformationConfig from "./form5-1.json";
import Module1Config from "./form5-2-module-1.json";
import Module2Config from "./form5-3-module-2.json";
import Module3Config from "./form5-4-module-3.json";
import DetailInfoConfig from "./form5-detail-info-table.json";
import OtherConfig from "./form5-6-other.json";
import { Form1Service } from "../../../../../services/mdsr/form1.service";
import { Form5Service } from "../../../../../services/mdsr/form5.service";
import { Form1Object } from "../../../../../models/forms/mdsr/form1";
import { Form5Object } from "../../../../../models/forms/mdsr/form5";
import { replaceStringWith } from "../../../../../utilities/decorators/replace-string-with";
import {
	localizationApiEndPoint,
	apiEndPoint
} from "../../../../../utilities/api";
import { FormioComponent, FormioOptions } from "angular-formio";
import { AlertService } from "../../../../../utilities/alert.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ReferralService } from "../../../../../services/referral/referral.service";
import { Location } from "@angular/common";
type ModuleFillType = "module 2" | "module 3";
let stateDisabledStatus: boolean = false;
let districtDisabledStatus: boolean = false;
let blockDisabledStatus: boolean = false;
@Component({
	selector: "kt-form",
	templateUrl: "./form.component.html",
	styleUrls: ["./form.component.scss"]
})
export class FormComponent implements OnInit, AfterViewInit {
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
	place_of_death: any;
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
	module1Form: Object = Module1Config;

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
	module2Form: Object = Module2Config;

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
	module3Form: Object = Module3Config;

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
	detailInfo: object = DetailInfoConfig;

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
	otherForm: any = OtherConfig;

	case_summary: string;

	moduleFill: ModuleFillType | null;
	fillReferDetails: boolean = true;
	refreshForm = new EventEmitter();
	@ViewChild("wizard", { static: true }) el: ElementRef;
	@ViewChildren("form5Ref") private forms: QueryList<FormioComponent>;
	@ViewChild("detailsInfoRef", { static: true })
	private detailsInfoRef: FormioComponent;

	records: Form1Object[] = [];
	selectedRecord: Form1Object;
	showOnEdit: boolean = true;
	showFiliter: boolean = true;
	isShowFilterForm: boolean = true;
	editRecordeValue: Form5Object;
	currentUser?: any;
	/**
	 * @description General Information
	 */
	setp1refresh = new EventEmitter();
	/**
	 * @description Module 1
	 */
	setp2refresh = new EventEmitter();
	/**
	 * @description Module 2
	 */
	setp3refresh = new EventEmitter();
	/**
	 * @description Module 3
	 */
	setp4refresh = new EventEmitter();
	/**
	 * @description referral table
	 */
	setp5refresh = new EventEmitter();
	/**
	 * @description Other
	 */
	setp6refresh = new EventEmitter();

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private form1Service: Form1Service,
		private form5Service: Form5Service,
		private alertService: AlertService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private referralService: ReferralService,
		private _location: Location
	) {
		new Form5Object();
	}

	fillFormDetails(data: Form1Object) {
		let formData: Form5Object;
		if (data.mdsrForm5s) {
			if (Array.isArray(data.mdsrForm5s)) {
				if (data.mdsrForm5s.length) formData = data.mdsrForm5s[0];
			} else {
				formData = data.mdsrForm5s;
			}
		}

		if (formData) {
			this.setFormData(formData);
		} else {
			let name = data.deceased_women_fname;
			if (data.deceased_women_mname) {
				name += ` ${data.deceased_women_mname}`;
			}
			if (data.deceased_women_lname) {
				name += ` ${data.deceased_women_lname}`;
			}
			setTimeout(() => {
				this.setp1refresh.emit({
					submission: {
						data: {
							generalinformation: {
								...data,
								state: data.state_id,
								district: data.district_id,
								block: data.block_id,
								investigators: [
									{
										investigator_name: "",
										investigator_designation: ""
									},
									{
										investigator_name: "",
										investigator_designation: ""
									},
									{
										investigator_name: "",
										investigator_designation: ""
									}
								]
							}
						}
					}
				});

				this.setp2refresh.emit({
					submission: {
						data: {
							module1: {
								background_info: {
									deceased_women_name: name
								}
							}
						}
					}
				})
			}, 500)


		}
	}

	setFormData(object: Form5Object) {
		this.editRecordeValue = object;
		this.case_summary = object.other.case_summary;
		this.setp1refresh.emit({
			submission: {
				data: {
					generalinformation: {
						...object.generalinformation,
						state: object.generalinformation.state_id,
						district: object.generalinformation.district_id,
						block: object.generalinformation.block_id,
						facility: object.generalinformation.facility_id,
						village: object.village
					}
				}
			}
		});
		//
		const obj = {
			...object.module1
		};
		(obj.gpla as any).abortion_have_total =
			object.module1.gpla.total_abortion > 0;

		(obj.gpla as any).alive_children_have_total =
			object.module1.gpla.alive_children_total > 0;

		this.setp2refresh.emit({
			submission: {
				data: {
					module1: {
						...obj,
						background_info: {
							...obj.background_info,
							death_date_time: obj.background_info.death_date_time === '' || obj.background_info.death_date_time === "1970-01-01T00:00:00.000Z" ? object.generalinformation.death_date_time : obj.background_info.death_date_time,
							deceased_women_name: obj.background_info.deceased_women_name ? obj.background_info.deceased_women_name : `${object.generalinformation.deceased_women_fname} ${object.generalinformation.deceased_women_mname} ${object.generalinformation.deceased_women_lname}`
						}
					}
				}
			}
		});
		this.setp3refresh.emit({
			submission: {
				data: {
					module2: {
						...object.module2
					}
				}
			}
		});
		//
		this.setp4refresh.emit({
			submission: {
				data: {
					module3: {
						...object.module3
					}
				}
			}
		});

		const referral = Array.isArray(object.referraldetails) ? object.referraldetails[0] : object.referraldetails;
		this.setp5refresh.emit({
			submission: {
				data: {
					...referral
				}
			}
		});
		//
		this.setp6refresh.emit({
			submission: {
				data: {
					other: {
						...object.other
					}
				}
			}
		});
		//
		this.changeDetectorRef.detectChanges();
	}
	closeForm: boolean = false;
	onSubmit(closeForm?: boolean) {
		this.closeForm = closeForm;
		const data: any = this.forms.reduce(
			(accumulator, currentValue) => {
				return ({
					...accumulator,
					...currentValue.formio.submission.data
				})
			},
			{}
		);

		data.generalinformation.facility_type = `${data.generalinformation.facility_type.facilitytypename} (${data.generalinformation.facility_type.shortname})`;
		data.other.case_summary = this.case_summary;

		if (this.editRecordeValue) {
			data.id = this.editRecordeValue.id;
			this.updateRecord(new Form5Object(data), closeForm);
		} else {
			data.deceased_women_id = this.selectedRecord['id'];
			if (this.selectedRecord.hasOwnProperty("id")) {
				data.deceased_women_id_new = this.selectedRecord['id'];
			} else { data.deceased_women_id_new = this.selectedRecord; }
			this.addRecord(new Form5Object(data), closeForm);
		}
	}

	private addRecord(request: any, closeForm?: boolean) {
		this.form5Service.add(request).subscribe(response => {
			this.addUpdateReferralTable(response, "add", closeForm ? "Record added successfully! Now You can Submit form 6" : 'Record added successfully.');
		});
	}

	private updateRecord(request: any, closeForm?: boolean) {
		this.form5Service.update(request).subscribe(response => {
			this.addUpdateReferralTable(
				response,
				"update",
				closeForm ? "Record updated successfully! Now you can submit form 6" : "Record updated successfully!"
			);
		});
	}
	click(){
		alert("Called for previous...")
	}
	private onSuccess(title: string, data?: Form5Object, type?: string) {
		this.alertService.fireAlert({ title, icon: "success" });
		let nextStep = this.wizard.getStep();
		if (this.moduleFill === 'module 2' && nextStep === 2) {
				nextStep += 1;
		}else if (this.moduleFill === 'module 2' && nextStep === 3) {
			if (data.module2.death_during_antenatal_period.care_of_complication === 'Yes') {
				nextStep = nextStep + 2;
			} else if (data.module2.death_during_antenatal_period.care_of_complication === 'No') {
				nextStep = nextStep + 3
			}else{
				nextStep = nextStep + 3;
			}
		} else if (this.moduleFill === 'module 3' && nextStep === 2) {
			nextStep = nextStep + 2;
		} else {
			nextStep++;
		}

		const id = data['id'];
		if (id && type === 'add') {
			this.router.navigateByUrl(`/mdsr/form5/${id}?next=${nextStep}`);
			this.wizard.goTo(nextStep)
		} else if (id && type === 'update') {
			this.router.navigateByUrl(`/mdsr/form5/${id}?next=${nextStep}`);
			this.wizard.goTo(nextStep)
		}
		if (this.closeForm) {
			this.router.navigateByUrl("/mdsr/form5");
		}
	}

	private addUpdateReferralTable(
		object: Form5Object,
		type: "add" | "update",
		successMessage: string
	) {
		if (this.fillReferDetails) {
			const referralDetails = this.detailsInfoRef.formio.submission.data;
			referralDetails.deceased_women_id = object.deceased_women_id;
			referralDetails.form_id = object.id;
			referralDetails.form_name = "form 5";
			referralDetails.module_name = this.moduleFill;
			if (type == "add") {
				this.referralService.add(referralDetails).subscribe(() => {
					this.onSuccess(successMessage, object, type);
				});
			} else {
				const length = this.editRecordeValue.referraldetails && Array.isArray(this.editRecordeValue.referraldetails) && this.editRecordeValue.referraldetails.length
				const referral = Array.isArray(this.editRecordeValue.referraldetails) && length
					? this.editRecordeValue.referraldetails[0]
					: referralDetails;
				this.referralService.update(referralDetails, referral.id)
					.subscribe(() => {
						this.onSuccess(successMessage, object, type);
					});
			}
		} else {
			this.onSuccess(successMessage, object, type);
		}
	}

	stepDataChange({ data }) {
		if (data) {
			if (data.module1) {
				switch (data.module1.background_info.period_of_death) {
					case "During abortion or within 6 weeks after abortion":
					case "During pregnancy":
						this.moduleFill = "module 2";
						break;

					case "During delivery":
					case "Within 42 days after delivery":
						this.moduleFill = "module 3";
						break;

					default:
						this.moduleFill = null;
						break;
				}
				// module 2 to be filled if anc is received
				// comment because module 3 and module 2 open is conflicting if antenatal_care_received is yes
				// if (data.module1.current_pregnancy.antenatal_care_received === 'Yes') {
				// 	this.moduleFill = "module 2";
				// }
			} else if (data.module2) {
				if (
					this.moduleFill == "module 2" &&
					data.module2.death_during_antenatal_period.care_of_complication ==
					"Yes"
				) {
					this.fillReferDetails = true;
				} else {
					this.fillReferDetails = false;
				}
			} else if (data.module3) {
				// TODO: update logic
				if (this.moduleFill == "module 3") {
					this.fillReferDetails = true;
				} else {
					this.fillReferDetails = false;
				}
				//this.fillReferDetails = false;
			}
		}
	}

	ngOnInit() {
		this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
		if (this.currentUser.designation == "Facility" || this.currentUser.designation == "FNO") {
			this.place_of_death = { inq: ["Health Facility"] }
		} else {
			this.place_of_death = { inq: ["Home", "Transit", "Other", "Health Facility"] }
		}
	}
	wizard;
	step;
	ngAfterViewInit(): void {

		this.activatedRoute.queryParams.subscribe(res => {
			this.step = res['next'];
		})

		this.wizard = new KTWizard(this.el.nativeElement, {
			startStep: this.step || 1,
		});

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
				scollContainer.scrollLeft =
					elementLeft - scollContainer.offsetLeft - 52;
			}, 500);
		});

		this.activatedRoute.params.subscribe(({ id }) => {

			if (id) {
				this.form5Service
					.getOne(id, {
						include: [
							"referraldetails"
						]
					})
					.subscribe(response => {
						this.showFiliter = false;
						this.showOnEdit = false;
						this.setFormData(response);
					});
			} else {
				let data: Form1Object;
				if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras) {
					data = <Form1Object>this.router.getCurrentNavigation().extras.state.data;
				}
				data = !data ? <Form1Object>JSON.parse(localStorage.getItem("data")) : data;
				this.selectedRecord = data;
				this.editRecordeValue = null;
				this.fillFormDetails(data);
			}
		});

		setTimeout(() => {
			this.changeDetectorRef.detectChanges();
		}, 500);
	}
	backClicked() {
		this.router.navigateByUrl("/mdsr/form5")
	}
	onClick() {
		this.isShowFilterForm = !this.isShowFilterForm;
		this.changeDetectorRef.detectChanges();
	}

	pdfGeneration(){
		this.router.navigateByUrl(`/mdsr/form5/pdf/${this.editRecordeValue.id}`)
		//this.router.navigateByUrl("/mdsr/form5/pdf")
	}
}
