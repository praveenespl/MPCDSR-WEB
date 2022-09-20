import {
	Component,
	OnInit,
	AfterViewInit,
	ViewChild,
	ElementRef,
	ChangeDetectorRef,
} from "@angular/core";
import { neonatalDeathdForm } from "./specs/form";
import { FormGroup, Validators } from "@angular/forms";
import { startWith, pairwise, take, switchMap } from "rxjs/operators";
import { getValueChangesInObjects } from "../../../../../../utilities/functions";
import { ActivatedRoute, Router } from "@angular/router";
import { CdrForm3CService } from "../../../../../../services/cdr/form3c.service";
import { CdrForm1Service } from "../../../../../../services/cdr/form1.service";
import { AlertService } from "../../../../../../utilities/alert.service";
import moment from "moment";
@Component({
	selector: "kt-form",
	templateUrl: "./form.component.html",
	styleUrls: ["./form.component.scss"],
})
export class FormComponent implements OnInit, AfterViewInit {
	@ViewChild("wizard", { static: true }) wizard: ElementRef;
	isSubmitted: boolean = false;
	viewOnly: boolean = false;
	form: FormGroup;

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private cdrForm3CService: CdrForm3CService,
		private cdrForm1Service: CdrForm1Service,
		private alertService: AlertService
	) { }

	onSubmit() {
		if (this.form.invalid) {
			this.isSubmitted = true;
			this.alertService.fireAlert({ icon: "error", title: "Form is invalid. Please fill the mandatory inputs." });
			return;
		}
		this.isSubmitted = false;
		const data = this.form.value;

		console.log("[form 3C]", JSON.stringify(data));
		let isEdit = false;
		data.cdr_id = this.cdr_id;
		this.activatedRoute.params
			.pipe(
				take(1),
				switchMap(({ id }) => {
					if (id) {
						isEdit = true;
						return this.cdrForm3CService.update(data, id);
					}
					return this.cdrForm3CService.add(data);
				})
			)
			.subscribe((response) => {
				this.alertService.fireAlert({
					icon: "success",
					title: `Record ${isEdit ? "updated" : "added"} successfully!`,
					showConfirmButton: false,
				});
				this.router.navigate(["/cdr/form3/c"]);
			});
	}

	private initForm() {
		this.form = neonatalDeathdForm;
		let totalAmt = 0; let treatment = 0; let transport = 0; let others = 0;
		this.form.valueChanges
			.pipe(startWith(this.form.value), pairwise())
			.subscribe(([prevValue, nextValue]) => {
				const changes = getValueChangesInObjects(prevValue, nextValue);
				// Section A:start
				if (changes.hasOwnProperty("sectionA")) {
					const sectionA = changes.sectionA;
					// actual place of death set start
					// if (sectionA.hasOwnProperty("place_of_death")) {
					// 	if (sectionA["place_of_death"] == "On way to health facility/in transit") {
					// 		this.form.get(["sectionA", "actual_place_of_death"]).setValidators([Validators.required]);
					// 		this.form.get(["sectionA", "actual_place_of_death"]).updateValueAndValidity();
					// 	} else {
					// 		(<FormGroup>this.form.controls['sectionA']).controls['actual_place_of_death'].patchValue('');
					// 		//this.form.get(["sectionA","actual_place_of_death"]).setValue("");
					// 		this.form.get(["sectionA", "actual_place_of_death"]).setValidators([]);
					// 		this.form.get(["sectionA", "actual_place_of_death"]).updateValueAndValidity();
					// 	}
					// }
					//end actual death of work
				}
				// Section A:end
				// Section D:start total amount work
				if (changes.hasOwnProperty("sectionD")) {
					const sectionD = changes.sectionD;

					if (sectionD.hasOwnProperty("treatment")) {
						treatment = parseInt(sectionD['treatment']) ? parseInt(sectionD['treatment']) : 0;
					}
					if (sectionD.hasOwnProperty("transport")) {
						transport = parseInt(sectionD['transport']) ? parseInt(sectionD['transport']) : 0;
					}
					if (sectionD.hasOwnProperty("others")) {
						others = parseInt(sectionD['others']) ? parseInt(sectionD['others']) : 0;
					}
					totalAmt = treatment + transport + others;
					(<FormGroup>this.form.controls['sectionD']).controls['total_amount'].patchValue(totalAmt);
					this.form.get(["sectionD", "total_amount"]).updateValueAndValidity();
				}
				//end total amount work
			});
	}

	ngAfterViewInit(): void {
		// // Initialize form wizard
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

				case 5:
					invalid = this.form.get("sectionD").invalid;
					break;

				default:
					break;
			}
			if (invalid) {
				this.alertService.fireAlert({
					icon: "error",
					title: "Form is invalid. Please fill the mandatory inputs.",
				});
				this.isSubmitted = true;
				wizardObj.stop();
				this.changeDetectorRef.detectChanges();
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
	cdr_id;
	ngOnInit() {
		this.initForm();

		const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
		let statecode: string;
		if (currentUser) {
			statecode = currentUser.user_state_id.statecode;
		}
		if(this.activatedRoute.snapshot.queryParams){
			this.viewOnly = this.activatedRoute.snapshot.queryParams.view==='true'?true:false;
		}
		this.activatedRoute.params.pipe(take(1)).subscribe(({ id, cdrForm1Id }) => {
			if (id) {
				this.cdrForm3CService.getOne(id).subscribe((response) => {
					this.form.patchValue(response);
					const sectionD={
						total_amount:response['sectionD']['total_amount']
					}
					this.form.patchValue({ sectionD},{ emitEvent: false });
					setTimeout(() => {
						this.changeDetectorRef.detectChanges();
					}, 500);
				});
			}

			if (cdrForm1Id) {
				this.cdr_id = cdrForm1Id;
				let filter = { include: ['cdrForm2s', 'cdrForm3s','cdrForm3bs'] }
				this.cdrForm1Service.getOne(cdrForm1Id, filter).subscribe((response) => {
					this.form.patchValue(response);
					const age = moment(response.date_of_death).diff(response.date_of_birth, "days");
					if(age<29){
						const basic = {
							mcts_number: response['cdrForm3s'][0]['basic']['mcts_number'],
						};
						const sectionA={
							informant_relation:response['cdrForm3s'][0]['sectionA']['respondent_relation'],
							place_of_death:response['cdrForm3s'][0]['sectionA']['place_of_death'],
							cast:response['cdrForm3s'][0]['sectionA']['category'],
						}
						this.form.patchValue({ basic,sectionA},{ emitEvent: false });
					}else if(age>28){
						const basic = {
							mcts_number: response['cdrForm3bs'][0]['basic']['mcts_number'],
						};
						const sectionA={
							informant_relation:response['cdrForm3bs'][0]['sectionA']['respondent_relation'],
							place_of_death:response['cdrForm3bs'][0]['sectionA']['place_of_death'],
							cast:response['cdrForm3bs'][0]['sectionA']['category'],
						}
						this.form.patchValue({ basic,sectionA},{ emitEvent: false });
					}
					console.log("response", response);
					
					setTimeout(() => {
						this.changeDetectorRef.detectChanges();
					}, 500);
				});
			}
		});
	}

	backClicked() {
		this.router.navigateByUrl("/cdr/form3/c");
	}
}
