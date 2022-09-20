import { Router } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef, ViewChild, EventEmitter, ElementRef } from "@angular/core";
import { Form2Service } from "../../../../services/mdsr/form2.service";
import * as objectPath from "object-path";
import { MatPaginator, MatSort } from "@angular/material";
import { DataList } from "../../../../models/views/data-list";
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Form2Object } from '../../../../models/forms/mdsr/form2';
import FormGeneratorConfig from "./form/form2-generator-config.json";
import { FormioComponent } from 'angular-formio';
import { replaceStringWith } from '../../../../utilities/decorators/replace-string-with';
import { localizationApiEndPoint } from '../../../../utilities/api';
let stateDisabledStatus: boolean = false;
let districtDisabledStatus: boolean = false;
let blockDisabledStatus: boolean = false;
import * as XLSX from "xlsx";
import jsPDF, { jsPDFOptions } from 'jspdf';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake'; @Component({
	selector: "kt-form2",
	templateUrl: "./form2.component.html",
	styleUrls: ["./form2.component.scss"]
})

export class Form2Component implements OnInit, DataList {
	readonly pageSize = 50;
	expandedElement: any;
	form2Submitted: boolean = false;
	mdsrForm2FormGroup: FormGroup;
	mdsrForm2Object: Form2Object;
	currentUser: any;
	refreshForm = new EventEmitter();
	isShowFilter: boolean = true;
	place_of_death: any;
	@replaceStringWith({ string: ["{{url}}", "{{stateDisabled}}", "{{districtDisabled}}", "{{blockDisabled}}"], replaceWith: [localizationApiEndPoint, stateDisabledStatus, districtDisabledStatus, blockDisabledStatus], accessUpto: JSON.parse(sessionStorage.getItem("currentUser")) ? [JSON.parse(sessionStorage.getItem("currentUser")).accessupto] : [""] })

	filterForm: Object = FormGeneratorConfig;

	@ViewChild("filterFormRef", { static: true })
	filterFormRef: FormioComponent;

	buttonText: string = 'Save';
	readonly columns: DataList["columns"] = [
		// { name: "Village", key:"village.villagename" },
		{ name: "block", isActionField: true },
		{ name: "Name of Deceased", isActionField: true },
		// { name: "Father", key: "husband_name" },
		{ name: "Husband", key: "mdsrForm1.husband_name" },
		// { name: "DOB", isActionField: true },
		{ name: "Age", isActionField: true },
		// { name: "MCTS", key: "mcts_id" },
		// { name: "Mobile", key: "mobile" },
		{ name: "Death Date Time", isActionField: true },
		{ name: "Place Of Death", key: "mdsrForm1.place_of_death" },
		{ name: "When Death Occured", key: "mdsrForm1.when_death_occur" },
		{ name: "isMaternal", isActionField: true },
		// { name: "Cause of Death", isActionField: true },
		{ name: "Primary Informant", key: "mdsrForm1.reporting_person" },
		{ name: "Designation", key: "mdsrForm1.designation" },
		{ name: "Investigation Date", isActionField: true },
		{ name: "Reason", key: "reason" },
		{ name: "Action Taken", key: "action_taken" },
		// { name: "Reported Date", isActionField: true },

		{ name: "action", isActionField: true }
	];
	readonly columnsToDisplay = this.columns.map(c => c.name);
	dataSource = [];

	readonly objectPath = objectPath;

