import { Form1Object } from './form1';
import { Form5Object } from './form5';
import { FileLibrary } from '../../filelibrary';

export class Form6Object {
	id?: string;
	block_id: Block;
	district_id: District;
	state_id: State;
	facility_id: Facility;
	deceased_women_id: string = '';
	deceased_women_native_address: string;
	deceased_women_current_address: string;
	timing_of_death: string = '';
	religion: string;
	caste: string;
	gravida: number = 0;
	para: number = 0;
	infant_outcome: number = 0;
	alive_children: number = 0;
	spontaneous_abortion: number = 0;
	induced_abortion: number = 0;
	interview_date: string = '';
	second_interviewdate: string = '';
	respondent_name: string = '';
	respondent_contact: string = '';
	delay_seeking_care: string[] = ['']
	delay_seeking_care_other: string = '';
	delay_reaching_facility: string[] = ['']
	delay_reaching_facility_other: string = '';
	delay_receiving: string[] = ['']
	delay_receiving_other: string = '';
	probable_direct_obstetric_cause: string = '';
	indirect_obstetric_cause: string = '';
	contributory_cause_of_death: string = '';
	initiatives_suggested: string = '';
	gpla: any = '';
	investigators: [];
	upload: any;
	investigation_date: string;
	createdAt?: string = '';
	updatedAt?: string = '';
	mdsrForm1?: Form1Object;
	mdsrForm5?: Form5Object;
	fileLibrary: any;
	doctor_name: string;
	doctor_designation: string;
	doctor_date: Date;
	doctor_reg_no: string;
	user_designation?:string;
	constructor(initial?: Partial<Form6Object>) {
		if (initial) {
			this.id = initial.id;
			this.facility_id = initial.facility_id;
			this.block_id = initial.block_id;
			this.district_id = initial.district_id;
			this.state_id = initial.state_id;
			this.deceased_women_id = initial.deceased_women_id;
			this.deceased_women_current_address = initial.deceased_women_current_address;
			this.deceased_women_native_address = initial.deceased_women_native_address;
			this.timing_of_death = initial.timing_of_death;
			this.religion = initial.religion;
			this.caste = initial.caste;
			this.gravida = initial.gravida;
			this.para = initial.para;
			this.infant_outcome = initial.infant_outcome;
			this.alive_children = initial.alive_children;
			this.spontaneous_abortion = initial.spontaneous_abortion;
			this.induced_abortion = initial.induced_abortion;
			this.interview_date = initial.interview_date;
			this.second_interviewdate = initial.second_interviewdate;
			this.respondent_name = initial.respondent_name;
			this.respondent_contact = initial.respondent_contact;
			this.delay_seeking_care = initial.delay_seeking_care;
			this.delay_seeking_care_other = initial.delay_seeking_care_other;
			this.delay_reaching_facility = initial.delay_reaching_facility;
			this.delay_reaching_facility_other = initial.delay_reaching_facility_other;
			this.delay_receiving = initial.delay_receiving;
			this.delay_receiving_other = initial.delay_receiving_other;
			this.probable_direct_obstetric_cause = initial.probable_direct_obstetric_cause;
			this.indirect_obstetric_cause = initial.indirect_obstetric_cause;
			this.contributory_cause_of_death = initial.contributory_cause_of_death;
			this.initiatives_suggested = initial.initiatives_suggested;
			this.investigators = initial.investigators;
			this.doctor_name = initial.doctor_name;
			this.doctor_designation = initial.doctor_designation;
			this.doctor_date = initial.doctor_date;
			this.doctor_reg_no = initial.doctor_reg_no;

			this.upload = initial.upload;
			this.mdsrForm1 = new Form1Object(initial.mdsrForm1);
			this.mdsrForm5 = new Form5Object(initial.mdsrForm5);
			this.fileLibrary = initial.fileLibrary;
			this.createdAt = initial.createdAt;
			this.updatedAt = initial.updatedAt;

			this.user_designation = initial.user_designation;

		}
	}
}
export class Form6Filter extends Form6Object {
	createdAt: string;
	updatedAt: string;
}
