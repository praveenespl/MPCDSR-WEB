import { Component, OnInit, ViewChild } from '@angular/core';
import moment from 'moment';
import { ReportFiliterComponent } from '../../../mdsr/filter/report-filiter/report-filiter.component';
import { MatTableDataSource, MatPaginator } from "@angular/material";
import { CdrForm1Service } from "../../../../../services/cdr/form1.service";
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from "xlsx";
import { Router } from '@angular/router';
import { result } from 'lodash';



@Component({
	selector: 'kt-cdr-reports',
	templateUrl: './cdr-reports.component.html',
	styleUrls: ['./cdr-reports.component.scss']
})
export class CdrReportsComponent implements OnInit {


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

	// reportResponse;
	reportResponse: MatTableDataSource<any>;
	cdrReportDetailsData: MatTableDataSource<any>;
	@ViewChild("paginatorForReportResponseDetail", { static: true }) paginatorForReportResponseDetail: MatPaginator;
	displayedColumnsForBlockwiseMaternalDeathsDetail: string[] = ['sn', 'statename', 'districtname', 'subdistrictname', 'deceased_women_fname', 'husband_name', 'birth_date_time', 'death_date_time', 'place_of_death', 'form_1', 'form_2', 'form_3A', 'form_3B', 'form_3C', 'form_4A', 'form_4B'];
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
		this.cdrForm1Service.getList(params).subscribe(res => {
			this.reportResponse = new MatTableDataSource(res);
			this.reportResponse.paginator = this.paginatorForReportResponseDetail;
		})
		const parameter = "aniket"
		this.cdrForm1Service.getCdrReportsDetails(params).subscribe(result => {
			console.log(result)
			this.cdrReportDetailsData = new MatTableDataSource(result);
		})


	}
	showFilters() {
		const dialogRef = this.dialog.open(ReportFiliterComponent, {
			width: "80%",
			height: "40%",
			data: "",
			panelClass: ["filterPopup"],
			hasBackdrop: true,
			disableClose: false,
		});
		dialogRef.afterClosed().subscribe(res => {

			this.params = {
				where: {
					date_of_death: {
						between: [res.from_date ? res.from_date : this.fromDate,
						res.to_date ? res.to_date : this.toDate]
					},
					statecode: res.state_id ? res.state_id : this.state_id ? res.state_id : undefined,
					districtcode: res.district_id ? res.district_id : this.district_id ? res.district_id : undefined,
					subdistrictcode: res.block_id ? res.block_id : this.block_id ? res.block_id : undefined,
				}
			}
			console.log(this.params.where)
			const parameter = { "where": this.params.where, "include": ["cdrForm2s", "cdrForm3s", "cdrForm3bs", "cdrForm3cs", "cdrForm4as", "cdrForm4bs"] }

			this.cdrForm1Service.getList(parameter).subscribe(res => {
				this.reportResponse = new MatTableDataSource(res);
				this.reportResponse.paginator = this.paginatorForReportResponseDetail;

			})


		})

	}
	closeDialog() {
		this.dialog.closeAll();
	}

	navigateToForm(formname: string, data: any) {
		if (formname == 'form1') {
			this.router.navigateByUrl(`/cdr/form1/${data["id"]}?view=true`);
		} else if (formname == 'form2') {
			this.router.navigateByUrl(`/cdr/form2/${data.cdrForm2s[0].id}?view=true`)
		} else if (formname == 'form3A') {
			this.router.navigateByUrl(`/cdr/form3/a/${data.cdrForm3s[0].id}?view=true`)
		} else if (formname == 'form3b') {
			this.router.navigateByUrl(`/cdr/form3/b/${data.cdrForm3bs[0].id}?view=true`)
		} else if (formname == 'form3c') {
			this.router.navigateByUrl(`/cdr/form3/c/${data.cdrForm3cs[0].id}?view=true`)
		} else if (formname == 'form4A') {
			this.router.navigateByUrl(`/cdr/form4/a/${data.cdrForm4as[0].id}?view=true`)
		} else if (formname == 'form4B') {
			this.router.navigateByUrl(`/cdr/form4/b/${data.cdrForm4bs[0].id}?view=true`)
		}
	}
	forCdrReportDetailExportTable() {
		let dataToExport = this.reportResponse.data.map((x) => ({
			"state": x.address.statename,
			"District": x.address.districtname,
			"Block": x.address.subdistrictname,
			//"Village": x.village_id.villagename,
			"Child Name": x.name,
			"Mother Name": x.mother_name,
			"Place of Death": x.palce_of_death,
			"Death Date Time": x.date_of_death,
			"Form 1": 'Yes',
			"Form 2": x.cdrForm2s.length > 0 ? 'yes' : 'No',
			"Form 3A": x.cdrForm3s.length > 0 ? "Yes" : "No",
			"Form 3B": x.cdrForm3bs.length > 0 ? "Yes" : "No",
			"Form 3C": x.cdrForm3cs.length > 0 ? "Yes" : "No",
			"Form 4A": x.cdrForm4as.length > 0 ? "Yes" : "No",
			"Form 4B": x.cdrForm4bs.length > 0 ? "Yes" : "No"
		}));
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "Report For Child Deaths Details.xlsx");
	}

}


