import {
	ChangeDetectorRef,
	Component,
	NgZone,
	OnInit,
	ViewChild,
} from "@angular/core";
import { CdrForm1Service } from "../../../../../../services/cdr/form1.service";
import moment from "moment";
import {
	MatTableDataSource,
	MatPaginator,
	MatSort,
	MatDialog,
	MatTable,
} from "@angular/material";
import * as XLSX from "xlsx";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
//import { IMRData, NMRData, U5Data } from "../../../../../../../../../../data";
import { any } from "@amcharts/amcharts4/.internal/core/utils/Array";

@Component({
  selector: 'kt-nationaldashboard',
  templateUrl: './nationaldashboard.component.html',
  styleUrls: ['./nationaldashboard.component.scss']
})
export class NationaldashboardComponent implements OnInit {
	constructor(
		private cdrForm1Service: CdrForm1Service,
		private cdf: ChangeDetectorRef,
		private zone: NgZone
	) {}

	cdrDeathAgeWiseCount: any;
	isShowAllDistrictOnMap: boolean = false;
	objPeakMonthToWeekMonth: any;
	cdrDeathCount: number = 0;
	cdrVerified: number = 0;
	cdrPending: number = 0;
	cdrDone: number = 0;
	loading: boolean = false;
	loadingAgeWise: boolean = false;
	day: any;
	mon: any;
	block_id: any;
	district_id: any;
	state_id: any;
	fromDate: any;
	toDate: any;
	where: any;
	mapChartDiv = "district";
	callingFrom = undefined;
	passingArgOnDistrictClick: any;
	private charts: Array<any> = [];
	isShowDistrictTable: boolean = false;
	currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
	whereCbmdsrAndFbmdsrConductedDatasource: MatTableDataSource<any>;
	@ViewChild("paginatorWhereCbmdsrAndFbmdsrConductedDatasource", {
		static: true,
	})
	paginatorWhereCbmdsrAndFbmdsrConductedDatasource: MatPaginator;
	displayedColumnsWhereCbmdsrAndFbmdsrConductedDatasource: string[] = [
		"sn",
		"category",
		"column-2",
		//"column-1",
	];
	dataSourceForDistrictwiseCbmdsrFbmdsr: MatTableDataSource<any>;
	@ViewChild("paginatorForDistrictwiseCbmdsrFbmdsr", { static: true })
	paginatorForDistrictwiseCbmdsrFbmdsr: MatPaginator;
	displayedColumnsForDistrictwiseCbmdsrFbmdsr: string[] = [
		"sn",
		"category",
		"column-2",
		"column-1",
	];
	dataSourceForBlockwiseCbmdsrFbmdsr: MatTableDataSource<any>;
	@ViewChild("paginatorForForBlockwiseCbmdsrFbmdsr", { static: true })
	paginatorForForBlockwiseCbmdsrFbmdsr: MatPaginator;
	displayedColumnsForBlockwiseCbmdsrFbmdsr: string[] = [
		"sn",
		"category",
		"column-2",
		"column-1",
	];
	dataSourceForBlockwiseMaternalDeathsDetail: MatTableDataSource<any>;
	@ViewChild("paginatorForBlockwiseMaternalDeathsDetail", { static: true })
	paginatorForBlockwiseMaternalDeathsDetail: MatPaginator;
	displayedColumnsForBlockwiseMaternalDeathsDetail: string[] = [
		"sn",
		"districtname",
		"subdistrictname",
		"villagename",
		"deceased_women_fname",
		"husband_name",
		"place_of_death",
		"death_date_time",
	];

	dataSourceForStatewiseCbmdsrFormStatus: MatTableDataSource<any>;
	@ViewChild("paginatorForStatewiseCbmdsrFormStatus", { static: true })
	paginatorForStatewiseCbmdsrFormStatus: MatPaginator;
	displayedColumnsForStatewiseCbmdsrFormStatus: string[] = [
		"sn",
		"statename",
		"form1",
		"form2",
		"form3A",
		"form3B",
		"form3C",
		"finalStatus",
	];
	dataSourceForStatewiseFbmdsrFormStatus: MatTableDataSource<any>;
	@ViewChild("paginatorForStatewiseFbmdsrFormStatus", { static: true })
	paginatorForStatewiseFbmdsrFormStatus: MatPaginator;
	displayedColumnsForStatewiseFbmdsrFormStatus: string[] = [
		"snF",
		"statenameF",
		"form1F",
		"form4A",
		"form4B",
		"finalStatusF",
	];

