import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomValidator } from "../../../../../../../utilities/validators/reactiveValidators";

const addressForm = new FormGroup({
	state: new FormControl("", [Validators.required]),
	district: new FormControl("", [Validators.required]),
	block: new FormControl("", [Validators.required]),
	village: new FormControl("", []),
	colony: new FormControl("", []),
	house_number: new FormControl(""),
	pincode: new FormControl("", [
		Validators.minLength(6),
		Validators.maxLength(6)
	]),
	landmark: new FormControl()
});

const basic = new FormGroup({
	district: new FormControl("", [Validators.required]), // TODO: without state districts not posiable
	block: new FormControl("", [Validators.required]),
	village: new FormControl("", []),
	phc: new FormControl("", [Validators.required]),
	sub_centre: new FormControl("", [Validators.required]),
	mcts_number: new FormControl("", [CustomValidator.numberOnly]),
	date: new FormControl("", [Validators.required]),
	household_head_name: new FormControl("", [Validators.required]),
	deceased_name: new FormControl("", [Validators.required]),
	deceased_mother_name: new FormControl("", [Validators.required])
});

const sectionA = new FormGroup({
	// Details of the Respondent:
	respondent_name: new FormControl("", [Validators.required]),
	respondent_relation: new FormControl("", [Validators.required]), // Array ['Brother/Sister', 'Mother/Father', 'Neighbour/No relationGrandfather/Grandmother', 'Other relative']
	// 3. Did the respondent live with the deceased during the events that led to death?
	respondent_live_with_deceased_during_death: new FormControl("", [
		Validators.required
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
	date_of_death: new FormControl("", [Validators.required]),
	address: addressForm,
	place_of_death: new FormControl("", [Validators.required]), // ['Home', 'On way to health facility/in transit', 'Sub Center', 'PHC/CHC/Rural Hospital', 'District Hospital', 'Medical College', 'Private Hospital', 'Other', 'DNK']
	actual_place_of_death:new FormControl("", []),
	place_of_death_other: new FormControl("", []) // if [place_of_death == 'Other']
});

// Neonatal Death
const sectionB = new FormGroup({
	// 13A. Did the child met with an accident
	accident_death: new FormControl("No", [Validators.required]), // TODO: ['Yes', 'No']
	// 13B. what kind of injury or accident
	accident_death_type: new FormControl("", []), // required if [accident_death == 'Yes'] Array ['Road traffic injury', 'Falls', 'Fall of objects', 'Burns', 'Drowning', 'Poisoning', 'Bite/sting', 'Natural disaster', 'Homicide/assault', 'Other']
	accident_death_type_other: new FormControl("", []), // TODO: required if [accident_death_type == 'Other']
	// 13C. Do you think the child died from an injury or accident
	do_you_think_is_injury_or_accident: new FormControl("", []), // required if [accident_death == 'Yes'] Array ['Yes', 'No', 'DNK']
	// below only fill if do_you_think_is_injury_or_accident != 'Yes'
	// Details of pregnancy and delivery
	// 14A How many months long was the pregnancy?
	pregnancy_months: new FormControl("", []), // Array [1,2,3,4,5,6,7,8,9]
	// 14B Mother’s age:
	mother_age: new FormControl("", []),
	// 15 Did the mother receive 2 doses of tetanus toxoid during pregnancy?
	receive_2_doses_of_tetanus: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// 16A Were there any complications during the pregnancy, or during labour?
	complications_during_pregnancy: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// 16B If yes, what complication(s) occurred? (Check all that apply)
	complications_occurred: new FormControl("", []), // if [complications_during_pregnancy == 'Yes'] // multiselect // Array ['Mother had fits', 'Excessive (more than normal) bleeding before/during delivery', 'Water broke one or more days before contractions started', 'Prolonged/difficult labour (12 hours or more)', 'Operative delivery (C - Section)', 'Mother had fever', 'Baby had cord around neck', 'Instrumental Delivery/Assisted', 'DNK']
	// 17. Was the child a single or multiple birth?
	single_or_multiple_birth: new FormControl("", []), // Array ['Single', 'Multiple', 'DNK']
	// 18. Where was s/he born?
	place_of_birth: new FormControl("", []), // Array ['Home', 'On way to health facility/in transit', 'Sub Center', 'PHC/CHC/Rural Hospital', 'District Hospital', 'Medical College', 'Private Hospital', 'Other', 'DNK']
	actual_place_of_birth: new FormControl("", []), // Array ['Home', 'On way to health facility/in transit', 'Sub Center', 'PHC/CHC/Rural Hospital', 'District Hospital', 'Medical College', 'Private Hospital', 'Other', 'DNK']
	place_of_birth_other: new FormControl("", []), // if [place_of_birth == 'Other']
	// 19. Who attended the delivery?
	delivery_attended_by: new FormControl("", []), // Array ['Untrained traditional birth attendant', 'Trained traditional birth attendant', 'ANM/Nurse', 'Allopathic Doctor', 'Other', 'None', 'DNK']
	delivery_attended_by_other: new FormControl("", []), // TODO: required if [delivery_attended_by == 'Other']
	// 20. Was a disinfected or new knife/blade used to cut the umbilical cord?
	umbilical_cord_cut_by_disinfected_or_new_knife_blade: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	live_or_still_birth: new FormControl("", [Validators.required]), // TODO: ['Live birth', 'Still birth'] // TODO: if 'Still birth' goto section C
	// below is applicabale only if [live_or_still_birth == 'Live birth']
	// Details of baby after birth
	// 22. Did the baby ever cry, move or breath?
	baby_cry_move_breath: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// 23. Were there any bruises or signs of injury on child’s body after the birth?
	injury_on_child_body_after_birth: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// 24A. Did baby had any visible malformations at birth?
	visible_malformations_at_birth: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// 24B. Compared to other children in your area, what was the child’s size at birth?
	child_size_at_birth: new FormControl("", []), // Array ['Very small', 'Smaller than average', 'Average', 'Larger than average', 'DNK']
	// 24C. What was the birth weight?
	child_weight_at_birth: new FormControl("", []), // weight in [][].[][]Kgs
	child_weight_at_birth_dnk: new FormControl(true, []), // auto true false based on child_weight_at_birth
	// 25A. Did baby stop crying after some time? (Denoting any illness)
	baby_stop_crying: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// 25B. If yes, how many days after birth did baby stop crying?
	baby_stop_crying_after_days: new FormControl("", []), // Array ['Yes', 'No', 'DNK'] // if [baby_stop_crying == 'Yes']
	baby_stop_crying_less_than_day: new FormControl(true, []), // auto true false base on 'baby_stop_crying_after_days'

	// 26A. When was baby first breastfed?
	baby_first_breastfed: new FormControl("", []), // Array ['Immediately/within one hour of birth', 'Same day child was born', 'Second day or later', 'Never breastfed', 'DNK']
	// 26B. Was baby able to suckle normally during the first day of life?
	// TODO: if [baby_first_breastfed != 'Never breastfed']
	baby_able_suckle_normally: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// 26C. If yes, did baby stop being able to suck in a normal way?
	// TODO: if [baby_able_suckle_normally == 'Yes']
	baby_stop_suckle_normally: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// 26D. If yes, how many days after birth did baby stop sucking?
	// TODO: if [baby_stop_suckle_normally == 'Yes']
	baby_stop_suckle_after_days: new FormControl("", []),
	baby_stop_suckle_less_than_day: new FormControl(true, []), // Array automatic true/false base on 'baby_stop_suckle_after_days'

	// 27A. Was the baby ever given anything to drink other than breast milk?
	drink_anything_other: new FormControl("", []), // TODO: ['Yes', 'No', 'DNK']
	drink_anything_other_specify: new FormControl("", []), // TODO: if [drink_anything_other == 'Yes']
	drink_anything_other_frequency_days: new FormControl("", []), // TODO: if [drink_anything_other == 'Yes']
	drink_anything_other_frequency_days_dnk: new FormControl(true, []), // TODO: if [drink_anything_other == 'Yes'] // TODO: automatic true/fasle based on 'drink_anything_other_frequency_days'

	// Details of sickness at the time of death
	// 28A. Did baby have fever?
	baby_have_fever: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// 28B. If yes, how many days did the fever last?
	baby_have_fever_days: new FormControl("", []), // if [baby_have_fever == 'Yes']
	baby_have_fever_less_than_day: new FormControl(true, []), // if [baby_have_fever == 'Yes'] // TODO: automatic true/false based on baby_have_fever_days
	// 29A. Did baby have any difficulty in breathing?
	baby_have_difficulty_breathing: new FormControl("", []), // ['Yes', 'No', 'DNK']
	// 29B. If yes, for how many days did the difficulty with breathing last?
	baby_have_difficulty_breathing_days: new FormControl("", []), // if [baby_have_difficulty_breathing == 'Yes']
	baby_have_difficulty_breathing_less_than_day: new FormControl(true, []), // if [baby_have_difficulty_breathing == 'Yes'] // TODO: automatic true/false based on baby_have_difficulty_breathing

	// 30A. Did baby have fast breathing?
	baby_have_fast_breathing: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// 30B. If yes, for how many days did the fast breathing last?
	baby_have_fast_breathing_days: new FormControl("", []), // if [baby_have_fast_breathing == 'Yes']
	baby_have_fast_breathing_less_than_day: new FormControl(true, []), // if [baby_have_fast_breathing == 'Yes'] // automatic true/false based on baby_have_fast_breathing_days

	// 31. Did baby have in-drawing of the chest?
	baby_have_in_drawing_chest: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// 32A. Did baby have a cough?
	baby_have_cough: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// 32B. Did baby have grunting (demonstrate)?
	baby_have_grunting: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// 32C. Did baby’s nostrils flare with breathing?
	baby_have_nostrils_flare_with_breathing: new FormControl("", []), // Array ['Yes', 'No', 'DNK']

	// 33A. Did baby have diarrhoea (frequent liquid stools)?
	baby_have_diarrhoea: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// 33B. If yes, for how many days were the stools frequent or liquid?
	baby_have_diarrhoea_days: new FormControl("", []), // Array if [baby_have_baby_have_diarrhoea == 'Yes']
	baby_have_diarrhoea_less_than_day: new FormControl(true, []), // Array if [baby_have_baby_have_diarrhoea == 'Yes'] // automatic true/false based on baby_have_baby_have_diarrhoea_days

	// 34A. Did baby vomit?
	baby_have_vomit: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// 34B. If yes, for how many days did baby vomit?
	baby_have_vomit_days: new FormControl("", []), // Array if [baby_have_baby_have_vomit == 'Yes']
	baby_have_vomit_less_than_day: new FormControl(true, []), // Array if [baby_have_baby_have_vomit == 'Yes'] // TODO: automatic true/false based on baby_have_baby_have_vomit_days

	// 35A. Did baby have redness around, or discharge from, the umbilical cord stump?
	baby_have_redness_discharge_from_umbilical_cord: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// 36. Did baby have yellow eyes or skin?
	baby_have_yellow_eyes_skin: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// 37. Did baby have spasms or fits (convulsions)?
	baby_have_yellow_spasms_fits: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// 38. Did baby become unresponsive or unconscious?
	baby_become_unresponsive_unconscious: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// 39. Did baby have a bulging fontanelle (describe)?
	baby_have_bulging_fontanelle: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// 40. Did the child’s body feel cold when touched?
	baby_feel_cold_when_touched: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// 41. Were the child’s hands, legs or lips discoloured (blue, other colour)?
	baby_hands_legs_lips_discoloured: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// 42. Did s/he have yellow Palms/soles?
	baby_have_yellow_palms_soles: new FormControl("", []), // Array ['Yes', 'No', 'DNK']
	// 43. Was there blood in the stools?
	baby_have_blood_stools: new FormControl("", []) // Array ['Yes', 'No', 'DNK']
});

const sectionC = new FormGroup({
	case_summary: new FormControl("", [Validators.required]),
	assigned_cause_of_death: new FormControl("", [Validators.required]),
	cause_of_death: new FormControl("", [Validators.required])
});

export const neonatalDeathdForm = new FormGroup({
	basic,
	sectionA,
	sectionB,
	sectionC
});
