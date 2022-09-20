import moment from "moment";

export function getValueChangesInObjects<T = any>(objectA: T, objectB: T) {
	const changes: Partial<T> = {};
	for (const key in objectA) {
		if (objectA.hasOwnProperty(key)) {
			const objAVal = objectA[key];
			if (["string", "boolean", "number"].includes(typeof objAVal)) {
				const objBVal = objectB[key];
				if (objAVal !== objBVal) {
					changes[key] = objBVal;
				}
			} else if (Array.isArray(objAVal)) {
				// TODO: implement later
			} else if (typeof objAVal == "object") {
				const objBVal = objectB[key];
				const nestedChanges = getValueChangesInObjects(objAVal, objBVal) as any;
				if (Object.keys(nestedChanges).length) {
					changes[key] = nestedChanges;
				}
			} else {
				//console.log("not implement");
			}
		}
	}

	return changes;
}

export const getAge = (death,birth)=>{
	const date_of_death = moment(death);
	const date_of_birth = moment(birth);
	
	const years = date_of_death.diff(date_of_birth,"years");
	date_of_birth.add("years",years);
						
	const months = date_of_death.diff(date_of_birth,"months");
	date_of_birth.add("months",months);
						
	const days = date_of_death.diff(date_of_birth,"days");
	date_of_birth.add("days",days);
						
	const hours = date_of_death.diff(date_of_birth,"hours");
	date_of_birth.add("hours",hours);
						
	const minutes = date_of_death.diff(date_of_birth,"minutes");
	let age="";
	if(years>0) age+=`${years} years `;
	if(months>0) age+=`${ months} months `;
	if(days>0) age+=`${ days} days `;
	if(hours>0) age+=`${ hours} hours `;
	if(minutes>0) age+=`${ minutes} minutes `;
	return age.trim();
}

export const getAllCDRDeathBasedOnDays = (data,days,condition)=>{
	const filterData = data.filter(item=>{
		const date_of_death = moment(item.date_of_death);
		const date_of_birth = moment(item.date_of_birth);
		const day = date_of_death.diff(date_of_birth,"days");
		if(condition==='lte'){
			return day<=days;
		}else{
			return day>=days;
		}
	})	
	return filterData;
}

export const getAllCDRDeathWhoseFbirDone = (data,checkFBIRFilledOrNot)=>{
	const filterData = data.filter(item=>{
		if(item[checkFBIRFilledOrNot]==undefined){}else if(item[checkFBIRFilledOrNot].length>0){
			return item;
		}
	})	
	return filterData;
}

export const getAllCDRDeathWhose3A3BOr4A4BDone = (data,checkFillOne,checkFillTwo)=>{
	const filterData = data.filter(item=>{
		if(item[checkFillOne].length>0 || item[checkFillTwo].length>0){
			return item;
		}
	})	
	return filterData;
}