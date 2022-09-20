import moment from 'moment';
import { Form1Object } from './form1';

export class Form2Object {
	id?: string;
	block_id: Block;
	block_code:string;
	block_name:string;
	district_id: string;
	district_code:string;
	district_name:District;
	state_id: State;
	state_code:string;
	state_name:string;
	month: number;
	year: number;
	deceased_women_id: string;
	field_investigation_date: string;
	reason: string;
	action_taken: string;
	createdAt?: string;
	updatedAt?: string;

	mdsrForm1: Form1Object

	constructor(initial?: Partial<Form2Object>) {
		if (initial) {
			this.id = initial.id;
			this.block_id = initial.block_id;
			this.block_code = initial.block_code;
			this.block_name = initial.block_name;
			this.district_id = initial.district_id;
			this.district_code = initial.district_code;
			this.district_name = initial.district_name;
			this.state_id = initial.state_id;
			this.state_code = initial.state_code;
			this.state_name = initial.state_name;
			this.month = initial.month;
			this.year = initial.year;
			this.deceased_women_id = initial.deceased_women_id;
			this.field_investigation_date = initial.field_investigation_date;
			this.reason = initial.reason;
			this.action_taken = initial.action_taken;
			this.createdAt = initial.createdAt;
			this.updatedAt = initial.updatedAt;

			this.mdsrForm1 = new Form1Object(initial.mdsrForm1)
		}
	}

	protected getValue(): Form2Object {
		return this;
	}

	get getFieldInvestigationDate(){
		return moment(this.field_investigation_date).format("DD-MM-YYYY")
	}
}

export class Form2ObjectExtended extends Form2Object {
	deceased_women: string;
	age: number;
	death_date_time: string;
	address: string;
	husband_name: string;
	reporting_person: string;
	designation: string;
	cause_of_death: string;

	constructor(initial?: Form2ObjectExtended) {
		super(initial);
		if (initial) {
			this.deceased_women = initial.deceased_women;
			this.age = initial.age;
			this.death_date_time = initial.death_date_time;
			this.address = initial.address;
			this.husband_name = initial.husband_name;
			this.reporting_person = initial.reporting_person;
			this.designation = initial.designation;
			this.cause_of_death = initial.cause_of_death;
		}
	}

	getParent() {
		return this.getValue();
	}
}

export class Form2Filter extends Form2Object {
	createdAt: string;
	updatedAt: string;
}
