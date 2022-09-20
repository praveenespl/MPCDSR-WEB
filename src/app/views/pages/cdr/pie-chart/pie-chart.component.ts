import { AfterViewInit, ChangeDetectorRef, Component, Input, NgZone, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import moment from 'moment';
import { CdrForm2Service } from '../../../../services/cdr/form2.service';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'kt-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit, OnChanges,AfterViewInit {

	
	currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  @Input() obj;
  constructor(private zone: NgZone,
		private changeDetectorRef: ChangeDetectorRef,
		
		private CdrForm2Service: CdrForm2Service) { }

  ngOnInit() {
	  this.getCDRMajorCases();
  }

  ngOnChanges(changes: SimpleChanges): void {
		this.createChart();
	}
	ngAfterViewInit() {
		this.createChart();
  }


  CDRMajorCases: any;
	getCDRMajorCases() {
		
		let previousYearFromDate ;
		let previousYearToDate ;
		
		if(this.obj.id == "ABC"){
			// previousYearFromDate = (moment().year() - 1) + "-" + "01" + "-" + "01";
			// previousYearToDate = (moment().year()-1) + "-" + "12" + "-" + "31";
			previousYearFromDate = (moment().year()) + "-" + "01" + "-" + "01";
			previousYearToDate = (moment().year()) + "-" + "12" + "-" + "31";
		}else if(this.obj.id == "pqr"){
			 previousYearFromDate = (moment().year()) + "-" + "01" + "-" + "01";
			 previousYearToDate = (moment().year()) + "-" + "12" + "-" + "31";
		}
		let param = {};

		if(this.currentUser.accessupto == "National"){
			param = {
				previousYearFromDate: previousYearFromDate,
				previousYearToDate: previousYearToDate,
				accessupto: "National",
			}
		}else if(this.currentUser.accessupto == "State"){
			param = {
				previousYearFromDate: previousYearFromDate,
				previousYearToDate: previousYearToDate,
				where: { "statecode":this.currentUser.user_state_id['statecode']},
				accessupto: "State",
			}
		}else if(this.currentUser.accessupto == "District"){
			param = {
				previousYearFromDate: previousYearFromDate,
				previousYearToDate: previousYearToDate,
				where: { "districtcode":this.currentUser.user_district_id['districtcode']},
				accessupto: "District",
			}
		}
		
		this.CdrForm2Service.getCDRMajorCases(param).subscribe(getCDRRes => {
			this.CDRMajorCases = getCDRRes[0];
			this.createChart();
			this.changeDetectorRef.detectChanges();
		});
		//});
	}

  
  private createChart() {
		this.zone.runOutsideAngular(() => {
      const colors = [
				am4core.color('#f56528'),
				am4core.color('#fcd338'),
				am4core.color('#b0de33'),
				am4core.color('#0d8ecf')
			];
      const chart1 = am4core.create(this.obj.id, am4charts.PieChart);
	  chart1.logo.disabled = true;
			chart1.colors.list = colors;

			chart1.innerRadius = am4core.percent(35);

			chart1.data = [
				{
					category: 'Diarrhoea',
					'column-1': this.CDRMajorCases.diarrhoea,
					color: am4core.color('#f34225')
				},
				{
					category: 'Injury',
					'column-1': this.CDRMajorCases.injury,
					color: am4core.color('#f56528')
				},
				{
					category: 'Maleria',
					'column-1': this.CDRMajorCases.maleria,
					color: am4core.color('#fa9e30')
				},
				{
					category: 'Measles',
					'column-1': this.CDRMajorCases.measles,
					color: am4core.color('#fcd338')
				},
				{
					category: 'Meningitis',
					'column-1': this.CDRMajorCases.meningitis,
					color: am4core.color('#f3ee3c')
				},
				{
					category: 'Pneumonia',
					'column-1': this.CDRMajorCases.pneumonia,
					color: am4core.color('#b0de33')
				},
				{
					category: 'Septicemia',
					'column-1': this.CDRMajorCases.septicemia,
					color: am4core.color('#68d42c')
				},
				// {
				// 	category: 'other',
				// 	'column-1': this.CDRMajorCases.other,
				// 	color: am4core.color('#982cd4')
				// }

			];

			var pieSeries = chart1.series.push(new am4charts.PieSeries());
			pieSeries.dataFields.value = 'column-1';
			pieSeries.dataFields.category = 'category';
			pieSeries.slices.template.propertyFields.fill = 'color';

			pieSeries.ticks.template.disabled = true;
			pieSeries.alignLabels = false;
			pieSeries.labels.template.text = "{value.percent.formatNumber('#.0')}%";
			pieSeries.labels.template.radius = am4core.percent(5);
			pieSeries.labels.template.fontWeight = "600";

			chart1.legend = new am4charts.Legend();
			chart1.legend.align = 'center';
			chart1.legend.fontSize = 12;
			chart1.legend.labels.template.text = '{category}';
			chart1.legend.valueLabels.template.text = '';

			chart1.legend.markers.template.marginRight = 2;
			chart1.legend.markers.template.width = 16;
			chart1.legend.markers.template.height = 16;

			//const title1 = chart1.titles.create();

			//title1.text = this.obj.title
			//title1.fontSize = 15;
    })
  }
}
