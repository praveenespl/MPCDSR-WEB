import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomValidator } from '../../../../../../../utilities/validators/reactiveValidators';

const addressForm = new FormGroup({
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
	landmark: new FormControl()
});

const basic = new FormGroup({
	fbcdr_no: new FormControl("", [Validators.required, CustomValidator.alphaNumber]),
	year: new FormControl("", [Validators.required, Validators.minLength(4),
	Validators.maxLength(4),CustomValidator.numberOnly]),

	facility_name: new FormControl("", [Validators.required, CustomValidator.alphaOnly]),

	state: new FormControl("", [Validators.required]),
	district: new FormControl("", [Validators.required]),
	block: new FormControl("", [Validators.required]),
	village: new FormControl("", [Validators.required])
});

const sectionA = new FormGroup({
	// 1. Inpatient Number/ID
	inpatient_number: new FormControl("", [Validators.required, CustomValidator.alphaNumber]),

	age: new FormControl("", [Validators.required, CustomValidator.numberOnly]),
	sex: new FormControl("", [Validators.required]), // Array ['Male', 'Female']
	category: new FormControl("", [Validators.required]), // Array ['SC/ST', 'OBC', 'General']
	// 5. Name of the newborn
	newborn_name: new FormControl("", [Validators.required, CustomValidator.alphaOnly]),
	// 6. Name of the Mother
	mother_name: new FormControl("", [Validators.required, CustomValidator.alphaOnly]),
	address: addressForm,

	date_of_birth: new FormControl("", [Validators.required]),
	place_of_birth: new FormControl("", [Validators.required]), // Array ['Home', 'Health facility', 'Transit']
	actual_place_of_birth:new FormControl("", []),
	child_weight_at_birth: new FormControl("", [Validators.required,Validators.min(400), Validators.max(15000)]), // weight in [][].[][]Kgs
	// child_weight_at_birth_dnk: new FormControl(true, []), // auto true false based on child_weight_at_birth

	date_of_admission: new FormControl("", [Validators.required,CustomValidator.dateOfAdmissionValidate]),
	time_of_admission: new FormControl("", [Validators.required]),

	date_of_death: new FormControl("", [Validators.required,CustomValidator.dateOfDeathValidate]),
	time_of_death: new FormControl("", [Validators.required]),

	// 15. Death certified by (Name & designation of the doctor)
	certified_by: new FormControl("", [Validators.required]), // TODO: maybe dropdown
	certified_by_designation: new FormControl("", [Validators.required]), // TODO: maybe dropdown

	// 16. Type of facility where death took place
	facility_type: new FormControl("", [Validators.required]), // Array ['CHC/FRU/RH', 'Sub district hospital/Taluq hospital', 'District Hospital', 'Medical college/tertiary hospital']

	// 17. Main complaints at the time of admission
	inability_to_feed: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
	inability_to_feed_days: new FormControl("", []), // if {{inability_to_feed == 'Yes'}}

	fever: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
	fever_days: new FormControl("", []), // if {{fever == 'Yes'}}

	loose_stools: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
	loose_stools_days: new FormControl("", []), // if {{loose_stools == 'Yes'}}

	vomiting: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
	vomiting_days: new FormControl("", []), // if {{vomiting == 'Yes'}}

	fast_breathing: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
	fast_breathing_days: new FormControl("", []), // if {{fast_breathing == 'Yes'}}

	convulsions: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
	convulsions_days: new FormControl("", []), // if {{convulsions == 'Yes'}}

	appearance_of_skin_rashes: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
	appearance_of_skin_rashes_days: new FormControl("", []), // if {{appearance_of_skin_rashes == 'Yes'}}

	// Injury (like fractures, wounds)
	injury: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
	injury_days: new FormControl("", []), // if {{injury == 'Yes'}}

	lethargy: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
	lethargy_days: new FormControl("", []), // if {{lethargy == 'Yes'}}

	stiffness_of_neck: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
	stiffness_of_neck_days: new FormControl("", []), // if {{stiffness_of_neck == 'Yes'}}

	// Bluish discolouration of lips, nails
	bluish_discolouration_of_lips_nails: new FormControl("No", [
		Validators.required
	]), // Array ['Yes', 'No']
	bluish_discolouration_of_lips_nails_days: new FormControl("", []), // if {{bluish_discolouration_of_lips_nails == 'Yes'}}

	skin_pustules_of_yellowish_colour: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
	skin_pustules_of_yellowish_colour_days: new FormControl("", []), // if {{skin_pustules_of_yellowish_colour == 'Yes'}}

	other: new FormControl("", []),
	other_days: new FormControl("", []), // if {{other != ''}}

	child_weight_at_admission: new FormControl("", [Validators.required,Validators.min(400),Validators.max(15000)]), // weight in [][].[][]Kgs

	// Immunisation history of child
	immunisation_history: new FormControl("", [Validators.required]) // multiple // Array ['BCG', 'OPV Birth Dose', 'Hepatitis B birth dose']
});

