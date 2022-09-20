import moment from 'moment';
import { Form2Object } from './form2';
import { Form6Object } from './form6';
import { Form3Object } from './form3';
import { Form5Object } from './form5';
import { Form4Object } from './form4';

export class Form1Object {
	id?: string;
	uuid?: string;
	age: number;
	block_id: Block;
	block_name: string;
	block_code: number;
	date: string;
	date_of_birth: string;
	date_of_reporting: string;
	death_date_time: string;
	deceased_women_fname: string;
	deceased_women_mname: string;
	deceased_women_lname: string;
	deceased_women_current_address:string;
	deceased_women_native_address:string;
	designation: string;
	district_id: District;
	district_name: string;
	district_code: number;
	father_name: string;
	husband_name: string;
	mcts_id: string;
	mobile: string;
	name: string;
	place_of_death: string;
	place_of_death_other: string;
	reporting_person: string;
	reporting_person1: string;
	signature: string;
	state_id: State;
	state_name: string;
	state_code: number;
	facility_id: Facility;
	facility_name: string;
	facility_code: number;
	facility_type:any;
	village_id: Village;
	village_name: string;
	village_code: number;
	when_death_occur: string;
	is_maternal_death: boolean;
	reporting_person_mobile:string;
	reporting_person_address:string;
	verified_by:string;
	cratedAt:Date;
	updateAt:Date;
	reporting_person_id:string;
	state?: State;
	block?: Block;
	village?: Village;
	district?: District;
	facility?: Facility;
	healthworker?:any;
	mdsrForm2s?: Form2Object | Form2Object[] ;
	mdsrForm6s?: Form6Object | Form6Object[];
	mdsrForm3s?: Form3Object | Form3Object[];
	mdsrForm4s?: Form4Object | Form4Object[];
	mdsrForm5s?: Form5Object | Form5Object[];

	fileLibrary?: any[]
	user_designation: string;
	// new keys
	status: 'verified' | 'pending' | 'unlist'
	created_by: string;
	modified_by: string;
	modified_date: string;

	constructor(initial?: Partial<Form1Object>) {
		if (initial) {
			this.id = initial.id;
			this.uuid = initial.uuid;
			this.age = initial.age;
			this.block_id = initial.block_id;
			//this.block_code=initial.block_code;
			//this.block_name=initial.block_name;
			this.date = initial.date;
			this.date_of_birth = initial.date_of_birth;
			this.date_of_reporting = initial.date_of_reporting;
			this.death_date_time = initial.death_date_time;
			this.deceased_women_fname = initial.deceased_women_fname;
			this.deceased_women_mname = initial.deceased_women_mname;
			this.deceased_women_lname = initial.deceased_women_lname;
			this.deceased_women_current_address=initial.deceased_women_current_address;
			this.deceased_women_native_address=initial.deceased_women_native_address;
			this.designation = initial.designation;
			this.district_id = initial.district_id;
			//this.district_code=initial.district_code;
			//this.district_name=initial.district_name;

			this.father_name = initial.father_name;
			this.husband_name = initial.husband_name;
			this.mcts_id = initial.mcts_id;
			this.mobile = initial.mobile;
			this.name = initial.name;
			this.place_of_death = initial.place_of_death;
			this.reporting_person = initial.reporting_person;
			this.reporting_person_mobile=initial.reporting_person_mobile;
			this.reporting_person_address=initial.reporting_person_address;
			this.signature = initial.signature;
			this.state_id = initial.state_id;
			//this.state_code=initial.state_code;
			//this.state_name=initial.state_name;
			this.facility_id = initial.facility_id;
			this.facility_code=initial.facility_code;
			this.facility_name=initial.facility_name;
			this.village_id = initial.village_id;
			this.facility_type = initial.facility_type;
			this.village_code=initial.village_code;
			this.village_name=initial.village_name;
			this.when_death_occur = initial.when_death_occur;
			this.reporting_person1=initial.reporting_person1;
			this.is_maternal_death=initial.is_maternal_death;
			//
			this.state = initial.state;
			this.block = initial.block;
			this.village = initial.village;
			this.district = initial.district;
			this.facility = initial.facility;
			this.healthworker = initial.healthworker;
			this.created_by = initial.created_by;
			this.user_designation = initial.user_designation;

			this.verified_by = initial.verified_by;
			this.cratedAt = this.cratedAt;
			this.updateAt = this.updateAt;
			this.reporting_person_id = this.reporting_person_id;

			if(Array.isArray(initial.mdsrForm2s)){
				this.mdsrForm2s = initial.mdsrForm2s.map(i=>new Form2Object(i))
			}else{
				this.mdsrForm2s = new Form2Object(initial.mdsrForm2s)
			}
			// Form 3
			if(Array.isArray(initial.mdsrForm3s)){
				this.mdsrForm3s = initial.mdsrForm3s.map(i=>new Form3Object(i))
			}else{
				this.mdsrForm3s = new Form3Object(initial.mdsrForm3s)
			}
			if(Array.isArray(initial.mdsrForm6s)){
				this.mdsrForm6s = initial.mdsrForm6s.map(i=>new Form6Object(i))
			}else{
				this.mdsrForm6s = new Form6Object(initial.mdsrForm6s)
			}

			if(Array.isArray(initial.mdsrForm5s)){
				this.mdsrForm5s = initial.mdsrForm5s.map(i=>new Form5Object(i))
			}else{
				this.mdsrForm5s = new Form5Object(initial.mdsrForm5s)
			}
			// Form 4 Object
			if(Array.isArray(initial.mdsrForm4s)){
				this.mdsrForm4s = initial.mdsrForm4s.map(i=>new Form4Object(i))
			}else{
				this.mdsrForm4s = new Form4Object(initial.mdsrForm4s)
			}

			this.status = initial.status

			this.fileLibrary = initial.fileLibrary || []
		}
	}

	get getDateOfBirth(){
		return moment(this.date_of_birth).format('DD-MM-YYYY');
	}

	get getAge(){
		return moment().diff(moment(this.date_of_birth),'years');
	}

	get getDateOfReporting(){
		return moment(this.date_of_reporting).format('DD-MM-YYYY');
	}

	get getDeathDateTime(){
		return moment(this.death_date_time).format('DD-MM-YYYY hh:ss A')
	}

	get getName(){
		return this.deceased_women_mname===''?this.deceased_women_fname+' '+this.deceased_women_lname:this.deceased_women_fname+' '+this.deceased_women_mname+' '+this.deceased_women_lname;
	}
}

export class Form1Filter extends Form1Object {
	createdAt: string;
	updatedAt: string;
}