	dataSourceForDistrictwiseCbmdsrFormStatus: MatTableDataSource<any>;
	@ViewChild("paginatorForDistrictwiseCbmdsrFormStatus", { static: true })
	paginatorForDistrictwiseCbmdsrFormStatus: MatPaginator;
	displayedColumnsForDistrictwiseCbmdsrFormStatus: string[] = [
		"sn",
		"districtname",
		"form1",
		"form2",
		"form3A",
		"form3B",
		"form3C",
		"finalStatus",
	];
	dataSourceForDistrictwiseFbmdsrFormStatus: MatTableDataSource<any>;
	@ViewChild("paginatorForDistrictwiseFbmdsrFormStatus", { static: true })
	paginatorForDistrictwiseFbmdsrFormStatus: MatPaginator;
	displayedColumnsForDistrictwiseFbmdsrFormStatus: string[] = [
		"snF",
		"districtnameF",
		"form1F",
		"form4A",
		"form4B",
		"finalStatusF",
	];
	dataSourceForBlockwiseCbmdsrFormStatus: MatTableDataSource<any>;
	@ViewChild("paginatorForBlockwiseCbmdsrFormStatus", { static: true })
	paginatorForBlockwiseCbmdsrFormStatus: MatPaginator;
	displayedColumnsForBlockwiseCbmdsrFormStatus: string[] = [
		"sn",
		"subdistrictname",
		"form1",
		"form2",
		"form3A",
		"form3B",
		"form3C",
		"finalStatus",
	];
	dataSourceForBlockwiseFbmdsrFormStatus: MatTableDataSource<any>;
	@ViewChild("paginatorForBlockwiseFbmdsrFormStatus", { static: true })
	paginatorForBlockwiseFbmdsrFormStatus: MatPaginator;
	displayedColumnsForBlockwiseFbmdsrFormStatus: string[] = [
		"snF",
		"subdistrictnameF",
		"form1F",
		"form4A",
		"form4B",
		"finalStatusF",
	];
	@ViewChild("sort", { static: true }) sort: MatSort;
	ngOnInit() {
		this.mon = moment().month() + 1;
		if (moment().date() > 10) {
			this.day = moment().date();
		} else {
			this.day = "0" + moment().date();
		}
		if (this.currentUser.accessupto == "Block") {
			this.block_id = this.currentUser.user_block_id["subdistrictcode"];
		} else if (this.currentUser.accessupto == "District") {
			this.district_id = this.currentUser.user_district_id["districtcode"];
		} else if (this.currentUser.accessupto == "State") {
			this.state_id = this.currentUser.user_state_id["statecode"];
			this.getDeathsWhereCbmdsrAndFbmdsrConducted({ statecode: this.state_id });
			this.getSubmittedFormsStatusDistrictwise({ statecode: this.state_id });
		} else {
			this.getDeathsWhereStatewiseCbmdsrAndFbmdsrConducted({});
			this.getSubmittedFormsStatusStatewise({});
			//this.getDeathsWhereCbmdsrAndFbmdsrConducted({});
		}
		this.fromDate = moment().year() - 1 + "-" + this.mon + "-" + "01";
		this.toDate = moment().year() + "-" + this.mon + "-" + this.day;
		this.where = {
			statecode: this.state_id ? this.state_id : undefined,
			districtcode: this.district_id ? this.district_id : undefined,
			subdistrictcode: this.block_id ? this.block_id : undefined,
			updatedAt: {
				$gte: this.fromDate,
				$lte: this.toDate,
			},
		};
		this.loading = true;
		//this.loadingAgeWise = true;
		// this.cdrForm1Service.getCDRDeathAgeWise({}).subscribe(
		//   (res) => {
		//     this.loadingAgeWise = false
		//     this.cdrDeathAgeWiseCount = res;
		//   },
		//   (err) => {
		//     this.loadingAgeWise = false
		//     console.log(err);
		//   }
		// );

		// @ Dashboard Block Count
		this.cdrForm1Service.getDashboardBlockCount(this.where).subscribe(
			(res) => {
				//console.log('res',res);
				this.cdrDeathCount = res[0].totDeath;
				this.cdrVerified = res[0].form2;
				this.cdrPending =
					this.cdrDeathCount -
					(res[0].form3A + res[0].form3B + res[0].form4A + res[0].form4B);
				this.cdrDone = this.cdrDeathCount - this.cdrPending;
				this.loading = false;
				this.cdf.detectChanges();
			},
			() => {
				this.loading = false;
			}
		);
	}

