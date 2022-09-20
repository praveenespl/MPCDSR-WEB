import { Referral } from './referral';
import { Form1Object } from "./form1";

class Module1 {
	background_info = {
		respondent_name: "",
		deceased_women_name: "",
		relation_with_deceased_women: "",
		date_of_birth: "",
		age: NaN,
		place_of_death: "",
		place_of_death_other: "",
		death_date_time: "",
		cause_of_death_informed: "",
		cause_of_death: "",
		period_of_death: ""
	};

	profile = {
		marital_status: false,
		age_at_marriage: NaN,
		religion: "",
		other_religion: "",
		caste: "",
		bpl: "",
		education: "",
		other_education: ""
	};
	availability_health_facility = {
		name_of_nearest_facility: "",
		location_of_nearest_facility: "",
		distance: NaN,
		mode_of_transport: ""
	};
	gpla = {
		gravida: NaN,
		para: NaN,
		infant_outcome: NaN,
		alive_children_male: NaN,
		alive_children_female: NaN,
		alive_children_total: NaN,
		spontaneous_abortion: NaN,
		induced_abortion: NaN,
		total_abortion: NaN
	};
	current_pregnancy = {
		infant_survival: "",
		antenatal_care_received: "",
		antenatal_checkup: NaN,
		place_of_checkup: [],
		place_of_checkup_other: "",
		services_received_anc: [],
		problem_antenatal_period: "",
		symptoms: [],
		other_symptoms: "",
		care_of_symptoms: "",
		where_seekcare: "",
		where_seekcare_other: "",
		reason_for_not_seeking: [],
		otehrs_reason_for_notseeking: ""
	};
}

class Module2 {
	no_of_week_pregnancy = NaN;
	death_during_antenatal_period: {
		problem_at_time_of_death: string;
		symptoms: string[];
		other_symptoms: string;
		referred: string;
		care_of_complication: string;
		where_seekcare: string;
		reason_for_not_seeking: string[];
		others_reason_for_not_seeking: string;
	};
	abortion_related_death: {
		died_abortion: string;
		type_of_abortion: string;
		date_of_abortion: string;
		where_spontaneous_abortion: string;
		other_spontaneous_abortion: string;
		how_induced: string;
		where_induced_abortion: string;
		other_induced_abortion: string;
		abortion_perfomed_by: string;
		other_abortion_perfomed_by: string;
		reason_for_induced: string;
		reason_describe: string;
		symptoms_after_abortion: string;
		complication_seekcare: string;
		where_complication_seekcare: string;
		other_complication_seekcare: string;
		not_seekcare_reason: string;
	};
}

class Module3 {
	intranatal_services: {
		place_of_delivery: string;
		other_place_of_delivery: string;
		reason_home_delivery: [];
		other_reason_home_delivery: string;
		completed_weeks: 0;
		delivery_date_time: "2019-12-16T11:14:43.334Z";
		death_date_time: "2019-12-16T11:14:43.334Z";
		delivry_conducted_by: string;
		type_of_delivery: string;
		delivery_outcome: {
			live_birth: 0;
			still_birth: 0;
		};
		complication_delivery: [];
		other_complication_delivery: string;
		institutional_delivery: {
			provided_treatment: string;
			other_provided_treatment: string;
			treatment_received: string;
			is_information_given_to_relatives: string;
			information_relatives_of_complication_detail: string
			delay_initiating_treatment:string;
			is_delay_initiating_treatment:string;
			information_given_to_relatives:string;
		};
		home_delivery: {
			home_seekcare: string;
			not_home_seekcare: [];
			other_not_home_seekcare: string;
			where_seekcare: string;
			other_where_seekcare: string;
		};
		both_delivery: {
			info_given: string;
			decribe_info_given: string;
			delay_treatment: string;
			describe_delay_treatment: string;
		};
		information_relatives_of_complication: string;
		information_relatives_of_complication_detail: string;
		was_delay_in_treatment: string;
		was_delay_in_treatment_detail: string;

		deceased_woman_referred_institutional: string;
		deceased_woman_referred_home: string;

		attend_referral_center: string;
		not_seeking_care_hospital: string;
		not_seeking_care_hospital_other: string;

		info_given: string;
		decribe_info_given: string;

		referred: string;
		referred_first_point: string;
		referral_center: string;
		not_seekcare_reason: [];
		other_not_seekcare_reason: string;
		info_given_hospital: string;
		decribe_info_given_hospital: string;
		delay_initiate_treatment: string;
		describe_delay_initiate: string;
	};
	postnatal_period: {
		problem_delivery: string;
		date_time_problem: "2019-12-16T11:14:43.334Z";
		duration: {
			hours: string;
			days: string;
		};
		problem_postnatal: string;
		other_problem_postnatal: string;
		seek_treatment: string;
		where_seek_treatment: string;
		other_treatment: string;
		treatment_provided: string;
		other_treatment_provided: string;
		treatment_received: string;
		referred: string;
		referral_center: string;
		not_seeking_care: [];
		other_not_seeking_care: string;
		postnatal_checkup: string;
		checkups: 0;
		checkups_by: string;
		other_checkup_by: string;
	};
	delay_treatment:string;
	describe_delay_treatment:string;
	open_history: string;
	prevent_death: string;
}

