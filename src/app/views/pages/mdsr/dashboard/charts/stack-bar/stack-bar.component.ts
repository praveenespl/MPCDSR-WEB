import { Form1Service } from './../../../../../../services/mdsr/form1.service';
import { Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_kelly);
am4core.useTheme(am4themes_animated);

@Component({
	selector: 'kt-stack-bar',
	templateUrl: './stack-bar.component.html',
	styleUrls: ['./stack-bar.component.scss']
})
export class StackBarComponent implements OnInit, AfterViewInit, OnChanges {
	@Input() cornerRadious: boolean = true;
	@Input() fromDate;
	@Input() toDate;
	@Input() data: any;
	@Input() selectedValue: string;
	@Input() statecodes: number[] = []
	@Input() districtcodes: number[] = [];
	@Input() type: string = '';
	@Input() accessupto: string = '';
	@Input() subdistrictcodes: number[] = [];
	chart: any;
	constructor(private form1Service: Form1Service) { }

	ngOnInit() {

	}

	ngOnChanges(changes: SimpleChanges) {
		let change = false;
		for (const propName in changes) {
			const chng = changes[propName];
			const cur  = JSON.stringify(chng.currentValue);
			const prev = JSON.stringify(chng.previousValue);
			if(cur!==prev){
				change=true;
				break;
			}
		}
		if(true){
			this.getPlaceOfDeathData()
		}
	}
	ngAfterViewInit() {
		this.getPlaceOfDeathData()
	}

	getPlaceOfDeathData() {

		this.form1Service.getPlaceOfDeath({ fromDate: this.fromDate, toDate: this.toDate, statecodes: this.statecodes, districtcodes: this.districtcodes, type: this.type, accessupto: this.accessupto, subdistrictcodes: this.subdistrictcodes }).subscribe(res => {
			this.data = res;
			if (this.accessupto === 'National') {
				for (const item of this.data) {
					this.indiaObj.home += item.home;
					this.indiaObj.facility += item.facility;
					this.indiaObj.other += item.other;
					this.indiaObj.transit += item.transit;
					this.indiaObj.total += (item.home + item.facility + item.other + item.transit);
				}
			}
			this.generateStackChart()
		})
	}
	indiaObj = {
		code: "Ind",
		facility: 0,
		home: 0,
		other: 0,
		statecode: 0,
		statename: "India",
		total: 0,
		transit: 0,
		percent: 0
	}


