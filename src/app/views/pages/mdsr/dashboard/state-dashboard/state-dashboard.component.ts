import { Form4Service } from './../../../../../services/mdsr/form4.service';
import { FormBuilder } from '@angular/forms';
import { DistrictService } from './../../../../../services/locality/district.service';
import { FormGroup } from '@angular/forms';
import { DataList } from './../../../../../models/views/data-list';
import { Router } from '@angular/router';
import {
	Component,
	OnInit,
	NgZone,
	ChangeDetectorRef, ViewChild
} from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { Form1Service } from '../../../../../services/mdsr/form1.service';
import moment from 'moment';
import { AlertService } from '../../../../../utilities/alert.service';

import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatTable, MatOption } from '@angular/material';
import * as XLSX from "xlsx";
import { FormComponent } from '../../form5/form/form.component';
am4core.useTheme(am4themes_animated);

@Component({
	selector: 'kt-state-dashboard',
	templateUrl: './state-dashboard.component.html',
	styleUrls: ['./state-dashboard.component.scss']
})
export class StateDashboardComponent implements OnInit {
	isShowmdTotalMDsReported = false;
	isShowmdFacilityVSTransitVsHomeVsOther = false;
	callingFrom = true;
	passingArgOnDistrictClick: any;
	mapChartDiv = 'district';
	activeTab = 'Current Month';
	private charts: Array<any> = [];
	dataSource = [];
	isShowNotificationDetailTable = false;
	isShowMaternalDeathsDetails = false;
	fromDate;
	toDate;
	stateData: any;
	indicatorDetails: any;
	isShowState = true;
	isShowDistrict = false;
	selectedValue: string = "stateWise";
	where: any;
	mapChardDiv = 1;
	day: any
	mon: any;
	block_id;
	district_id;
	state_id;
	//maternal deaths notification array
	maternalDeathsNotification = [];
	blockwiseMaternalDeathsNotification = []
	currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
	@ViewChild(MatSort, { static: false }) districtwiseCbmdsrFbmdsr: MatSort;
	// mdsrForm5AddComponent is reffer to FormComponent of MDSR Form 5
	@ViewChild(FormComponent, { static: false }) mdsrForm5AddComponent: FormComponent;
	dataSourceForBlockwiseMaternalDeathsNotification: MatTableDataSource<any>;
	displayedColumnsForBlockwiseMaternalDeathsNotification: string[] = ['sn', 'districtname', 'subdistrictname', 'villagename', 'deceased_women_fname', 'husband_name', 'place_of_death', 'death_date_time'];
	dataSourceForDistrictwiseCbmdsrFbmdsr: MatTableDataSource<any>;
	displayedColumnsForDistrictwiseCbmdsrFbmdsr: string[] = ['sn', 'category', 'reported', 'totalMDs', 'column-2', 'column-1'];
	dataSourceForBlockwiseCbmdsrFbmdsr: MatTableDataSource<any>;
	displayedColumnsForBlockwiseCbmdsrFbmdsr: string[] = ['sn', 'category', 'reported', 'totalMDs', 'column-2', 'column-1'];
	dataSourceForBlockwiseMaternalDeathsDetail: MatTableDataSource<any>;
	displayedColumnsForBlockwiseMaternalDeathsDetail: string[] = ['sn', 'districtname', 'subdistrictname', 'villagename', 'deceased_women_fname', 'husband_name', 'place_of_death', 'death_date_time'];
	dataSourceForDistrictwiseCbmdsrFormStatus: MatTableDataSource<any>;
	displayedColumnsForDistrictwiseCbmdsrFormStatus: string[] = ['sn', 'districtname', 'form1', 'form5', 'form6', 'percentage'];
	dataSourceForDistrictwiseFbmdsrFormStatus: MatTableDataSource<any>;
	displayedColumnsForDistrictwiseFbmdsrFormStatus: string[] = ['snF', 'districtnameF', 'form1F', 'form4', 'form6F', 'percentage'];
	dataSourceForBlockwiseCbmdsrFormStatus: MatTableDataSource<any>;
	displayedColumnsForBlockwiseCbmdsrFormStatus: string[] = ['sn', 'subdistrictname', 'form1', 'form5', 'form6', 'finalStatus'];
	dataSourceForBlockwiseFbmdsrFormStatus: MatTableDataSource<any>;
	displayedColumnsForBlockwiseFbmdsrFormStatus: string[] = ['snF', 'subdistrictnameF', 'form1F', 'form4', 'form6F', 'finalStatusF'];

	topFilter: string = "all";

	filterForm: FormGroup;

	readonly columns: DataList["columns"] = [
		{ name: 'block', isActionField: true },
		{ name: 'UID', key: 'uuid' },
		{ name: 'Deceased Woman Name', isActionField: true },
		{ name: 'Age', key: 'age' },
		{ name: 'Village', key: 'village_id.villagename' },
		{ name: 'Place of Death', key: 'place_of_death' },
		{ name: 'Death Date Time', isActionField: true },
		{ name: 'IsMaternal', isActionField: true },
		{ name: 'form4Submitted', isActionField: true },
	]
	readonly columnsToDisplay = this.columns.map(c => c.name);
	topFilterChange(value) {
		this.topFilter = value;
	}
	place_of_death: any;
	//Test Data
	displayedColumnsWhereCbmdsrAndFbmdsrConductedDatasource2: string[] = ['sn', 'district', 'md', 'dnotreviwed'];
	data2 = [
		{ district: 'Agra', md: 2, dnotreviwed: 1 },
		{ district: 'Aligarh', md: 1, dnotreviwed: 1 },
		{ district: 'Allahabad', 'md': 1, dnotreviwed: 1 },
		{ district: 'Ambedkar Nagar', 'md': 2, dnotreviwed: 1 },
		{ district: 'Amroha', 'md': 2, dnotreviwed: 1 },
		{ district: 'Auraiya', md: 2, dnotreviwed: 0 },
		{ district: 'Azamgarh', md: 1, dnotreviwed: 0 },
		{ district: 'Baghpat', md: 2, dnotreviwed: 1 }];
	data3 = [
		{ district: 'Agra', md: 1, dnotreviwed: 1 },
		{ district: 'Ambedkar Nagar', 'md': 1, dnotreviwed: 0 },
		{ district: 'Amroha', 'md': 1, dnotreviwed: 1 },
		{ district: 'Auraiya', 'md': 1, dnotreviwed: 0 },
		{ district: 'Baghpat', md: 3, dnotreviwed: 1 },
		{ district: 'Balrampur', md: 2, dnotreviwed: 1 },
		{ district: 'Banda', md: 2, dnotreviwed: 1 },
		{ district: 'Bareilly', md: 1, dnotreviwed: 0 }];
	constructor(
		private zone: NgZone,
		private changeDetectorRef: ChangeDetectorRef,
		private form1Service: Form1Service,
		private alertService: AlertService,
		private districtService: DistrictService,
		private router: Router,
		private fb: FormBuilder,
		private form4Service: Form4Service
	) { }

