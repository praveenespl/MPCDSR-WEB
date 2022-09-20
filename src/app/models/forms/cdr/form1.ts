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

export class CdrForm1 {
	id: string;

	notification_received_date: Date;
	notification_received_person_name: string;
	name: string;
	date_of_birth: Date;
	age: string;
	sex: string;
	mother_name: string;
	father_name: string;
	address: Address;
	landline: string;
	mobile: string;
	date_of_death: Date;
	palce_of_death: string;
	actual_palce_of_death:string;
	hospital_name: string;
	first_informant_type:string;
	primary_informant_name: string;
	time: string;
	date_of_notification: Date;
	createdBy: string;

	statecode: number;
	districtcode: number;
	subdistrictcode: number;
	villagecode: number;
	cdrForm2s: any;
	cdrForm3s: any;
	cdrForm3bs:any;
	cdrForm3cs:any;
	cdrForm4as:any;
	cdrForm4bs:any;
	//

	constructor(init?: Partial<CdrForm1>) {
		if (init) {
			this.id = init.id;

			this.notification_received_date = init.notification_received_date
				? new Date(init.notification_received_date)
				: undefined;
			this.notification_received_person_name =
				init.notification_received_person_name;
			this.name = init.name;
			this.date_of_birth = init.date_of_birth
				? new Date(init.date_of_birth)
				: undefined;
			this.age = init.age;
			this.sex = init.sex;
			this.mother_name = init.mother_name;
			this.father_name = init.father_name;
			this.address = new Address(init.address);
			this.landline = init.landline;
			this.mobile = init.mobile;
			this.date_of_death = init.date_of_death
				? new Date(init.date_of_death)
				: undefined;
			this.palce_of_death = init.palce_of_death;
			this.actual_palce_of_death = init.actual_palce_of_death;
			this.hospital_name = init.hospital_name;
			this.first_informant_type = init.first_informant_type;
			this.primary_informant_name = init.primary_informant_name;
			this.time = init.time;
			this.date_of_notification = init.date_of_notification
				? new Date(init.date_of_notification)
				: undefined;
			this.createdBy = init.createdBy;

			this.statecode = init.statecode;
			this.districtcode = init.districtcode;
			this.subdistrictcode = init.subdistrictcode;
			this.villagecode = init.villagecode;
			this.cdrForm2s = init.cdrForm2s;
			this.cdrForm3s = init.cdrForm3s;
			this.cdrForm3bs = init.cdrForm3bs;
			this.cdrForm3cs = init.cdrForm3cs;
			this.cdrForm4as = init.cdrForm4as;
			this.cdrForm4bs = init.cdrForm4bs;
		}
	}
}