	whereStatewiseCbmdsrAndFbmdsrConducted: any;
	isShowDistrictMapAndTableOnStateClick = false;
	getDeathsWhereStatewiseCbmdsrAndFbmdsrConducted(accessArg) {
		this.isShowDistrictMapAndTableOnStateClick = false;
		this.isShowBlockTable = false;
		this.isShowBlockwiseDeathsDetailTable = false;
		let previousYearFromDate = moment().year() - 1 + "-" + "01" + "-" + "01";
		let previousYearToDate = moment().year() + "-" + "12" + "-" + "31";
		//let previousYearFromDate=(moment().year())+"-"+"01"+"-"+"01";
		//let previousYearToDate=(moment().year())+"-"+"12"+"-"+"31";
		let param = {
			previousYearFromDate: previousYearFromDate,
			previousYearToDate: previousYearToDate,
			where: accessArg,
			accessUpto: this.currentUser.accessupto,
		};
		this.cdrForm1Service
			.getDeathsWhereCbmdsrAndFbmdsrConducted(param)
			.subscribe((Res) => {
				Res.sort(function (a, b) {
					var whereFBMDSRConductedA = a["column-2"];
					var whereFBMDSRConductedB = b["column-2"];
					return whereFBMDSRConductedA > whereFBMDSRConductedB
						? -1
						: whereFBMDSRConductedA < whereFBMDSRConductedB
						? 1
						: 0;
				});
				this.whereStatewiseCbmdsrAndFbmdsrConducted = Res;
				this.whereCbmdsrAndFbmdsrConductedDatasource = new MatTableDataSource(
					Res
				);
				setTimeout(() => {
					this.whereCbmdsrAndFbmdsrConductedDatasource.paginator = this.paginatorWhereCbmdsrAndFbmdsrConductedDatasource;
				}, 200);
				this.cdf.detectChanges();
			});
	}

	whereCbmdsrAndFbmdsrConducted: any;
	whereCbmdsrAndFbmdsrConductedInDistrictForGraph: any;
	totalCbmdsr: number = 0;
	totalFbmdsr: number = 0;
	getDeathsWhereCbmdsrAndFbmdsrConducted(accessArg) {
		this.isShowDistrictTable = false;
		this.totalCbmdsr = 0;
		this.totalFbmdsr = 0;
		let districtsData = [];
		let previousYearFromDate = moment().year() - 1 + "-" + "01" + "-" + "01";
		let previousYearToDate = moment().year() + "-" + "12" + "-" + "31";
		//let previousYearFromDate=(moment().year())+"-"+"01"+"-"+"01";
		//let previousYearToDate=(moment().year())+"-"+"12"+"-"+"31";
		let param = {
			previousYearFromDate: previousYearFromDate,
			previousYearToDate: previousYearToDate,
			where: { statecode: accessArg["statecode"] },
			accessUpto: "State",
		};
		this.cdrForm1Service
			.getDeathsWhereCbmdsrAndFbmdsrConducted(param)
			.subscribe((Res) => {
				Res.sort(function (a, b) {
					var whereFBMDSRConductedA = a["category"];
					var whereFBMDSRConductedB = b["category"];
					return whereFBMDSRConductedA > whereFBMDSRConductedB
						? 1
						: whereFBMDSRConductedA < whereFBMDSRConductedB
						? -1
						: 0;
				});
				Res.forEach(function (element) {
					districtsData.push({
						state: element["category"],
						expected: element["column-1"],
						actual: element["column-2"],
						subdistrictcode: element["subdistrictcode"],
					});
				});
				this.whereCbmdsrAndFbmdsrConducted = Res;
				this.whereCbmdsrAndFbmdsrConductedInDistrictForGraph = districtsData;
				this.dataSourceForDistrictwiseCbmdsrFbmdsr = new MatTableDataSource(
					Res
				);
				setTimeout(() => {
					this.dataSourceForDistrictwiseCbmdsrFbmdsr.paginator = this.paginatorForDistrictwiseCbmdsrFbmdsr;
				}, 200);
				Res.forEach((element) => {
					this.totalCbmdsr = this.totalCbmdsr + element["column-2"];
					this.totalFbmdsr = this.totalFbmdsr + element["column-1"];
				});
				this.isShowDistrictTable = true;
				this.getDistrictwiseCbmdsrFbmdsrGraph();
				this.cdf.detectChanges();
			});
	}

	getDistrictwiseCbmdsrFbmdsrGraph() {
		this.zone.runOutsideAngular(() => {
			// Expected Vs Actual Maternal Death
			var expectedVsActual = am4core.create(
				"districtwiseCbmdsrFbmdsr",
				am4charts.XYChart
			);
			expectedVsActual.logo.disabled = true;
			expectedVsActual.colors.list = [
				am4core.color("#007bff"),
				am4core.color("#ffb822"),
			];

			// Add data
			expectedVsActual.data = this.whereCbmdsrAndFbmdsrConductedInDistrictForGraph;

			// Create axes

			var categoryAxis = expectedVsActual.xAxes.push(
				new am4charts.CategoryAxis()
			);
			categoryAxis.dataFields.category = "state";
			categoryAxis.renderer.grid.template.location = 0;
			categoryAxis.renderer.minGridDistance = 20;
			categoryAxis.title.text = "";

			categoryAxis.renderer.labels.template.horizontalCenter = "middle";
			categoryAxis.renderer.labels.template.verticalCenter = "middle";
			categoryAxis.renderer.labels.template.rotation = 270;

			var valueAxis = expectedVsActual.yAxes.push(new am4charts.ValueAxis());
			valueAxis.min = 0;
			valueAxis.title.text = "Child Deaths";

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

			createSeries1("actual", "Where CBCDR Conducted", false);
			createSeries1("expected", "Where FBCDR Conducted", false);

			// Cursor
			expectedVsActual.cursor = new am4charts.XYCursor();
			//scrollbar
			expectedVsActual.scrollbarX = new am4core.Scrollbar();
			//expectedVsActual.scrollbarX.thumb.minWidth = 60;

			// Add legend

			expectedVsActual.legend = new am4charts.Legend();

			this.charts.push(expectedVsActual);
		});
	}

