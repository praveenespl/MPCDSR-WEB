class Basic {
	phc: string;
	sub_centre: string;
	mcts_number: string;
	date: Date;
	household_head_name: string;
	deceased_name: string;
	deceased_mother_name: string;
	districtcode: number;
	districtname: string;
	subdistrictcode: number;
	subdistrictname: string;
	villagecode: number;
	villagename: string;

	constructor(init?: Partial<Basic>) {
		if (init) {
			this.phc = init.phc;
			this.sub_centre = init.sub_centre;
			this.mcts_number = init.mcts_number;
			this.date = init.date ? new Date(init.date) : this.date;
			this.household_head_name = init.household_head_name;
			this.deceased_name = init.deceased_name;
			this.deceased_mother_name = init.deceased_mother_name;
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
	colony: string;
	house_number: string;
	pincode: string;
	landmark: string;
	statecode: number;
	statename: string;
	districtcode: number;
	districtname: string;
	subdistrictcode: number;
	subdistrictname: string;
	villagecode: number;
	villagename: string;

	constructor(init?: Partial<Address>) {
		if (init) {
			this.colony = init.colony;
			this.house_number = init.house_number;
			this.pincode = init.pincode;
			this.landmark = init.landmark;
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

class SectionA {
	respondent_name: string;
	respondent_relation: string;
	respondent_live_with_deceased_during_death: string;
	respondent_education: string;
	category: string;
	household_head_religion: string;
	household_head_religion_other: string;
	deceased_sex: string;
	age_completed_days: string;
	date_of_birth: Date;
	date_of_death: Date;
	address: Address;
	place_of_death: string;
	actual_place_of_death:string;
	place_of_death_other: string;

	constructor(init?: Partial<SectionA>) {
		if (init) {
			this.respondent_name = init.respondent_name;
			this.respondent_relation = init.respondent_relation;
			this.respondent_live_with_deceased_during_death =
				init.respondent_live_with_deceased_during_death;
			this.respondent_education = init.respondent_education;
			this.category = init.category;
			this.household_head_religion = init.household_head_religion;
			this.household_head_religion_other = init.household_head_religion_other;
			this.deceased_sex = init.deceased_sex;
			this.age_completed_days = init.age_completed_days;
			this.date_of_birth = init.date_of_birth
				? new Date(init.date_of_birth)
				: this.date_of_birth;
			this.date_of_death = init.date_of_death
				? new Date(init.date_of_death)
				: this.date_of_death;
			this.address = new Address(init.address);
			this.place_of_death = init.place_of_death;
			this.actual_place_of_death = init.actual_place_of_death;
			this.place_of_death_other = init.place_of_death_other;
		}
	}
}

class SectionB {
	accident_death: string;
	accident_death_type: string;
	accident_death_type_other: string;
	do_you_think_is_injury_or_accident: string;
	child_first_breastfed: string;
	receive_feed_other_first_6_months: string;
	illness_that_led_to_death_and_child_breastfeeding: string;
	child_have_fever: string;
	child_have_fever_days: number;
	child_have_fever_less_than_day: boolean;
	accompanied_by_chills_rigors: string;
	child_have_convulsions: string;
	child_unconscious_during_illness: string;
	child_develop_stiffness: string;
	child_have_stiff_neck: string;
	child_have_diarrhoea: string;
	child_have_diarrhoea_days: number;
	child_have_diarrhoea_less_than_day: boolean;
	child_have_blood_stools: string;
	child_have_cough: string;
	child_have_cough_days: number;
	child_have_cough_less_than_day: boolean;
	child_have_cough_blood: string;
	child_have_difficulty_breathing: string;
	child_have_difficulty_breathing_days: number;
	child_have_difficulty_breathing_less_than_day: boolean;
	child_have_fast_breathing: string;
	child_have_in_drawing_chest: string;
	child_have_wheezing: string;
	child_have_abdominal_pain: string;
	child_have_abdominal_distention: string;
	child_have_vomit: string;
	child_have_vomit_days: string;
	child_have_vomit_less_than_day: boolean;
	eye_skin_colour_yellow: string;
	rash_all_over_body: string;
	child_have_red_eyes: string;
	measles: string;
	child_become_very_thin: string;
	child_have_any_swelling: string;
	child_suffer_lack_blood_appear_pale: string;
	child_growing_normally: string;
	child_have_multiple_illnesses: string;
	symptoms_associated_with_illnesses: string[];
	symptoms_associated_with_illnesses_other: string;
	child_receive_bcg_injection: string;
	dozes_received_of_DPT: string;
	child_receive_polio_drops: string;
	child_receive_injection_for_measles: string;

	constructor(init?: Partial<SectionB>) {
		if (init) {
			this.accident_death = init.accident_death;
			this.accident_death_type = init.accident_death_type;
			this.accident_death_type_other = init.accident_death_type_other;
			this.do_you_think_is_injury_or_accident =
				init.do_you_think_is_injury_or_accident;
			this.child_first_breastfed = init.child_first_breastfed;
			this.receive_feed_other_first_6_months =
				init.receive_feed_other_first_6_months;
			this.illness_that_led_to_death_and_child_breastfeeding =
				init.illness_that_led_to_death_and_child_breastfeeding;
			this.child_have_fever = init.child_have_fever;
			this.child_have_fever_days = init.child_have_fever_days;
			this.child_have_fever_less_than_day = init.child_have_fever_less_than_day;
			this.accompanied_by_chills_rigors = init.accompanied_by_chills_rigors;
			this.child_have_convulsions = init.child_have_convulsions;
			this.child_unconscious_during_illness =
				init.child_unconscious_during_illness;
			this.child_develop_stiffness = init.child_develop_stiffness;
			this.child_have_stiff_neck = init.child_have_stiff_neck;
			this.child_have_diarrhoea = init.child_have_diarrhoea;
			this.child_have_diarrhoea_days = init.child_have_diarrhoea_days;
			this.child_have_diarrhoea_less_than_day =
				init.child_have_diarrhoea_less_than_day;
			this.child_have_blood_stools = init.child_have_blood_stools;
			this.child_have_cough = init.child_have_cough;
			this.child_have_cough_days = init.child_have_cough_days;
			this.child_have_cough_less_than_day = init.child_have_cough_less_than_day;
			this.child_have_cough_blood = init.child_have_cough_blood;
			this.child_have_difficulty_breathing =
				init.child_have_difficulty_breathing;
			this.child_have_difficulty_breathing_days =
				init.child_have_difficulty_breathing_days;
			this.child_have_difficulty_breathing_less_than_day =
				init.child_have_difficulty_breathing_less_than_day;
			this.child_have_fast_breathing = init.child_have_fast_breathing;
			this.child_have_in_drawing_chest = init.child_have_in_drawing_chest;
			this.child_have_wheezing = init.child_have_wheezing;
			this.child_have_abdominal_pain = init.child_have_abdominal_pain;
			this.child_have_abdominal_distention =
				init.child_have_abdominal_distention;
			this.child_have_vomit = init.child_have_vomit;
			this.child_have_vomit_days = init.child_have_vomit_days;
			this.child_have_vomit_less_than_day = init.child_have_vomit_less_than_day;
			this.eye_skin_colour_yellow = init.eye_skin_colour_yellow;
			this.rash_all_over_body = init.rash_all_over_body;
			this.child_have_red_eyes = init.child_have_red_eyes;
			this.measles = init.measles;
			this.child_become_very_thin = init.child_become_very_thin;
			this.child_have_any_swelling = init.child_have_any_swelling;
			this.child_suffer_lack_blood_appear_pale =
				init.child_suffer_lack_blood_appear_pale;
			this.child_growing_normally = init.child_growing_normally;
			this.child_have_multiple_illnesses = init.child_have_multiple_illnesses;
			this.symptoms_associated_with_illnesses =
				init.symptoms_associated_with_illnesses;
			this.symptoms_associated_with_illnesses_other =
				init.symptoms_associated_with_illnesses_other;
			this.child_receive_bcg_injection = init.child_receive_bcg_injection;
			this.dozes_received_of_DPT = init.dozes_received_of_DPT;
			this.child_receive_polio_drops = init.child_receive_polio_drops;
			this.child_receive_injection_for_measles =
				init.child_receive_injection_for_measles;
		}
	}
}

class SectionC {
	case_summary: string;
	respondent_think_newborn_died_of: string;
	assigned_cause_of_death: string;

	constructor(init?: Partial<SectionC>) {
		if (init) {
			this.case_summary = init.case_summary;
			this.respondent_think_newborn_died_of =
				init.respondent_think_newborn_died_of;
			this.assigned_cause_of_death = init.assigned_cause_of_death;
		}
	}
}

export class CdrForm3B {
	id: string;

	basic: Basic;
	sectionA: SectionA;
	sectionB: SectionB;
	sectionC: SectionC;

	constructor(init?: Partial<CdrForm3B>) {
		if (init) {
			this.id = init.id;

			this.basic = new Basic(init.basic);
			this.sectionA = new SectionA(init.sectionA);
			this.sectionB = new SectionB(init.sectionB);
			this.sectionC = new SectionC(init.sectionC);
		}
	}
}