	private maternalCausesYearOnYear() {
		this.zone.runOutsideAngular(() => {
			// CART 1
			const chart1 = am4core.create('chart1', am4charts.PieChart);
			//chart1.colors.list = colors;
			chart1.exporting.menu = new am4core.ExportMenu();
			chart1.exporting.dataFields = {
				"category": "Indirect Cause",
				"column-1": "Value"
			};
			chart1.innerRadius = am4core.percent(35);
			chart1.data = [
				{
					category: 'Dengue',
					'column-1': this.MaternalCauses.Dengue,
					color: am4core.color('#f34225')
				},
				{
					category: 'Respiratory Disorders',
					'column-1': this.MaternalCauses.RespiratoryDisorders,
					color: am4core.color('#f56528')
				},
				{
					category: 'HIV / AIDS',
					'column-1': this.MaternalCauses.HIV_AIDS,
					color: am4core.color('#fa9e30')
				},
				{
					category: 'H1N1 viral Disease',
					'column-1': this.MaternalCauses.H1N1ViralDisease,
					color: am4core.color('#fcd338')
				},
				{
					category: 'Malaria',
					'column-1': this.MaternalCauses.Malaria,
					color: am4core.color('#f3ee3c')
				},
				{
					category: 'Enhephalitis',
					'column-1': this.MaternalCauses.Enhephalitis,
					color: am4core.color('#b0de33')
				},
				{
					category: 'Other Indirect Causes',
					'column-1': this.MaternalCauses.OtherInDirectCauses,
					color: am4core.color('#68d42c')
				}
			];
			chart1.data = chart1.data.filter(item => item['column-1'] != 0)
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

			title1.text = 'Indirect Maternal Death Cause';
			title1.fontSize = 15;

			this.charts.push(chart1);

			// CART 2
			const chart2 = am4core.create('chart2', am4charts.PieChart);
			//chart2.colors.list = colors;
			chart2.exporting.menu = new am4core.ExportMenu();
			chart2.exporting.dataFields = {
				"category": "Dierct Cause",
				"column-1": "Value"
			};
			chart2.innerRadius = am4core.percent(35);

			chart2.data = [
				{
					category: 'Abortion',
					'column-1': this.MaternalCauses.abortion,
					color: am4core.color('#f34225')
				},
				{
					category: 'Hypertension',
					'column-1': this.MaternalCauses.Hypertension,
					color: am4core.color('#f56528')
				},
				{
					category: 'Sepsis',
					'column-1': this.MaternalCauses.sepsis,
					color: am4core.color('#fa9e30')
				},
				{
					category: 'Hemorrhage',
					'column-1': this.MaternalCauses.haemorrhage,
					color: am4core.color('#fcd338')
				},
				{
					category: 'Obstructive Labour',
					'column-1': this.MaternalCauses.obstructedLabour,
					color: am4core.color('#f3ee3c')
				},
				{
					category: 'Other Direct Causes',
					'column-1': this.MaternalCauses.OtherDirectCause,
					color: am4core.color('#68d42c')
				}
			];

			chart2.data = chart2.data.filter(item => item['column-1'] != 0)

			var pieSeries = chart2.series.push(new am4charts.PieSeries());
			pieSeries.dataFields.value = 'column-1';
			pieSeries.dataFields.category = 'category';
			pieSeries.slices.template.propertyFields.fill = 'color';

			// pieSeries.labels.template.text = '{value}';
			pieSeries.ticks.template.disabled = true;
			pieSeries.alignLabels = false;
			pieSeries.labels.template.text = "{value.percent.formatNumber('#.0')}%";
			pieSeries.labels.template.radius = am4core.percent(-30);
			pieSeries.labels.template.fontWeight = "600";
			// pieSeries.labels.template.fill = am4core.color("white");

			chart2.legend = new am4charts.Legend();
			chart2.legend.align = 'center';
			chart2.legend.fontSize = 12;
			chart2.legend.labels.template.text = '{category}';
			chart2.legend.valueLabels.template.text = '';

			chart2.legend.markers.template.marginRight = 2;
			chart2.legend.markers.template.width = 16;
			chart2.legend.markers.template.height = 16;

			const title2 = chart2.titles.create();

			title2.text = 'Direct Maternal Death Cause';
			title2.fontSize = 15;

			this.charts.push(chart2);
		});
	}
	districtList = [];

	countParam = {};
	ngOnInit() {
		this.fromDate = moment([2020, 0, 1]);
		this.toDate = moment();
		this.mon = moment().month() + 1;
		if (moment().date() > 10) {
			this.day = moment().date();
		} else {
			this.day = "0" + moment().date();
		}
		this.setTitle();
		this.filterForm = this.createFilterForm();
		if (this.currentUser.accessupto == "Block") {
			this.block_id = this.currentUser.user_block_id;
			this.state_id = this.currentUser.user_state_id;
			if (this.currentUser.designation === 'BMO') {
				this.columns.push({ name: 'form5Submitted', isActionField: true }, { name: 'form6Submitted', isActionField: true });
				this.columnsToDisplay.push('form5Submitted', 'form6Submitted')

			}
			this.getDeathsWhereCbmdsrAndFbmdsrConducted(this.block_id);
			this.isShowmdFacilityVSTransitVsHomeVsOther = false;
			this.isShowmdTotalMDsReported = false;
		} else if (this.currentUser.accessupto == "District") {
			this.district_id = this.currentUser.user_district_id;
			this.getDeathsWhereCbmdsrAndFbmdsrConducted(this.district_id);
			this.getNotificationCount(this.countParam)
			this.getMaternalCauseOfdeathsFor6Months();
		} else if (this.currentUser.accessupto == "State") {

			this.state_id = this.currentUser.user_state_id;
			this.getDeathsWhereCbmdsrAndFbmdsrConducted(this.state_id);
			this.getSubmittedFormsStatusDistrictwise(this.state_id);
			this.fbmdrVsCbmdrGraph({ fromDate: this.fromDate, toDate: this.toDate, statecodes: [this.state_id.statecode], accessupto: this.currentUser.accessupto, type: "getDistricts" });
			this.isShowmdFacilityVSTransitVsHomeVsOther = true;
			this.isShowmdTotalMDsReported = true;
			this.getIcd10CodesCategorywise();

			this.getMaternalCauseOfdeathsFor6Months();
		} else {
			this.getDeathsWhereCbmdsrAndFbmdsrConducted({});
			this.isShowmdFacilityVSTransitVsHomeVsOther = false;
			this.isShowmdTotalMDsReported = false;
			this.getIcd10CodesCategorywise();
		}
		// this.fromDate = "01" + "-" + mon + "-" + moment().year();
		this.fromDate = (moment().year() - 1) + "-" + this.mon + "-" + "01";
		this.toDate = moment().year() + "-" + this.mon + "-" + this.day;
		this.where = {
			state_id: this.state_id ? this.state_id : undefined,
			district_id: this.district_id ? this.district_id : undefined,
			block_id: this.block_id ? this.block_id : undefined,
			updatedAt: {
				"$gte": this.fromDate,
				"$lte": moment(this.toDate).add(1, 'day') 
			}
		}
		this.countParam = {
			"state_id.statecode": this.state_id ? this.state_id.statecode : undefined,
			"district_id.districtcode": this.district_id ? this.district_id.districtcode : undefined,
			"block_id.subdistrictcode": this.block_id ? this.block_id.subdistrictcode : undefined,
			updatedAt: {
				"$gte": this.fromDate,
				"$lte": moment(this.toDate).add(1, 'day')
			}
		}
		if (this.currentUser.designation == "Facility" || this.currentUser.designation == "FNO") {
			this.place_of_death = { inq: ["Health Facility"] }
		} else {
			this.place_of_death = { inq: ["Home", "Transit", "Other", "Health Facility"] }
		}
		let wherequery = {
			"where": {
				"place_of_death": this.place_of_death,
				"state_id.statecode": this.state_id ? this.state_id.statecode : undefined,
				"district_id.districtcode": this.district_id ? this.district_id.districtcode : undefined,
				"block_id.subdistrictcode": this.block_id ? this.block_id.subdistrictcode : undefined,
				"updatedAt": { between: [this.fromDate, moment(this.toDate).add(1, 'day')] },
				"is_maternal_death": true
			},
			"include": ["mdsrForm4s", "mdsrForm5s"]
		} as any;
		this.getNotificationCount(this.countParam)
		setTimeout(() => {
			this.form1Service.getList(wherequery).subscribe(res => {
				this.dataSource = res;
				this.changeDetectorRef.detectChanges();
			})
		}, 500)
		//get Top 4 Indicator Details
		this.getTopIndicatorData(this.countParam);
		this.districtService.getDistricts(this.state_id.statecode).subscribe(res => {
			this.districtList = res;
			const districtcodes: number[] = this.districtList.map(district => district.districtcode);
			//for all state selection..
			districtcodes.push(0);
			this.filterForm.patchValue({ districtcodes })
		});

	}

