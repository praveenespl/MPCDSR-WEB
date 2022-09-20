class Basic {
	mcts_number: string;

	constructor(init?: Partial<Basic>) {
		if (init) {
			this.mcts_number = init.mcts_number;
		}
	}
}

class SectionA {
	informant_name: string;
	informant_relation: string;
	place_of_death: string;
	place_of_death_other: string;
	contact_number: string;
	number_of_family_members: string;
	number_of_children: string;
	cast: string;
	below_poverty_line: string;
	family_assets: string;

	constructor(init?: Partial<SectionA>) {
		if (init) {
			this.informant_name = init.informant_name;
			this.informant_relation = init.informant_relation;
			this.place_of_death = init.place_of_death;
			this.place_of_death_other = init.place_of_death_other;
			this.contact_number = init.contact_number;
			this.number_of_family_members = init.number_of_family_members;
			this.number_of_children = init.number_of_children;
			this.cast = init.cast;
			this.below_poverty_line = init.below_poverty_line;
			this.family_assets = init.family_assets;
		}
	}
}

class SectionB {
	asha_aww_vhn_anm_advice_on_hospital: string;
	who_advised: string;
	who_advised_other: string;
	seek_care_outside_home: string;
	illness_was_serious: string;
	money_not_available: string;
	family_members_were_not_able_to_accompany: string;
	bad_weather: string;
	did_not_know_where_to_take: string;
	no_hope_for_survival: string;
	transport_not_available: string;
	others: string;
	condition_when_decide_for_medical_consultation: string;
	quack_informal_service_providers: string;
	traditional_healer_religious_healer: string;
	sub_centre: string;
	phc: string;
	chc: string;
	sub_district_hospital: string;
	district_govt__Hospital: string;
	private_allopathic_doctor: string;
	doctors_in_alternate_system_of_medicine: string;
	reason_for_seeking_care_from_there: string;
	hospital_you_took_baby_type: string;
	hospital_you_took_baby_first_health_facility: string;
	hospital_you_took_baby_referral_institution_i: string;
	hospital_you_took_baby_referral_institution_ii: string;
	hospital_you_took_baby_referral_institution_iii: string;
	problem_health_facility: string;
	problem_referral_institution_i: string;
	problem_referral_institution_ii: string;
	problem_referral_institution_iii: string;
	time_taken_to_reach_facility_health_facility: string;
	time_taken_to_reach_facility_referral_institution_i: string;
	time_taken_to_reach_facility_referral_institution_ii: string;
	time_taken_to_reach_facility_referral_institution_iii: string;
	treatment_received_health_facility: string;
	treatment_received_referral_institution_i: string;
	treatment_received_referral_institution_ii: string;
	treatment_received_referral_institution_iii: string;
	reasons_for_referring_health_facility: string;
	reasons_for_referring_referral_institution_i: string;
	reasons_for_referring_referral_institution_ii: string;
	reasons_for_referring_referral_institution_iii: string;
	reasons_for_referring_other_health_facility: string;
	reasons_for_referring_other_referral_institution_i: string;
	reasons_for_referring_other_referral_institution_ii: string;
	reasons_for_referring_other_referral_institution_iii: string;
	ransport_from_one_institution_to_other_health_facility: string;
	ransport_from_one_institution_to_other_referral_institution_i: string;
	ransport_from_one_institution_to_other_referral_institution_ii: string;
	ransport_from_one_institution_to_other_referral_institution_iii: string;
	distance_from_one_institution_to_other_health_facility: string;
	distance_from_one_institution_to_other_referral_institution_i: string;
	distance_from_one_institution_to_other_referral_institution_ii: string;
	distance_from_one_institution_to_other_referral_institution_iii: string;
	state_the_reasons_health_facility: string;
	state_the_reasons_referral_institution_i: string;
	state_the_reasons_referral_institution_ii: string;
	state_the_reasons_referral_institution_iii: string;
	who_advised_health_facility: string;
	who_advised_referral_institution_i: string;
	who_advised_referral_institution_ii: string;
	who_advised_referral_institution_iii: string;
	child_attended_immediately_health_facility: string;
	child_attended_immediately_referral_institution_i: string;
	child_attended_immediately_referral_institution_ii: string;
	child_attended_immediately_referral_institution_iii: string;
	time_taken_to_initiate_treatment_health_facility: string;
	time_taken_to_initiate_treatment_referral_institution_i: string;
	time_taken_to_initiate_treatment_referral_institution_ii: string;
	time_taken_to_initiate_treatment_referral_institution_iii: string;
	reasons_for_delay_health_facility: string;
	reasons_for_delay_referral_institution_i: string;
	reasons_for_delay_referral_institution_ii: string;
	reasons_for_delay_referral_institution_iii: string;
	reasons_for_delay_other_health_facility: string;
	reasons_for_delay_other_referral_institution_i: string;
	reasons_for_delay_other_referral_institution_ii: string;
	reasons_for_delay_other_referral_institution_iii: string;
	discharged_against_medical_advice_absconded: string;
	discharge_due_to_dissatisfaction_of_treatment: string;
	states_of_child_at_timed_of_lama_Discharge: string;

