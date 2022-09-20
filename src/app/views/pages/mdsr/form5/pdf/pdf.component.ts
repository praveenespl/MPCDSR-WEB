import { Form5Service } from './../../../../../services/mdsr/form5.service';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import FormComponent from "./json/general_info.json";
import module1 from './json/module1.json';
import module2 from './json/module2.json';
import module3 from './json/module3.json';
import referral from './json/referral.json';
import other from './json/other.json';
import moment from 'moment';

@Component({
	selector: 'kt-pdf',
	templateUrl: './pdf.component.html',
	styleUrls: ['./pdf.component.scss']
})
export class PdfComponent implements OnInit {
	component: any[] = [
		{
			label: "Panel",
			title: "Form 5: For Investigation of Maternal Deaths",
			collapsible: false,
			mask: false,
			tableView: false,
			alwaysEnabled: false,
			type: "panel",
			input: false,
			key: "panel",
			components: [...FormComponent.components, ...module1, ...module2, ...module3, ...referral, ...other]
		}
	];
	submission: any;
	pdfConfig: any = {
		content: [],
		style: {
			pageStyle: {
				fontSize: 12
			}
		}
	};

	constructor(
		private activatedRoute: ActivatedRoute,
		private form5Service: Form5Service,
		private changeDetectorRef: ChangeDetectorRef

	) { }

