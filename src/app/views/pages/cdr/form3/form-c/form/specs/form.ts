import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomValidator } from "../../../../../../../utilities/validators/reactiveValidators";

const basic = new FormGroup({
	mcts_number: new FormControl("", [
		Validators.maxLength(12),
		Validators.minLength(12)]),
});

const sectionA = new FormGroup({
	// Name of key Informant
	informant_name: new FormControl("", [Validators.required]),
	// Relation of key informant to deceased
	informant_relation: new FormControl("", [Validators.required]), // Array ['Brother/Sister', 'Mother/Father', 'Neighbour/No relationGrandfather/Grandmother', 'Other relative']
	// Place of death of child
	place_of_death: new FormControl("", [Validators.required]), // ['Home', 'On way to health facility/in transit', 'Sub Center', 'PHC/CHC/Rural Hospital', 'District Hospital', 'Medical College', 'Private Hospital', 'Other', 'DNK']
	actual_place_of_death:new FormControl("", []),
	place_of_death_other: new FormControl("", []), // if [place_of_death == 'Other']
	// Telephone/Mobile Number
	contact_number: new FormControl("", [
		Validators.maxLength(10),
		Validators.minLength(10),
		CustomValidator.validMobileNumber]),
	// Total Number of family members of deceased
	number_of_family_members: new FormControl("", []),
	// Number of children < 5 years
	number_of_children: new FormControl("", []),
	// Caste
	cast: new FormControl("", []),
	// Do you have Below Poverty Line (BPL) card
	below_poverty_line: new FormControl("No", []), // ['Yes', 'No']
	// What are the Key family Assets: (Multiple answers allowed. tick all that apply)
	family_assets: new FormControl("", []), // multiple // ['Vehicle (motorised)', 'Television', 'Own House', 'Own Land', 'Cattles', 'Telephone']
});

