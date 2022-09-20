import { environment } from "../../environments/environment";

export const apiEndPoint = environment.apiEndPoint;
export const localizationApiEndPoint = environment.localizationApiEndPoint;
/**
 * User Authentication and validation
 */
class UserMasterApi {
	readonly common = `${apiEndPoint}usermasters`;
	readonly login = `${this.common}/login`;
	readonly logout = `${this.common}/logout`;
}
// Captcha API
class Captcha {
	readonly common = `${apiEndPoint}captchas`;
	readonly generate = `${this.common}/generateCaptcha`;
	readonly validateCaptcha = `${this.common}/validateCaptcha`;
}


// VILLAGE APIs
class VillageApi {}

// STATE APIs
class StateApi {
	private readonly key = "states";

	readonly common = `${localizationApiEndPoint}`;
	readonly byId = (stateId: string) => `${this.common}/${stateId}`;
	// readonly exist = (stateId: string) => `${apiEndPoint}${this.key}/${stateId}/exists`;
	// readonly replace = (stateId: string) => `${apiEndPoint}${this.key}/${stateId}/replace`;
}

// BLOCK APIs
class BlockApi {
	private readonly key = "blocks";
	readonly common = `${localizationApiEndPoint}`;
	readonly byId = (blockId: string) => `${this.common}/${blockId}`;
}

// DISTRICT APIs
class DistrictApi {
	private readonly key = "districts";

	readonly common = `${localizationApiEndPoint}`;
	readonly byId = (districtId: string) =>
		`${this.common}/${districtId}`;
}

// SUB DISTRICT APIs
class SubDistrictApi {
	private readonly key = "subdistricts";

	readonly common = `${apiEndPoint}${this.key}`;
	readonly byId = (stateId: string) => `${apiEndPoint}${this.key}/${stateId}`;
}

//State MDR Meeting
class MOM_FBMDRC {
	private readonly key = "MOM-FBMDRCs";

	readonly common = `${apiEndPoint}${this.key}`;
	// readonly byId = (stateId: string) => `${apiEndPoint}${this.key}/${stateId}`;
}

class MOM_DMDRC {
	private readonly key = "MOM-DMDRCs";

	readonly common = `${apiEndPoint}${this.key}`;
	// readonly byId = (stateId: string) => `${apiEndPoint}${this.key}/${stateId}`;
}

class MOM_DRUDCM {
	private readonly key = "MOM-DRUDCMs";

	readonly common = `${apiEndPoint}${this.key}`;
	// readonly byId = (stateId: string) => `${apiEndPoint}${this.key}/${stateId}`;
}



//State MDR Meeting
class StateMDRMeetingApi {
	private readonly key = "state-mdr-meetings";

	readonly common = `${apiEndPoint}${this.key}`;
	// readonly byId = (stateId: string) => `${apiEndPoint}${this.key}/${stateId}`;
}




// LOCATION OR LOCALITY APIs
class LocalityApi {
	readonly userMaster = new UserMasterApi();
	readonly state = new StateApi();
	readonly block = new BlockApi();
	readonly district = new DistrictApi();
	readonly subDistrict = new SubDistrictApi();

	readonly village = new VillageApi();
}

// FACILITY APIs
class FacilityApi {
	private readonly key = "facility";

	readonly common = `${apiEndPoint}${this.key}`;
	readonly byId = (facilityId: string) =>
		`${apiEndPoint}${this.key}/${facilityId}`;
}

/**
 * MDSR form APIs
 */

class MdsrFormCommanApis {
	readonly common: string = `${apiEndPoint}mdsr_form_1s`;
	readonly byId: (id: string) => string;
	readonly count: string;
	readonly getDashboardData:string;// = `${this.common}/dashboard`;
	readonly getFormsData:string;
	readonly getExpectedVsActual:string;
	readonly getNotificationVsReviewData:string;
	readonly sendMessagesAndMailsNotifications:string;
	readonly getNotificationCount:string;
	readonly getNotificationDetails:string;
	readonly getCodesCategorywise:string;
	readonly getMaternalCauseOfdeaths:string;
	readonly getMaternalCauseOfdeathsFor6Months:string;
	readonly getMostAndLeastDistrictsDeaths:string;
	readonly getDeathsWhereCbmdsrAndFbmdsrConducted:string;
	readonly getSubmittedFormsStatus:string;
	readonly sendEmail: string;
	readonly getPlaceOfDeath: string;
	readonly maternalDeathTypesGraphData: string;
	readonly fbmdrVsCbmdrSubmitted: string;
	readonly getCDRMajorCausesPrevious: string;

