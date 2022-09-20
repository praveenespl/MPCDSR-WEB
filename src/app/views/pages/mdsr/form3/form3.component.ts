import { Form3Object } from './../../../../models/forms/mdsr/form3';
import { Component, OnInit, ChangeDetectorRef, ViewChild, EventEmitter } from "@angular/core";
import { Form3Service } from "../../../../services/mdsr/form3.service";
import * as objectPath from "object-path";
import { MatPaginator, MatSort } from "@angular/material";
import { merge, of } from "rxjs";
import { startWith, switchMap, map, catchError } from "rxjs/operators";
import { DataList } from "../../../../models/views/data-list";
import FormFilter from "./form/form3-filter.json";
import { Form1Service } from '../../../../services/mdsr/form1.service';
import { replaceStringWith } from '../../../../utilities/decorators/replace-string-with';
import { localizationApiEndPoint } from '../../../../utilities/api';
import * as moment from 'moment';
let stateDisabledStatus: boolean = false;
let districtDisabledStatus: boolean = false;
let blockDisabledStatus: boolean = false;
import * as XLSX from "xlsx";
import jsPDF, { jsPDFOptions } from 'jspdf';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ElementRef } from '@angular/core';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
@Component({
	selector: "kt-form3",
	templateUrl: "./form3.component.html",
	styleUrls: ["./form3.component.scss"]
})
export class Form3Component implements OnInit, DataList {
	readonly pageSize = 50;
	readonly columns: DataList["columns"] = [
		{ name: "block", isActionField: true },
		{ name: "Name of Deceased", isActionField: true },
		{ name: "Age", isActionField: true },
		{ name: "Death Date Time", isActionField: true },
		{ name: "MDR Type", key: "mdr_type" },
		{ name: "Place Of Death", key: "mdsrForm1.place_of_death" },
		{ name: "When Death Occured", key: "mdsrForm1.when_death_occur" },
		{ name: "Death Cause", isActionField: true },
		{ name: "Primary Informant", key: "mdsrForm1.reporting_person" },
		{ name: "Designation", key: "mdsrForm1.designation" },
		{ name: "Status of Newborn", key: "status_of_newborn" },
		{ name: "Investigator Name", key: "name_of_investigator" },
		{ name: "Interview Date", isActionField: true },

		{ name: "action", isActionField: true }
	];
	readonly columnsToDisplay = this.columns.map(c => c.name);
	dataSource = [];
	showMailButton: boolean = false;
	readonly objectPath = objectPath;