	ngOnInit() {

		this.activatedRoute.params.subscribe(({ id }) => {
			if (id) {
				this.form5Service
					.getOne(id
						, {
							include: [
								{ relation: "referraldetails" }
							]
						}
					)
					.subscribe(response => {

						const { generalinformation, module1, module2, module3, referraldetails, other } = response;

						this.submission = {
							statename: generalinformation.state_id.statename,
							districtname: generalinformation.district_id.districtname,
							subdistrictname: generalinformation.block_id.subdistrictname,
							facilityType: generalinformation.facility_type,
							health_facility_name: generalinformation.facility_id.health_facility_name,
							villagename: generalinformation.village_id['villagename'],
							deceased_woman_name: `${generalinformation.deceased_women_fname} ${generalinformation.deceased_women_mname ? generalinformation.deceased_women_mname : generalinformation.deceased_women_lname ? generalinformation.deceased_women_lname : ''}`,
							husband_name: generalinformation.husband_name,
							father_name: generalinformation.father_name,
							death_date_time: moment(generalinformation.death_date_time).format('DD-MM-YYYY HH:MM:SS'),
							"generalinformation.cause_of_death": generalinformation.cause_of_death,
							investigation_date: moment(generalinformation.investigation_date).format("DD-MM-YYYY"),
							investigator_name1: generalinformation.investigators[0].investigator_name !== '' ? generalinformation.investigators[0].investigator_name : '-',
							designation1: generalinformation.investigators[0].investigator_designation !== '' ? generalinformation.investigators[0].investigator_designation : '-',
							investigator_name2: generalinformation.investigators[1].investigator_name !== '' ? generalinformation.investigators[0].investigator_name : '-',
							designation2: generalinformation.investigators[1].investigator_designation !== '' ? generalinformation.investigators[0].investigator_designation : '-',
							investigator_name3: generalinformation.investigators[2].investigator_name !== '' ? generalinformation.investigators[0].investigator_name : '-',
							designation3: generalinformation.investigators[2].investigator_designation !== '' ? generalinformation.investigators[0].investigator_designation : '-',
							/** Module 1 Background Details setting */
							"module1.background_info.respondent_name": module1.background_info.respondent_name,
							"module1.background_info.deceased_women_name": module1.background_info.deceased_women_name,
							"module1.background_info.relation_with_deceased_women": module1.background_info.relation_with_deceased_women,

							"module1.background_info.age": module1.background_info.age,
							"module1.background_info.period_of_death": module1.background_info.period_of_death,
							"module1.background_info.place_of_death": module1.background_info.place_of_death,
							"module1.background_info.place_of_death_other": module1.background_info.place_of_death_other,
							"module1.background_info.death_date_time": moment(module1.background_info.death_date_time).format("DD-MM-YYYY HH:MM:SS"),
							"module1.background_info.cause_of_death_informed": module1.background_info.cause_of_death_informed,
							"module1.background_info.cause_of_death": module1.background_info.cause_of_death,
							/** 2. Profile of Deceased woman */
							"module1.profile.marital_status": module1.profile.marital_status,
							"module1.profile.age_at_marriage": module1.profile.age_at_marriage,
							"module1.profile.religion": module1.profile.religion,
							"module1.profile.caste": module1.profile.caste,
							"module1.profile.bpl": module1.profile.bpl,
							"module1.profile.education": module1.profile.education,
							/** 3. Availability of health facility, services and transport */
							"module1.availability_health_facility.name_of_nearest_facility": module1.availability_health_facility.name_of_nearest_facility,
							"module1.availability_health_facility.location_of_nearest_facility": module1.availability_health_facility.name_of_nearest_facility,
							"module1.availability_health_facility.distance": module1.availability_health_facility.distance,
							"module1.availability_health_facility.mode_of_transport": module1.availability_health_facility.mode_of_transport,
							/** 4. GPLA */
							"module1.gpla.gravida": module1.gpla.gravida,
							"module1.gpla.para": module1.gpla.para,
							"module1.gpla.alive_children_total": module1.gpla.alive_children_total ? module1.gpla.alive_children_total : 'N/A',
							"module1.gpla.total_abortion": module1.gpla.total_abortion ? module1.gpla.total_abortion : 'N/A',
							"module1.gpla.alive_children_female": module1.gpla.alive_children_female ? module1.gpla.alive_children_female : 'N/A',
							"module1.gpla.alive_children_male": module1.gpla.alive_children_male ? module1.gpla.alive_children_male : 'N/A',
							"module1.gpla.induced_abortion": module1.gpla.induced_abortion ? module1.gpla.induced_abortion : 'N/A',
							"module1.gpla.spontaneous_abortion": module1.gpla.spontaneous_abortion ? module1.gpla.spontaneous_abortion : 'N/A',
							/** 5. Current pregnancy  */
							"module1.current_pregnancy.infant_survival": module1.current_pregnancy.infant_survival,
							"module1.current_pregnancy.antenatal_care_received": module1.current_pregnancy.antenatal_care_received,
							"module1.current_pregnancy.antenatal_checkup": module1.current_pregnancy.antenatal_checkup,
							"module1.current_pregnancy.place_of_checkup": module1.current_pregnancy.place_of_checkup,
							"module1.current_pregnancy.services_received_anc": module1.current_pregnancy.services_received_anc,
							"module1.current_pregnancy.problem_antenatal_period": module1.current_pregnancy.problem_antenatal_period,
							"module1.current_pregnancy.symptoms": module1.current_pregnancy.symptoms,
							"module1.current_pregnancy.care_of_symptoms": module1.current_pregnancy.care_of_symptoms,
							"module1.current_pregnancy.where_seekcare": module1.current_pregnancy.where_seekcare,
							"module1.current_pregnancy.reason_for_not_seeking": module1.current_pregnancy.care_of_symptoms === 'No' ? module1.current_pregnancy.reason_for_not_seeking : 'N/A',
							"module1.current_pregnancy.place_of_checkup_other": module1.current_pregnancy.place_of_checkup_other,
							/** Module 2 */
							/** 6. No. of weeks of pregnancy completed at the time of death */
							"module2.no_of_week_pregnancy": module2.no_of_week_pregnancy,
							/** 7. Death During Antenatal Period */
							"module2.death_during_antenatal_period.problem_at_time_of_death": module2.death_during_antenatal_period.problem_at_time_of_death,
							"module2.death_during_antenatal_period.symptoms": module2.death_during_antenatal_period.symptoms,
							"module2.death_during_antenatal_period.referred": module2.death_during_antenatal_period.referred,
							"module2.death_during_antenatal_period.care_of_complication": module2.death_during_antenatal_period.care_of_complication,
							"module2.death_during_antenatal_period.where_seekcare": module2.death_during_antenatal_period.where_seekcare,
							"module2.death_during_antenatal_period.reason_for_not_seeking": module2.death_during_antenatal_period.reason_for_not_seeking,
							/** 8. Death during Antenatal Period */
							"module2.abortion_related_death.died_abortion": module2.abortion_related_death.died_abortion,
							"module2.abortion_related_death.type_of_abortion": module2.abortion_related_death.type_of_abortion,
							"module2.abortion_related_death.date_of_abortion": module2.abortion_related_death.date_of_abortion,
							"module2.abortion_related_death.where_spontaneous_abortion": module2.abortion_related_death.where_spontaneous_abortion,
							"module2.abortion_related_death.reason_describe": module2.abortion_related_death.reason_describe,
							"module2.abortion_related_death.symptoms_after_abortion": module2.abortion_related_death.symptoms_after_abortion,
							"module2.abortion_related_death.complication_seekcare": module2.abortion_related_death.complication_seekcare,
							"module2.abortion_related_death.where_complication_seekcare": module2.abortion_related_death.where_complication_seekcare,
							"module2.abortion_related_death.other_complication_seekcare": module2.abortion_related_death.other_complication_seekcare,
							"module2.abortion_related_death.not_seekcare_reason": module2.abortion_related_death.not_seekcare_reason,
							/** Module 3 */
							/** 9. Intranatal Services */
							"module3.intranatal_services.place_of_delivery": module3.intranatal_services.place_of_delivery,
							"module3.intranatal_services.other_place_of_delivery": module3.intranatal_services.other_place_of_delivery,
							"module3.intranatal_services.reason_home_delivery": module3.intranatal_services.reason_home_delivery,

							"module3.intranatal_services.completed_weeks": module3.intranatal_services.completed_weeks,
							"module3.intranatal_services.delivery_date_time": moment(module3.intranatal_services.delivery_date_time).format('DD-MM-YYYY HH:MM:SS'),
							"module3.intranatal_services.death_date_time": moment(module3.intranatal_services.death_date_time).format('DD-MM-YYYY HH:MM:SS'),

							"module3.intranatal_services.delivry_conducted_by": module3.intranatal_services.delivry_conducted_by,
							"module3.intranatal_services.other_delivry_conducted_by": module3.intranatal_services['other_delivry_conducted_by'] ? module3.intranatal_services['other_delivry_conducted_by'] : '',
							"module3.intranatal_services.type_of_delivery": module3.intranatal_services.type_of_delivery,
							// ! Delivery outcome to be check values are not inserting properly.
							"module3.intranatal_services.delivery_outcome": JSON.stringify(module3.intranatal_services.delivery_outcome) === '{}' ? '' : '',
							"module3.intranatal_services.complication_delivery": module3.intranatal_services.complication_delivery,

							"module3.intranatal_services.institutional_delivery.provided_treatment": module3.intranatal_services.institutional_delivery.provided_treatment,
							"module3.intranatal_services.institutional_delivery.other_provided_treatment": module3.intranatal_services.institutional_delivery.other_provided_treatment,
							"module3.intranatal_services.institutional_delivery.treatment_received": module3.intranatal_services.institutional_delivery.treatment_received,

							"module3.intranatal_services.institutional_delivery.is_information_given_to_relatives": module3.intranatal_services.institutional_delivery.is_information_given_to_relatives,
							"module3.intranatal_services.institutional_delivery.information_given_to_relatives": module3.intranatal_services.institutional_delivery.information_given_to_relatives,
							"module3.intranatal_services.institutional_delivery.is_delay_initiating_treatment": module3.intranatal_services.institutional_delivery.is_delay_initiating_treatment,
							"module3.intranatal_services.institutional_delivery.delay_initiating_treatment": module3.intranatal_services.institutional_delivery.delay_initiating_treatment,

							/** home delivery */
							"module3.intranatal_services.home_delivery.home_seekcare": module3.intranatal_services.home_delivery.home_seekcare,
							"module3.intranatal_services.home_delivery.where_seekcare": module3.intranatal_services.home_delivery.where_seekcare,
							"module3.intranatal_services.home_delivery.not_home_seekcare": module3.intranatal_services.home_delivery.not_home_seekcare,

							"module3.intranatal_services.information_relatives_of_complication": module3.intranatal_services.information_relatives_of_complication,
							"module3.intranatal_services.information_relatives_of_complication_detail": module3.intranatal_services.information_relatives_of_complication_detail,
							"module3.intranatal_services.was_delay_in_treatment": module3.intranatal_services.was_delay_in_treatment,
							"module3.intranatal_services.was_delay_in_treatment_detail": module3.intranatal_services.was_delay_in_treatment_detail,

							"module3.intranatal_services.deceased_woman_referred_institutional": module3.intranatal_services.deceased_woman_referred_institutional,
							"module3.intranatal_services.deceased_woman_referred_home": module3.intranatal_services.deceased_woman_referred_home,
							"module3.intranatal_services.attend_referral_center": module3.intranatal_services.attend_referral_center,
							"module3.intranatal_services.not_seeking_care_hospital": module3.intranatal_services.not_seeking_care_hospital,
							"module3.intranatal_services.not_seeking_care_hospital_other": module3.intranatal_services.not_seeking_care_hospital_other,

							"module3.intranatal_services.info_given": module3.intranatal_services.info_given,
							"module3.intranatal_services.describe_delay_treatment": module3.intranatal_services.decribe_info_given,
							"module3.delay_treatment": module3.delay_treatment,
							"module3.describe_delay_treatment": module3.describe_delay_treatment,

							/** 10. Postnatal Period */
							"module3.postnatal_period.problem_delivery": module3.postnatal_period.problem_delivery,
							"module3.postnatal_period.date_time_problem": module3.postnatal_period.date_time_problem ? moment(module3.postnatal_period.date_time_problem).format('DD-MM-YYYY HH:MM:SS') : '',
							"module3.postnatal_period.duration.hours": module3.postnatal_period.duration.hours,
							"module3.postnatal_period.duration.days": module3.postnatal_period.duration.days,
							"module3.postnatal_period.problem_postnatal": module3.postnatal_period.problem_postnatal,

							"module3.postnatal_period.seek_treatment": module3.postnatal_period.seek_treatment,
							"module3.postnatal_period.where_seek_treatment": module3.postnatal_period.where_seek_treatment,
							"module3.postnatal_period.other_treatment": module3.postnatal_period.other_treatment,
							"module3.postnatal_period.not_seeking_care": module3.postnatal_period.not_seeking_care,

							"module3.postnatal_period.postnatal_checkup": module3.postnatal_period.postnatal_checkup,
							"module3.postnatal_period.checkups": module3.postnatal_period.checkups,
							"module3.postnatal_period.checkups_by": module3.postnatal_period.checkups_by,
							/** 11. Open History */
							"module3.open_history": module3.open_history,
							/** 12 Prevent Path */
							"module3.prevent_death": module3.prevent_death,

							/** referral details */
							/** 1 row */
							"home_or_village.date": referraldetails['home_or_village']['date'] && referraldetails['home_or_village']['date'] !== '1970-01-01T00:00:00.000Z' ? moment(referraldetails['home_or_village']['date']).format("DD-MM-YYYY") : '',
							"facility1.date": referraldetails['facility1']['date'] && referraldetails['facility1']['date'] !== '1970-01-01T00:00:00.000Z' ? moment(referraldetails['facility1']['date']).format("DD-MM-YYYY") : '',
							"facility2.date": referraldetails['facility2']['date'] && referraldetails['facility2']['date'] !== '1970-01-01T00:00:00.000Z' ? moment(referraldetails['facility2']['date']).format("DD-MM-YYYY") : '',
							"facility3.date": referraldetails['facility3']['date'] && referraldetails['facility3']['date'] !== '1970-01-01T00:00:00.000Z' ? moment(referraldetails['facility3']['date']).format("DD-MM-YYYY") : '',
							"facility4.date": referraldetails['facility4']['date'] && referraldetails['facility4']['date'] !== '1970-01-01T00:00:00.000Z' ? moment(referraldetails['facility4']['date']).format("DD-MM-YYYY") : '',
							"facility5.date": referraldetails['facility5']['date'] && referraldetails['facility5']['date'] !== '1970-01-01T00:00:00.000Z' ? moment(referraldetails['facility5']['date']).format("DD-MM-YYYY") : '',

							/** 2 row */
							"home_or_village.labour_time": referraldetails['home_or_village']['labour_time']?moment(referraldetails['home_or_village']['labour_time']).format('hh:mm a'):'',
							"facility1.labour_time": referraldetails['facility1']['labour_time']?moment(referraldetails['facility1']['labour_time']).format('hh:mm a'):'',
							"facility2.labour_time": referraldetails['facility2']['labour_time']?moment(referraldetails['facility2']['labour_time']).format('hh:mm a'):'',
							"facility3.labour_time": referraldetails['facility3']['labour_time']?moment(referraldetails['facility3']['labour_time']).format('hh:mm a'):'',
							"facility4.labour_time": referraldetails['facility4']['labour_time']?moment(referraldetails['facility4']['labour_time']).format('hh:mm a'):'',
							"facility5.labour_time": referraldetails['facility5']['labour_time']?moment(referraldetails['facility5']['labour_time']).format('hh:mm a'):'',

							/** 3 row */
							"home_or_village.arrival_time": referraldetails['home_or_village']['arrival_time']?moment(referraldetails['home_or_village']['arrival_time']).format('hh:mm a'):'',
							"facility1.arrival_time": referraldetails['facility1']['arrival_time']?moment(referraldetails['facility1']['arrival_time']).format('hh:mm a'):'',
							"facility2.arrival_time": referraldetails['facility2']['arrival_time']?moment(referraldetails['facility2']['arrival_time']).format('hh:mm a'):'',
							"facility3.arrival_time": referraldetails['facility3']['arrival_time']?moment(referraldetails['facility3']['arrival_time']).format('hh:mm a'):'',
							"facility4.arrival_time": referraldetails['facility4']['arrival_time']?moment(referraldetails['facility4']['arrival_time']).format('hh:mm a'):'',
							"facility5.arrival_time": referraldetails['facility5']['arrival_time']?moment(referraldetails['facility5']['arrival_time']).format('hh:mm a'):'',

							/** 4 row */
							"home_or_village.reached_time": referraldetails['home_or_village']['reached_time']?moment(referraldetails['home_or_village']['reached_time']).format('hh:mm a'):'',
							"facility1.reached_time": referraldetails['facility1']['reached_time']?moment(referraldetails['facility1']['reached_time']).format('hh:mm a'):'',
							"facility2.reached_time": referraldetails['facility2']['reached_time']?moment(referraldetails['facility2']['reached_time']).format('hh:mm a'):'',
							"facility3.reached_time": referraldetails['facility3']['reached_time']?moment(referraldetails['facility3']['reached_time']).format('hh:mm a'):'',
							"facility4.reached_time": referraldetails['facility4']['reached_time']?moment(referraldetails['facility4']['reached_time']).format('hh:mm a'):'',
							"facility5.reached_time": referraldetails['facility5']['reached_time']?moment(referraldetails['facility5']['reached_time']).format('hh:mm a'):'',

							/** money */
							"home_or_village.money": referraldetails['home_or_village']['money'],
							"facility1.money": referraldetails['facility1']['money'],
							"facility2.money": referraldetails['facility2']['money'],
							"facility3.money": referraldetails['facility3']['money'],
							"facility4.money": referraldetails['facility4']['money'],
							"facility5.money": referraldetails['facility5']['money'],

							/** money spent on treatment */

							"home_or_village.money_spent_on_treatment": referraldetails['home_or_village']['money_spent_on_treatment'],
							"facility1.money_spent_on_treatment": referraldetails['facility1']['money_spent_on_treatment'],
							"facility2.money_spent_on_treatment": referraldetails['facility2']['money_spent_on_treatment'],
							"facility3.money_spent_on_treatment": referraldetails['facility3']['money_spent_on_treatment'],
							"facility4.money_spent_on_treatment": referraldetails['facility4']['money_spent_on_treatment'],
							"facility5.money_spent_on_treatment": referraldetails['facility5']['money_spent_on_treatment'],
							/** 5 row */
							"home_or_village.reason_for_referral": referraldetails['home_or_village']['reason_for_referral'],
							"facility1.reason_for_referral": referraldetails['facility1']['reason_for_referral'],
							"facility2.reason_for_referral": referraldetails['facility2']['reason_for_referral'],
							"facility3.reason_for_referral": referraldetails['facility3']['reason_for_referral'],
							"facility4.reason_for_referral": referraldetails['facility4']['reason_for_referral'],
							"facility5.reason_for_referral": referraldetails['facility5']['reason_for_referral'],

							/** 6 row */
							"home_or_village.referral_no_given": referraldetails['home_or_village']['referral_no_given'],
							"facility1.referral_no_given": referraldetails['facility1']['referral_no_given'],
							"facility2.referral_no_given": referraldetails['facility2']['referral_no_given'],
							"facility3.referral_no_given": referraldetails['facility3']['referral_no_given'],
							"facility4.referral_no_given": referraldetails['facility4']['referral_no_given'],
							"facility5.referral_no_given": referraldetails['facility5']['referral_no_given'],

							/** 7 row */
							"home_or_village.treament_given": referraldetails['home_or_village']['treament_given'],
							"facility1.treament_given": referraldetails['facility1']['treament_given'],
							"facility2.treament_given": referraldetails['facility2']['treament_given'],
							"facility3.treament_given": referraldetails['facility3']['treament_given'],
							"facility4.treament_given": referraldetails['facility4']['treament_given'],
							"facility5.treament_given": referraldetails['facility5']['treament_given'],

							/** 8 row */
							"home_or_village.time_spent_in_facility": referraldetails['home_or_village']['time_spent_in_facility']?moment(referraldetails['home_or_village']['time_spent_in_facility']).format('hh:mm a'):'',
							"facility1.time_spent_in_facility": referraldetails['facility1']['time_spent_in_facility']?moment(referraldetails['facility1']['time_spent_in_facility']).format('hh:mm a'):'',
							"facility2.time_spent_in_facility": referraldetails['facility2']['time_spent_in_facility']?moment(referraldetails['facility2']['time_spent_in_facility']).format('hh:mm a'):'',
							"facility3.time_spent_in_facility": referraldetails['facility3']['time_spent_in_facility']?moment(referraldetails['facility3']['time_spent_in_facility']).format('hh:mm a'):'',
							"facility4.time_spent_in_facility": referraldetails['facility4']['time_spent_in_facility']?moment(referraldetails['facility4']['time_spent_in_facility']).format('hh:mm a'):'',
							"facility5.time_spent_in_facility": referraldetails['facility5']['time_spent_in_facility']?moment(referraldetails['facility5']['time_spent_in_facility']).format('hh:mm a'):'',

							/** 9 row */
							"home_or_village.tranport_used": referraldetails['home_or_village']['tranport_used'],
							"facility1.tranport_used": referraldetails['facility1']['tranport_used'],
							"facility2.tranport_used": referraldetails['facility2']['tranport_used'],
							"facility3.tranport_used": referraldetails['facility3']['tranport_used'],
							"facility4.tranport_used": referraldetails['facility4']['tranport_used'],
							"facility5.tranport_used": referraldetails['facility5']['tranport_used'],

							/** 10. row */
							"home_or_village.tranport_type": referraldetails['home_or_village']['tranport_type'],
							"facility1.tranport_type": referraldetails['facility1']['tranport_type'],
							"facility2.tranport_type": referraldetails['facility2']['tranport_type'],
							"facility3.tranport_type": referraldetails['facility3']['tranport_type'],
							"facility4.tranport_type": referraldetails['facility4']['tranport_type'],
							"facility5.tranport_type": referraldetails['facility5']['tranport_type'],

							/** 11. row */
							"home_or_village.facility_level": referraldetails['home_or_village']['facility_level'],
							"facility1.facility_level": referraldetails['facility1']['facility_level'],
							"facility2.facility_level": referraldetails['facility2']['facility_level'],
							"facility3.facility_level": referraldetails['facility3']['facility_level'],
							"facility4.facility_level": referraldetails['facility4']['facility_level'],
							"facility5.facility_level": referraldetails['facility5']['facility_level'],

							/** 12. row */
							"home_or_village.name_of_facility": referraldetails['home_or_village']['name_of_facility'],
							"facility1.name_of_facility": referraldetails['facility1']['name_of_facility'],
							"facility2.name_of_facility": referraldetails['facility2']['name_of_facility'],
							"facility3.name_of_facility": referraldetails['facility3']['name_of_facility'],
							"facility4.name_of_facility": referraldetails['facility4']['name_of_facility'],
							"facility5.name_of_facility": referraldetails['facility5']['name_of_facility'],
							/** Other */
							"other.leading_to_death": other.leading_to_death,

							"other.cause_of_death.direct.category": other.cause_of_death.direct.category,
							"other.cause_of_death.direct.sub_category": other.cause_of_death.direct.sub_category,
							"other.cause_of_death.direct.groupName": other.cause_of_death.direct['groupName'],

							"other.cause_of_death.indirect.category": other.cause_of_death.indirect.category,
							"other.cause_of_death.indirect.sub_category": other.cause_of_death.indirect.sub_category,
							"other.cause_of_death.indirect.groupName": other.cause_of_death.indirect['groupName'],

							"other.consequence1": other.consequence1,
							"other.consequence2": other.consequence2,
							"other.consequence3": other.consequence3,

							"other.opinion.seeking": other.opinion.seeking,
							"other.opinion.refusal_previous_facility": other.opinion.refusal_previous_facility,
							"other.opinion.refusal": other.opinion.refusal,

							"other.opinion.home_to_healthcare": other.opinion.home_to_healthcare,
							"other.opinion.between_healthcare": other.opinion.between_healthcare,
							"other.opinion.referral_system": other.opinion.referral_system,

							"other.opinion.lack_of_facility": other.opinion.lack_of_facility,
							"other.opinion.lack_of_blood": other.opinion.lack_of_blood,
							"other.opinion.lack_of_ot": other.opinion.lack_of_ot,

							"other.opinion.lack_of_human_resource": other.opinion.lack_of_human_resource,
							"other.opinion.lack_of_anesthetist": other.opinion.lack_of_anesthetist,
							"other.opinion.lack_of_obstetricians": other.opinion.lack_of_obstetricians,
							"other.opinion.lack_of_expertise": other.opinion.lack_of_expertise,

							"other.autopsy": other.autopsy,
							"other.performed": other.performed,
							"other.case_summary": other.case_summary,
						};

						setTimeout(() => {
							this.changeDetectorRef.detectChanges();
						}, 500);
					});
			}
		});
	}

	// backClicked() {
	// 	this._location.back();
	// }

}