	generateStackChart() {
		this.chart = am4core.create("stackBar", am4charts.XYChart);
		this.chart.exporting.menu = new am4core.ExportMenu();

		if (this.selectedValue === 'percentWise') {
			this.chart.data = this.data.map(item => {
				let obj = {
					...item,
					facility: item.total === 0 ? 0 : Number((item.facility / item.total) * 100).toFixed(0),
					home: item.total === 0 ? 0 : Number((item.home / item.total) * 100).toFixed(0),
					other: item.total === 0 ? 0 : Number((item.other / item.total) * 100).toFixed(0),
					transit: item.total === 0 ? 0 : Number((item.transit / item.total) * 100).toFixed(0),
				}
				return obj
			});
			if (this.accessupto === 'National') {
				let obj = {
					...this.indiaObj,
					facility: this.indiaObj.total === 0 ? 0 : ((this.indiaObj.facility / this.indiaObj.total) * 100).toFixed(0),
					home: this.indiaObj.total === 0 ? 0 : ((this.indiaObj.home / this.indiaObj.total) * 100).toFixed(0),
					other: this.indiaObj.total === 0 ? 0 : ((this.indiaObj.other / this.indiaObj.total) * 100).toFixed(0),
					transit: this.indiaObj.total === 0 ? 0 : ((this.indiaObj.transit / this.indiaObj.total) * 100).toFixed(0)
				}
				this.chart.data.unshift(obj)
			}
		} else {
			this.chart.data = this.data;
			if (this.accessupto === 'National') {
				this.chart.data.unshift(this.indiaObj);
			}
		}
		this.chart.colors.list = [
			am4core.color("#64b5f6"),
			am4core.color("#81c784"),
			am4core.color("#ffb74d"),
			am4core.color("#ff8a65"),
			am4core.color("#FFC75F"),
			am4core.color("#F9F871")
		];

		if ((this.accessupto == 'State' || this.accessupto==='District') && this.selectedValue === 'percentWise') {
			this.chart.colors.list = [
				am4core.color("#64b5f6"),
				am4core.color("#81c784"),
				am4core.color("#ffb74d"),
				am4core.color("#7e57c2"),
				am4core.color("#FFC75F"),
				am4core.color("#F9F871")
			];
			//this.chart.colors.list[3] = '#7b1fa2'
		}

		// Create axes
		let categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
		categoryAxis.renderer.labels.template.horizontalCenter = "middle";
		categoryAxis.renderer.labels.template.verticalCenter = "middle";
		if (this.accessupto === 'National') {
			categoryAxis.dataFields.category = "code";
		} else if (this.accessupto === 'State') {
			categoryAxis.dataFields.category = "districtname";
			categoryAxis.renderer.labels.template.rotation = 270;
		}else if(this.accessupto==='District'){
			categoryAxis.dataFields.category = "subdistrictname";
			categoryAxis.renderer.labels.template.rotation = 270;
		}
		categoryAxis.renderer.grid.template.location = 0;
		categoryAxis.renderer.minGridDistance = 20;

		let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
		//valueAxis.renderer.inside = true;
		//valueAxis.renderer.labels.template.disabled = true;
		valueAxis.min = 0;
		valueAxis.title.text = "Maternal Deaths";
		// Legend
		this.chart.legend = new am4charts.Legend();
		// Cursor
		// this.chart.cursor = new am4charts.XYCursor();
		//scrollbar
		this.chart.scrollbarX = new am4core.Scrollbar();

		this.chart.maskBullets = false;
		this.chart.paddingRight = 30;
		if (this.accessupto === 'National') {
			this.createSeries("home", "Home");
			this.createSeries("facility", "Facility");
			this.createSeries("transit", "Transit")
			this.createSeries("other", "Other", true)
		} else if (this.accessupto === 'State' || this.accessupto==='District') {
			if (this.selectedValue === 'percentWise') {
				this.chart.cursor = new am4charts.XYCursor();
				var xySeries201 = this.chart.series.push(new am4charts.LineSeries());
				xySeries201.dataFields.valueY = 'home';
				xySeries201.dataFields.categoryX = this.accessupto==='State'?'districtname':'subdistrictname';
				xySeries201.strokeWidth = 3;
				xySeries201.tensionX = 0.8;
				xySeries201.bullets.push(new am4charts.CircleBullet());
				xySeries201.data = this.chart.data;
				xySeries201.name = 'Home';
				xySeries201.tooltipText = '{name}: [bold]{valueY}[/]%';
				xySeries201.strokeWidth = 1;

				var xySeries202 = this.chart.series.push(new am4charts.LineSeries());
				xySeries202.dataFields.valueY = 'facility';
				xySeries202.dataFields.categoryX = this.accessupto==='State'?'districtname':'subdistrictname';
				xySeries202.strokeWidth = 3;
				xySeries202.tensionX = 0.8;
				xySeries202.bullets.push(new am4charts.CircleBullet());
				xySeries202.data = this.chart.data;
				xySeries202.name = 'Facility';
				xySeries202.tooltipText = '{name}: [bold]{valueY}[/]%';
				xySeries202.strokeWidth = 1;

				var xySeries3 = this.chart.series.push(new am4charts.LineSeries());
				xySeries3.dataFields.valueY = 'transit';
				xySeries3.dataFields.categoryX = this.accessupto==='State'?'districtname':'subdistrictname';
				xySeries3.strokeWidth = 3;
				xySeries3.tensionX = 0.8;
				xySeries3.bullets.push(new am4charts.CircleBullet());
				xySeries3.data = this.chart.data;
				xySeries3.name = 'Transit';
				xySeries3.tooltipText = '{name}: [bold]{valueY}[/]%';
				xySeries3.strokeWidth = 1;

				var xySeries4 = this.chart.series.push(new am4charts.LineSeries());
				xySeries4.dataFields.valueY = 'other';
				xySeries4.dataFields.categoryX = this.accessupto==='State'?'districtname':'subdistrictname';
				xySeries4.strokeWidth = 3;
				xySeries4.tensionX = 0.8;
				xySeries4.bullets.push(new am4charts.CircleBullet());
				xySeries4.data = this.chart.data;
				xySeries4.name = 'Other';
				xySeries4.tooltipText = '{name}: [bold]{valueY}[/]%';
				xySeries4.strokeWidth = 1;

			} else {
				this.createSeries("home", "Home");
				this.createSeries("facility", "Facility");
				this.createSeries("transit", "Transit")
				this.createSeries("other", "Other", true)
			}
		}
	}

