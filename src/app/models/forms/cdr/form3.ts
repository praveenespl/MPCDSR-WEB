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
			this.actual_place_of_death=init.actual_place_of_death;
			this.place_of_death_other = init.place_of_death_other;
		}
	}
}

export class SectionB {
	accident_death: string;
	accident_death_type: string;
	accident_death_type_other: string;
	do_you_think_is_injury_or_accident: string;
	pregnancy_months: number;
	mother_date_of_birth: Date;
	receive_2_doses_of_tetanus: string;
	complications_during_pregnancy: string;
	complications_occurred: any;
	single_or_multiple_birth: string;
	place_of_birth: string;
	place_of_birth_other: string;
	delivery_attended_by: string;
	delivery_attended_by_other: string;
	umbilical_cord_cut_by_disinfected_or_new_knife_blade: string;
	live_or_still_birth: string;
	baby_cry_move_breath: string;
	injury_on_child_body_after_birth: string;
	visible_malformations_at_birth: string;
	child_size_at_birth: string;
	child_weight_at_birth: number;
	child_weight_at_birth_dnk: boolean;
	baby_stop_crying: string;
	baby_stop_crying_after_days: number;
	baby_stop_crying_less_than_day: boolean;
	baby_first_breastfed: string;
	baby_able_suckle_normally: string;
	baby_stop_suckle_normally: string;
	baby_stop_suckle_after_days: number;
	baby_stop_suckle_less_than_day: boolean;
	drink_anything_other: string;
	drink_anything_other_specify: string;
	drink_anything_other_frequency_days: string;
	drink_anything_other_frequency_days_dnk: boolean;
	baby_have_fever: string;
	baby_have_fever_days: number;
	baby_have_fever_less_than_day: boolean;
	baby_have_difficulty_breathing: string;
	baby_have_difficulty_breathing_days: number;
	baby_have_difficulty_breathing_less_than_day: boolean;
	baby_have_fast_breathing: string;
	baby_have_fast_breathing_days: number;
	baby_have_fast_breathing_less_than_day: boolean;
	baby_have_in_drawing_chest: string;
	baby_have_cough: string;
	baby_have_grunting: string;
	baby_have_nostrils_flare_with_breathing: string;
	baby_have_diarrhoea: string;
	baby_have_diarrhoea_days: number;
	baby_have_diarrhoea_less_than_day: boolean;
	baby_have_vomit: string;
	baby_have_vomit_days: string;
	baby_have_vomit_less_than_day: boolean;
	baby_have_redness_discharge_from_umbilical_cord: string;
	baby_have_yellow_eyes_skin: string;
	baby_have_yellow_spasms_fits: string;
	baby_become_unresponsive_unconscious: string;
	baby_have_bulging_fontanelle: string;
	baby_feel_cold_when_touched: string;
	baby_hands_legs_lips_discoloured: string;
	baby_have_yellow_palms_soles: string;
	baby_have_blood_stools: string;

