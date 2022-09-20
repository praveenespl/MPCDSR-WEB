import {
	Component,
	OnInit,
	AfterViewInit,
	OnDestroy,
	NgZone,
	ChangeDetectorRef
} from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { Form1Service } from '../../../../services/mdsr/form1.service';
import moment from 'moment';
import { AlertService } from '../../../../utilities/alert.service';
import Swal from 'sweetalert2';
am4core.useTheme(am4themes_animated);

@Component({
	selector: 'kt-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
	callingFrom = undefined;
	mapChartDiv = 'states';
	activeTab = 'Current Month';
	private charts: Array<any> = [];
	currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
	isShowNotificationDetailTable = false;
	// DUMMY DATA::START
	stateFacilityDeliveryDataSource = [
		{
			state: 'Andra Pradesh',
			HighDel2018Data: 50,
			HighDel2019Data: 60,
			LowDel2018Data: 55,
			LowDel2019Data: 60
		},
		{
			state: 'Arunachal Pradesh',
			HighDel2018Data: 15,
			HighDel2019Data: 20,
			LowDelenabled2018Data: 25,
			LowDel2019Data: 30
		},
		{
			state: 'Assam',
			HighDel2018Data: 12,
			HighDel2019Data: 10,
			LowDel2018Data: 8,
			LowDel2019Data: 19
		},
		{
			state: 'Bihar',
			HighDel2018Data: 17,
			HighDel2019Data: 21,
			LowDel2018Data: 20,
			LowDel2019Data: 25
		},
		{
			state: 'Andra Pradesh',
			HighDel2018Data: 15,
			HighDel2019Data: 36,
			LowDel2018Data: 44,
			LowDel2019Data: 54
		},
		{
			state: 'Chhattisgarh',
			HighDel2018Data: 12,
			HighDel2019Data: 6,
			LowDel2018Data: 11,
			LowDel2019Data: 21
		},
		{
			state: 'Goa',
			HighDel2018Data: 78,
			HighDel2019Data: 7,
			LowDel2018Data: 86,
			LowDel2019Data: 6
		},
		{
			state: 'Gujarat',
			HighDel2018Data: 95,
			HighDel2019Data: 36,
			LowDel2018Data: 50,
			LowDel2019Data: 61
		},
		{
			state: 'Haryana',
			HighDel2018Data: 58,
			HighDel2019Data: 68,
			LowDel2018Data: 55,
			LowDel2019Data: 68
		},
		{
			state: 'Himachal Pradesh',
			HighDel2018Data: 15,
			HighDel2019Data: 16,
			LowDel2018Data: 15,
			LowDel2019Data: 16
		},
		{
			state: 'Jammu and Kashmir',
			HighDel2018Data: 655,
			HighDel2019Data: 52,
			LowDel2018Data: 33,
			LowDel2019Data: 65
		},
		{
			state: 'Jharkhand',
			HighDel2018Data: 52,
			HighDel2019Data: 62,
			LowDel2018Data: 52,
			LowDel2019Data: 62
		},
		{
			state: 'Karnataka',
			HighDel2018Data: 53,
			HighDel2019Data: 633,
			LowDel2018Data: 53,
			LowDel2019Data: 63
		},
		{
			state: 'Kerala',
			HighDel2018Data: 54,
			HighDel2019Data: 64,
			LowDel2018Data: 54,
			LowDel2019Data: 64
		},
		{
			state: 'Madya Pradesh',
			HighDel2018Data: 55,
			HighDel2019Data: 546,
			LowDel2018Data: 55,
			LowDel2019Data: 64
		},
		{
			state: 'Maharashtra',
			HighDel2018Data: 54,
			HighDel2019Data: 67,
			LowDel2018Data: 57,
			LowDel2019Data: 63
		},
		{
			state: 'Manipur',
			HighDel2018Data: 9,
			HighDel2019Data: 6,
			LowDel2018Data: 54,
			LowDel2019Data: 64
		},
		{
			state: 'Meghalaya',
			HighDel2018Data: 8,
			HighDel2019Data: 8,
			LowDel2018Data: 96,
			LowDel2019Data: 66
		},
		{
			state: 'Mizoram',
			HighDel2018Data: 12,
			HighDel2019Data: 6,
			LowDel2018Data: 69,
			LowDel2019Data: 6
		},
		{
			state: 'Nagaland',
			HighDel2018Data: 5,
			HighDel2019Data: 15,
			LowDel2018Data: 5,
			LowDel2019Data: 25
		},
		{
			state: 'Orissa',
			HighDel2018Data: 77,
			HighDel2019Data: 76,
			LowDel2018Data: 57,
			LowDel2019Data: 67
		},
		{
			state: 'Punjab',
			HighDel2018Data: 55,
			HighDel2019Data: 56,
			LowDel2018Data: 5,
			LowDel2019Data: 56
		},
		{
			state: 'Rajasthan',
			HighDel2018Data: 5,
			HighDel2019Data: 6,
			LowDel2018Data: 5,
			LowDel2019Data: 6
		},
		{
			state: 'Sikkim',
			HighDel2018Data: 895,
			HighDel2019Data: 86,
			LowDel2018Data: 57,
			LowDel2019Data: 64
		},
		{
			state: 'Tamil Nadu',
			HighDel2018Data: 565,
			HighDel2019Data: 566,
			LowDel2018Data: 511,
			LowDel2019Data: 654
		},
		{
			state: 'Telangana',
			HighDel2018Data: 95,
			HighDel2019Data: 6,
			LowDel2018Data: 599,
			LowDel2019Data: 6
		},
		{
			state: 'Tripura',
			HighDel2018Data: 75,
			HighDel2019Data: 6,
			LowDel2018Data: 75,
			LowDel2019Data: 6
		},
		{
			state: 'Uttarakhand',
			HighDel2018Data: 445,
			HighDel2019Data: 6,
			LowDel2018Data: 5,
			LowDel2019Data: 346
		},
		{
			state: 'Uttar Pradesh',
			HighDel2018Data: 665,
			HighDel2019Data: 6,
			LowDel2018Data: 599,
			LowDel2019Data: 677
		},
		{
			state: 'West Bengal',
			HighDel2018Data: 155,
			HighDel2019Data: 780,
			LowDel2018Data: 58,
			LowDel2019Data: 697
		}
	];
	fromDate;
	toDate;
	districtwiseDeaths = [
		{
			state: 'DHUBRI',
			expected: 50,
			actual: 44,
			percentage: 90
		},
		{
			state: 'DUNGAPUR',
			expected: 105,
			actual: 90,
			percentage: 80
		},
		{
			state: 'ETAH',
			expected: 220,
			actual: 150,
			percentage: 60
		},
		{
			state: 'KARIMGANJ',
			expected: 152,
			actual: 60,
			percentage: 40
		},
		{
			state: 'KOBRA',
			expected: 645,
			actual: 550,
			percentage: 75
		},
		{
			state: 'Aligadh',
			expected: 200,
			actual: 150,
			percentage: 75
		},
		{
			state: 'Johanabaad',
			expected: 504,
			actual: 204,
			percentage: 40
		},
		{
			state: 'Dharbanga',
			expected: 808,
			actual: 208,
			percentage: 20
		},
		{
			state: 'Bareily',
			expected: 316,
			actual: 200,
			percentage: 60
		},
		{
			state: 'Gorakhpur',
			expected: 540,
			actual: 200,
			percentage: 42
		},
		{
			state: 'Baksh',
			expected: 300,
			actual: 200,
			percentage: 70
		},
		{
			state: 'Lakhimpur',
			expected: 120,
			actual: 60,
			percentage: 50
		},
		{
			state: 'golaghat',
			expected: 845,
			actual: 210,
			percentage: 38
		},
		{
			state: 'Nagaon',
			expected: 600,
			actual: 315,
			percentage: 51
		},
		{
			state: 'Khordha',
			expected: 900,
			actual: 315,
			percentage: 30
		},
		{
			state: 'Bhadrak',
			expected: 850,
			actual: 275,
			percentage: 35
		},
		{
			state: 'Balasore',
			expected: 1050,
			actual: 400,
			percentage: 32
		},
		{
			state: 'Jajpur',
			expected: 1123,
			actual: 600,
			percentage: 57
		}
	];
	// DUMMY DATA::END

	//maternal deaths notification array
	maternalDeathsNotification = [];
	blockwiseMaternalDeathsNotification = []

	constructor(
		private zone: NgZone,
		private changeDetectorRef: ChangeDetectorRef,
		private form1Service: Form1Service,
		private alertService: AlertService
	) { }

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
				// {
				// 	category: 'Indirect causes',
				// 	'column-1': this.MaternalCauses.IndirectCausePreviousYear,
				// 	color: am4core.color('#b0de33')
				// },
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

			title1.text = 'Maternal Death Cause : 2020';
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
				// {
				// 	category: 'Indirect causes',
				// 	'column-1': this.MaternalCauses.IndirectCauseCurrentYear,
				// 	color: am4core.color('#b0de33')
				// },
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

			title2.text = 'Maternal Death Cause : 2021';
			title2.fontSize = 15;

			this.charts.push(chart2);

			// CART 3







			// // CART 9
			// var chart9 = am4core.create('chart9', am4charts.XYChart);

			// // Add data
			// chart9.data = [
			// 	{
			// 		category: 'Balaghat',
			// 		'column-1': 94,
			// 		'column-2': 90
			// 	},
			// 	{
			// 		category: 'Jabalpur',
			// 		'column-1': 88,
			// 		'column-2': 87
			// 	},
			// 	{
			// 		category: 'Sukma',
			// 		'column-1': 85,
			// 		'column-2': 82
			// 	},
			// 	{
			// 		category: 'Bilaspur',
			// 		'column-1': 78,
			// 		'column-2': 75
			// 	},
			// 	{
			// 		category: 'Durg',
			// 		'column-1': 76,
			// 		'column-2': 72
			// 	},
			// 	{
			// 		category: 'Hamirpur',
			// 		'column-1': 65,
			// 		'column-2': 61
			// 	},
			// 	{
			// 		category: 'Solan',
			// 		'column-1': 63,
			// 		'column-2': 60
			// 	},
			// 	{
			// 		category: 'Golaghat',
			// 		'column-1': 61,
			// 		'column-2': 58
			// 	},
			// 	{
			// 		category: 'Dhubri',
			// 		'column-1': 58,
			// 		'column-2': 55
			// 	},
			// 	{
			// 		category: 'Angul',
			// 		'column-1': 55,
			// 		'column-2': 52
			// 	},
			// 	{
			// 		category: 'Balasore',
			// 		'column-1': 51,
			// 		'column-2': 50
			// 	},
			// 	{
			// 		category: 'Nayagarh',
			// 		'column-1': 49,
			// 		'column-2': 48
			// 	},
			// 	{
			// 		category: 'Jalpaiguri',
			// 		'column-1': 46,
			// 		'column-2': 45
			// 	},
			// 	{
			// 		category: 'Murshidabad',
			// 		'column-1': 42,
			// 		'column-2': 43
			// 	},
			// 	{
			// 		category: 'Anantapur',
			// 		'column-1': 38,
			// 		'column-2': 41
			// 	},
			// 	{
			// 		category: 'Kurnool',
			// 		'column-1': 35,
			// 		'column-2': 38
			// 	},
			// 	{
			// 		category: 'Samastipur',
			// 		'column-1': 32,
			// 		'column-2': 30
			// 	},
			// 	{
			// 		category: 'Darbhanga',
			// 		'column-1': 30,
			// 		'column-2': 28
			// 	},
			// 	{
			// 		category: 'Bokaro',
			// 		'column-1': 28,
			// 		'column-2': 25
			// 	},
			// 	{
			// 		category: 'Sahibganj',
			// 		'column-1': 28,
			// 		'column-2': 24
			// 	},
			// 	{
			// 		category: 'Ferozepur',
			// 		'column-1': 28,
			// 		'column-2': 28
			// 	},
			// 	{
			// 		category: 'Muktsar',
			// 		'column-1': 28,
			// 		'column-2': 25
			// 	},
			// 	{
			// 		category: 'Etawah',
			// 		'column-1': 25,
			// 		'column-2': 16
			// 	},
			// 	{
			// 		category: 'Mirzapur',
			// 		'column-1': 22,
			// 		'column-2': 21
			// 	},
			// 	{
			// 		category: 'Gorakhpur',
			// 		'column-1': 21,
			// 		'column-2': 18
			// 	},
			// 	{
			// 		category: 'Karimnagar',
			// 		'column-1': 19,
			// 		'column-2': 22
			// 	},
			// 	{
			// 		category: 'Medchal',
			// 		'column-1': 15,
			// 		'column-2': 17
			// 	},
			// 	{
			// 		category: 'Zunheboto',
			// 		'column-1': 10,
			// 		'column-2': 6
			// 	},
			// 	{
			// 		category: 'Dimapur',
			// 		'column-1': 8,
			// 		'column-2': 7
			// 	}
			// ];

			// // Create axes
			// var categoryAxis = chart9.xAxes.push(new am4charts.CategoryAxis());
			// categoryAxis.dataFields.category = 'category';
			// // categoryAxis.title.text = "";
			// categoryAxis.renderer.grid.template.location = 0;
			// categoryAxis.renderer.minGridDistance = 20;

			// var label = categoryAxis.renderer.labels.template;

			// label.truncate = true;
			// label.maxWidth = 200;
			// label.tooltipText = '{category}';

			// categoryAxis.events.on('sizechanged', function(ev) {
			// 	let axis = ev.target;
			// 	var cellWidth =
			// 		axis.pixelWidth / (axis.endIndex - axis.startIndex);
			// 	if (cellWidth < axis.renderer.labels.template.maxWidth) {
			// 		axis.renderer.labels.template.rotation = -45;
			// 		axis.renderer.labels.template.horizontalCenter = 'right';
			// 		axis.renderer.labels.template.verticalCenter = 'middle';
			// 	} else {
			// 		axis.renderer.labels.template.rotation = 0;
			// 		axis.renderer.labels.template.horizontalCenter = 'middle';
			// 		axis.renderer.labels.template.verticalCenter = 'top';
			// 	}
			// });

			// var valueAxis = chart9.yAxes.push(new am4charts.ValueAxis());
			// valueAxis.title.text = '% Maternal Deaths';

			// // Create series
			// var series403 = chart9.series.push(new am4charts.ColumnSeries());
			// series403.dataFields.valueY = 'column-1';
			// series403.dataFields.categoryX = 'category';
			// series403.name = 'Reviewd By CMO';
			// // series201.tooltipText = "{name}: [bold]{valueY}[/]";
			// // series201.strokeWidth = 3;
			// // series403.bullets.push(new am4charts.CircleBullet());

			// var series404 = chart9.series.push(new am4charts.ColumnSeries());
			// series404.dataFields.valueY = 'column-2';
			// series404.dataFields.categoryX = 'category';
			// series404.name = 'Reviewd By DC';
			// // series202.tooltipText = "{name}: [bold]{valueY}[/]";
			// // series202.strokeWidth = 3;
			// // series302.bullets.push(new am4charts.CircleBullet());

			// // Add legend
			// chart9.legend = new am4charts.Legend();

			// this.charts.push(chart9);

			// CART 10
			var chart10 = am4core.create('chart10', am4charts.XYChart);

			// Add data
			chart10.data = [
				{
					_id: '5ca302fe068f1b793542dbd1',
					'1': 1,
					'2': 'Anantpur',
					'3': 1,
					'4': 2113,
					'5': 320,
					'6': 2433,
					'7': 2602,
					'8': -6.5,
					'9': 2,
					'10': 1253,
					'11': 120,
					'12': 1373,
					'13': 1596,
					'14': -13.97,
					'15': 6,
					'16': 1542,
					'17': 135,
					'18': 1677,
					'19': 1797,
					'20': -6.68,
					'21': 4908,
					'22': 575,
					'23': 5483,
					'24': 5995,
					'25': -8.54,
					color: '#ef5350'
				},
				{
					_id: '5ca302fe068f1b793542dbd2',
					'1': 2,
					'2': 'Anjaw',
					'3': 1,
					'4': 3809,
					'5': 499,
					'6': 4308,
					'7': 4466,
					'8': -3.54,
					'9': 1,
					'10': 320,
					'11': 15,
					'12': 335,
					'13': 99,
					'14': 238.38,
					'15': 4,
					'16': 526,
					'17': 34,
					'18': 560,
					'19': 523,
					'20': 7.07,
					'21': 4655,
					'22': 548,
					'23': 5203,
					'24': 5088,
					'25': 2.26,
					color: '#66bb6a'
				},
				{
					_id: '5ca302fe068f1b793542dbd3',
					'1': 3,
					'2': 'Baksa',
					'3': 1,
					'4': 3494,
					'5': 475,
					'6': 3969,
					'7': 4232,
					'8': -6.21,
					'9': 3,
					'10': 1439,
					'11': 186,
					'12': 1625,
					'13': 1737,
					'14': -6.45,
					'15': 9,
					'16': 1899,
					'17': 225,
					'18': 2124,
					'19': 2109,
					'20': 0.71,
					'21': 6832,
					'22': 886,
					'23': 7718,
					'24': 8078,
					'25': -4.46,
					color: '#ef5350'
				},
				{
					_id: '5ca302fe068f1b793542dbd4',
					'1': 4,
					'2': 'Barpeta',
					'3': 1,
					'4': 1276,
					'5': 176,
					'6': 1452,
					'7': 1497,
					'8': -3.01,
					'9': 1,
					'10': 1575,
					'11': 211,
					'12': 1786,
					'13': 1596,
					'14': 11.9,
					'15': 3,
					'16': 567,
					'17': 63,
					'18': 630,
					'19': 794,
					'20': -20.65,
					'21': 3418,
					'22': 450,
					'23': 3868,
					'24': 3887,
					'25': -0.49,
					color: '#ef5350'
				},
				{
					_id: '5ca302fe068f1b793542dbd5',
					'1': 5,
					'2': 'Darbhanga',
					'3': 1,
					'4': 408,
					'5': 71,
					'6': 479,
					'7': 841,
					'8': -43.04,
					'9': 1,
					'10': 105,
					'11': 20,
					'12': 125,
					'13': 114,
					'14': 9.65,
					'15': 5,
					'16': 683,
					'17': 39,
					'18': 722,
					'19': 1063,
					'20': -32.08,
					'21': 1196,
					'22': 130,
					'23': 1326,
					'24': 2018,
					'25': -34.29,
					color: '#ef5350'
				},
				{
					_id: '5ca302fe068f1b793542dbd6',
					'1': 6,
					'2': 'Guna',
					'3': 1,
					'4': 1435,
					'5': 146,
					'6': 1581,
					'7': 2028,
					'8': -22.04,
					'9': 1,
					'10': 435,
					'11': 49,
					'12': 484,
					'13': 522,
					'14': -7.28,
					'15': 4,
					'16': 1116,
					'17': 119,
					'18': 1235,
					'19': 1456,
					'20': -15.18,
					'21': 2986,
					'22': 314,
					'23': 3300,
					'24': 4006,
					'25': -17.62,
					color: '#ef5350'
				},
				{
					_id: '5ca302fe068f1b793542dbd7',
					'1': 7,
					'2': 'Jabalpur',
					'3': 1,
					'4': 1635,
					'5': 174,
					'6': 1809,
					'7': 2250,
					'8': -19.6,
					'9': 1,
					'10': 2569,
					'11': 303,
					'12': 2872,
					'13': 2759,
					'14': 4.1,
					'15': 6,
					'16': 841,
					'17': 88,
					'18': 929,
					'19': 1125,
					'20': -17.42,
					'21': 5045,
					'22': 565,
					'23': 5610,
					'24': 6134,
					'25': -8.54,
					color: '#ef5350'
				},
				{
					_id: '5ca302fe068f1b793542dbd8',
					'1': 8,
					'2': 'Kinnaur',
					'3': 1,
					'4': 1444,
					'5': 175,
					'6': 1619,
					'7': 2768,
					'8': -41.51,
					'9': 1,
					'10': 1508,
					'11': 207,
					'12': 1715,
					'13': 1820,
					'14': -5.77,
					'15': 13,
					'16': 2624,
					'17': 317,
					'18': 2941,
					'19': 2563,
					'20': 14.75,
					'21': 5576,
					'22': 699,
					'23': 6275,
					'24': 7151,
					'25': -12.25,
					color: '#ef5350'
				},
				{
					_id: '5ca302fe068f1b793542dbdd',
					'1': 13,
					'2': 'LudhiaTiruvallur',
					'3': 1,
					'4': 5588,
					'5': 751,
					'6': 6339,
					'7': 6847,
					'8': -7.42,
					'9': 4,
					'10': 2725,
					'11': 355,
					'12': 3080,
					'13': 3138,
					'14': -1.85,
					'15': 12,
					'16': 4124,
					'17': 458,
					'18': 4582,
					'19': 4675,
					'20': -1.99,
					'21': 12437,
					'22': 1564,
					'23': 14001,
					'24': 14660,
					'25': -4.5,
					color: '#ef5350'
				},
				{
					_id: '5ca302fe068f1b793542dbd9',
					'1': 9,
					'2': 'Mahoba',
					'3': 1,
					'4': 2553,
					'5': 335,
					'6': 2888,
					'7': 3761,
					'8': -23.21,
					'9': 0,
					'10': 0,
					'11': '',
					'12': 0,
					'13': 0,
					'14': '',
					'15': 4,
					'16': 565,
					'17': 57,
					'18': 622,
					'19': 544,
					'20': 14.34,
					'21': 3118,
					'22': 392,
					'23': 3510,
					'24': 4305,
					'25': -18.47,
					color: '#ef5350'
				},
				{
					_id: '5ca302fe068f1b793542dbda',
					'1': 10,
					'2': 'Narayanpur',
					'3': 1,
					'4': 1961,
					'5': 283,
					'6': 2244,
					'7': 2404,
					'8': -6.66,
					'9': 3,
					'10': 3043,
					'11': 324,
					'12': 3367,
					'13': 4159,
					'14': -19.04,
					'15': 12,
					'16': 1553,
					'17': 163,
					'18': 1716,
					'19': 1999,
					'20': -14.16,
					'21': 6557,
					'22': 770,
					'23': 7327,
					'24': 8562,
					'25': -14.42,
					color: '#ef5350'
				},
				{
					_id: '5ca302fe068f1b793542dbdb',
					'1': 11,
					'2': 'Pilibhit',
					'3': 1,
					'4': 5244,
					'5': 606,
					'6': 5850,
					'7': 5982,
					'8': -2.21,
					'9': 2,
					'10': 1032,
					'11': 146,
					'12': 1178,
					'13': 1179,
					'14': -0.08,
					'15': 12,
					'16': 1855,
					'17': 206,
					'18': 2061,
					'19': 2130,
					'20': -3.24,
					'21': 8131,
					'22': 958,
					'23': 9089,
					'24': 9291,
					'25': -2.17,
					color: '#ef5350'
				},
				{
					_id: '5ca302fe068f1b793542dbdc',
					'1': 12,
					'2': 'Tirunelveli',
					'3': 1,
					'4': 1657,
					'5': 204,
					'6': 1861,
					'7': 1675,
					'8': 11.1,
					'9': 3,
					'10': 1742,
					'11': 166,
					'12': 1908,
					'13': 2097,
					'14': -9.01,
					'15': 5,
					'16': 307,
					'17': 34,
					'18': 341,
					'19': 384,
					'20': -11.2,
					'21': 3706,
					'22': 404,
					'23': 4110,
					'24': 4156,
					'25': -1.11,
					color: '#ef5350'
				},
				{
					_id: '5ca302fe068f1b793542dbde',
					'1': 14,
					'2': 'Udaipur',
					'3': 1,
					'4': 2252,
					'5': 292,
					'6': 2544,
					'7': 2499,
					'8': 1.8,
					'9': 2,
					'10': 1524,
					'11': 195,
					'12': 1719,
					'13': 1982,
					'14': -13.27,
					'15': 4,
					'16': 443,
					'17': 34,
					'18': 477,
					'19': 631,
					'20': -24.41,
					'21': 4219,
					'22': 521,
					'23': 4740,
					'24': 5112,
					'25': -7.28,
					color: '#ef5350'
				},
				{
					_id: '5ca302fe068f1b793542dbdf',
					'1': 15,
					'2': 'Unnao',
					'3': 1,
					'4': 3732,
					'5': 410,
					'6': 4142,
					'7': 4421,
					'8': -6.31,
					'9': 0,
					'10': 0,
					'11': '',
					'12': 0,
					'13': 0,
					'14': '',
					'15': 6,
					'16': 1342,
					'17': 145,
					'18': 1487,
					'19': 1499,
					'20': -0.8,
					'21': 5074,
					'22': 555,
					'23': 5629,
					'24': 5920,
					'25': -4.92,
					color: '#ef5350'
				},
				{
					_id: '5ca302fe068f1b793542dbe0',
					'1': 16,
					'2': 'Vellore',
					'3': 1,
					'4': 1736,
					'5': 295,
					'6': 2031,
					'7': 1948,
					'8': 4.26,
					'9': 2,
					'10': 2116,
					'11': 276,
					'12': 2392,
					'13': 2006,
					'14': 19.24,
					'15': 5,
					'16': 702,
					'17': 87,
					'18': 789,
					'19': 851,
					'20': -7.29,
					'21': 4554,
					'22': 658,
					'23': 5212,
					'24': 4805,
					'25': 8.47,
					color: '#66bb6a'
				},
				{
					_id: '5ca302fe068f1b793542dbe1',
					'1': 17,
					'2': 'Varanasi',
					'3': 1,
					'4': 1702,
					'5': 222,
					'6': 1924,
					'7': 1820,
					'8': 5.71,
					'9': 3,
					'10': 1448,
					'11': 207,
					'12': 1655,
					'13': 1535,
					'14': 7.82,
					'15': 5,
					'16': 1289,
					'17': 146,
					'18': 1435,
					'19': 1180,
					'20': 21.61,
					'21': 4439,
					'22': 575,
					'23': 5014,
					'24': 4535,
					'25': 10.56,
					color: '#66bb6a'
				},
				{
					_id: '5ca302fe068f1b793542dbe2',
					'1': 18,
					'2': 'Vishakhapatnam',
					'3': 1,
					'4': 1491,
					'5': 150,
					'6': 1641,
					'7': 1272,
					'8': 29.01,
					'9': 1,
					'10': 537,
					'11': 74,
					'12': 611,
					'13': 460,
					'14': 32.83,
					'15': 3,
					'16': 405,
					'17': 55,
					'18': 460,
					'19': 713,
					'20': -35.48,
					'21': 2433,
					'22': 279,
					'23': 2712,
					'24': 2445,
					'25': 10.92,
					color: '#66bb6a'
				},
				{
					_id: '5ca302fe068f1b793542dbe3',
					'1': 19,
					'2': 'West Godavari',
					'3': 1,
					'4': 2755,
					'5': 370,
					'6': 3125,
					'7': 3256,
					'8': -4.02,
					'9': 3,
					'10': 3626,
					'11': 411,
					'12': 4037,
					'13': 4407,
					'14': -8.4,
					'15': 10,
					'16': 1395,
					'17': 145,
					'18': 1540,
					'19': 1488,
					'20': 3.49,
					'21': 7776,
					'22': 926,
					'23': 8702,
					'24': 9151,
					'25': -4.91,
					color: '#ef5350'
				},
				{
					_id: '5ca302fe068f1b793542dbe4',
					'1': 20,
					'2': 'West Karbi Anglong',
					'3': 1,
					'4': 1280,
					'5': 162,
					'6': 1442,
					'7': 1239,
					'8': 16.38,
					'9': 1,
					'10': 271,
					'11': 30,
					'12': 301,
					'13': 299,
					'14': 0.67,
					'15': 4,
					'16': 576,
					'17': 51,
					'18': 627,
					'19': 712,
					'20': -11.94,
					'21': 2127,
					'22': 243,
					'23': 2370,
					'24': 2250,
					'25': 5.33,
					color: '#66bb6a'
				},
				{
					_id: '5ca302fe068f1b793542dbe5',
					'1': 21,
					'2': 'West Sikkim',
					'3': 1,
					'4': 3994,
					'5': 483,
					'6': 4477,
					'7': 4364,
					'8': 2.59,
					'9': 4,
					'10': 3734,
					'11': 493,
					'12': 4227,
					'13': 4171,
					'14': 1.34,
					'15': 8,
					'16': 1660,
					'17': 187,
					'18': 1847,
					'19': 1791,
					'20': 3.13,
					'21': 9388,
					'22': 1163,
					'23': 10551,
					'24': 10326,
					'25': 2.18,
					color: '#66bb6a'
				},
				{
					_id: '5ca302fe068f1b793542dbe6',
					'1': 22,
					'2': 'zunheboto',
					'3': 1,
					'4': 1417,
					'5': 183,
					'6': 1600,
					'7': 1659,
					'8': -3.56,
					'9': 2,
					'10': 629,
					'11': 75,
					'12': 704,
					'13': 562,
					'14': 25.27,
					'15': 11,
					'16': 2856,
					'17': 272,
					'18': 3128,
					'19': 2948,
					'20': 6.11,
					'21': 4902,
					'22': 530,
					'23': 5432,
					'24': 5169,
					'25': 5.09,
					color: '#66bb6a'
				}
			];

			// colors
			chart10.colors.list = [
				am4core.color('#f56528'),
				am4core.color('#fcd338'),
				am4core.color('#b0de33'),
				am4core.color('#0d8ecf')
			];

			// Create axes
			var categoryAxis = chart10.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.dataFields.category = '2';
			categoryAxis.renderer.grid.template.location = 0;
			categoryAxis.renderer.minGridDistance = 20;

			var valueAxis = chart10.yAxes.push(new am4charts.ValueAxis());
			valueAxis.min = 0;
			valueAxis.max = 100;
			valueAxis.strictMinMax = true;
			valueAxis.calculateTotals = true;
			valueAxis.renderer.minWidth = 50;

			chart10.scrollbarX = new am4core.Scrollbar();

			var label = categoryAxis.renderer.labels.template;

			label.truncate = false;
			label.maxWidth = 200;
			label.rotation = -45;
			label.horizontalCenter = 'right';
			label.verticalCenter = 'middle';
			label.tooltipText = '{2}';

			// Set up series
			function createSeries(field, name) {
				// Set up series
				const series = chart10.series.push(
					new am4charts.ColumnSeries()
				);
				series.name = name;
				series.dataFields.valueY = field;
				series.dataFields.categoryX = '2';
				series.dataFields.valueYShow = 'totalPercent';
				// series.sequencedInterpolation = true;
				series.dataItems.template.locations.categoryX = 0.5;
				series.tooltip.pointerOrientation = 'vertical';

				// Make it stacked
				series.stacked = true;

				series.columns.template.tooltipText =
					'[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}';

				const bullet = series.bullets.push(new am4charts.LabelBullet());
				bullet.interactionsEnabled = false;
				bullet.label.truncate = false;
				bullet.label.text =
					"{valueY.totalPercent.formatNumber('#.00')}%";
				bullet.label.fill = am4core.color('#000000');
				bullet.locationY = 0.5;

				return series;
			}

			createSeries('3', 'Reviewd By CMO');
			// createSeries('22', 'During Month (Aug 2019)');
			createSeries('9', 'Reviewd By DC');
			createSeries('15', 'Not Reviewd');

			// Add legend
			chart10.legend = new am4charts.Legend();

			this.charts.push(chart10);

		});
	}
	stateData: any;
	indicatorDetails: any;
	isShowState = true;
	isShowDistrict = false;
	private expectedVsAcutalGraph() {
		this.zone.runOutsideAngular(() => {

			// Expected Vs Actual Maternal Death
			var expectedVsActual = am4core.create('expectedVsActual', am4charts.XYChart);
			expectedVsActual.colors.list = [
				am4core.color("#007bff"),
				am4core.color("#ffb822")
			];

			// Add data
			if (this.selectedValue === 'stateWise') {
				this.isShowState = true;
				this.isShowDistrict = false;
				expectedVsActual.data = this.stateData
			} else {
				this.isShowState = false;
				this.isShowDistrict = true;
				expectedVsActual.data = this.districtwiseDeaths
			}



			// Create axes

			var categoryAxis = expectedVsActual.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.dataFields.category = "state";
			categoryAxis.renderer.grid.template.location = 0;
			categoryAxis.renderer.minGridDistance = 20;
			categoryAxis.title.text = "";



			categoryAxis.renderer.labels.template.horizontalCenter = "middle";
			categoryAxis.renderer.labels.template.verticalCenter = "middle";
			categoryAxis.renderer.labels.template.rotation = 270;

			var valueAxis = expectedVsActual.yAxes.push(new am4charts.ValueAxis());
			valueAxis.min = 0;
			valueAxis.title.text = "Maternal Deaths";

			// Create series
			function createSeries1(field, name, stacked) {
				var series = expectedVsActual.series.push(new am4charts.ColumnSeries());
				series.dataFields.valueY = field;
				series.dataFields.categoryX = "state";

				//series.dataFields.valueYShow = 'totalPercent';
				series.name = name;
				series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
				series.stacked = stacked;
				//series.columns.template.width = am4core.percent(95);
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

			createSeries1("expected", "Expected", false);
			createSeries1("actual", "Actual", false);

			// Cursor
			expectedVsActual.cursor = new am4charts.XYCursor();
			//scrollbar
			expectedVsActual.scrollbarX = new am4core.Scrollbar();
			//console.log(expectedVsActual.scrollbarX.thumb)
			//expectedVsActual.scrollbarX.thumb.minWidth = 60;

			// Add legend


			expectedVsActual.legend = new am4charts.Legend();

			this.charts.push(expectedVsActual);
		})
	}


	selectedValue: string = "stateWise";
	where: any;
	ngOnInit() {
		let mon = moment().month() + 1;
		let day;
		if (moment().date() > 10) {
			day = moment().date();
		} else {
			day = "0" + moment().date();
		}
		let block_id, district_id, state_id;
		if (this.currentUser.accessupto == "Block") {
			//	this.stateName=this.currentUser.state.statename;
			//	this.districtName=this.currentUser.district.districtname;
			block_id = this.currentUser.user_block_id;
		} else if (this.currentUser.accessupto == "District") {
			//	this.stateName=this.currentUser.state.statename;
			//	this.districtName=this.currentUser.district.districtname;
			district_id = this.currentUser.user_district_id;
		} else if (this.currentUser.accessupto == "State") {
			//this.stateName=this.currentUser.state.statename;
			state_id = this.currentUser.user_state_id;
			this.getMostAndLeastDistrictsDeaths(state_id);
		} else {
			this.getMostAndLeastDistrictsDeaths({ state_id: { "statecode": undefined } });
			this.getDeathsWhereCbmdsrAndFbmdsrConducted();
			//this.stateName="All States";
		}
		// this.fromDate = "01" + "-" + mon + "-" + moment().year();
		this.fromDate = "01" + "-" + mon + "-" + moment().year();
		this.toDate = day + "-" + mon + "-" + moment().year();
		this.where = {
			state_id: state_id ? state_id : undefined,
			district_id: district_id ? district_id : undefined,
			block_id: block_id ? block_id : undefined,
			// createdAt: { between: [moment().year() + "-" + mon + "-01", moment().year() + "-" + mon + "-" + day] }
			updatedAt: {
				"$gte": this.fromDate,
				"$lte": this.toDate
			}
		}
		let countParam = {
			"state_id.statecode": state_id ? state_id.statecode : undefined,
			"district_id.districtcode": district_id ? district_id.districtcode : undefined,
			"block_id.subdistrictcode": block_id ? block_id.subdistrictcode : undefined,
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
		let datesArray = [];
		datesArray.push(moment().subtract(6, "days").format("DD-MM-YYYY"));
		datesArray.push(moment().subtract(5, "days").format("DD-MM-YYYY"));
		datesArray.push(moment().subtract(4, "days").format("DD-MM-YYYY"));
		datesArray.push(moment().subtract(3, "days").format("DD-MM-YYYY"));
		datesArray.push(moment().subtract(2, "days").format("DD-MM-YYYY"));
		datesArray.push(moment().subtract(1, "days").format("DD-MM-YYYY"));
		datesArray.push(moment().format("DD-MM-YYYY"));
		countParam["datesArray"] = datesArray;
		this.form1Service.getNotificationCount(countParam).subscribe(res => {
			console.log('res', res);
			if (res.length > 0) {
				for (let i = 0; i < datesArray.length; i++) {
					let cbSuffixVarible = i + "CB";
					let fbSuffixVarible = i + "FB";
					this.maternalDeathsNotification.push({
						date: datesArray[i],
						cbmdsr: { count: res[0][cbSuffixVarible], type: "CBMDSR" },
						fbmdsr: { count: res[0][fbSuffixVarible], type: "FBMDSR" }
					})
				}
			}
			this.getNotificationDetails({ date: datesArray[6], type: "CBMDSR" });
			this.changeDetectorRef.detectChanges();
		});
		this.getIcd10CodesCategorywise(this.where);
		this.getMaternalCauseOfdeathsFor6Months();
	}

	getNotificationDetails(arg) {
		this.isShowNotificationDetailTable = false;
		if (arg.type == "CBMDSR") {
			this.where['place_of_death'] = { '$in': ["Home", "Transit", "Other"] }
		} else if (arg.type == "FBMDSR") {
			this.where['place_of_death'] = { '$in': ["Health Facility"] }
		}
		this.where['updatedAt'] = arg.date;
		this.form1Service.getNotificationDetails(this.where).subscribe(res => {
			this.blockwiseMaternalDeathsNotification = res;
			this.isShowNotificationDetailTable = true;
			this.changeDetectorRef.detectChanges();
		});
	}
	MaternalCauses: any;
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
	leastAndMostDeathsInDistrict: any;
	getMostAndLeastDistrictsDeaths(stateId) {
		let previousYearFromDate = (moment().year() - 1) + "-" + "01" + "-" + "01";
		let previousYearToDate = (moment().year() - 1) + "-" + "12" + "-" + "31";
		//let previousYearFromDate=(moment().year())+"-"+"01"+"-"+"01";
		//let previousYearToDate=(moment().year())+"-"+"12"+"-"+"31";
		let paramMost = {
			previousYearFromDate: previousYearFromDate,
			previousYearToDate: previousYearToDate,
			where: { "state_id": stateId['statecode'] },
			accessUpto: this.currentUser.accessupto
		}
		this.form1Service.getMostAndLeastDistrictsDeaths(paramMost).subscribe(Res => {
			this.leastAndMostDeathsInDistrict = Res;
			this.districtWiseLeastAndMostDeathReported();;
			this.changeDetectorRef.detectChanges();
		});
	}
	whereCbmdsrAndFbmdsrConducted: any;
	getDeathsWhereCbmdsrAndFbmdsrConducted() {
		let previousYearFromDate = (moment().year() - 1) + "-" + "01" + "-" + "01";
		let previousYearToDate = (moment().year() - 1) + "-" + "12" + "-" + "31";
		//let previousYearFromDate=(moment().year())+"-"+"01"+"-"+"01";
		//let previousYearToDate=(moment().year())+"-"+"12"+"-"+"31";
		let param = {
			previousYearFromDate: previousYearFromDate,
			previousYearToDate: previousYearToDate,
		}
		this.form1Service.getDeathsWhereCbmdsrAndFbmdsrConducted(param).subscribe(Res => {
			Res.sort(function (a, b) {
				var whereFBMDSRConductedA = a['column-2']
				var whereFBMDSRConductedB = b['column-2']
				return (whereFBMDSRConductedA > whereFBMDSRConductedB) ? -1 : (whereFBMDSRConductedA < whereFBMDSRConductedB) ? 1 : 0;
			});
			this.whereCbmdsrAndFbmdsrConducted = Res;
			this.drawGraphWhereCbmdsrAndFbmdsrConducted();;
			this.changeDetectorRef.detectChanges();
		});
	}
	GraphMaternalCausesLast6Month: any;
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
				this.drawGraphMaternalCausesLast6Month();;
				this.changeDetectorRef.detectChanges();
			});
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
			am4core.color('#0d8ecf')
		];
		chart4.colors.list = colors;

		// Create axes
		var dateAxis = chart4.xAxes.push(new am4charts.DateAxis());
		dateAxis.renderer.minGridDistance = 50;
		dateAxis.renderer.grid.template.location = 0.5;
		dateAxis.startLocation = 0.5;
		dateAxis.endLocation = 0.5;

		// Create value axis
		var valueAxis = chart4.yAxes.push(new am4charts.ValueAxis());
		//valueAxis.renderer.grid.template.disabled = !showgrid;
		valueAxis.paddingLeft = 10;
		valueAxis.paddingRight = 10;
		valueAxis.layout = "absolute";

		valueAxis.title.text = "Something";
		valueAxis.title.rotation = 0;
		valueAxis.title.align = "center";
		valueAxis.title.valign = "top";
		valueAxis.title.dy = 0

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

	getStateData(stateData) {
		this.stateData = stateData;
		this.expectedVsAcutalGraph();
	}

	ngAfterViewInit() {
		//this.createChart();
	}

	onChange(value) {
		this.selectedValue = value;
		this.expectedVsAcutalGraph();
	}

	// get Districtwise least and most data
	districtWiseLeastAndMostDeathReported() {
		// CART 6
		const chart6 = am4core.create('chart6', am4charts.XYChart);
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

		// CART 7
		const chart7 = am4core.create('chart7', am4charts.XYChart);
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

	drawGraphWhereCbmdsrAndFbmdsrConducted() {
		// CART 8
		var chart8 = am4core.create('chart8', am4charts.XYChart);

		// Add data
		chart8.data = this.whereCbmdsrAndFbmdsrConducted;

		// Create axes
		var categoryAxis = chart8.xAxes.push(new am4charts.CategoryAxis());
		categoryAxis.dataFields.category = 'category';
		// categoryAxis.title.text = "";
		categoryAxis.renderer.grid.template.location = 0;
		categoryAxis.renderer.minGridDistance = 20;

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

		var valueAxis = chart8.yAxes.push(new am4charts.ValueAxis());
		valueAxis.title.text = '% Maternal Deaths';

		// Create series
		var series401 = chart8.series.push(new am4charts.LineSeries());
		series401.dataFields.valueY = 'column-1';
		series401.dataFields.categoryX = 'category';
		series401.name = 'Where FBMDR Conducted';
		series401.tooltipText = '{name}: [bold]{valueY}[/]';
		series401.strokeWidth = 1;
		series401.bullets.push(new am4charts.CircleBullet());

		var series302 = chart8.series.push(new am4charts.LineSeries());
		series302.dataFields.valueY = 'column-2';
		series302.dataFields.categoryX = 'category';
		series302.name = 'Where CBMDR Conducted';
		series302.tooltipText = '{name}: [bold]{valueY}[/]';
		series302.strokeWidth = 1;
		series302.bullets.push(new am4charts.CircleBullet());

		// Add legend
		chart8.legend = new am4charts.Legend();

		chart8.cursor = new am4charts.XYCursor();

		this.charts.push(chart8);
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
	isShowOnMap: boolean = false;
	getCheckBoxValueForShowMap($event) {
		this.isShowOnMap = $event.target.checked;
	}
	isShowOnStatewiseGraph: boolean = false;
	getCheckBoxValueForShowStatewiseGraph($event) {
		this.isShowOnStatewiseGraph = $event.target.checked;
	}

	ngOnDestroy() {
		while (this.charts.length) {
			const chart = this.charts.pop();

			chart.dispose();
		}
	}
}
