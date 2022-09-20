import { Component, OnInit,NgZone } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

@Component({
  selector: 'kt-pregnancycare',
  templateUrl: './pregnancycare.component.html',
  styleUrls: ['./pregnancycare.component.scss']
})
export class PregnancycareComponent implements OnInit {

  private charts: Array<any> = [];
  constructor(private zone: NgZone) { }

  ngOnInit() {
    this.createPeriodOfGestationGraph();
    this.createModeOfDeliveryGraph();
    this.createMonthwiseTrendBabyWeightGraph();
    this.createSexOfBabyGraph();
  }

  createModeOfDeliveryGraph(){
    const colors = [
			am4core.color('#f56528'),
			am4core.color('#fcd338'),
			am4core.color('#b0de33'),
			am4core.color('#0d8ecf')
		];

		// CART 1
		const chart1 = am4core.create('ModeOfDelivery', am4charts.PieChart);
		chart1.colors.list = colors;

		chart1.innerRadius = am4core.percent(35);

		chart1.data = [
			{
				category: 'Normal Vaginal Delivery',
				'column-1': 10,
			},
			{
				category: 'Breech Delivery',
				'column-1': 18,
			},
			{
				category: 'Instrumental Delivery',
				'column-1': 22,
			},
			{
				category: 'Emergency Cesarean Section',
				'column-1': 22,
			},
			{
				category: 'Elective Cesarean Section',
				'column-1': 10,
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

		title1.text = 'Cumulative 6 Month Data';
		title1.fontSize = 15;

		this.charts.push(chart1);
  }

  createPeriodOfGestationGraph(){
		const colors = [
			am4core.color('#f56528'),
			am4core.color('#fcd338'),
			am4core.color('#b0de33'),
			am4core.color('#0d8ecf')
		];


		
		// CART 2
		const chart2 = am4core.create('PeriodOfGestation', am4charts.PieChart);
		chart2.colors.list = colors;

		chart2.innerRadius = am4core.percent(35);

		chart2.data = [
			{
				category: '>28-34 Weeks',
				'column-1': 44,
				color: am4core.color('#f34225')
			},
			{
				category: '>34 Weeks',
				'column-1': 22,
				color: am4core.color('#fa9e30')
			}
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

		title2.text = 'Cumulative 6 Month Data';
		title2.fontSize = 15;

		this.charts.push(chart2);

	}

  createMonthwiseTrendBabyWeightGraph() {
    // Expected Vs Actual Maternal Death
    const chart6 = am4core.create('monthwiseTrendBabyWeightGraph', am4charts.XYChart);
    // Add data
    const data = [{
      "category": "Nov",
      "column-1": 90
    }, {
      "category": "Dec",
      "column-1": 102
    }, {
      "category": "Jan",
      "column-1": 65
    }, {
      "category": "Feb",
      "column-1": 62
    }, {
      "category": "March",
      "column-1": 55
    }, {
      "category": "April",
      "column-1": 81
    }];
    
    
    chart6.logo.disabled = true;
    chart6.paddingRight = 20;

    chart6.colors.list = [am4core.color('#d9f3a6')];

    chart6.data = data;
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

createSexOfBabyGraph(){
  const colors = [
    am4core.color('#f56528'),
    am4core.color('#fcd338'),
    am4core.color('#b0de33'),
    am4core.color('#0d8ecf')
  ];


  
  // CART 2
  const chart2 = am4core.create('sexofbaby', am4charts.PieChart);
  chart2.colors.list = colors;

  chart2.innerRadius = am4core.percent(35);

  chart2.data = [
    {
      category: 'YES',
      'column-1': 44,
      color: am4core.color('#f34225')
    },
    {
      category: 'NO',
      'column-1': 22,
      color: am4core.color('#fa9e30')
    },
    {
      category: 'Ambiguous',
      'column-1': 5,
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

  title2.text = 'Cumulative 6 Month Data';
  title2.fontSize = 15;

  this.charts.push(chart2);

}



}
