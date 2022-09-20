import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from "@angular/core";
import { CdrForm1Service } from "../../../../../services/cdr/form1.service";
import moment from 'moment';
import { MatTableDataSource, MatPaginator, MatSort} from '@angular/material';
import * as XLSX from "xlsx";
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

@Component({
  selector: 'kt-block-dashboard',
  templateUrl: './block-dashboard.component.html',
  styleUrls: ['./block-dashboard.component.scss']
})
export class BlockDashboardComponent implements OnInit {
	constructor(
		private cdrForm1Service: CdrForm1Service,
		private cdf: ChangeDetectorRef,
		private zone: NgZone,
	) { }

	cdrDeathAgeWiseCount: any;
	isShowAllDistrictOnMap: boolean = false;
	objPeakMonthToWeekMonth: any;
	cdrDeathCount: number = 0;
	cdrVerified: number = 0;
	cdrPending: number = 0;
	cdrDone: number = 0;
	loading: boolean = false;
	loadingAgeWise: boolean = false;
	day: any
	mon: any;
	block_id: any;
	district_id: any;
	state_id: any;
	fromDate: any;
	toDate: any;
	where: any
	mapChartDiv = 'district';
	callingFrom = undefined;
	passingArgOnDistrictClick: any;
	private charts: Array<any> = [];
	currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
	dataSourceForBlockwiseCbmdsrFbmdsr: MatTableDataSource<any>;
	@ViewChild( "paginatorForForBlockwiseCbmdsrFbmdsr", { static: true }) paginatorForForBlockwiseCbmdsrFbmdsr: MatPaginator;
	displayedColumnsForBlockwiseCbmdsrFbmdsr: string[] = ['sn', 'category', 'column-2', 'column-1'];
	dataSourceForBlockwiseMaternalDeathsDetail: MatTableDataSource<any>;
	@ViewChild( "paginatorForBlockwiseMaternalDeathsDetail", { static: true }) paginatorForBlockwiseMaternalDeathsDetail: MatPaginator;
	displayedColumnsForBlockwiseMaternalDeathsDetail: string[] = ['sn', 'districtname', 'subdistrictname', 'villagename', 'deceased_women_fname', 'husband_name', 'place_of_death', 'death_date_time'];
	dataSourceForBlockwiseCbmdsrFormStatus: MatTableDataSource<any>;
	@ViewChild( "paginatorForBlockwiseCbmdsrFormStatus", { static: true }) paginatorForBlockwiseCbmdsrFormStatus: MatPaginator;
	displayedColumnsForBlockwiseCbmdsrFormStatus: string[] = ['sn', 'subdistrictname', 'form1', 'form2', 'form3A','form3B','form3C', 'finalStatus'];
	dataSourceForBlockwiseFbmdsrFormStatus: MatTableDataSource<any>;
	@ViewChild( "paginatorForBlockwiseFbmdsrFormStatus", { static: true }) paginatorForBlockwiseFbmdsrFormStatus: MatPaginator;
	displayedColumnsForBlockwiseFbmdsrFormStatus: string[] = ['snF', 'subdistrictnameF', 'form1F', 'form4A', 'form4B', 'finalStatusF'];
	@ViewChild( "sort", { static: true }) sort: MatSort;
	ngOnInit() {
		this.mon = moment().month() + 1;
		this.day = moment().day() + 1;
		// if (moment().date() > 10) {
		// 	this.day = moment().date();
		// } else {
		// 	this.day = "0" + moment().date();
		// }
		if (this.currentUser.accessupto == "Block") {
			this.block_id = this.currentUser.user_block_id['subdistrictcode'];
      this.getSubmittedFormsStatusBlockwise({ "subdistrictcode": this.block_id });
      this.getBlockswiseDeathsData({ "subdistrictcode": this.block_id });
		} else if (this.currentUser.accessupto == "District") {
			this.district_id = this.currentUser.user_district_id['districtcode'];
		} else if (this.currentUser.accessupto == "State") {
			this.state_id = this.currentUser.user_state_id['statecode'];
		} else {
			//this.getDeathsWhereCbmdsrAndFbmdsrConducted({});
		}
		this.fromDate = (moment().year() - 1) + "-" + this.mon + "-" + "01";
		this.toDate = moment().year() + "-" + this.mon + "-" + this.day;
		this.where = {
			statecode: this.state_id ? this.state_id : undefined,
			districtcode: this.district_id ? this.district_id : undefined,
			subdistrictcode: this.block_id ? this.block_id : undefined,
			updatedAt: {
				"$gte": this.fromDate,
				"$lte": this.toDate
			}
		}
		this.loading = true;

		// @ Dashboard Block Count
		this.cdrForm1Service.getDashboardBlockCount(this.where).subscribe(res => {
			//console.log('res',res);
			this.cdrDeathCount = res[0].totDeath;
			this.cdrVerified = res[0].form2;
			this.cdrPending = this.cdrDeathCount - (res[0].form3A + res[0].form3B + res[0].form4A + res[0].form4B);
			this.cdrDone = this.cdrDeathCount - this.cdrPending;
			this.loading = false;
			this.cdf.detectChanges();

		}, () => {
			this.loading = false;
		});
	}



