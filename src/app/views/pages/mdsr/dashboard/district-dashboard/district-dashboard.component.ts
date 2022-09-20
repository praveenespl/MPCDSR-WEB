import { Form4Service } from './../../../../../services/mdsr/form4.service';
import { filter } from 'rxjs/operators';
import { BlockService } from './../../../../../services/locality/block.service';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
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

import * as XLSX from "xlsx";
import { MatOption, MatTableDataSource } from '@angular/material';
am4core.useTheme(am4themes_animated);

@Component({
	selector: 'kt-district-dashboard',
	templateUrl: './district-dashboard.component.html',
	styleUrls: ['./district-dashboard.component.scss']
})
export class DistrictDashboardComponent implements OnInit {
	callingFrom = undefined;
	passingArgOnDistrictClick: any;
	mapChartDiv = 'fromDistrictLoginForBlockMap';
	activeTab = 'Current Month';
	isShowNotificationDetailTable = false;
	isShowMaternalDeathsDetails = false;
	fromDate;
	toDate;
	//maternal deaths notification array
	maternalDeathsNotification = [];
	blockwiseMaternalDeathsNotification = [];
	whereCbmdsrAndFbmdsrConductedInBlock: any;
	isShowBlockwiseDeathsDetailTable = false;
	blockwiseDetailsOfMaternalDeathsNotification: any;
	isShowBlockTable = false;
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
	filterForm: FormGroup;
	constructor(
		private zone: NgZone,
		private changeDetectorRef: ChangeDetectorRef,
		private form1Service: Form1Service,
		private alertService: AlertService,
		private fb: FormBuilder,
		private blockService: BlockService,
		private form4Service: Form4Service
	) { }
	day: any
	mon: any;
	block_id;
	district_id;
	state_id;
	blockList = [];
	countParam: {};
	topFilter: string = "all";

	topFilterChange(value) {
		this.topFilter = value;
	}

	ngOnInit() {
		this.fromDate = moment([2020, 0, 1]);
		this.toDate = moment();
		this.filterForm = this.createFilterForm();
		this.district_id = this.currentUser.user_district_id;
		if (this.currentUser.accessupto == "Block") {
			//	this.stateName=this.currentUser.state.statename;
			//	this.districtName=this.currentUser.district.districtname;
			this.block_id = this.currentUser.user_block_id;
			
			this.getBlocksData(this.block_id);
		} else if (this.currentUser.accessupto == "District") {
			//	this.stateName=this.currentUser.state.statename;
			//	this.districtName=this.currentUser.district.districtname;
			this.district_id = this.currentUser.user_district_id;
			this.getBlocksData(this.district_id);
			this.getSubmittedFormsStatusBlockwise(this.district_id);
		} else if (this.currentUser.accessupto == "State") {
			//this.stateName=this.currentUser.state.statename;
			this.state_id = this.currentUser.user_state_id;
			this.getBlocksData(this.state_id);
		} else {
			this.getBlocksData({});
			//this.stateName="All States";
		}

		// this.fromDate = "01" + "-" + mon + "-" + moment().year();
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
		this.countParam = {
			"state_id.statecode": this.state_id ? this.state_id.statecode : undefined,
			"district_id.districtcode": this.district_id ? this.district_id.districtcode : undefined,
			"block_id.subdistrictcode": this.block_id ? this.filterForm.value.subdistrictcode : undefined,
			updatedAt: {
				"$gte": this.fromDate,
				"$lte": moment(this.toDate).add(1, 'day')
			}
		}

		this.setTitle();

		this.getTopIndicatorData(this.countParam)
		this.getNotificationCount(this.countParam);
		this.getIcd10CodesCategorywise();
		this.getMaternalCauseOfdeathsFor6Months();
		this.blockService.getBlocks(this.district_id.districtcode).subscribe(res => {
			this.blockList = res;
			const subdistrictcodes: number[] = this.blockList.map(block => block.subdistrictcode);
			//for all state selection..
			subdistrictcodes.push(0);
			this.filterForm.patchValue({ subdistrictcodes })
		});
		this.fbmdrVsCbmdrGraph({ fromDate: this.fromDate, toDate: this.toDate, districtcodes: [this.district_id.districtcode], accessupto: this.currentUser.accessupto, type: "getSubDistricts" }); //totalCBOutOfFBMDSR
	}
	blockwiseMaternalDeathsNotificationDatasource;
	MaternalDeathsNotificationsDetails;
	getDetails(type, title) {
		const { subdistrictcodes, fromDate, toDate } = this.filterForm.value;
		this.MaternalDeathsNotificationsDetails = `${title} <small>${moment(fromDate).format("DD-MM-YYYY")}-${moment(toDate).format("DD-MM-YYYY")}</small>`
		let where = {

			"district_id.districtcode": { inq: [this.district_id.districtcode] },
			"block_id.subdistrictcode": subdistrictcodes && subdistrictcodes.length ? { inq: subdistrictcodes } : undefined,
			updatedAt: { between: [moment(fromDate), moment(toDate).add(1, 'day')] }
		} as any;
		if (type != "reportedDeath") {
			where.is_maternal_death = true;
		}
		this.form1Service.getList({ where, include: ["mdsrForm4s", "mdsrForm5s"] }).subscribe(res => {
			this.blockwiseMaternalDeathsNotification = res;
			if (type === 'reviewPending') {
				this.blockwiseMaternalDeathsNotification = this.blockwiseMaternalDeathsNotification.filter(item => item.mdsrForm5s && item.mdsrForm5s.length == 0);
			} else if (type === 'reviewCompleted') {
				this.blockwiseMaternalDeathsNotification = this.blockwiseMaternalDeathsNotification.filter(item => item.mdsrForm5s && item.mdsrForm5s.length > 0);
			}
			this.blockwiseMaternalDeathsNotificationDatasource = new MatTableDataSource(this.blockwiseMaternalDeathsNotification);
			//this.blockwiseMaternalDeathsNotificationDatasource.paginator = this.paginatorblockwiseMaternalDeathsNotification;
			this.isShowNotificationDetailTable = true;
			this.isShowMaternalDeathsDetails = true;
			this.changeDetectorRef.detectChanges();
		})
	}

