import { isBoolean } from 'util';

export function replaceStringWith({ string, replaceWith, accessUpto },form?:string) {
	return function (target: object, propertyKey: string) {
		let val = target[propertyKey];
		let currentUser = JSON.parse(sessionStorage.getItem("currentUser"))
		const getter = () => {
			return val;
		};

		const setter = object => {
			let jsonString = JSON.stringify(object);
			if (replaceWith.length > 1) {
				if (!isBoolean(replaceWith[1])) {
					replaceWith[2] = accessUpto[0] == "National" ? false : true;
					replaceWith[3] = accessUpto[0] == "State" || accessUpto[0] == "National" ? false : true;
					replaceWith[4] = accessUpto[0] == "District" || accessUpto[0] == "State" || accessUpto[0] == "National" ? false : true;
				} else {
					replaceWith[1] = accessUpto[0] == "National" ? false : true;
					replaceWith[2] = accessUpto[0] == "State" || accessUpto[0] == "National" ? false : true;
					replaceWith[3] = accessUpto[0] == "District" || accessUpto[0] == "State" || accessUpto[0] == "National" ? false : true;
				}

				//if((currentUser.designation==='FNO' ||currentUser.designation==='Facility' )&& accessUpto[0]==='Block' && form==='Form 1'){
				if(accessUpto[0]==='Block' && form==='Form 1'){
					replaceWith[2] = false;
					replaceWith[3] = false;
					replaceWith[4] = false;
				}
			}

			if (accessUpto.length > 1) {
				replaceWith[4] = accessUpto[1] !== "community" ? false : true;
			}
			if (Array.isArray(string)) {
				if (!Array.isArray(replaceWith)) throw "replaceWith should be array";

				for (let i = 0; i < string.length; i++) {
					const _string = string[i];
					const regex = new RegExp(`${_string}`, "g");
					if (isBoolean(replaceWith[i])) {

						const _regex = new RegExp(`"${_string}"`, "g")
						jsonString = jsonString.replace(_regex, `${replaceWith[i]}`);

					}
					jsonString = jsonString.replace(regex, replaceWith[i]);
				}
			} else {

				const regex = new RegExp(`${string}`, "g");
				if (isBoolean(replaceWith)) {
					const _regex = new RegExp(`"${string}"`, "g")
					jsonString = jsonString.replace(_regex, `${replaceWith}`);
				}
				jsonString = jsonString.replace(regex, replaceWith);
			}

			val = JSON.parse(jsonString);
		};

		Object.defineProperty(target, propertyKey, {
			get: getter,
			set: setter,
			enumerable: true,
			configurable: true
		});
	};

}
