import { Component, OnInit, NgZone } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

@Component({
  selector: 'kt-labourbirth',
  templateUrl: './labourbirth.component.html',
  styleUrls: ['./labourbirth.component.scss']
})
export class LabourbirthComponent implements OnInit {
  private charts: Array<any> = [];
  constructor(private zone: NgZone) { }

  ngOnInit() {
    this.antenatalcareTrendGraph();
    this.createGestationalDiabetesMellitusGraph();
    this.pasthistoryTrendGraph();
    this.pasthistoryDetailsGraph();
  }
  antenatalcareTrendGraph() {
    this.zone.runOutsideAngular(() => {
      // Expected Vs Actual Maternal Death
      var expectedVsActual = am4core.create('antenatalcareTrendGraph', am4charts.XYChart);
      expectedVsActual.logo.disabled = true;
      expectedVsActual.colors.list = [
        am4core.color("#a1e6e5"),
        am4core.color("#a1b6e6")
      ];

      const data = [{
        "state": "Nov",
        "expected": 90,
        "actual": 70
      }, {
        "state": "Dec",
        "expected": 102,
        "actual": 94
      }, {
        "state": "Jan",
        "expected": 65,
        "actual": 44
      }, {
        "state": "Feb",
        "expected": 62,
        "actual": 33
      }, {
        "state": "March",
        "expected": 55,
        "actual": 42
      }, {
        "state": "April",
        "expected": 81,
        "actual": 50
      }];

      expectedVsActual.data = data

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
      valueAxis.title.text = "StillBirth Reported";

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

      createSeries1("expected", "YES", false);
      createSeries1("actual", "NO", false);

      // Cursor
      expectedVsActual.cursor = new am4charts.XYCursor();
      //scrollbar
      expectedVsActual.scrollbarX = new am4core.Scrollbar();
      //console.log(expectedVsActual.scrollbarX.thumb)
      //expectedVsActual.scrollbarX.thumb.minWidth = 60;

      // Add legend


      expectedVsActual.legend = new am4charts.Legend();

      this.charts.push(expectedVsActual);
    });
  }

  createGestationalDiabetesMellitusGraph() {
    const colors = [
      am4core.color('#f56528'),
      am4core.color('#fcd338'),
      am4core.color('#b0de33'),
      am4core.color('#0d8ecf')
    ];

    // CART 1
    const chart1 = am4core.create('GestationalDiabetesMellitus', am4charts.PieChart);
    chart1.colors.list = colors;

    chart1.innerRadius = am4core.percent(35);

    chart1.data = [
      {
        category: 'YES',
        'column-1': 10,
      },
      {
        category: 'NO',
        'column-1': 18,
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

  pasthistoryTrendGraph() {
    this.zone.runOutsideAngular(() => {
      // Expected Vs Actual Maternal Death
      var expectedVsActual = am4core.create('significantPastHistoryTrendGraph', am4charts.XYChart);
      expectedVsActual.logo.disabled = true;
      expectedVsActual.colors.list = [
        am4core.color("#a1e6e5"),
        am4core.color("#e6dca1")
      ];

      const data = [{
        "state": "Nov",
        "expected": 90,
        "actual": 70
      }, {
        "state": "Dec",
        "expected": 102,
        "actual": 94
      }, {
        "state": "Jan",
        "expected": 65,
        "actual": 44
      }, {
        "state": "Feb",
        "expected": 62,
        "actual": 33
      }, {
        "state": "March",
        "expected": 55,
        "actual": 42
      }, {
        "state": "April",
        "expected": 81,
        "actual": 50
      }];

      expectedVsActual.data = data

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
      valueAxis.title.text = "StillBirth Reported";

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

      createSeries1("expected", "YES", false);
      createSeries1("actual", "NO", false);

      // Cursor
      expectedVsActual.cursor = new am4charts.XYCursor();
      //scrollbar
      expectedVsActual.scrollbarX = new am4core.Scrollbar();
      //console.log(expectedVsActual.scrollbarX.thumb)
      //expectedVsActual.scrollbarX.thumb.minWidth = 60;

      // Add legend


      expectedVsActual.legend = new am4charts.Legend();

      this.charts.push(expectedVsActual);
    });
  }

  pasthistoryDetailsGraph() {
    const colors = [
      am4core.color('#f56528'),
      am4core.color('#fcd338'),
      am4core.color('#b0de33'),
      am4core.color('#0d8ecf')
    ];

    // CART 1
    const chart1 = am4core.create('pasthistorydetails', am4charts.PieChart);
    chart1.colors.list = colors;

    chart1.innerRadius = am4core.percent(35);

    chart1.data = [
      {
        category: 'Anemia',
        'column-1': 10,
      },
      {
        category: 'Urinary Infection',
        'column-1': 18,
      },
      {
        category: 'TORCH',
        'column-1': 18,
      },
      {
        category: 'Obesity',
        'column-1': 12,
      },
      {
        category: 'Hypertension',
        'column-1': 17,
      },
      {
        category: 'Under Nutrition',
        'column-1': 7,
      },
      {
        category: 'Gestational Diabetes Mellitus',
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

}