// Neonatal Death
const sectionB = new FormGroup({
	// 10.1. Did ASHA/AWW/VHN/ANM advice on hospital treatment?
	asha_aww_vhn_anm_advice_on_hospital: new FormControl("No", []), // ['Yes', 'No', 'DNK']
	// 10.2 If Yes, who advised
	who_advised: new FormControl("", []), // ['ASHA', 'ANM', 'Link worker', 'Other']
	who_advised_other: new FormControl("", []),
	// 11	During the illness that led to the death, did you seek care outside the home for the infant?
	seek_care_outside_home: new FormControl("No", []), // ['Yes', 'No', 'DNK']
	// 12. If “NO”, then ASK “What were the reasons for not seeking care?”
	// 12.1	Did not think that the illness was serious
	illness_was_serious: new FormControl("No", []), // ['Yes', 'No', 'DNK']
	// 12.2	Money not available for treatment
	money_not_available: new FormControl("No", []), // ['Yes', 'No', 'DNK']
	// 12.3	Family members were not able to accompany
	family_members_were_not_able_to_accompany: new FormControl("No", []), // ['Yes', 'No', 'DNK']
	// 12.4	Bad weather
	bad_weather: new FormControl("No", []), // ['Yes', 'No', 'DNK']
	// 12.5 Did not know where to take the infant
	did_not_know_where_to_take: new FormControl("No", []), // ['Yes', 'No', 'DNK']
	// 12.6 No hope for survival of the infant
	no_hope_for_survival: new FormControl("No", []), // ['Yes', 'No', 'DNK']
	// 12.7 Transport not available
	transport_not_available: new FormControl("No", []), // ['Yes', 'No', 'DNK']
	// 12.7 Others
	others: new FormControl("", []),
	// go to section C if answer avove


	// 13 What was the condition of the infant at the time when it was decided for medical consultation? (Tick if any of the condition mentioned in the options is present)
	condition_when_decide_for_medical_consultation: new FormControl("", []), // ['Alert/Active/feeding', 'Conscious but Drowsy/Inactive/Unable to feed', 'Unconscious']
	// 14 From where or from whom did you seek care?
	// 14.1 Quack/informal service providers
	quack_informal_service_providers: new FormControl("No", []), // ['Yes', 'No', 'DNK']
	// 14.2 Traditional healer/Religious healer
	traditional_healer_religious_healer: new FormControl("", []), // ['Yes', 'No', 'DNK']
	// 14.3 Sub centre
	sub_centre: new FormControl("No", []), // ['Yes', 'No', 'DNK']
	// 14.4 PHC
	phc: new FormControl("No", []), // ['Yes', 'No', 'DNK']
	// 14.5 CHC
	chc: new FormControl("No", []), // ['Yes', 'No', 'DNK']
	// 14.6 Sub-district hospital
	sub_district_hospital: new FormControl("No", []), // ['Yes', 'No', 'DNK']
	// 14.7 District (Govt.) Hospital
	district_govt__Hospital: new FormControl("No", []), // ['Yes', 'No', 'DNK']
	// 14.8 Private allopathic doctor
	private_allopathic_doctor: new FormControl("No", []), // ['Yes', 'No', 'DNK']
	// 14.9 Doctors in alternate system of medicine
	doctors_in_alternate_system_of_medicine: new FormControl("No", []), // ['Yes', 'No', 'DNK']
	// 14.10 Doctors in alternate system of medicine
	reason_for_seeking_care_from_there: new FormControl("", []),


	/* 15 Problems faced by the parents in getting treatment in the health facility:
	Now I will ask you questions related to problems you might have faced in getting
	the treatment from various health facilities. */
	// 15.1 Specify in which hospital you took the baby first and then where was the baby taken thereafter?
	hospital_you_took_baby_type: new FormControl("", []), // ['Govt.', 'Private', 'Not for profit']
	hospital_you_took_baby_first_health_facility: new FormControl("", []),
	hospital_you_took_baby_referral_institution_i: new FormControl("", []),
	hospital_you_took_baby_referral_institution_ii: new FormControl("", []),
	hospital_you_took_baby_referral_institution_iii: new FormControl("", []),
	// 15.2 Specify the problem/complication with which baby was taken to this facility.
	problem_health_facility: new FormControl("", []),
	problem_referral_institution_i: new FormControl("", []),
	problem_referral_institution_ii: new FormControl("", []),
	problem_referral_institution_iii: new FormControl("", []),
	// 15.3 Total time taken from the onset of the problem to reach this facility (from home to the facility)
	time_taken_to_reach_facility_health_facility: new FormControl("", []),
	time_taken_to_reach_facility_referral_institution_i: new FormControl("", []),
	time_taken_to_reach_facility_referral_institution_ii: new FormControl("", []),
	time_taken_to_reach_facility_referral_institution_iii: new FormControl(
		"",
		[]
	),
	// 15.4 Type of treatment received in the institution/hospital
	treatment_received_health_facility: new FormControl("", []),
	treatment_received_referral_institution_i: new FormControl("", []),
	treatment_received_referral_institution_ii: new FormControl("", []),
	treatment_received_referral_institution_iii: new FormControl("", []),
	// 15.5 Specify the reasons for referring to another institution // ['Lack of Specialists', 'Lack of Equipments', 'Others (Specify)']
	reasons_for_referring_health_facility: new FormControl("", []),
	reasons_for_referring_referral_institution_i: new FormControl("", []),
	reasons_for_referring_referral_institution_ii: new FormControl("", []),
	reasons_for_referring_referral_institution_iii: new FormControl("", []),

	reasons_for_referring_other_health_facility: new FormControl("", []),
	reasons_for_referring_other_referral_institution_i: new FormControl("", []),
	reasons_for_referring_other_referral_institution_ii: new FormControl("", []),
	reasons_for_referring_other_referral_institution_iii: new FormControl("", []),

	// 15.6 Mode of transport from one institution to other
	ransport_from_one_institution_to_other_health_facility: new FormControl(
		"",
		[]
	),
	ransport_from_one_institution_to_other_referral_institution_i: new FormControl(
		"",
		[]
	),
	ransport_from_one_institution_to_other_referral_institution_ii: new FormControl(
		"",
		[]
	),
	ransport_from_one_institution_to_other_referral_institution_iii: new FormControl(
		"",
		[]
	),

	// 15.7 Distance from one facility to other ( in kms)
	distance_from_one_institution_to_other_health_facility: new FormControl(
		"",
		[]
	),
	distance_from_one_institution_to_other_referral_institution_i: new FormControl(
		"",
		[]
	),
	distance_from_one_institution_to_other_referral_institution_ii: new FormControl(
		"",
		[]
	),
	distance_from_one_institution_to_other_referral_institution_iii: new FormControl(
		"",
		[]
	),
	// 15.8 If baby was taken to any institution other than the one referred, state the reasons
	state_the_reasons_health_facility: new FormControl("", []),
	state_the_reasons_referral_institution_i: new FormControl("", []),
	state_the_reasons_referral_institution_ii: new FormControl("", []),
	state_the_reasons_referral_institution_iii: new FormControl("", []),

	// 15.9 If baby was taken to any institution other than the one referred, who advised (eg; caregivers, relatives etc.)
	who_advised_health_facility: new FormControl("", []),
	who_advised_referral_institution_i: new FormControl("", []),
	who_advised_referral_institution_ii: new FormControl("", []),
	who_advised_referral_institution_iii: new FormControl("", []),

	// 15.10 Was the child attended immediately // ['Yes', 'No']
	child_attended_immediately_health_facility: new FormControl("", []),
	child_attended_immediately_referral_institution_i: new FormControl("", []),
	child_attended_immediately_referral_institution_ii: new FormControl("", []),
	child_attended_immediately_referral_institution_iii: new FormControl("", []),

	// 15.11 If yes, time taken to initiate treatment in the institution on reaching the hospital ...Mins
	time_taken_to_initiate_treatment_health_facility: new FormControl("", []),
	time_taken_to_initiate_treatment_referral_institution_i: new FormControl(
		"",
		[]
	),
	time_taken_to_initiate_treatment_referral_institution_ii: new FormControl(
		"",
		[]
	),
	time_taken_to_initiate_treatment_referral_institution_iii: new FormControl(
		"",
		[]
	),

	// 15.12 Reasons for the delay in initiating treatment (Use your judgment in arriving the reasons)
	// ['Doctor not available', 'Paramedical workers not available', 'Too much patient rush', 'Informal payment', 'Mobilizing specialists', 'Could not afford to pay for the services', 'Investigations could not be done', 'Other problem']
	reasons_for_delay_health_facility: new FormControl("", []),
	reasons_for_delay_referral_institution_i: new FormControl("", []),
	reasons_for_delay_referral_institution_ii: new FormControl("", []),
	reasons_for_delay_referral_institution_iii: new FormControl("", []),

	reasons_for_delay_other_health_facility: new FormControl("", []),
	reasons_for_delay_other_referral_institution_i: new FormControl("", []),
	reasons_for_delay_other_referral_institution_ii: new FormControl("", []),
	reasons_for_delay_other_referral_institution_iii: new FormControl("", []),


	// 16.1 If the baby was shown as having been discharged against medical advice/absconded, record the reasons for the same.
	discharged_against_medical_advice_absconded: new FormControl("", []),
	// 16.2 Was the discharge due to the dissatisfaction of the treatment given in the hospital?
	discharge_due_to_dissatisfaction_of_treatment: new FormControl("", []),
	// 16.3 What was the states of child at the timed of LAMA/ Discharge
	states_of_child_at_timed_of_lama_Discharge: new FormControl("", []),
});