	getTopIndicatorData(countParam) {
		this.form1Service.getDashboardData(countParam).subscribe(res => {
			this.indicatorDetails = res[0];
			this.changeDetectorRef.detectChanges();
		});
	}

	getNotificationCount(countParam) {
		this.form1Service.getNotificationCount(countParam).subscribe(res => {
			this.maternalDeathsNotification = [];
			if (res.length > 0) {
				this.maternalDeathsNotification = [];
				this.maternalDeathsNotification.push({
					cbmdsr: { count: res[0]['CB'], type: "CBMDSR" },
					fbmdsr: { count: res[0]['FB'], type: "FBMDSR" }
				})
				this.changeDetectorRef.detectChanges();
			}
			this.changeDetectorRef.detectChanges();
		});
	}

	createFilterForm() {
		return this.fb.group({
			subdistrictcodes: [],
			fromDate: [this.fromDate],
			toDate: [this.toDate]
		})
	}

	private maternalCausesYearOnYear() {
		this.zone.runOutsideAngular(() => {
			// CART 1
			const chart1 = am4core.create('chart1', am4charts.PieChart);
			//chart1.colors.list = colors;
			chart1.exporting.menu = new am4core.ExportMenu();
			chart1.exporting.dataFields = {
				"category": "Indirect Cause",
				"column-1": "Value"
			};
			chart1.innerRadius = am4core.percent(35);
			chart1.data = [
				{
					category: 'Dengue',
					'column-1': this.MaternalCauses.Dengue,
					color: am4core.color('#f34225')
				},
				{
					category: 'Respiratory Disorders',
					'column-1': this.MaternalCauses.RespiratoryDisorders,
					color: am4core.color('#f56528')
				},
				{
					category: 'HIV / AIDS',
					'column-1': this.MaternalCauses.HIV_AIDS,
					color: am4core.color('#fa9e30')
				},
				{
					category: 'H1N1 viral Disease',
					'column-1': this.MaternalCauses.H1N1ViralDisease,
					color: am4core.color('#fcd338')
				},
				{
					category: 'Malaria',
					'column-1': this.MaternalCauses.Malaria,
					color: am4core.color('#f3ee3c')
				},
				{
					category: 'Enhephalitis',
					'column-1': this.MaternalCauses.Enhephalitis,
					color: am4core.color('#b0de33')
				},
				{
					category: 'Other Indirect Causes',
					'column-1': this.MaternalCauses.OtherInDirectCauses,
					color: am4core.color('#68d42c')
				}
			];
			chart1.data = chart1.data.filter(item => item['column-1'] != 0)
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

			title1.text = 'Indirect Maternal Death Cause';
			title1.fontSize = 15;

			this.charts.push(chart1);

			// CART 2
			const chart2 = am4core.create('chart2', am4charts.PieChart);
			//chart2.colors.list = colors;
			chart2.exporting.menu = new am4core.ExportMenu();
			chart2.exporting.dataFields = {
				"category": "Dierct Cause",
				"column-1": "Value"
			};
			chart2.innerRadius = am4core.percent(35);

			chart2.data = [
				{
					category: 'Abortion',
					'column-1': this.MaternalCauses.abortion,
					color: am4core.color('#f34225')
				},
				{
					category: 'Hypertension',
					'column-1': this.MaternalCauses.Hypertension,
					color: am4core.color('#f56528')
				},
				{
					category: 'Sepsis',
					'column-1': this.MaternalCauses.sepsis,
					color: am4core.color('#fa9e30')
				},
				{
					category: 'Hemorrhage',
					'column-1': this.MaternalCauses.haemorrhage,
					color: am4core.color('#fcd338')
				},
				{
					category: 'Obstructive Labour',
					'column-1': this.MaternalCauses.obstructedLabour,
					color: am4core.color('#f3ee3c')
				},
				{
					category: 'Other Direct Causes',
					'column-1': this.MaternalCauses.OtherDirectCause,
					color: am4core.color('#68d42c')
				}
			];

			chart2.data = chart2.data.filter(item => item['column-1'] != 0)

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

			title2.text = 'Direct Maternal Death Cause';
			title2.fontSize = 15;

			this.charts.push(chart2);
		});
	}