	isShowBlockwiseDeathsDetailTable = false;
	blockwiseDetailsOfMaternalDeathsNotification: any;
	getBlockswiseDeathsData(arg) {
		this.isShowBlockwiseDeathsDetailTable = false;
		let whereParam = {};//this.where;
		whereParam = {
			updatedAt: {
				"$gte": (moment().year() - 1) + "-" + this.mon + "-" + "01",
				"$lte": moment().year() + "-" + this.mon + "-" + this.day
			}
		}
		if (arg.type == "CBMDSR") {
			whereParam['palce_of_death'] = { '$in': ["Home", "In transit", "Other"] }
		} else if (arg.type == "FBMDSR") {
			whereParam['palce_of_death'] = { '$in': ["Hospital"] }
		}
		whereParam['subdistrictcode'] = arg.subdistrictcode;
		this.cdrForm1Service.getNotificationDetails(whereParam).subscribe(res => {
			this.blockwiseDetailsOfMaternalDeathsNotification = res;
			this.dataSourceForBlockwiseMaternalDeathsDetail = new MatTableDataSource(res);
			this.dataSourceForBlockwiseMaternalDeathsDetail.paginator =this.paginatorForBlockwiseMaternalDeathsDetail;
			this.isShowBlockwiseDeathsDetailTable = true;
			this.cdf.detectChanges();
		});
	}

