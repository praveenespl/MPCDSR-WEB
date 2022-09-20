import { Component, OnInit, ChangeDetectorRef, ViewChild } from "@angular/core";
import { Form1Service } from "../../../../services/mdsr/form1.service";
import {
	MatDialog,
	MatTableDataSource,
	MatPaginator,
	MatSort
} from "@angular/material";
import { ReportFiliterComponent } from "../../mdsr/filter/report-filiter/report-filiter.component";
import { DataList } from "../../../../models/views/data-list";
import objectPath from "object-path";
import * as flattenObject from "flat";

export class Group {
	level = 0;
	parent: Group;
	expanded = true;
	totalCounts = 0;
	get visible(): boolean {
		return !this.parent || (this.parent.visible && this.parent.expanded);
	}
}

@Component({
	selector: "kt-notify-vs-reviewed",
	templateUrl: "./notify-vs-reviewed.component.html",
	styleUrls: ["./notify-vs-reviewed.component.scss"]
})
export class NotifyVsReviewedComponent implements OnInit {
	//@ViewChild("dataTable") table;
	dataTable: any;
	dtOptions: any;
	dtOptions1: any;
	oTable: any;
	currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

	//
	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	objectPath = objectPath;
	columns: DataList["columns"] = [
		{ name: "Sno.", isActionField: true, hasFooter: true },
		{ name: "State", key: "_id.state_id.statename" },
		{ name: "District", key: "_id.district_id.districtname" },
		{ name: "Block", key: "_id.block_id.subdistrictname" },
		{ name: "#Notified Death", key: "notifiedDeath", hasFooter: true },
		{ name: "#Reviewed at Facility", key: "form4", hasFooter: true },
		{ name: "#Reviewed at Community", key: "form5", hasFooter: true },
		{ name: "#Reviewed at Both level", key: "both", hasFooter: true },
		{ name: "#Total Reviewed", isActionField: true, hasFooter: true },
		{ name: "#Review Pending", isActionField: true, hasFooter: true }
	];
	columnsToDisplay = this.columns.map(i => i.key || i.name);
	footerToDisplay = this.columns
		.filter(i => i.hasFooter)
		.map(i => i.key || i.name);

	groupByColumns: string[] = [];