	constructor(init?: Partial<SectionB>) {
		if (init) {
			this.asha_aww_vhn_anm_advice_on_hospital =
				init.asha_aww_vhn_anm_advice_on_hospital;
			this.who_advised = init.who_advised;
			this.who_advised_other = init.who_advised_other;
			this.seek_care_outside_home = init.seek_care_outside_home;
			this.illness_was_serious = init.illness_was_serious;
			this.money_not_available = init.money_not_available;
			this.family_members_were_not_able_to_accompany =
				init.family_members_were_not_able_to_accompany;
			this.bad_weather = init.bad_weather;
			this.did_not_know_where_to_take = init.did_not_know_where_to_take;
			this.no_hope_for_survival = init.no_hope_for_survival;
			this.transport_not_available = init.transport_not_available;
			this.others = init.others;
			this.condition_when_decide_for_medical_consultation =
				init.condition_when_decide_for_medical_consultation;
			this.quack_informal_service_providers =
				init.quack_informal_service_providers;
			this.traditional_healer_religious_healer =
				init.traditional_healer_religious_healer;
			this.sub_centre = init.sub_centre;
			this.phc = init.phc;
			this.chc = init.chc;
			this.sub_district_hospital = init.sub_district_hospital;
			this.district_govt__Hospital = init.district_govt__Hospital;
			this.private_allopathic_doctor = init.private_allopathic_doctor;
			this.doctors_in_alternate_system_of_medicine =
				init.doctors_in_alternate_system_of_medicine;
			this.reason_for_seeking_care_from_there =
				init.reason_for_seeking_care_from_there;
			this.hospital_you_took_baby_type = init.hospital_you_took_baby_type;
			this.hospital_you_took_baby_first_health_facility =
				init.hospital_you_took_baby_first_health_facility;
			this.hospital_you_took_baby_referral_institution_i =
				init.hospital_you_took_baby_referral_institution_i;
			this.hospital_you_took_baby_referral_institution_ii =
				init.hospital_you_took_baby_referral_institution_ii;
			this.hospital_you_took_baby_referral_institution_iii =
				init.hospital_you_took_baby_referral_institution_iii;
			this.problem_health_facility = init.problem_health_facility;
			this.problem_referral_institution_i = init.problem_referral_institution_i;
			this.problem_referral_institution_ii =
				init.problem_referral_institution_ii;
			this.problem_referral_institution_iii =
				init.problem_referral_institution_iii;
			this.time_taken_to_reach_facility_health_facility =
				init.time_taken_to_reach_facility_health_facility;
			this.time_taken_to_reach_facility_referral_institution_i =
				init.time_taken_to_reach_facility_referral_institution_i;
			this.time_taken_to_reach_facility_referral_institution_ii =
				init.time_taken_to_reach_facility_referral_institution_ii;
			this.time_taken_to_reach_facility_referral_institution_iii =
				init.time_taken_to_reach_facility_referral_institution_iii;
			this.treatment_received_health_facility =
				init.treatment_received_health_facility;
			this.treatment_received_referral_institution_i =
				init.treatment_received_referral_institution_i;
			this.treatment_received_referral_institution_ii =
				init.treatment_received_referral_institution_ii;
			this.treatment_received_referral_institution_iii =
				init.treatment_received_referral_institution_iii;
			this.reasons_for_referring_health_facility =
				init.reasons_for_referring_health_facility;
			this.reasons_for_referring_referral_institution_i =
				init.reasons_for_referring_referral_institution_i;
			this.reasons_for_referring_referral_institution_ii =
				init.reasons_for_referring_referral_institution_ii;
			this.reasons_for_referring_referral_institution_iii =
				init.reasons_for_referring_referral_institution_iii;
			this.reasons_for_referring_other_health_facility =
				init.reasons_for_referring_other_health_facility;
			this.reasons_for_referring_other_referral_institution_i =
				init.reasons_for_referring_other_referral_institution_i;
			this.reasons_for_referring_other_referral_institution_ii =
				init.reasons_for_referring_other_referral_institution_ii;
			this.reasons_for_referring_other_referral_institution_iii =
				init.reasons_for_referring_other_referral_institution_iii;
			this.ransport_from_one_institution_to_other_health_facility =
				init.ransport_from_one_institution_to_other_health_facility;
			this.ransport_from_one_institution_to_other_referral_institution_i =
				init.ransport_from_one_institution_to_other_referral_institution_i;
			this.ransport_from_one_institution_to_other_referral_institution_ii =
				init.ransport_from_one_institution_to_other_referral_institution_ii;
			this.ransport_from_one_institution_to_other_referral_institution_iii =
				init.ransport_from_one_institution_to_other_referral_institution_iii;
			this.distance_from_one_institution_to_other_health_facility =
				init.distance_from_one_institution_to_other_health_facility;
			this.distance_from_one_institution_to_other_referral_institution_i =
				init.distance_from_one_institution_to_other_referral_institution_i;
			this.distance_from_one_institution_to_other_referral_institution_ii =
				init.distance_from_one_institution_to_other_referral_institution_ii;
			this.distance_from_one_institution_to_other_referral_institution_iii =
				init.distance_from_one_institution_to_other_referral_institution_iii;
			this.state_the_reasons_health_facility =
				init.state_the_reasons_health_facility;
			this.state_the_reasons_referral_institution_i =
				init.state_the_reasons_referral_institution_i;
			this.state_the_reasons_referral_institution_ii =
				init.state_the_reasons_referral_institution_ii;
			this.state_the_reasons_referral_institution_iii =
				init.state_the_reasons_referral_institution_iii;
			this.who_advised_health_facility = init.who_advised_health_facility;
			this.who_advised_referral_institution_i =
				init.who_advised_referral_institution_i;
			this.who_advised_referral_institution_ii =
				init.who_advised_referral_institution_ii;
			this.who_advised_referral_institution_iii =
				init.who_advised_referral_institution_iii;
			this.child_attended_immediately_health_facility =
				init.child_attended_immediately_health_facility;
			this.child_attended_immediately_referral_institution_i =
				init.child_attended_immediately_referral_institution_i;
			this.child_attended_immediately_referral_institution_ii =
				init.child_attended_immediately_referral_institution_ii;
			this.child_attended_immediately_referral_institution_iii =
				init.child_attended_immediately_referral_institution_iii;
			this.time_taken_to_initiate_treatment_health_facility =
				init.time_taken_to_initiate_treatment_health_facility;
			this.time_taken_to_initiate_treatment_referral_institution_i =
				init.time_taken_to_initiate_treatment_referral_institution_i;
			this.time_taken_to_initiate_treatment_referral_institution_ii =
				init.time_taken_to_initiate_treatment_referral_institution_ii;
			this.time_taken_to_initiate_treatment_referral_institution_iii =
				init.time_taken_to_initiate_treatment_referral_institution_iii;
			this.reasons_for_delay_health_facility =
				init.reasons_for_delay_health_facility;
			this.reasons_for_delay_referral_institution_i =
				init.reasons_for_delay_referral_institution_i;
			this.reasons_for_delay_referral_institution_ii =
				init.reasons_for_delay_referral_institution_ii;
			this.reasons_for_delay_referral_institution_iii =
				init.reasons_for_delay_referral_institution_iii;
			this.reasons_for_delay_other_health_facility =
				init.reasons_for_delay_other_health_facility;
			this.reasons_for_delay_other_referral_institution_i =
				init.reasons_for_delay_other_referral_institution_i;
			this.reasons_for_delay_other_referral_institution_ii =
				init.reasons_for_delay_other_referral_institution_ii;
			this.reasons_for_delay_other_referral_institution_iii =
				init.reasons_for_delay_other_referral_institution_iii;
			this.discharged_against_medical_advice_absconded =
				init.discharged_against_medical_advice_absconded;
			this.discharge_due_to_dissatisfaction_of_treatment =
				init.discharge_due_to_dissatisfaction_of_treatment;
			this.states_of_child_at_timed_of_lama_Discharge =
				init.states_of_child_at_timed_of_lama_Discharge;
		}
	}
}