// Section C: Brief Social History of the family
const sectionC = new FormGroup({
	// 17.1 Any history of alcoholism in family
	history_of_alcoholism_in_family: new FormControl("No", []), // ['Yes', 'No', 'DNK']
	// 17.2 Any history of smoking in family
	history_of_smoking_in_family: new FormControl("No", []), // ['Yes', 'No', 'DNK']
	// 17.3 Any history of domestic violence in family
	history_of_domestic_violence_in_family: new FormControl("No", []), // ['Yes', 'No', 'DNK']
	// 18. Awareness of mother & family members about treatment Seeking
	// 18.1 Do you know the danger signs when a newborn or infant should be taken to health facility?
	danger_signs_when_taken_to_health_facility: new FormControl("No", []), // ['Yes', 'No']
	// 18.2 If yes, what will be the conditions (don’t read the options)
	what_will_be__conditions: new FormControl("", []), // ['Pre-term', 'LBW', 'No cry at birth', 'Fits', 'Difficult breathing', 'Drowsiness/inactivity/unconsciousness', 'Jaundice', 'Diarrhoea', 'Refusal to feed', 'Fast Breathing', 'High grade fever']
	// 18.3 Do you know about any hospital where newborns/infants/children can be admitted and treated?
	hospital_where_newborns_infants_children_can_be_admitted_and_treated: new FormControl(
		"No",
		[]
	), // ['Yes', 'No']
	// 18.4 If yes, then please name these facilities
	facilities_name: new FormControl("", []),
});

// Section D: Expenditure History
const sectionD = new FormGroup({
	// 19 Can you tell us regarding the total amount that you had to spend on your child?
	// a. Total amount = Rs..................................
	total_amount: new FormControl(0),
	// b. Treatment (medicines, consultation, home treatment etc.)....................
	treatment: new FormControl(0),
	// c. Transport.................................
	transport: new FormControl(0),
	// Others.......................................
	others: new FormControl(0),
	// 20 How did you (the family) arrange this money?
	family_arrange_this_money: new FormControl("", []), // multiple // ['Available/Savings', 'Borrowed', 'Sold assets', 'Community fund', 'Govt. scheme', 'Other', 'DNK']
});

export const neonatalDeathdForm = new FormGroup({
	basic,
	sectionA,
	sectionB,
	sectionC,
	sectionD,
});