	constructor(
		private form1Service: Form1Service,
		private changeDetectorRef: ChangeDetectorRef,
		private dialog: MatDialog
	) {}
	ngOnInit() {
		this.getNotifyVsReviwed({
			accessupto: "National",
			reporting_level: "",
			objMatch: {}
		});
	}
	getNotifyVsReviwed(param) {
		console.log(param);

		/* 	$("#buttons-container").html("");
		const __jT = $("#j-datatable-insert-101")
			.find("table")
			.clone();
		$("#j-datatable-insert-101").html("");
		$("#j-datatable-insert-101").html(
			`<table #dataTable  class="display cell-border" style="width:100%"></table>`
		); */

		this.form1Service
			.getNotificationVsReviewData({
				accessupto: param.accessupto,
				reporting_level: "",
				objMatch: param.objMatch
			})
			.subscribe(res => {
				this.groupByColumns = [];
				if (param.accessupto != "National") {
					this.groupByColumns.push("_id.state_id.statename");
				}
				if (param.accessupto == "State") {
					this.columnsToDisplay = this.columns
						.map(i => i.key || i.name)
						.filter(
							i =>
								i != "_id.state_id.statename" &&
								i != "_id.block_id.subdistrictname"
						);
				} else if (param.accessupto == "District") {
					this.columnsToDisplay = this.columns
						.map(i => i.key || i.name)
						.filter(i => i != "_id.state_id.statename");
				} else {
					this.columnsToDisplay = this.columns
						.map(i => i.key || i.name)
						.filter(
							i =>
								i != "_id.district_id.districtname" &&
								i != "_id.block_id.subdistrictname"
						);
				}
				const data = this.addGroups(res, this.groupByColumns);
				this.dataSource = new MatTableDataSource(data);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;

				this.dataSource.filterPredicate = (data, filter: string) => {
					const accumulator = (currentTerm, key) => {
						return currentTerm + objectPath.get(data, key);
					};
					const dataStr = Object.keys(flattenObject(data))
						.reduce(accumulator, "")
						.toLowerCase();

					const transformedFilter = filter.trim().toLowerCase();
					return dataStr.indexOf(transformedFilter) !== -1;
				};

				this.dataSource.sortingDataAccessor = (item, property) => {
					switch (property) {
						case "project.name":
							return objectPath.get(item, property);
						default:
							return objectPath.get(item, property);
					}
				};

				// jquery data table
				/* this.changeDetectorRef.detectChanges();
				let groupColumn = 1;
				let colDef = {};
				if (param.accessupto !== "National") {
					colDef = { visible: false, targets: groupColumn };
				}
				this.dtOptions1 = {
					paging: true,
					ordering: true,
					info: false,
					scrollY: 245,
					fixedColumns: true,
					destroy: true,
					header: true,
					footer: true,
					data: this.dataSource,
					columnDefs: [colDef],
					order: [[groupColumn, "asc"]],
					columns: [
						{
							title: "Sno.",
							data: "id",
							render: function(data, type, row, meta) {
								return meta.row + meta.settings._iDisplayStart + 1;
							}
						},
						{
							title: "State",
							data: "_id",
							render: function(data) {
								if (data.state_id === "") {
									return "---";
								} else {
									return "<b>" + data.state_id.statename + "</b>";
								}
							},
							defaultContent: "---"
						},
						{
							title: "District",
							data: "_id",
							render: function(data) {
								if (data.district_id === undefined || data.district_id === "") {
									return "---";
								} else {
									return data.district_id.districtname;
								}
							},
							defaultContent: "---"
						},
						{
							title: "Block",
							data: "_id",
							render: function(data) {
								if (data.block_id === undefined || data.block_id === "") {
									return "---";
								} else {
									return data.block_id.subdistrictname;
								}
							},
							defaultContent: "---"
						},
						{
							title: "#Notified Death",
							data: "notifiedDeath",
							render: function(data) {
								if (data === "") {
									return "---";
								} else {
									return data;
								}
							},
							defaultContent: "---"
						},
						{
							title: "#Reviewed at Facility",
							data: "form4",
							render: function(data) {
								if (data === "") {
									return "---";
								} else {
									return data;
								}
							},
							defaultContent: "---"
						},
						{
							title: "#Reviewed at Community",
							data: "form5",
							render: function(data) {
								if (data === "") {
									return "---";
								} else {
									return data;
								}
							},
							defaultContent: "---"
						},
						{
							title: "# Reviewed at Both level",
							data: "both",
							render: function(data) {
								if (data === "") {
									return "---";
								} else {
									return data;
								}
							},
							defaultContent: "---"
						},
						{
							title: "Total Reviewed",
							data: "id",
							render: function(data, type, row) {
								console.log(row);
								if (data === "") {
									return "---";
								} else {
									let tot_review = row.both + row.form5 + row.form4;
									return "<b>" + tot_review + "</b>";
								}
							},
							defaultContent: "---"
						},
						{
							title: "# Review Pending",
							data: "id",
							render: function(data, type, row) {
								console.log(row);
								if (data === "") {
									return "---";
								} else {
									let review_pending =
										row.notifiedDeath - (row.both + row.form5 + row.form4);
									return (
										'<b> <span style="color:red;">' +
										review_pending +
										"</span></b>"
									);
								}
							},
							defaultContent: "---"
						}
					],
					dom: "Bfrtip",
					buttons: ["copyHtml5", "csvHtml5"],

					fnRowCallback: function(nRow, aData, iDisplayIndex) {
						$("td:first", nRow).html(iDisplayIndex + 1);
						return nRow;
					},
					drawCallback: function(settings) {
						if (param.accessupto !== "National") {
							var api = this.api();
							var rows = api.rows({ page: "current" }).nodes();
							var last = null;

							api
								.column(groupColumn, { page: "current" })
								.data()
								.each(function(group, i) {
									console.log(group);

									if (last !== group.state_id.statecode) {
										$(rows)
											.eq(i)
											.before(
												'<tr class="group"><td colspan="12"><b>' +
													group.state_id.statename +
													"</b></td></tr>"
											);

										last = group.state_id.statecode;
									}
								});
						}
					}
				};
				this.dataTable = $("#j-datatable-insert-101").find("table");
				this.dataTable.DataTable(this.dtOptions1);
				this.oTable = this.dataTable.DataTable(this.dtOptions1);
				if (param.accessupto == "National") {
					this.oTable.column(2).visible(false);
					this.oTable.column(3).visible(false);
				}
				if (param.accessupto == "State") {
					this.oTable.column(3).visible(false);
				}

				this.changeDetectorRef.detectChanges(); */
			});
	}