	// Create series
	createSeries(field, name, isLastSeries?) {
		// Set up series
		let series = this.chart.series.push(new am4charts.ColumnSeries());
		series.name = name;
		series.dataFields.valueY = field;
		if (this.accessupto === 'National') {
			series.dataFields.categoryX = "code";
		} else if (this.accessupto === 'State') {
			series.dataFields.categoryX = "districtname";
		}else if(this.accessupto==='District'){
			series.dataFields.categoryX = 'subdistrictname';
		}
		series.sequencedInterpolation = true;

		// Make it stacked
		series.stacked = true;

		let labelBullet = series.bullets.push(new am4charts.LabelBullet());
		// Configure columns
		series.columns.template.width = am4core.percent(60);
		if (this.selectedValue === 'percentWise') {
			series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}%";
			labelBullet.label.text = "{valueY}%";
		} else {
			series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";
			labelBullet.label.text = "{valueY}";
		}
		if (isLastSeries) {
			series.columns.template.column.cornerRadiusTopLeft = 5;
			series.columns.template.column.cornerRadiusTopRight = 5;
		}

		// Add label
		labelBullet.locationY = 0.5;
		labelBullet.label.hideOversized = true;

		var valueLabel = series.bullets.push(new am4charts.LabelBullet());
		valueLabel.label.text = "{value}";
		valueLabel.label.fontSize = 25;
		valueLabel.label.horizontalCenter = "left";
		valueLabel.label.dx = 10;

		var categoryLabel = series.bullets.push(new am4charts.LabelBullet());
		categoryLabel.label.text = "{category}";
		categoryLabel.label.fontSize = 20;
		categoryLabel.label.horizontalCenter = "right";
		categoryLabel.label.dx = -10;
		categoryLabel.label.fill = am4core.color("#fff");

		series.columns.template.adapter.add("fill", function (fill, target) {
			if (target.dataItem['categoryX'] == 'Ind') {
				if (name === 'Home') {
					return am4core.color("#0288d1");
				} else if (name === 'Facility') {
					return am4core.color("#388e3c")
				} else if (name === 'Transit') {
					return am4core.color("#f57c00")
				} else {
					return am4core.color("#f4511e")
				}
			} else {
				return fill;
			}
		});

		series.columns.template.adapter.add("stroke", function (fill, target) {
			if (target.dataItem['categoryX'] == 'Ind') {
				if (name === 'Home') {
					return am4core.color("#0288d1");
				} else if (name === 'Facility') {
					return am4core.color("#388e3c")
				} else if (name === 'Transit') {
					return am4core.color("#f57c00")
				} else {
					return am4core.color("#f4511e")
				}
			} else {
				return fill;
			}
		});

		return series;
	}
}
