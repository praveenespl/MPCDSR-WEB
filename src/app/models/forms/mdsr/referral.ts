class ReferralFacility {
	date: string = "";
	labour_time: string = "";
	arrival_time: string = "";
	used_transport: string = "";
	attend_by: string = "";
	reached_time: string = "";
	money: number;
	facility: string = "";
	reason_for_referral: string = "";
	referral_no_given: string = "";
	treament_given: string = "";
	money_spent_on_treatment: number;
	time_spent_in_facility: string = "";

	constructor(initial?: Partial<ReferralFacility>) {
		if (initial) {
			(this.date = initial.date),
				(this.labour_time = initial.labour_time),
				(this.arrival_time = initial.arrival_time),
				(this.used_transport = initial.used_transport),
				(this.attend_by = initial.attend_by),
				(this.reached_time = initial.reached_time),
				(this.money = initial.money),
				(this.facility = initial.facility),
				(this.reason_for_referral = initial.reason_for_referral),
				(this.referral_no_given = initial.referral_no_given),
				(this.treament_given = initial.treament_given),
				(this.money_spent_on_treatment = initial.money_spent_on_treatment),
				(this.time_spent_in_facility = initial.time_spent_in_facility);
		}
	}
}

export class Referral {
	id?: string;
	form_name?: string;
	module_name?: string;
	deceased_women_id: string;
	home_or_village: ReferralFacility;
	facility1: ReferralFacility;
	facility2: ReferralFacility;
	facility3: ReferralFacility;
	facility4: ReferralFacility;
	facility5: ReferralFacility;
	constructor(initial?: Partial<Referral>) {
		if (initial) {
			this.id = initial.id;
			this.deceased_women_id = initial.deceased_women_id;
			this.form_name = initial.form_name;
			this.module_name = initial.module_name;
			this.home_or_village = initial.home_or_village;
			this.facility1 = initial.facility1;
			this.facility2 = initial.facility2;
			this.facility3 = initial.facility3;
			this.facility4 = initial.facility4;
			this.facility5 = initial.facility5;
		}
	}
}
