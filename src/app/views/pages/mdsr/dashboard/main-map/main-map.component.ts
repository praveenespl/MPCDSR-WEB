import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { GisService } from '../../../../../services/gis/gis.service';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

@Component({
  selector: 'kt-main-map',
  templateUrl: './main-map.component.html',
  styleUrls: ['./main-map.component.scss']
})
export class MainMapComponent implements OnInit {
  callingFrom = undefined;
  mapChartDiv = 'states';
  selectedStateData: any = [];
  MMRData = [{
   name : "Assam", 
   mmrTotal :  215
  },{
    name : "Uttar Pradesh", 
    mmrTotal :  197
   },{
    name : "Madhya Pradesh", 
    mmrTotal :  173
   },{
    name : "Rajasthan", 
    mmrTotal :  164
   },{
    name : "Odisha", 
    mmrTotal :  150
   },{
    name : "Bihar", 
    mmrTotal :  149
   },{
    name : "Chhattisgarh", 
    mmrTotal :  159
   },{
    name : "Punjab", 
    mmrTotal :  129
   },{
    name : "India", 
    mmrTotal :  113
   },{
    name : "Haryana", 
    mmrTotal :  91
   },{
    name : "Karnataka", 
    mmrTotal :  92
   },{
    name : "West Bengal", 
    mmrTotal :  98
   },{
    name : "Uttarakhand", 
    mmrTotal :  99
   },{
    name : "Gujarat", 
    mmrTotal :  75
   },{
    name : "Jharkhand", 
    mmrTotal :  71
   },{
    name : "Telangana", 
    mmrTotal :  63
   },{
    name : "Andhra Pradesh", 
    mmrTotal :  65
   },{
    name : "Tamil Nadu", 
    mmrTotal :  60
   },{
    name : "Maharashtra", 
    mmrTotal :  46
   },{
    name : "Kerala", 
    mmrTotal :  43
   }]
  constructor(
    private gisService: GisService,
    private _cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getAllStatesGIS()
  }

