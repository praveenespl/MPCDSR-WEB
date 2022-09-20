import { Referral } from "./referral";

class GeneralInformation {
	state: State={
		"statecode":0,
		"statename":""
	};
	district: District={
		"districtcode":0,
		"districtname":""
	};
	block: Block={
		"subdistrictcode":0,
		"subdistrictname":""
	};
	village: string;
	facility: string;
	facility_type: string;
	deceased_women_fname: string;
	deceased_women_mname: string;
	deceased_women_lname: string;
	age: number;
	date_of_birth: string;
	mcts_id: string;
	name_of_nodal_person: string;
	mobile_of_nodal_person: string;
	//husband_name: string;
	//father_name: string;
	inpatient_no: string;
	deceased_women_current_address: string;
	medigo_legal_admission: string;
	education: string;
	bpl: string;
	mobile: string;
	death_date_time: string;
	//investigators?: [];
	//investigation_date?: string;

	// get getDeathDateTime(){
	// 	return moment(this.death_date_time).format('DD-MM-YYYY hh:ss a')
	// }
}

class PatientHistory {
	admission_date_time: string;
	death_date_time: string;
	delivery_date_time: string;
	stay_in_hospital:{
		days: number;
		hours: number;
		minutes: number;
	};
	stay_in_icu: {
		days: number;
		hours: number;
		minutes: number;
	};
	delivery_interval:{
		days: number;
		hours: number;
		minutes: number;
	};
	death_interval: {
		days: number;
		hours: number;
		minutes: number;
	};
	outcome_of_pregnancy: string;
}

class OnAdmission {
	complaints: string;
	gravida: number;
	para: number;
	infant_outcome: number;
	alive_children_male: number;
	alive_children_female: number;
	alive_children_total: number;
	spontaneous_abortion: number;
	induced_abortion: number;
	total_abortion: number;
	// TODO: can be delete in future
	male_children: number;
	// TODO: can be delete in future
	female_children: number;
	period_of_gestation: string;
}

class ConditionOnAdmission {
	condition: string;
	referred_from_outside: string;
	visited_places: number;
}

class Diagnosis {
	hemorrhage: string;
	hemorrhage_causes: {};
	hemorrhage_placental_cause: {};
	hemorrhage_late_pregnancy: {};
	hemorrhage_late_pregnancy_other: string;
	hemorrhage_postpartum: {};
	hypertensive: string;
	hypertensive_cause: AnyObject;
	hypertensive_other: string;
	labour: string;
	labour_cause: {};
	labour_other: string;
	medical_disorder: string;
	medical_disorders_cause: {};
	medical_disorders_other: string;
	infection: string;
	infection_cause: {};
	infection_causes_other: string;
	incidental: string;
	incidental_specify: string;
	other: string;
	other_specify: string;
}

class Abortion {
	type: string;
	spontaneous: string;
	induced: string;
	procedure: {};
	other_procedure: string;
	post_abortion_period: {};
	post_abortion_period_other: string;
	termination_more_than_one_center: string;
	other_centers: string;
}

class AntenatalCare {
	receive_anc: string;
	facility_type: {};
	other_facility: string;
	services_by: {};
	services_by_other: string;
	complication: string;
	identified_risk_factor: {};
	medical_specify: string;
	other_specify: string;
}

class NeonatalInfo {
	labour_pain: string;
	past_facility: string;
	current_facility: string;
	complication_labour: {};
	other_complication_labour: string;
	mode_of_delivery: string;
	anaesthesia: string;
	develop_complication: string;
	post_birth?: string;
	neonatal_outcome: string;
	neonatal_cause_of_death: {};
	neonatal_cause_of_death_other: string;
	post_natal_period: string;
	post_natal_cause_of_death: {};
	post_natal_medical?: string;
	post_natal_other?: string;
}

class Interventions {
	early_pregnancy: string;
	antenatal: string;
	intrapartum: string;
	postpartum: string;
	anaesthesia_icu: string;
	transfusion: string;
	units: number;
	unit_type: string;
	reaction: string;
	specify_reaction: string;
}

