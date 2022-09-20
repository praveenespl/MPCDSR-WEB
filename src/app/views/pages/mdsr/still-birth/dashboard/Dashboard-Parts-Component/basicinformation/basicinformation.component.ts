import { Component, OnInit,NgZone } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
@Component({
  selector: 'kt-basicinformation',
  templateUrl: './basicinformation.component.html',
  styleUrls: ['./basicinformation.component.scss']
})
export class BasicinformationComponent implements OnInit {
  private charts: Array<any> = [];
  constructor(private zone: NgZone) { }

  ngOnInit() {
    this.createMonthwiseTrendGraph();
    this.createHealthFacilityGraph();
    this.createIntramuralGraph();
    this.createConsanguineousGraph();
    this.createMonthwisAgeAvgGraph();
  }
  createMonthwiseTrendGraph() {
			// Expected Vs Actual Maternal Death
      const chart6 = am4core.create('monthwiseTrendGraph', am4charts.XYChart);
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

  createHealthFacilityGraph(){
    const colors = [
			am4core.color('#f56528'),
			am4core.color('#fcd338'),
			am4core.color('#b0de33'),
			am4core.color('#0d8ecf')
		];

		// CART 1
		const chart1 = am4core.create('healthfacilities', am4charts.PieChart);
		chart1.colors.list = colors;

		chart1.innerRadius = am4core.percent(35);

		chart1.data = [
			{
				category: 'Medical College',
				'column-1': 10,
			},
			{
				category: 'District Hospital',
				'column-1': 18,
			},
			{
				category: 'FRU',
				'column-1': 22,
			},
			{
				category: 'Others(CHC, 24X7 PHCs)',
				'column-1': 22,
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

  createIntramuralGraph(){

     // CART 8
     var chart8 = am4core.create('intramuralGraph', am4charts.XYChart);
     chart8.logo.disabled = true;

     const data = [{
      "category": "Nov",
      "column-1": 90,
      "column-2": 70
    }, {
      "category": "Dec",
      "column-1": 102,
      "column-2": 95
    }, {
      "category": "Jan",
      "column-1": 65,
      "column-2": 40
    }, {
      "category": "Feb",
      "column-1": 62,
      "column-2": 45
    }, {
      "category": "March",
      "column-1": 55,
      "column-2": 50
    }, {
      "category": "April",
      "column-1": 81,
      "column-2": 65
    }];
     // Add data
     chart8.data = data;
 
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
     valueAxis.title.text = 'StillBirth Reported';
 
     // Create series
     var series401 = chart8.series.push(new am4charts.LineSeries());
     series401.dataFields.valueY = 'column-1';
     series401.dataFields.categoryX = 'category';
     series401.name = 'YES';
     series401.tooltipText = '{name}: [bold]{valueY}[/]';
     series401.strokeWidth = 1;
     series401.bullets.push(new am4charts.CircleBullet());
 
     var series302 = chart8.series.push(new am4charts.LineSeries());
     series302.dataFields.valueY = 'column-2';
     series302.dataFields.categoryX = 'category';
     series302.name = 'NO';
     series302.tooltipText = '{name}: [bold]{valueY}[/]';
     series302.strokeWidth = 1;
     series302.bullets.push(new am4charts.CircleBullet());
 
     // Add legend
     chart8.legend = new am4charts.Legend();
 
     chart8.cursor = new am4charts.XYCursor();
 
     this.charts.push(chart8);

  }

  createConsanguineousGraph(){
		const colors = [
			am4core.color('#f56528'),
			am4core.color('#fcd338'),
			am4core.color('#b0de33'),
			am4core.color('#0d8ecf')
		];


		
		// CART 2
		const chart2 = am4core.create('ConsanguineousGraph', am4charts.PieChart);
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
				category: 'Unknown',
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

  createMonthwisAgeAvgGraph() {
    // Expected Vs Actual Maternal Death
    const chart6 = am4core.create('monthwiseAgeAvgGraph', am4charts.XYChart);
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

    chart6.colors.list = [am4core.color('#fa9e30')];

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

}