	whereCbmdsrAndFbmdsrConductedInBlock;
	whereCbmdsrAndFbmdsrConductedInBlockForGraph;
	isShowBlockTable = false;
	totalCbmdsrBlockwise: number = 0;
	totalFbmdsrBlockwise: number = 0;
	getBlocksData(arg) {
		this.totalCbmdsrBlockwise = 0;
		this.totalFbmdsrBlockwise = 0;
		let blocksData = [];
		this.passingArgOnDistrictClick = arg;
		this.mapChartDiv = "block";
		this.whereCbmdsrAndFbmdsrConductedInBlock = [];
		let previousYearFromDate = moment().year() - 1 + "-" + "01" + "-" + "01";
		let previousYearToDate = moment().year() + "-" + "12" + "-" + "31";
		let param = {
			previousYearFromDate: previousYearFromDate,
			previousYearToDate: previousYearToDate,
			where: { districtcode: arg["districtcode"] },
			accessUpto: "District",
		};
		this.cdrForm1Service
			.getDeathsWhereCbmdsrAndFbmdsrConducted(param)
			.subscribe((Res) => {
				Res.sort(function (a, b) {
					var whereFBMDSRConductedA = a["category"];
					var whereFBMDSRConductedB = b["category"];
					return whereFBMDSRConductedA > whereFBMDSRConductedB
						? 1
						: whereFBMDSRConductedA < whereFBMDSRConductedB
						? -1
						: 0;
				});
				Res.forEach(function (element) {
					blocksData.push({
						state: element["category"],
						expected: element["column-1"],
						actual: element["column-2"],
						subdistrictcode: element["subdistrictcode"],
					});
				});
				this.isShowBlockTable = true;
				this.whereCbmdsrAndFbmdsrConductedInBlock = Res;
				this.whereCbmdsrAndFbmdsrConductedInBlockForGraph = blocksData;
				console.log(
					"this.whereCbmdsrAndFbmdsrConductedInBlockForGraph",
					this.whereCbmdsrAndFbmdsrConductedInBlockForGraph
				);
				this.dataSourceForBlockwiseCbmdsrFbmdsr = new MatTableDataSource(Res);
				setTimeout(() => {
					this.dataSourceForBlockwiseCbmdsrFbmdsr.paginator = this.paginatorForForBlockwiseCbmdsrFbmdsr;
				}, 200);
				Res.forEach((element) => {
					this.totalCbmdsrBlockwise =
						this.totalCbmdsrBlockwise + element["column-2"];
					this.totalFbmdsrBlockwise =
						this.totalFbmdsrBlockwise + element["column-1"];
				});
				this.getBlockwiseCbmdsrFbmdsrGraph();
				this.cdf.detectChanges();
			});
	}
	getStateData($event) {}

	getBlockwiseCbmdsrFbmdsrGraph() {
		this.zone.runOutsideAngular(() => {
			// Expected Vs Actual Maternal Death
			var expectedVsActual = am4core.create(
				"blockwiseCbmdsrFbmdsr",
				am4charts.XYChart
			);
			expectedVsActual.logo.disabled = true;
			expectedVsActual.colors.list = [
				am4core.color("#007bff"),
				am4core.color("#ffb822"),
			];

			// Add data
			expectedVsActual.data = this.whereCbmdsrAndFbmdsrConductedInBlockForGraph;

			// Create axes

			var categoryAxis = expectedVsActual.xAxes.push(
				new am4charts.CategoryAxis()
			);
			categoryAxis.dataFields.category = "state";
			categoryAxis.renderer.grid.template.location = 0;
			categoryAxis.renderer.minGridDistance = 20;
			categoryAxis.title.text = "";

			categoryAxis.renderer.labels.template.horizontalCenter = "middle";
			categoryAxis.renderer.labels.template.verticalCenter = "middle";
			categoryAxis.renderer.labels.template.rotation = 270;

			var valueAxis = expectedVsActual.yAxes.push(new am4charts.ValueAxis());
			valueAxis.min = 0;
			valueAxis.title.text = "Child Deaths";

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

			createSeries1("actual", "Where CBCDR Conducted", false);
			createSeries1("expected", "Where FBCDR Conducted", false);

			// Cursor
			expectedVsActual.cursor = new am4charts.XYCursor();
			//scrollbar
			expectedVsActual.scrollbarX = new am4core.Scrollbar();
			//expectedVsActual.scrollbarX.thumb.minWidth = 60;

			// Add legend

			expectedVsActual.legend = new am4charts.Legend();

			this.charts.push(expectedVsActual);
		});
	}