class DirectCauseOfDeath{
	group_name:string;
	category: string;
	sub_category: string;

}

class InDirectCauseOfDeath{

}
class CauseOfDeath {
	direct: DirectCauseOfDeath;
	indirect: InDirectCauseOfDeath;
	death_type: string;
	cause_type:'string';
	//group_name: Array<string>;
	//indirect_group_name: Array<string>;
	//sub_group: string;
	consequence1: string;
	consequence2: string;
	consequence3: string;
}

class Doctor {
	name: string;
	designation:'string';
	reg_no: string;
	date: Date;
}

class Opinion {
	seeking: string;
	refusal: string;
	refusal_previous_facility: string;
	home_to_healthcare: string;
	between_healthcare: string;
	referral_system: string;
	lack_of_facility: string;
	lack_of_blood: string;
	lack_of_ot: string;
	lack_of_human_resource: string;
	lack_of_anesthetist: string;
	lack_of_obstetricians: string;
	lack_of_expertise: string;
}

export class Form4Object {
	id?: string;
	state: State;
	district: District;
	block: Block;
	village_id: string;

	facility_id: string;

	deceased_women_id: string;
	deceased_women_id_new: string;
	address: string;
	name_of_nodal_person: string;
	mobile: string;

	fbmdr_no: string;
	month: string;
	year: string;

	general_information: GeneralInformation;
	patient_history: PatientHistory;
	on_admission: OnAdmission;
	condition_on_admission: ConditionOnAdmission;
	diagnosis: Diagnosis;
	abortion: Abortion;
	antenatal_care: AntenatalCare;
	neonatal_info: NeonatalInfo;
	interventions: Interventions;

	leading_to_death: string;
	cause_of_death: CauseOfDeath;
	doctor?: Doctor;

	opinion: Opinion;
	autopsy: string;

	performed: string;

	case_summary: string;

	createdAt?: string;
	updatedAt?: string;

	referraldetails: Referral[] | Referral;

