import { FormGroup, FormControl, Validators } from "@angular/forms";

// export const basicInformation = () => new FormGroup({
// 	date_of_still_birth: new FormControl("", [Validators.required]),
// 	intramural: new FormControl("", [Validators.required]), // Array ['Yes', 'No']
// 	mother_age: new FormControl("", [Validators.required]),
// 	consanguineous_marriage: new FormControl("", [Validators.required]) // Array ['Yes', 'No', 'DNK']
// });

export const obstetricalHistory = () => new FormGroup({
	gravida: new FormControl("", [Validators.required]),
	para: new FormControl("", [Validators.required]),
	abortion: new FormControl("", [Validators.required])
});

// export const pregnancyCare = () => new FormGroup({
// 	obstetrical_history: obstetricalHistory(),
// 	past_history: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
// 	past_history_details: new FormControl("", []), // multislect // ['Anemia', 'Urinary Infection', 'TORCH', 'Obesity', 'Hypertension', 'Under Nutrition', 'Gestational Diabetes Mellitus', 'DNK']
// 	previous_still_birth: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
// 	previous_birth_defect: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
// 	prev_c_section: new FormControl("No", [Validators.required]), // TODO: Array ['Yes', 'No']
// 	rh_negative: new FormControl("No", [Validators.required]), // TODO: Array ['Yes', 'No', 'DNK']
// 	//
// 	antenatal_care_received: new FormControl("", [Validators.required]), // Array ['None', 'At least 1', 'Minimum 4', '4+ visit', '8+ visit', 'DNK']
// 	tt_Vaccination: new FormControl(""), // Array ['TT2+', 'TT1', 'TT Booster', 'Not needed', 'Not given', 'DNK']
// 	iron_folic_acid: new FormControl("", [Validators.required]), // Array ['Given', 'Not Given', 'DNK']
// 	syphilis_test: new FormControl(""), // Array ['Given', 'Not Given', 'DNK']
// 	hemoglobin: new FormControl(""), // Array ['Not done', '>11 gm/dl', '10.9-10 gm/dl', '9.9-7 gm/dl', '<7 gm/dl', 'DNK']
// 	hiv_Status: new FormControl(""), // Array ['HIV-positive', 'HIV-negative', 'Not done', 'DNK']
// 	malaria: new FormControl(""), // Array ['Not available', 'IPT3+', 'IPT2', 'IPT1', 'DNK']
// 	pre_natal_ultrasound: new FormControl("") // Array ['Anomaly (BD) detected', 'Normal', 'Not done', 'DNK']
// });
//section C start
export const examinationOnAdmission = () => new FormGroup({
	fetal_heart_sound: new FormControl("", [Validators.required]), // ['Present', 'Absent', 'DNK']
	blood_pressure: new FormControl("", [Validators.required]), // ['Done', 'Not Done']
	//systolic_diastolic: new FormControl(""), // text
	systolic: new FormControl(""), // text
	diastolic: new FormControl(""), // text
	per_vaginal_bleeding: new FormControl("", [Validators.required]), // ['Yes', 'No']
	fever: new FormControl("", [Validators.required]) // ['Yes', 'No']
});

export const delivery_details = () => new FormGroup({
	partograph_used: new FormControl("", [Validators.required]), // ['Yes', 'No']
	type_of_labour: new FormControl("", [Validators.required]), // ['Spontaneous', 'Induced']
	mode_of_delivery: new FormControl("", [Validators.required]) // ['Normal Vaginal Delivery', 'Breech Delivery', 'Instrumental Delivery', 'Emergency Cesarean Section', 'Elective Cesarean Section']
});

export const birth_details = () => new FormGroup({
	baby_weight: new FormControl("",[Validators.min(500),Validators.max(5000)]),
	sex_of_baby: new FormControl("", [Validators.required]), // ['Male', 'Female', 'Ambiguous']
	gestation_age_week: new FormControl("0", [Validators.required]),
	gestation_age_days: new FormControl("0", [Validators.required]),
	confirmation_of_gestation_age_by: new FormControl("") // ['Last Mansuration Period LMP', 'Ultrasound USG', 'DNK']
});