	// CDR Dashboard
	readonly getCDRDeathAgeWise:string;
	readonly getCDRDeathForMap:string;
	constructor(init: { key: string }) {
		this.common = `${apiEndPoint}${init.key}`;
		this.byId = (id: string) => `${this.common}/${id}`;
		this.count = `${this.common}/count`;
		this.getDashboardData = `${this.common}/getDashboardData`;
		this.getFormsData = `${this.common}/getFormsData`
		this.getExpectedVsActual = `${this.common}/getExpectedVsActual`;
		this.getNotificationVsReviewData=`${this.common}/getNotificationVsReviewData`;
		this.getCDRDeathAgeWise = `${this.common}/getCDRDeathAgeWise`;
		this.getCDRDeathForMap = `${this.common}/getCDRDeathForMap`;
		this.getNotificationCount = `${this.common}/getNotificationCount`;
		this.getNotificationDetails = `${this.common}/getNotificationDetails`;
		this.getMaternalCauseOfdeaths=`${this.common}/getMaternalCauseOfdeaths`;
		this.getMaternalCauseOfdeathsFor6Months=`${this.common}/getMaternalCauseOfdeathsFor6Months`;
		this.getMostAndLeastDistrictsDeaths=`${this.common}/getMostAndLeastDistrictsDeaths`;
		this.getDeathsWhereCbmdsrAndFbmdsrConducted=`${this.common}/getDeathsWhereCbmdsrAndFbmdsrConducted`;
		this.getSubmittedFormsStatus=`${this.common}/getSubmittedFormsStatus`;
		this.sendEmail=`${this.common}/sendEmail`;
		this.getPlaceOfDeath = `${this.common}/getPlaceOfDeath`
		this.maternalDeathTypesGraphData = `${this.common}/maternalDeathTypesGraphData`
		this.fbmdrVsCbmdrSubmitted = `${this.common}/fbmdrVsCbmdrSubmitted`
		this.getCDRMajorCausesPrevious = `${this.common}/getCDRMajorCausesPrevious`
	}
}

class MdsrForm1 extends MdsrFormCommanApis {
	readonly getPlaceOfDeathValues: string;
	constructor() {
		super({ key: "mdsr_form_1s" });
		this.getPlaceOfDeathValues = `${this.common}/getPlaceOfDeathValues`;
	}
}

class MdsrForm1Backup extends MdsrFormCommanApis {
	constructor() {
		super({ key: "use_form_1_bkups" });
	}
}

class MdsrForm2 extends MdsrFormCommanApis {
	constructor() {
		super({ key: "mdsr_form_2s" });
	}
}

class MdsrForm3 extends MdsrFormCommanApis {
	constructor() {
		super({ key: "mdsr_form_3s" });
	}
}

class MdsrForm5 extends MdsrFormCommanApis {
	constructor() {
		super({ key: "mdsr_form_5s" });
	}
}

class MdsrForm6 extends MdsrFormCommanApis {
	constructor() {
		super({ key: "mdsr_form_6s" });
	}
}
class MdsrForm4 extends MdsrFormCommanApis {
	constructor() {
		super({ key: "mdsr_form_4s" });
	}
}

// CDR
class CdrForm1 extends MdsrFormCommanApis {
	constructor() {
		super({ key: "cdr_form_1s" });
	}
}
class CdrForm2 extends MdsrFormCommanApis {
	constructor() {
		super({ key: "cdr_form_2s" });
	}
}
class CdrForm3 extends MdsrFormCommanApis {
	constructor() {
		super({ key: "cdr_form_3s" });
	}
}
class CdrForm3B extends MdsrFormCommanApis {
	constructor() {
		super({ key: "cdr_form_3bs" });
	}
}
class CdrForm3C extends MdsrFormCommanApis {
	constructor() {
		super({ key: "cdr_form_3cs" });
	}
}
class CdrForm4A extends MdsrFormCommanApis {
	constructor() {
		super({ key: "cdr_form_4as" });
	}
}

