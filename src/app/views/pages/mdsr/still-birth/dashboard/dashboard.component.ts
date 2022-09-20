import { AlertService } from './../../../../../utilities/alert.service';
import { Form1Service } from './../../../../../services/mdsr/form1.service';
import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import moment from 'moment';
import { StillbirthService } from '../../../../../services/stillbirth/stillbirth.service';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';

export interface PeriodicElement {
	name: string;
	position: number;
	M1: number;
	M2: number;
	M3: number;
	M4: number;
	M5: number;
	total: number;
}
export interface PeriodicElement1 {
	state: string;
	position: number;
	totalBirth: number;
	liveBirth: number;
	stillBirth: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
	{ position: 1, name: 'Birth Defects', M1: 6, M2: 28, M3: 4, M4: 27, M5: 104, total: 169 },
	{ position: 2, name: 'Infections', M1: 16, M2: 30, M3: 7, M4: 34, M5: 34, total: 121 },
	{ position: 3, name: 'Antepartum Hypoxia', M1: 577, M2: 552, M3: 266, M4: 735, M5: 118, total: 2311 },
	{ position: 4, name: 'Other Specified antepartum Disorder', M1: 47, M2: 83, M3: 69, M4: 50, M5: 32, total: 281 },
	{ position: 5, name: 'Disorder Related to fetal Growth', M1: 360, M2: 387, M3: 64, M4: 421, M5: 299, total: 1531 },
	{ position: 6, name: 'Fetal Death of Unspecified Cause', M1: 57, M2: 126, M3: 28, M4: 279, M5: 617, total: 1107 }
];

const ELEMENT_DATA1: PeriodicElement1[] = [
	{ position: 1, state: 'Delhi', totalBirth: 1000, liveBirth: 700, stillBirth: 300 },
	{ position: 2, state: 'Haryana', totalBirth: 800, liveBirth: 600, stillBirth: 200 },
	{ position: 3, state: 'Punjab', totalBirth: 1200, liveBirth: 800, stillBirth: 400 },
	{ position: 4, state: 'Himachal Pradesh', totalBirth: 500, liveBirth: 300, stillBirth: 200 },
	{ position: 5, state: 'Uttar Pradesh', totalBirth: 700, liveBirth: 400, stillBirth: 300 },
	{ position: 6, state: 'Maharashtra', totalBirth: 400, liveBirth: 300, stillBirth: 100 },
	{ position: 6, state: 'Kerala', totalBirth: 200, liveBirth: 150, stillBirth: 50 },
	{ position: 6, state: 'Behar', totalBirth: 1500, liveBirth: 1100, stillBirth: 400 }
];

