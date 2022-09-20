import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'kt-causeofdeath',
  templateUrl: './causeofdeath.component.html',
  styleUrls: ['./causeofdeath.component.scss']
})
export class CauseofdeathComponent implements OnInit {
  private charts: Array<any> = [];
  whereCbmdsrAndFbmdsrConductedDatasource: MatTableDataSource<any>;
	@ViewChild("paginatorWhereCbmdsrAndFbmdsrConductedDatasource", {
		static: true,
	})
	paginatorWhereCbmdsrAndFbmdsrConductedDatasource: MatPaginator;
	displayedColumnsWhereCbmdsrAndFbmdsrConductedDatasource: string[] = [
		"sn",
		"category",
		"m1",
    "m2",
    "m3",
    "m4",
    "m5",
		//"column-1",
	];
  constructor(private zone: NgZone) { }

  ngOnInit() {
    this.antepartumIntrapartumPie();
    this.antepartumFetalDeathCause();
    this.intrapartumFetalDeathCause();
    this.birthdefectGraph();
    this.birthdefectDetailsGraph();
    let result=[{category:'Antepartum Stillbirth',
      m1:10,
      m2:15,
      m3:25,
      m4:12,
      m5:16
    },{
      category:'Intrapartum Stillbirth',
      m1:10,
      m2:15,
      m3:25,
      m4:12,
      m5:16
    },{
      category:'TOTAL',
      m1:20,
      m2:30,
      m3:50,
      m4:24,
      m5:32
    }]
    this.whereCbmdsrAndFbmdsrConductedDatasource= new MatTableDataSource(result as any)
  }

  antepartumIntrapartumPie() {
    const colors = [
      am4core.color('#d8aeeb'),
      am4core.color('#e6a3d6')
    ];

    // CART 1
    const chart1 = am4core.create('antepartumIntrapartumPie', am4charts.PieChart);
    chart1.colors.list = colors;

    chart1.innerRadius = am4core.percent(35);

    chart1.data = [
      {
        category: 'Antepartum',
        'column-1': 10,
      },
      {
        category: 'Intrapartum',
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

  antepartumFetalDeathCause() {
    const colors = [
      am4core.color('#f56528'),
      am4core.color('#fcd338'),
      am4core.color('#b0de33'),
      am4core.color('#0d8ecf')
    ];

    // CART 1
    const chart1 = am4core.create('antepartumFetalDeathCause', am4charts.PieChart);
    chart1.colors.list = colors;

    chart1.innerRadius = am4core.percent(35);

    chart1.data = [
      {
        category: 'A1 : Birth Defect',
        'column-1': 10,
      },
      {
        category: 'A2 : Infection',
        'column-1': 18,
      },
      {
        category:'A3 : Antepartum Hypoxia',
        'column-1':13
      }
      ,
      {
        category: 'A4 : Other Specified Antepartum Disorder',
        'column-1': 18,
      },
      {
        category: 'A5 : Disorders Related to Fetal Growth',
        'column-1': 12,
      },
      {
        category: 'A6 : Unspecified Cause of Antepartum Death',
        'column-1': 17,
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

  intrapartumFetalDeathCause() {
    const colors = [
      am4core.color('#f56528'),
      am4core.color('#fcd338'),
      am4core.color('#b0de33'),
      am4core.color('#0d8ecf')
    ];

    // CART 1
    const chart1 = am4core.create('intrapartumFetalDeathCause', am4charts.PieChart);
    chart1.colors.list = colors;

    chart1.innerRadius = am4core.percent(35);

    chart1.data = [
      {
        category: 'I1 : Birth Defect',
        'column-1': 10,
      },
      {
        category: 'I2 : Birth Trauma',
        'column-1': 18,
      },
      {
        category: 'I3 : Acute Intrapartum Event',
        'column-1': 18,
      },
      {
        category: 'I4 : Infection',
        'column-1': 12,
      },
      {
        category: 'I5 : Other Specified Intrapartum Disorder',
        'column-1': 17,
      },
      {
        category: 'I6 : Disorder Related to Fetal Growth',
        'column-1': 7,
      },
      {
        category: 'I7 : Other',
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

  birthdefectGraph() {
    this.zone.runOutsideAngular(() => {
      // Expected Vs Actual Maternal Death
      var expectedVsActual = am4core.create('birthdefect', am4charts.XYChart);
      expectedVsActual.logo.disabled = true;
      expectedVsActual.colors.list = [
        am4core.color("#78deb5"),
        am4core.color("#5ee0de")
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

  birthdefectDetailsGraph() {
    const colors = [
      am4core.color('#f56528'),
      am4core.color('#fcd338'),
      am4core.color('#b0de33'),
      am4core.color('#0d8ecf')
    ];

    // CART 1
    const chart1 = am4core.create('birthdefectdetails', am4charts.PieChart);
    chart1.colors.list = colors;

    chart1.innerRadius = am4core.percent(35);

    chart1.data = [
      {
        category: 'Hypospadias',
        'column-1': 10,
      },
      {
        category: 'Imperforate Anus',
        'column-1': 18,
      },
      {
        category: 'Hydrocephalus',
        'column-1': 18,
      },
      {
        category: 'Microcephaly',
        'column-1': 12,
      },
      {
        category: 'Neural Tube Defects (NTDs)',
        'column-1': 17,
      },
      {
        category: 'Orofacial Cleft',
        'column-1': 7,
      },
      {
        category: 'Reduction Defects of Limbs',
        'column-1': 10,
      },
      {
        category: 'Talipes Equinovarus',
        'column-1': 10,
      },
      {
        category: 'Ambiguous genitalia',
        'column-1': 10,
      },
      {
        category: 'Bladder exstrophy',
        'column-1': 10,
      },
      {
        category: 'Others',
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