export class Form5Object {
	id?: string;
	canEdit?: boolean;
	deceased_women_id: string;
	deceased_women_id_new: string;
	mdsrForm1: Form1Object;
	generalinformation: {
		state_id: State;
		district_id: District;
		block_id: Block;
		village_id: string;
		facility_id: Facility;
		facility_type: string;
		deceased_women_fname: string;
		deceased_women_mname: string;
		deceased_women_lname: string;
		husband_name: string;
		father_name: string;
		mcts_id: string;
		death_date_time: string;
		cause_of_death: string;
		investigators: Array<any>;
		investigation_date: string;
	};

	other = {
		leading_to_death: "",
		cause_of_death: {
			direct: {
				group_name: "",
				category: "",
				sub_category: ""
			},
			indirect: {
				group_name: "",
				category: "",
				sub_category: ""
			}
		},
		consequence1: "",
		consequence2: "",
		consequence3: "",
		opinion: {
			seeking: "",
			refusal_previous_facility: "",
			home_to_healthcare: "",
			between_healthcare: "",
			referral_system: "",
			lack_of_facility: "",
			lack_of_blood: "",
			lack_of_ot: "",
			lack_of_human_resource: "",
			lack_of_anesthetist: "",
			lack_of_expertise: "",
			lack_of_obstetricians: "",
			refusal: ""
		},
		autopsy: "",
		performed: "",
		case_summary: ""
	};

	state_id: State;
	district_id: District;
	block_id: Block;
	village_id: string;
	facility_id: Facility;

	module1: Module1;
	module2: Module2;
	module3: Module3;

	referraldetails: Referral[] | Referral;

	createdAt?: string;
	updatedAt?: string;

	village?: any;

