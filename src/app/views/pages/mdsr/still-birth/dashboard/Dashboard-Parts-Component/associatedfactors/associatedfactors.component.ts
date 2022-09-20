import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

@Component({
  selector: 'kt-associatedfactors',
  templateUrl: './associatedfactors.component.html',
  styleUrls: ['./associatedfactors.component.scss']
})
export class AssociatedfactorsComponent implements OnInit {
  private charts: Array<any> = [];
  constructor(private zone: NgZone) { }

  ngOnInit() {
    this.modifiablefactorPie();
    this.modifiablefactordetails();
    this.typeofdelay();
  }

  modifiablefactorPie() {
    const colors = [
      am4core.color('#d8aeeb'),
      am4core.color('#e6a3d6')
    ];

    // CART 1
    const chart1 = am4core.create('modifiablefactorPie', am4charts.PieChart);
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

  typeofdelay() {
    const colors = [
      am4core.color('#afeb8a') ];

    // CART 1
    const chart1 = am4core.create('typeofdelay', am4charts.PieChart);
    chart1.colors.list = colors;

    chart1.innerRadius = am4core.percent(35);

    chart1.data = [
      {
        category: 'Delay in care seeking',
        'column-1': 10,
      },
      {
        category: 'Delay in reaching health facility',
        'column-1': 18,
      },
      {
        category: 'Delay in receiving care at health facility',
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

  modifiablefactordetails() {
    this.zone.runOutsideAngular(() => {
      // Expected Vs Actual Maternal Death
      var expectedVsActual = am4core.create('modifiablefactordetails', am4charts.XYChart);
      expectedVsActual.logo.disabled = true;
      expectedVsActual.colors.list = [
        am4core.color("#78deb5"),
        am4core.color("#5ee0de")
      ];

      const data = [{
        "state": "Family Related",
        "I1": 20,
        "I2": 70,
        "I3": 40,
        "I4": 80,
        "I5": 70,
        "I6": 100,
        "I7": 70
      },{ 
      "state": "Administration Related",
      "I1": 10,
      "I2": 30,
      "I3": 70,
      "I4": 10,
      "I5": 66,
      "I6": 70,
      "I7": 79
    },{ 
      "state": "Provider Related",
      "I1": 90,
      "I2": 70,
      "I3": 12,
      "I4": 34,
      "I5": 70,
      "I6": 87,
      "I7": 55
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

      createSeries1("I1", "Late", false);
      createSeries1("I2", "No antenatal care", false);
      createSeries1("I3", "Cultural inhibition to seeking care", false);
      createSeries1("I4", "No knowledge of danger signs", false);
      createSeries1("I5", "Financial constraints", false);
      createSeries1("I6", "Smoking", false);
      createSeries1("I7", "drug", false);

      // Cursor
      expectedVsActual.cursor = new am4charts.XYCursor();
      //scrollbar
      expectedVsActual.scrollbarX = new am4core.Scrollbar();
      //console.log(expectedVsActual.scrollbarX.thumb)
      //expectedVsActual.scrollbarX.thumb.minWidth = 60;

      // Add legend


      //expectedVsActual.legend = new am4charts.Legend();

      this.charts.push(expectedVsActual);
    });
  }

}
