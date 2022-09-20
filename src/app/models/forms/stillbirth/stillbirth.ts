class BasicInformation {
    date_of_still_birth: Date;
    intramural: string;
    mother_age: number;
    consanguineous_marriage: string;
    constructor(init?: Partial<BasicInformation>) {
		if (init) {
            this.date_of_still_birth = init.date_of_still_birth
            ? new Date(init.date_of_still_birth)
            : undefined;
			this.intramural = init.intramural;
			this.mother_age = init.mother_age;
			this.consanguineous_marriage = init.consanguineous_marriage;
		}
	}
}

class ObstetricalHistory {
    gravida: number;
    para: number;
    abortion: number;
    constructor(init?: Partial<ObstetricalHistory>) {
		if (init) {
			this.gravida = init.gravida;
			this.para = init.para;
			this.abortion = init.abortion;
		}
	}
}

class PregnancyCare {
    obstetrical_history:ObstetricalHistory
    past_history: string;
    past_history_details: string;
    previous_still_birth: string;
    previous_birth_defect: string;
    prev_c_section: string;
    rh_negative: string;
    antenatal_care_received: string;
    tt_Vaccination: string;
    iron_folic_acid: string;
    syphilis_test: string;
    hemoglobin: string;
    hiv_Status: string;
    malaria: string;
    gestational_diabetes_mellitus:string;
    pre_natal_ultrasound: string;
    constructor(init?: Partial<PregnancyCare>) {
		if (init) {
            this.obstetrical_history=new ObstetricalHistory(init.obstetrical_history)
			this.past_history = init.past_history;
			this.past_history_details = init.past_history_details;
            this.previous_still_birth = init.previous_still_birth;
            this.previous_birth_defect = init.previous_birth_defect;
            this.prev_c_section = init.prev_c_section;
            this.rh_negative = init.rh_negative;
            this.antenatal_care_received = init.antenatal_care_received;
            this.tt_Vaccination = init.tt_Vaccination;
            this.iron_folic_acid = init.iron_folic_acid;
            this.syphilis_test = init.syphilis_test;
            this.hemoglobin = init.hemoglobin;
            this.hiv_Status = init.hiv_Status;
            this.malaria = init.malaria;
            this.gestational_diabetes_mellitus=init.gestational_diabetes_mellitus;
            this.pre_natal_ultrasound = init.pre_natal_ultrasound;
		}
	}
}

class ExaminationOnAdmission {
    fetal_heart_sound: string;
    blood_pressure: string;
    systolic:string;
    diastolic:string;
    per_vaginal_bleeding: string;
    fever: string;
    constructor(init?: Partial<ExaminationOnAdmission>) {
		if (init) {
			this.fetal_heart_sound = init.fetal_heart_sound;
			this.blood_pressure = init.blood_pressure;
            this.systolic=init.systolic;
            this.diastolic=init.diastolic;
            this.per_vaginal_bleeding = init.per_vaginal_bleeding;
            this.fever = init.fever;
		}
	}
}

class DeliveryDetails {
    partograph_used: string;
    type_of_labour: string;
    mode_of_delivery: string;
    constructor(init?: Partial<DeliveryDetails>) {
		if (init) {
			this.partograph_used = init.partograph_used;
			this.type_of_labour = init.type_of_labour;
            this.mode_of_delivery = init.mode_of_delivery;
		}
	}
}

class BirthDetails{
    baby_weight: number;
    sex_of_baby: string;
    gestation_age_week: number;
    gestation_age_days: number;
    confirmation_of_gestation_age_by: string;
    constructor(init?: Partial<BirthDetails>) {
		if (init) {
			this.baby_weight = init.baby_weight;
			this.sex_of_baby = init.sex_of_baby;
            this.gestation_age_week = init.gestation_age_week;
            this.gestation_age_days = init.gestation_age_days;
            this.confirmation_of_gestation_age_by = init.confirmation_of_gestation_age_by;
		}
	}
}

class Examination{
    examination_on_admission:ExaminationOnAdmission;
    delivery_details:DeliveryDetails;
    birth_details:BirthDetails;
    constructor(init?: Partial<Examination>) {
		if (init) {
			this.examination_on_admission = new ExaminationOnAdmission(init.examination_on_admission);
			this.delivery_details = new DeliveryDetails(init.delivery_details);
            this.birth_details = new BirthDetails(init.birth_details);
		}
	}
}

class DetailsOfStillBirth{
    type_of_still_birth: string;
    maternal_condition_associated_with_fetal_death: string;
    details_of_MCAWFD:string;
    fetal_death_main_cause: string;
    birthDefect:string;
    birthDefectOption:string
    birthDefectOptionOther:string;
    other_associated_conditions: string;
    modifiable_factors: boolean;s
    family_related: string;
    administration_related: string;
    provider_related: string;
    critical_delay:string;
    constructor(init?: Partial<DetailsOfStillBirth>) {
		if (init) {
			this.type_of_still_birth = init.type_of_still_birth;
			this.maternal_condition_associated_with_fetal_death = init.maternal_condition_associated_with_fetal_death;
            this.details_of_MCAWFD=init.details_of_MCAWFD;
            this.fetal_death_main_cause = init.fetal_death_main_cause;
            this.birthDefect=init.birthDefect;
            this.birthDefectOption=init.birthDefectOption;
            this.birthDefectOptionOther=init.birthDefectOptionOther;
            this.other_associated_conditions = init.other_associated_conditions;
            this.modifiable_factors = init.modifiable_factors;
			this.family_related = init.family_related;
            this.administration_related = init.administration_related;
            this.provider_related = init.provider_related;
            this.critical_delay=init.critical_delay;
		}
	}
}

export class Stillbirth {
    id: string;
    state:object;
    district:object;
    block:object;
    other_block_name:string
    //village:object;
    stillBirthNo:string;
    //deliveries_in_month:number;
    baby_hospital_record_no:string;
    mother_hospital_record_no:string;
    name_of_facility:string;
    type_of_facility:string;
    filled_by: string;
    filled_date: Date;
    imgObj:any;
    //center_name: string;
    //nbbd_number: string;
    basic_information=new BasicInformation();
    pregnancy_care=new PregnancyCare();
    examination=new Examination();
    details_of_still_birth=new DetailsOfStillBirth();
    //

    constructor(init?: Partial<Stillbirth>) {
        if (init) {
            this.id = init.id;
            this.state = init.state;
            this.district = init.district;
            this.block = init.block;
            this.other_block_name=init.other_block_name;
            //this.village = init.village;
            //this.center_name = init.center_name;
            //this.nbbd_number = init.nbbd_number;
            this.stillBirthNo=init.stillBirthNo;
           // this.deliveries_in_month=init.deliveries_in_month;
            this.baby_hospital_record_no =init.baby_hospital_record_no;         
            this.mother_hospital_record_no = init.mother_hospital_record_no;
            this.name_of_facility=init.name_of_facility;
            this.type_of_facility=init.type_of_facility;
            this.filled_by = init.filled_by;
            this.filled_date = init.filled_date
                ? new Date(init.filled_date)
                : undefined;
            this.imgObj=init.imgObj;
            this.basic_information = new BasicInformation(init.basic_information);
            this.pregnancy_care = new PregnancyCare(init.pregnancy_care);
            this.examination = new Examination(init.examination);
            this.details_of_still_birth = new DetailsOfStillBirth(init.details_of_still_birth);  
        }
    }
}