	formSubmittedStatusBlockwise: any
	isShowFormsStatusBlockwise = false;
	totalCbmdsrBlockwiseForm1: number = 0;
	totalCbmdsrBlockwiseForm2: number = 0;
	totalCbmdsrBlockwiseForm3A: number = 0;
	totalCbmdsrBlockwiseForm3B: number = 0;
	totalCbmdsrBlockwiseForm3C: number = 0;
	totalFbmdsrBlockwiseForm1: number = 0;
	totalFbmdsrBlockwiseForm4A: number = 0;
	totalFbmdsrBlockwiseForm4B: number = 0;
	getSubmittedFormsStatusBlockwise(accessArg) {
		this.totalCbmdsrBlockwiseForm1 = 0;
		this.totalCbmdsrBlockwiseForm2 = 0;
		this.totalCbmdsrBlockwiseForm3A = 0;
		this.totalCbmdsrBlockwiseForm3B = 0;
		this.totalCbmdsrBlockwiseForm3C = 0;
		this.totalFbmdsrBlockwiseForm1 = 0;
		this.totalFbmdsrBlockwiseForm4A = 0;
		this.totalFbmdsrBlockwiseForm4B = 0;
		this.isShowFormsStatusBlockwise = false;
		let previousYearFromDate = (moment().year() - 1) + "-" + "01" + "-" + "01";
		let previousYearToDate = (moment().year()) + "-" + "12" + "-" + "31";
		//let previousYearFromDate=(moment().year())+"-"+"01"+"-"+"01";
		//let previousYearToDate=(moment().year())+"-"+"12"+"-"+"31";
		let param = {
			previousYearFromDate: previousYearFromDate,
			previousYearToDate: previousYearToDate,
			where: { "subdistrictcode": accessArg['subdistrictcode'] },
			accessUpto: 'Block'
		}
		this.cdrForm1Service.getSubmittedFormsStatus(param).subscribe(Res => {
			this.isShowFormsStatusBlockwise = true
			this.formSubmittedStatusBlockwise = Res;
			this.dataSourceForBlockwiseCbmdsrFormStatus = new MatTableDataSource(Res['cbmdsrFormsStatus']);
			this.dataSourceForBlockwiseCbmdsrFormStatus.paginator =this.paginatorForBlockwiseCbmdsrFormStatus;
			Res['cbmdsrFormsStatus'].forEach(element => {
				this.totalCbmdsrBlockwiseForm1 = this.totalCbmdsrBlockwiseForm1 + element['form1'];
				this.totalCbmdsrBlockwiseForm2 = this.totalCbmdsrBlockwiseForm2 + element['form2'];
				this.totalCbmdsrBlockwiseForm3A = this.totalCbmdsrBlockwiseForm3A + element['form3A'];
				this.totalCbmdsrBlockwiseForm3B = this.totalCbmdsrBlockwiseForm3B + element['form3B'];
				this.totalCbmdsrBlockwiseForm3C = this.totalCbmdsrBlockwiseForm3C + element['form3C'];
			});
			this.dataSourceForBlockwiseFbmdsrFormStatus = new MatTableDataSource(Res['fbmdsrFormsStatus']);
			this.dataSourceForBlockwiseFbmdsrFormStatus.paginator =this.paginatorForBlockwiseFbmdsrFormStatus;
			Res['fbmdsrFormsStatus'].forEach(element => {
				this.totalFbmdsrBlockwiseForm1 = this.totalFbmdsrBlockwiseForm1 + element['form1'];
				this.totalFbmdsrBlockwiseForm4A = this.totalFbmdsrBlockwiseForm4A + element['form4A'];
				this.totalFbmdsrBlockwiseForm4B = this.totalFbmdsrBlockwiseForm4B + element['form4B'];
			});
			this.cdf.detectChanges();
		});
	}

	applyFilterBlockwiseMaternalDeathsDetail(filterValueBlockwiseMaternalDeathsDetail: string) {
		this.dataSourceForBlockwiseMaternalDeathsDetail.filter = filterValueBlockwiseMaternalDeathsDetail.trim().toLowerCase();
	}

	applyFilterBlockwiseCbmdsrFormStatus(filterBlockwiseCbmdsrFormStatus: string) {
		this.dataSourceForBlockwiseCbmdsrFormStatus.filter = filterBlockwiseCbmdsrFormStatus.trim().toLowerCase();
	}

	applyFilterBlockwiseFbmdsrFormStatus(filterBlockwiseFbmdsrFormStatus: string) {
		this.dataSourceForBlockwiseFbmdsrFormStatus.filter = filterBlockwiseFbmdsrFormStatus.trim().toLowerCase();
	}

	forBlockwiseMaternalDeathsDetailExportTable() {
		let dataToExport = this.dataSourceForBlockwiseMaternalDeathsDetail.data.map((x) => ({
			"District": x.address.districtname,
			"Block": x.address.subdistrictname,
			//"Village": x.village_id.villagename,
			"Deceased Women Name": x.name,
			"Husband Name": x.mother_name,
			"Place of Death": x.palce_of_death,
			"Death Date Time": x.date_of_death,
		}));
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "Blockwise Child Deaths Details.xlsx");
	}

	forBlockwiseCbmdsrFormStatusExportTable() {
		let dataToExport = this.dataSourceForBlockwiseCbmdsrFormStatus.data.map((x) => ({
			"Block": x.subdistrictname,
			"# Form 1": x.form1,
			"# Form 2": x.form2,
			"# Form 3A": x.form3A,
			"# Form 3B": x.form3B,
			"# Form 3C": x.form3C
		}));
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "Blockwise CBCDR Forms status.xlsx");
	}

	forBlockwiseFbmdsrFormStatusExportTable() {
		let dataToExport = this.dataSourceForBlockwiseFbmdsrFormStatus.data.map((x) => ({
			"Block": x.subdistrictname,
			"# Form 1": x.form1,
			"# Form 4A": x.form4A,
			"# Form 4B": x.form4B
		}));
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "Blockwise FBCDR Forms status.xlsx");
	}
}
