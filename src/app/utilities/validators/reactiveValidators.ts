import { AbstractControl } from "@angular/forms";
import moment from "moment";
export class CustomValidator {
	static alphaOnly(
		control: AbstractControl
	): { [key: string]: boolean } | null {
		if (/^[a-zA-Z\s]*$/.test(control.value)) {
			return null;
		}
		return { alphaOnly: true };
	}

	static numberOnly(
		control: AbstractControl
	): { [key: string]: boolean } | null {
		if (/^[0-9]*$/.test(control.value)) {
			return null;
		}
		return { numberOnly: true };
	}

	static alphaNumber(
		control: AbstractControl
	): { [key: string]: boolean } | null {
		if (/^[a-zA-Z0-9]*$/.test(control.value)) {
			return null;
		}
		return { alphaNumber: true };
	}

	static decimalNumber(c: AbstractControl): { [key: string]: boolean } | null {
		if (/^(\d*\.)?\d+$/.test(c.value)) {
			return null
		}
		return { decimalNumber: true };
	}
	static dateOfDeathValidation(
		c: AbstractControl
	): any {
		if (c.value !== null && c.value !== undefined) {
			const dateOfDeath = c.value;
			const dateOfBirth = c.root.get('date_of_birth');
			if (dateOfDeath) {
				if (dateOfDeath < dateOfBirth.value) {
					return { dateOfDeath: true }
				}
			}
		}
		return null;
	}

	static dateOfNotificationValidation(c: AbstractControl): any {
		if (c.value !== null && c.value !== undefined) {
			const dateOfNotification = c.value;
			const dateOfDeath = c.root.get('date_of_death');
			if (dateOfNotification) {
				if (dateOfNotification < dateOfDeath.value) {
					return { dateOfNotification: true }
				}
			}
		}
		return null;
	}

	static ageValidation(control: AbstractControl): any {
		if (control.value !== null && control.value !== undefined) {

			if (control.value) {
				const dateOfBirth = control.root.get("date_of_birth");
				const dateOfDeath = control.root.get("date_of_death");
				const years = moment(dateOfDeath.value).diff(moment(dateOfBirth.value), "years")
				if (years > 5 && years < 0) {
					return { ageValidation: true }
				}

			}
		}
		return null;
	}

	static weightValidation(control: AbstractControl): any {
		if (control.value !== null && control.value !== undefined) {
			if (control.value) {
				const weight = parseInt(control.value);
				if (weight > 100 && weight < 5000) {
					return { weightValidation: true }
				}
			}
		}
		return null;
	}

	static validMobileNumber(
		control: AbstractControl
	): { [key: string]: boolean } | null {
		if (control.value != "") {
			if (/^[6-9]\d{9}$/.test(control.value)) {
				return null;
			}
			return { mobileNumber: true };
		}
	}

	static validateLandline(control: AbstractControl): { [key: string]: boolean } | null {
		if (control.value !== null && control.value !== "") {
			if (/^[0-9]\d{2,4}-\d{6,8}$/.test(control.value)) {
				return null;
			}
			return { landline: true }
		}
	}

	static validateDateofDeath1(control: AbstractControl): { [key: string]: boolean | null } {
		if (control && control.value) {
			const dateOfDeath = control.value;
			const dateOfBirth = control.parent.get('date_of_birth');
			if (dateOfBirth && dateOfDeath) {
				if (dateOfBirth.value) {
					if (dateOfDeath < dateOfBirth.value) {
						return { dateOfDeath: true }
					}
				}
			}
		}
		return null;
	}

	static dateOfAdmissionValidate(control: AbstractControl): { [key: string]: boolean | null } {
		if (control && control.value) {
			const dateOfAdmission = control.value;
			const dateOfBirth = control.parent.get('date_of_birth').value;
			const db = moment(new Date(dateOfBirth)).format("YYYY-MM-DD").toString();
			const da = moment(new Date(dateOfAdmission)).format("YYYY-MM-DD").toString();
			if (db && da) {
					if (da < db) {
						if(db===da){
							return null
						}
						else return { dateOfDeath: true }
					}
				}
			}
		return null
	}


	static dateOfDeathValidate(control: AbstractControl): { [key: string]: boolean | null } {
		if (control && control.value) {
			const dateOfDeath = control.value;
			const dateOfBirth = control.parent.get('date_of_birth').value;
			const db = moment(new Date(dateOfBirth)).format("YYYY-MM-DD").toString();
			const dd = moment(new Date(dateOfDeath)).format("YYYY-MM-DD").toString();
			console.log(db,dd)
			if (db && dd) {
				if (db > dd) {
					if(db===dd) {
						return null;
					}else{
						return { dateOfDeath: true }
					}
				}
			}
		}

		return null
	}
}
