import { Component, OnInit, NgZone, AfterViewInit, OnDestroy, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { GisService } from '../../../../../services/gis/gis.service';


import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import indiaJson from '../india.json';


import momemt from 'moment';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CdrForm1Service } from '../../../../../services/cdr/form1.service';
import moment from 'moment';
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'kt-cdrmap',
  templateUrl: './cdrmap.component.html',
  styleUrls: ['./cdrmap.component.scss']
})
export class CDRMapComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  constructor(
    private zone: NgZone,
    private gisService: GisService,
    private form1Service: CdrForm1Service,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }
  @Output() myOutput: EventEmitter<any> = new EventEmitter();
  @Input() mapChartDiv: any;
  @Input() callingFrom: any;
  @Input() isShowAllDistrictOnMap: boolean;
  @Input() passingArgOnDistrictClick: any;
  user = JSON.parse(sessionStorage.getItem("currentUser"));
  stateData:any = [];
  obj = {};
  mapChartDivVar:any;
  districtData;
  type: any;
  cbmdsrAndFbmdsrData: any;
  cbmdsrAndFbmdsrDataForDistrict: any;
  cbmdsrAndFbmdsrDataForBlock: any;
  districtDatas = [];
  ngOnInit() {    
    let block_id, district_id, state_id;
    if (this.user.accessupto == "Block" && this.callingFrom == undefined) {
      block_id = this.user.user_block_id;
      this.getDeathsWhereCbmdsrAndFbmdsrConducted(block_id);
    } else if (this.user.accessupto == "District" && this.callingFrom == undefined) {
      district_id = this.user.user_district_id;
      this.mapChartDivVar = this.mapChartDiv;
      this.getDeathsWhereCbmdsrAndFbmdsrConducted(district_id);
    } else if (this.user.accessupto == "State" && this.callingFrom == undefined) {
      state_id = this.user.user_state_id;
      this.getDeathsWhereCbmdsrAndFbmdsrConducted(state_id);
      this.mapChartDivVar = this.mapChartDiv;
    } else if (this.user.accessupto == "State" && this.callingFrom == true) {
      district_id = this.user.user_district_id;
      this.getDeathsWhereCbmdsrAndFbmdsrConducted(district_id);
      this.mapChartDivVar = this.mapChartDiv;
    } else if (this.user.accessupto == "National" && this.callingFrom == undefined) {
      this.mapChartDivVar = this.mapChartDiv;
      this.obj["type"] = "getStates";
      this.getDeathsWhereCbmdsrAndFbmdsrConducted(this.obj);
    } else if (this.user.accessupto == "National" && this.callingFrom == 'NationalLoginForDistrictsMap') {
      this.mapChartDivVar = this.mapChartDiv;
      this.getDeathsWhereCbmdsrAndFbmdsrConducted({ "districtcode": undefined });
    } else if (this.user.accessupto == "National" && this.callingFrom == 'NationalLoginForBlocksMap') {
      this.mapChartDivVar = this.mapChartDiv;
      this.getDeathsWhereCbmdsrAndFbmdsrConducted({ "districtcode": undefined });
    }
  }

  getDeathsWhereCbmdsrAndFbmdsrConducted(passingArg) {
    let previousYearFromDate = (moment().year() - 1) + "-" + "01" + "-" + "01";
    let previousYearToDate = (moment().year()) + "-" + "12" + "-" + "31";
    let param = {
      previousYearFromDate: previousYearFromDate,
      previousYearToDate: previousYearToDate,
      where: this.callingFrom ? { "districtcode": this.passingArgOnDistrictClick['districtcode'] } : passingArg,
      accessUpto: this.callingFrom ? 'District' : this.user.accessupto
    }
    //this.type = this.activatedRoute.snapshot.paramMap.get("type");
    if (this.user.accessupto == "National" && this.callingFrom == undefined) {
      this.obj['type'] = "getStates";
      forkJoin(this.form1Service.getDeathsWhereCbmdsrAndFbmdsrConducted(param),
      this.gisService.getStates({ type: this.obj['type']})).subscribe(res => {
        console.log('res',res);
        this.cbmdsrAndFbmdsrData = [];
        this.cbmdsrAndFbmdsrData = res[0];
        this.stateData = res[0];
        this.generateMap(res[1], this.mapChartDivVar);
      })
    } else if (this.user.accessupto == "National" && this.callingFrom == 'NationalLoginForDistrictsMap') {
      param['where'] = { "statecode": this.passingArgOnDistrictClick['statecode'] };
      param['accessUpto'] = 'State';
      this.obj['type'] = "getDistricts";
      console.log('param param', param);
      forkJoin(this.form1Service.getDeathsWhereCbmdsrAndFbmdsrConducted(param),
        this.gisService.getDistricts({ type: this.obj['type'], stateName: this.passingArgOnDistrictClick['category'] })).subscribe(res => {
          this.cbmdsrAndFbmdsrData = [];
          this.cbmdsrAndFbmdsrData = res[0];
          this.cbmdsrAndFbmdsrDataForDistrict = res[0];
          this.generateMap(res[1], this.mapChartDivVar);
        })
    } else if (this.user.accessupto == "National" || this.callingFrom == 'NationalLoginForBlocksMap') {
      param['where'] = { "districtcode": this.passingArgOnDistrictClick['districtcode'] };
      param['accessUpto'] = 'District';
      this.obj['type'] = "getSubDistricts";
      console.log('In map com ', param);
      forkJoin(this.form1Service.getDeathsWhereCbmdsrAndFbmdsrConducted(param),
        this.gisService.getSubDistricts({ type: this.obj['type'], states: [this.passingArgOnDistrictClick['statename']], districts: [this.passingArgOnDistrictClick['category']] })).subscribe(res => {
          this.cbmdsrAndFbmdsrDataForBlock = [];
          this.cbmdsrAndFbmdsrDataForBlock = res[0];
          console.log('this.cbmdsrAndFbmdsrDataForBlock', this.cbmdsrAndFbmdsrDataForBlock);
          console.log('res[1]', res[1]);
          this.generateMap(res[1], this.mapChartDivVar);
        })
    } else if (this.user.accessupto == "State" && this.callingFrom == undefined) {
      this.obj['type'] = "getDistricts";
      console.log('param',param);
      forkJoin(this.form1Service.getDeathsWhereCbmdsrAndFbmdsrConducted(param),
        this.gisService.getDistricts({ type: this.obj['type'], stateName: this.user.user_state_id['statename'] })).subscribe(res => {
          this.cbmdsrAndFbmdsrData = [];
          this.cbmdsrAndFbmdsrData = res[0];
          this.cbmdsrAndFbmdsrDataForDistrict = res[0];
          this.generateMap(res[1], this.mapChartDivVar);
        })
    } else if (this.user.accessupto == "District" || this.callingFrom == true) {
      this.obj['type'] = "getSubDistricts";
      forkJoin(this.form1Service.getDeathsWhereCbmdsrAndFbmdsrConducted(param),
        this.gisService.getSubDistricts({ type: this.obj['type'], states: [this.user.user_state_id['statename']], districts: this.callingFrom == true ? [this.passingArgOnDistrictClick['category']] : [passingArg['districtname']] })).subscribe(res => {
          this.cbmdsrAndFbmdsrDataForBlock = [];
          this.cbmdsrAndFbmdsrDataForBlock = res[0];
          this.generateMap(res[1], this.mapChartDivVar);
        })
    }
  }


  ngAfterViewInit() {
    
  }

  ngOnChanges(): void {   
    this.type = this.activatedRoute.snapshot.paramMap.get("type");
    if (this.isShowAllDistrictOnMap) {
      this.obj["type"] = "getDistricts";
      delete this.obj["statecode"];
      delete this.obj["statename"];      
    } else {
      this.obj["type"] = "getStates";
    }
  }

  generateMap(res,param) {
    
    // const colors = [
    //   am4core.color('#26a69a')
    // ];

    let chart = am4core.create(param, am4maps.MapChart);
    chart.logo.disabled = true;
    //configureing mouse event
    chart.chartContainer.wheelable = false;
    
    //added colors list
    // chart.colors.list = colors;
    chart.colors.list = [am4core.color("#26a69a")];
    //added geoJSON Data
  
    //setting projection
    chart.projection = new am4maps.projections.Miller();

    let stateSeries = chart.series.push(new am4maps.MapPolygonSeries());
    let districtSeries = chart.series.push(new am4maps.MapPolygonSeries());
    stateSeries.useGeodata = true;
    stateSeries.geodata = res[0]
    //setting death reported to map    
    let data = [];
    for (let i = 0; i < res[0].features.length; i++) {
      const itemMap = res[0].features[i];
      if (this.obj["type"] === "getStates") {
        const foundState = this.stateData.find(s => {
          return s.category.toLowerCase() == itemMap.properties.name.toLowerCase();
        });
        data.push({
          id: itemMap.id,
          stateName: foundState ? foundState.category : '',
          stateCode: foundState ? foundState.statecode : '',
          districtName: foundState ? foundState.district : '',
          districtCode: foundState ? foundState.districtCode : '',
          whereCBMDSRConducted: foundState ? foundState['column-2'] : 0,
          whereFBMDSRConducted: foundState ? foundState['column-1'] : 0,
          value:foundState ? foundState['column-2']+foundState['column-1'] :0
        })
      } else if (this.obj["type"] === "getDistricts") {
        const found = this.cbmdsrAndFbmdsrDataForDistrict.find(s => {
          return s.category.toLowerCase() == itemMap.properties.name.toLowerCase();
        });
        data.push({
          id: itemMap.id,
          //stateName: found ? found.state : '',
          //stateCode: found ? found.statecode : '',     
          districtName: found ? found.category : '',
          districtCode: found ? found.districtcode : '',
          whereCBMDSRConducted: found ? found['column-2'] : 0,
          whereFBMDSRConducted: found ? found['column-1'] : 0,
          value:found ? found['column-2']+found['column-1'] :0
        })
      } else if (this.obj["type"] === "getSubDistricts") {
        const found = this.cbmdsrAndFbmdsrDataForBlock.find(s => {
          return s.category.toLowerCase() == itemMap.properties.name.toLowerCase();
        });
        data.push({
          id: itemMap.id,
          //districtName: found ? found.category : '',
          //districtCode: found ? found.districtcode : '',
          blockName: found ? found.category : '',
          subdistrictcode: found ? found.subdistrictcode : '',
          whereCBMDSRConducted: found ? found['column-2'] : 0,
          whereFBMDSRConducted: found ? found['column-1'] : 0,
          value:found ? found['column-2']+found['column-1'] :0
        })
      }
    }
    
    stateSeries.data = data;

    let statePolygon = stateSeries.mapPolygons.template;
    statePolygon.strokeWidth = 0.2;
    statePolygon.stroke = am4core.color("black");
    if (this.obj["type"] === "getStates") {
      statePolygon.tooltipText = "State Name: {stateName} \n Child Death Reported: {value}\n # Deaths Reported in CBCDR : {whereCBMDSRConducted} \n # Deaths Reported in FBCDR : {whereFBMDSRConducted}";
    } else if (this.obj["type"] === "getDistricts") {
      statePolygon.tooltipText = "District Name : {districtName} \n # Child Deaths Reported : {value}\n # Deaths Reported in CBCDR : {whereCBMDSRConducted} \n # Deaths Reported in FBCDR : {whereFBMDSRConducted}";
    } else if (this.obj["type"] === "getSubDistricts") {
      statePolygon.tooltipText = "Block Name : {blockName} \n # Child Deaths Reported : {value}\n # Deaths Reported in CBCDR : {whereCBMDSRConducted} \n # Deaths Reported in FBCDR : {whereFBMDSRConducted}";
    }
    
    statePolygon.fill = chart.colors.getIndex(0);
    statePolygon.nonScalingStroke = true;
    chart.homeZoomLevel = 1.0;
    // Hover state
    let hs = statePolygon.states.create("hover");
    stateSeries.heatRules.push({
      property: "fill",
      target: statePolygon,
      // min: chart.colors.getIndex(1).brighten(1.5),
      // max: chart.colors.getIndex(1).brighten(0.3)
      min: chart.colors.getIndex(1).brighten(5),
			max: chart.colors.getIndex(1).brighten(0),
    });
    if (this.obj["type"] === "getStates") {
      statePolygon.events.on("hit", (ev) => {
        let chart = ev.target.series.chart;
        var data = ev.target.dataItem.dataContext;
        ev.target.series.chart.zoomToMapObject(ev.target);
  
        this.gisService.getDistricts({ stateName: data["name"] }).subscribe(res => {
          setTimeout(() => {
            this.districtData = [];
            this.obj["type"] = "getDistricts";
            this.obj["statecode"] = [data["stateCode"]];
            this.obj["statename"] = [data["stateName"]];
              this.form1Service.getCDRDeathForMap(this.obj).subscribe(districtsDeathReported => {
                for (var i = 0; i < res[0].features.length; i++) {
                  const districtItemMap = res[0].features[i];
                  const foundDistrict = districtsDeathReported.find(district => {
                    return district.district.trim().toLowerCase() == districtItemMap.properties.name.trim().toLowerCase()
                  })
    
                  this.districtData.push({
                    ...res[0].features[i].properties,
                    id: res[0].features[i].id,
                    value: foundDistrict ? foundDistrict.actual : 0
                  })
                }
                districtSeries.data = this.districtData;
              })
            
            
            stateSeries.hide();
            chart.geodata = res[0];
            districtSeries.show();
            districtSeries.useGeodata = true;
          }, chart.zoomDuration + 100);
  
          let districtPolygon = districtSeries.mapPolygons.template;
          districtPolygon.strokeWidth = 0.2;
          districtPolygon.stroke = am4core.color("black");
          districtPolygon.tooltipText = "State Name : {stateName}\nDistrict Name: {name} \n Child Death Reported : {value}";            
    
          districtPolygon.fill = chart.colors.getIndex(0);
          districtPolygon.nonScalingStroke = true;
  
          // Hover state
          let hs1 = districtPolygon.states.create("hover");
  
          //hs.properties.fill = am4core.color("#0D47A1");
  
          districtSeries.heatRules.push({
            property: "fill",
            target: districtPolygon,
            min: chart.colors.getIndex(1).brighten(1.5),
            max: chart.colors.getIndex(1).brighten(0.5)
          });
  
        })
      })      
    }

    // Zoom control
    chart.zoomControl = new am4maps.ZoomControl();


    let homeButton = new am4core.Button();
    homeButton.events.on("hit", () => {
      chart.goHome();
      districtSeries.hide();
      chart.goHome();
      stateSeries.show();
    });



    homeButton.icon = new am4core.Sprite();
    homeButton.padding(7, 5, 7, 5);
    homeButton.width = 30;
    homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
    homeButton.marginBottom = 10;
    homeButton.parent = chart.zoomControl;
    homeButton.insertBefore(chart.zoomControl.plusButton);



    // Set up heat legend
    // let heatLegend = chart.createChild(am4maps.HeatLegend);
    // heatLegend.series = stateSeries;
    // heatLegend.align = "right";
    // heatLegend.marginTop = 8;
    // heatLegend.width = am4core.percent(20);
    // heatLegend.height = 8;
    // heatLegend.marginRight = am4core.percent(8);
    // heatLegend.minValue = 0;
    // heatLegend.maxValue = 40000000;
    // heatLegend.valign = "top";
    
    // // Set up custom heat map legend labels using axis ranges
    // let minRange = heatLegend.valueAxis.axisRanges.create();
    // minRange.value = heatLegend.minValue;
    // minRange.label.text = "Little";
    // let maxRange = heatLegend.valueAxis.axisRanges.create();
    // maxRange.value = heatLegend.maxValue;
    // maxRange.label.text = "A lot!";

    // Enable export
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.exporting.menu.items[0].icon = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSIxNnB4IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAxNiAxNiIgd2lkdGg9IjE2cHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6c2tldGNoPSJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48dGl0bGUvPjxkZWZzLz48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGlkPSJJY29ucyB3aXRoIG51bWJlcnMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIj48ZyBmaWxsPSIjMDAwMDAwIiBpZD0iR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC03MjAuMDAwMDAwLCAtNDMyLjAwMDAwMCkiPjxwYXRoIGQ9Ik03MjEsNDQ2IEw3MzMsNDQ2IEw3MzMsNDQzIEw3MzUsNDQzIEw3MzUsNDQ2IEw3MzUsNDQ4IEw3MjEsNDQ4IFogTTcyMSw0NDMgTDcyMyw0NDMgTDcyMyw0NDYgTDcyMSw0NDYgWiBNNzI2LDQzMyBMNzMwLDQzMyBMNzMwLDQ0MCBMNzMyLDQ0MCBMNzI4LDQ0NSBMNzI0LDQ0MCBMNzI2LDQ0MCBaIE03MjYsNDMzIiBpZD0iUmVjdGFuZ2xlIDIxNyIvPjwvZz48L2c+PC9zdmc+";chart.exporting.menu.items[0].icon = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSIxNnB4IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAxNiAxNiIgd2lkdGg9IjE2cHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6c2tldGNoPSJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48dGl0bGUvPjxkZWZzLz48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGlkPSJJY29ucyB3aXRoIG51bWJlcnMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIj48ZyBmaWxsPSIjMDAwMDAwIiBpZD0iR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC03MjAuMDAwMDAwLCAtNDMyLjAwMDAwMCkiPjxwYXRoIGQ9Ik03MjEsNDQ2IEw3MzMsNDQ2IEw3MzMsNDQzIEw3MzUsNDQzIEw3MzUsNDQ2IEw3MzUsNDQ4IEw3MjEsNDQ4IFogTTcyMSw0NDMgTDcyMyw0NDMgTDcyMyw0NDYgTDcyMSw0NDYgWiBNNzI2LDQzMyBMNzMwLDQzMyBMNzMwLDQ0MCBMNzMyLDQ0MCBMNzI4LDQ0NSBMNzI0LDQ0MCBMNzI2LDQ0MCBaIE03MjYsNDMzIiBpZD0iUmVjdGFuZ2xlIDIxNyIvPjwvZz48L2c+PC9zdmc+";
    
    // Blank out internal heat legend value axis labels
    // heatLegend.valueAxis.renderer.labels.template.adapter.add("text", function (labelText) {
    //   return "";
    // });


  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      // if (this.chart) {
      //   this.chart.dispose();
      // }
    });
  }

}