	isShowBlockwiseDeathsDetailTable = false;
	blockwiseDetailsOfMaternalDeathsNotification: any;
	getBlockswiseDeathsData(arg) {
		this.isShowBlockwiseDeathsDetailTable = false;
		let whereParam = {}; //this.where;
		whereParam = {
			updatedAt: {
				$gte: moment().year() - 1 + "-" + this.mon + "-" + "01",
				$lte: moment().year() + "-" + this.mon + "-" + this.day,
			},
		};
		if (arg.type == "CBMDSR") {
			whereParam["palce_of_death"] = { $in: ["Home", "In transit", "Other"] };
		} else if (arg.type == "FBMDSR") {
			whereParam["palce_of_death"] = { $in: ["Hospital"] };
		}
		whereParam["subdistrictcode"] = arg.subdistrictcode;
		this.cdrForm1Service.getNotificationDetails(whereParam).subscribe((res) => {
			this.blockwiseDetailsOfMaternalDeathsNotification = res;
			this.dataSourceForBlockwiseMaternalDeathsDetail = new MatTableDataSource(
				res
			);
			this.dataSourceForBlockwiseMaternalDeathsDetail.paginator = this.paginatorForBlockwiseMaternalDeathsDetail;
			this.isShowBlockwiseDeathsDetailTable = true;
			this.cdf.detectChanges();
		});
	}

	formSubmittedStatusStatewise: any;
	isShowFormsStatusStatewise = false;
	totalCbmdsrStatewiseForm1: number = 0;
	totalCbmdsrStatewiseForm2: number = 0;
	totalCbmdsrStatewiseForm3A: number = 0;
	totalCbmdsrStatewiseForm3B: number = 0;
	totalCbmdsrStatewiseForm3C: number = 0;
	totalFbmdsrStatewiseForm1: number = 0;
	totalFbmdsrStatewiseForm4A: number = 0;
	totalFbmdsrStatewiseForm4B: number = 0;
	getSubmittedFormsStatusStatewise(accessArg) {
		let previousYearFromDate = moment().year() - 1 + "-" + "01" + "-" + "01";
		let previousYearToDate = moment().year() + "-" + "12" + "-" + "31";
		//let previousYearFromDate=(moment().year())+"-"+"01"+"-"+"01";
		//let previousYearToDate=(moment().year())+"-"+"12"+"-"+"31";
		let param = {
			previousYearFromDate: previousYearFromDate,
			previousYearToDate: previousYearToDate,
			where: accessArg,
			accessUpto: "National",
		};
		this.cdrForm1Service.getSubmittedFormsStatus(param).subscribe((Res) => {
			console.log("Res", Res);
			this.isShowFormsStatusStatewise = true;
			this.formSubmittedStatusStatewise = Res;
			this.dataSourceForStatewiseCbmdsrFormStatus = new MatTableDataSource(
				Res["cbmdsrFormsStatus"]
			);
			this.dataSourceForStatewiseCbmdsrFormStatus.paginator = this.paginatorForStatewiseCbmdsrFormStatus;
			Res["cbmdsrFormsStatus"].forEach((element) => {
				this.totalCbmdsrStatewiseForm1 =
					this.totalCbmdsrStatewiseForm1 + element["form1"];
				this.totalCbmdsrStatewiseForm2 =
					this.totalCbmdsrStatewiseForm2 + element["form2"];
				this.totalCbmdsrStatewiseForm3A =
					this.totalCbmdsrStatewiseForm3A + element["form3A"];
				this.totalCbmdsrStatewiseForm3B =
					this.totalCbmdsrStatewiseForm3B + element["form3B"];
				this.totalCbmdsrStatewiseForm3C =
					this.totalCbmdsrStatewiseForm3C + element["form3C"];
			});
			this.dataSourceForStatewiseFbmdsrFormStatus = new MatTableDataSource(
				Res["fbmdsrFormsStatus"]
			);
			this.dataSourceForStatewiseFbmdsrFormStatus.paginator = this.paginatorForStatewiseFbmdsrFormStatus;
			Res["fbmdsrFormsStatus"].forEach((element) => {
				this.totalFbmdsrStatewiseForm1 =
					this.totalFbmdsrStatewiseForm1 + element["form1"];
				this.totalFbmdsrStatewiseForm4A =
					this.totalFbmdsrStatewiseForm4A + element["form4A"];
				this.totalFbmdsrStatewiseForm4B =
					this.totalFbmdsrStatewiseForm4B + element["form4B"];
			});
			this.cdf.detectChanges();
		});
	}

