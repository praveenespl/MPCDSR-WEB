class Address {
	statecode: number;
	statename: string;

	districtcode: number;
	districtname: string;

	subdistrictcode: number;
	subdistrictname: string;
	
	villagecode: string;
	villagename: string;

	colony: string;
	house_number: string;
	pincode: string;
	landmark?: string;

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

class SymptomsDuringIllness {
	inability_to_feed?: string;
	inability_to_feed_days?: string;
	fever?: string;
	fever_days?: string;
	loose_stools?: string;
	loose_stools_days?: string;
	vomiting?: string;
	vomiting_days?: string;
	fast_breathing?: string;
	fast_breathing_days?: string;
	convulsions?: string;
	convulsions_days?: string;
	appearance_of_skin_rashes?: string;
	appearance_of_skin_rashes_days?: string;
	injury?: string;
	injury_days?: string;
	other?: string;
	other_days?: string;

	constructor(init?: Partial<SymptomsDuringIllness>) {
		if (init) {
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
			this.other = init.other;
			this.other_days = init.other_days;
		}
	}
}

class SectionA {
	
	child_name: string;
	date_of_birth: Date;
	age: string;
	sex: string;
	address: Address;
	phc_area_name: string;
	sub_center_name: string;
	order_of_birth: string;
	belongs_to: string;
	below_poverty_line: string;
	immunization_status: string;
	weight: string;
	growth_curve: string;
	any_ho_illness_injury: string;
	nature_of_illness: string;
	symptoms_during_illness: SymptomsDuringIllness;
	treatment_for_illness_was_taken: string;
	where_was_child_treated: any;

	constructor(init?: Partial<SectionA>) {
		if (init) {
			
			this.child_name = init.child_name;
			this.date_of_birth = new Date(init.date_of_birth);
			this.age = init.age;
			this.sex = init.sex;
			this.address = new Address(init.address);
			this.phc_area_name = init.phc_area_name;
			this.sub_center_name = init.sub_center_name;
			this.order_of_birth = init.order_of_birth;
			this.belongs_to = init.belongs_to;
			this.below_poverty_line = init.below_poverty_line;
			this.immunization_status = init.immunization_status;
			this.weight = init.weight;
			this.growth_curve = init.growth_curve;
			this.any_ho_illness_injury = init.any_ho_illness_injury;
			this.nature_of_illness = init.nature_of_illness;
			this.symptoms_during_illness = new SymptomsDuringIllness(
				init.symptoms_during_illness
			);
			this.treatment_for_illness_was_taken =
				init.treatment_for_illness_was_taken;
			this.where_was_child_treated = init.where_was_child_treated;
		}
	}
}

class SectionB {
	diarrhoea: boolean;
	pneumonia: boolean;
	malaria: boolean;
	measles: boolean;
	septicemia: boolean;
	meningitis: boolean;
	injury: boolean;
	other: string;
	no_identifiable_cause: boolean;

	constructor(init?: Partial<SectionB>) {
		if (init) {
			this.diarrhoea = init.diarrhoea;
			this.pneumonia = init.pneumonia;
			this.malaria = init.malaria;
			this.measles = init.measles;
			this.septicemia = init.septicemia;
			this.meningitis = init.meningitis;
			this.injury = init.injury;
			this.other = init.other;
			this.no_identifiable_cause = init.no_identifiable_cause;
		}
	}
}

class SectionC {
	cause_of_death: string;

	constructor(init?: Partial<SectionC>) {
		if (init) {
			this.cause_of_death = init.cause_of_death;
		}
	}
}

class SectionD {
	delay_at_home: boolean;
	delay_in_transportation: boolean;
	delay_at_facility: boolean;

	constructor(init?: Partial<SectionD>) {
		if (init) {
			this.delay_at_home = init.delay_at_home;
			this.delay_in_transportation = init.delay_in_transportation;
			this.delay_at_facility = init.delay_at_facility;
		}
	}
}

class SectionE {
	case_summary: string;

	constructor(init?: Partial<SectionE>) {
		if (init) {
			this.case_summary = init.case_summary;
		}
	}
}

export class CdrForm2 {
	id: string;

	statecode: number
	districtcode: number
	subdistrictcode: number
	villagecode: number
	cdr_id:string;
	// 
	sectionA = new SectionA();
	sectionB = new SectionB();
	sectionC = new SectionC();
	sectionD = new SectionD();
	sectionE = new SectionE();

	constructor(init?: Partial<CdrForm2>) {
		if (init) {
			this.id = init.id
			this.cdr_id = init.cdr_id;
			this.statecode = init.statecode
			this.districtcode = init.districtcode
			this.subdistrictcode = init.subdistrictcode
			this.villagecode = init.villagecode

			this.sectionA = new SectionA(init.sectionA);
			this.sectionB = new SectionB(init.sectionB);
			this.sectionC = new SectionC(init.sectionC);
			this.sectionD = new SectionD(init.sectionD);
			this.sectionE = new SectionE(init.sectionE);
		}
	}
}