// export const examination = () => new FormGroup({
// 	examination_on_admission: examinationOnAdmission(),
// 	delivery_details: delivery_details(),
// 	birth_details: birth_details()
// });
//section C End
// export const detailsOfStillBirth  = () =>
// new FormGroup({
// 	type_of_still_birth: new FormControl("", [Validators.required]), // ['Ante-Partum / Macerated Stillbirth (MSB)', 'Intra-Partum / Fresh Stillbirth (FSB)']
// 	// Maternal Condition Associated with Fetal Death
// 	// [{label: 'Complications of Placenta, Cord & Membranes', value: 'M1'}, {label: 'Maternal Complications of Pregnancy', value: 'M2'}, {label: 'Other Complecations of Labour and Delivery', value: 'M3'}, {label: 'Maternal Medical & Surgical Conditions; Noxious Influences', value: 'M4'}, {label: 'No Maternal condition identified (healthy mother)', value: 'M5'}]
// 	maternal_condition_associated_with_fetal_death: new FormControl("", [
// 		Validators.required
// 	]),
// 	// Fetal Death Main Cause [Ante-Partum Death (MSB) (A)]
// 	// TODO: if: type_of_still_birth == 'Ante-Partum / Macerated Stillbirth (MSB)'  [{label: 'Birth Defect', value: 'A1'}, {label: 'Infection', value: 'A2'}, {label: 'Antepartum Hypoxia', value: 'A3'}, {label: 'Other Specified Antepartum Disorder', value: 'A4'}, {label: 'Disorders Related to Fetal Growth', value: 'A5'}, {label: 'Unspecified Cause of Antepartum Death', value: 'A6'}]
// 	// TODO: if: type_of_still_birth == 'Intra-Partum / Fresh Stillbirth (FSB)' [{label: 'Birth Defect', value: 'I1'}, {label: 'Birth Trauma', value: 'I2'}, {label: 'Acute Intrapartum Event', value: 'I3'}, {label: 'Infection', value: 'I4'}, {label: 'Other Specified Intrapartum Disorder', value: 'I5'}, {label: 'Disorder Related to Fetal Growth', value: 'I6'}, {label: 'Other', value: 'Other'}]
// 	fetal_death_main_cause: new FormControl("", [Validators.required]),
// 	// Other Associated Conditions
// 	other_associated_conditions: new FormControl("", [Validators.required]),
// 	critical_delay: new FormControl("", [Validators.required]), // multiple // Array ['Delay in Recognizing', 'Need for Care Delay Seeking Care', 'Delay Receiving Care']
// 	// Modifiable Factors
// 	modifiable_factors: new FormControl(""), // TODO: Array ['Yes', 'No']
// 	// below fill if modifiable_factors == 'Yes'
// 	family_related: new FormControl("", []), // Array ['Late', 'No antenatal care', 'Cultural inhibition to seeking care', 'No knowledge of danger signs', 'Financial constraints', 'Partner restricts care-seeking', 'Use of traditional/herbal medicine', 'Smoking', 'drug', 'alcohol abuse', 'Attempted termination', 'Other']
// 	administration_related: new FormControl("", []), // Array ['Neonatal facilities', 'Theatre facilities', 'Resuscitation equipment', 'Blood products', 'Lack of training', 'Insufficient staff numbers', 'Anesthetic delay', 'No antenatal documentation', 'Other']
// 	provider_related: new FormControl("", []) // ['Partogram not used', 'Action not taken', 'Inappropriate action taken', 'Iatrogenic delivery', 'Delay in referral', 'Inadequate monitoring', 'Delay in calling for assistance', 'Inappropriate discharge', 'Other']
// });

export const sectionA = () =>
	new FormGroup({
		//center_name: new FormControl("",[Validators.required]),
		state: new FormControl("", [Validators.required]),
		district: new FormControl("", [Validators.required]),
		block: new FormControl("", [Validators.required]),
		other_block_name: new FormControl(""),
		village: new FormControl("", []),
		name_of_facility: new FormControl("", [Validators.required]),
		type_of_facility: new FormControl("", [Validators.required]),
		stillBirthNo: new FormControl("", [Validators.required]),
		//deliveries_in_month:new FormControl(""),
		baby_hospital_record_no: new FormControl("", [Validators.required]),
		mother_hospital_record_no: new FormControl("", [Validators.required]),
		//nbbd_number: new FormControl("", [Validators.required]),
		//basic_information: basicInformation(),
		date_of_still_birth: new FormControl("", [Validators.required]),
		intramural: new FormControl("", [Validators.required]), // Array ['Yes', 'No']
		mother_age: new FormControl("", [Validators.required]),
		consanguineous_marriage: new FormControl("", [Validators.required]), // Array ['Yes', 'No', 'DNK']
	});

export const sectionB = () =>
	new FormGroup({
		gestational_diabetes_mellitus: new FormControl("", [Validators.required]),// Array ['Yes', 'No']
		//diagnosed_with : new FormControl("", []), // Array ['Random Blood Sugar','HB1AC','GTT','GCT','DNK']
		obstetrical_history: obstetricalHistory(),
		past_history: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
		past_history_details: new FormControl("", []), // multislect // ['Anemia', 'Urinary Infection', 'TORCH', 'Obesity', 'Hypertension', 'Under Nutrition', 'Gestational Diabetes Mellitus', 'DNK']
		previous_still_birth: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
		previous_birth_defect: new FormControl("No", [Validators.required]), // Array ['Yes', 'No']
		prev_c_section: new FormControl("No", [Validators.required]), // TODO: Array ['Yes', 'No']
		rh_negative: new FormControl("", [Validators.required]), // TODO: Array ['Yes', 'No', 'DNK']
		//
		antenatal_care_received: new FormControl("", [Validators.required]), // Array ['None', 'At least 1', 'Minimum 4', '4+ visit', '8+ visit', 'DNK']
		tt_Vaccination: new FormControl(""), // Array ['TT2+', 'TT1', 'TT Booster', 'Not needed', 'Not given', 'DNK']
		iron_folic_acid: new FormControl("", [Validators.required]), // Array ['Given', 'Not Given', 'DNK']
		syphilis_test: new FormControl(""), // Array ['Given', 'Not Given', 'DNK']
		hemoglobin: new FormControl(""), // Array ['Not done', '>11 gm/dl', '10.9-10 gm/dl', '9.9-7 gm/dl', '<7 gm/dl', 'DNK']
		hiv_Status: new FormControl(""), // Array ['HIV-positive', 'HIV-negative', 'Not done', 'DNK']
		malaria: new FormControl(""), // Array ['Not available', 'IPT3+', 'IPT2', 'IPT1', 'DNK']
		pre_natal_ultrasound: new FormControl("") // Array ['Anomaly (BD) detected', 'Normal', 'Not done', 'DNK']
	});