	formSubmittedStatusDistrictwise: any;
	isShowFormsStatusDistrictwise = false;
	isShowFormsStatusdistrictwise = false;
	totalCbmdsrDistrictwiseForm1: number = 0;
	totalCbmdsrDistrictwiseForm2: number = 0;
	totalCbmdsrDistrictwiseForm3A: number = 0;
	totalCbmdsrDistrictwiseForm3B: number = 0;
	totalCbmdsrDistrictwiseForm3C: number = 0;
	totalFbmdsrDistrictwiseForm1: number = 0;
	totalFbmdsrDistrictwiseForm4A: number = 0;
	totalFbmdsrDistrictwiseForm4B: number = 0;
	getSubmittedFormsStatusDistrictwise(accessArg) {
		let previousYearFromDate = moment().year() - 1 + "-" + "01" + "-" + "01";
		let previousYearToDate = moment().year() + "-" + "12" + "-" + "31";
		//let previousYearFromDate=(moment().year())+"-"+"01"+"-"+"01";
		//let previousYearToDate=(moment().year())+"-"+"12"+"-"+"31";
		let param = {
			previousYearFromDate: previousYearFromDate,
			previousYearToDate: previousYearToDate,
			where: { statecode: accessArg["statecode"] },
			accessUpto: "State",
		};
		this.cdrForm1Service.getSubmittedFormsStatus(param).subscribe((Res) => {
			console.log("Res", Res);
			this.isShowFormsStatusDistrictwise = true;
			this.formSubmittedStatusDistrictwise = Res;
			this.dataSourceForDistrictwiseCbmdsrFormStatus = new MatTableDataSource(
				Res["cbmdsrFormsStatus"]
			);
			this.dataSourceForDistrictwiseCbmdsrFormStatus.paginator = this.paginatorForDistrictwiseCbmdsrFormStatus;
			Res["cbmdsrFormsStatus"].forEach((element) => {
				this.totalCbmdsrDistrictwiseForm1 =
					this.totalCbmdsrDistrictwiseForm1 + element["form1"];
				this.totalCbmdsrDistrictwiseForm2 =
					this.totalCbmdsrDistrictwiseForm2 + element["form2"];
				this.totalCbmdsrDistrictwiseForm3A =
					this.totalCbmdsrDistrictwiseForm3A + element["form3A"];
				this.totalCbmdsrDistrictwiseForm3B =
					this.totalCbmdsrDistrictwiseForm3B + element["form3B"];
				this.totalCbmdsrDistrictwiseForm3C =
					this.totalCbmdsrDistrictwiseForm3C + element["form3C"];
			});
			this.dataSourceForDistrictwiseFbmdsrFormStatus = new MatTableDataSource(
				Res["fbmdsrFormsStatus"]
			);
			this.dataSourceForDistrictwiseFbmdsrFormStatus.paginator = this.paginatorForDistrictwiseFbmdsrFormStatus;
			Res["fbmdsrFormsStatus"].forEach((element) => {
				this.totalFbmdsrDistrictwiseForm1 =
					this.totalFbmdsrDistrictwiseForm1 + element["form1"];
				this.totalFbmdsrDistrictwiseForm4A =
					this.totalFbmdsrDistrictwiseForm4A + element["form4A"];
				this.totalFbmdsrDistrictwiseForm4B =
					this.totalFbmdsrDistrictwiseForm4B + element["form4B"];
			});
			this.isShowFormsStatusdistrictwise = true;
			this.cdf.detectChanges();
		});
	}