	// Top 4 Block Details
	getTopIndicatorData(countParam) {
	
		this.form1Service.getDashboardData(countParam).subscribe(res => {
			console.log("res---------------------------- : ",res);
			this.indicatorDetails = res[0];
			this.changeDetectorRef.detectChanges();
		});
	}

	getNotificationCount(countParam) {
		this.form1Service.getNotificationCount(countParam).subscribe(res => {
			if (res.length > 0) {
				this.maternalDeathsNotification = [];
				this.maternalDeathsNotification.push({
					cbmdsr: { count: res[0]['CB'], type: "CBMDSR" },
					fbmdsr: { count: res[0]['FB'], type: "FBMDSR" }
				})
				this.changeDetectorRef.detectChanges();
			}

		});
	}
	selectedValueMDsFacilityVsHomeVsTransit: string = "percentWise";

	onChangeFacilityVsHomeVsTransit(value) {
		this.selectedValueMDsFacilityVsHomeVsTransit = value;
	}

	createFilterForm() {
		return this.fb.group({
			districtcodes: [],
			fromDate: [this.fromDate],
			toDate: [this.toDate]
		})
	}

	getNotificationDetails(arg) {
		const { fromDate, toDate } = this.filterForm.value
		this.isShowNotificationDetailTable = false;
		this.isShowMaternalDeathsDetails = false;
		let whereParam = {};//this.where;
		whereParam = {
			"state_id.statecode": this.state_id ? this.state_id.statecode : undefined,
			"district_id.districtcode": this.district_id ? this.district_id.districtcode : undefined,
			"block_id.subdistrictcode": this.block_id ? this.block_id.subdistrictcode : undefined,
			updatedAt: { "$gte": fromDate, "$lte": moment(toDate).add(1, 'day') }
		}
		if (arg.type == "CBMDSR") {
			whereParam['place_of_death'] = { '$in': ["Home", "Transit", "Other"] }
		} else if (arg.type == "FBMDSR") {
			whereParam['place_of_death'] = { '$in': ["Health Facility"] }
		}
		this.form1Service.getNotificationDetails(whereParam).subscribe(res => {
			this.blockwiseMaternalDeathsNotification = res;
			this.dataSourceForBlockwiseMaternalDeathsNotification = new MatTableDataSource(res);
			//this.dataSourceForBlockwiseMaternalDeathsNotification.sort=this.maternalDeathsNotifications;
			this.isShowNotificationDetailTable = true;
			this.isShowMaternalDeathsDetails = true;
			this.changeDetectorRef.detectChanges();
		});
	}
	MaternalDeathsNotificationsDetails: string;
	getDetails(type, title) {
		const { districtcodes, fromDate, toDate } = this.filterForm.value;
		this.MaternalDeathsNotificationsDetails = `${title} <small>${moment(fromDate).format("DD-MM-YYYY")}-${moment(toDate).format("DD-MM-YYYY")}</small>`
		let where = {
			"state_id.statecode": this.state_id.statecode,
			"district_id.districtcode": districtcodes && districtcodes.length ? { inq: districtcodes } : undefined,
			"block_id.subdistrictcode": this.block_id ? this.block_id.subdistrictcode : undefined,
			updatedAt: { between: [this.fromDate, moment(this.toDate).add(1, 'day')] }
		} as any;

		if (type != "reportedDeath") {
			where.is_maternal_death = true;
		}
		this.form1Service.getList({ where, include: ["mdsrForm4s", "mdsrForm5s"] }).subscribe(res => {
			this.blockwiseMaternalDeathsNotification = res;
			this.dataSourceForBlockwiseMaternalDeathsNotification = new MatTableDataSource(res);
			let data = [];
			if (type === 'reviewPending') {
				data = this.blockwiseMaternalDeathsNotification.filter(item => item.mdsrForm5s && item.mdsrForm5s.length == 0);
				this.dataSourceForBlockwiseMaternalDeathsNotification = new MatTableDataSource(data);
			} else if (type === 'reviewCompleted') {
				data = this.blockwiseMaternalDeathsNotification.filter(item => item.mdsrForm5s && item.mdsrForm5s.length > 0);
				this.dataSourceForBlockwiseMaternalDeathsNotification = new MatTableDataSource(data);
			}
			this.isShowNotificationDetailTable = true;
			this.isShowMaternalDeathsDetails = true;
			this.changeDetectorRef.detectChanges();
		})
	}

	MaternalCauses: any;
	getIcd10CodesCategorywise() {
		const { fromDate, toDate, districtcodes, subdistrictcodes } = this.filterForm.value;
		let param = {
			fromDate,
			toDate,
			statecodes: [this.state_id.statecode],
			districtcodes: this.currentUser.accessupto === 'State' ? districtcodes : [this.district_id.districtcode],
			subdistrictcodes,
			accessUpto: this.currentUser.accessupto
		}
		this.form1Service.getMaternalCauseOfdeaths(param).subscribe(getMatRes => {
			this.MaternalCauses = getMatRes[0];
			this.maternalCausesYearOnYear();
			this.changeDetectorRef.detectChanges();
		});

	}

	MaternalDeathsDistrictwiseTabularViewTitle: string;
	MaternalDeathsBlockwiseTabularViewTitle: string;
	MaternalDeathsDistrictwiseGraphViewTitle: string;
	MaternalDeathsBlockwiseGraphViewTitle: string;

	CBMDSRMaternalDeathsFormsStatusTitle: string;
	CBMDSRMaternalDeathsFormsStatusDistrictwiseTitle: string;
	CBMDSRMaternalDeathsFormsStatusBlockwiseTitle: string;

	FBMDSRMaternalDeathsFormsStatusTitle: string;
	FBMDSRMaternalDeathsFormsStatusDistrictwiseTitle: string;
	FBMDSRMaternalDeathsFormsStatusBlockwiseTitle: string;

	placeOfDeathPieChartTitle: string;
	DistrictsWithMostMaternalDeathsReportedTitle: string;
	MDsAtFacilityVsTransitVsHomeVsOtherTitle: string;
	MDsForwhichFBMDSR_CBMDSRHasBeenConductedTitle: string;
	EstimatedVsActualReportedMaternalDeathsInPercentageTitle: string;
	MajorCausesOfMaternalDeathsDataTitle: string;

	EstimatedVsActualReportedMDs: string;
	OutofTotalFBMDSRCasesHowManyCBMDSRAreCompleted: string;
	OutofTotalFBMDSRCasesHowManyCBMDSRAreCompletedInPer: string;
	Stateswhohavenotuploadedreviewmeetingdetails: string;
	MDnotreviewedbyCMO: string;
	MDnotreviewedbyDCDM: string;
	monthOnMonthTitle: string;
	NotificationTitle: string;