	constructor(init?: Partial<SectionB>) {
		if (init) {
			this.accident_death = init.accident_death;
			this.accident_death_type = init.accident_death_type;
			this.accident_death_type_other = init.accident_death_type_other;
			this.do_you_think_is_injury_or_accident =
				init.do_you_think_is_injury_or_accident;
			this.pregnancy_months = init.pregnancy_months;
			this.mother_date_of_birth = init.mother_date_of_birth
				? new Date(init.mother_date_of_birth)
				: this.mother_date_of_birth;
			this.receive_2_doses_of_tetanus = init.receive_2_doses_of_tetanus;
			this.complications_during_pregnancy = init.complications_during_pregnancy;
			this.complications_occurred = init.complications_occurred;
			this.single_or_multiple_birth = init.single_or_multiple_birth;
			this.place_of_birth = init.place_of_birth;
			this.place_of_birth_other = init.place_of_birth_other;
			this.delivery_attended_by = init.delivery_attended_by;
			this.delivery_attended_by_other = init.delivery_attended_by_other;
			this.umbilical_cord_cut_by_disinfected_or_new_knife_blade =
				init.umbilical_cord_cut_by_disinfected_or_new_knife_blade;
			this.live_or_still_birth = init.live_or_still_birth;
			this.baby_cry_move_breath = init.baby_cry_move_breath;
			this.injury_on_child_body_after_birth =
				init.injury_on_child_body_after_birth;
			this.visible_malformations_at_birth = init.visible_malformations_at_birth;
			this.child_size_at_birth = init.child_size_at_birth;
			this.child_weight_at_birth = init.child_weight_at_birth;
			this.child_weight_at_birth_dnk = init.child_weight_at_birth_dnk;
			this.baby_stop_crying = init.baby_stop_crying;
			this.baby_stop_crying_after_days = init.baby_stop_crying_after_days;
			this.baby_stop_crying_less_than_day = init.baby_stop_crying_less_than_day;
			this.baby_first_breastfed = init.baby_first_breastfed;
			this.baby_able_suckle_normally = init.baby_able_suckle_normally;
			this.baby_stop_suckle_normally = init.baby_stop_suckle_normally;
			this.baby_stop_suckle_after_days = init.baby_stop_suckle_after_days;
			this.baby_stop_suckle_less_than_day = init.baby_stop_suckle_less_than_day;
			this.drink_anything_other = init.drink_anything_other;
			this.drink_anything_other_specify = init.drink_anything_other_specify;
			this.drink_anything_other_frequency_days =
				init.drink_anything_other_frequency_days;
			this.drink_anything_other_frequency_days_dnk =
				init.drink_anything_other_frequency_days_dnk;
			this.baby_have_fever = init.baby_have_fever;
			this.baby_have_fever_days = init.baby_have_fever_days;
			this.baby_have_fever_less_than_day = init.baby_have_fever_less_than_day;
			this.baby_have_difficulty_breathing = init.baby_have_difficulty_breathing;
			this.baby_have_difficulty_breathing_days =
				init.baby_have_difficulty_breathing_days;
			this.baby_have_difficulty_breathing_less_than_day =
				init.baby_have_difficulty_breathing_less_than_day;
			this.baby_have_fast_breathing = init.baby_have_fast_breathing;
			this.baby_have_fast_breathing_days = init.baby_have_fast_breathing_days;
			this.baby_have_fast_breathing_less_than_day =
				init.baby_have_fast_breathing_less_than_day;
			this.baby_have_in_drawing_chest = init.baby_have_in_drawing_chest;
			this.baby_have_cough = init.baby_have_cough;
			this.baby_have_grunting = init.baby_have_grunting;
			this.baby_have_nostrils_flare_with_breathing =
				init.baby_have_nostrils_flare_with_breathing;
			this.baby_have_diarrhoea = init.baby_have_diarrhoea;
			this.baby_have_diarrhoea_days =
				init.baby_have_diarrhoea_days;
			this.baby_have_diarrhoea_less_than_day =
				init.baby_have_diarrhoea_less_than_day;
			this.baby_have_vomit = init.baby_have_vomit;
			this.baby_have_vomit_days = init.baby_have_vomit_days;
			this.baby_have_vomit_less_than_day =
				init.baby_have_vomit_less_than_day;
			this.baby_have_redness_discharge_from_umbilical_cord =
				init.baby_have_redness_discharge_from_umbilical_cord;
			this.baby_have_yellow_eyes_skin = init.baby_have_yellow_eyes_skin;
			this.baby_have_yellow_spasms_fits = init.baby_have_yellow_spasms_fits;
			this.baby_become_unresponsive_unconscious =
				init.baby_become_unresponsive_unconscious;
			this.baby_have_bulging_fontanelle = init.baby_have_bulging_fontanelle;
			this.baby_feel_cold_when_touched = init.baby_feel_cold_when_touched;
			this.baby_hands_legs_lips_discoloured =
				init.baby_hands_legs_lips_discoloured;
			this.baby_have_yellow_palms_soles = init.baby_have_yellow_palms_soles;
			this.baby_have_blood_stools = init.baby_have_blood_stools;
		}
	}
}

class SectionC {
	case_summary: string;
	assigned_cause_of_death: string;
	cause_of_death: string;

	constructor(init?: Partial<SectionC>) {
		if (init) {
			this.case_summary = init.case_summary;
			this.assigned_cause_of_death = init.assigned_cause_of_death;
			this.cause_of_death = init.cause_of_death;
		}
	}
}

export class CdrForm3 {
	id: string;

	basic: Basic;
	sectionA: SectionA;
	sectionB: SectionB;
	sectionC: SectionC;

	constructor(init?: Partial<CdrForm3>) {
		if (init) {
			this.id = init.id;

			this.basic = new Basic(init.basic);
			this.sectionA = new SectionA(init.sectionA);
			this.sectionB = new SectionB(init.sectionB);
			this.sectionC = new SectionC(init.sectionC);
		}
	}
}
