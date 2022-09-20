interface AnyObject {
	[key: string]: any;
}

interface State extends AnyObject {
	statecode: number;
	statename: string;
}

interface District extends AnyObject {
	districtcode: number;
	districtname: string;
}

interface Block extends AnyObject {
	subdistrictcode: number;
	subdistrictname: string;
}

interface Facility extends AnyObject {
	health_facility_primary_key_id: number;
	health_facility_name: string;
	health_facility_type: string;
}

interface Village extends AnyObject {
	villagecode: number;
	villagename: string;
}
