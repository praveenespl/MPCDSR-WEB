import { Form1Object } from './form1';
import moment from 'moment';

export class Form3Object {
	id?: string;
	state_id: string;
	district_id: string;
	mdr_type: string;
	facility_id: string;
	block_id: string;
	deceased_women_id: string;
	status_of_newborn: string;
	name_of_investigator: string;
	date_of_interview: string;
	createdAt?: string;
	updatedAt?: string;

	mdsrForm1: Form1Object

	constructor(initial?: Form3Object) {
		if (initial) {
			this.id = initial.id;
			this.state_id = initial.state_id;
			this.district_id = initial.district_id;
			this.mdr_type = initial.mdr_type;
			this.facility_id = initial.facility_id;
			this.block_id = initial.block_id;
			this.deceased_women_id = initial.deceased_women_id;
			this.status_of_newborn = initial.status_of_newborn;
			this.name_of_investigator = initial.name_of_investigator;
			this.date_of_interview = initial.date_of_interview;
			this.createdAt = initial.createdAt;
			this.updatedAt = initial.updatedAt;

			this.mdsrForm1 = new Form1Object(initial.mdsrForm1)
		}
	}

	get getInterviewDate(){
		return moment(this.date_of_interview).format('DD-MM-YYYY');
	}
	protected getValue(): Form3Object {
		return this;
	}
}

export class Form3ObjectExtended extends Form3Object {
	deceasedwomen: string;
	dateofdeath: string;
	placeofdeath: string;
	whendeathoccur: string;
	causeofdeath: string;

	constructor(initial?: Form3ObjectExtended) {
		super(initial);
		if (initial) {
			this.deceasedwomen = initial.deceasedwomen;
			this.dateofdeath = initial.dateofdeath;
			this.placeofdeath = initial.placeofdeath;
			this.whendeathoccur = initial.whendeathoccur
			this.causeofdeath = initial.causeofdeath;

			this.mdsrForm1 = new Form1Object(initial.mdsrForm1)
		}
	}

	getParent() {
		return this.getValue();
	}
}