	totalRecords = 0;
	isLoadingResults = true;
	isMaxLimitReached = false;

	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: false }) sort: MatSort;
	@replaceStringWith({ string: ["{{url}}", "{{stateDisabled}}", "{{districtDisabled}}", "{{blockDisabled}}"], replaceWith: [localizationApiEndPoint, stateDisabledStatus, districtDisabledStatus, blockDisabledStatus], accessUpto: JSON.parse(sessionStorage.getItem("currentUser")) ? [JSON.parse(sessionStorage.getItem("currentUser")).accessupto] : [""] })

	formFilter: Object = FormFilter;
	place_of_death: any;
	currentUser: any
	isShowFilter: boolean = true;
	mdrTypeValue: any;
	facilityCommunityDisabled: boolean = false;
	refreshForm = new EventEmitter();
	month: string; year: string;

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private form3Service: Form3Service,
		private form1Service: Form1Service
	) { }
	title: string = '';
	fromDate: moment.Moment = null;
	toDate: moment.Moment = null;

	ngAfterViewInit() {
		const where: Partial<any> = {
			mdr_type: this.place_of_death,
			"state_id.statecode": this.currentUser && (this.currentUser.accessupto === "Block" || this.currentUser.accessupto === "District" || this.currentUser.accessupto === "State")
				? this.currentUser.user_state_id.statecode
				: undefined,
			"district_id.districtcode": this.currentUser && (this.currentUser.accessupto === "Block" || this.currentUser.accessupto === "District")
				? this.currentUser.user_district_id.districtcode
				: undefined,
			"block_id.subdistrictcode": this.currentUser && (this.currentUser.accessupto === "Block" || this.currentUser.accessupto === "District")
				? this.currentUser.user_block_id.subdistrictcode
				: undefined,
			"updatedAt": { between: [this.fromDate, this.toDate] }
			// "month": parseInt(moment().format('MM')),
			// "year": parseInt(moment().format('YYYY'))
			// "block_id.subdistrictcode": this.currentUser && this.currentUser.accessupto === "Block"
			// 	? this.currentUser.user_block_id.subdistrictcode
			// 	: undefined
		};
		// if(this.mdrTypeValue=="community"){
		// 	where['block_id.subdistrictcode']=this.currentUser.user_block_id.subdistrictcode;
		// }
		this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		console.log("where : ", where);
		this.getTableFooterCount(where);
		merge(this.sort.sortChange, this.paginator.page)
			.pipe(
				startWith({}),
				switchMap(() => {
					this.isLoadingResults = true;
					return this.form3Service.getList({
						include: [{
							relation: "mdsrForm1"
						}],
						skip: this.paginator.pageIndex * this.pageSize,
						limit: this.pageSize,
						where: where
					});
					// (this.sort.active, this.sort.direction, this.paginator.pageIndex);
				}),
				map(data => {
					// Flip flag to show that loading has finished.
					this.isLoadingResults = false;
					this.isMaxLimitReached = false;
					// this.resultsLength = data.total_count;

					return data;
				}),
				catchError(() => {
					this.isLoadingResults = false;
					// Catch if the GitHub API has reached its rate limit. Return empty data.
					this.isMaxLimitReached = true;
					return of([]);
				})
			)
			.subscribe(data => {
				let finalResult = [];
				data.forEach(element => {
					if (this.currentUser.designation == "BMO" || this.currentUser.designation == "ASHA" || this.currentUser.designation == "ANM") {
						if (element['mdsrForm1']['place_of_death'] == "Home" || element['mdsrForm1']['place_of_death'] == "Transit" || element['mdsrForm1']['place_of_death'] == "Other") {
							finalResult.push(element);
						}
					} else if (this.currentUser.designation == "Facility" || this.currentUser.designation == "FNO") {
						if (element['mdsrForm1']['place_of_death'] == "Health Facility") {
							finalResult.push(element);
						}
					}
				});
				this.dataSource = finalResult;//data;
				this.showMailButton = this.dataSource.length > 0 ? true : false;
				//this.dataSource = data;
				setTimeout(() => {
					this.changeDetectorRef.detectChanges();
				}, 1000);

			});
	}

	ngOnInit() {
		this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'))
		if (this.currentUser.designation == "BMO" || this.currentUser.designation == "ASHA" || this.currentUser.designation == "ANM") {
			this.place_of_death = { inq: ["community"] }
			this.mdrTypeValue = "community";
			this.facilityCommunityDisabled = true;
		} else if (this.currentUser.designation == "Facility" || this.currentUser.designation == "FNO") {
			this.place_of_death = { inq: ["facility"] }
			this.mdrTypeValue = "facility";
			this.facilityCommunityDisabled = true;
		} else {
			this.place_of_death = { inq: ["community", "facility"] }
			this.mdrTypeValue = undefined;
			this.facilityCommunityDisabled = false;
		}


		setTimeout(() => {
			this.fromDate = moment(sessionStorage.getItem("ptd"));
			this.toDate = moment()
			this.title = `Form 3: MDR Line Listing Form for All Cases of Maternal Death Data (15-49 Years) - <small>${moment(this.fromDate).format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`

			this.user = JSON.parse(sessionStorage.getItem('currentUser'))
			const data = {
				state:
					this.user && (this.user.accessupto === "Block" || this.user.accessupto === "District" || this.user.accessupto === "State")
						? this.user.user_state_id
						: null,
				district:
					this.user && (this.user.accessupto === "Block" || this.user.accessupto === "District")
						? this.user.user_district_id
						: null,
				block:
					this.user && this.user.accessupto === "Block"
						? this.user.user_block_id
						: null,
				mdrtype: this.mdrTypeValue,
				fromDate: this.fromDate.format("YYYY-MM-DD"),
				toDate: this.toDate
			};

			this.refreshForm.emit({
				form: this.formFilter,
				submission: {
					data
				}
			})

		}, 1000);
		this.changeDetectorRef.detectChanges();
	}
	user;
	onClick() {
		this.isShowFilter = !this.isShowFilter;
		//this.setValues();
		this.changeDetectorRef.detectChanges();
	}

	filterChange({ data, isValid }) {

		if (data && isValid) {
			this.fromDate = moment(data.fromDate);
			this.toDate = moment(data.toDate);
			this.title = `Form 3: MDR Line Listing Form for All Cases of Maternal Death Data (15-49 Years) - <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`
			let where: Partial<any> & { [key: string]: any } = {
				"mdr_type": this.place_of_death,
				"state_id.statecode": this.currentUser.user_state_id ? this.currentUser.user_state_id.statecode : undefined,//data.state.statecode,
				"district_id.districtcode": this.currentUser.user_district_id ? this.currentUser.user_district_id.districtcode : undefined,//data.district.districtcode,
				"block_id.subdistrictcode": this.currentUser.user_block_id ? this.currentUser.user_block_id['subdistrictcode'] : undefined,
				"updatedAt": { between: [this.fromDate, this.toDate] }
			};

			if (data.mdrtype === "facility") {
				if (data.facility == undefined || data.facility == null)
					return
				where['facility_id.health_facility_primary_key_id'] = data.facility.health_facility_primary_key_id;
			}
			this.isLoadingResults = true;
			this.getTableFooterCount(where);
			this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
			merge(this.sort.sortChange, this.paginator.page)
				.pipe(
					startWith({}),
					switchMap(() => {
						this.isLoadingResults = true;
						let relations = [{
							relation: 'mdsrForm1'
						}];
						return this.form3Service.getList({
							include: relations,
							skip: this.paginator.pageIndex * this.pageSize,
							limit: this.pageSize,
							where: where,
						});
						// (this.sort.active, this.sort.direction, this.paginator.pageIndex);
					}),
					map(data => {
						// Flip flag to show that loading has finished.
						this.isLoadingResults = false;
						this.isMaxLimitReached = false;
						console.log(data)
						return data;
					}),
					catchError(() => {
						this.isLoadingResults = false;
						// Catch if the GitHub API has reached its rate limit. Return empty data.
						this.isMaxLimitReached = true;
						return of([]);
					})
				)
				.subscribe(data => {
					this.dataSource = data;
					this.showMailButton = this.dataSource.length > 0 ? true : false;
					this.changeDetectorRef.detectChanges();
				});
		} else {
			//this.dataSource = [];
		}
	}

	getTableFooterCount(where: any) {
		this.form3Service.count(where).subscribe(({ count }) => {
			this.totalRecords = count;
		});
		this.changeDetectorRef.detectChanges();
	}

	sendMail() {
		let dataSource: Form3Object[] = this.dataSource;

		let tableBody = '', columnHeader = '';
		for (const column of this.columns) {
			if (column.name != 'action')
				columnHeader += `<th>${column.name}</th>`
		}



		let table = '<table cellspacing=0 cellpadding=0 border=1> <thead style="padding-top: 12px;padding-bottom: 12px;text-align: left;background-color: #04AA6D;color: white;"> <tr>' + columnHeader + '</tr></thead><tbody>';
		for (const data of dataSource) {
			tableBody += `<tr>
						<td>${data.mdsrForm1.getName}</td>
						<td>${data.mdsrForm1.husband_name}</td>
						<td>${data.mdsrForm1.getAge}</td>
						<td>${data.mdsrForm1.death_date_time}</td>
						<td>${data.mdr_type}</td>
						<td>${data.mdsrForm1.place_of_death}</td>
						<td>${data.mdsrForm1.when_death_occur}</td>
						<td>${data.mdsrForm1.is_maternal_death ? 'Maternal' : 'Non Maternal'}</td>
						<td>${data.mdsrForm1.reporting_person}</td>
						<td>${data.mdsrForm1.designation}</td>
						<td>${data.status_of_newborn}</td>
						<td>${data.name_of_investigator}</td>
						<td>${data.getInterviewDate}</td>

					</tr>`;
		}

		tableBody += '</tbody></table><br/><br/>'
			;
		table += tableBody;
		let html = 'Dear Sir/Madam,<br/><br/> Greetings!<br/><br/> Please find the details of MDR Line Listing(Form3) for Last 30 days.<br/><br/><br/>';
		html += table + '<strong>Thanks & Regards</strong><br/><br/>' + this.currentUser.user_block_id.subdistrictname + ' Block ';
		;


		const options = {
			from: 'praveen@etech-services.com',
			to: 'psraj86@gmail.com',
			text: 'Form 3: MDR Line Listing Form for All Cases of Maternal Death Data',
			subject: 'Form 3: MDR Line Listing Form for All Cases of Maternal Death Data',
			html
		}
		this.form3Service.sendMail(options).subscribe(res => {
			console.log(res);
		})
	}

	exportToExcel() {
		let dataToExport = this.dataSource.map((x) => ({
			"Block": x.mdsrForm1.block_id.subdistrictname,
			"Deceased Women Name": x.mdsrForm1.getName,
			"Husband Name": x.mdsrForm1.husband_name,
			"Age": x.mdsrForm1.getAge,
			"Date of Death": moment(x.mdsrForm1.death_date_time).format('DD-MM-YYYY HH:MM a'),
			"MDR Type": x.mdr_type,
			"Place of Death": x.mdsrForm1.place_of_death,
			"When Death Occur": x.mdsrForm1.when_death_occur,
			"Cause of Death": x.mdsrForm1.is_maternal_death ? 'Maternal' : 'Non-Maternal',
			"Primary Informant": x.mdsrForm1.reporting_person,
			"Designation": x.mdsrForm1.designation,
			"Status of Newborn": x.status_of_newborn,
			"Investigator Name": x.name_of_investigator,
			"Interview Date": x.getInterviewDate
		}));
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "MDR Line Listing Form for All Cases of Maternal Death Data.xlsx");
	}
	@ViewChild('pdfTable', { static: false }) pdfTable: ElementRef;
	exportToPDF() {
		setTimeout(() => {
			const options: jsPDFOptions = {
				orientation: "landscape",

			}
			const doc = new jsPDF(options);
			const pdfTable = this.pdfTable.nativeElement;
			var html = htmlToPdfmake(pdfTable.innerHTML);
			// html[1].table.body[0].length = html[1].table.body[0].length - 1;
			// html[1].table.body[1].length = html[1].table.body[1].length - 1;
			const documentDefinition = { content: html, pageOrientation: 'landscape' };
			pdfMake.createPdf(documentDefinition).open();
		}, 500)
	}
}
