import * as objectPath from "object-path";
import { MatPaginator, MatSort } from '@angular/material';
import { AfterViewInit } from '@angular/core';

interface Column {
	name: string;
	key?: string;
	width?: string;
	isActionField?: boolean;
	hasFooter?: boolean,
	displayAt?: string;
}

export interface DataList extends AfterViewInit {
	pageSize: number;
	columns: Column[];
	totalRecords: number;
	isLoadingResults: boolean;
	isMaxLimitReached: boolean;
	paginator: MatPaginator;
	sort: MatSort;
	columnsToDisplay: string[];
	dataSource: any[];
	objectPath: typeof objectPath;
}
