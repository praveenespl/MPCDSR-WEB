import { CustomValidator } from './../../../../../../../utilities/validators/reactiveValidators';
import { FormGroup, FormControl, Validators } from "@angular/forms";

const addressForm = new FormGroup({
	state: new FormControl("", [Validators.required]),
	district: new FormControl("", [Validators.required]),
	block: new FormControl("", [Validators.required]),
	village: new FormControl("", []),
	colony: new FormControl("", []),
	house_number: new FormControl(""),
	pincode: new FormControl("", [
		Validators.minLength(6),
		Validators.maxLength(6),
	]),
	landmark: new FormControl(),
});

const basic = new FormGroup({
	district: new FormControl("", [Validators.required]),
	block: new FormControl("", [Validators.required]),
	village: new FormControl("", []),
	phc: new FormControl("", [Validators.required]),
	sub_centre: new FormControl("", [Validators.required]),
	mcts_number: new FormControl("", []),
	date: new FormControl("", [Validators.required]),
	household_head_name: new FormControl("", [Validators.required]),
	deceased_name: new FormControl("", [Validators.required]),
	deceased_mother_name: new FormControl("", [Validators.required]),
});

const sectionA = new FormGroup({
	// Details of the Respondent:
	respondent_name: new FormControl("", [Validators.required]),
	respondent_relation: new FormControl("", [Validators.required]), // Array ['Brother/Sister', 'Mother/Father', 'Neighbour/No relationGrandfather/Grandmother', 'Other relative']
	// 3. Did the respondent live with the deceased during the events that led to death?
	respondent_live_with_deceased_during_death: new FormControl("", [
		Validators.required,
	]), // ['Yes', 'No']
	// 4. What is the highest standard of education the respondent has completed?
	respondent_education: new FormControl("", [Validators.required]), // Array ['Illiterate and literate with no formal education', 'Literate, Primary or below', 'Literate, Middle', 'Literate, Matric(Class-X)', 'Literate, Class XII', 'Graduate & above']
	category: new FormControl("", [Validators.required]), // Array ['SC/ST', 'OBC', 'General']
	// 6. Religion of the head of the household
	household_head_religion: new FormControl("", [Validators.required]), // ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'No religion', 'Others']
	household_head_religion_other: new FormControl("", []), // required if [household_head_religion == 'Others']
	// Details of deceased
	deceased_sex: new FormControl("", [Validators.required]), // ['Male', 'Female']
	age_completed_days: new FormControl("", [Validators.required]), // Array ['Less than 1 day', '01-28 days']
	date_of_birth: new FormControl("", [Validators.required]),
	date_of_death: new FormControl("", [Validators.required,CustomValidator.validateDateofDeath1]),
	address: addressForm,
	place_of_death: new FormControl("", [Validators.required]), // ['Home', 'On way to health facility/in transit', 'Sub Center', 'PHC/CHC/Rural Hospital', 'District Hospital', 'Medical College', 'Private Hospital', 'Other', 'DNK']
	actual_place_of_death:new FormControl("", []),
	place_of_death_other: new FormControl("", []), // if [place_of_death == 'Other']
});