class CdrForm4B extends MdsrFormCommanApis {
	constructor() {
		super({ key: "cdr_form_4bs" });
	}
}

// FACILITY APIs
class ReferralApi {
	private readonly key = "referraldetails";
	readonly common = `${apiEndPoint}${this.key}`;
	readonly byId = (facilityId: string) => `${this.common}/${facilityId}`;
}
class FileLibrary{
	readonly common = `${apiEndPoint}FileLibraries`;
	readonly byId = (formId: string) => `${this.common}/${formId}`;
}
class Container{
	readonly common = `${apiEndPoint}containers`;
	readonly upload = `${this.common}/PDF/upload`;
	readonly download = `${this.common}/PDF/download`;
	readonly downloadStillbirth=`${this.common}/Stillbirth/download/`;
	readonly uploadMultipleFiles=`${this.common}/Stillbirth/uploadMultipleFiles`
}

class MdsrApi {
	readonly form1 = new MdsrForm1();
	readonly form1Backup = new MdsrForm1Backup();
	readonly form2 = new MdsrForm2();
	readonly form3 = new MdsrForm3();
	readonly form4 = new MdsrForm4();
	readonly form5 = new MdsrForm5();
	readonly form6 = new MdsrForm6();
}

class CdrApi {
	readonly form1 = new CdrForm1();
	readonly form2 = new CdrForm2();
	readonly form3 = new CdrForm3();
	readonly form3b = new CdrForm3B();
	readonly form3c = new CdrForm3C();
	readonly form4a = new CdrForm4A();
	readonly form4b = new CdrForm4B();
}

class Gis {
	readonly common = `${apiEndPoint}gis`;
	readonly getStates = `${this.common}/getStates`
	readonly getDistricts = `${this.common}/getDistricts`
	readonly getSubDistricts = `${this.common}/getSubDistricts`
}

class StillbirthApi {
	readonly common = `${apiEndPoint}stillbirths`;
	readonly byId = (formId: string) => `${this.common}/${formId}`;
	readonly getNotificationCount = `${this.common}/getNotificationCount`;
}
class stillBirthAutoId {
	readonly common = `${apiEndPoint}stillBirthAutoIds`;
	readonly getSBId = `${this.common}/getSBId`
}
class MailContentAPI {
	readonly common = `${apiEndPoint}mailcontents`;
	readonly sendMessagesAndMailsNotifications = `${this.common}/sendMessagesAndMailsNotifications`
}

class ICD10Codes {
	readonly common = `${apiEndPoint}icd10_codes`;
	readonly getCodesCategorywise = `${this.common}/getCodesCategorywise`
}

class ICD10CdrCodes {
	readonly common = `${apiEndPoint}icd10_cdrcodes`;
}
class Alerts {
	readonly common = `${apiEndPoint}Alerts`;
	readonly sendEmailAndMessage = `${this.common}/sendEmailAndMessage`;
}


class Api {
	readonly userMaster = new UserMasterApi();
	readonly captcha = new Captcha();
	readonly locality = new LocalityApi();
	readonly facility = new FacilityApi();
	readonly mdsr = new MdsrApi();
	readonly cdr = new CdrApi();
	readonly referral = new ReferralApi();
	readonly filelibrary = new FileLibrary();
	readonly container = new Container();
	readonly gis = new Gis();
	readonly stillbirth = new StillbirthApi();
	readonly stillBirthAutoId = new stillBirthAutoId();
	readonly mailcontent = new MailContentAPI();
	readonly icd10codes = new ICD10Codes();
	readonly icd10Cdrcodes = new ICD10CdrCodes();
	readonly Alerts = new Alerts();
	readonly StateMDRMeetingApi = new StateMDRMeetingApi()
	readonly MOM_FBMDRC = new MOM_FBMDRC();
	readonly MOM_DMDRC = new MOM_DMDRC();
	readonly MOM_DRUDCM = new MOM_DRUDCM();
}
 
export const api = new Api();
