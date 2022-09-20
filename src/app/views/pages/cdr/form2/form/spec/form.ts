import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomValidator } from '../../../../../../utilities/validators/reactiveValidators';

const addressForm = () =>
	new FormGroup({
		state: new FormControl("", [Validators.required]),
		district: new FormControl("", [Validators.required]),
		block: new FormControl("", [Validators.required]),
		village: new FormControl("", []),
		colony: new FormControl("", []),
		house_number: new FormControl(""),
		pincode: new FormControl("", [
			Validators.minLength(6),
			Validators.maxLength(6),
			CustomValidator.numberOnly
		]),
		landmark: new FormControl(),
	});

const symptomsDuringIllness = () =>
	new FormGroup({
		inability_to_feed: new FormControl("No", [Validators.required]),
		inability_to_feed_days: new FormControl("", []),
		fever: new FormControl("No", [Validators.required]),
		fever_days: new FormControl("", []),
		loose_stools: new FormControl("No", [Validators.required]),
		loose_stools_days: new FormControl("", []),
		vomiting: new FormControl("No", [Validators.required]),
		vomiting_days: new FormControl("", []),
		fast_breathing: new FormControl("No", [Validators.required]),
		fast_breathing_days: new FormControl("", []),
		convulsions: new FormControl("No", [Validators.required]),
		convulsions_days: new FormControl("", []),
		appearance_of_skin_rashes: new FormControl("No", [Validators.required]),
		appearance_of_skin_rashes_days: new FormControl("", []),
		injury: new FormControl("No", [Validators.required]), // TODO: add info bubble [like fractures, wounds]
		injury_days: new FormControl("", []),
		other: new FormControl("", []),
		other_days: new FormControl("", []),
	});

export const sectionA = () =>
	new FormGroup({
		child_name: new FormControl("", [Validators.required, CustomValidator.alphaOnly]),
		date_of_birth: new FormControl("", []),
		age: new FormControl("", [Validators.required]), // TODO:IN [years, months] if < 1 month [days] if < 1 day [hours]
		sex: new FormControl("", [Validators.required]),
		address: addressForm(),
		phc_area_name: new FormControl("", [Validators.required]),
		sub_center_name: new FormControl("", [Validators.required]),
		order_of_birth: new FormControl("", [Validators.required]),
		belongs_to: new FormControl("", [Validators.required]),
		below_poverty_line: new FormControl("", [Validators.required]),
		immunization_status: new FormControl("", [Validators.required]),
		weight: new FormControl("", [
			Validators.required,Validators.min(400),
			Validators.max(15000),
			CustomValidator.decimalNumber]),
		growth_curve: new FormControl("", []),
		any_ho_illness_injury: new FormControl("", [Validators.required]), // below input is applicable if answer is yes
		nature_of_illness: new FormControl("", []), // required if [any_ho_illness_injury == 'yes']
		symptoms_during_illness: symptomsDuringIllness(), // TODO: required if [any_ho_illness_injury == 'yes']
		treatment_for_illness_was_taken: new FormControl("No", []), // TODO: required if [any_ho_illness_injury == 'yes']
		where_was_child_treated: new FormControl("", []), // TODO: required if [treatment_for_illness_was_taken == 'yes'] and multiselect
	});

export const sectionB = () =>
	new FormGroup({
		diarrhoea: new FormControl(false),
		pneumonia: new FormControl(false),
		malaria: new FormControl(false),
		measles: new FormControl(false),
		septicemia: new FormControl(false),
		meningitis: new FormControl(false),
		injury: new FormControl(false),
		other: new FormControl("", []),
		no_identifiable_cause: new FormControl(true, []), // TODO: should be true if all above is false and "other == ''"
	});

export const sectionC = () =>
	new FormGroup({
		cause_of_death: new FormControl("", [Validators.required]),
	});

export const sectionD = () =>
	new FormGroup({
		delay_at_home: new FormControl(false),
		delay_in_transportation: new FormControl(false),
		delay_at_facility: new FormControl(false),
	});

export const sectionE = () =>
	new FormGroup({
		case_summary: new FormControl("", [Validators.required]),
	});

export const investigationReportForm = () =>
	new FormGroup({
		sectionA: sectionA(),
		sectionB: sectionB(),
		sectionC: sectionC(),
		sectionD: sectionD(),
		sectionE: sectionE(),
	});