@Component({
	selector: 'kt-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	activeTab = 'Current Month';
	private charts: Array<any> = [];
	currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    day: any
	mon: any;
	block_id: any;
	district_id: any;
	state_id: any;
	fromDate: any;
	toDate: any;
	where: any

	constructor(
		private zone: NgZone,
		private changeDetectorRef: ChangeDetectorRef,
		private stillBithService: StillbirthService,

		private alertService: AlertService
	) { }

	private createChart() {
		this.zone.runOutsideAngular(() => {
			const colors = [
				am4core.color('#f56528'),
				am4core.color('#fcd338'),
				am4core.color('#b0de33'),
				am4core.color('#0d8ecf')
			];

			// CART 4
			const chart4 = am4core.create('chart4', am4charts.XYChart);
			chart4.paddingRight = 20;

			chart4.colors.list = colors;


			// Create axes
			var dateAxis = chart4.xAxes.push(new am4charts.DateAxis());
			dateAxis.renderer.minGridDistance = 50;
			dateAxis.renderer.grid.template.location = 0.5;
			dateAxis.startLocation = 0.5;
			dateAxis.endLocation = 0.5;

			// Create value axis
			var valueAxis = chart4.yAxes.push(new am4charts.ValueAxis());

			chart4.legend = new am4charts.Legend();
			chart4.legend.align = 'center';
			chart4.legend.fontSize = 12;

			chart4.legend.markers.template.marginRight = 2;
			chart4.legend.markers.template.width = 16;
			chart4.legend.markers.template.height = 16;

			chart4.cursor = new am4charts.XYCursor();
			chart4.cursor.tooltipText = 'test';
			const chart4data = [

				{
					category: "July'19",
					'column-1': 54,
					'column-2': 652,
					'column-3': 253,
					'column-4': 365,
					'column-5': 444,
					'column-6': 333
				},
				{
					category: "Aug'20",
					'column-1': 500,
					'column-2': 100,
					'column-3': 250,
					'column-4': 500,
					'column-5': 120,
					'column-6': 263
				},
				{
					category: "Sep'20",
					'column-1': 50,
					'column-2': 152,
					'column-3': 321,
					'column-4': 123,
					'column-5': 412,
					'column-6': 215
				},
				{
					category: "Oct'20",
					'column-1': 54,
					'column-2': 652,
					'column-3': 253,
					'column-4': 365,
					'column-5': 444,
					'column-6': 333
				},
				{
					category: "Nov'20",
					'column-1': 500,
					'column-2': 100,
					'column-3': 250,
					'column-4': 500,
					'column-5': 120,
					'column-6': 263
				},
				{
					category: "Dec'20",
					'column-1': 50,
					'column-2': 152,
					'column-3': 321,
					'column-4': 123,
					'column-5': 412,
					'column-6': 215
				}
			];

			var xySeries201 = chart4.series.push(new am4charts.LineSeries());
			xySeries201.dataFields.valueY = 'column-1';
			xySeries201.dataFields.dateX = 'category';
			xySeries201.strokeWidth = 3;
			xySeries201.tensionX = 0.8;
			xySeries201.bullets.push(new am4charts.CircleBullet());
			xySeries201.data = chart4data;
			xySeries201.name = 'Birth Defects';
			xySeries201.tooltipText = '{name}: [bold]{valueY}[/]';
			xySeries201.strokeWidth = 1;

			var xySeries202 = chart4.series.push(new am4charts.LineSeries());
			xySeries202.dataFields.valueY = 'column-2';
			xySeries202.dataFields.dateX = 'category';
			xySeries202.strokeWidth = 3;
			xySeries202.tensionX = 0.8;
			xySeries202.bullets.push(new am4charts.CircleBullet());
			xySeries202.data = chart4data;
			xySeries202.name = 'Infections';
			xySeries202.tooltipText = '{name}: [bold]{valueY}[/]';
			xySeries202.strokeWidth = 1;

			var xySeries3 = chart4.series.push(new am4charts.LineSeries());
			xySeries3.dataFields.valueY = 'column-3';
			xySeries3.dataFields.dateX = 'category';
			xySeries3.strokeWidth = 3;
			xySeries3.tensionX = 0.8;
			xySeries3.bullets.push(new am4charts.CircleBullet());
			xySeries3.data = chart4data;
			xySeries3.name = 'Antepartum Hypoxia';
			xySeries3.tooltipText = '{name}: [bold]{valueY}[/]';
			xySeries3.strokeWidth = 1;

			var xySeries4 = chart4.series.push(new am4charts.LineSeries());
			xySeries4.dataFields.valueY = 'column-4';
			xySeries4.dataFields.dateX = 'category';
			xySeries4.strokeWidth = 3;
			xySeries4.tensionX = 0.8;
			xySeries4.bullets.push(new am4charts.CircleBullet());
			xySeries4.data = chart4data;
			xySeries4.name = 'Other Specified antepartum Disorder';
			xySeries4.tooltipText = '{name}: [bold]{valueY}[/]';
			xySeries4.strokeWidth = 1;

			var xySeries5 = chart4.series.push(new am4charts.LineSeries());
			xySeries5.dataFields.valueY = 'column-5';
			xySeries5.dataFields.dateX = 'category';
			xySeries5.strokeWidth = 3;
			xySeries5.tensionX = 0.8;
			xySeries5.bullets.push(new am4charts.CircleBullet());
			xySeries5.data = chart4data;
			xySeries5.name = 'Disorder Related to fetal Growth';
			xySeries5.tooltipText = '{name}: [bold]{valueY}[/]';
			xySeries5.strokeWidth = 1;

			var xySeries6 = chart4.series.push(new am4charts.LineSeries());
			xySeries6.dataFields.valueY = 'column-6';
			xySeries6.dataFields.dateX = 'category';
			xySeries6.strokeWidth = 3;
			xySeries6.tensionX = 0.8;
			xySeries6.bullets.push(new am4charts.CircleBullet());
			xySeries6.data = chart4data;
			xySeries6.name = 'Fetal Death of Unspecified Cause';
			xySeries6.tooltipText = '{name}: [bold]{valueY}[/]';
			xySeries6.strokeWidth = 1;

			this.charts.push(chart4);
		});
	}
	result:any;
	ngOnInit() {

		this.mon = moment().month() + 1;
		if (moment().date() > 10) {
			this.day = moment().date();
		} else {
			this.day = "0" + moment().date();
		}
		if (this.currentUser.accessupto == "Block") {
			this.block_id = this.currentUser.user_block_id['subdistrictcode'];
			
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
			"state.statecode": this.state_id ? this.state_id : undefined,
			"district.districtcode": this.district_id ? this.district_id : undefined,
			"block.subdistrictcode": this.block_id ? this.block_id : undefined,
			updatedAt: {
				"$gte": this.fromDate,
				"$lte": this.toDate
			}
		}
		
		this.stillBithService.getNotificationCount(this.where).subscribe(res => {
			console.log('res', res);
			if (res.length > 0) {
				this.result=res[0];
				this.chart1();
				this.chart2();
				// this.maternalDeathsNotification.push({
				// 	cbmdsr: { count: res[0]['CB'], type: "CBMDSR" },
				// 	fbmdsr: { count: res[0]['FB'], type: "FBMDSR" }
				// })
			}
			//this.getNotificationDetails({ type: "CBMDSR" });
			this.changeDetectorRef.detectChanges();
		});
	}

	displayedColumns: string[] = ['position', 'name', 'M1', 'M2', 'M3', 'M4', 'M5', 'total'];
	dataSource = ELEMENT_DATA;


	displayedColumns1: string[] = ['position', 'state', 'totalBirth', 'liveBirth', 'stillBirth'];
	dataSource1 = ELEMENT_DATA1;

	ngAfterViewInit() {
		this.createChart();
	}

	chart1(){
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
				category: 'Yes',
				'column-1': this.result.consanguineous_marriage_yes,
				color: am4core.color('#f34225')
			},
			{
				category: 'No',
				'column-1': this.result.consanguineous_marriage_no,
				color: am4core.color('#fa9e30')
			},
			{
				category: 'UnKnown',
				'column-1': this.result.consanguineous_marriage_unknown,
				color: am4core.color('#fcd338')
			},
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

		title1.text = 'Consanguineous Marriage (2020)';
		title1.fontSize = 15;

		this.charts.push(chart1);


	}

	chart2(){
		const colors = [
			am4core.color('#f56528'),
			am4core.color('#fcd338'),
			am4core.color('#b0de33'),
			am4core.color('#0d8ecf')
		];


		
		// CART 2
		const chart2 = am4core.create('chart2', am4charts.PieChart);
		chart2.colors.list = colors;

		chart2.innerRadius = am4core.percent(35);

		chart2.data = [
			{
				category: 'Male',
				'column-1': this.result.gender_Male,
				color: am4core.color('#f34225')
			},
			{
				category: 'Female',
				'column-1': this.result.gender_Female,
				color: am4core.color('#fa9e30')
			},
			{
				category: 'Ambiguous',
				'column-1': this.result.gender_Ambiguous,
				color: am4core.color('#fcd338')
			},
		];

		var pieSeries = chart2.series.push(new am4charts.PieSeries());
		pieSeries.dataFields.value = 'column-1';
		pieSeries.dataFields.category = 'category';
		pieSeries.slices.template.propertyFields.fill = 'color';

		pieSeries.ticks.template.disabled = true;
		pieSeries.alignLabels = false;
		pieSeries.labels.template.text = "{value.percent.formatNumber('#.0')}%";
		pieSeries.labels.template.radius = am4core.percent(-30);
		pieSeries.labels.template.fontWeight = "600";

		chart2.legend = new am4charts.Legend();
		chart2.legend.align = 'center';
		chart2.legend.fontSize = 12;
		chart2.legend.labels.template.text = '{category}';
		chart2.legend.valueLabels.template.text = '';

		chart2.legend.markers.template.marginRight = 2;
		chart2.legend.markers.template.width = 16;
		chart2.legend.markers.template.height = 16;

		const title2 = chart2.titles.create();

		title2.text = 'Sex of the Baby';
		title2.fontSize = 15;

		this.charts.push(chart2);

	}
}