// Neonatal Death
const sectionB = new FormGroup({
	// 13A. Did the child met with an accident
	accident_death: new FormControl("No", [Validators.required]), // ['Yes', 'No']
	// 13B. what kind of injury or accident
	accident_death_type: new FormControl("", []), // required if [accident_death == 'Yes'] Array ['Road traffic injury', 'Falls', 'Fall of objects', 'Burns', 'Drowning', 'Poisoning', 'Bite/sting', 'Natural disaster', 'Homicide/assault', 'Other']
	accident_death_type_other: new FormControl("", []), // TODO: required if [accident_death_type == 'Other']
	// 13C. Do you think the child died from an injury or accident
	do_you_think_is_injury_or_accident: new FormControl("", []), // required if [accident_death == 'Yes'] Array ['Yes', 'No', 'DNK']
	// below only fill if do_you_think_is_injury_or_accident != 'Yes'

	// Details of pregnancy and delivery
	// 14A. When was child first breastfed?
	child_first_breastfed: new FormControl("", []), // Array ['Immediately/within one hour of birth', 'Same day child was born', 'Second day or later', 'Never breastfed', 'DNK']
	// 14B. Did the child receive any feed other than breast milk during the first 6 months of life?
	receive_feed_other_first_6_months: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']
	// 14C. During the illness that led to death, was the child breastfeeding? (if child less than 18 months)
	illness_that_led_to_death_and_child_breastfeeding: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']

	// // 15 Did the mother receive 2 doses of tetanus toxoid during pregnancy?
	// receive_2_doses_of_tetanus: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// // 16A Were there any complications during the pregnancy, or during labour?
	// complications_during_pregnancy: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// // 16B If yes, what complication(s) occurred? (Check all that apply)
	// complications_occurred: new FormControl("", []), // if [complications_during_pregnancy == 'Yes'] // multiselect // Array ['Mother had fits', 'Excessive (more than normal) bleeding before/during delivery', 'Water broke one or more days before contractions started', 'Prolonged/difficult labour (12 hours or more)', 'Operative delivery (C - Section)', 'Mother had fever', 'Baby had cord around neck', 'Instrumental Delivery/Assisted', 'DNK']
	// // 17. Was the child a single or multiple birth?
	// single_or_multiple_birth: new FormControl("", []), // Array ['Single', 'Multiple', 'DNK']
	// // 18. Where was s/he born?
	// place_of_birth: new FormControl("", []), // Array ['Home', 'On way to health facility/in transit', 'Sub Center', 'PHC/CHC/Rural Hospital', 'District Hospital', 'Medical College', 'Private Hospital', 'Other', 'DNK']
	// place_of_birth_other: new FormControl("", []), // if [place_of_birth == 'Other']
	// // 19. Who attended the delivery?
	// delivery_attended_by: new FormControl("", []), // Array ['Untrained traditional birth attendant', 'Trained traditional birth attendant', 'ANM/Nurse', 'Allopathic Doctor', 'Other', 'None', 'DNK']
	// delivery_attended_by_other: new FormControl("", []), // TODO: required if [delivery_attended_by == 'Other']
	// // 20. Was a disinfected or new knife/blade used to cut the umbilical cord?
	// umbilical_cord_cut_by_disinfected_or_new_knife_blade: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// live_or_still_birth: new FormControl("", [Validators.required]), // TODO: ['Live birth', 'Still birth'] // TODO: if 'Still birth' goto section C
	// // below is applicabale only if [live_or_still_birth == 'Live birth']
	// // Details of baby after birth
	// // 22. Did the baby ever cry, move or breath?
	// baby_cry_move_breath: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// // 23. Were there any bruises or signs of injury on child’s body after the birth?
	// injury_on_child_body_after_birth: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// // 24A. Did baby had any visible malformations at birth?
	// visible_malformations_at_birth: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// // 24B. Compared to other children in your area, what was the child’s size at birth?
	// child_size_at_birth: new FormControl("", []), // Array ['Very small', 'Smaller than average', 'Average', 'Larger than average', 'DNK']
	// // 24C. What was the birth weight?
	// child_weight_at_birth: new FormControl("", []), // weight in [][].[][]Kgs
	// child_weight_at_birth_dnk: new FormControl(true, []), // auto true false based on child_weight_at_birth
	// // 25A. Did baby stop crying after some time? (Denoting any illness)
	// baby_stop_crying: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// // 25B. If yes, how many days after birth did baby stop crying?
	// baby_stop_crying_after_days: new FormControl("", []), // Array ['Yes', 'No', 'DNK'] // if [baby_stop_crying == 'Yes']
	// baby_stop_crying_less_than_day: new FormControl(true, []), // auto true false base on 'baby_stop_crying_after_days'

	// // 26A. When was baby first breastfed?
	// baby_first_breastfed: new FormControl("", []), // Array ['Immediately/within one hour of birth', 'Same day child was born', 'Second day or later', 'Never breastfed', 'DNK']
	// // 26B. Was baby able to suckle normally during the first day of life?
	// // TODO: if [baby_first_breastfed != 'Never breastfed']
	// baby_able_suckle_normally: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// // 26C. If yes, did baby stop being able to suck in a normal way?
	// // TODO: if [baby_able_suckle_normally == 'Yes']
	// baby_stop_suckle_normally: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// // 26D. If yes, how many days after birth did baby stop sucking?
	// // TODO: if [baby_stop_suckle_normally == 'Yes']
	// baby_stop_suckle_after_days: new FormControl("", []),
	// baby_stop_suckle_less_than_day: new FormControl(true, []), // Array automatic true/false base on 'baby_stop_suckle_after_days'

	// // 27A. Was the baby ever given anything to drink other than breast milk?
	// drink_anything_other: new FormControl("", []), // TODO: ['Yes', 'No', 'DNK']
	// drink_anything_other_specify: new FormControl("", []), // TODO: if [drink_anything_other == 'Yes']
	// drink_anything_other_frequency_days: new FormControl("", []), // TODO: if [drink_anything_other == 'Yes']
	// drink_anything_other_frequency_days_dnk: new FormControl(true, []), // TODO: if [drink_anything_other == 'Yes'] // TODO: automatic true/fasle based on 'drink_anything_other_frequency_days'

	// Details of sickness at the time of death
	// 15A. Did the child had fever?
	child_have_fever: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']
	// 15B. If yes, how many days did the fever last?
	child_have_fever_days: new FormControl("", []), // if [child_have_fever == 'Yes']
	child_have_fever_less_than_day: new FormControl(true, []), // if [child_have_fever == 'Yes'] // TODO: automatic true/false based on baby_have_fever_days

	// 15C. Was the fever accompanied by chills/rigors?
	accompanied_by_chills_rigors: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']
	// 16. Did the child have convulsions or fits?
	child_have_convulsions: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']
	// 17. Was the child unconscious during the illness that led to death?
	child_unconscious_during_illness: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']
	// 18. Did the child develop stiffness of the whole body?
	child_develop_stiffness: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']
	// 19. Did the child have a stiff neck (demonstrate)?
	child_have_stiff_neck: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']
	// 20A. Did the child have diarrhoea (more frequent or more liquid stools)?
	child_have_diarrhoea: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']
	// 20B. If yes, for how many days?
	child_have_diarrhoea_days: new FormControl("", []), // if [child_have_diarrhoea == 'Yes']
	child_have_diarrhoea_less_than_day: new FormControl(true, []), // if [child_have_diarrhoea == 'Yes']
	// 20C. Was there blood in the stools?
	child_have_blood_stools: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']
	// 21A. Did the child have a cough?
	child_have_cough: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']
	// 20B. If yes, for how many days?
	child_have_cough_days: new FormControl("", []), // if [child_have_cough == 'Yes']
	child_have_cough_less_than_day: new FormControl(true, []), // if [child_have_cough == 'Yes']
	// 20d. Was there blood in the cough?
	child_have_cough_blood: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']

	// 22A. Did the child have breathing difficulties?
	child_have_difficulty_breathing: new FormControl("No", []), // ['Yes', 'No', 'DNK']
	// 22B. If yes, for how many days?
	child_have_difficulty_breathing_days: new FormControl("", []), // if [child_have_difficulty_breathing == 'Yes']
	child_have_difficulty_breathing_less_than_day: new FormControl(true, []), // if [child_have_difficulty_breathing == 'Yes'] // TODO: automatic true/false based on child_have_difficulty_breathing

	// 22C. Did the child have fast breathing?
	child_have_fast_breathing: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']
	// 22D. Did the child have in-drawing of the chest?
	child_have_in_drawing_chest: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']
	// 22E. Did the child have wheezing (demonstrate sound)?
	child_have_wheezing: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']
	// 23A. During the illness, did child have abdominal pain?
	child_have_abdominal_pain: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']
	// 23B. Did the child have abdominal distention?
	child_have_abdominal_distention: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']
	// 24A. Did the child vomit?
	child_have_vomit: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']
	// 24B. If yes, for how many days?
	child_have_vomit_days: new FormControl("", []), // Array if [child_have_vomit == 'Yes']
	child_have_vomit_less_than_day: new FormControl(true, []), // Array if [child_have_vomit == 'Yes'] // automatic true/false based on baby_have_baby_have_vomit_days
	// 25. Did the eye/skin colour change to yellow
	eye_skin_colour_yellow: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']
	// 26A. Was the rash all over the body?
	rash_all_over_body: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']
	// 26B. Did the child have red eyes?
	child_have_red_eyes: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']
	// 26C. Was this measles (use local term)?
	measles: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']
	// 27. During the weeks preceding death, did the child become very thin?
	child_become_very_thin: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']
	// 28. During the weeks preceding death, did the child have any swelling of hands, feet or abdomen?
	child_have_any_swelling: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']
	// 29. During the weeks preceding death, did the child suffer from lack of blood or appear pale?
	child_suffer_lack_blood_appear_pale: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']
	// 30. Compared to other children of the same age, was child growing normally?
	child_growing_normally: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']
	// 31A. Did the child have multiple illnesses?
	child_have_multiple_illnesses: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']
	// 31B. If yes, what were the symptoms associated with these illnesses?
	symptoms_associated_with_illnesses: new FormControl("", []), // multiple // Array ['Cough', 'Diarrhoea', 'Ear discharge', 'Fever', 'Rashes', 'Other', 'dnk']
	symptoms_associated_with_illnesses_other: new FormControl("", []),
	// 32A. Did the child receive BCG injection?
	child_receive_bcg_injection: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']
	// 32B. Number of dozes received of DPT (DPT-3)?
	dozes_received_of_DPT: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']
	// 32C. Did the child receive polio drops in the mouth?
	child_receive_polio_drops: new FormControl("No", []), // Array ['Yes', 'No', 'DNK']
	// 32D. Did the child receive an injection for measles (use local term)?
	child_receive_injection_for_measles: new FormControl("Yes - only one", []), // Array ['Yes - only one', 'Yes - more than one', 'No - did not receive any', 'DNK']
});

const sectionC = new FormGroup({
	// 33 Please describe the symptoms in order of appearance, doctor consulted or hospitalization, history of similar episodes, enter the results from reports of the investigations if available.
	case_summary: new FormControl("", [Validators.required]),
	// 34 What did the respondent think the newborn died of? (Allow the respondent to tell the illness in his or her own words)
	respondent_think_newborn_died_of: new FormControl("", [Validators.required]),
	assigned_cause_of_death: new FormControl("", [Validators.required]),
});

export const neonatalDeathdForm = new FormGroup({
	basic,
	sectionA,
	sectionB,
	sectionC,
});
