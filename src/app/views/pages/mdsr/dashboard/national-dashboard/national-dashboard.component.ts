import { FormBuilder, FormGroup } from '@angular/forms';
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
import Swal from 'sweetalert2';
import { MatTableDataSource, MatPaginator, MatSort, MatOption } from '@angular/material';
am4core.useTheme(am4themes_animated);
import * as XLSX from "xlsx";
import { StateService } from "../../../../../services/locality/state.service";
import { Form4Service } from '../../../../../services/mdsr/form4.service';
import { add, round } from 'lodash';
@Component({
	selector: 'kt-national-dashboard',
	templateUrl: './national-dashboard.component.html',
	styleUrls: ['./national-dashboard.component.scss']
})
export class NationalDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
	callingFrom = undefined;
	mapChartDiv = 'states';
	activeTab = 'Current Month';
	private charts: Array<any> = [];
	currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
	isShowNotificationDetailTable = false;
	isShowMaternalDeathsDetails = false;
	showProcessingForStateMap = true;
	data1 = [{ state: 'Assam', md: 23, dnotreviwed: 3 }, { state: 'Punjab', 'md': 45, dnotreviwed: 5 }, { state: 'West Bengal', md: 27, dnotreviwed: 7 }];
	data2 = [{ state: 'Assam', 'district': 'Baksa', md: 1, dnotreviwed: 0 },
	{ state: 'Assam', 'district': 'Barpeta', md: 3, dnotreviwed: 1 },
	{ state: 'Punjab', district: 'Barnala', 'md': 5, dnotreviwed: 0 },
	{ state: 'Punjab', district: 'Bhatinda', 'md': 5, dnotreviwed: 1 },
	{ state: 'Punjab', district: 'Fazlika', 'md': 3, dnotreviwed: 0 },
	{ state: 'West Bengal', district: 'Bankura', md: 5, dnotreviwed: 1 },
	{ state: 'West Bengal', district: 'Dinajpur Uttar', md: 3, dnotreviwed: 0 },
	{ state: 'West Bengal', district: 'Hawrah', md: 3, dnotreviwed: 0 }];
	data3 = [
		{ state: 'Assam', 'district': 'Barpeta', md: 10, dnotreviwed: 1 },
		{ state: 'Punjab', district: 'Barnala', 'md': 15, dnotreviwed: 0 },
		{ state: 'Punjab', district: 'Bhatinda', 'md': 25, dnotreviwed: 2 },
		{ state: 'Punjab', district: 'Fazlika', 'md': 13, dnotreviwed: 0 },
		{ state: 'West Bengal', district: 'Bankura', md: 12, dnotreviwed: 1 },
		{ state: 'West Bengal', district: 'Dinajpur Uttar', md: 11, dnotreviwed: 0 },
		{ state: 'West Bengal', district: 'Hawrah', md: 12, dnotreviwed: 0 }];

	topFilter: string = "all";

	topFilterChange(value) {
		this.topFilter = value;
	}

	whereCbmdsrAndFbmdsrConductedDatasource: MatTableDataSource<any>;
	@ViewChild("paginatorWhereCbmdsrAndFbmdsrConductedDatasource", { static: true }) paginatorWhereCbmdsrAndFbmdsrConductedDatasource: MatPaginator;
	@ViewChild(MatSort, { static: true }) sortWhereCbmdsrAndFbmdsrConductedDatasource: MatSort;
	displayedColumnsWhereCbmdsrAndFbmdsrConductedDatasource: string[] = ['sn', 'category', 'reported', 'totalMDs', 'column-2', 'column-1'];
	whereCbmdsrAndFbmdsrConductedInDistrictDatasource: MatTableDataSource<any>;
	displayedColumnsWhereCbmdsrAndFbmdsrConductedDatasource1: string[] = ['sn', 'state', 'md', 'dnotreviwed'];//'dnotreviwed'

	displayedColumnsWhereCbmdsrAndFbmdsrConductedDatasource2: string[] = ['sn', 'state', 'district', 'md', 'dnotreviwed'];//,'dnotreviwed'

	@ViewChild("paginatorwhereCbmdsrAndFbmdsrConductedInDistrict", { static: true }) paginatorwhereCbmdsrAndFbmdsrConductedInDistrict: MatPaginator;
	displayedColumnsWhereCbmdsrAndFbmdsrConductedInDistrict: string[] = ['sn', 'category', 'column-2', 'column-1'];
	whereCbmdsrAndFbmdsrConductedInBlockDatasource: MatTableDataSource<any>;
	@ViewChild("paginatorwhereCbmdsrAndFbmdsrConductedInBlock", { static: true }) paginatorwhereCbmdsrAndFbmdsrConductedInBlock: MatPaginator;
	displayedColumnswhereCbmdsrAndFbmdsrConductedInBlock: string[] = ['sn', 'category', 'reported', 'totalMDs', 'column-2', 'column-1'];
	blockwiseDetailsOfMaternalDeathsNotificationDatasource: MatTableDataSource<any>;
	@ViewChild("paginatorblockwiseDetailsOfMaternalDeathsNotification", { static: true }) paginatorblockwiseDetailsOfMaternalDeathsNotification: MatPaginator;
	displayedColumnsblockwiseDetailsOfMaternalDeathsNotification: string[] = ['sn', 'districtname', 'subdistrictname', 'villagename', 'deceased_women_name', 'husband_name', 'place_of_death', 'death_date_time'];
	dataSourceformSubmittedStatus: MatTableDataSource<any>;
	@ViewChild("paginatordataSourceformSubmittedStatus", { static: true }) paginatordataSourceformSubmittedStatus: MatPaginator;
	displayedColumnsFordataSourceformSubmittedStatus: string[] = ['sn', 'statename', 'form1', 'form5', 'form6', 'finalStatus1'];
	dataSourceformSubmittedStatusFbmdsr: MatTableDataSource<any>;
	@ViewChild("paginatordataSourceformSubmittedStatusFbmdsr", { static: true }) paginatordataSourceformSubmittedStatusFbmdsr: MatPaginator;
	displayedColumnsFordataSourceformSubmittedStatusFbmdsr: string[] = ['sn', 'statename', 'form1', 'form4', 'form6', 'per'];

	dataSourceformSubmittedStatusCbmdsrDistritwise: MatTableDataSource<any>;
	@ViewChild("paginatordataSourceformSubmittedStatusCbmdsrDistritwise", { static: true }) paginatordataSourceformSubmittedStatusCbmdsrDistritwise: MatPaginator;
	displayedColumnsFordataSourceformSubmittedStatusCbmdsrDistritwise: string[] = ['sn', 'districtname', 'form1', 'form5', 'form6', 'per'];
	dataSourceformSubmittedStatusFbmdsrDistritwise: MatTableDataSource<any>;
	@ViewChild("paginatordataSourceformSubmittedStatusFbmdsrDistritwise", { static: true }) paginatordataSourceformSubmittedStatusFbmdsrDistritwise: MatPaginator;
	displayedColumnsFordataSourceformSubmittedStatusFbmdsrDistritwise: string[] = ['sn', 'districtname', 'form1', 'form4', 'form6', 'per'];

	dataSourceformSubmittedStatusCbmdsrBlockwise: MatTableDataSource<any>;
	@ViewChild("paginatordataSourceformSubmittedStatusCbmdsrBlockwise", { static: true }) paginatordataSourceformSubmittedStatusCbmdsrBlockwise: MatPaginator;
	displayedColumnsFordataSourceformSubmittedStatusCbmdsrBlockwise: string[] = ['sn', 'subdistrictname', 'form1', 'form5', 'form6', 'per'];
	dataSourceformSubmittedStatusFbmdsrBlockwise: MatTableDataSource<any>;
	@ViewChild("paginatordataSourceformSubmittedStatusFbmdsrBlockwise", { static: true }) paginatordataSourceformSubmittedStatusFbmdsrBlockwise: MatPaginator;
	displayedColumnsFordataSourceformSubmittedStatusFbmdsrBlockwise: string[] = ['sn', 'subdistrictname', 'form1', 'form4', 'form6', 'per'];

	stateDatasource: MatTableDataSource<any>;
	@ViewChild("paginatorstateDatasource", { static: true }) paginatorstateDatasource: MatPaginator;
	displayedColumnsstateDatasource: string[] = ['sn', 'statename', 'estimated', 'actual'];

	blockwiseMaternalDeathsNotificationDatasource: MatTableDataSource<any>;
	@ViewChild("paginatorblockwiseMaternalDeathsNotification", { static: true }) paginatorblockwiseMaternalDeathsNotification: MatPaginator;
	displayedColumnsblockwiseMaternalDeathsNotification: string[] = ['sn', 'statename', 'districtname', 'subdistrictname', 'villagename', 'deceased_women_name', 'husband_name', 'place_of_death', 'death_date_time'];


	stateData = [];
	indicatorDetails: any;
	isShowState = true;
	isShowDistrict = false;
	isShowDistrictMapAndTable = false;
	stateDataCBOutOfFBMDSR = [];
	fromDate;
	toDate;

	//maternal deaths notification array
	maternalDeathsNotification = [];
	blockwiseMaternalDeathsNotification = []

	stackFilter = {};
	filterForm: FormGroup;
	selectedValue: string = "percentWise";
	selectedValueCBFBMDSR: string = "percentWise";
	selectedValueMDsFacilityVsHomeVsTransit: string = "percentWise";
	where: any;
	placeofDeath;
	block_id; district_id; state_id;
	countParam: any;
	stateList = [];

	constructor(
		private zone: NgZone,
		private changeDetectorRef: ChangeDetectorRef,
		private form1Service: Form1Service,
		private form4Service: Form4Service,
		private fb: FormBuilder,
		private stateService: StateService
	) {
	}


	private maternalCausesYearOnYear() {
		this.zone.runOutsideAngular(() => {
			// CART 2
			const chart2 = am4core.create('chart2', am4charts.PieChart3D);
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

			var pieSeries = chart2.series.push(new am4charts.PieSeries3D());
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

			title2.text = 'Direct Maternal Death Causes';
			title2.fontSize = 15;

			this.charts.push(chart2);

			// CART 5
			const chart5 = am4core.create('chart5', am4charts.PieChart3D);
			//chart5.colors.list = colors;

			chart5.exporting.menu = new am4core.ExportMenu();
			chart5.exporting.dataFields = {
				"category": "Indierct Cause",
				"column-1": "Value"
			};
			chart5.innerRadius = am4core.percent(35);

			chart5.data = [
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
			chart5.data = chart5.data.filter(item => item['column-1'] != 0)
			var pieSeries = chart5.series.push(new am4charts.PieSeries3D());
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

			chart5.legend = new am4charts.Legend();
			chart5.legend.align = 'center';
			chart5.legend.fontSize = 12;
			chart5.legend.labels.template.text = '{category}';
			chart5.legend.valueLabels.template.text = '';

			chart5.legend.markers.template.marginRight = 2;
			chart5.legend.markers.template.width = 16;
			chart5.legend.markers.template.height = 16;

			const title5 = chart5.titles.create();

			title5.text = 'Indirect Maternal Death Causes';
			title5.fontSize = 15;

			this.charts.push(chart5);

		});
	}

	private expectedVsActual() {
		this.zone.runOutsideAngular(() => {
			// Expected Vs Actual Maternal Death
			var expectedVsActual = am4core.create('expectedVsActual', am4charts.XYChart);

			expectedVsActual.exporting.menu = new am4core.ExportMenu();
			expectedVsActual.legend = new am4charts.Legend()
			expectedVsActual.legend.position = 'top'
			expectedVsActual.legend.paddingBottom = 10
			expectedVsActual.legend.labels.template.maxWidth = 95;

			expectedVsActual.logo.disabled = true;
			expectedVsActual.colors.list = [
				am4core.color("#007bff"),
				am4core.color("#ffb822")
			];
			// Add data
			if (this.selectedValue === 'stateWise') {
				this.isShowState = true;
				this.isShowDistrict = false;
				expectedVsActual.data = this.stateData;
				expectedVsActual.data = expectedVsActual.data.sort((a, b) => b.actual - a.actual);

			} else {
				this.isShowState = false;
				this.isShowDistrict = true;
				const indiaData = this.stateData.find(item => item.state === 'India');
				indiaData.percent = ((indiaData.actual / (indiaData.expected == 0 ? 1 : indiaData.expected)) * 100).toFixed(0)+"%";
				expectedVsActual.data = this.stateData.filter(item => item.state !== 'India').map(sd => {
					const percent = ((sd.actual / (sd.expected == 0 ? 1 : sd.expected)) * 100).toFixed(0);
					sd.percent = percent + "%";
					return sd;
				});

				expectedVsActual.data = expectedVsActual.data.sort((a, b) => b.percent - a.percent);
				console.log("indiaData : ",indiaData);
				expectedVsActual.data.unshift(indiaData);
			}
			// Create axes
			var categoryAxis = expectedVsActual.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.dataFields.category = "state";
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
					axis.renderer.labels.template.rotation = -45;
					axis.renderer.labels.template.horizontalCenter = 'right';
					axis.renderer.labels.template.verticalCenter = 'middle';
				} else {
					axis.renderer.labels.template.rotation = 0;
					axis.renderer.labels.template.horizontalCenter = 'middle';
					axis.renderer.labels.template.verticalCenter = 'top';
				}
			});

			var valueAxis = expectedVsActual.yAxes.push(new am4charts.ValueAxis());
			valueAxis.min = 0;
			valueAxis.title.text = "Maternal Deaths";

			// Create series
			function createSeries1(field, name, stacked, selectedValue) {
				var series = expectedVsActual.series.push(new am4charts.ColumnSeries());
				series.dataFields.valueY = field;
				series.dataFields.categoryX = "state";

				series.name = name;
				if (selectedValue === 'stateWise') {
					series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
				} else {
					series.columns.template.tooltipText = "{name}: [bold]{valueY}%";
				}
				series.stacked = stacked;

				series.columns.template.column.cornerRadiusTopLeft = 5;
				series.columns.template.column.cornerRadiusTopRight = 5;

				if (selectedValue !== 'stateWise') {

					let bullet = series.bullets.push(new am4charts.LabelBullet())
					bullet.interactionsEnabled = false
					bullet.dy = -10;
					bullet.label.text = '{valueY}%'
					bullet.label.fill = am4core.color('#000000');
					bullet.label.fontWeight = 'bold';
				}

				series.columns.template.adapter.add("fill", function (fill, target) {
					if (target.dataItem['categoryX'] == 'India') {
						if (name === 'Actual') {
							return am4core.color("#ffbb93");
						}
						return am4core.color("#ff7043");
					} else {
						return fill;
					}
				});

				series.columns.template.adapter.add("stroke", function (fill, target) {
					if (target.dataItem['categoryX'] == 'India') {
						if (name === 'Actual') {
							return am4core.color("#ffbb93");
						}
						return am4core.color("#ff7043");
					} else {
						return fill;
					}
				});
			}

			if (this.selectedValue === 'stateWise') {
				createSeries1("actual", "Actual", false, 'stateWise');
				createSeries1("expected", "Estimated", false, 'stateWise');
			} else {
				createSeries1("percent", "Actual/Estimated", false, '');
				this.changeDetectorRef.detectChanges();
			}

			// Cursor
			expectedVsActual.cursor = new am4charts.XYCursor();
			//scrollbar
			expectedVsActual.scrollbarX = new am4core.Scrollbar();
			expectedVsActual.scrollbarX.thumb.minWidth = 50;

			this.charts.push(expectedVsActual);
		})
	}



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
			categoryAxis.dataFields.category = "code";
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
				series.dataFields.categoryX = "code";
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
					bullet.label.text = '{valueY}[/]%'
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

	generateLineChart(expectedVsActualLine) {
		let categoryAxis = expectedVsActualLine.xAxes.push(new am4charts.CategoryAxis());
		categoryAxis.dataFields.category = "year";
		categoryAxis.renderer.minGridDistance = 50;
		categoryAxis.renderer.grid.template.location = 0.5;
		categoryAxis.startLocation = 0.5;
		categoryAxis.endLocation = 0.5;

		// Create value axis
		let valueAxis = expectedVsActualLine.yAxes.push(new am4charts.ValueAxis());
		valueAxis.baseValue = 0;

		// Create series
		let series = expectedVsActualLine.series.push(new am4charts.LineSeries());
		series.dataFields.valueY = "value";
		series.dataFields.categoryX = "year";
		series.strokeWidth = 2;
		series.tensionX = 0.77;

		// bullet is added because we add tooltip to a bullet for it to change color
		let bullet = series.bullets.push(new am4charts.Bullet());
		bullet.tooltipText = "{valueY}";

		bullet.adapter.add("fill", function (fill, target) {
			if (target.dataItem.valueY < 0) {
				return am4core.color("#FF0000");
			}
			return fill;
		})
		let range = valueAxis.createSeriesRange(series);
		range.value = 0;
		range.endValue = -1000;
		range.contents.stroke = am4core.color("#FF0000");
		range.contents.fill = range.contents.stroke;

		// Add scrollbar
		let scrollbarX = new am4charts.XYChartScrollbar();
		scrollbarX.series.push(series);
		expectedVsActualLine.scrollbarX = scrollbarX;

		expectedVsActualLine.cursor = new am4charts.XYCursor();

	}

	generateMDsOccuring() {
		// chart 31
		const chart31 = am4core.create('chart31', am4charts.PieChart3D);
		chart31.exporting.menu = new am4core.ExportMenu();
		//chart31.colors.list = colors2;
		chart31.colors.list = [am4core.color('#f56528'), am4core.color('#fcd338'), am4core.color('#b0de33'), am4core.color('#0d8ecf')];

		chart31.innerRadius = am4core.percent(35);

		chart31.data = this.maternalDeathTypesGraphData;

		var pieSeries1 = chart31.series.push(new am4charts.PieSeries3D());
		pieSeries1.dataFields.value = 'column-1';
		pieSeries1.dataFields.category = 'category';
		pieSeries1.slices.template.propertyFields.fill = 'color';

		// pieSeries.labels.template.text = '{value}';
		pieSeries1.ticks.template.disabled = true;
		pieSeries1.alignLabels = false;
		pieSeries1.labels.template.text = "{value.percent.formatNumber('#.0')}%";
		pieSeries1.labels.template.radius = am4core.percent(-30);
		pieSeries1.labels.template.fontWeight = "600";
		// pieSeries.labels.template.fill = am4core.color("white");

		chart31.legend = new am4charts.Legend();
		chart31.legend.align = 'center';
		chart31.legend.fontSize = 12;
		chart31.legend.labels.template.text = '{category}';
		chart31.legend.valueLabels.template.text = '';

		chart31.legend.markers.template.marginRight = 2;
		chart31.legend.markers.template.width = 16;
		chart31.legend.markers.template.height = 16;

		this.charts.push(chart31);
	}

	generateMostMDsDistrictwise() {
		// CART 7
		const chart7 = am4core.create('chart7', am4charts.XYChart);
		chart7.exporting.menu = new am4core.ExportMenu();
		chart7.logo.disabled = true;
		chart7.paddingRight = 20;

		chart7.colors.list = [am4core.color('#f5b7b1')];

		chart7.data = this.leastAndMostDeathsInDistrict['mostDistrcisDeaths'];
		var categoryAxis = chart7.xAxes.push(new am4charts.CategoryAxis());
		categoryAxis.dataFields.category = 'category';
		categoryAxis.renderer.grid.template.location = 0;
		categoryAxis.renderer.minGridDistance = 30;
		var label = categoryAxis.renderer.labels.template;

		label.truncate = true;
		label.maxWidth = 200;
		label.tooltipText = '{category}';

		categoryAxis.events.on('sizechanged', function (ev) {
			let axis = ev.target;
			var cellWidth =
				axis.pixelWidth / (axis.endIndex - axis.startIndex);
			if (cellWidth < axis.renderer.labels.template.maxWidth) {
				axis.renderer.labels.template.rotation = -45;
				axis.renderer.labels.template.horizontalCenter = 'right';
				axis.renderer.labels.template.verticalCenter = 'middle';
			} else {
				axis.renderer.labels.template.rotation = 0;
				axis.renderer.labels.template.horizontalCenter = 'middle';
				axis.renderer.labels.template.verticalCenter = 'top';
			}
		});

		var valueAxis = chart7.yAxes.push(new am4charts.ValueAxis());

		// Create series
		var series103 = chart7.series.push(new am4charts.ColumnSeries());
		series103.dataFields.valueY = 'column-1';
		series103.dataFields.categoryX = 'category';
		series103.columns.template.tooltipText =
			'[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}';

		this.charts.push(chart7);
	}

	ngOnInit() {
		//this.fromDate = moment([moment().year(), 0, 1]);
		this.fromDate = moment([2020, 0, 1]);
		this.toDate = moment();
		this.filterForm = this.createFilterForm();
		this.setTitle()
		if (this.currentUser.accessupto == "Block") {
			this.block_id = this.currentUser.user_block_id;
		} else if (this.currentUser.accessupto == "District") {
			this.district_id = this.currentUser.user_district_id;
		} else if (this.currentUser.accessupto == "State") {
			this.state_id = this.currentUser.user_state_id;
			this.getMostAndLeastDistrictsDeaths(this.state_id);
		} else {
			this.getMostAndLeastDistrictsDeaths({ state_id: { "statecode": undefined } });
			this.getDeathsWhereCbmdsrAndFbmdsrConducted({});
			this.getSubmittedFormsStatus({ state_id: { "statecode": undefined } });
		}

		this.where = {
			state_id: this.state_id ? this.state_id : undefined,
			district_id: this.district_id ? this.district_id : undefined,
			block_id: this.block_id ? this.block_id : undefined,
			updatedAt: {
				"$gte": this.fromDate,
				"$lte": this.toDate
			}
		}
		this.countParam = {
			"state_id.statecode": this.state_id ? this.state_id.statecode : undefined,
			"district_id.districtcode": this.district_id ? this.district_id.districtcode : undefined,
			"block_id.subdistrictcode": this.block_id ? this.block_id.subdistrictcode : undefined,
			updatedAt: {
				"$gte": this.fromDate,
				"$lte": moment(this.toDate).add(1, 'day')
			}
		}
		//get Top 4 Indicator Details
		this.getTopIndicatorData(this.countParam);
		this.getNotificationCount(this.countParam);
		this.getIcd10CodesCategorywise();
		this.getMaternalCauseOfdeathsFor6Months();
		this.getMaternalDeathTypesGraphData();
		//this.getPlaceOfDeathStackBarGraph()

		this.stateService.getStates().subscribe(res => {
			this.stateList = res;
			const statecodes: number[] = this.stateList.map(state => state.statecode);
			// for all state selection..
			statecodes.push(0);
			this.filterForm.patchValue({ states: statecodes })
		});
		this.fbmdrVsCbmdrGraph({ fromDate: this.fromDate, toDate: this.toDate, statecodes: [], accessupto: 'National' }); //totalCBOutOfFBMDSR
	}
	ngAfterViewInit() {
		//this.whereCbmdsrAndFbmdsrConductedDatasource.sort = this.sortWhereCbmdsrAndFbmdsrConductedDatasource;
	}
	MaternalDeathsStatewiseTabularViewTitle: string;
	MaternalDeathsDistrictwiseTabularViewTitle: string;
	MaternalDeathsBlockwiseTabularViewTitle: string;
	MaternalDeathsDistrictwiseGraphViewTitle: string;
	MaternalDeathsBlockwiseGraphViewTitle: string;

	CBMDSRMaternalDeathsFormsStatusTitle: string;
	CBMDSRMaternalDeathsFormsStatusDistrictwiseTitle: string;
	CBMDSRMaternalDeathsFormsStatusBlockwiseTitle: string;

	FBMDSRMaternalDeathsFormsStatusTitle: string;
	FBMDSRMaternalDeathsFormsStatusDistrictwiseTitle: string;
	FBMDSRMaternalDeathsFormsStatusBlockwiseTitle: string;

	placeOfDeathPieChartTitle: string;
	DistrictsWithMostMaternalDeathsReportedTitle: string;
	MDsAtFacilityVsTransitVsHomeVsOtherTitle: string;
	MDsForwhichFBMDSR_CBMDSRHasBeenConductedTitle: string;
	EstimatedVsActualReportedMaternalDeathsInPercentageTitle: string;
	MajorCausesOfMaternalDeathsDataTitle: string;

	EstimatedVsActualReportedMDs: string;
	OutofTotalFBMDSRCasesHowManyCBMDSRAreCompleted: string;
	OutofTotalFBMDSRCasesHowManyCBMDSRAreCompletedInPer: string;
	Stateswhohavenotuploadedreviewmeetingdetails: string;
	MDnotreviewedbyCMO: string;
	MDnotreviewedbyDCDM: string;
	monthOnMonthTitle: string;

	setTitle() {
		this.MaternalDeathsStatewiseTabularViewTitle = `Maternal Deaths Statewise - Tabular View <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`
		this.MaternalDeathsDistrictwiseTabularViewTitle = `Maternal Deaths Districtwise - Tabular View <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`
		this.MaternalDeathsBlockwiseTabularViewTitle = `Maternal Deaths Blockwise - Tabular View <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`

		this.MaternalDeathsDistrictwiseGraphViewTitle = `Maternal Deaths Districtwise - Graph View <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.MaternalDeathsBlockwiseGraphViewTitle = `Maternal Deaths Blockwise - Graph View <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;

		this.CBMDSRMaternalDeathsFormsStatusTitle = `CBMDSR Maternal Deaths Forms Status View <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.CBMDSRMaternalDeathsFormsStatusDistrictwiseTitle = `CBMDSR Maternal Deaths Forms Status Districtwise <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.CBMDSRMaternalDeathsFormsStatusBlockwiseTitle = `CBMDSR Maternal Deaths Forms Status Blockwise <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;

		this.FBMDSRMaternalDeathsFormsStatusTitle = `FBMDSR Maternal Deaths Forms Status View <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.FBMDSRMaternalDeathsFormsStatusDistrictwiseTitle = `FBMDSR Maternal Deaths Forms Status Districtwise <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.FBMDSRMaternalDeathsFormsStatusBlockwiseTitle = `FBMDSR Maternal Deaths Forms Status Blockwise <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;

		this.MDsForwhichFBMDSR_CBMDSRHasBeenConductedTitle = `% of MDs for which FBMDSR/CBMDSR has been conducted <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.MDsAtFacilityVsTransitVsHomeVsOtherTitle = `MDs at Facility vs Transit vs Home Vs Other <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.DistrictsWithMostMaternalDeathsReportedTitle = `Districts with highest reported maternal deaths <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.placeOfDeathPieChartTitle = `Proportion of MDs occurring at home, transit, facility and Other out of total MDs reported <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;

		this.EstimatedVsActualReportedMaternalDeathsInPercentageTitle = `Estimated Vs Actual(Reported) Maternal Deaths in % <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.MajorCausesOfMaternalDeathsDataTitle = `Major Causes of Maternal Death\'s data <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;

		this.EstimatedVsActualReportedMDs = `Estimated Vs Actual(Reported) Maternal Deaths <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.OutofTotalFBMDSRCasesHowManyCBMDSRAreCompleted = `Out of Total FBMDSR Cases, How Many CBMDSR Are Completed <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.OutofTotalFBMDSRCasesHowManyCBMDSRAreCompletedInPer = `Out of Total FBMDSR Cases, How Many CBMDSR Are Completed in % <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.Stateswhohavenotuploadedreviewmeetingdetails = `List of states that have not uploaded state level quarterly review meeting details <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.MDnotreviewedbyCMO = `District wise MDs list that have not been reviewed by the concerned CMO <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.MDnotreviewedbyDCDM = `District wise MDs list that have not been reviewed by the concerned DC / DM <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.monthOnMonthTitle = `Maternal Causes of Deaths (Month on Month) <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
	}


	// Top 4 Block Details
	getTopIndicatorData(countParam) {
		this.form1Service.getDashboardData(countParam).subscribe(res => {
			this.indicatorDetails = res[0];
			this.changeDetectorRef.detectChanges();
		});
	}
	getNotificationCount(countParam) {
		this.form1Service.getNotificationCount(countParam).subscribe(res => {
			if (res.length > 0) {
				this.maternalDeathsNotification = [];
				this.maternalDeathsNotification.push({
					cbmdsr: { count: res[0]['CB'], type: "CBMDSR" },
					fbmdsr: { count: res[0]['FB'], type: "FBMDSR" }
				})
				this.changeDetectorRef.detectChanges();
			}
			//setTimeout(()=>{this.changeDetectorRef.detectChanges()},100)
		});
	}

	createFilterForm() {
		return this.fb.group({
			states: [],
			fromDate: [this.fromDate],
			toDate: [this.toDate]
		})
	}
	maternalDeathTypesGraphData: any;
	getMaternalDeathTypesGraphData() {
		const { fromDate, toDate } = this.filterForm.value;
		let params = {
			fromDate: moment(fromDate),
			toDate: moment(toDate).add(1, 'day')
		}
		this.form1Service.getMaternalDeathTypesGraphData(params).subscribe((data: any) => {
			this.maternalDeathTypesGraphData = data.map(item => {
				if (item.category === 'Home') {
					item['color'] = '#64b5f6'
				} else if (item.category === 'Health Facility') {
					item['color'] = '#81c784'
				} else if (item.category === 'Transit') {
					item['color'] = '#ffb74d'
				} else if (item.category === 'Other') {
					item['color'] = '#ff8a65'
				}
				return item;
			});
			this.generateMDsOccuring();
		})
	}
	MaternalDeathsNotificationsDetails: string;
	getDetails(type, title) {
		this.MaternalDeathsNotificationsDetails = `${title} <small>${this.fromDate.format("DD-MM-YYYY")}-${this.toDate.format("DD-MM-YYYY")}</small>`
		let where = {
			updatedAt: { between: [this.fromDate, moment(this.toDate).add(1, 'day')] }
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
			this.blockwiseMaternalDeathsNotificationDatasource.paginator = this.paginatorblockwiseMaternalDeathsNotification;
			this.isShowNotificationDetailTable = true;
			this.isShowMaternalDeathsDetails = true;
			this.changeDetectorRef.detectChanges();
		})
	}

	getNotificationDetails(arg, title) {
		this.MaternalDeathsNotificationsDetails = `${title} <small>${this.fromDate.format("DD-MM-YYYY")}-${this.toDate.format("DD-MM-YYYY")}</small>`
		this.isShowNotificationDetailTable = false;
		this.isShowMaternalDeathsDetails = false;
		let whereParam = {};//this.where;
		whereParam = {
			updatedAt: {
				"$gte": this.fromDate,
				"$lte": moment(this.toDate).add(1, 'day')
			}
		}
		if (arg.type == "CBMDSR") {
			whereParam['place_of_death'] = { '$in': ["Home", "Transit", "Other"] }
		} else if (arg.type == "FBMDSR") {
			whereParam['place_of_death'] = { '$in': ["Health Facility"] }
		}
		this.form1Service.getNotificationDetails(whereParam).subscribe(res => {
			this.blockwiseMaternalDeathsNotification = res;
			this.blockwiseMaternalDeathsNotificationDatasource = new MatTableDataSource(res);
			this.blockwiseMaternalDeathsNotificationDatasource.paginator = this.paginatorblockwiseMaternalDeathsNotification;
			this.isShowNotificationDetailTable = true;
			this.isShowMaternalDeathsDetails = true;
			this.changeDetectorRef.detectChanges();
		});
	}
	MaternalCauses: any;
	getIcd10CodesCategorywise() {
		const { fromDate, toDate, states } = this.filterForm.value;
		let param = {
			fromDate,
			toDate,
			statecodes: states,
			accessUpto: this.currentUser.accessupto
		}
		this.form1Service.getMaternalCauseOfdeaths(param).subscribe(getMatRes => {
			this.MaternalCauses = getMatRes[0];
			this.maternalCausesYearOnYear();
			this.changeDetectorRef.detectChanges();
		});
		//});
	}
	leastAndMostDeathsInDistrict: any;
	getMostAndLeastDistrictsDeaths(stateId) {

		const { fromDate, toDate } = this.filterForm.value;
		let previousYearFromDate = moment(fromDate);
		let previousYearToDate = moment(toDate).add(1, 'day');

		let paramMost = {
			previousYearFromDate: previousYearFromDate,
			previousYearToDate: previousYearToDate,
			where: { "state_id": stateId.state_id['statecode'] },
			accessUpto: this.currentUser.accessupto
		}

		this.form1Service.getMostAndLeastDistrictsDeaths(paramMost).subscribe(Res => {
			this.leastAndMostDeathsInDistrict = Res;
			this.generateMostMDsDistrictwise();
			this.changeDetectorRef.detectChanges();
		});
	}
	whereCbmdsrAndFbmdsrConducted: [];
	getDeathsWhereCbmdsrAndFbmdsrConducted(accessArg) {
		const { states, fromDate, toDate } = this.filterForm.value;

		this.isShowDistrictMapAndTableOnStateClick = false;
		this.isShowBlockTable = false;
		this.isShowBlockwiseDeathsDetailTable = false;
		let previousYearFromDate = moment(fromDate)
		let previousYearToDate = moment(toDate).add(1, 'day');
		let param = {
			previousYearFromDate: previousYearFromDate,
			previousYearToDate: previousYearToDate,
			where: accessArg,
			statecodes: states,
			accessUpto: this.currentUser.accessupto
		}
		this.form1Service.getDeathsWhereCbmdsrAndFbmdsrConducted(param).subscribe(Res => {
			Res.sort(function (a, b) {
				var whereFBMDSRConductedA = a['column-2']
				var whereFBMDSRConductedB = b['column-2']
				return (whereFBMDSRConductedA > whereFBMDSRConductedB) ? -1 : (whereFBMDSRConductedA < whereFBMDSRConductedB) ? 1 : 0;
			});
			this.whereCbmdsrAndFbmdsrConducted = Res;
			let obj = {
				'statecode': 0,
				'category': "India",
				'column-1': 0,
				'column-2': 0,
				'totalMDs': 0,
				reported: 0
			};

			for (const item of this.whereCbmdsrAndFbmdsrConducted) {
				obj['column-1'] += item['column-1'];
				obj['column-2'] += item['column-2'];
				obj['reported'] += item['reported'];
				obj['totalMDs'] += item['totalMDs'];
			}

			let data = states && states.length ? Res.filter(item => states.includes(item.statecode)) : Res;
			data.unshift(obj);
			this.whereCbmdsrAndFbmdsrConductedDatasource = new MatTableDataSource(data);

			setTimeout(() => {
				this.whereCbmdsrAndFbmdsrConductedDatasource.paginator = this.paginatorWhereCbmdsrAndFbmdsrConductedDatasource;
				this.whereCbmdsrAndFbmdsrConductedDatasource.sort = this.sortWhereCbmdsrAndFbmdsrConductedDatasource;
			}, 200);
			this.showProcessingForStateMap = false;
			this.changeDetectorRef.detectChanges();
		});
	}
	GraphMaternalCausesLast6Month: any;
	getMaternalCauseOfdeathsFor6Months() {
		const { fromDate, toDate, states } = this.filterForm.value;
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
			datesArray: datesArray,
			fromDate: this.fromDate,
			toDate: this.toDate,
			accessUpto: this.currentUser.accessupto,
			statecodes: states
		}
		this.form1Service.getMaternalCauseOfdeathsFor6Months(param).subscribe(Res6monthsData => {
			this.GraphMaternalCausesLast6Month = Res6monthsData;
			this.drawGraphMaternalCausesLast6Month();
			this.changeDetectorRef.detectChanges();
		});
	}

	drawGraphMaternalCausesLast6Month() {
		// CART 4
		const chart4 = am4core.create('chart4', am4charts.XYChart);
		chart4.exporting.menu = new am4core.ExportMenu();
		chart4.logo.disabled = true;
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
		chart4.scrollbarX = new am4core.Scrollbar();
		// Create axes
		var dateAxis = chart4.xAxes.push(new am4charts.DateAxis());
		dateAxis.renderer.minGridDistance = 50;
		dateAxis.renderer.grid.template.location = 0.5;
		dateAxis.startLocation = 0.5;
		dateAxis.endLocation = 0.5;
		dateAxis.periodChangeDateFormats.setKey("month", "[bold]yyyy");


		// Create value axis
		var valueAxis = chart4.yAxes.push(new am4charts.ValueAxis());
		valueAxis.title.text = "Total MDs";

		chart4.legend = new am4charts.Legend();
		chart4.legend.align = 'center';
		chart4.legend.fontSize = 12;
		// chart4.legend.labels.template.text = '{category}';
		// chart4.legend.valueLabels.template.text = '';

		chart4.legend.markers.template.marginRight = 2;
		chart4.legend.markers.template.width = 16;
		chart4.legend.markers.template.height = 16;

		chart4.cursor = new am4charts.XYCursor();
		chart4.cursor.tooltipText = 'test';

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

		// var xySeries5 = chart4.series.push(new am4charts.LineSeries());
		// xySeries5.dataFields.valueY = 'column-5';
		// xySeries5.dataFields.dateX = 'date';
		// xySeries5.strokeWidth = 3;
		// xySeries5.tensionX = 0.8;
		// xySeries5.bullets.push(new am4charts.CircleBullet());
		// xySeries5.data = chart4data;
		// xySeries5.name = 'Embolism';
		// xySeries5.tooltipText = '{name}: [bold]{valueY}[/]';
		// xySeries5.strokeWidth = 1;

		var xySeries6 = chart4.series.push(new am4charts.LineSeries());
		xySeries6.dataFields.valueY = 'column-5';
		xySeries6.dataFields.dateX = 'category';
		xySeries6.strokeWidth = 3;
		xySeries6.tensionX = 0.8;
		xySeries6.bullets.push(new am4charts.CircleBullet());
		xySeries6.data = chart4data;
		xySeries6.name = 'Obstructive Labour';
		xySeries6.tooltipText = '{name}: [bold]{valueY}[/]';
		xySeries6.strokeWidth = 1;

		var xySeries7 = chart4.series.push(new am4charts.LineSeries());
		xySeries7.dataFields.valueY = 'column-6';
		xySeries7.dataFields.dateX = 'category';
		xySeries7.strokeWidth = 3;
		xySeries7.tensionX = 0.8;
		xySeries7.bullets.push(new am4charts.CircleBullet());
		xySeries7.data = chart4data;
		xySeries7.name = 'IndirectCause';
		xySeries7.tooltipText = '{name}: [bold]{valueY}[/]';
		xySeries7.strokeWidth = 1;

		var xySeries8 = chart4.series.push(new am4charts.LineSeries());
		xySeries8.dataFields.valueY = 'column-7';
		xySeries8.dataFields.dateX = 'category';
		xySeries8.strokeWidth = 3;
		xySeries8.tensionX = 0.8;
		xySeries8.bullets.push(new am4charts.CircleBullet());
		xySeries8.data = chart4data;
		xySeries8.name = 'Other Direct Causes';
		xySeries8.tooltipText = '{name}: [bold]{valueY}[/]';
		xySeries8.strokeWidth = 1;

		this.charts.push(chart4);

	}

	whereCbmdsrAndFbmdsrConductedInDistrict: any;
	isShowDistrictMapAndTableOnStateClick = false;
	// passingArgOnStateClick:any;
	getStateNameForTakingBlocks: any;
	whereCbmdsrAndFbmdsrConductedInDistrictForGraph: any;

	getDistrictsData(arg) {
		const { fromDate, toDate } = this.filterForm.value;
		this.isShowBlockTable = false;
		this.isShowBlockwiseDeathsDetailTable = false;
		this.callingFrom = 'NationalLoginForDistrictsMap';
		this.passingArgOnDistrictClick = arg;
		this.getStateNameForTakingBlocks = arg['category'];
		this.mapChartDiv = 'districts';
		this.whereCbmdsrAndFbmdsrConductedInDistrict = [];
		let previousYearFromDate = moment(fromDate);
		let previousYearToDate = moment(toDate).add(1, 'day');
		let districtData = [];
		let param = {
			previousYearFromDate: previousYearFromDate,
			previousYearToDate: previousYearToDate,
			where: { "statecode": arg['statecode'] },
			accessUpto: "State"
		}

		this.form1Service.getDeathsWhereCbmdsrAndFbmdsrConducted(param).subscribe(Res => {
			Res.sort(function (a, b) {
				var whereFBMDSRConductedA = a['category']
				var whereFBMDSRConductedB = b['category']
				return (whereFBMDSRConductedA > whereFBMDSRConductedB) ? 1 : (whereFBMDSRConductedA < whereFBMDSRConductedB) ? -1 : 0;
			});
			Res.forEach(function (element) {
				districtData.push({
					state: element['category'],
					expected: element['column-1'],
					actual: element['column-2'],
					districtcode: element['districtcode'],
					totalMDs: element['totalMDs'],
					reported: element['reported'],
				})
			});
			this.isShowDistrictMapAndTableOnStateClick = true;
			this.whereCbmdsrAndFbmdsrConductedInDistrict = Res;
			this.whereCbmdsrAndFbmdsrConductedInDistrictDatasource = new MatTableDataSource(Res);

			setTimeout(() => {
				this.whereCbmdsrAndFbmdsrConductedInDistrictDatasource.paginator = this.paginatorwhereCbmdsrAndFbmdsrConductedInDistrict;
			}, 200);
			this.whereCbmdsrAndFbmdsrConductedInDistrictForGraph = districtData;
			this.getDistrictwiseCbmdsrFbmdsrGraph();
			this.changeDetectorRef.detectChanges();
		});
	}

	whereCbmdsrAndFbmdsrConductedInBlock: any;
	isShowBlockTable = false;
	passingArgOnDistrictClick: any;
	whereCbmdsrAndFbmdsrConductedInBlockForGraph: any;

	getBlocksData(arg) {

		const { fromDate, toDate } = this.filterForm.value;
		this.isShowBlockwiseDeathsDetailTable = false;
		this.callingFrom = 'NationalLoginForBlocksMap';;
		this.passingArgOnDistrictClick = arg;
		this.passingArgOnDistrictClick['statename'] = this.getStateNameForTakingBlocks;
		this.mapChartDiv = 'block';
		this.whereCbmdsrAndFbmdsrConductedInBlock = [];
		let previousYearFromDate = moment(fromDate);
		let previousYearToDate = moment(toDate).add(1, 'day');
		let param = {
			previousYearFromDate: previousYearFromDate,
			previousYearToDate: previousYearToDate,
			where: { "districtcode": arg['districtcode'] },
			accessUpto: "District"
		}
		let blockData = [];
		this.form1Service.getDeathsWhereCbmdsrAndFbmdsrConducted(param).subscribe(Res => {
			Res.sort(function (a, b) {
				var whereFBMDSRConductedA = a['category']
				var whereFBMDSRConductedB = b['category']
				return (whereFBMDSRConductedA > whereFBMDSRConductedB) ? 1 : (whereFBMDSRConductedA < whereFBMDSRConductedB) ? -1 : 0;
			});
			Res.forEach(function (element) {
				blockData.push({
					state: element['category'],
					expected: element['column-1'],
					actual: element['column-2'],
					subdistrictcode: element['subdistrictcode'],
					totalMDs: element['totalMDs'],
					reported: element['reported']
				})
			});
			this.isShowBlockTable = true;
			this.whereCbmdsrAndFbmdsrConductedInBlock = Res;
			this.whereCbmdsrAndFbmdsrConductedInBlockDatasource = new MatTableDataSource(Res);
			setTimeout(() => {
				this.whereCbmdsrAndFbmdsrConductedInBlockDatasource.paginator = this.paginatorwhereCbmdsrAndFbmdsrConductedInBlock;
			}, 200);
			this.whereCbmdsrAndFbmdsrConductedInBlockForGraph = blockData;
			this.getBlockwiseCbmdsrFbmdsrGraph();
			this.changeDetectorRef.detectChanges();
		});
	}
	isShowBlockwiseDeathsDetailTable = false;
	blockwiseDetailsOfMaternalDeathsNotification: any;
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
			this.blockwiseDetailsOfMaternalDeathsNotificationDatasource = new MatTableDataSource(res);
			setTimeout(() => {
				this.blockwiseDetailsOfMaternalDeathsNotificationDatasource.paginator = this.paginatorblockwiseDetailsOfMaternalDeathsNotification;
			}, 200);
			this.isShowBlockwiseDeathsDetailTable = true;
			this.changeDetectorRef.detectChanges();
		});
	}

	formSubmittedStatus: any;
	getSubmittedFormsStatus(accessArg) {
		const { states, fromDate, toDate } = this.filterForm.value;
		let previousYearFromDate = moment(fromDate);
		let previousYearToDate = moment(toDate).add(1, 'day');

		let param = {
			previousYearFromDate: previousYearFromDate,
			previousYearToDate: previousYearToDate,
			where: { ...accessArg, state_id: { statecode: states } },
			accessUpto: this.currentUser.accessupto
		}

		this.form1Service.getSubmittedFormsStatus(param).subscribe(Res => {
			this.formSubmittedStatus = Res;
			this.dataSourceformSubmittedStatus = new MatTableDataSource(Res['cbmdsrFormsStatus']);
			this.dataSourceformSubmittedStatusFbmdsr = new MatTableDataSource(Res['fbmdsrFormsStatus']);
			//this.CBMDSRandFBMDSRMaternalDeathsFormsStatusInPercentage(Res['cbmdsrFormsStatus'], Res['fbmdsrFormsStatus'])
			setTimeout(() => {
				this.dataSourceformSubmittedStatus.paginator = this.paginatordataSourceformSubmittedStatus;
				this.dataSourceformSubmittedStatusFbmdsr.paginator = this.paginatordataSourceformSubmittedStatusFbmdsr;
			}, 200);
			this.changeDetectorRef.detectChanges();
		});
	}
	formSubmittedStatusDistrictwise: any
	isShowFormsStatusDistrictwise = false;
	getSubmittedFormsStatusDistrictwise(accessArg) {
		const { fromDate, toDate } = this.filterForm.value;

		let previousYearFromDate = moment(fromDate);
		let previousYearToDate = moment(toDate).add(1, 'day');
		let param = {
			previousYearFromDate: previousYearFromDate,
			previousYearToDate: previousYearToDate,
			where: { "statecode": accessArg['statecode'] },
			accessUpto: 'State'
		}
		this.form1Service.getSubmittedFormsStatus(param).subscribe(Res => {
			this.isShowFormsStatusDistrictwise = true
			this.formSubmittedStatusDistrictwise = Res;
			this.dataSourceformSubmittedStatusCbmdsrDistritwise = new MatTableDataSource(Res['cbmdsrFormsStatus']);
			this.dataSourceformSubmittedStatusFbmdsrDistritwise = new MatTableDataSource(Res['fbmdsrFormsStatus']);
			setTimeout(() => {
				this.dataSourceformSubmittedStatusCbmdsrDistritwise.paginator = this.paginatordataSourceformSubmittedStatusCbmdsrDistritwise;
				this.dataSourceformSubmittedStatusFbmdsrDistritwise.paginator = this.paginatordataSourceformSubmittedStatusFbmdsrDistritwise;
			}, 200);
			this.changeDetectorRef.detectChanges();
		});
	}

	formSubmittedStatusBlockwise: any
	isShowFormsStatusBlockwise = false;
	getSubmittedFormsStatusBlockwise(accessArg) {
		const { fromDate, toDate } = this.filterForm.value;
		let previousYearFromDate = moment(fromDate);
		let previousYearToDate = moment(toDate).add(1, 'day');
		let param = {
			previousYearFromDate: previousYearFromDate,
			previousYearToDate: previousYearToDate,
			where: { "districtcode": accessArg['districtcode'] },
			accessUpto: 'District'
		}
		this.form1Service.getSubmittedFormsStatus(param).subscribe(Res => {
			this.isShowFormsStatusBlockwise = true
			this.formSubmittedStatusBlockwise = Res;
			this.dataSourceformSubmittedStatusCbmdsrBlockwise = new MatTableDataSource(Res['cbmdsrFormsStatus']);
			this.dataSourceformSubmittedStatusFbmdsrBlockwise = new MatTableDataSource(Res['fbmdsrFormsStatus']);
			setTimeout(() => {
				this.dataSourceformSubmittedStatusCbmdsrBlockwise.paginator = this.paginatordataSourceformSubmittedStatusCbmdsrBlockwise;
				this.dataSourceformSubmittedStatusFbmdsrBlockwise.paginator = this.paginatordataSourceformSubmittedStatusFbmdsrBlockwise;
			}, 200);
			this.changeDetectorRef.detectChanges();
		});
	}

	getDistrictwiseCbmdsrFbmdsrGraph() {
		this.zone.runOutsideAngular(() => {
			// Expected Vs Actual Maternal Death
			var chart = am4core.create('districtwiseCbmdsrFbmdsrGraph', am4charts.XYChart);
			chart.exporting.menu = new am4core.ExportMenu();

			chart.scrollbarX = new am4core.Scrollbar();
			chart.logo.disabled = true;
			chart.legend = new am4charts.Legend()
			chart.legend.position = 'top'
			chart.legend.paddingBottom = 10
			chart.colors.list = [
				am4core.color("#007bff"),
				am4core.color("#ffb822")
			];

			// Add data
			chart.data = this.whereCbmdsrAndFbmdsrConductedInDistrictForGraph
			// Create axes
			var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.dataFields.category = "state";
			categoryAxis.renderer.grid.template.location = 0;
			categoryAxis.renderer.minGridDistance = 20;
			categoryAxis.title.text = "";

			categoryAxis.renderer.labels.template.horizontalCenter = "middle";
			categoryAxis.renderer.labels.template.verticalCenter = "middle";
			categoryAxis.renderer.labels.template.rotation = 270;

			var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.min = 0;
			valueAxis.title.text = "Maternal Deaths";

			// Create series
			function createSeries1(field, name, stacked) {
				var series = chart.series.push(new am4charts.ColumnSeries());
				series.dataFields.valueY = field;
				series.dataFields.categoryX = "state";

				//series.dataFields.valueYShow = 'totalPercent';
				series.name = name;
				series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
				series.stacked = stacked;
				//series.columns.template.width = am4core.percent(95);
				series.columns.template.column.cornerRadiusTopLeft = 5;
				series.columns.template.column.cornerRadiusTopRight = 5;
				series.columns.template.column.cornerRadiusTopLeft = 5;
				series.columns.template.column.cornerRadiusTopRight = 5;

				// const bullet = series.bullets.push(new am4charts.LabelBullet());
				// bullet.interactionsEnabled = false;
				// bullet.label.truncate = false;
				// bullet.label.hideOversized = false;
				// bullet.label.text ="{valueY}";
				// bullet.label.fontSize = 12;
				// bullet.label.horizontalCenter = "left";
				// bullet.label.dx = 15;
			}

			createSeries1("reported", "Where Reported(15-49yrs) Conducted", false);
			createSeries1("totalMDs", "Where Total MDs Conducted", false);
			createSeries1("actual", "Where CBMDSR Conducted", false);
			createSeries1("expected", "Where FBMDSR Conducted", false);

			// Cursor
			chart.cursor = new am4charts.XYCursor();
			//scrollbar
			//chart.scrollbarX = new am4core.Scrollbar();
			//chart.scrollbarX.thumb.minWidth = 60;

			// Add legend


			//chart.legend = new am4charts.Legend();

			this.charts.push(chart);
		})
	}

	getBlockwiseCbmdsrFbmdsrGraph() {
		this.zone.runOutsideAngular(() => {
			// Expected Vs Actual Maternal Death
			var chart = am4core.create('blockwiseCbmdsrFbmdsrGraph', am4charts.XYChart);
			chart.exporting.menu = new am4core.ExportMenu();
			chart.scrollbarX = new am4core.Scrollbar();
			chart.logo.disabled = true;
			chart.legend = new am4charts.Legend()
			chart.legend.position = 'top'
			chart.legend.paddingBottom = 10
			chart.colors.list = [
				am4core.color("#007bff"),
				am4core.color("#ffb822")
			];

			// Add data
			chart.data = this.whereCbmdsrAndFbmdsrConductedInBlockForGraph

			// Create axes

			var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.dataFields.category = "state";
			categoryAxis.renderer.grid.template.location = 0;
			categoryAxis.renderer.minGridDistance = 20;
			categoryAxis.title.text = "";



			categoryAxis.renderer.labels.template.horizontalCenter = "middle";
			categoryAxis.renderer.labels.template.verticalCenter = "middle";
			categoryAxis.renderer.labels.template.rotation = 270;

			var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.min = 0;
			valueAxis.title.text = "Maternal Deaths";

			// Create series
			function createSeries1(field, name, stacked) {
				var series = chart.series.push(new am4charts.ColumnSeries());
				series.dataFields.valueY = field;
				series.dataFields.categoryX = "state";

				//series.dataFields.valueYShow = 'totalPercent';
				series.name = name;
				series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
				series.stacked = stacked;
				//series.columns.template.width = am4core.percent(95);
				series.columns.template.column.cornerRadiusTopLeft = 5;
				series.columns.template.column.cornerRadiusTopRight = 5;
				series.columns.template.column.cornerRadiusTopLeft = 5;
				series.columns.template.column.cornerRadiusTopRight = 5;

				// const bullet = series.bullets.push(new am4charts.LabelBullet());
				// bullet.interactionsEnabled = false;
				// bullet.label.truncate = false;
				// bullet.label.hideOversized = false;
				// bullet.label.text ="{valueY}";
				// bullet.label.fontSize = 12;
				// bullet.label.horizontalCenter = "left";
				// bullet.label.dx = 15;
			}
			createSeries1("reported", "Where Reported(15-49yrs) Conducted", false);
			createSeries1("totalMDs", "Where Total MDs Conducted", false);
			createSeries1("actual", "Where CBMDSR Conducted", false);
			createSeries1("expected", "Where FBMDSR Conducted", false);

			// Cursor
			chart.cursor = new am4charts.XYCursor();
			//scrollbar
			//chart.scrollbarX = new am4core.Scrollbar();
			//chart.scrollbarX.thumb.minWidth = 60;

			// Add legend


			//chart.legend = new am4charts.Legend();

			this.charts.push(chart);
		})
	}

	getStateData(stateData) {
		let actual = 0, expected = 0;
		for (const state of stateData) {
			actual += state.actual;
			expected += state.expected;
		}
		this.stateData = stateData;
		console.log("stateDatasource  :", stateData);
		this.stateData.unshift({ statecode: 0, state: 'India', actual, expected })

		this.stateDatasource = new MatTableDataSource(stateData);
		//setTimeout(()=>{
		this.stateDatasource.paginator = this.paginatorstateDatasource;
		//},200);
		this.expectedVsActual();
	}

	onChange(value) {
		this.selectedValue = value;
		this.expectedVsActual();
	}

	onChangeCBFBMDSR(value) {
		this.selectedValueCBFBMDSR = value;
		this.totalCBOutOfFBMDSR();
	}

	onChangeFacilityVsHomeVsTransit(value) {
		this.selectedValueMDsFacilityVsHomeVsTransit = value;
	}

	// get Districtwise least and most data
	districtWiseLeastAndMostDeathReported() {
		// CART 6
		const chart6 = am4core.create('chart6', am4charts.XYChart);
		chart6.logo.disabled = true;
		chart6.paddingRight = 20;

		chart6.colors.list = [am4core.color('#d9f3a6')];

		chart6.data = this.leastAndMostDeathsInDistrict['leastDistrcisDeaths'];
		var categoryAxis = chart6.xAxes.push(new am4charts.CategoryAxis());
		categoryAxis.dataFields.category = 'category';
		categoryAxis.renderer.grid.template.location = 0;
		categoryAxis.renderer.minGridDistance = 30;
		var label = categoryAxis.renderer.labels.template;

		label.truncate = true;
		label.maxWidth = 200;
		label.tooltipText = '{category}';

		categoryAxis.events.on('sizechanged', function (ev) {
			let axis = ev.target;
			var cellWidth =
				axis.pixelWidth / (axis.endIndex - axis.startIndex);
			if (cellWidth < axis.renderer.labels.template.maxWidth) {
				axis.renderer.labels.template.rotation = -45;
				axis.renderer.labels.template.horizontalCenter = 'right';
				axis.renderer.labels.template.verticalCenter = 'middle';
			} else {
				axis.renderer.labels.template.rotation = 0;
				axis.renderer.labels.template.horizontalCenter = 'middle';
				axis.renderer.labels.template.verticalCenter = 'top';
			}
		});

		var valueAxis = chart6.yAxes.push(new am4charts.ValueAxis());

		// Create series
		var series102 = chart6.series.push(new am4charts.ColumnSeries());
		series102.dataFields.valueY = 'column-1';
		series102.dataFields.categoryX = 'category';
		series102.columns.template.tooltipText =
			'[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}';

		this.charts.push(chart6);
	}

	isShowDistrictOnMap: boolean = false;
	isShowAllDistrictOnMap: boolean = false;
	getCheckBoxValue($event) {
		this.isShowDistrictOnMap = $event.target.checked;
		if (this.isShowDistrictOnMap) {
			Swal.fire({
				title: "<h3>Loading All Districts in Map?</h3>",
				timer: 0,
				html: `<span class="text-primary">Loading all district in map will take some time.</span>`,
				showConfirmButton: true,
				confirmButtonText: 'Yes',
				cancelButtonText: 'No',
				showCancelButton: true
			}).then(result => {
				if (result.value === true) {
					this.isShowAllDistrictOnMap = true;
				} else {
					this.isShowAllDistrictOnMap = false;
					this.isShowDistrictOnMap = false;
				}
				this.changeDetectorRef.detectChanges();
			})
		} else {
			this.isShowAllDistrictOnMap = this.isShowDistrictOnMap;
			this.changeDetectorRef.detectChanges();
		}
	}
	isShowOnMap: boolean = true;
	getCheckBoxValueForShowMap($event) {
		this.isShowOnMap = $event.target.checked;
	}
	isShowOnStatewiseGraph: boolean = true;
	getCheckBoxValueForShowStatewiseGraph($event) {
		this.isShowOnStatewiseGraph = $event.target.checked;
	}

	ngOnDestroy() {
		while (this.charts.length) {
			const chart = this.charts.pop();

			chart.dispose();
		}
		am4core.disposeAllCharts();
	}

	// search button work
	applyFilterNotificationsDetail(NotificationsDetail: string) {
		this.blockwiseMaternalDeathsNotificationDatasource.filter = NotificationsDetail.trim().toLowerCase();
	}

	applyFilterSatewiseMaternalDeath(SatewiseMaternalDeath: string) {
		this.whereCbmdsrAndFbmdsrConductedDatasource.filter = SatewiseMaternalDeath.trim().toLowerCase();
	}

	applyFilterDistrictwiseMaternalDeath(DistrictwiseMaternalDeath: string) {
		this.whereCbmdsrAndFbmdsrConductedInDistrictDatasource.filter = DistrictwiseMaternalDeath.trim().toLowerCase();
	}

	applyFilterBlockwiseMaternalDeath(BlockwiseMaternalDeath: string) {
		this.whereCbmdsrAndFbmdsrConductedInBlockDatasource.filter = BlockwiseMaternalDeath.trim().toLowerCase();
	}

	applyFilterBlockwiseMaternalDeathNotifications(BlockwiseMaternalDeathNotifications: string) {
		this.blockwiseDetailsOfMaternalDeathsNotificationDatasource.filter = BlockwiseMaternalDeathNotifications.trim().toLowerCase();
	}

	applyFilterStatewiseCbmdsrFormStatus(StatewiseCbmdsrFormStatus: string) {
		this.dataSourceformSubmittedStatus.filter = StatewiseCbmdsrFormStatus.trim().toLowerCase();
	}

	applyFilterStatewiseFbmdsrFormStatus(StatewiseFbmdsrFormStatus: string) {
		this.dataSourceformSubmittedStatusFbmdsr.filter = StatewiseFbmdsrFormStatus.trim().toLowerCase();
	}

	applyFilterDistrictwiseCbmdsrFormStatus(DistrictwiseCbmdsrFormStatus: string) {
		this.dataSourceformSubmittedStatusCbmdsrDistritwise.filter = DistrictwiseCbmdsrFormStatus.trim().toLowerCase();
	}

	applyFilterDistrictwiseFbmdsrFormStatus(DistrictwiseFbmdsrFormStatus: string) {
		this.dataSourceformSubmittedStatusFbmdsrDistritwise.filter = DistrictwiseFbmdsrFormStatus.trim().toLowerCase();
	}

	applyFilterBlockwiseCbmdsrFormStatus(BlockwiseCbmdsrFormStatus: string) {
		this.dataSourceformSubmittedStatusCbmdsrBlockwise.filter = BlockwiseCbmdsrFormStatus.trim().toLowerCase();
	}

	applyFilterBlockwiseFbmdsrFormStatus(BlockwiseFbmdsrFormStatus: string) {
		this.dataSourceformSubmittedStatusFbmdsrBlockwise.filter = BlockwiseFbmdsrFormStatus.trim().toLowerCase();
	}

	applyFilterEstimateVsActual(EstimateVsActual: string) {
		this.stateDatasource.filter = EstimateVsActual.trim().toLowerCase();
	}

	ExportTableMD(val) {
		if (val == 1) {
			let dataToExport = this.data1.map((x) => ({
				"State": x.state,
				"MD Reported": x.md,
				"Deaths not Reviwed": x.dnotreviwed
			}));
			const workSheet = XLSX.utils.json_to_sheet(dataToExport);
			const workBook: XLSX.WorkBook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workBook, workSheet, "Not uploaded review meeting");
			XLSX.writeFile(workBook, "Not uploaded review meeting.xlsx");
		} else if (val == 2) {
			let dataToExport = this.data2.map((x) => ({
				"State": x.state,
				"District": x.district,
				"MD Reported": x.md,
				"Deaths not Reviwed": x.dnotreviwed
			}));
			const workSheet = XLSX.utils.json_to_sheet(dataToExport);
			const workBook: XLSX.WorkBook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workBook, workSheet, "MD not reviwed by CMO");
			XLSX.writeFile(workBook, "MD not reviwed by CMO.xlsx");
		} else if (val == 3) {
			let dataToExport = this.data3.map((x) => ({
				"State": x.state,
				"District": x.district,
				"MD Reported": x.md,
				"Deaths not Reviwed": x.dnotreviwed
			}));
			const workSheet = XLSX.utils.json_to_sheet(dataToExport);
			const workBook: XLSX.WorkBook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workBook, workSheet, "MD not reviwed by DC DM");
			XLSX.writeFile(workBook, "MD not reviwed by DC DM.xlsx");
		}

	}
	ExportTableMDState(val) {
		if (val == 1) {
			let dataToExport = this.whereCbmdsrAndFbmdsrConductedDatasource.data.map((x) => ({

				"State": x.category,
				"# Reported (15-49)": x['reported'],
				"# Total MDs": x['totalMDs'],
				"# Total CBMDSR": x['column-2'],
				"# Total FBMDSR": x['column-1'],
			}));

			const workSheet = XLSX.utils.json_to_sheet(dataToExport);
			const workBook: XLSX.WorkBook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workBook, workSheet, "Maternal Deaths Statewise");
			XLSX.writeFile(workBook, "Maternal Deaths Statewise.xlsx");
		} else if (val == 2) {
			let dataToExport = this.whereCbmdsrAndFbmdsrConductedInDistrictDatasource.data.map((x) => ({

				"District": x.category,
				"# Reported (15-49)": x['reported'],
				"# Total MDs": x['totalMDs'],
				"# Total CBMDSR": x['column-2'],
				"# Total FBMDSR": x['column-1'],
			}));

			const workSheet = XLSX.utils.json_to_sheet(dataToExport);
			const workBook: XLSX.WorkBook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workBook, workSheet, "Maternal Deaths Districtwise");
			XLSX.writeFile(workBook, "Maternal Deaths Districtwise.xlsx");
		} else if (val == 3) {
			let dataToExport = this.whereCbmdsrAndFbmdsrConductedInBlockDatasource.data.map((x) => ({

				"Block": x.category,
				"# Reported (15-49)": x['reported'],
				"# Total MDs": x['totalMDs'],
				"# Total CBMDSR": x['column-2'],
				"# Total FBMDSR": x['column-1'],
			}));

			const workSheet = XLSX.utils.json_to_sheet(dataToExport);
			const workBook: XLSX.WorkBook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workBook, workSheet, "Maternal Deaths Blockwise");
			XLSX.writeFile(workBook, "Maternal Deaths Blockwise.xlsx");
		} else if (val == 4) {
			let dataToExport = this.blockwiseDetailsOfMaternalDeathsNotificationDatasource.data.map((x) => ({

				"District": x.district_id.districtname,
				"Block": x.block_id.subdistrictname,
				//"village":x.village_id.villagename,
				"Deseased Name": x.deceased_women_fname + x.deceased_women_lname + x.deceased_women_mname,
				"Deseased Husband Name": x.husband_name,
				"Place of Death": x.place_of_death,
				"Date and Time of Death": x.death_date_time
			}));

			const workSheet = XLSX.utils.json_to_sheet(dataToExport);
			const workBook: XLSX.WorkBook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workBook, workSheet, "Maternal Deaths Blockwise");
			XLSX.writeFile(workBook, "Maternal Deaths Blockwise.xlsx");
		}
	}

	CBMDSRFBMDSRMDExportTable(val) {
		if (val == 1) {
			let dataToExport = this.dataSourceformSubmittedStatus.data.map((x) => ({

				"State": x.statename,
				"Form 3": x.form1,
				"Form 5": x.form5,
				"Form 6": x.form6,
				"%(form5 / form 3)*100": round((x.form5 / x.form1) * 100,2)+"%"
			}));

			const workSheet = XLSX.utils.json_to_sheet(dataToExport);
			const workBook: XLSX.WorkBook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workBook, workSheet, "CBMDSR MD Statewise");
			XLSX.writeFile(workBook, "CBMDSR MD Statewise.xlsx");
		} else if (val == 2) {
			let dataToExport = this.dataSourceformSubmittedStatusFbmdsr.data.map((x) => ({

				"State": x.statename,
				"Form 3": x.form1,
				"Form 4": x.form4,
				"Form 6": x.form6,
				"%(form4 / form 3)*100": round((x.form4 / x.form1) * 100,2)+"%"
			}));

			const workSheet = XLSX.utils.json_to_sheet(dataToExport);
			const workBook: XLSX.WorkBook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workBook, workSheet, "FBMDSR MD Statewise");
			XLSX.writeFile(workBook, "FBMDSR MD Statewise.xlsx");
		} else if (val == 3) {
			let dataToExport = this.dataSourceformSubmittedStatusCbmdsrDistritwise.data.map((x) => ({

				"District": x.districtname,
				"Form 3": x.form1,
				"Form 5": x.form5,
				"Form 6": x.form6,
				"%(form5 / form 3)*100": round((x.form5 / x.form1) * 100,2)+"%"
			}));

			const workSheet = XLSX.utils.json_to_sheet(dataToExport);
			const workBook: XLSX.WorkBook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workBook, workSheet, "CBMDSR MD Districtwise");
			XLSX.writeFile(workBook, "CBMDSR MD Districtwise.xlsx");
		} else if (val == 4) {
			let dataToExport = this.dataSourceformSubmittedStatusFbmdsrDistritwise.data.map((x) => ({

				"District": x.districtname,
				"Form 3": x.form1,
				"Form 4": x.form4,
				"Form 6": x.form6,
				"%(form4 / form 3)*100": round((x.form4 / x.form1) * 100,2)+"%"
			}));

			const workSheet = XLSX.utils.json_to_sheet(dataToExport);
			const workBook: XLSX.WorkBook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workBook, workSheet, "FBMDSR MD Districtwise");
			XLSX.writeFile(workBook, "FBMDSR MD Statewise.xlsx");
		} else if (val == 5) {
			let dataToExport = this.dataSourceformSubmittedStatusCbmdsrBlockwise.data.map((x) => ({

				"Block": x.subdistrictname,
				"Form 3": x.form1,
				"Form 5": x.form5,
				"Form 6": x.form6,
				"%(form5 / form 3)*100": round((x.form5 / x.form1) * 100,2)+"%"
			}));

			const workSheet = XLSX.utils.json_to_sheet(dataToExport);
			const workBook: XLSX.WorkBook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workBook, workSheet, "CBMDSR MD Blockwise");
			XLSX.writeFile(workBook, "CBMDSR MD Blockwise.xlsx");
		} else if (val == 6) {
			let dataToExport = this.dataSourceformSubmittedStatusFbmdsrBlockwise.data.map((x) => ({

				"Block": x.subdistrictname,
				"Form 3": x.form1,
				"Form 4": x.form4,
				"Form 6": x.form6,
				"%(form4 / form 3)*100": round((x.form4 / x.form1) * 100,2)+"%"
			}));

			const workSheet = XLSX.utils.json_to_sheet(dataToExport);
			const workBook: XLSX.WorkBook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workBook, workSheet, "FBMDSR MD Blockwise");
			XLSX.writeFile(workBook, "FBMDSR MD Blockwise.xlsx");
		}

	}

	forBlockwiseMaternalDeathsNotificationExportTable(val) {
		let dataToExport = this.blockwiseMaternalDeathsNotificationDatasource.data.map((x) => ({
			"District": x.district_id.districtname,
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

	fbmdrVsCbmdrGraph(params) {
		let obj = {
			cbmdr: 0,
			code: "Ind",
			fbmdr: 0,
			name: "India",
			percent1: 0,
			statecode: 0,
			percent : "",
		}
		this.form4Service.fbmdrVsCbmdrSubmitted(params).subscribe(data => {
			this.stateDataCBOutOfFBMDSR = data;
			if (this.stateDataCBOutOfFBMDSR && this.stateDataCBOutOfFBMDSR) {
				this.stateDataCBOutOfFBMDSR.forEach(element => {
					obj.cbmdr += element.cbmdr;
					obj.fbmdr += element.fbmdr;
				});
				obj.percent1 = obj.fbmdr? Math.round((obj.cbmdr/obj.fbmdr)*100):0;
				obj.percent=String(obj.percent1)+"%";
			}

			this.stateDataCBOutOfFBMDSR.unshift(obj);
			this.totalCBOutOfFBMDSR()
		})
	}
	filterChange() {
		const { states, fromDate, toDate } = this.filterForm.value;
		this.getTopIndicatorData({ ...this.countParam, "state_id.statecode": { $in: states }, updatedAt: { "$gte": fromDate, "$lte": moment(toDate).add(1, 'day') } });
		this.getNotificationCount({ ...this.countParam, "state_id.statecode": { $in: states }, updatedAt: { "$gte": fromDate, "$lte": moment(toDate).add(1, 'day') } });
		this.getDeathsWhereCbmdsrAndFbmdsrConducted({});
		this.getSubmittedFormsStatus({ state_id: { "statecode": undefined } });
		this.getMaternalDeathTypesGraphData();
		this.getMostAndLeastDistrictsDeaths({ state_id: { "statecode": undefined } });
		this.getMaternalCauseOfdeathsFor6Months()
		this.getIcd10CodesCategorywise();
		this.fbmdrVsCbmdrGraph({ fromDate, toDate, statecodes: states, accessupto: 'National' }); //totalCBOutOfFBMDSR
		//this.getPlaceOfDeathStackBarGraph();
		this.fromDate = fromDate;
		this.toDate = toDate;
		this.setTitle()
		this.isShowMaternalDeathsDetails = false;
		this.isShowFormsStatusBlockwise = false;
		this.isShowFormsStatusDistrictwise = false;
	}

	@ViewChild('allSelected', { static: false }) private allSelected: MatOption;

	tosslePerOne(all) {
		if (this.allSelected.selected) {
			this.allSelected.deselect();
			return false;
		}
		if (this.filterForm.value.states.length == this.stateList.length)
			this.allSelected.select();
		this.filterChange();

	}
	toggleAllSelection() {
		if (this.allSelected.selected) {
			const statecodes: number[] = this.stateList.map(state => state.statecode);
			statecodes.push(0);
			this.filterForm.patchValue({ states: statecodes })
		} else {
			this.filterForm.patchValue({ states: [] })
		}
		this.filterChange();
	}

	stateWiseMDsExportTable() {
		let dataToExport = this.stateDatasource.data.map((x) => ({
			"State": x.state,
			"# Estimated Maternal Deaths": x.expected,
			"# Maternal Deaths Reported": x.actual,
		}));
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "State Wise Maternal Deaths Reported.xlsx");
	}

}