	setTitle() {
		this.MaternalDeathsDistrictwiseTabularViewTitle = `Maternal Deaths Districtwise - Tabular View <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`
		this.MaternalDeathsBlockwiseTabularViewTitle = `Maternal Deaths Blockwise - Tabular View <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`
		this.NotificationTitle = `Notification Details`; // <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`
		this.MaternalDeathsDistrictwiseGraphViewTitle = `Maternal Deaths Districtwise - Graph View <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.MaternalDeathsBlockwiseGraphViewTitle = `Maternal Deaths Blockwise - Graph View <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;

		this.CBMDSRMaternalDeathsFormsStatusTitle = `CBMDSR Maternal Deaths Forms Status View <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.CBMDSRMaternalDeathsFormsStatusDistrictwiseTitle = `CBMDSR Maternal Deaths Forms Status Districtwise <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.CBMDSRMaternalDeathsFormsStatusBlockwiseTitle = `CBMDSR Maternal Deaths Forms Status Blockwise <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;

		this.FBMDSRMaternalDeathsFormsStatusTitle = `FBMDSR Maternal Deaths Forms Status View <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.FBMDSRMaternalDeathsFormsStatusDistrictwiseTitle = `FBMDSR Maternal Deaths Forms Status Districtwise <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.FBMDSRMaternalDeathsFormsStatusBlockwiseTitle = `FBMDSR Maternal Deaths Forms Status Blockwise <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;

		this.MDsForwhichFBMDSR_CBMDSRHasBeenConductedTitle = `% of MDs for which FBMDSR/CBMDSR has been conducted <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.MDsAtFacilityVsTransitVsHomeVsOtherTitle = `MDs at Facility vs Transit vs Home Vs Other <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.DistrictsWithMostMaternalDeathsReportedTitle = `Districts with most maternal deaths reported <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.placeOfDeathPieChartTitle = `Proportion of MDs occurring at home, transit, facility and Other out of total MDs reported <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;

		this.EstimatedVsActualReportedMaternalDeathsInPercentageTitle = `Estimated Vs Actual(Reported) Maternal Deaths in % <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.MajorCausesOfMaternalDeathsDataTitle = `Major Causes of Maternal Death\'s data <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;

		this.EstimatedVsActualReportedMDs = `Estimated Vs Actual(Reported) Maternal Deaths <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.OutofTotalFBMDSRCasesHowManyCBMDSRAreCompleted = `Out of Total FBMDSR Cases, How Many CBMDSR Are Completed <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.OutofTotalFBMDSRCasesHowManyCBMDSRAreCompletedInPer = `Out of Total FBMDSR Cases, How Many CBMDSR Are Completed in % <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.Stateswhohavenotuploadedreviewmeetingdetails = `States who have not uploaded review meeting details <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.MDnotreviewedbyCMO = `MD not reviewed by CMO <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.MDnotreviewedbyDCDM = `MD not reviewed by DC/DM <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
		this.monthOnMonthTitle = `Maternal Causes of Deaths (Month on Month) <small>${this.fromDate.format('DD-MM-YYYY')} - ${this.toDate.format('DD-MM-YYYY')}</small>`;
	}

	whereCbmdsrAndFbmdsrConducted: any;
	totalCbmdsr: number = 0;
	totalFbmdsr: number = 0;
	reported: number = 0;
	totalMDs: number = 0;
	getDeathsWhereCbmdsrAndFbmdsrConducted(accessArg) {
		const { districtcodes, fromDate, toDate } = this.filterForm.value;
		this.totalCbmdsr = 0;
		this.totalFbmdsr = 0;
		this.reported = 0;
		this.totalMDs = 0;
		let previousYearFromDate = moment(fromDate)
		let previousYearToDate = moment(toDate).add(1, 'day');

		let param = {
			previousYearFromDate: previousYearFromDate,
			previousYearToDate: previousYearToDate,
			where: accessArg,
			statecodes: this.state_id.statecode,
			districtcodes,
			accessUpto: this.currentUser.accessupto
		}
		this.form1Service.getDeathsWhereCbmdsrAndFbmdsrConducted(param).subscribe(Res => {
			console.log("Res :  ",Res);
			Res.sort(function (a, b) {
				var whereFBMDSRConductedA = a['category']
				var whereFBMDSRConductedB = b['category']
				return (whereFBMDSRConductedA > whereFBMDSRConductedB) ? 1 : (whereFBMDSRConductedA < whereFBMDSRConductedB) ? -1 : 0;
			});
			let data = districtcodes && districtcodes.length ? Res.filter(item => districtcodes.includes(item.districtcode)) : Res;
			this.whereCbmdsrAndFbmdsrConducted = data;
			this.dataSourceForDistrictwiseCbmdsrFbmdsr = new MatTableDataSource(data);
			this.dataSourceForDistrictwiseCbmdsrFbmdsr.sort = this.districtwiseCbmdsrFbmdsr;
			Res.forEach(element => {
				this.totalCbmdsr = this.totalCbmdsr + element['column-2'];
				this.totalFbmdsr = this.totalFbmdsr + element['column-1'];
				this.totalMDs = this.totalMDs + element['totalMDs'];
				this.reported = this.reported + element['reported'];
			});
			//this.drawGraphWhereCbmdsrAndFbmdsrConducted();;
			this.changeDetectorRef.detectChanges();
		});
	}

	selectedValueCBFBMDSR = "percentWise";
	onChangeCBFBMDSR(value) {
		this.selectedValueCBFBMDSR = value;
		this.totalCBOutOfFBMDSR();
	}

