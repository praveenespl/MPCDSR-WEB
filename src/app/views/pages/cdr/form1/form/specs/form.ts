import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomValidator } from "../../../../../../utilities/validators/reactiveValidators";

export const addressForm = () =>
	new FormGroup({
		state: new FormControl("", [Validators.required]),
		district: new FormControl("", [Validators.required]),
		block: new FormControl("", [Validators.required]),
		village: new FormControl(""),
		colony: new FormControl(""),
		house_number: new FormControl(""),
		pincode: new FormControl("", [
			Validators.minLength(6),
			Validators.maxLength(6)
		]),
		landmark: new FormControl(),
	});

export const notificationForm = () =>
	new FormGroup({
		notification_received_date: new FormControl("", [Validators.required]),
		notification_received_person_name: new FormControl("", [
			Validators.required,
			CustomValidator.alphaOnly,
		]),
		name: new FormControl("", [Validators.required, CustomValidator.alphaOnly]),
		date_of_birth: new FormControl("", [Validators.required]),
		age: new FormControl("", [Validators.required,CustomValidator.ageValidation]),
		sex: new FormControl("", [Validators.required]),
		mother_name: new FormControl("", [
			Validators.required,
			CustomValidator.alphaOnly,
		]),
		father_name: new FormControl("", [CustomValidator.alphaOnly]),
		address: addressForm(),
		landline: new FormControl("", [CustomValidator.validateLandline]), // TODO: mobile number validation
		mobile: new FormControl("", [
			Validators.maxLength(10),
			Validators.minLength(10),
			CustomValidator.validMobileNumber
		]), // TODO: mobile number validation
		date_of_death: new FormControl("", [
			Validators.required,
			CustomValidator.dateOfDeathValidation,
		]),
		palce_of_death: new FormControl("", [Validators.required]),
		actual_palce_of_death: new FormControl(""),
		hospital_name: new FormControl("", []),
		first_informant_type:new FormControl("",[Validators.required]),
		primary_informant_name: new FormControl("", [
			Validators.required,
			CustomValidator.alphaOnly,
		]),
		time: new FormControl("", [Validators.required]),
		date_of_notification: new FormControl("", [
			Validators.required,
			CustomValidator.dateOfNotificationValidation,
		]),
	});


