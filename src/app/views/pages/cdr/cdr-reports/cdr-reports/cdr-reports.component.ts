import { Component, OnInit,AfterViewInit,OnDestroy,NgZone,ChangeDetectorRef ,ViewChild} from '@angular/core';
import moment from 'moment';
import { ReportFiliterComponent } from '../../../mdsr/filter/report-filiter/report-filiter.component';
import { MatTableDataSource, MatPaginator, MatSort, MatTable } from "@angular/material";
import { CdrForm1Service } from "../../../../../services/cdr/form1.service";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as XLSX from "xlsx";
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { Router } from '@angular/router';



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
	params:any;


  // reportResponse;
	reportResponse: MatTableDataSource<any>;
  @ViewChild( "paginatorForReportResponseDetail", { static: true }) paginatorForReportResponseDetail: MatPaginator;
  displayedColumnsForBlockwiseMaternalDeathsDetail: string[] = [ 'sn','statename','districtname', 'subdistrictname', 'villagename', 'deceased_women_fname', 'husband_name', 'place_of_death', 'death_date_time','form_1','form_2','form_3A','form_3B','form_3C','form_4A','form_4B'];
  
  ngOnInit() {
    this.mon = moment().month() + 1;
		this.day = moment().day() + 1;
    if (this.currentUser.accessupto == "Block") {
			this.block_id = this.currentUser.user_block_id['subdistrictcode'];
		} else if (this.currentUser.accessupto == "District") {
			this.district_id = this.currentUser.user_district_id['districtcode'];
		} else if (this.currentUser.accessupto == "State") {
			this.state_id = this.currentUser.user_state_id['statecode'];
			// this.getDeathsWhereCbmdsrAndFbmdsrConducted({ "statecode": this.state_id });
			// this.getSubmittedFormsStatusDistrictwise({ "statecode": this.state_id });
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
		let param = {
			previousYearFromDate: this.fromDate,
			previousYearToDate: this.toDate,
			where: { 
			statecode: this.state_id ? this.state_id : undefined,
			districtcode: this.district_id ? this.district_id : undefined,
			subdistrictcode: this.block_id ? this.block_id : undefined,
			},
			accessUpto: this.currentUser.accessupto
		}

    // let param = {};//this.where;
		// param = {
		// 	updatedAt: {
		// 		"$gte": (moment().year() - 1) + "-" + this.mon + "-" + "01",
		// 		"$lte": moment().year() + "-" + this.mon + "-" + this.day
		// 	}
		// }
		// // if (arg.type == "CBMDSR") {
		// // 	whereParam['palce_of_death'] = { '$in': ["Home", "In transit", "Other"] }
		// // } else if (arg.type == "FBMDSR") {
		// // 	whereParam['palce_of_death'] = { '$in': ["Hospital"] }
		// // }
	const params=	{"where":param.where,"include":["cdrForm2s","cdrForm3s","cdrForm3bs","cdrForm3cs","cdrForm4as","cdrForm4bs"]}
     console.log('passing this param',params);
    this.cdrForm1Service.getList(params).subscribe(res => {
		console.log(res)
    this.reportResponse = new MatTableDataSource(res);
		this.reportResponse.paginator =this.paginatorForReportResponseDetail;

    })
	// forCdrReportDetailExportTable(){
	// 	let dataToExport = this.reportResponse.data.map((x) => ({
	// 		"District": x.address.districtname,
	// 		"Block": x.address.subdistrictname,
	// 		//"Village": x.village_id.villagename,
	// 		"Deceased Women Name": x.name,
	// 		"Husband Name": x.mother_name,
	// 		"Place of Death": x.palce_of_death,
	// 		"Death Date Time": x.date_of_death,
	// 	}));
	// 	const workSheet = XLSX.utils.json_to_sheet(dataToExport);
	// 	const workBook: XLSX.WorkBook = XLSX.utils.book_new();
	// 	XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
	// 	XLSX.writeFile(workBook, "Report For Child Deaths Details.xlsx");
	// }

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
			console.log('res',res)
			this.params= {
				statecode: res.state_id ? res.state_id : undefined,
				districtcode: res.district_id ? res.district_id : undefined,
				subdistrictcode: res.block_id ? res.block_id : undefined,
				updatedAt: {
					"$gte": res.from_date,
					"$lte": res.to_date
				}
			}
			this.cdrForm1Service.getNotificationDetails(this.params).subscribe(res => {
			console.log(res)

				this.reportResponse = new MatTableDataSource(res);
					this.reportResponse.paginator =this.paginatorForReportResponseDetail;
			
				})
				
    })
  }

  navigateToForm(formname:string,data:any){
	if(formname=='form1'){
	this.router.navigateByUrl(`/cdr/form1/${data["id"]}?view=true`);
	}else if(formname=='form2'){
		this.router.navigateByUrl(`/cdr/form2/${data.cdrForm2s[0].id}?view=true`)
	}else if(formname=='form3A'){
	this.router.navigateByUrl(`/cdr/form3/a/${data.cdrForm3s[0].id}?view=true`)
	}else if(formname=='form3b'){
     this.router.navigateByUrl(`/cdr/form3/b/${data.cdrForm3bs[0].id}?view=true`)
	}else if(formname=='form3c'){
	  this.router.navigateByUrl(`/cdr/form3/c/${data.cdrForm3cs[0].id}?view=true`)
	}else if(formname=='form4A'){
		this.router.navigateByUrl(`/cdr/form4/a/${data.cdrForm4as[0].id}?view=true`)
	}else if(formname=='form4B'){
		 this.router.navigateByUrl(`/cdr/form4/b/${data.cdrForm4bs[0].id}?view=true`)
	}
    
  }

}