	formSubmittedStatusBlockwise: any;
	isShowFormsStatusBlockwise = false;
	totalCbmdsrBlockwiseForm1: number = 0;
	totalCbmdsrBlockwiseForm2: number = 0;
	totalCbmdsrBlockwiseForm3A: number = 0;
	totalCbmdsrBlockwiseForm3B: number = 0;
	totalCbmdsrBlockwiseForm3C: number = 0;
	totalFbmdsrBlockwiseForm1: number = 0;
	totalFbmdsrBlockwiseForm4A: number = 0;
	totalFbmdsrBlockwiseForm4B: number = 0;
	getSubmittedFormsStatusBlockwise(accessArg) {
		this.totalCbmdsrBlockwiseForm1 = 0;
		this.totalCbmdsrBlockwiseForm2 = 0;
		this.totalCbmdsrBlockwiseForm3A = 0;
		this.totalCbmdsrBlockwiseForm3B = 0;
		this.totalCbmdsrBlockwiseForm3C = 0;
		this.totalFbmdsrBlockwiseForm1 = 0;
		this.totalFbmdsrBlockwiseForm4A = 0;
		this.totalFbmdsrBlockwiseForm4B = 0;
		this.isShowFormsStatusBlockwise = false;
		let previousYearFromDate = moment().year() - 1 + "-" + "01" + "-" + "01";
		let previousYearToDate = moment().year() + "-" + "12" + "-" + "31";
		//let previousYearFromDate=(moment().year())+"-"+"01"+"-"+"01";
		//let previousYearToDate=(moment().year())+"-"+"12"+"-"+"31";
		let param = {
			previousYearFromDate: previousYearFromDate,
			previousYearToDate: previousYearToDate,
			where: { districtcode: accessArg["districtcode"] },
			accessUpto: "District",
		};
		this.cdrForm1Service.getSubmittedFormsStatus(param).subscribe((Res) => {
			this.isShowFormsStatusBlockwise = true;
			this.formSubmittedStatusBlockwise = Res;
			this.dataSourceForBlockwiseCbmdsrFormStatus = new MatTableDataSource(
				Res["cbmdsrFormsStatus"]
			);
			this.dataSourceForBlockwiseCbmdsrFormStatus.paginator = this.paginatorForBlockwiseCbmdsrFormStatus;
			Res["cbmdsrFormsStatus"].forEach((element) => {
				this.totalCbmdsrBlockwiseForm1 =
					this.totalCbmdsrBlockwiseForm1 + element["form1"];
				this.totalCbmdsrBlockwiseForm2 =
					this.totalCbmdsrBlockwiseForm2 + element["form2"];
				this.totalCbmdsrBlockwiseForm3A =
					this.totalCbmdsrBlockwiseForm3A + element["form3A"];
				this.totalCbmdsrBlockwiseForm3B =
					this.totalCbmdsrBlockwiseForm3B + element["form3B"];
				this.totalCbmdsrBlockwiseForm3C =
					this.totalCbmdsrBlockwiseForm3C + element["form3C"];
			});
			this.dataSourceForBlockwiseFbmdsrFormStatus = new MatTableDataSource(
				Res["fbmdsrFormsStatus"]
			);
			this.dataSourceForBlockwiseFbmdsrFormStatus.paginator = this.paginatorForBlockwiseFbmdsrFormStatus;
			Res["fbmdsrFormsStatus"].forEach((element) => {
				this.totalFbmdsrBlockwiseForm1 =
					this.totalFbmdsrBlockwiseForm1 + element["form1"];
				this.totalFbmdsrBlockwiseForm4A =
					this.totalFbmdsrBlockwiseForm4A + element["form4A"];
				this.totalFbmdsrBlockwiseForm4B =
					this.totalFbmdsrBlockwiseForm4B + element["form4B"];
			});
			this.cdf.detectChanges();
		});
	}

	applyFilterSatewiseChildDeath(filterValuestatewise: string) {
		this.whereCbmdsrAndFbmdsrConductedDatasource.filter = filterValuestatewise
			.trim()
			.toLowerCase();
	}

	applyFilterDistrictwiseCbmdsrFbmdsr(filterValueDistrictwiseCbmdsr: string) {
		this.dataSourceForDistrictwiseCbmdsrFbmdsr.filter = filterValueDistrictwiseCbmdsr
			.trim()
			.toLowerCase();
	}

	applyFilterBlockwiseCbmdsrFbmdsr(filterValueBlockwiseCbmdsr: string) {
		this.dataSourceForBlockwiseCbmdsrFbmdsr.filter = filterValueBlockwiseCbmdsr
			.trim()
			.toLowerCase();
	}

	applyFilterBlockwiseMaternalDeathsDetail(
		filterValueBlockwiseMaternalDeathsDetail: string
	) {
		this.dataSourceForBlockwiseMaternalDeathsDetail.filter = filterValueBlockwiseMaternalDeathsDetail
			.trim()
			.toLowerCase();
	}

	applyFilterStatewiseCbmdsrFormStatus(
		filterStatewiseCbmdsrFormStatus: string
	) {
		this.dataSourceForStatewiseCbmdsrFormStatus.filter = filterStatewiseCbmdsrFormStatus
			.trim()
			.toLowerCase();
	}

	applyFilterStatewiseFbmdsrFormStatus(
		filterStatewiseFbmdsrFormStatus: string
	) {
		this.dataSourceForStatewiseFbmdsrFormStatus.filter = filterStatewiseFbmdsrFormStatus
			.trim()
			.toLowerCase();
	}

	applyFilterDistrictwiseCbmdsrFormStatus(
		filterDistrictwiseCbmdsrFormStatus: string
	) {
		this.dataSourceForDistrictwiseCbmdsrFormStatus.filter = filterDistrictwiseCbmdsrFormStatus
			.trim()
			.toLowerCase();
	}

	applyFilterDistrictwiseFbmdsrFormStatus(
		filterDistrictwiseFbmdsrFormStatus: string
	) {
		this.dataSourceForDistrictwiseFbmdsrFormStatus.filter = filterDistrictwiseFbmdsrFormStatus
			.trim()
			.toLowerCase();
	}

	applyFilterBlockwiseCbmdsrFormStatus(
		filterBlockwiseCbmdsrFormStatus: string
	) {
		this.dataSourceForBlockwiseCbmdsrFormStatus.filter = filterBlockwiseCbmdsrFormStatus
			.trim()
			.toLowerCase();
	}