	constructor(initial?: Partial<Form5Object>) {
		if (initial) {
			this.id = initial.id;
			this.canEdit = initial.canEdit;
			this.mdsrForm1 = initial.mdsrForm1;
			this.deceased_women_id = initial.deceased_women_id;
			this.deceased_women_id_new = initial.deceased_women_id_new;
			if (initial.generalinformation) {
				this.state_id = initial.generalinformation.state_id;
				this.district_id = initial.generalinformation.district_id;
				this.block_id = initial.generalinformation.block_id;
				this.facility_id = initial.generalinformation.facility_id;
				this.village_id = initial.generalinformation.village_id;
				this.generalinformation = {
					state_id: initial.generalinformation.state_id,
					district_id: initial.generalinformation.district_id,
					block_id: initial.generalinformation.block_id,
					village_id: initial.generalinformation.village_id,
					facility_id: initial.generalinformation.facility_id,
					facility_type: initial.generalinformation.facility_type,
					deceased_women_fname: initial.generalinformation.deceased_women_fname,
					deceased_women_mname: initial.generalinformation.deceased_women_mname,
					deceased_women_lname: initial.generalinformation.deceased_women_lname,
					husband_name: initial.generalinformation.husband_name,
					father_name: initial.generalinformation.father_name,
					mcts_id: initial.generalinformation.mcts_id,
					death_date_time: initial.generalinformation.death_date_time,
					cause_of_death: initial.generalinformation.cause_of_death,
					investigators: initial.generalinformation.investigators,
					investigation_date: initial.generalinformation.investigation_date
				};
			}

			if (initial.module1) {
				this.module1 = <any>{};
				if (initial.module1.background_info) {
					this.module1.background_info = {
						respondent_name: initial.module1.background_info.respondent_name,
						relation_with_deceased_women:
							initial.module1.background_info.relation_with_deceased_women,
						deceased_women_name:
							initial.module1.background_info.deceased_women_name,
						date_of_birth: initial.module1.background_info.date_of_birth,
						age: initial.module1.background_info.age,
						place_of_death: initial.module1.background_info.place_of_death,
						place_of_death_other:
							initial.module1.background_info.place_of_death_other,
						death_date_time: initial.module1.background_info.death_date_time,
						cause_of_death_informed:
							initial.module1.background_info.cause_of_death_informed,
						cause_of_death: initial.module1.background_info.cause_of_death,
						period_of_death: initial.module1.background_info.period_of_death
					};
				}

				if (initial.module1.profile) {
					this.module1.profile = {
						marital_status: initial.module1.profile.marital_status,
						age_at_marriage: initial.module1.profile.age_at_marriage,
						religion: initial.module1.profile.religion,
						other_religion: initial.module1.profile.other_religion,
						caste: initial.module1.profile.caste,
						bpl: initial.module1.profile.bpl,
						education: initial.module1.profile.education,
						other_education: initial.module1.profile.other_education
					};
				}

				if (initial.module1.availability_health_facility) {
					this.module1.availability_health_facility = {
						name_of_nearest_facility:
							initial.module1.availability_health_facility
								.name_of_nearest_facility,
						location_of_nearest_facility:
							initial.module1.availability_health_facility
								.location_of_nearest_facility,
						distance: initial.module1.availability_health_facility.distance,
						mode_of_transport:
							initial.module1.availability_health_facility.mode_of_transport
					};
				}

				if (initial.module1.gpla) {
					this.module1.gpla = {
						gravida: initial.module1.gpla.gravida,
						para: initial.module1.gpla.para,
						alive_children_female: initial.module1.gpla.alive_children_female,
						alive_children_male: initial.module1.gpla.alive_children_male,
						alive_children_total: initial.module1.gpla.alive_children_total,
						// live_birth: initial.module1.gpla.live_birth,
						infant_outcome: initial.module1.gpla.infant_outcome,
						// abortion: initial.module1.gpla.abortion,
						induced_abortion: initial.module1.gpla.induced_abortion,
						spontaneous_abortion: initial.module1.gpla.induced_abortion,
						total_abortion: initial.module1.gpla.total_abortion
					};
				}

				if (initial.module1.current_pregnancy) {
					this.module1.current_pregnancy = {
						infant_survival: initial.module1.current_pregnancy.infant_survival,
						antenatal_care_received:
							initial.module1.current_pregnancy.antenatal_care_received,
						antenatal_checkup:
							initial.module1.current_pregnancy.antenatal_checkup,
						place_of_checkup:
							initial.module1.current_pregnancy.place_of_checkup || [],
						place_of_checkup_other:
							initial.module1.current_pregnancy.place_of_checkup_other || "",
						services_received_anc:
							initial.module1.current_pregnancy.services_received_anc || [],
						problem_antenatal_period:
							initial.module1.current_pregnancy.problem_antenatal_period,
						symptoms: initial.module1.current_pregnancy.symptoms || [],
						other_symptoms: initial.module1.current_pregnancy.other_symptoms,
						care_of_symptoms:
							initial.module1.current_pregnancy.care_of_symptoms,
						where_seekcare: initial.module1.current_pregnancy.where_seekcare,
						where_seekcare_other:
							initial.module1.current_pregnancy.where_seekcare_other,
						reason_for_not_seeking:
							initial.module1.current_pregnancy.reason_for_not_seeking || [],
						otehrs_reason_for_notseeking:
							initial.module1.current_pregnancy.otehrs_reason_for_notseeking
					};
				}

				if (initial.other) {
					this.other = {
						leading_to_death:
							initial.other.leading_to_death || this.other.leading_to_death,
						cause_of_death: {
							direct: initial.other.cause_of_death.direct,
							indirect: initial.other.cause_of_death.indirect
						},
						consequence1: initial.other.consequence1 || this.other.consequence1,
						consequence2: initial.other.consequence2 || this.other.consequence2,
						consequence3: initial.other.consequence3 || this.other.consequence3,
						opinion: {
							seeking:
								initial.other.opinion.seeking || this.other.opinion.seeking,
							refusal_previous_facility:
								initial.other.opinion.refusal_previous_facility ||
								this.other.opinion.refusal_previous_facility,
							home_to_healthcare:
								initial.other.opinion.home_to_healthcare ||
								this.other.opinion.home_to_healthcare,
							between_healthcare:
								initial.other.opinion.between_healthcare ||
								this.other.opinion.between_healthcare,
							referral_system:
								initial.other.opinion.referral_system ||
								this.other.opinion.referral_system,
							lack_of_facility:
								initial.other.opinion.lack_of_facility ||
								this.other.opinion.lack_of_facility,
							lack_of_blood:
								initial.other.opinion.lack_of_blood ||
								this.other.opinion.lack_of_blood,
							lack_of_ot:
								initial.other.opinion.lack_of_ot ||
								this.other.opinion.lack_of_ot,
							lack_of_human_resource:
								initial.other.opinion.lack_of_human_resource ||
								this.other.opinion.lack_of_human_resource,
							lack_of_anesthetist:
								initial.other.opinion.lack_of_anesthetist ||
								this.other.opinion.lack_of_anesthetist,
							lack_of_expertise:
								initial.other.opinion.lack_of_expertise ||
								this.other.opinion.lack_of_expertise,
							lack_of_obstetricians:
								initial.other.opinion.lack_of_obstetricians ||
								this.other.opinion.lack_of_obstetricians,
							refusal:
								initial.other.opinion.refusal || this.other.opinion.refusal
						},
						autopsy: initial.other.autopsy || this.other.autopsy,
						performed: initial.other.performed || this.other.performed,
						case_summary: initial.other.case_summary || this.other.case_summary
					};
				}
			}

			if (initial.module2) {
				this.module2 = <any>{};

				this.module2.no_of_week_pregnancy =
					initial.module2.no_of_week_pregnancy;

				if (initial.module2.death_during_antenatal_period) {
					this.module2.death_during_antenatal_period = {
						problem_at_time_of_death:
							initial.module2.death_during_antenatal_period
								.problem_at_time_of_death,
						symptoms:
							initial.module2.death_during_antenatal_period.symptoms || [],
						other_symptoms:
							initial.module2.death_during_antenatal_period.other_symptoms,
						referred: initial.module2.death_during_antenatal_period.referred,
						care_of_complication:
							initial.module2.death_during_antenatal_period
								.care_of_complication,
						where_seekcare:
							initial.module2.death_during_antenatal_period.where_seekcare,
						reason_for_not_seeking:
							initial.module2.death_during_antenatal_period
								.reason_for_not_seeking || [],
						others_reason_for_not_seeking:
							initial.module2.death_during_antenatal_period
								.others_reason_for_not_seeking
					};
				}

				if (initial.module2.abortion_related_death) {
					this.module2.abortion_related_death = {
						died_abortion: initial.module2.abortion_related_death.died_abortion,
						type_of_abortion:
							initial.module2.abortion_related_death.type_of_abortion,
						date_of_abortion:
							initial.module2.abortion_related_death.date_of_abortion,
						where_spontaneous_abortion:
							initial.module2.abortion_related_death.where_spontaneous_abortion,
						other_spontaneous_abortion:
							initial.module2.abortion_related_death.other_spontaneous_abortion,
						how_induced: initial.module2.abortion_related_death.how_induced,
						where_induced_abortion:
							initial.module2.abortion_related_death.where_induced_abortion,
						other_induced_abortion:
							initial.module2.abortion_related_death.other_induced_abortion,
						abortion_perfomed_by:
							initial.module2.abortion_related_death.abortion_perfomed_by,
						other_abortion_perfomed_by:
							initial.module2.abortion_related_death.other_abortion_perfomed_by,
						reason_for_induced:
							initial.module2.abortion_related_death.reason_for_induced,
						reason_describe:
							initial.module2.abortion_related_death.reason_describe,
						symptoms_after_abortion:
							initial.module2.abortion_related_death.symptoms_after_abortion,
						complication_seekcare:
							initial.module2.abortion_related_death.complication_seekcare,
						where_complication_seekcare:
							initial.module2.abortion_related_death
								.where_complication_seekcare,
						other_complication_seekcare:
							initial.module2.abortion_related_death
								.other_complication_seekcare,
						not_seekcare_reason:
							initial.module2.abortion_related_death.not_seekcare_reason
					};
				}
			}

			if (initial.module3) {
				this.module3 = <any>{};

				if (initial.module3.intranatal_services) {
					this.module3.intranatal_services = {
						place_of_delivery:
							initial.module3.intranatal_services.place_of_delivery,
						other_place_of_delivery:
							initial.module3.intranatal_services.other_place_of_delivery,
						reason_home_delivery:
							initial.module3.intranatal_services.reason_home_delivery || [],
						other_reason_home_delivery:
							initial.module3.intranatal_services.other_reason_home_delivery,
						completed_weeks:
							initial.module3.intranatal_services.completed_weeks,
						delivery_date_time:
							initial.module3.intranatal_services.delivery_date_time,
						death_date_time:
							initial.module3.intranatal_services.death_date_time,
						delivry_conducted_by:
							initial.module3.intranatal_services.delivry_conducted_by,
						type_of_delivery:
							initial.module3.intranatal_services.type_of_delivery,

						delivery_outcome: initial.module3.intranatal_services
							.delivery_outcome
							? {
								live_birth:
									initial.module3.intranatal_services.delivery_outcome
										.live_birth,
								still_birth:
									initial.module3.intranatal_services.delivery_outcome
										.still_birth
							}
							: undefined,

						complication_delivery:
							initial.module3.intranatal_services.complication_delivery || [],

						other_complication_delivery:
							initial.module3.intranatal_services.other_complication_delivery,

						institutional_delivery: initial.module3.intranatal_services
							.institutional_delivery
							? {
								...initial.module3.intranatal_services.institutional_delivery
							}
							: undefined,

						home_delivery: initial.module3.intranatal_services.home_delivery
							? {
								...initial.module3.intranatal_services.home_delivery
							}
							: undefined,

						both_delivery: initial.module3.intranatal_services.both_delivery
							? {
								info_given:
									initial.module3.intranatal_services.both_delivery
										.info_given,
								decribe_info_given:
									initial.module3.intranatal_services.both_delivery
										.decribe_info_given,
								delay_treatment:
									initial.module3.intranatal_services.both_delivery
										.delay_treatment,
								describe_delay_treatment:
									initial.module3.intranatal_services.both_delivery
										.describe_delay_treatment
							}
							: undefined,
						information_relatives_of_complication: initial.module3.intranatal_services.information_relatives_of_complication,
						information_relatives_of_complication_detail: initial.module3.intranatal_services.information_relatives_of_complication_detail,
						was_delay_in_treatment: initial.module3.intranatal_services.was_delay_in_treatment,
						was_delay_in_treatment_detail: initial.module3.intranatal_services.was_delay_in_treatment_detail,
						deceased_woman_referred_institutional: initial.module3.intranatal_services.deceased_woman_referred_institutional,
						deceased_woman_referred_home: initial.module3.intranatal_services.deceased_woman_referred_home,
						attend_referral_center: initial.module3.intranatal_services.attend_referral_center,
						not_seeking_care_hospital: initial.module3.intranatal_services.not_seeking_care_hospital,
						not_seeking_care_hospital_other: initial.module3.intranatal_services.not_seeking_care_hospital_other,
						info_given: initial.module3.intranatal_services.info_given,
						decribe_info_given: initial.module3.intranatal_services.decribe_info_given,

						referred: initial.module3.intranatal_services.referred,

						referred_first_point:
							initial.module3.intranatal_services.referred_first_point,
						referral_center:
							initial.module3.intranatal_services.referral_center,

						not_seekcare_reason:
							initial.module3.intranatal_services.not_seekcare_reason || [],
						other_not_seekcare_reason:
							initial.module3.intranatal_services.other_not_seekcare_reason,

						info_given_hospital:
							initial.module3.intranatal_services.info_given_hospital,
						decribe_info_given_hospital:
							initial.module3.intranatal_services.decribe_info_given_hospital,
						delay_initiate_treatment:
							initial.module3.intranatal_services.delay_initiate_treatment,
						describe_delay_initiate:
							initial.module3.intranatal_services.describe_delay_initiate
					};

					if (initial.module3.postnatal_period) {
						this.module3.postnatal_period = {
							problem_delivery:
								initial.module3.postnatal_period.problem_delivery,
							date_time_problem:
								initial.module3.postnatal_period.date_time_problem,

							duration: initial.module3.postnatal_period.duration
								? {
									hours: initial.module3.postnatal_period.duration.hours,
									days: initial.module3.postnatal_period.duration.days
								}
								: undefined,

							problem_postnatal:
								initial.module3.postnatal_period.problem_postnatal,
							other_problem_postnatal:
								initial.module3.postnatal_period.other_problem_postnatal,
							seek_treatment: initial.module3.postnatal_period.seek_treatment,
							where_seek_treatment:
								initial.module3.postnatal_period.where_seek_treatment,
							other_treatment: initial.module3.postnatal_period.other_treatment,
							treatment_provided:
								initial.module3.postnatal_period.treatment_provided,
							other_treatment_provided:
								initial.module3.postnatal_period.other_treatment_provided,
							treatment_received:
								initial.module3.postnatal_period.treatment_received,
							referred: initial.module3.postnatal_period.referred,
							referral_center: initial.module3.postnatal_period.referral_center,

							not_seeking_care:
								initial.module3.postnatal_period.not_seeking_care || [],

							other_not_seeking_care:
								initial.module3.postnatal_period.other_not_seeking_care,
							postnatal_checkup:
								initial.module3.postnatal_period.postnatal_checkup,
							checkups: initial.module3.postnatal_period.checkups,
							checkups_by: initial.module3.postnatal_period.checkups_by,
							other_checkup_by:
								initial.module3.postnatal_period.other_checkup_by
						};
					}

					this.module3.open_history = initial.module3.open_history;
					this.module3.delay_treatment = initial.module3.delay_treatment,
					this.module3.describe_delay_treatment = initial.module3.describe_delay_treatment;

					this.module3.prevent_death = initial.module3.prevent_death;
				}
			}

			if (initial.referraldetails) {
				if (Array.isArray(initial.referraldetails) && initial.referraldetails.length) {
					this.referraldetails = initial.referraldetails.pop();
				} else {
					this.referraldetails = initial.referraldetails || this.referraldetails;
				}
			}

			this.village = initial.village;
		}
	}
}