const sectionB = new FormGroup({
	// 20. Breathing status of child at the time of admission
	breathing_status: new FormControl("", [Validators.required]), // Array ['Normal breathing', 'Severe chest in drawing', 'Apnoeic episodes', 'Central cyanosis', 'Gasping', 'Not breathing']
	// 21. Consciousness level of child at the time of admission
	consciousness_level: new FormControl("", [Validators.required]), // Array ['Alert, responds to normal stimuli', 'Semi-conscious, responds to painful stimuli', 'High pitched cry or Persistent crying', 'Lethargic', 'Inability to suck', 'Unconscious']
	// 22. Circulation status of child at the time of admission
	circulation_status: new FormControl("", [Validators.required]), // Array ['Capillary refill time < 3 seconds', 'Capillary refill time > 3 seconds', 'Extremities: warm to touch and colder than the abdomen', 'Pulse: Not palpable', 'Pulse: Weak pulse', 'Pulse: fast pulse']
	// 23. Did baby have any other symptoms
	other_symptoms: new FormControl("", [Validators.required]), // Array ['Dehydration', 'Bleeding', 'Icterus', 'Petechial rashes or bruising', 'Trauma/other surgical condition', 'Congenital malformation', 'Bulging fontanelle', 'Hypothermia', 'Hyperthermia', 'Sclerema']
	// 24. Duration of stay in the health facility
	duration_of_stay_in_health_facility: new FormControl("", [
		Validators.required
	]), // Array ['<48 hours', '48 hours -7 days', '8-14 days', '14-21 days', 'More than 21 days']
	// 25. Investigations done
	investigations_done: new FormGroup({
		investigation_not_done: new FormControl("Done", [Validators.required]), // Array ['Done', 'Not Done']
		blood_glucose: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
		blood_glucose_result: new FormControl("", []),
		cbc: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
		cbc_result: new FormControl("", []),
		sepsis_screen: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
		sepsis_screen_result: new FormControl("", []),
		crp: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
		crp_result: new FormControl("", []),
		renal_function_tests: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
		renal_function_tests_result: new FormControl("", []),
		csf: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
		csf_result: new FormControl("", []),
		s_bilirubin: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
		s_bilirubin_result: new FormControl("", []),
		liver_function_tests: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
		liver_function_tests_result: new FormControl("", []),
		others: new FormControl(""),
		others_result: new FormControl("", [])
	})
});

const sectionC = new FormGroup({
	// 26. Was the child referred from another Centre?
	referred: new FormControl("No", [Validators.required]), // Array ['Yes', 'No', 'DNK']
	// all below applicable only if referred == 'Yes'
	// 27. type of facility from which last referred?
	last_referred_facility_type: new FormControl("", []), // Array ['24x7PHC', 'SDH/Rural Hospital/CHC', 'District Hospital', 'Private Hospital', 'Private clinic', 'Other']
	last_referred_facility_type_other: new FormControl("", []),
	// 28. Have multiple referrals been made? (include both private and public health facilities)
	referred_multiple: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']
	// all below applicable only if referred_multiple == 'Yes'
	// 29. If yes, how many?
	how_many: new FormControl("", []) // Array ['One', 'Two', 'Three', 'Four', 'More Than 4']
});