  getAllStatesGIS() {
    console.log("  mapChartDiv ... >> ",this.mapChartDiv)
		const getStatesResponse = this.gisService.getStates({
      type: "state",
		});
		// const getAnswerResponse = this._answerService.getSchoolDataStateWise({
		// 	stateId: this.mapChartDiv.id,
		// });
		forkJoin([getStatesResponse]).subscribe(
			([data1]) => {
        if (data1) {
          this.generateMap(data1);
				}
			}
		);
	}
  data= [];
  generateMap(res) {
		let chart = am4core.create(this.mapChartDiv, am4maps.MapChart);
		chart.logo.disabled = true;
		//set chart data initially [];
		chart.geodata = {};
		this.data = [];
		chart.colors.list = [
      am4core.color("#ffffff"),
			am4core.color("#00bfff"),
			// am4core.color("#" + (((1 << 24) * Math.random()) | 0).toString(16)),
		];

		chart.projection = new am4maps.projections.Miller();
		//configuring mouse event
		chart.chartContainer.wheelable = false;

		chart.geodata = res[0];
		let districtSeries = chart.series.push(new am4maps.MapPolygonSeries());

    for (var i = 0; i < res[0].features.length; i++) {
      const itemMap = res[0].features[i];

      const foundState = this.MMRData.find(s => {
        return s.name.toLowerCase() == itemMap.properties.name.toLowerCase();
      });
      
      if (foundState) {
        this.data.push({
          ...res[0].features[i].properties,
          id: res[0].features[i].id,
          value: foundState.mmrTotal
        });
      } else {
        this.data.push({
          ...res[0].features[i].properties,
          id: res[0].features[i].id,
          value: 0,          
        });
      }
		}
		districtSeries.data = this.data;
		districtSeries.useGeodata = true;

		let districtPolygon = districtSeries.mapPolygons.template;
    districtPolygon.strokeWidth = 0.2;
		districtPolygon.stroke = am4core.color("black");

		districtPolygon.tooltipText = `
     State Name: {name} \n
     # MMR : {value} \n  
     `; //this.isShowSubDistrict ? "District Name : {districtName}\nSub District Name: {name} \n Indicator Value: {value}" : "District Name: {name} \n Indicator Value: {value}";
		districtPolygon.fill = chart.colors.getIndex(0);
		districtPolygon.nonScalingStroke = true;
		chart.homeZoomLevel = 1;
		// Hover state
		let hs = districtPolygon.states.create("hover");
		districtSeries.heatRules.push({
			property: "fill",
			target: districtPolygon,
			min: chart.colors.getIndex(0).brighten(5),
			max: chart.colors.getIndex(1).brighten(0),
		});
		// Set up click events
		districtPolygon.events.on("hit", (ev) => {
			let dataContext = ev.target.dataItem.dataContext;
			ev.target.series.chart.zoomToMapObject(ev.target);
		});

    /*
		// Set up heat legend
		let heatLegend = chart.createChild(am4maps.HeatLegend);
		heatLegend.series = districtSeries;
		heatLegend.align = "right";
		heatLegend.valign = "top";
		heatLegend.width = am4core.percent(20);
		heatLegend.marginRight = am4core.percent(4);
		heatLegend.minValue = 0;
		heatLegend.maxValue = 215;

		// console.log(this.mapChartDiv + " : " + heatLegend.minValue + " : " + heatLegend.maxValue);

		// Set up custom heat map legend labels using axis ranges
		let minRange = heatLegend.valueAxis.axisRanges.create();
		minRange.value = heatLegend.minValue;
		minRange.label.text = heatLegend.minValue + ""; //"Little";
		let maxRange = heatLegend.valueAxis.axisRanges.create();
		maxRange.value = heatLegend.maxValue;
		maxRange.label.text = heatLegend.maxValue + ""; //"A lot!";
    
		// Blank out internal heat legend value axis labels
		heatLegend.valueAxis.renderer.labels.template.adapter.add(
			"text",
			function (labelText) {
				return "";
			}
		);
    */

		// Zoom control
		chart.zoomControl = new am4maps.ZoomControl();

		let homeButton = new am4core.Button();
		homeButton.events.on("hit", () => {
			districtSeries.show();
			chart.geodata = res[0];
			chart.goHome();
		});

		homeButton.icon = new am4core.Sprite();
		homeButton.padding(7, 5, 7, 5);
		homeButton.width = 30;
		homeButton.icon.path =
			"M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
		homeButton.marginBottom = 10;
		homeButton.parent = chart.zoomControl;
		homeButton.insertBefore(chart.zoomControl.plusButton);

		//this.charts.push(chart)

    	// Enable export
		chart.exporting.menu = new am4core.ExportMenu();
		chart.exporting.menu.align = "right";
		chart.exporting.menu.verticalAlign = "top";
		chart.exporting.menu.items[0].icon = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSIxNnB4IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAxNiAxNiIgd2lkdGg9IjE2cHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6c2tldGNoPSJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48dGl0bGUvPjxkZWZzLz48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGlkPSJJY29ucyB3aXRoIG51bWJlcnMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIj48ZyBmaWxsPSIjMDAwMDAwIiBpZD0iR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC03MjAuMDAwMDAwLCAtNDMyLjAwMDAwMCkiPjxwYXRoIGQ9Ik03MjEsNDQ2IEw3MzMsNDQ2IEw3MzMsNDQzIEw3MzUsNDQzIEw3MzUsNDQ2IEw3MzUsNDQ4IEw3MjEsNDQ4IFogTTcyMSw0NDMgTDcyMyw0NDMgTDcyMyw0NDYgTDcyMSw0NDYgWiBNNzI2LDQzMyBMNzMwLDQzMyBMNzMwLDQ0MCBMNzMyLDQ0MCBMNzI4LDQ0NSBMNzI0LDQ0MCBMNzI2LDQ0MCBaIE03MjYsNDMzIiBpZD0iUmVjdGFuZ2xlIDIxNyIvPjwvZz48L2c+PC9zdmc+"; chart.exporting.menu.items[0].icon = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSIxNnB4IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAxNiAxNiIgd2lkdGg9IjE2cHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6c2tldGNoPSJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48dGl0bGUvPjxkZWZzLz48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGlkPSJJY29ucyB3aXRoIG51bWJlcnMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIj48ZyBmaWxsPSIjMDAwMDAwIiBpZD0iR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC03MjAuMDAwMDAwLCAtNDMyLjAwMDAwMCkiPjxwYXRoIGQ9Ik03MjEsNDQ2IEw3MzMsNDQ2IEw3MzMsNDQzIEw3MzUsNDQzIEw3MzUsNDQ2IEw3MzUsNDQ4IEw3MjEsNDQ4IFogTTcyMSw0NDMgTDcyMyw0NDMgTDcyMyw0NDYgTDcyMSw0NDYgWiBNNzI2LDQzMyBMNzMwLDQzMyBMNzMwLDQ0MCBMNzMyLDQ0MCBMNzI4LDQ0NSBMNzI0LDQ0MCBMNzI2LDQ0MCBaIE03MjYsNDMzIiBpZD0iUmVjdGFuZ2xlIDIxNyIvPjwvZz48L2c+PC9zdmc+";

	}

}
