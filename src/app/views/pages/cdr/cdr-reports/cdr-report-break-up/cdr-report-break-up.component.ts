import { Component, OnInit,ViewChild } from '@angular/core';
import moment from 'moment';
import { ReportFiliterComponent } from '../../../mdsr/filter/report-filiter/report-filiter.component';
import { MatTableDataSource, MatPaginator } from "@angular/material";
import { CdrForm1Service } from "../../../../../services/cdr/form1.service";
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from "xlsx";
import { Router } from '@angular/router';

@Component({
  selector: 'kt-cdr-report-break-up',
  templateUrl: './cdr-report-break-up.component.html',
  styleUrls: ['./cdr-report-break-up.component.scss']
})
export class CdrReportBreakUpComponent implements OnInit {

  constructor(
		public dialog: MatDialog,
		private cdrForm1Service: CdrForm1Service,
		private router: Router

	) { }
	day: any
	mon: any;
	currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
	district_id: any;
	state_id: any;
	fromDate: any;
	toDate: any;
	where: any;
	block_id: any;
	params: any;
	
	cdrReportBreakUpDetailsData: MatTableDataSource<any>;
	cdrFormStatusBreakUpDetailData: MatTableDataSource<any>;
	// @ViewChild("paginatorForReportResponseDetail", { static: true }) paginatorForReportResponseDetail: MatPaginator;
	// displayedColumnsForBlockwiseMaternalDeathsDetail: string[] = ['sn', 'statename', 'districtname', 'subdistrictname', 'deceased_women_fname', 'husband_name', 'birth_date_time', 'death_date_time', 'place_of_death', 'form_1', 'form_2', 'form_3A', 'form_3B', 'form_3C', 'form_4A', 'form_4B'];
   @ViewChild("paginatorForReportChildDeathDetail", { static: true }) paginatorForReportChildDeathDetail: MatPaginator;
	displayedChildDeathCountStatus: string[] = ['sn', 'state', 'districtname', 'subdistrictname', 'male', 'female', 'general', 'sc', 'st', 'obc', 'inMonth', 'inYear', 'Years', 'total', 'home', 'hospital', 'intransit'];

	displayedChildDeathFormStatus: string[] = ['sn', 'state', 'districtname', 'subdistrictname', 'total_death', 'form_1', 'form_2', 'form_3A', 'form_3B', 'form_3C', 'form1', 'form_4A', 'form_4B'];

  ngOnInit() {
	this.mon = moment().month() + 1;
	this.day = moment().day() + 1;
	if (this.currentUser.accessupto == "Block") {
		this.block_id = this.currentUser.user_block_id['subdistrictcode'];
	} else if (this.currentUser.accessupto == "District") {
		this.district_id = this.currentUser.user_district_id['districtcode'];
	} else if (this.currentUser.accessupto == "State") {
		this.state_id = this.currentUser.user_state_id['statecode'];

	} else {

	}
	this.fromDate = (moment().year() - 1) + "-" + this.mon + "-" + "01";
	this.toDate = moment().year() + "-" + this.mon + "-" + this.day;
	let param = {
		previousYearFromDate: this.fromDate,
		previousYearToDate: this.toDate,
		where: {
			date_of_death: { between: [this.fromDate, this.toDate] },
			statecode: this.state_id ? this.state_id : undefined,
			districtcode: this.district_id ? this.district_id : undefined,
			subdistrictcode: this.block_id ? this.block_id : undefined,
		},
		accessUpto: this.currentUser.accessupto
	}
	const params = { "where": param.where, "include": ["cdrForm2s", "cdrForm3s", "cdrForm3bs", "cdrForm3cs", "cdrForm4as", "cdrForm4bs"] }
	// this.cdrForm1Service.getList(params).subscribe(res => {
	// 	this.reportResponse = new MatTableDataSource(res);
	// 	this.reportResponse.paginator = this.paginatorForReportResponseDetail;
	// })
	const parameter = "aniket"
	this.cdrForm1Service.getCdrReportsDetails(params).subscribe(result => {
		console.log(result)
		this.cdrReportBreakUpDetailsData = new MatTableDataSource(result);
		this.cdrReportBreakUpDetailsData.paginator = this.paginatorForReportChildDeathDetail;

	})
   

}

}