const sectionD = new FormGroup({
	// 30. Was the onset of labour
	labour: new FormControl("", [Validators.required]), // Array ['Spontaneous', 'Induced', 'DNK']
	// 31. What was the Gestational age at the time of admission
	age_at_time_of_admission: new FormControl("", [Validators.required]), // Array ['Term (> 37–<42 weeks)', 'Preterm(< 28 weeks)', 'Preterm(28–<32 weeks)', 'Preterm(32–<37 weeks)', 'Post term (> 42 weeks)']
	// 32. What was the Mode of Delivery
	mode_of_delivery: new FormControl("", [Validators.required]), // Array ['Spontaneous Vaginal (with/without episiotomy)', 'Vacuum/forceps', 'Caesarean section']
	// 33. Were there any complications during labour?
	complications_during_labour: new FormControl("", [Validators.required]), // Array ['PROM', 'Sepsis', 'Eclampsia', 'Obstructed labour/Rupture Uterus', 'Others']
	complications_during_labour_other: new FormControl("", []),
	// 34. Was Partograph used?
	partograph_used: new FormControl("No", [Validators.required]), // Array ['Yes', 'No', 'DNK']
	// 35. Birth weight
	birth_weight: new FormControl("", [Validators.required,Validators.min(400), Validators.max(15000)]), //
	// 36. Was the resuscitation at birth done
	resuscitation_at_birth: new FormControl("No", [Validators.required]), // Array ['Yes', 'No', 'DNK']
	// 37. Who gave resuscitation?
	who_gave_resuscitation: new FormControl(""), // Array ['Obstetrician', 'Paediatrician', 'Paediatrician', 'Staff Nurse', 'Others']
	who_gave_resuscitation_other: new FormControl("", []),
	// 38. APGAR Score (if recorded at time of birth)
	apgar_score: new FormControl("", [Validators.required,Validators.min(1), Validators.max(7)])
});

// Section E: Treatment Details
const sectionE = new FormGroup({
	// 39. Details of treatment given in the hospital
	resuscitation: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
	// Temperature Control (in case of newborns only)
	temperature_control: new FormControl("No", []), // Array ['', 'Yes', 'No']
	phototherapy: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
	oxygen_use: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
	// IV Fluids Provide details:
	iv_fluids: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
	iv_fluids_details: new FormControl("", []),
	//
	dntibiotics: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
	anticonvulsants: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
	// Blood Components Provide details:
	blood_components: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
	blood_components_details: new FormControl("", []),
	//
	steroids: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
	antiretroviral_drugs: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
	// Vasopressors (Dopamine, dobutamine,vasopressors)
	vasopressors: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
	exchange_blood_transfusion: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
	// Respiratory support (CPAP/Ventilator)
	respiratory_support: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
	// Surgical interventions Provide details:
	surgical_interventions: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
	surgical_interventions_details: new FormControl("", []),

	// bronchodilators Provide details:
	bronchodilators: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
	bronchodilators_details: new FormControl("", []),
	// Other interventions Provide details:
	other_interventions: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
	other_interventions_details: new FormControl("", [])
});

// Section F: Diagnosis
const sectionF = new FormGroup({
	// 40. Please tick against the appropriate option:
	death_was: new FormControl("", [Validators.required]), // Array ['within 24 hours of birth', 'in first week (day 2-7 days)', 'in the late neonatal period (8-28 days)']
	// 41. Provisional diagnosis at time of admission
	provisional_diagnosis_at_time_of_admission: new FormControl("", [
		Validators.required
	]),
	// 42. Provisional diagnosis at time of death
	provisional_diagnosis_at_time_of_death: new FormControl("", [
		Validators.required
	]),
	// 43. Probable direct cause of death
	probable_direct_cause_of_death: new FormControl("", [Validators.required]),
	// 44. Indirect cause of death
	indirect_cause_of_death: new FormControl("", [Validators.required]),
	// 45. Final Diagnosis (Within one week)
	final_diagnosis: new FormControl("", [Validators.required])
});

export const neonatalDeathdReviewForm = new FormGroup({
	basic,
	sectionA,
	sectionB,
	sectionC,
	sectionD,
	sectionE,
	sectionF
});