	stateDataCBOutOfFBMDSR = [];
	private totalCBOutOfFBMDSR() {
		this.zone.runOutsideAngular(() => {
			// Expected Vs Actual Maternal Death
			var chart = am4core.create('totalCBOutOfFBMDSR', am4charts.XYChart);

			chart.exporting.menu = new am4core.ExportMenu();
			chart.legend = new am4charts.Legend()
			chart.legend.position = 'top'
			chart.legend.paddingBottom = 10
			chart.legend.labels.template.maxWidth = 95;

			chart.logo.disabled = true;
			chart.colors.list = [
				am4core.color("#007bff"),
				am4core.color("#ffb822")
			];
			// Add data
			chart.data = this.stateDataCBOutOfFBMDSR;
			// Create axes
			var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.dataFields.category = "districtname";
			categoryAxis.renderer.grid.template.location = 0;
			categoryAxis.renderer.minGridDistance = 20;

			categoryAxis.title.text = "";

			let label = categoryAxis.renderer.labels.template;
			label.truncate = true;
			label.maxWidth = 150;
			label.tooltipText = '{category}';
			categoryAxis.events.on('sizechanged', function (ev) {
				let axis = ev.target;
				var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
				if (cellWidth < axis.renderer.labels.template.maxWidth) {
					axis.renderer.labels.template.rotation = 0;
					categoryAxis.renderer.labels.template.rotation = -45;
					axis.renderer.labels.template.horizontalCenter = 'right';
					axis.renderer.labels.template.verticalCenter = 'middle';
				} else {
					axis.renderer.labels.template.rotation = 0;
					categoryAxis.renderer.labels.template.rotation = -45;
					axis.renderer.labels.template.horizontalCenter = 'middle';
					axis.renderer.labels.template.verticalCenter = 'top';
				}
			});

			var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.min = 0;
			valueAxis.max = 100;
			valueAxis.strictMinMax = true;
			valueAxis.title.text = "Maternal Deaths";

			// Create series
			function createSeries1(field, name, stacked, selectedValue) {
				var series = chart.series.push(new am4charts.ColumnSeries());
				series.dataFields.valueY = field;
				series.dataFields.categoryX = "districtname";
				series.name = name;
				if (selectedValue === 'percentWise') {
					series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]%";
				} else {
					series.columns.template.tooltipText = "{name}: [bold]{valueY}";
				}
				series.stacked = stacked;
				series.columns.template.column.cornerRadiusTopLeft = 5;
				series.columns.template.column.cornerRadiusTopRight = 5;

				let bullet = series.bullets.push(new am4charts.LabelBullet())
				bullet.interactionsEnabled = false
				bullet.dy = -10;
				if (selectedValue == 'percentWise') {
					bullet.label.text = '{valueY}%'
				} else {
					bullet.label.text = '{valueY}'
				}
				bullet.label.fill = am4core.color('#000000');
				bullet.label.fontWeight = 'bold';

				series.columns.template.adapter.add("fill", function (fill, target) {
					if (target.dataItem['categoryX'] == 'Ind') {
						if (name === 'CBMDR') {
							return am4core.color("#ff7043");
						}
						return am4core.color("#ffbb93");
					} else {
						return fill;
					}
				});

				series.columns.template.adapter.add("stroke", function (fill, target) {
					if (target.dataItem['categoryX'] == 'Ind') {
						if (name === 'CBMDR') {
							return am4core.color("#ff7043");
						}
						return am4core.color("#ffbb93");
					} else {
						return fill;
					}
				});
			}

			if (this.selectedValueCBFBMDSR === 'percentWise') {
				createSeries1("percent", "Percentage", false, this.selectedValueCBFBMDSR);
			} else {
				createSeries1("fbmdr", "FBMDR", false, this.selectedValueCBFBMDSR);
				createSeries1("cbmdr", "CBMDR", false, this.selectedValueCBFBMDSR);
				this.changeDetectorRef.detectChanges();
			}
			// Cursor
			chart.cursor = new am4charts.XYCursor();
			//scrollbar
			chart.scrollbarX = new am4core.Scrollbar();

			this.charts.push(chart);
		})
	}

	fbmdrVsCbmdrGraph(params) {
		console.log("params --------------------------: ",params);
		let obj = {
			cbmdr: 0,
			code: "Ind",
			fbmdr: 0,
			name: "India",
			percent: 0,
			statecode: 0
		}

		this.form4Service.fbmdrVsCbmdrSubmitted(params).subscribe(data => {
			this.stateDataCBOutOfFBMDSR = data;
			if (this.stateDataCBOutOfFBMDSR && this.stateDataCBOutOfFBMDSR) {
				this.stateDataCBOutOfFBMDSR.forEach(element => {
					obj.cbmdr += element.cbmdr;
					obj.fbmdr += element.fbmdr;
				});
				obj.percent = obj.fbmdr ? Math.round((obj.cbmdr / obj.fbmdr) * 100) : 0;
			}
			this.totalCBOutOfFBMDSR()
		})
	}

	GraphMaternalCausesLast6Month: any;
	getMaternalCauseOfdeathsFor6Months() {
		const { fromDate, toDate, districtcodes } = this.filterForm.value;
		let datesArray = [];
		const monthDifference = moment(toDate).diff(moment(fromDate), 'months', false);
		for (let i = 0; i <= monthDifference; i++) {
			datesArray.push({
				fromDate: moment(fromDate).add(i, "months").startOf("month").format("YYYY-MM-DD"),
				toDate: moment(fromDate).add(i, "months").endOf("month").format("YYYY-MM-DD"),
				month: moment(fromDate).add(i, "months").format("MM"),
				year: moment(fromDate).add(i, "months").format("YYYY"),
			});
		}
		let param = {
			datesArray,
			fromDate,
			toDate,
			districtcodes,
			statecodes: [this.state_id.statecode],
			accessUpto: this.currentUser.accessupto
		}
		this.form1Service.getMaternalCauseOfdeathsFor6Months(param).subscribe(Res6monthsData => {
			this.GraphMaternalCausesLast6Month = Res6monthsData;
			this.drawGraphMaternalCausesLast6Month();;
			this.changeDetectorRef.detectChanges();
		});
	}

	drawGraphMaternalCausesLast6Month() {
		// CART 4
		const chart4 = am4core.create('chart4', am4charts.XYChart);
		chart4.paddingRight = 20;
		const colors = [
			am4core.color('#f56528'),
			am4core.color('#fcd338'),
			am4core.color('#b0de33'),
			am4core.color('#0d8ecf'),
			am4core.color('#ab47bc'),
			am4core.color('#7e57c2'),
			am4core.color('#26a69a')
		];
		chart4.colors.list = colors;
		chart4.exporting.menu = new am4core.ExportMenu();

		// Create axes
		var dateAxis = chart4.xAxes.push(new am4charts.DateAxis());
		dateAxis.renderer.minGridDistance = 50;
		dateAxis.renderer.grid.template.location = 0.5;
		dateAxis.startLocation = 0.5;
		dateAxis.endLocation = 0.5;

		// Create value axis

		chart4.legend = new am4charts.Legend();
		chart4.legend.align = 'center';
		chart4.legend.fontSize = 12;

		chart4.legend.markers.template.marginRight = 2;
		chart4.legend.markers.template.width = 16;
		chart4.legend.markers.template.height = 16;

		chart4.cursor = new am4charts.XYCursor();
		chart4.cursor.tooltipText = 'test';

		var valueAxis = chart4.yAxes.push(new am4charts.ValueAxis());
		valueAxis.min = 0;
		valueAxis.title.text = "Total MDs";

		const chart4data = this.GraphMaternalCausesLast6Month;

		var xySeries201 = chart4.series.push(new am4charts.LineSeries());
		xySeries201.dataFields.valueY = 'column-1';
		xySeries201.dataFields.dateX = 'category';
		xySeries201.strokeWidth = 3;
		xySeries201.tensionX = 0.8;
		xySeries201.bullets.push(new am4charts.CircleBullet());
		xySeries201.data = chart4data;
		xySeries201.name = 'Abortion';
		xySeries201.tooltipText = '{name}: [bold]{valueY}[/]';
		xySeries201.strokeWidth = 1;

		var xySeries202 = chart4.series.push(new am4charts.LineSeries());
		xySeries202.dataFields.valueY = 'column-2';
		xySeries202.dataFields.dateX = 'category';
		xySeries202.strokeWidth = 3;
		xySeries202.tensionX = 0.8;
		xySeries202.bullets.push(new am4charts.CircleBullet());
		xySeries202.data = chart4data;
		xySeries202.name = 'Hypertension';
		xySeries202.tooltipText = '{name}: [bold]{valueY}[/]';
		xySeries202.strokeWidth = 1;

		var xySeries3 = chart4.series.push(new am4charts.LineSeries());
		xySeries3.dataFields.valueY = 'column-3';
		xySeries3.dataFields.dateX = 'category';
		xySeries3.strokeWidth = 3;
		xySeries3.tensionX = 0.8;
		xySeries3.bullets.push(new am4charts.CircleBullet());
		xySeries3.data = chart4data;
		xySeries3.name = 'Sepsis';
		xySeries3.tooltipText = '{name}: [bold]{valueY}[/]';
		xySeries3.strokeWidth = 1;

		var xySeries4 = chart4.series.push(new am4charts.LineSeries());
		xySeries4.dataFields.valueY = 'column-4';
		xySeries4.dataFields.dateX = 'category';
		xySeries4.strokeWidth = 3;
		xySeries4.tensionX = 0.8;
		xySeries4.bullets.push(new am4charts.CircleBullet());
		xySeries4.data = chart4data;
		xySeries4.name = 'Hemorrhage';
		xySeries4.tooltipText = '{name}: [bold]{valueY}[/]';
		xySeries4.strokeWidth = 1;

		var xySeries5 = chart4.series.push(new am4charts.LineSeries());
		xySeries5.dataFields.valueY = 'column-5';
		xySeries5.dataFields.dateX = 'category';
		xySeries5.strokeWidth = 3;
		xySeries5.tensionX = 0.8;
		xySeries5.bullets.push(new am4charts.CircleBullet());
		xySeries5.data = chart4data;
		xySeries5.name = 'Embolism';
		xySeries5.tooltipText = '{name}: [bold]{valueY}[/]';
		xySeries5.strokeWidth = 1;

		var xySeries6 = chart4.series.push(new am4charts.LineSeries());
		xySeries6.dataFields.valueY = 'column-6';
		xySeries6.dataFields.dateX = 'category';
		xySeries6.strokeWidth = 3;
		xySeries6.tensionX = 0.8;
		xySeries6.bullets.push(new am4charts.CircleBullet());
		xySeries6.data = chart4data;
		xySeries6.name = 'IndirectCause';
		xySeries6.tooltipText = '{name}: [bold]{valueY}[/]';
		xySeries6.strokeWidth = 1;

		var xySeries7 = chart4.series.push(new am4charts.LineSeries());
		xySeries7.dataFields.valueY = 'column-7';
		xySeries7.dataFields.dateX = 'category';
		xySeries7.strokeWidth = 3;
		xySeries7.tensionX = 0.8;
		xySeries7.bullets.push(new am4charts.CircleBullet());
		xySeries7.data = chart4data;
		xySeries7.name = 'Other Direct Causes';
		xySeries7.tooltipText = '{name}: [bold]{valueY}[/]';
		xySeries7.strokeWidth = 1;

		this.charts.push(chart4);




	}

	whereCbmdsrAndFbmdsrConductedInBlock;
	whereCbmdsrAndFbmdsrConductedInBlockForGraph;
	isShowBlockTable = false;
	totalCbmdsrBlockwise: number = 0;
	totalFbmdsrBlockwise: number = 0;
	totalreportedBlockwise: number = 0;
	totaltotalMDsBlockwise: number = 0;
	
	getBlocksData(arg) {
		this.totalCbmdsrBlockwise = 0;
		this.totalFbmdsrBlockwise = 0;
		let blocksData = [];
		this.passingArgOnDistrictClick = arg;
		this.mapChartDiv = 'block';
		this.whereCbmdsrAndFbmdsrConductedInBlock = [];
		let previousYearFromDate = (moment().year() - 1) + "-" + "01" + "-" + "01";
		let previousYearToDate = (moment().year()) + "-" + "12" + "-" + "31";
		let param = {
			previousYearFromDate: previousYearFromDate,
			previousYearToDate: previousYearToDate,
			where: { "districtcode": arg['districtcode'] },
			accessUpto: "District"
		}
		this.form1Service.getDeathsWhereCbmdsrAndFbmdsrConducted(param).subscribe(Res => {
			Res.sort(function (a, b) {
				var whereFBMDSRConductedA = a['category']
				var whereFBMDSRConductedB = b['category']
				return (whereFBMDSRConductedA > whereFBMDSRConductedB) ? 1 : (whereFBMDSRConductedA < whereFBMDSRConductedB) ? -1 : 0;
			});
			Res.forEach(function (element) {
				blocksData.push({
					state: element['category'],
					expected: element['column-1'],
					actual: element['column-2'],
					subdistrictcode: element['subdistrictcode'],
					totalMDs: element['totalMDs'],
					reported: element['reported'],
				})
			});
			this.isShowBlockTable = true;
			this.whereCbmdsrAndFbmdsrConductedInBlock = Res;
			this.whereCbmdsrAndFbmdsrConductedInBlockForGraph = blocksData;

			this.dataSourceForBlockwiseCbmdsrFbmdsr = new MatTableDataSource(Res);
			Res.forEach(element => {
				this.totalCbmdsrBlockwise = this.totalCbmdsrBlockwise + element['column-2'];
				this.totalFbmdsrBlockwise = this.totalFbmdsrBlockwise + element['column-1'];;
				this.totaltotalMDsBlockwise = this.totaltotalMDsBlockwise + element['totalMDs'];
				this.totalreportedBlockwise = this.totalreportedBlockwise + element['reported'];
			});
			
			this.getBlockwiseCbmdsrFbmdsrGraph();
			this.changeDetectorRef.detectChanges();
		});
	}

	isShowBlockwiseDeathsDetailTable = false;
	blockwiseDetailsOfMaternalDeathsNotification: any;
	getBlockswiseDeathsData(arg) {
		this.isShowBlockwiseDeathsDetailTable = false;
		let whereParam = {};//this.where;
		whereParam = {
			updatedAt: {
				"$gte": (moment().year() - 1) + "-" + this.mon + "-" + "01",
				"$lte": moment().year() + "-" + this.mon + "-" + this.day
			}
		}
		if (arg.type == "CBMDSR") {
			whereParam['place_of_death'] = { '$in': ["Home", "Transit", "Other"] }
		} else if (arg.type == "FBMDSR") {
			whereParam['place_of_death'] = { '$in': ["Health Facility"] }
		}
		whereParam['block_id.subdistrictcode'] = arg.subdistrictcode;
		this.form1Service.getNotificationDetails(whereParam).subscribe(res => {
			this.blockwiseDetailsOfMaternalDeathsNotification = res;
			this.dataSourceForBlockwiseMaternalDeathsDetail = new MatTableDataSource(res);
			this.isShowBlockwiseDeathsDetailTable = true;
			this.changeDetectorRef.detectChanges();
		});
	}

	formSubmittedStatusDistrictwise: any
	isShowFormsStatusDistrictwise = false;
	totalCbmdsrDistrictwiseForm1: number = 0;
	totalCbmdsrDistrictwiseForm5: number = 0;
	totalCbmdsrDistrictwiseForm6: number = 0;
	totalFbmdsrDistrictwiseForm1: number = 0;
	totalFbmdsrDistrictwiseForm4: number = 0;
	totalFbmdsrDistrictwiseForm6: number = 0;
	getSubmittedFormsStatusDistrictwise(accessArg) {
		const { fromDate, toDate } = this.filterForm.value;
		let previousYearFromDate = moment(fromDate);
		let previousYearToDate = moment(toDate).add(1, 'day');
		let districtcodes = [];
		if (accessArg && accessArg.districtcodes) {
			districtcodes = accessArg.districtcodes;
		}
		let param = {
			previousYearFromDate: previousYearFromDate,
			previousYearToDate: previousYearToDate,
			where: { "statecode": accessArg['statecode'], districtcodes },
			accessUpto: 'State'
		}
		this.form1Service.getSubmittedFormsStatus(param).subscribe(Res => {
			this.isShowFormsStatusDistrictwise = true
			this.formSubmittedStatusDistrictwise = Res;
			this.dataSourceForDistrictwiseCbmdsrFormStatus = new MatTableDataSource(Res['cbmdsrFormsStatus']);
			Res['cbmdsrFormsStatus'].forEach(element => {
				this.totalCbmdsrDistrictwiseForm1 = this.totalCbmdsrDistrictwiseForm1 + element['form1'];
				this.totalCbmdsrDistrictwiseForm5 = this.totalCbmdsrDistrictwiseForm5 + element['form5'];
				this.totalCbmdsrDistrictwiseForm6 = this.totalCbmdsrDistrictwiseForm6 + element['form6'];
			});
			this.dataSourceForDistrictwiseFbmdsrFormStatus = new MatTableDataSource(Res['fbmdsrFormsStatus']);
			Res['fbmdsrFormsStatus'].forEach(element => {
				this.totalFbmdsrDistrictwiseForm1 = this.totalFbmdsrDistrictwiseForm1 + element['form1'];
				this.totalFbmdsrDistrictwiseForm4 = this.totalFbmdsrDistrictwiseForm4 + element['form4'];
				this.totalFbmdsrDistrictwiseForm6 = this.totalFbmdsrDistrictwiseForm6 + element['form6'];
			});

			//this.CBMDSRandFBMDSRMaternalDeathsFormsStatusInPercentage(Res['cbmdsrFormsStatus'], Res['fbmdsrFormsStatus']);
			this.changeDetectorRef.detectChanges();
		});
	}

	formSubmittedStatusBlockwise: any
	isShowFormsStatusBlockwise = false;
	totalCbmdsrBlockwiseForm1: number = 0;
	totalCbmdsrBlockwiseForm5: number = 0;
	totalCbmdsrBlockwiseForm6: number = 0;
	totalFbmdsrBlockwiseForm1: number = 0;
	totalFbmdsrBlockwiseForm4: number = 0;
	totalFbmdsrBlockwiseForm6: number = 0;
	getSubmittedFormsStatusBlockwise(accessArg) {
		this.totalCbmdsrBlockwiseForm1 = 0;
		this.totalCbmdsrBlockwiseForm5 = 0;
		this.totalCbmdsrBlockwiseForm6 = 0;
		this.totalFbmdsrBlockwiseForm1 = 0;
		this.totalFbmdsrBlockwiseForm4 = 0;
		this.totalFbmdsrBlockwiseForm6 = 0;
		this.isShowFormsStatusBlockwise = false;
		let previousYearFromDate = (moment().year() - 1) + "-" + "01" + "-" + "01";
		let previousYearToDate = (moment().year() ) + "-" + "12" + "-" + "31";
		//let previousYearFromDate=(moment().year())+"-"+"01"+"-"+"01";
		//let previousYearToDate=(moment().year())+"-"+"12"+"-"+"31";
		let param = {
			previousYearFromDate: previousYearFromDate,
			previousYearToDate: previousYearToDate,
			where: { "districtcode": accessArg['districtcode'] },
			accessUpto: 'District'
		}
		this.form1Service.getSubmittedFormsStatus(param).subscribe(Res => {
			this.isShowFormsStatusBlockwise = true
			this.formSubmittedStatusBlockwise = Res;
			this.dataSourceForBlockwiseCbmdsrFormStatus = new MatTableDataSource(Res['cbmdsrFormsStatus']);
			Res['cbmdsrFormsStatus'].forEach(element => {
				this.totalCbmdsrBlockwiseForm1 = this.totalCbmdsrBlockwiseForm1 + element['form1'];
				this.totalCbmdsrBlockwiseForm5 = this.totalCbmdsrBlockwiseForm5 + element['form5'];
				this.totalCbmdsrBlockwiseForm6 = this.totalCbmdsrBlockwiseForm6 + element['form6'];
			});
			this.dataSourceForBlockwiseFbmdsrFormStatus = new MatTableDataSource(Res['fbmdsrFormsStatus']);
			Res['fbmdsrFormsStatus'].forEach(element => {
				this.totalFbmdsrBlockwiseForm1 = this.totalFbmdsrBlockwiseForm1 + element['form1'];
				this.totalFbmdsrBlockwiseForm4 = this.totalFbmdsrBlockwiseForm4 + element['form4'];
				this.totalFbmdsrBlockwiseForm6 = this.totalFbmdsrBlockwiseForm6 + element['form6'];
			});
			this.changeDetectorRef.detectChanges();
		});
	}

	getBlockwiseCbmdsrFbmdsrGraph() {
		this.zone.runOutsideAngular(() => {
			// Expected Vs Actual Maternal Death
			var expectedVsActual = am4core.create('blockwiseCbmdsrFbmdsr', am4charts.XYChart);
			expectedVsActual.colors.list = [
				am4core.color("#007bff"),
				am4core.color("#ffb822")
			];

			// Add data
			expectedVsActual.data = this.whereCbmdsrAndFbmdsrConductedInBlockForGraph

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
			valueAxis.title.text = "Maternal Deaths";

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

			createSeries1("actual", "Where CBMDSR Conducted", false);
			createSeries1("expected", "Where FBMDSR Conducted", false);

			// Cursor
			expectedVsActual.cursor = new am4charts.XYCursor();
			//scrollbar
			expectedVsActual.scrollbarX = new am4core.Scrollbar();
			//expectedVsActual.scrollbarX.thumb.minWidth = 60;

			// Add legend


			expectedVsActual.legend = new am4charts.Legend();

			this.charts.push(expectedVsActual);
		})
	}

	getStateData(stateData) {
		this.stateData = stateData;
	}

	ngAfterViewInit() {
		//this.createChart();
		//this.dataSourceForDistrictwiseCbmdsrFbmdsr.sort = this.districtwiseCbmdsrFbmdsr;
	}

	onChange(value) {
		this.selectedValue = value;
	}

	ngOnDestroy() {
		while (this.charts.length) {
			const chart = this.charts.pop();
			chart.dispose();
		}
	}

	applyFilterBlockwiseMaternalDeathsNotification(filterValueBlockwiseMaternalDeathsNotification: string) {
		this.dataSourceForBlockwiseMaternalDeathsNotification.filter = filterValueBlockwiseMaternalDeathsNotification.trim().toLowerCase();
	}

	applyFilterDistrictwiseCbmdsrFbmdsr(filterValueDistrictwiseCbmdsr: string) {
		this.dataSourceForDistrictwiseCbmdsrFbmdsr.filter = filterValueDistrictwiseCbmdsr.trim().toLowerCase();
	}

	applyFilterBlockwiseCbmdsrFbmdsr(filterValueBlockwiseCbmdsr: string) {
		this.dataSourceForBlockwiseCbmdsrFbmdsr.filter = filterValueBlockwiseCbmdsr.trim().toLowerCase();
	}

	applyFilterBlockwiseMaternalDeathsDetail(filterValueBlockwiseMaternalDeathsDetail: string) {
		this.dataSourceForBlockwiseMaternalDeathsDetail.filter = filterValueBlockwiseMaternalDeathsDetail.trim().toLowerCase();
	}

	applyFilterDistrictwiseCbmdsrFormStatus(filterDistrictwiseCbmdsrFormStatus: string) {
		this.dataSourceForDistrictwiseCbmdsrFormStatus.filter = filterDistrictwiseCbmdsrFormStatus.trim().toLowerCase();
	}

	applyFilterDistrictwiseFbmdsrFormStatus(filterDistrictwiseFbmdsrFormStatus: string) {
		this.dataSourceForDistrictwiseFbmdsrFormStatus.filter = filterDistrictwiseFbmdsrFormStatus.trim().toLowerCase();
	}

	applyFilterBlockwiseCbmdsrFormStatus(filterBlockwiseCbmdsrFormStatus: string) {
		this.dataSourceForBlockwiseCbmdsrFormStatus.filter = filterBlockwiseCbmdsrFormStatus.trim().toLowerCase();
	}

	applyFilterBlockwiseFbmdsrFormStatus(filterBlockwiseFbmdsrFormStatus: string) {
		this.dataSourceForBlockwiseFbmdsrFormStatus.filter = filterBlockwiseFbmdsrFormStatus.trim().toLowerCase();
	}

	forBlockwiseMaternalDeathsNotificationExportTable() {
		let dataToExport = this.dataSourceForBlockwiseMaternalDeathsNotification.data.map((x) => ({
			"District": x.district_id.districtname,
			"Block": x.block_id.subdistrictname,
			//"Village": x.village_id.villagename,
			"Deceased Women Name": x.deceased_women_fname,
			"Husband Name": x.husband_name,
			"Place of Death": x.place_of_death,
			"Death Date Time": x.death_date_time,
		}));
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "Blockwise Maternal Deaths Notification.xlsx");
	}

	forBlockwiseMaternalDeathsDetailExportTable() {
		let dataToExport = this.dataSourceForBlockwiseMaternalDeathsDetail.data.map((x) => ({
			"District": x.district_id.districtname,
			"Block": x.block_id.subdistrictname,
			//"Village": x.village_id.villagename,
			"Deceased Women Name": x.deceased_women_fname,
			"Husband Name": x.husband_name,
			"Place of Death": x.place_of_death,
			"Death Date Time": x.death_date_time,
		}));
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "Blockwise Maternal Deaths Details.xlsx");
	}

	forDistrictwiseCbmdsrFbmdsrExportTable() {
		let dataToExport = this.dataSourceForDistrictwiseCbmdsrFbmdsr.data.map((x) => ({
			"District": x.category,
			"# Reported (15-49)": x['reported'],
			"# Total MDs": x['totalMDs'],
			"# Total CBMDSR": x['column-2'],
			"# Total FBMDSR": x['column-1'],
		}));
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "Districtwise count.xlsx");
	}

	forBlockwiseCbmdsrFbmdsrExportTable() {
		let dataToExport = this.dataSourceForBlockwiseCbmdsrFbmdsr.data.map((x) => ({
			"Block": x.category,
			"# Reported (15-49)": x['reported'],
			"# Total MDs": x['totalMDs'],
			"# Total CBMDSR": x['column-2'],
			"# Total FBMDSR": x['column-1'],
		}));
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "Blockwise count.xlsx");
	}

	forDistrictwiseCbmdsrFormStatusExportTable() {
		let dataToExport = this.dataSourceForDistrictwiseCbmdsrFormStatus.data.map((x) => ({
			"District": x.districtname,
			"# Form 1": x.form1,
			"# Form 5": x.form5,
			"# Form 6": x.form6,
			"percentage": (x.form5 / x.form1) * 100
		}));
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "Districtwise CBMDSR Forms status.xlsx");
	}

	forDistrictwiseFbmdsrFormStatusExportTable() {
		let dataToExport = this.dataSourceForDistrictwiseFbmdsrFormStatus.data.map((x) => ({
			"District": x.districtname,
			"# Form 1": x.form1,
			"# Form 4": x.form4,
			"# Form 6": x.form6,
			"percentage": (x.form4 / x.form1) * 100
		}));
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "Districtwise FBMDSR Forms status.xlsx");
	}

	forBlockwiseCbmdsrFormStatusExportTable() {
		let dataToExport = this.dataSourceForBlockwiseCbmdsrFormStatus.data.map((x) => ({
			"Block": x.subdistrictname,
			"# Form 1": x.form1,
			"# Form 5": x.form5,
			"# Form 6": x.form6,
			"percentage": (x.form5 / x.form1) * 100
		}));
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "Blockwise CBMDSR Forms status.xlsx");
	}

	forBlockwiseFbmdsrFormStatusExportTable() {
		let dataToExport = this.dataSourceForBlockwiseFbmdsrFormStatus.data.map((x) => ({
			"Block": x.subdistrictname,
			"# Form 1": x.form1,
			"# Form 4": x.form4,
			"# Form 6": x.form6,
			"percentage": (x.form4 / x.form1) * 100
		}));
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "Blockwise FBMDSR Forms status.xlsx");
	}



















	editForm(data) {
		const { id, form } = data;
		this.router.navigateByUrl(`/mdsr/${form}/${id}`);
	}

	viewForm(id: string) {
		this.router.navigateByUrl(`/mdsr/form1/view/${id}`)
	}

	addForm(data: any) {
		const { form, row } = data;
		const canSubmitForm = row.mdsrForm4s.length || row.mdsrForm5s.length;
		if (!canSubmitForm) {
			this.alertService.fireAlert({
				title: "Permission Error",
				html: `<span style="font-size:1rem;font-weight:600;">To fill Form 6, please submit either Form 4 (Facility Form) or Form 5 (Community Form)</span>`,
				timer: 30000,
				showConfirmButton: true
			})
			return;
		}
		localStorage.removeItem("data");
		localStorage.setItem("data", JSON.stringify(row));
		this.router.navigateByUrl(`/mdsr/${form}/add`, { state: { row } })
	}

	ExportTableMD(val) {
		if (val == 1) {
			let dataToExport = this.data2.map((x) => ({
				"District": x.district,
				"MD Reported": x.md,
				"Deaths not Reviwed": x.dnotreviwed
			}));
			const workSheet = XLSX.utils.json_to_sheet(dataToExport);
			const workBook: XLSX.WorkBook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workBook, workSheet, "MD not reviwed by CMO");
			XLSX.writeFile(workBook, "MD not reviwed by CMO.xlsx");
		} else if (val == 2) {
			let dataToExport = this.data3.map((x) => ({
				"District": x.district,
				"MD Reported": x.md,
				"Deaths not Reviwed": x.dnotreviwed
			}));
			const workSheet = XLSX.utils.json_to_sheet(dataToExport);
			const workBook: XLSX.WorkBook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workBook, workSheet, "MD not reviwed by DC DM");
			XLSX.writeFile(workBook, "MD not reviwed by DC DM.xlsx");
		}

	}

	filterChange() {
		const { districtcodes, fromDate, toDate } = this.filterForm.value;
		this.fromDate = fromDate;
		this.toDate = toDate;
		this.getTopIndicatorData({ ...this.countParam, "district_id.districtcode": { $in: districtcodes }, updatedAt: { "$gte": fromDate, "$lte": moment(toDate).add(1, 'day') } });
		this.getNotificationCount({ ...this.countParam, "district_id.districtcode": { $in: districtcodes }, updatedAt: { "$gte": fromDate, "$lte": moment(toDate).add(1, 'day') } });
		this.getSubmittedFormsStatusDistrictwise({ statecode: this.state_id.statecode, districtcodes });
		this.fbmdrVsCbmdrGraph({ fromDate: this.fromDate, toDate: this.toDate, statecodes: [this.state_id.statecode],  districtcodes, accessupto: this.currentUser.accessupto, type: "getDistricts" }); //totalCBOutOfFBMDSR
		this.getDeathsWhereCbmdsrAndFbmdsrConducted(this.state_id);
		this.getMaternalCauseOfdeathsFor6Months();
		this.getIcd10CodesCategorywise();
		this.setTitle()
		this.isShowMaternalDeathsDetails = false;
		this.isShowFormsStatusBlockwise = false;
		this.isShowFormsStatusDistrictwise = false;
	}

	@ViewChild('allSelected', { static: false }) private allSelected: MatOption;

	tosslePerOne(all) {
		if (this.allSelected.selected) {
			this.allSelected.deselect();
			return false;
		}
		if (this.filterForm.value.districtcodes.length == this.districtList.length)
			this.allSelected.select();
		this.filterChange();
	}
	toggleAllSelection() {
		if (this.allSelected.selected) {
			const districtcodes: number[] = this.districtList.map(district => district.districtcode);
			districtcodes.push(0);
			// this.filterForm.controls.states
			//   .patchValue(statecodes);
			this.filterForm.patchValue({ districtcodes })
		} else {
			this.filterForm.patchValue({ districtcodes: [] })
		}
		this.filterChange();
	}


}