	totalRecords = 0;
	isLoadingResults = true;
	isMaxLimitReached = false;
	fromDate: moment.Moment = null;
	toDate: moment.Moment = null;
	title: string = '';
	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: false }) sort: MatSort;

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private form2Service: Form2Service,
		private router: Router
	) { }

	filterChange({ data, isValid }) {

		if (data && isValid) {
			const where: Partial<any> = {
				"state_id.statecode": data.stateid ? data.stateid.statecode : undefined,
				"district_id.districtcode": data.districtid ? data.districtid.districtcode : undefined,
				"block_id.subdistrictcode": data.blockid ? data.blockid.subdistrictcode : undefined,
				"updatedAt": { between: [moment(data.fromDate), moment(data.toDate)] }
			};
			this.fromDate = moment(data.fromDate);
			this.toDate = moment(data.toDate);
			this.title = `Form 2: Block Level MDR Register for All Women’s Death (15-49 Years) - <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`
			this.isLoadingResults = true;
			this.getList(where)
		}
	}

	ngAfterViewInit() {
		//Add where filter on ngin as complete data was called due to no where available
		const where: Partial<any> = {
			"state_id.statecode": this.currentUser && (this.currentUser.accessupto === "Block" || this.currentUser.accessupto === "District" || this.currentUser.accessupto === "State")
				? this.currentUser.user_state_id.statecode
				: undefined,
			"district_id.districtcode": this.currentUser && (this.currentUser.accessupto === "Block" || this.currentUser.accessupto === "District")
				? this.currentUser.user_district_id.districtcode
				: undefined,
			"block_id.subdistrictcode": this.currentUser && this.currentUser.accessupto === "Block"
				? this.currentUser.user_block_id.subdistrictcode
				: undefined,
			updateAt: { between: [moment().startOf('month'), moment().add(1, 'days')] }
		};
		this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.getList(where);

	}
	month: string; year: string; productToDate: string;
	ngOnInit() {
		this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'))
		this.productToDate = sessionStorage.getItem("ptd");
		if (this.currentUser.designation == "BMO" || this.currentUser.designation == "ASHA" || this.currentUser.designation == "ANM") {
			this.place_of_death = { inq: ["Home", "Transit", "Other"] }
		} else if (this.currentUser.designation == "Facility" || this.currentUser.designation == "FNO") {
			this.place_of_death = { inq: ["Health Facility"] }
		} else {
			this.place_of_death = { inq: ["Home", "Transit", "Other", "Health Facility"] }
		}
		this.setValues();
	}

	setValues() {
		setTimeout(() => this.changeDetectorRef.detectChanges(), 500);
		const data = {
			stateid:
				this.currentUser && (this.currentUser.accessupto === "Block" || this.currentUser.accessupto === "District" || this.currentUser.accessupto === "State")
					? this.currentUser.user_state_id
					: null,
			districtid:
				this.currentUser && (this.currentUser.accessupto === "Block" || this.currentUser.accessupto === "District")
					? this.currentUser.user_district_id
					: null,
			blockid:
				this.currentUser && this.currentUser.accessupto === "Block"
					? {
						"subdistrictcode": this.currentUser.user_block_id.subdistrictcode,
						"subdistrictname": this.currentUser.user_block_id.subdistrictname
					} as Block
					: null,
			fromDate: moment(this.productToDate),
			toDate: moment()
		};

		this.title = `Form 2: Block Level MDR Register for All Women’s Death (15-49 Years) - <small>${data.fromDate} - ${data.toDate.format('DD-MM-YYYY')}</small>`
		setTimeout(() => {
			this.refreshForm.emit({
				form: this.filterForm,
				submission: {
					data
				}
			})
		}, 1000)

	}
	onClick() {
		this.isShowFilter = !this.isShowFilter;
		//this.setValues();
		this.changeDetectorRef.detectChanges();
	}

	getList(where) {
		this.isLoadingResults = true;
		let relations = [{
			relation: 'mdsrForm1'
		}]
		this.form2Service.getList({
			where: where,
			include: relations,
			skip: this.paginator.pageIndex * this.pageSize,
			limit: this.pageSize
		})
			.subscribe(data => {
				this.dataSource = data;
				this.isLoadingResults = false;
				this.changeDetectorRef.detectChanges();
			});
	}
	getTableFooterCount(count: any) {
		//this.form2Service.count(where).subscribe(({ count }) => {
		this.totalRecords = count;
		this.changeDetectorRef.detectChanges();
		//});
	}

	pdfView(id: string) {
		this.router.navigateByUrl(`/mdsr/form2/pdf/${id}`)
	}

	exportToExcel() {
		console.log(this.dataSource)
		let dataToExport = this.dataSource.map((x) => ({
			"Block": x.mdsrForm1.block_id.subdistrictname,
			"Deceased Women Name": x.mdsrForm1.getName,
			"Age": x.mdsrForm1.getAge,
			"Date of Death": moment(x.mdsrForm1.death_date_time).format('DD-MM-YYYY'),
			"Address": x.mdsrForm1.deceased_women_current_address,
			"Husband Name": x.mdsrForm1.husband_name,
			"Cause of Death": x.mdsrForm1.is_maternal_death ? 'Maternal' : 'Non-Maternal',
			"Primary Informant": x.mdsrForm1.reporting_person,
			"Designation": x.mdsrForm1.designation,
			"Investigation Date": x.getFieldInvestigationDate,
			"Reason": x.reason,
			"Action Taken": x.action_taken
		}));
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "Block Level MDR Register for All Women’s Death(15-49 years).xlsx");
	}

	@ViewChild('pdfTable', { static: false }) pdfTable: ElementRef;
	exportToPDF() {
		const options: jsPDFOptions = {
			orientation: "landscape",
		}
		const doc = new jsPDF(options);
		const pdfTable = this.pdfTable.nativeElement;
		var html = htmlToPdfmake(pdfTable.innerHTML);
		// html[1].table.body[0].length = html[1].table.body[0].length-1;
		// html[1].table.body[1].length = html[1].table.body[1].length-1;
		// html[1].table.body[2].length = html[1].table.body[2].length-1;
		const documentDefinition = { content: html, pageOrientation: 'landscape' };
		pdfMake.createPdf(documentDefinition).open();
	}
}
