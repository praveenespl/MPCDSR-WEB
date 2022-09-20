class Basic {
	fbcdr_no: string;
	year: string;
	facility_name: string;
	statecode: number;
	statename: string;
	districtcode: number;
	districtname: string;
	subdistrictcode: number;
	subdistrictname: string;
	villagecode: number;
	villagename: string;

	constructor(init?: Partial<Basic>) {
		if (init) {
			this.fbcdr_no = init.fbcdr_no;
			this.year = init.year;
			this.facility_name = init.facility_name;
			this.statecode = init.statecode;
			this.statename = init.statename;
			this.districtcode = init.districtcode;
			this.districtname = init.districtname;
			this.subdistrictcode = init.subdistrictcode;
			this.subdistrictname = init.subdistrictname;
			this.villagecode = init.villagecode;
			this.villagename = init.villagename;
		}
	}
}

class Address {
	statecode: string;
	statename: string;
	districtcode: string;
	districtname: string;
	subdistrictcode: string;
	subdistrictname: string;
	villagecode: string;
	villagename: string;
	colony: string;
	house_number: string;
	pincode: string;
	landmark: string;

	constructor(init?: Partial<Address>) {
		if (init) {
			this.statecode = init.statecode;
			this.statename = init.statename;
			this.districtcode = init.districtcode;
			this.districtname = init.districtname;
			this.subdistrictcode = init.subdistrictcode;
			this.subdistrictname = init.subdistrictname;
			this.villagecode = init.villagecode;
			this.villagename = init.villagename;
			this.colony = init.colony;
			this.house_number = init.house_number;
			this.pincode = init.pincode;
			this.landmark = init.landmark;
		}
	}
}

class SectionA {
	inpatient_number: string;
	age: string;
	sex: string;
	category: string;
	newborn_name: string;
	mother_name: string;
	address: Address;
	date_of_birth: Date;
	place_of_birth: string;
	actual_place_of_birth: string;
	child_weight_at_birth: string;
	date_of_admission: Date;
	time_of_admission: string;
	date_of_death: Date;
	time_of_death: string;
	certified_by: string;
	certified_by_designation: string;
	facility_type: string;
	inability_to_feed: string;
	inability_to_feed_days: number;
	fever: string;
	fever_days: number;
	loose_stools: string;
	loose_stools_days: number;
	vomiting: string;
	vomiting_days: number;
	fast_breathing: string;
	fast_breathing_days: number;
	convulsions: string;
	convulsions_days: number;
	appearance_of_skin_rashes: string;
	appearance_of_skin_rashes_days: number;
	injury: string;
	injury_days: number;
	lethargy: string;
	lethargy_days: number;
	stiffness_of_neck: string;
	stiffness_of_neck_days: number;
	bluish_discolouration_of_lips_nails: string;
	bluish_discolouration_of_lips_nails_days: number;
	skin_pustules_of_yellowish_colour: string;
	skin_pustules_of_yellowish_colour_daysother: string;
	other_days: number;
	child_weight_at_admission: string;
	immunisation_history: string;