export const sectionC = () =>
	new FormGroup({
		examination_on_admission: examinationOnAdmission(),
		delivery_details: delivery_details(),
		birth_details: birth_details()
	});

export const sectionD = () =>
	new FormGroup({

		type_of_still_birth: new FormControl("", [Validators.required]), // ['Ante-Partum / Macerated Stillbirth (MSB)', 'Intra-Partum / Fresh Stillbirth (FSB)']
		// Maternal Condition Associated with Fetal Death
		// [{label: 'Complications of Placenta, Cord & Membranes', value: 'M1'}, {label: 'Maternal Complications of Pregnancy', value: 'M2'}, {label: 'Other Complecations of Labour and Delivery', value: 'M3'}, {label: 'Maternal Medical & Surgical Conditions; Noxious Influences', value: 'M4'}, {label: 'No Maternal condition identified (healthy mother)', value: 'M5'}]
		maternal_condition_associated_with_fetal_death: new FormControl("", [
			Validators.required
		]),
		details_of_MCAWFD: new FormControl("", []),
		// Fetal Death Main Cause [Ante-Partum Death (MSB) (A)]
		// TODO: if: type_of_still_birth == 'Ante-Partum / Macerated Stillbirth (MSB)'  [{label: 'Birth Defect', value: 'A1'}, {label: 'Infection', value: 'A2'}, {label: 'Antepartum Hypoxia', value: 'A3'}, {label: 'Other Specified Antepartum Disorder', value: 'A4'}, {label: 'Disorders Related to Fetal Growth', value: 'A5'}, {label: 'Unspecified Cause of Antepartum Death', value: 'A6'}]
		// TODO: if: type_of_still_birth == 'Intra-Partum / Fresh Stillbirth (FSB)' [{label: 'Birth Defect', value: 'I1'}, {label: 'Birth Trauma', value: 'I2'}, {label: 'Acute Intrapartum Event', value: 'I3'}, {label: 'Infection', value: 'I4'}, {label: 'Other Specified Intrapartum Disorder', value: 'I5'}, {label: 'Disorder Related to Fetal Growth', value: 'I6'}, {label: 'Other', value: 'Other'}]
		fetal_death_main_cause: new FormControl("", [Validators.required]),
		birthDefect: new FormControl("", [Validators.required]),// TODO: Array ['Yes', 'No']
		birthDefectOption: new FormControl("", []),
		birthDefectOptionOther: new FormControl("", [])


	});

export const sectionE = () =>
	new FormGroup({
		// Other Associated Conditions
		//other_associated_conditions: new FormControl("", [Validators.required]),
		critical_delay: new FormControl("", [Validators.required]),
		// Modifiable Factors
		modifiable_factors: new FormControl(""), // TODO: Array ['Yes', 'No']
		// below fill if modifiable_factors == 'Yes'
		family_related: new FormControl("", []), // Array ['Late', 'No antenatal care', 'Cultural inhibition to seeking care', 'No knowledge of danger signs', 'Financial constraints', 'Partner restricts care-seeking', 'Use of traditional/herbal medicine', 'Smoking', 'drug', 'alcohol abuse', 'Attempted termination', 'Other']
		administration_related: new FormControl("", []), // Array ['Neonatal facilities', 'Theatre facilities', 'Resuscitation equipment', 'Blood products', 'Lack of training', 'Insufficient staff numbers', 'Anesthetic delay', 'No antenatal documentation', 'Other']
		provider_related: new FormControl("", []), // ['Partogram not used', 'Action not taken', 'Inappropriate action taken', 'Iatrogenic delivery', 'Delay in referral', 'Inadequate monitoring', 'Delay in calling for assistance', 'Inappropriate discharge', 'Other']
		// Name of the Professional Filling the Form
		filled_by: new FormControl("", [Validators.required]),
		filled_date: new FormControl("", [Validators.required]),
		stillBirth: new FormControl('', [Validators.required])
	});




export const investigationReportForm = () =>
	new FormGroup({
		sectionA: sectionA(),
		sectionB: sectionB(),
		sectionC: sectionC(),
		sectionD: sectionD(),
		sectionE: sectionE(),
	});