	getNotificationDetails(arg, title) {
		const { subdistrictcodes, fromDate, toDate } = this.filterForm.value;
		this.MaternalDeathsNotificationsDetails = `${title} <small>${this.fromDate.format("DD-MM-YYYY")}-${this.toDate.format("DD-MM-YYYY")}</small>`
		this.isShowNotificationDetailTable = false;
		this.isShowMaternalDeathsDetails = false;
		let whereParam = {};//this.where;
		whereParam = {
			"state_id.statecode": this.state_id ? this.state_id.statecode : undefined,
			"district_id.districtcode": this.district_id ? this.district_id.districtcode : undefined,
			"block_id.subdistrictcode": subdistrictcodes && subdistrictcodes.length ? { $in: subdistrictcodes } : undefined,
			updatedAt: {
				"$gte": moment(fromDate),
				"$lte": moment(toDate).add(1, 'day')
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

	getIcd10CodesCategorywise() {
		const { fromDate, toDate, subdistrictcodes } = this.filterForm.value;
		let param = {
			fromDate,
			toDate,
			//statecodes: [this.state_id.statecode],
			districtcodes: [this.district_id.districtcode],
			subdistrictcodes,
			accessUpto: this.currentUser.accessupto
		}

		this.form1Service.getMaternalCauseOfdeaths(param).subscribe(getMatRes => {
			this.MaternalCauses = getMatRes[0];
			this.maternalCausesYearOnYear();
			this.changeDetectorRef.detectChanges();
		});

	}

	getMaternalCauseOfdeathsFor6Months() {
		const { fromDate, toDate, subdistrictcodes } = this.filterForm.value;
		let datesArray = [];
		const monthDifference = moment(toDate).diff(moment(fromDate), 'months', false);
		for (let i = 0; i <= monthDifference; i++) {
			datesArray.push({
				fromDate: moment(fromDate).add(i, "months").startOf("month").format("YYYY-MM-DD"),
				toDate: moment(fromDate).add(i, "months").endOf("month").format("YYYY-MM-DD"),
				month: moment(fromDate).add(i, "months").format("MM"),
				year: moment(fromDate).add(i, "months").format("YYYY"),
			});
		}
		let param = {
			datesArray,
			fromDate,
			toDate,
			districtcodes: [this.district_id.districtcode],
			subdistrictcodes,
			accessUpto: this.currentUser.accessupto
		}
		this.form1Service.getMaternalCauseOfdeathsFor6Months(param).subscribe(Res6monthsData => {
			this.GraphMaternalCausesLast6Month = Res6monthsData;
			this.drawGraphMaternalCausesLast6Month();;
			this.changeDetectorRef.detectChanges();
		});
	}

	drawGraphMaternalCausesLast6Month() {
		// CART 4
		const chart4 = am4core.create('chart4', am4charts.XYChart);
		chart4.paddingRight = 20;
		const colors = [
			am4core.color('#f56528'),
			am4core.color('#fcd338'),
			am4core.color('#b0de33'),
			am4core.color('#0d8ecf'),
			am4core.color('#ab47bc'),
			am4core.color('#7e57c2'),
			am4core.color('#26a69a')
		];
		chart4.colors.list = colors;
		chart4.exporting.menu = new am4core.ExportMenu();

		// Create axes
		var dateAxis = chart4.xAxes.push(new am4charts.DateAxis());
		dateAxis.renderer.minGridDistance = 50;
		dateAxis.renderer.grid.template.location = 0.5;
		dateAxis.startLocation = 0.5;
		dateAxis.endLocation = 0.5;

		// Create value axis

		chart4.legend = new am4charts.Legend();
		chart4.legend.align = 'center';
		chart4.legend.fontSize = 12;

		chart4.legend.markers.template.marginRight = 2;
		chart4.legend.markers.template.width = 16;
		chart4.legend.markers.template.height = 16;

		chart4.cursor = new am4charts.XYCursor();
		chart4.cursor.tooltipText = 'test';

		var valueAxis = chart4.yAxes.push(new am4charts.ValueAxis());
		valueAxis.min = 0;
		valueAxis.title.text = "Total MDs";

		const chart4data = this.GraphMaternalCausesLast6Month;

		var xySeries201 = chart4.series.push(new am4charts.LineSeries());
		xySeries201.dataFields.valueY = 'column-1';
		xySeries201.dataFields.dateX = 'category';
		xySeries201.strokeWidth = 3;
		xySeries201.tensionX = 0.8;
		xySeries201.bullets.push(new am4charts.CircleBullet());
		xySeries201.data = chart4data;
		xySeries201.name = 'Abortion';
		xySeries201.tooltipText = '{name}: [bold]{valueY}[/]';
		xySeries201.strokeWidth = 1;

		var xySeries202 = chart4.series.push(new am4charts.LineSeries());
		xySeries202.dataFields.valueY = 'column-2';
		xySeries202.dataFields.dateX = 'category';
		xySeries202.strokeWidth = 3;
		xySeries202.tensionX = 0.8;
		xySeries202.bullets.push(new am4charts.CircleBullet());
		xySeries202.data = chart4data;
		xySeries202.name = 'Hypertension';
		xySeries202.tooltipText = '{name}: [bold]{valueY}[/]';
		xySeries202.strokeWidth = 1;

		var xySeries3 = chart4.series.push(new am4charts.LineSeries());
		xySeries3.dataFields.valueY = 'column-3';
		xySeries3.dataFields.dateX = 'category';
		xySeries3.strokeWidth = 3;
		xySeries3.tensionX = 0.8;
		xySeries3.bullets.push(new am4charts.CircleBullet());
		xySeries3.data = chart4data;
		xySeries3.name = 'Sepsis';
		xySeries3.tooltipText = '{name}: [bold]{valueY}[/]';
		xySeries3.strokeWidth = 1;

		var xySeries4 = chart4.series.push(new am4charts.LineSeries());
		xySeries4.dataFields.valueY = 'column-4';
		xySeries4.dataFields.dateX = 'category';
		xySeries4.strokeWidth = 3;
		xySeries4.tensionX = 0.8;
		xySeries4.bullets.push(new am4charts.CircleBullet());
		xySeries4.data = chart4data;
		xySeries4.name = 'Hemorrhage';
		xySeries4.tooltipText = '{name}: [bold]{valueY}[/]';
		xySeries4.strokeWidth = 1;

		var xySeries5 = chart4.series.push(new am4charts.LineSeries());
		xySeries5.dataFields.valueY = 'column-5';
		xySeries5.dataFields.dateX = 'category';
		xySeries5.strokeWidth = 3;
		xySeries5.tensionX = 0.8;
		xySeries5.bullets.push(new am4charts.CircleBullet());
		xySeries5.data = chart4data;
		xySeries5.name = 'Embolism';
		xySeries5.tooltipText = '{name}: [bold]{valueY}[/]';
		xySeries5.strokeWidth = 1;

		var xySeries6 = chart4.series.push(new am4charts.LineSeries());
		xySeries6.dataFields.valueY = 'column-6';
		xySeries6.dataFields.dateX = 'category';
		xySeries6.strokeWidth = 3;
		xySeries6.tensionX = 0.8;
		xySeries6.bullets.push(new am4charts.CircleBullet());
		xySeries6.data = chart4data;
		xySeries6.name = 'IndirectCause';
		xySeries6.tooltipText = '{name}: [bold]{valueY}[/]';
		xySeries6.strokeWidth = 1;

		var xySeries7 = chart4.series.push(new am4charts.LineSeries());
		xySeries7.dataFields.valueY = 'column-7';
		xySeries7.dataFields.dateX = 'category';
		xySeries7.strokeWidth = 3;
		xySeries7.tensionX = 0.8;
		xySeries7.bullets.push(new am4charts.CircleBullet());
		xySeries7.data = chart4data;
		xySeries7.name = 'Other Direct Causes';
		xySeries7.tooltipText = '{name}: [bold]{valueY}[/]';
		xySeries7.strokeWidth = 1;

		this.charts.push(chart4);

	}

	selectedValueMDsFacilityVsHomeVsTransit: string = "percentWise";

	onChangeFacilityVsHomeVsTransit(value) {
		this.selectedValueMDsFacilityVsHomeVsTransit = value;
	}

	getBlocksData(accessArg) {
		
		const { subdistrictcodes, fromDate, toDate } = this.filterForm.value;

		this.passingArgOnDistrictClick = accessArg;
		this.whereCbmdsrAndFbmdsrConductedInBlock = [];
		let previousYearFromDate = moment(fromDate);
		let previousYearToDate = moment(toDate);
		let param = {
			previousYearFromDate: previousYearFromDate,
			previousYearToDate: previousYearToDate,
			where: { ...accessArg },
			accessUpto: this.currentUser.accessupto
		}
		this.form1Service.getDeathsWhereCbmdsrAndFbmdsrConducted(param).subscribe(Res => {

			Res.sort(function (a, b) {
				var whereFBMDSRConductedA = a['category']
				var whereFBMDSRConductedB = b['category']
				return (whereFBMDSRConductedA > whereFBMDSRConductedB) ? 1 : (whereFBMDSRConductedA < whereFBMDSRConductedB) ? -1 : 0;
			});
			this.isShowBlockTable = true;

			if (subdistrictcodes && subdistrictcodes.length) {
				this.whereCbmdsrAndFbmdsrConductedInBlock = Res.filter(block => subdistrictcodes.includes(block.subdistrictcode));
			} else {
				this.whereCbmdsrAndFbmdsrConductedInBlock = Res;
			}

			this.changeDetectorRef.detectChanges();
		});
	}

	getBlockswiseDeathsData(arg) {
		const { fromDate, toDate } = this.filterForm.value;
		this.isShowBlockwiseDeathsDetailTable = false;
		let whereParam = {};//this.where;
		whereParam = {
			updatedAt: {
				"$gte": moment(fromDate),
				"$lte": moment(toDate).add(1, 'day')
			}
		}
		if (arg.type == "CBMDSR") {
			whereParam['place_of_death'] = { '$in': ["Home", "Transit", "Other"] }
		} else if (arg.type == "FBMDSR") {
			whereParam['place_of_death'] = { '$in': ["Health Facility"] }
		}
		whereParam['block_id.subdistrictcode'] = arg.subdistrictcode;
		this.form1Service.getNotificationDetails(whereParam).subscribe(res => {
			this.blockwiseDetailsOfMaternalDeathsNotification = res;
			this.isShowBlockwiseDeathsDetailTable = true;
			this.changeDetectorRef.detectChanges();
		});
	}

	formSubmittedStatusBlockwise: any
	isShowFormsStatusBlockwise = false;
	getSubmittedFormsStatusBlockwise(accessArg) {

		this.isShowFormsStatusBlockwise = false;
		const { subdistrictcodes, fromDate, toDate } = this.filterForm.value;
		let previousYearFromDate = moment(fromDate);
		let previousYearToDate = moment(toDate).add(1, 'day');
		let param = {
			previousYearFromDate: previousYearFromDate,
			previousYearToDate: previousYearToDate,
			where: { "districtcode": accessArg['districtcode'], "subdistrictcodes": subdistrictcodes && subdistrictcodes.length ? subdistrictcodes : undefined },
			accessUpto: 'District'
		}
		
		this.form1Service.getSubmittedFormsStatus(param).subscribe(Res => {
			this.isShowFormsStatusBlockwise = true
			this.formSubmittedStatusBlockwise = Res;
			this.changeDetectorRef.detectChanges();
		});
	}

	ngAfterViewInit() {
		//this.createChart();
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


	ExportTableMDBlock(val) {
		if (val == 1) {
			let dataToExport = this.whereCbmdsrAndFbmdsrConductedInBlock.map((x) => ({

				"Block": x.category,
				"# Total CBMDSR": x['column-2'],
				"# Total FBMDSR": x['column-1'],
				"# Total MDs": x['totalMDs'],
				"# Reported (15-49)": x['reported'],
			}));
			const workSheet = XLSX.utils.json_to_sheet(dataToExport);
			const workBook: XLSX.WorkBook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workBook, workSheet, "Maternal Deaths Statewise");
			XLSX.writeFile(workBook, "Maternal Deaths Statewise.xlsx");
		}

	}

	ExportTableMD(val) {
		if (val == 1) {
			let dataToExport = this.blockwiseDetailsOfMaternalDeathsNotification.map((x) => ({

				"Block": x.block_id.subdistrictname,
				//"Village" :x.village_id.villagename,
				"Deseased Name": x.deceased_women_fname + x.deceased_women_lname + x.deceased_women_mname,
				"Deseased Husband Name": x.husband_name,
				"Place of Death": x.place_of_death,
				"Date and Time of Death": x.death_date_time,
			}));

			const workSheet = XLSX.utils.json_to_sheet(dataToExport);
			const workBook: XLSX.WorkBook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workBook, workSheet, "Blockwise Maternal Deaths");
			XLSX.writeFile(workBook, "Blockwise Maternal Deaths.xlsx");
		}
	}

	CBMDSRFBMDSRMDExportTable(val) {
		if (val == 1) {
			let dataToExport = this.formSubmittedStatusBlockwise.cbmdsrFormsStatus.map((x) => ({

				"Block": x.subdistrictname,
				"Form 3": x.form1,
				"Form 5": x.form5,
				"Form 6": x.form6,
				"# (form 5/ form 3)*100": (x.form5 / x.form1) * 100
			}));

			const workSheet = XLSX.utils.json_to_sheet(dataToExport);
			const workBook: XLSX.WorkBook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workBook, workSheet, "CBMDSR Maternal Deaths");
			XLSX.writeFile(workBook, "CBMDSR Maternal Deaths.xlsx");
		} else if (val == 2) {
			let dataToExport = this.formSubmittedStatusBlockwise.fbmdsrFormsStatus.map((x) => ({

				"Block": x.subdistrictname,
				"Form 3": x.form1,
				"Form 4": x.form4,
				"Form 6": x.form6,
				"# (form 4/ form 3)*100": (x.form4 / x.form1) * 100
			}));

			const workSheet = XLSX.utils.json_to_sheet(dataToExport);
			const workBook: XLSX.WorkBook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workBook, workSheet, "FBMDSR Maternal Deaths");
			XLSX.writeFile(workBook, "FBMDSR Maternal Deaths.xlsx");
		}
	}

