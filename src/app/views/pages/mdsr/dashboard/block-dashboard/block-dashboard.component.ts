import {
	Component,
	OnInit,
	AfterViewInit,
	OnDestroy,
	NgZone,
	ChangeDetectorRef,
	ViewChild
} from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { Form1Service } from '../../../../../services/mdsr/form1.service';
import moment from 'moment';
import { AlertService } from '../../../../../utilities/alert.service';
import Swal from 'sweetalert2';
import { MatPaginator, MatSort, MatDialog } from "@angular/material";
import { merge, of } from "rxjs";
import { startWith, switchMap, map, catchError } from "rxjs/operators";
am4core.useTheme(am4themes_animated);
import { DataList } from "../../../../../models/views/data-list";
import { DataList1 } from "../../../../../models/views/data-list1";
import * as objectPath from "object-path";
import { Form5Service } from "../../../../../services/mdsr/form5.service";
@Component({
	selector: 'kt-block-dashboard',
	templateUrl: './block-dashboard.component.html',
	styleUrls: ['./block-dashboard.component.scss']
})
export class BlockDashboardComponent implements OnInit {
	projectToDate: string = sessionStorage.getItem("ptd");
	callingFrom = undefined;
	passingArgOnDistrictClick: any;
	mapChartDiv = 'fromDistrictLoginForBlockMap';
	activeTab = 'Current Month';
	isShowNotificationDetailTable = false;
	fromDate: any;
	toDate: any;
	//maternal deaths notification array
	maternalDeathsNotification = [];
	blockwiseMaternalDeathsNotification = [];
	whereCbmdsrAndFbmdsrConductedInBlock: any;
	isShowBlockwiseDeathsDetailTable = false;
	blockwiseDetailsOfMaternalDeathsNotification: any;
	isShowBlockTable = false;
	isShowMaternalDeathsDetails = false;
	stateData: any;
	indicatorDetails: any;
	isShowState = true;
	isShowDistrict = false;
	selectedValue: string = "stateWise";
	where: any;
	mapChardDiv = 1;
	MaternalCauses: any;
	GraphMaternalCausesLast6Month: any;
	private charts: Array<any> = [];
	currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: false }) sort: MatSort;
	@ViewChild(MatPaginator, { static: false }) paginator1: MatPaginator;
	@ViewChild(MatSort, { static: false }) sort1: MatSort;
	readonly columns: DataList["columns"] = [
		// { name: "State", key: "deceased_women_fname" },
		// { name: "District", key: "deceased_women_fname" },
		// { name: "Block", key: "deceased_women_fname" },
		{ name: "Deceased Woman Name", isActionField: true },
		{ name: "Age", key: "age" },
		{ name: "Husband Name", key: "husband_name" },
		{ name: "Village", key: "village_id.villagename" },
		{ name: "Place of Death", key: "place_of_death" },
		{ name: "Death Date Time", isActionField: true },// key: "death_date_time" },
		{ name: "IsMaternal", isActionField: true },
		{ name: "verify", isActionField: true },
		//{ name: "action", isActionField: true }
	];
	readonly columnsToDisplay = this.columns.map(c => c.name);
	readonly objectPath = objectPath;
	readonly columnss :DataList1['columnss']= [
		{ name: "block", isActionField: true },
		{ name: "Woman Name", isActionField: true },
		//{ name: "Husband", key: "mdsrForm1.husband_name" },
		{ name: "age", isActionField: true },
		{ name: "Death Date Time", isActionField: true },
		{ name: "Place Of Death", key: "mdsrForm1.place_of_death" },
		{ name: "When Death Occured", key: "mdsrForm1.when_death_occur" },
		{ name: "Primary Informant", key: "mdsrForm1.reporting_person" },
		{ name: "Designation", key: "mdsrForm1.designation" },
		{ name: "action", isActionField: true }
	];
	readonly columnsToDisplays = this.columnss.map(c => c.name);
	readonly objectPath1 = objectPath;
	constructor(
		private zone: NgZone,
		private changeDetectorRef: ChangeDetectorRef,
		private form1Service: Form1Service,
		private alertService: AlertService,
		private form5Service:Form5Service
	) { }
	mon;
	day;
	block_id;
	district_id;
	state_id;
	place_of_death: any;

	topFilter: string = "all";

	topFilterChange(value){
		this.topFilter = value;
	}

	ngOnInit() {
		this.mon = moment().month() + 1;
		if (moment().date() > 10) {
			this.day = moment().date();
		} else {
			this.day = "0" + moment().date();
		}

		if (this.currentUser.accessupto == "Block") {
			//	this.stateName=this.currentUser.state.statename;
			//	this.districtName=this.currentUser.district.districtname;
			this.block_id = this.currentUser.user_block_id;
			this.getSubmittedFormsStatusBlockwise(this.block_id);
		} else if (this.currentUser.accessupto == "District") {
			//	this.stateName=this.currentUser.state.statename;
			//	this.districtName=this.currentUser.district.districtname;
			this.district_id = this.currentUser.user_district_id;
		} else if (this.currentUser.accessupto == "State") {
			//this.stateName=this.currentUser.state.statename;
			this.state_id = this.currentUser.user_state_id;
		} else { }
		// this.fromDate = "01" + "-" + mon + "-" + moment().year();
		this.fromDate = moment(this.projectToDate).format("DD-MM-YYYY");
		this.toDate = moment().year() + "-" + this.mon + "-" + this.day;
		this.where = {
			state_id: this.state_id ? this.state_id : undefined,
			district_id: this.district_id ? this.district_id : undefined,
			block_id: this.block_id ? this.block_id : undefined,
			// createdAt: { between: [moment().year() + "-" + mon + "-01", moment().year() + "-" + mon + "-" + day] }
			updatedAt: {
				"$gte": this.fromDate,
				"$lte": this.toDate
			}
		}
		let countParam = {
			"state_id.statecode": this.state_id ? this.state_id.statecode : undefined,
			"district_id.districtcode": this.district_id ? this.district_id.districtcode : undefined,
			"block_id.subdistrictcode": this.block_id ? this.block_id.subdistrictcode : undefined,
			updatedAt: {
				"$gte": this.fromDate,
				"$lte": this.toDate
			}
		}
		//get Top 4 Indicator Details
		this.form1Service.getDashboardData(countParam).subscribe(res => {
			this.indicatorDetails = res[0];
			this.changeDetectorRef.detectChanges();
		});

		//getting least and top district maternal death details
		// get notification count datewise
		countParam.updatedAt['$gte'] = moment().year() + "-" + this.mon + "-" + "01";
		countParam.updatedAt['$lte'] = moment().year() + "-" + this.mon + "-" + this.day;
		this.form1Service.getNotificationCount(countParam).subscribe(res => {
			if (res.length > 0) {
				this.maternalDeathsNotification.push({
					cbmdsr: { count: res[0]['CB'], type: "CBMDSR" },
					fbmdsr: { count: res[0]['FB'], type: "FBMDSR" }
				})
			}
			//this.getNotificationDetails({ type: "CBMDSR" });
			this.changeDetectorRef.detectChanges();
		});
		this.getIcd10CodesCategorywise(this.where);
		this.getMaternalCauseOfdeathsFor6Months();

		if (this.currentUser.designation == "BMO" || this.currentUser.designation == "ASHA" || this.currentUser.designation == "ANM") {
			this.place_of_death = { inq: ["Home", "Transit", "Other"] }
		} else {
			this.place_of_death = { inq: ["Health Facility"] }
		}
	}

	ngAfterViewInit() {
		this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.getList();
		this.getListForm5();
	}

	private maternalCausesYearOnYear() {
		this.zone.runOutsideAngular(() => {
			const colors = [
				am4core.color('#f56528'),
				am4core.color('#fcd338'),
				am4core.color('#b0de33'),
				am4core.color('#0d8ecf')
			];
			// CART 1
			const chart1 = am4core.create('chart1', am4charts.PieChart);
			chart1.colors.list = colors;

			chart1.innerRadius = am4core.percent(35);

			chart1.data = [
				{
					category: 'Abortion',
					'column-1': this.MaternalCauses.abortionPreviousYear,
					color: am4core.color('#f34225')
				},
				{
					category: 'Hypertension',
					'column-1': this.MaternalCauses.HypertensionPreviousYear,
					color: am4core.color('#f56528')
				},
				{
					category: 'Sepsis',
					'column-1': this.MaternalCauses.sepsisPreviousYear,
					color: am4core.color('#fa9e30')
				},
				{
					category: 'Hemorrhage',
					'column-1': this.MaternalCauses.haemorrhagePreviousYear,
					color: am4core.color('#fcd338')
				},
				{
					category: 'Embolism',
					'column-1': this.MaternalCauses.EmbolismPreviousYear,
					color: am4core.color('#f3ee3c')
				},
				{
					category: 'Indirect causes',
					'column-1': this.MaternalCauses.IndirectCausePreviousYear,
					color: am4core.color('#b0de33')
				},
				{
					category: 'Other Direct Causes',
					'column-1': this.MaternalCauses.OtherDirectCausePreviousYear,
					color: am4core.color('#68d42c')
				}
			];

			var pieSeries = chart1.series.push(new am4charts.PieSeries());
			pieSeries.dataFields.value = 'column-1';
			pieSeries.dataFields.category = 'category';
			pieSeries.slices.template.propertyFields.fill = 'color';

			pieSeries.ticks.template.disabled = true;
			pieSeries.alignLabels = false;
			pieSeries.labels.template.text = "{value.percent.formatNumber('#.0')}%";
			pieSeries.labels.template.radius = am4core.percent(-30);
			pieSeries.labels.template.fontWeight = "600";

			chart1.legend = new am4charts.Legend();
			chart1.legend.align = 'center';
			chart1.legend.fontSize = 12;
			chart1.legend.labels.template.text = '{category}';
			chart1.legend.valueLabels.template.text = '';

			chart1.legend.markers.template.marginRight = 2;
			chart1.legend.markers.template.width = 16;
			chart1.legend.markers.template.height = 16;

			const title1 = chart1.titles.create();

			title1.text = 'Indirect Maternal Death Cause : ' + moment().format("YYYY");
			title1.fontSize = 15;

			this.charts.push(chart1);

			// CART 2
			const chart2 = am4core.create('chart2', am4charts.PieChart);
			chart2.colors.list = colors;

			chart2.innerRadius = am4core.percent(35);

			chart2.data = [
				{
					category: 'Abortion',
					'column-1': this.MaternalCauses.abortionCurrentYear,
					color: am4core.color('#f34225')
				},
				{
					category: 'Hypertension',
					'column-1': this.MaternalCauses.HypertensionCurrentYear,
					color: am4core.color('#f56528')
				},
				{
					category: 'Sepsis',
					'column-1': this.MaternalCauses.sepsisCurrentYear,
					color: am4core.color('#fa9e30')
				},
				{
					category: 'Hemorrhage',
					'column-1': this.MaternalCauses.haemorrhageCurrentYear,
					color: am4core.color('#fcd338')
				},
				{
					category: 'Embolism',
					'column-1': this.MaternalCauses.EmbolismCurrentYear,
					color: am4core.color('#f3ee3c')
				},
				{
					category: 'Indirect causes',
					'column-1': this.MaternalCauses.IndirectCauseCurrentYear,
					color: am4core.color('#b0de33')
				},
				{
					category: 'Other Direct Causes',
					'column-1': this.MaternalCauses.OtherDirectCauseCurrentYear,
					color: am4core.color('#68d42c')
				}
			];

			var pieSeries = chart2.series.push(new am4charts.PieSeries());
			pieSeries.dataFields.value = 'column-1';
			pieSeries.dataFields.category = 'category';
			pieSeries.slices.template.propertyFields.fill = 'color';

			// pieSeries.labels.template.text = '{value}';
			pieSeries.ticks.template.disabled = true;
			pieSeries.alignLabels = false;
			pieSeries.labels.template.text = "{value.percent.formatNumber('#.0')}%";
			pieSeries.labels.template.radius = am4core.percent(-30);
			pieSeries.labels.template.fontWeight = "600";
			// pieSeries.labels.template.fill = am4core.color("white");

			chart2.legend = new am4charts.Legend();
			chart2.legend.align = 'center';
			chart2.legend.fontSize = 12;
			chart2.legend.labels.template.text = '{category}';
			chart2.legend.valueLabels.template.text = '';

			chart2.legend.markers.template.marginRight = 2;
			chart2.legend.markers.template.width = 16;
			chart2.legend.markers.template.height = 16;

			const title2 = chart2.titles.create();

			title2.text = 'Direct Maternal Death Cause : ' + moment().format("YYYY");
			title2.fontSize = 15;

			this.charts.push(chart2);
		});
	}

	getNotificationDetails(arg) {
		this.isShowNotificationDetailTable = false;
		this.isShowMaternalDeathsDetails = false;
		let whereParam = {};//this.where;
		whereParam = {
			"state_id.statecode": this.state_id ? this.state_id.statecode : undefined,
			"district_id.districtcode": this.district_id ? this.district_id.districtcode : undefined,
			"block_id.subdistrictcode": this.block_id ? this.block_id.subdistrictcode : undefined,
			updatedAt: {
				"$gte": moment().year() + "-" + this.mon + "-" + "01",
				"$lte": moment().year() + "-" + this.mon + "-" + this.day
			}
		}
		if (arg.type == "CBMDSR") {
			whereParam['place_of_death'] = { '$in': ["Home", "Transit", "Other"] }
		} else if (arg.type == "FBMDSR") {
			whereParam['place_of_death'] = { '$in': ["Health Facility"] }
		}
		this.form1Service.getNotificationDetails(whereParam).subscribe(res => {
			this.blockwiseMaternalDeathsNotification = res;
			this.isShowNotificationDetailTable = true;
			this.isShowMaternalDeathsDetails = true;
			this.changeDetectorRef.detectChanges();
		});
	}

	getIcd10CodesCategorywise(where) {
		this.form1Service.getCodesCategorywise().subscribe(res => {
			let currentFromDate = moment().year() + "-" + "01" + "-" + "01";
			let currentToDate = moment().format("YYYY-MM-DD");
			let previousYearFromDate = (moment().year() - 1) + "-" + "01" + "-" + "01";
			let previousYearToDate = (moment().year() - 1) + "-" + "12" + "-" + "31";
			let param = {
				currentFromDate: currentFromDate,
				currentToDate: currentToDate,
				previousYearFromDate: previousYearFromDate,
				previousYearToDate: previousYearToDate,
				icCodes: res,
				where: where,
				accessUpto: this.currentUser.accessupto
			}
			this.form1Service.getMaternalCauseOfdeaths(param).subscribe(getMatRes => {
				this.MaternalCauses = getMatRes;
				this.maternalCausesYearOnYear();;
				this.changeDetectorRef.detectChanges();
			});
		});
	}

	getMaternalCauseOfdeathsFor6Months() {
		this.form1Service.getCodesCategorywise().subscribe(res => {
			let datesArray = [];
			for (let i = 5; i >= 0; i--) {
				datesArray.push({
					fromDate: moment().subtract(i, "months").format("YYYY-MM") + "-" + "01",
					toDate: moment().subtract(i, "months").format("YYYY-MM") + "-" + "31"
				});
			}
			let param = {
				datesArray: datesArray,
				icCodes: res,
				where: this.where,
				accessUpto: this.currentUser.accessupto
			}
			this.form1Service.getMaternalCauseOfdeathsFor6Months(param).subscribe(Res6monthsData => {
				this.GraphMaternalCausesLast6Month = Res6monthsData;
				//this.drawGraphMaternalCausesLast6Month();;
				this.changeDetectorRef.detectChanges();
			});
		});
	}

	// drawGraphMaternalCausesLast6Month() {
	// 	// CART 4
	// 	const chart4 = am4core.create('chart4', am4charts.XYChart);
	// 	chart4.paddingRight = 20;
	// 	const colors = [
	// 		am4core.color('#f56528'),
	// 		am4core.color('#fcd338'),
	// 		am4core.color('#b0de33'),
	// 		am4core.color('#0d8ecf')
	// 	];
	// 	chart4.colors.list = colors;

	// 	// Create axes
	// 	var dateAxis = chart4.xAxes.push(new am4charts.DateAxis());
	// 	dateAxis.renderer.minGridDistance = 50;
	// 	dateAxis.renderer.grid.template.location = 0.5;
	// 	dateAxis.startLocation = 0.5;
	// 	dateAxis.endLocation = 0.5;

	// 	// Create value axis
	// 	var valueAxis = chart4.yAxes.push(new am4charts.ValueAxis());

	// 	chart4.legend = new am4charts.Legend();
	// 	chart4.legend.align = 'center';
	// 	chart4.legend.fontSize = 12;
	// 	// chart4.legend.labels.template.text = '{category}';
	// 	// chart4.legend.valueLabels.template.text = '';

	// 	chart4.legend.markers.template.marginRight = 2;
	// 	chart4.legend.markers.template.width = 16;
	// 	chart4.legend.markers.template.height = 16;

	// 	chart4.cursor = new am4charts.XYCursor();
	// 	chart4.cursor.tooltipText = 'test';

	// 	const chart4data = this.GraphMaternalCausesLast6Month;

	// 	var xySeries201 = chart4.series.push(new am4charts.LineSeries());
	// 	xySeries201.dataFields.valueY = 'column-1';
	// 	xySeries201.dataFields.dateX = 'category';
	// 	xySeries201.strokeWidth = 3;
	// 	xySeries201.tensionX = 0.8;
	// 	xySeries201.bullets.push(new am4charts.CircleBullet());
	// 	xySeries201.data = chart4data;
	// 	xySeries201.name = 'Abortion';
	// 	xySeries201.tooltipText = '{name}: [bold]{valueY}[/]';
	// 	xySeries201.strokeWidth = 1;

	// 	var xySeries202 = chart4.series.push(new am4charts.LineSeries());
	// 	xySeries202.dataFields.valueY = 'column-2';
	// 	xySeries202.dataFields.dateX = 'category';
	// 	xySeries202.strokeWidth = 3;
	// 	xySeries202.tensionX = 0.8;
	// 	xySeries202.bullets.push(new am4charts.CircleBullet());
	// 	xySeries202.data = chart4data;
	// 	xySeries202.name = 'Hypertension';
	// 	xySeries202.tooltipText = '{name}: [bold]{valueY}[/]';
	// 	xySeries202.strokeWidth = 1;

	// 	var xySeries3 = chart4.series.push(new am4charts.LineSeries());
	// 	xySeries3.dataFields.valueY = 'column-3';
	// 	xySeries3.dataFields.dateX = 'category';
	// 	xySeries3.strokeWidth = 3;
	// 	xySeries3.tensionX = 0.8;
	// 	xySeries3.bullets.push(new am4charts.CircleBullet());
	// 	xySeries3.data = chart4data;
	// 	xySeries3.name = 'Sepsis';
	// 	xySeries3.tooltipText = '{name}: [bold]{valueY}[/]';
	// 	xySeries3.strokeWidth = 1;

	// 	var xySeries4 = chart4.series.push(new am4charts.LineSeries());
	// 	xySeries4.dataFields.valueY = 'column-4';
	// 	xySeries4.dataFields.dateX = 'category';
	// 	xySeries4.strokeWidth = 3;
	// 	xySeries4.tensionX = 0.8;
	// 	xySeries4.bullets.push(new am4charts.CircleBullet());
	// 	xySeries4.data = chart4data;
	// 	xySeries4.name = 'Hemorrhage';
	// 	xySeries4.tooltipText = '{name}: [bold]{valueY}[/]';
	// 	xySeries4.strokeWidth = 1;

	// 	var xySeries5 = chart4.series.push(new am4charts.LineSeries());
	// 	xySeries5.dataFields.valueY = 'column-5';
	// 	xySeries5.dataFields.dateX = 'category';
	// 	xySeries5.strokeWidth = 3;
	// 	xySeries5.tensionX = 0.8;
	// 	xySeries5.bullets.push(new am4charts.CircleBullet());
	// 	xySeries5.data = chart4data;
	// 	xySeries5.name = 'Embolism';
	// 	xySeries5.tooltipText = '{name}: [bold]{valueY}[/]';
	// 	xySeries5.strokeWidth = 1;

	// 	var xySeries6 = chart4.series.push(new am4charts.LineSeries());
	// 	xySeries6.dataFields.valueY = 'column-6';
	// 	xySeries6.dataFields.dateX = 'category';
	// 	xySeries6.strokeWidth = 3;
	// 	xySeries6.tensionX = 0.8;
	// 	xySeries6.bullets.push(new am4charts.CircleBullet());
	// 	xySeries6.data = chart4data;
	// 	xySeries6.name = 'IndirectCause';
	// 	xySeries6.tooltipText = '{name}: [bold]{valueY}[/]';
	// 	xySeries6.strokeWidth = 1;

	// 	var xySeries7 = chart4.series.push(new am4charts.LineSeries());
	// 	xySeries7.dataFields.valueY = 'column-7';
	// 	xySeries7.dataFields.dateX = 'category';
	// 	xySeries7.strokeWidth = 3;
	// 	xySeries7.tensionX = 0.8;
	// 	xySeries7.bullets.push(new am4charts.CircleBullet());
	// 	xySeries7.data = chart4data;
	// 	xySeries7.name = 'Other Direct Causes';
	// 	xySeries7.tooltipText = '{name}: [bold]{valueY}[/]';
	// 	xySeries7.strokeWidth = 1;

	// 	this.charts.push(chart4);




	// }

	formSubmittedStatusBlockwise: any
	isShowFormsStatusBlockwise = false;
	getSubmittedFormsStatusBlockwise(accessArg) {
		this.isShowFormsStatusBlockwise = false;
		let previousYearFromDate = (moment().year() - 1) + "-" + "01" + "-" + "01";
		let previousYearToDate = (moment().year() - 1) + "-" + "12" + "-" + "31";
		//let previousYearFromDate=(moment().year())+"-"+"01"+"-"+"01";
		//let previousYearToDate=(moment().year())+"-"+"12"+"-"+"31";
		let param = {
			previousYearFromDate: previousYearFromDate,
			previousYearToDate: previousYearToDate,
			where: { "subdistrictcode": accessArg['subdistrictcode'] },
			accessUpto: 'Block'
		}
		this.form1Service.getSubmittedFormsStatus(param).subscribe(Res => {
			this.isShowFormsStatusBlockwise = true
			this.formSubmittedStatusBlockwise = Res;
			this.changeDetectorRef.detectChanges();
		});
	}

	onChange(value) {
		this.selectedValue = value;
	}

	ngOnDestroy() {
		while (this.charts.length) {
			const chart = this.charts.pop();
			chart.dispose();
		}
	}

	//Ravi code start on 23-06-2021
	stateName = "";
	districtName = "";
	blockName = "";
	totalRecords = 0;
	isLoadingResults = true;
	isMaxLimitReached = false;
	dataSource: any;
	totalRecords1 = 0;
	isLoadingResults1 = true;
	isMaxLimitReached1 = false;
	readonly pageSize = 50;
	readonly pageSize1 = 50;
	getList() {
		let where: Partial<any>;
		let mon = moment().month() + 1;
		let day;
		let block_id, district_id, state_id;
		if (moment().date() >= 10) {
			day = moment().date();
		} else {
			day = "0" + moment().date();
		}
		if (this.currentUser.accessupto == "Block") {
			this.blockName = this.currentUser.user_block_id
				? this.currentUser.user_block_id.subdistrictname
				: undefined;
			this.stateName = this.currentUser.user_state_id
				? this.currentUser.user_state_id.statename
				: undefined;
			this.districtName = this.currentUser.user_district_id
				? this.currentUser.user_district_id.districtname
				: undefined;
			block_id = this.currentUser.user_block_id
				? this.currentUser.user_block_id
				: undefined;
		} else if (this.currentUser.accessupto == "District") {
			this.stateName = this.currentUser.user_state_id
				? this.currentUser.user_state_id.statename
				: undefined;
			this.districtName = this.currentUser.user_district_id
				? this.currentUser.user_district_id.districtname
				: undefined;
			district_id = this.currentUser.user_district_id
				? this.currentUser.user_district_id
				: undefined;
		} else if (this.currentUser.accessupto == "State") {
			this.stateName = this.currentUser.user_state_id
				? this.currentUser.user_state_id.statename
				: undefined;
			state_id = this.currentUser.user_state_id
				? this.currentUser.user_state_id
				: undefined;
		} else {
			this.stateName = "All States";
		}
		this.fromDate = moment(this.projectToDate).format("DD-MM-YYYY");
		this.toDate = day + "-" + mon + "-" + moment().year();

		where = {
			"place_of_death": this.place_of_death,
			"state_id.statecode": state_id ? state_id.statecode : undefined,
			"district_id.districtcode": district_id
				? district_id.districtcode
				: undefined,
			"block_id.subdistrictcode": block_id
				? block_id.subdistrictcode
				: undefined,
			updatedAt: { between: [moment(this.projectToDate), moment(new Date()).add('days', 1)] }
		};

		this.getTableFooterCount(where);

		merge(this.sort.sortChange, this.paginator.page)
			.pipe(
				startWith({}),
				switchMap(() => {
					this.isLoadingResults = true;
					return this.form1Service.getList({
						where: where,
						skip: this.paginator.pageIndex * this.pageSize,
						limit: this.pageSize,
						include: [{ relation: "village" }, { relation: "fileLibrary" }]
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
				this.dataSource = data;
				this.changeDetectorRef.detectChanges();
			});
	}

	getTableFooterCount(where: any) {
		this.form1Service.count(where).subscribe(({ count }) => {
			this.totalRecords = count;
			this.changeDetectorRef.detectChanges();
		});
	}

	toDateWithAddOneDay: any;
	dataSource1:any;
	getListForm5() {
		let mon = moment().month() + 1;
		let day;
		let block_id, district_id, state_id;
		if (moment().date() >= 10) {
			day = moment().date();
		} else {
			day = "0" + moment().date();
		}
		console.log('this.currentUser', this.currentUser);
		if (this.currentUser.accessupto == "Block") {
			this.blockName = this.currentUser.user_block_id.subdistrictname;
			this.stateName = this.currentUser.user_state_id.statename;
			this.districtName = this.currentUser.user_district_id.districtname;
			//state_id=this.currentUser.user_state_id.statecode;
			//district_id=this.currentUser.user_district_id.districtcode;
			block_id = this.currentUser.user_block_id.subdistrictcode;
		} else if (this.currentUser.accessupto == "District") {
			this.stateName = this.currentUser.user_state_id.statename;
			this.districtName = this.currentUser.user_district_id.districtname;
			district_id = this.currentUser.user_district_id.districtcode;
		} else if (this.currentUser.accessupto == "State") {
			this.stateName = this.currentUser.user_state_id.statename;
			state_id = this.currentUser.user_state_id.statecode;
		} else {
			this.stateName = "All States";
		}
		this.fromDate = moment(this.projectToDate).format("DD-MM-YYYY");
		this.toDate = day + "-" + mon + "-" + moment().year();
		this.toDateWithAddOneDay = moment().year() + "-" + mon + "-" + day;

		let where = {
			"generalinformation.state_id.statecode": state_id ? state_id : undefined,
			"generalinformation.district_id.subdistrictcode": district_id ? district_id : undefined,
			"generalinformation.block_id.subdistrictcode": block_id ? block_id : undefined,
			"updatedAt": { between: [(moment().year()-1) + "-" + mon + "-01", moment(this.toDateWithAddOneDay).add(1, 'days')] }
		}

		//this.getTableFooterCount(where);
		this.form5Service.getList({
			//	skip: this.paginator.pageIndex * this.pageSize,
			//	limit: this.pageSize,
			where: where,
			include: { relation: "mdsrForm1" } as any
		}).subscribe(response => {
			console.log('response', response);
			this.dataSource1 = response;
			this.changeDetectorRef.detectChanges();
		});
	}

	//END
}