	constructor(init?: Partial<SectionA>) {
		if (init) {
			this.inpatient_number = init.inpatient_number;
			this.age = init.age;
			this.sex = init.sex;
			this.category = init.category;
			this.newborn_name = init.newborn_name;
			this.mother_name = init.mother_name;
			this.address = new Address(init.address);
			this.date_of_birth = init.date_of_birth
				? new Date(init.date_of_birth)
				: this.date_of_birth;
			this.place_of_birth = init.place_of_birth;
			this.actual_place_of_birth = init.actual_place_of_birth;
			this.child_weight_at_birth = init.child_weight_at_birth;
			this.date_of_admission = init.date_of_admission
				? new Date(init.date_of_admission)
				: this.date_of_admission;
			this.time_of_admission = init.time_of_admission;
			this.date_of_death = init.date_of_death
				? new Date(init.date_of_death)
				: this.date_of_death;
			this.time_of_death = init.time_of_death;
			this.certified_by = init.certified_by;
			this.certified_by_designation = init.certified_by_designation;
			this.facility_type = init.facility_type;
			this.inability_to_feed = init.inability_to_feed;
			this.inability_to_feed_days = init.inability_to_feed_days;
			this.fever = init.fever;
			this.fever_days = init.fever_days;
			this.loose_stools = init.loose_stools;
			this.loose_stools_days = init.loose_stools_days;
			this.vomiting = init.vomiting;
			this.vomiting_days = init.vomiting_days;
			this.fast_breathing = init.fast_breathing;
			this.fast_breathing_days = init.fast_breathing_days;
			this.convulsions = init.convulsions;
			this.convulsions_days = init.convulsions_days;
			this.appearance_of_skin_rashes = init.appearance_of_skin_rashes;
			this.appearance_of_skin_rashes_days = init.appearance_of_skin_rashes_days;
			this.injury = init.injury;
			this.injury_days = init.injury_days;
			this.lethargy = init.lethargy;
			this.lethargy_days = init.lethargy_days;
			this.stiffness_of_neck = init.stiffness_of_neck;
			this.stiffness_of_neck_days = init.stiffness_of_neck_days;
			this.bluish_discolouration_of_lips_nails =
				init.bluish_discolouration_of_lips_nails;
			this.bluish_discolouration_of_lips_nails_days =
				init.bluish_discolouration_of_lips_nails_days;
			this.skin_pustules_of_yellowish_colour =
				init.skin_pustules_of_yellowish_colour;
			this.skin_pustules_of_yellowish_colour_daysother =
				init.skin_pustules_of_yellowish_colour_daysother;
			this.other_days = init.other_days;
			this.child_weight_at_admission = init.child_weight_at_admission;
			this.immunisation_history = init.immunisation_history;
		}
	}
}

class InvestigationsDone {
	blood_glucose: string;
	blood_glucose_result: string;
	cbc: string;
	cbc_result: string;
	sepsis_screen: string;
	sepsis_screen_result: string;
	crp: string;
	crp_result: string;
	renal_function_tests: string;
	renal_function_tests_result: string;
	liver_function_tests: string;
	liver_function_tests_result: string;
	csf: string;
	csf_result: string;
	s_bilirubin: string;
	s_bilirubin_result: string;
	others: string;
	others_result: string;

	constructor(init?: Partial<InvestigationsDone>) {
		if (init) {
			this.blood_glucose = init.blood_glucose;
			this.blood_glucose_result = init.blood_glucose_result;
			this.cbc = init.cbc;
			this.cbc_result = init.cbc_result;
			this.sepsis_screen = init.sepsis_screen;
			this.sepsis_screen_result = init.sepsis_screen_result;
			this.crp = init.crp;
			this.crp_result = init.crp_result;
			this.renal_function_tests = init.renal_function_tests;
			this.renal_function_tests_result = init.renal_function_tests_result;
			this.liver_function_tests = init.liver_function_tests;
			this.liver_function_tests_result = init.liver_function_tests_result;
			this.csf = init.csf;
			this.csf_result = init.csf_result;
			this.s_bilirubin = init.s_bilirubin;
			this.s_bilirubin_result = init.s_bilirubin_result;
			this.others = init.others;
			this.others_result = init.others_result;
		}
	}
}

export class SectionB {
	breathing_status: string;
	consciousness_level: string;
	circulation_status: string;
	other_symptoms: string;
	duration_of_stay_in_health_facility: string;
	investigations_done: InvestigationsDone;

	constructor(init?: Partial<SectionB>) {
		if (init) {
			this.breathing_status = init.breathing_status;
			this.consciousness_level = init.consciousness_level;
			this.circulation_status = init.circulation_status;
			this.other_symptoms = init.other_symptoms;
			this.duration_of_stay_in_health_facility =
				init.duration_of_stay_in_health_facility;
			this.investigations_done = new InvestigationsDone(
				init.investigations_done
			);
		}
	}
}

class SectionC {
	referred: string;
	last_referred_facility_type: string;
	last_referred_facility_type_other: string;
	referred_multiple: string;
	how_many: string;

	constructor(init?: Partial<SectionC>) {
		if (init) {
			this.referred = init.referred;
			this.last_referred_facility_type = init.last_referred_facility_type;
			this.last_referred_facility_type_other =
				init.last_referred_facility_type_other;
			this.referred_multiple = init.referred_multiple;
			this.how_many = init.how_many;
		}
	}
}

