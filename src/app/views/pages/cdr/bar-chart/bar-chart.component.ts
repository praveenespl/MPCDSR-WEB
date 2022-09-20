import {
	Component,
	OnInit,
	AfterViewInit,
	Input,
	SimpleChanges,
} from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

@Component({
	selector: "kt-bar-chart",
	templateUrl: "./bar-chart.component.html",
	styleUrls: ["./bar-chart.component.scss"],
})
export class BarChartComponent implements OnInit, AfterViewInit {
	constructor() {}
	@Input() obj;
	ngOnInit() {
		
	}

	ngOnChanges(changes: SimpleChanges): void {
		
		this.createChart();
	}
	ngAfterViewInit() {
		
		this.createChart();
	}
	createChart() {
		let chart = am4core.create(this.obj.id, am4charts.XYChart);
		// Add data
		chart.colors.list = [am4core.color(this.obj.color)];
		// am4core.color("#845EC2"),
		//   am4core.color("#D65DB1"),
		//   am4core.color("#FF6F91"),
		//   am4core.color("#FF9671"),
		//   am4core.color("#FFC75F"),
		//   am4core.color("#F9F871")
		chart.data = this.obj.data;

		// Legends
		chart.legend = new am4charts.Legend();
		chart.legend.position = "bottom";
		chart.legend.paddingBottom = 20;
		chart.legend.labels.template.maxWidth = 95;

		// Create axes

		let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
		categoryAxis.dataFields.category = "country";
		categoryAxis.renderer.grid.template.location = 0;
		categoryAxis.renderer.minGridDistance = 30;

		categoryAxis.renderer.labels.template.horizontalCenter = "right";
		categoryAxis.renderer.labels.template.verticalCenter = "middle";
		categoryAxis.renderer.labels.template.rotation = 270;

		// categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
		//   if (target.dataItem && target.dataItem.index & 2 == 2) {
		//     return dy + 25;
		//   }
		//   return dy;
		// });

		let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.min = 0
		// Create series
		let series = chart.series.push(new am4charts.ColumnSeries());
		series.dataFields.valueY = "visits";
		series.dataFields.categoryX = "country";
		series.name = "CDR";
		series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
		series.columns.template.fillOpacity = 0.8;

		let columnTemplate = series.columns.template;
		columnTemplate.strokeWidth = 2;
		columnTemplate.strokeOpacity = 1;

		let valueLabel = series.bullets.push(new am4charts.LabelBullet());
		valueLabel.label.text = "{visits}";
		valueLabel.label.fontSize = 16;
		valueLabel.label.dy = 10;

	}
}