	addGroups(data: any[], groupByColumns: string[]): any[] {
		const rootGroup = new Group();
		rootGroup.expanded = true;
		return this.getSublevel(data, 0, groupByColumns, rootGroup);
	}

	getSublevel(
		data: any[],
		level: number,
		groupByColumns: string[],
		parent: Group
	): any[] {
		if (level >= groupByColumns.length) {
			return data;
		}
		const groups = this.uniqueBy(
			data.map(row => {
				const result = new Group();
				result.level = level + 1;
				result.parent = parent;
				for (let i = 0; i <= level; i++) {
					result[groupByColumns[i]] = objectPath.get(row, groupByColumns[i]);
				}
				return result;
			}),
			JSON.stringify
		);

		const currentColumn = groupByColumns[level];
		let subGroups = [];
		groups.forEach(group => {
			const rowsInGroup = data.filter(row => {
				return group[currentColumn] === objectPath.get(row, currentColumn);
			});
			group.totalCounts = rowsInGroup.length;
			const subGroup = this.getSublevel(
				rowsInGroup,
				level + 1,
				groupByColumns,
				group
			);
			subGroup.unshift(group);
			subGroups = subGroups.concat(subGroup);
		});
		return subGroups;
	}

	uniqueBy(a, key) {
		const seen = {};
		return a.filter(item => {
			const k = key(item);
			return seen.hasOwnProperty(k) ? false : (seen[k] = true);
		});
	}

	isGroup(index, item): boolean {
		return item.level;
	}

	showFilers(): void {
		const dialogRef = this.dialog.open(ReportFiliterComponent, {
			width: "80%",
			height: "60%",
			data: "showData",
			disableClose: false,
			hasBackdrop: false,
			panelClass: ["filtersopup"]
		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.getNotifyVsReviwed({
				accessupto: res.value.accessupto,
				reporting_level: "",
				objMatch: {
					"state_id.statecode": res.value.state_id
						? res.value.state_id
						: undefined,
					"district_id.districtcode": res.value.district_id
						? res.value.district_id
						: undefined,
					"block_id.subdistrictcode": res.value.block_id
						? res.value.block_id
						: undefined
					//	"createdAt": { between: [moment(res.data.from_date).format('YYYY-MM-DD'), moment(res.data.to_date).format('YYYY-MM-DD')] } as any
				}
			});
		});
	}

	calculateTotal(key) {
		const data = this.dataSource ? this.dataSource.data : [];
		switch (key) {
			case "#Total Reviewed":
				return data.reduce((a, c) => {
					return a + (c.both || 0) + (c.form5 || 0) + (c.form4 || 0);
				}, 0);

			case "#Review Pending":
				return data.reduce((a, c) => {
					return (
						a +
						(c.notifiedDeath || 0) -
						((c.both || 0) + (c.form5 || 0) + (c.form4 || 0))
					);
				}, 0);

			default:
				return data.reduce((a, c) => {
					return a + (objectPath.get(c, key) || 0);
				}, 0);
		}
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}
}
