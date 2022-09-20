import * as objectPath from "object-path";
import { MatPaginator, MatSort } from '@angular/material';
import { AfterViewInit } from '@angular/core';

interface Columns {
	name: string;
	key?: string;
	width?: string;
	isActionField?: boolean;
	hasFooter?: boolean
}

export interface DataList1 extends AfterViewInit {
	pageSize1: number;
	columnss: Columns[];

	totalRecords1: number;
	isLoadingResults1: boolean;
	isMaxLimitReached1: boolean;
	paginator1: MatPaginator;
	sort1: MatSort;
	columnsToDisplays: string[];
	dataSource1: any[];
	objectPath1: typeof objectPath;
}