	forBlockwiseMaternalDeathsNotificationExportTable(val) {
		let dataToExport = this.blockwiseMaternalDeathsNotification.map((x) => ({

			"Block": x.block_id.subdistrictname,
			//"Village": x.village_id.villagename,
			"Deceased Women Name": x.deceased_women_fname,
			"Husband Name": x.husband_name,
			"Place of Death": x.place_of_death,
			"Death Date Time": x.death_date_time,
		}));
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "Blockwise Maternal Deaths Notification.xlsx");
	}

	@ViewChild('allSelected', { static: false }) private allSelected: MatOption;

	tosslePerOne(all) {
		if (this.allSelected.selected) {
			this.allSelected.deselect();
			this.filterChange();
			return false;
		}
		if (this.filterForm.value.subdistrictcodes.length == this.blockList.length) {
			this.allSelected.select();
		}
		this.filterChange();

	}

	toggleAllSelection() {
		if (this.allSelected.selected) {
			const subdistrictcodes: number[] = this.blockList.map(subdistrict => subdistrict.subdistrictcode);
			subdistrictcodes.push(0);
			this.filterForm.controls.subdistrictcodes.patchValue(subdistrictcodes);
		} else {
			this.filterForm.patchValue({ subdistrictcodes: [] })
		}
		this.filterChange();
	}

	filterChange() {
		const { subdistrictcodes, fromDate, toDate } = this.filterForm.value;
		this.fromDate = fromDate;
		this.toDate = toDate;
		let obj = { ...this.countParam, "block_id.subdistrictcode": subdistrictcodes && subdistrictcodes.length ? { $in: subdistrictcodes } : undefined, updatedAt: { "$gte": fromDate, "$lte": moment(toDate).add(1, 'day') } }
		this.fbmdrVsCbmdrGraph({ fromDate: this.fromDate, toDate: this.toDate, districtcodes: [this.district_id.districtcode], subdistrictcodes, accessupto: this.currentUser.accessupto, type: "getSubDistricts" }); //totalCBOutOfFBMDSR
		this.getTopIndicatorData(obj);
		this.getNotificationCount(obj)
		this.getSubmittedFormsStatusBlockwise(this.district_id);;
		this.getBlocksData({ ...this.district_id, subdistrictcodes: subdistrictcodes && subdistrictcodes.length ? subdistrictcodes : undefined })
		this.setTitle()
		// this.getSubmittedFormsStatusDistrictwise({ statecode: this.state_id.statecode, districtcodes });
		// this.getDeathsWhereCbmdsrAndFbmdsrConducted(this.state_id);
		// this.getMaternalCauseOfdeathsFor6Months();
		//this.getIcd10CodesCategorywise();
		// this.setTitle()
		this.isShowMaternalDeathsDetails = false;
		this.isShowFormsStatusBlockwise = false;
		//this.isShowFormsStatusDistrictwise = false;

	}


	MaternalDeathsBlockwiseTabularViewTitle: string;
	CBMDSRMaternalDeathsFormsStatusBlockwiseTitle: string;
	FBMDSRMaternalDeathsFormsStatusBlockwiseTitle: string;

	MDsAtFacilityVsTransitVsHomeVsOtherTitle: string;
	MajorCausesOfMaternalDeathsDataTitle: string;


	OutofTotalFBMDSRCasesHowManyCBMDSRAreCompleted: string;
	OutofTotalFBMDSRCasesHowManyCBMDSRAreCompletedInPer: string;

	monthOnMonthTitle: string;

	blockwiseDetailsTitle: string;

	setTitle() {
		this.MaternalDeathsBlockwiseTabularViewTitle = `Maternal Deaths Blockwise - Tabular View <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`
		this.blockwiseDetailsTitle = `Blockwise Maternal Deaths Details - <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;

		this.CBMDSRMaternalDeathsFormsStatusBlockwiseTitle = `CBMDSR Maternal Deaths Forms Status Blockwise <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.FBMDSRMaternalDeathsFormsStatusBlockwiseTitle = `FBMDSR Maternal Deaths Forms Status Blockwise <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.MajorCausesOfMaternalDeathsDataTitle = `Major Causes of Maternal Death\'s data <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.monthOnMonthTitle = `Maternal Causes of Deaths (Month on Month) <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;

		this.MDsAtFacilityVsTransitVsHomeVsOtherTitle = `MDs at Facility vs Transit vs Home Vs Other <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;


		this.OutofTotalFBMDSRCasesHowManyCBMDSRAreCompleted = `Out of Total FBMDSR Cases, How Many CBMDSR Are Completed <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.OutofTotalFBMDSRCasesHowManyCBMDSRAreCompletedInPer = `Out of Total FBMDSR Cases, How Many CBMDSR Are Completed in % <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;

	}

	selectedValueCBFBMDSR = "percentWise";
	onChangeCBFBMDSR(value) {
		this.selectedValueCBFBMDSR = value;
		this.totalCBOutOfFBMDSR();
	}
	stateDataCBOutOfFBMDSR = [];
	private totalCBOutOfFBMDSR() {
		this.zone.runOutsideAngular(() => {
			// Expected Vs Actual Maternal Death
			var chart = am4core.create('totalCBOutOfFBMDSR', am4charts.XYChart);

			chart.exporting.menu = new am4core.ExportMenu();
			chart.legend = new am4charts.Legend()
			chart.legend.position = 'top'
			chart.legend.paddingBottom = 10
			chart.legend.labels.template.maxWidth = 95;

			chart.logo.disabled = true;
			chart.colors.list = [
				am4core.color("#007bff"),
				am4core.color("#ffb822")
			];
			// Add data
			chart.data = this.stateDataCBOutOfFBMDSR;

			// Create axes
			var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.dataFields.category = "subdistrictname";
			categoryAxis.renderer.grid.template.location = 0;
			categoryAxis.renderer.minGridDistance = 20;
			categoryAxis.title.text = "";
			let label = categoryAxis.renderer.labels.template;
			label.truncate = true;
			label.maxWidth = 150;
			label.tooltipText = '{category}';
			categoryAxis.events.on('sizechanged', function (ev) {
				let axis = ev.target;
				var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
				if (cellWidth < axis.renderer.labels.template.maxWidth) {
					axis.renderer.labels.template.rotation = 0;
					axis.renderer.labels.template.horizontalCenter = 'right';
					axis.renderer.labels.template.verticalCenter = 'middle';
				} else {
					axis.renderer.labels.template.rotation = 0;
					axis.renderer.labels.template.horizontalCenter = 'middle';
					axis.renderer.labels.template.verticalCenter = 'top';
				}
			});

			var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.min = 0;
			valueAxis.title.text = "Maternal Deaths";

			// Create series
			function createSeries1(field, name, stacked, selectedValue) {
				var series = chart.series.push(new am4charts.ColumnSeries());
				series.dataFields.valueY = field;
				series.dataFields.categoryX = "subdistrictname";
				series.name = name;
				if (selectedValue === 'percentWise') {
					series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]%";
				} else {
					series.columns.template.tooltipText = "{name}: [bold]{valueY}";
				}
				series.stacked = stacked;
				series.columns.template.column.cornerRadiusTopLeft = 5;
				series.columns.template.column.cornerRadiusTopRight = 5;

				let bullet = series.bullets.push(new am4charts.LabelBullet())
				bullet.interactionsEnabled = false
				bullet.dy = -10;
				if (selectedValue == 'percentWise') {
					bullet.label.text = '{valueY}%'
				} else {
					bullet.label.text = '{valueY}'
				}
				bullet.label.fill = am4core.color('#000000');
				bullet.label.fontWeight = 'bold';

				series.columns.template.adapter.add("fill", function (fill, target) {
					if (target.dataItem['categoryX'] == 'Ind') {
						if (name === 'CBMDR') {
							return am4core.color("#ff7043");
						}
						return am4core.color("#ffbb93");
					} else {
						return fill;
					}
				});

				series.columns.template.adapter.add("stroke", function (fill, target) {
					if (target.dataItem['categoryX'] == 'Ind') {
						if (name === 'CBMDR') {
							return am4core.color("#ff7043");
						}
						return am4core.color("#ffbb93");
					} else {
						return fill;
					}
				});
			}

			if (this.selectedValueCBFBMDSR === 'percentWise') {
				createSeries1("percent", "Percentage", false, this.selectedValueCBFBMDSR);
			} else {
				createSeries1("fbmdr", "FBMDR", false, this.selectedValueCBFBMDSR);
				createSeries1("cbmdr", "CBMDR", false, this.selectedValueCBFBMDSR);
				this.changeDetectorRef.detectChanges();
			}
			// Cursor
			chart.cursor = new am4charts.XYCursor();
			//scrollbar
			chart.scrollbarX = new am4core.Scrollbar();
			chart.scrollbarX.thumb.minWidth = 50;

			this.charts.push(chart);
		})
	}

	fbmdrVsCbmdrGraph(params) {
		let obj = {
			cbmdr: 0,
			code: "Ind",
			fbmdr: 0,
			name: "India",
			percent: 0,
			statecode: 0
		}

		this.form4Service.fbmdrVsCbmdrSubmitted(params).subscribe(data => {
			this.stateDataCBOutOfFBMDSR = data;
			if (this.stateDataCBOutOfFBMDSR && this.stateDataCBOutOfFBMDSR) {
				this.stateDataCBOutOfFBMDSR.forEach(element => {
					obj.cbmdr += element.cbmdr;
					obj.fbmdr += element.fbmdr;
				});
				obj.percent = obj.fbmdr ? Math.round((obj.cbmdr / obj.fbmdr) * 100) : 0;
			}
			this.totalCBOutOfFBMDSR()
		})
	}

}
