import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
// import { CdrForm4Service } from "../../../../../services/cdr/form4.service";
import { DataList } from "../../../../../models/views/data-list";
import { MatPaginator, MatSort } from "@angular/material";
import * as objectPath from "object-path";
import { merge, of } from "rxjs";
import { startWith, switchMap, map, catchError } from "rxjs/operators";

@Component({
	selector: "kt-view",
	templateUrl: "./view.component.html",
	styleUrls: ["./view.component.scss"],
})
export class ViewComponent implements OnInit {
	/* pageSize: number;
	columns: DataList["columns"] = [
		{ name: "Name", key: "sectionA.newborn_name" },
	];
	totalRecords: number;
	isLoadingResults: boolean = false;
	isMaxLimitReached: boolean;
	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: false }) sort: MatSort;
	columnsToDisplay: string[] = this.columns.map((c) => c.key || c.name);
	dataSource: any[];
	readonly objectPath = objectPath; */

	constructor(
		// private cdrForm4Service: CdrForm4Service,
		private changeDetectorRef: ChangeDetectorRef
	) {}

	ngAfterViewInit() {
		// this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		// this.getList();
	}
	getList() {
		// this.cdrForm4Service.count().subscribe(({ count }) => {
		// 	this.totalRecords = count;
		// });

		// merge(this.sort.sortChange, this.paginator.page)
		// 	.pipe(
		// 		startWith({}),
		// 		switchMap(() => {
		// 			this.isLoadingResults = true;
		// 			return this.cdrForm4Service.getList({
		// 				// where: where,
		// 				skip: this.paginator.pageIndex * this.pageSize,
		// 				limit: this.pageSize,
		// 				// include: [{ relation: "village" }, { relation: "fileLibrary" }]
		// 			});
		// 			// (this.sort.active, this.sort.direction, this.paginator.pageIndex);
		// 		}),
		// 		map((data) => {
		// 			// Flip flag to show that loading has finished.
		// 			this.isLoadingResults = false;
		// 			this.isMaxLimitReached = false;
		// 			// this.resultsLength = data.total_count;

		// 			return data;
		// 		}),
		// 		catchError(() => {
		// 			this.isLoadingResults = false;
		// 			// Catch if the GitHub API has reached its rate limit. Return empty data.
		// 			this.isMaxLimitReached = true;
		// 			return of([]);
		// 		})
		// 	)
		// 	.subscribe((data) => {
		// 		this.dataSource = data;
		// 		console.log(this.dataSource)
		// 		this.changeDetectorRef.detectChanges();
		// 	});
	}

	ngOnInit() {}
}