	constructor(initial?: Partial<Form4Object>) {
		if (initial) {
			this.id = initial.id;
			this.state = initial.state;
			this.district = initial.district;
			this.block = initial.block;
			this.village_id = initial.village_id;
			this.facility_id = initial.facility_id;
			this.deceased_women_id = initial.deceased_women_id;
			this.deceased_women_id_new = initial.deceased_women_id_new;
			this.address = initial.address;
			this.name_of_nodal_person = initial.name_of_nodal_person;
			this.mobile = initial.mobile;
			this.fbmdr_no = initial.fbmdr_no;
			this.month = initial.month;
			this.year = initial.year;

			this.autopsy = initial.autopsy;
			this.performed = initial.performed;
			this.case_summary = initial.case_summary;
			this.leading_to_death = initial.leading_to_death;

			if (initial.general_information) {
				this.general_information = <any>{
					state: initial.general_information.state,
					district: initial.general_information.district,
					block: initial.general_information.block,
					village: initial.general_information.village,
					facility: initial.general_information.facility,
					facility_type: initial.general_information.facility_type,
					name_of_nodal_person:
						initial.general_information.name_of_nodal_person,
					mobile_of_nodal_person:
						initial.general_information.mobile_of_nodal_person,

					deceased_women_fname:
						initial.general_information.deceased_women_fname,
					deceased_women_mname:
						initial.general_information.deceased_women_mname,
					deceased_women_lname:
						initial.general_information.deceased_women_lname,
					//husband_name: initial.general_information.husband_name,
					//father_name: initial.general_information.father_name,
					mcts_id: initial.general_information.mcts_id,
					inpatient_no: initial.general_information.inpatient_no,
					deceased_women_current_address:
						initial.general_information.deceased_women_current_address,
					medigo_legal_admission:
						initial.general_information.medigo_legal_admission,
					education: initial.general_information.education,
					bpl: initial.general_information.bpl,
					age: initial.general_information.age,
					date_of_birth: initial.general_information.date_of_birth,
					mobile: initial.general_information.mobile
					//death_date_time: initial.general_information.death_date_time,
					//investigators: initial.general_information.investigators,
					//investigation_date:
					//	initial.general_information.investigation_date
				};
			}

			if (initial.patient_history) {
				this.patient_history = {
					admission_date_time: initial.patient_history.admission_date_time,
					death_date_time: initial.patient_history.death_date_time,
					delivery_date_time: initial.patient_history.delivery_date_time,
					stay_in_hospital: initial.patient_history.stay_in_hospital,
					stay_in_icu: initial.patient_history.stay_in_icu,
					delivery_interval: initial.patient_history.delivery_interval,
					death_interval: initial.patient_history.death_interval,
					outcome_of_pregnancy: initial.patient_history.outcome_of_pregnancy
				};
			}

			if (initial.on_admission) {
				this.on_admission = {
					complaints: initial.on_admission.complaints,
					gravida: initial.on_admission.gravida,
					infant_outcome: initial.on_admission.infant_outcome,
					para: initial.on_admission.para,
					alive_children_male: initial.on_admission.alive_children_male,
					alive_children_female: initial.on_admission.alive_children_female,
					alive_children_total: initial.on_admission.alive_children_total,
					spontaneous_abortion: initial.on_admission.spontaneous_abortion,
					induced_abortion: initial.on_admission.induced_abortion,
					total_abortion: initial.on_admission.total_abortion,
					male_children: initial.on_admission.male_children,
					female_children: initial.on_admission.female_children,
					period_of_gestation: initial.on_admission.period_of_gestation
				};
			}

			if (initial.condition_on_admission) {
				this.condition_on_admission = <any>{
					condition: initial.condition_on_admission.condition,
					referred_from_outside:
						initial.condition_on_admission.referred_from_outside,
					visited_places: initial.condition_on_admission.visited_places
				};
			}

			if (initial.diagnosis) {
				this.diagnosis = <any>{
					hemorrhage: initial.diagnosis.hemorrhage,
					hemorrhage_causes: initial.diagnosis.hemorrhage_causes,
					hemorrhage_placental_cause:
						initial.diagnosis.hemorrhage_placental_cause,
					hemorrhage_late_pregnancy:
						initial.diagnosis.hemorrhage_late_pregnancy,
					hemorrhage_late_pregnancy_other:
						initial.diagnosis.hemorrhage_late_pregnancy_other,
					hemorrhage_postpartum: initial.diagnosis.hemorrhage_postpartum,
					hypertensive: initial.diagnosis.hypertensive,
					hypertensive_cause: initial.diagnosis.hypertensive_cause,
					hypertensive_other: initial.diagnosis.hypertensive_other,
					labour: initial.diagnosis.labour,
					labour_cause: initial.diagnosis.labour_cause,
					labour_other: initial.diagnosis.labour_other,
					medical_disorder: initial.diagnosis.medical_disorder,
					medical_disorders_cause: initial.diagnosis.medical_disorders_cause,
					medical_disorders_other: initial.diagnosis.medical_disorders_other,
					infection: initial.diagnosis.infection,
					infection_cause: initial.diagnosis.infection_cause,
					infection_causes_other: initial.diagnosis.infection_causes_other,
					incidental: initial.diagnosis.incidental,
					incidental_specify: initial.diagnosis.incidental_specify,
					other: initial.diagnosis.other,
					other_specify: initial.diagnosis.other_specify
				};
			}

			if (initial.abortion) {
				this.abortion = <any>{
					type: initial.abortion.type,
					spontaneous: initial.abortion.spontaneous,
					induced: initial.abortion.induced,
					procedure: initial.abortion.procedure,
					other_procedure: initial.abortion.other_procedure,
					post_abortion_period: initial.abortion.post_abortion_period,
					post_abortion_period_other:
						initial.abortion.post_abortion_period_other,
					termination_more_than_one_center:
						initial.abortion.termination_more_than_one_center,
					other_centers: initial.abortion.other_centers
				};
			}

			if (initial.antenatal_care) {
				this.antenatal_care = <any>{
					receive_anc: initial.antenatal_care.receive_anc,
					facility_type: initial.antenatal_care.facility_type,
					other_facility: initial.antenatal_care.other_facility,
					services_by: initial.antenatal_care.services_by,
					services_by_other: initial.antenatal_care.services_by_other,
					complication: initial.antenatal_care.complication,
					identified_risk_factor: initial.antenatal_care.identified_risk_factor,
					medical_specify: initial.antenatal_care.medical_specify,
					other_specify: initial.antenatal_care.other_specify
				};
			}

			if (initial.neonatal_info) {
				this.neonatal_info = <any>{
					labour_pain: initial.neonatal_info.labour_pain,
					past_facility: initial.neonatal_info.past_facility,
					current_facility: initial.neonatal_info.current_facility,
					complication_labour: initial.neonatal_info.complication_labour,
					other_complication_labour:
						initial.neonatal_info.other_complication_labour,
					mode_of_delivery: initial.neonatal_info.mode_of_delivery,
					anaesthesia: initial.neonatal_info.anaesthesia,
					develop_complication: initial.neonatal_info.develop_complication,
					post_birth: initial.neonatal_info.post_birth,
					neonatal_outcome: initial.neonatal_info.neonatal_outcome,
					neonatal_cause_of_death:
						initial.neonatal_info.neonatal_cause_of_death,
					neonatal_cause_of_death_other:
						initial.neonatal_info.neonatal_cause_of_death_other,
					post_natal_period: initial.neonatal_info.post_natal_period,
					post_natal_cause_of_death:
						initial.neonatal_info.post_natal_cause_of_death,
					post_natal_medical: initial.neonatal_info.post_natal_medical,
					post_natal_other: initial.neonatal_info.post_natal_other
				};
			}

			if (initial.interventions) {
				this.interventions = <any>{
					early_pregnancy: initial.interventions.early_pregnancy,
					antenatal: initial.interventions.antenatal,
					intrapartum: initial.interventions.intrapartum,
					postpartum: initial.interventions.postpartum,
					anaesthesia_icu: initial.interventions.anaesthesia_icu,
					transfusion: initial.interventions.transfusion,
					units: initial.interventions.units,
					unit_type: initial.interventions.unit_type,
					reaction: initial.interventions.reaction,
					specify_reaction: initial.interventions.specify_reaction
				};
			}

			if (initial.cause_of_death) {
				this.cause_of_death = <any>{
					death_type: initial.cause_of_death.death_type,
					cause_type: initial.cause_of_death.cause_type,
					//group_name: initial.cause_of_death.group_name,
					//indirect_group_name: initial.cause_of_death.indirect_group_name,
					//sub_group: initial.cause_of_death.sub_group,
					direct: initial.cause_of_death.direct,
					indirect: initial.cause_of_death.indirect,
					consequence1: initial.cause_of_death.consequence1,
					consequence2: initial.cause_of_death.consequence2,
					consequence3: initial.cause_of_death.consequence3
				};
			}

			if (initial.opinion) {
				this.opinion = <any>{
					seeking: initial.opinion.seeking,
					refusal: initial.opinion.refusal,
					refusal_previous_facility: initial.opinion.refusal_previous_facility,
					home_to_healthcare: initial.opinion.home_to_healthcare,
					between_healthcare: initial.opinion.between_healthcare,
					referral_system: initial.opinion.referral_system,
					lack_of_facility: initial.opinion.lack_of_facility,
					lack_of_blood: initial.opinion.lack_of_blood,
					lack_of_ot: initial.opinion.lack_of_ot,
					lack_of_human_resource: initial.opinion.lack_of_human_resource,
					lack_of_anesthetist: initial.opinion.lack_of_anesthetist,
					lack_of_obstetricians: initial.opinion.lack_of_obstetricians,
					lack_of_expertise: initial.opinion.lack_of_expertise
				};
			}

			if (initial.referraldetails) {
				if (Array.isArray(initial.referraldetails) && initial.referraldetails.length) {
					this.referraldetails = initial.referraldetails.pop();
				}else {
					this.referraldetails = initial.referraldetails || this.referraldetails;
				}
			}

			if(initial.doctor){
				this.doctor = initial.doctor
			}
		}
	}
}