class SectionC {
	history_of_alcoholism_in_family: string;
	history_of_smoking_in_family: string;
	history_of_domestic_violence_in_family: string;
	danger_signs_when_taken_to_health_facility: string;
	what_will_be__conditions: string;
	hospital_where_newborns_infants_children_can_be_admitted_and_treated: string;
	facilities_name: string;

	constructor(init?: Partial<SectionC>) {
		if (init) {
			this.history_of_alcoholism_in_family =
				init.history_of_alcoholism_in_family;
			this.history_of_smoking_in_family = init.history_of_smoking_in_family;
			this.history_of_domestic_violence_in_family =
				init.history_of_domestic_violence_in_family;
			this.danger_signs_when_taken_to_health_facility =
				init.danger_signs_when_taken_to_health_facility;
			this.what_will_be__conditions = init.what_will_be__conditions;
			this.hospital_where_newborns_infants_children_can_be_admitted_and_treated =
				init.hospital_where_newborns_infants_children_can_be_admitted_and_treated;
			this.facilities_name = init.facilities_name;
		}
	}
}

class SectionD {
	total_amount: string;
	treatment: string;
	transport: string;
	others: string;
	family_arrange_this_money: string;

	constructor(init?: Partial<SectionD>) {
		if (init) {
			this.total_amount = init.total_amount;
			this.treatment = init.treatment;
			this.transport = init.transport;
			this.others = init.others;
			this.family_arrange_this_money = init.family_arrange_this_money;
		}
	}
}

export class CdrForm3C {
	id: string;

	basic: Basic;
	sectionA: SectionA;
	sectionB: SectionB;
	sectionC: SectionC;
	sectionD: SectionD;

	constructor(init?: Partial<CdrForm3C>) {
		if (init) {
			this.id = init.id;

			this.basic = new Basic(init.basic);
			this.sectionA = new SectionA(init.sectionA);
			this.sectionB = new SectionB(init.sectionB);
			this.sectionC = new SectionC(init.sectionC);
			this.sectionD = new SectionD(init.sectionD);
		}
	}
}