class SectionD {
	labour: string;
	age_at_time_of_admission: string;
	mode_of_delivery: string;
	complications_during_labour: string;
	complications_during_labour_other: string;
	partograph_used: string;
	birth_weight: string;
	resuscitation_at_birth: string;
	who_gave_resuscitation: string;
	who_gave_resuscitation_other: string;
	apgar_score: string;

	constructor(init?: Partial<SectionD>) {
		if (init) {
			this.labour = init.labour;
			this.age_at_time_of_admission = init.age_at_time_of_admission;
			this.mode_of_delivery = init.mode_of_delivery;
			this.complications_during_labour = init.complications_during_labour;
			this.complications_during_labour_other =
				init.complications_during_labour_other;
			this.partograph_used = init.partograph_used;
			this.birth_weight = init.birth_weight;
			this.resuscitation_at_birth = init.resuscitation_at_birth;
			this.who_gave_resuscitation = init.who_gave_resuscitation;
			this.who_gave_resuscitation_other = init.who_gave_resuscitation_other;
			this.apgar_score = init.apgar_score;
		}
	}
}

class SectionE {
	resuscitation: string;
	temperature_control: string;
	phototherapy: string;
	oxygen_use: string;
	iv_fluids: string;
	iv_fluids_details: string;
	dntibiotics: string;
	anticonvulsants: string;
	blood_components: string;
	blood_components_details: string;
	steroids: string;
	antiretroviral_drugs: string;
	vasopressors: string;
	exchange_blood_transfusion: string;
	respiratory_support: string;
	surgical_interventions: string;
	surgical_interventions_details: string;
	bronchodilators: string;
	bronchodilators_details: string;
	other_interventions: string;
	other_interventions_details: string;

	constructor(init?: Partial<SectionE>) {
		if (init) {
			this.resuscitation = init.resuscitation;
			this.temperature_control = init.temperature_control;
			this.phototherapy = init.phototherapy;
			this.oxygen_use = init.oxygen_use;
			this.iv_fluids = init.iv_fluids;
			this.iv_fluids_details = init.iv_fluids_details;
			this.dntibiotics = init.dntibiotics;
			this.anticonvulsants = init.anticonvulsants;
			this.blood_components = init.blood_components;
			this.blood_components_details = init.blood_components_details;
			this.steroids = init.steroids;
			this.antiretroviral_drugs = init.antiretroviral_drugs;
			this.vasopressors = init.vasopressors;
			this.exchange_blood_transfusion = init.exchange_blood_transfusion;
			this.respiratory_support = init.respiratory_support;
			this.surgical_interventions = init.surgical_interventions;
			this.surgical_interventions_details = init.surgical_interventions_details;
			this.bronchodilators = init.bronchodilators;
			this.bronchodilators_details = init.bronchodilators_details;
			this.other_interventions = init.other_interventions;
			this.other_interventions_details = init.other_interventions_details;
		}
	}
}

class SectionF {
	death_was: string;
	provisional_diagnosis_at_time_of_admission: string;
	provisional_diagnosis_at_time_of_death: string;
	probable_direct_cause_of_death: string;
	indirect_cause_of_death: string;
	final_diagnosis: string;

	constructor(init?: Partial<SectionF>) {
		if (init) {
			this.death_was = init.death_was;
			this.provisional_diagnosis_at_time_of_admission =
				init.provisional_diagnosis_at_time_of_admission;
			this.provisional_diagnosis_at_time_of_death =
				init.provisional_diagnosis_at_time_of_death;
			this.probable_direct_cause_of_death = init.probable_direct_cause_of_death;
			this.indirect_cause_of_death = init.indirect_cause_of_death;
			this.final_diagnosis = init.final_diagnosis;
		}
	}
}

export class CdrForm4A {
	id: string;

	basic: Basic;
	sectionA: SectionA;
	sectionB: SectionB;
	sectionC: SectionC;
	sectionD: SectionD;
	sectionE: SectionE;
	sectionF: SectionF;

	constructor(init?: Partial<CdrForm4A>) {
		if (init) {
			this.id = init.id;

			this.basic = new Basic(init.basic);
			this.sectionA = new SectionA(init.sectionA);
			this.sectionB = new SectionB(init.sectionB);
			this.sectionC = new SectionC(init.sectionC);
			this.sectionD = new SectionD(init.sectionD);
			this.sectionE = new SectionE(init.sectionE);
			this.sectionF = new SectionF(init.sectionF);
		}
	}
}