	applyFilterBlockwiseFbmdsrFormStatus(
		filterBlockwiseFbmdsrFormStatus: string
	) {
		this.dataSourceForBlockwiseFbmdsrFormStatus.filter = filterBlockwiseFbmdsrFormStatus
			.trim()
			.toLowerCase();
	}

	forStatewiseCbmdsrFbmdsrExportTable() {
		let dataToExport = this.whereCbmdsrAndFbmdsrConductedDatasource.data.map(
			(x) => ({
				State: x.category,
				"# Total CBCDR": x["column-2"],
				"# Total FBCDR": x["column-1"],
			})
		);
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "State-wise count.xlsx");
	}

	forDistrictwiseCbmdsrFbmdsrExportTable() {
		let dataToExport = this.dataSourceForDistrictwiseCbmdsrFbmdsr.data.map(
			(x) => ({
				District: x.category,
				"# Total CBMDSR": x["column-2"],
				"# Total FBMDSR": x["column-1"],
			})
		);
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "Districtwise count.xlsx");
	}

	forBlockwiseCbmdsrFbmdsrExportTable() {
		let dataToExport = this.dataSourceForBlockwiseCbmdsrFbmdsr.data.map(
			(x) => ({
				Block: x.category,
				"# Total CBMDSR": x["column-2"],
				"# Total FBMDSR": x["column-1"],
			})
		);
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "Blockwise count.xlsx");
	}

	forBlockwiseMaternalDeathsDetailExportTable() {
		let dataToExport = this.dataSourceForBlockwiseMaternalDeathsDetail.data.map(
			(x) => ({
				District: x.address.districtname,
				Block: x.address.subdistrictname,
				//"Village": x.village_id.villagename,
				"Deceased Women Name": x.name,
				"Husband Name": x.mother_name,
				"Place of Death": x.palce_of_death,
				"Death Date Time": x.date_of_death,
			})
		);
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "Blockwise Child Deaths Details.xlsx");
	}

	forStatewiseCbmdsrFormStatusExportTable() {
		let dataToExport = this.dataSourceForStatewiseCbmdsrFormStatus.data.map(
			(x) => ({
				State: x.statename,
				"# Form 1": x.form1,
				"# Form 2": x.form2,
				"# Form 3A": x.form3A,
				"# Form 3B": x.form3B,
				"# Form 3C": x.form3C,
			})
		);
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "State-wise CBCDR Forms status.xlsx");
	}
	forStatewiseFbmdsrFormStatusExportTable() {
		let dataToExport = this.dataSourceForStatewiseFbmdsrFormStatus.data.map(
			(x) => ({
				State: x.statename,
				"# Form 1": x.form1,
				"# Form 4A": x.form4A,
				"# Form 4B": x.form4B,
			})
		);
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "State-wise FBCDR Forms status.xlsx");
	}

	forDistrictwiseCbmdsrFormStatusExportTable() {
		let dataToExport = this.dataSourceForDistrictwiseCbmdsrFormStatus.data.map(
			(x) => ({
				District: x.districtname,
				"# Form 1": x.form1,
				"# Form 2": x.form2,
				"# Form 3A": x.form3A,
				"# Form 3B": x.form3B,
				"# Form 3C": x.form3C,
			})
		);
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "Districtwise CBCDR Forms status.xlsx");
	}
	forDistrictwiseFbmdsrFormStatusExportTable() {
		let dataToExport = this.dataSourceForDistrictwiseFbmdsrFormStatus.data.map(
			(x) => ({
				District: x.districtname,
				"# Form 1": x.form1,
				"# Form 4A": x.form4A,
				"# Form 4B": x.form4B,
			})
		);
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "Districtwise FBCDR Forms status.xlsx");
	}

	forBlockwiseCbmdsrFormStatusExportTable() {
		let dataToExport = this.dataSourceForBlockwiseCbmdsrFormStatus.data.map(
			(x) => ({
				Block: x.subdistrictname,
				"# Form 1": x.form1,
				"# Form 2": x.form2,
				"# Form 3A": x.form3A,
				"# Form 3B": x.form3B,
				"# Form 3C": x.form3C,
			})
		);
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "Blockwise CBCDR Forms status.xlsx");
	}

	forBlockwiseFbmdsrFormStatusExportTable() {
		let dataToExport = this.dataSourceForBlockwiseFbmdsrFormStatus.data.map(
			(x) => ({
				Block: x.subdistrictname,
				"# Form 1": x.form1,
				"# Form 4A": x.form4A,
				"# Form 4B": x.form4B,
			})
		);
		const workSheet = XLSX.utils.json_to_sheet(dataToExport);
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
		XLSX.writeFile(workBook, "Blockwise FBCDR Forms status.xlsx");
	}
}
