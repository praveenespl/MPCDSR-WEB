import { MatSort } from '@angular/material';
import { MatPaginator } from '@angular/material';
import { DataList } from './../../models/views/data-list';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as objectPath from "object-path";

import jsPDF, { jsPDFOptions } from 'jspdf';
import pdfMake from "pdfmake/build/pdfmake";
import htmlToPdfmake from 'html-to-pdfmake';

import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
	selector: 'kt-notification-index-table',
	templateUrl: './notification-index-table.component.html',
	styleUrls: ['./notification-index-table.component.scss']
})
export class NotificationIndexTableComponent implements OnInit {
	@Input() title: string = '';
	@Input() tableDataSource: any = [];
	@Input() viewOnly: boolean = true;
	@Input() columns: DataList['columns'];
	@Input() columnsToDisplay;
	@Input() isFormLevel: boolean = false;
	@Input() isShowAddButton: boolean;
	@Input() formFilter:string;
	@Input() pdf:boolean = false;
	@Output() editForm = new EventEmitter<{}>();
	@Output() viewForm = new EventEmitter<string>();
	@Output() addForm = new EventEmitter<{}>();
	@Output() showFilters = new EventEmitter<{}>();
	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: false }) sort: MatSort;

	readonly currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
	readonly objectPath = objectPath;
	readonly pageSize = 50;

	//readonly columnsToDisplay = this.columns.map(c => c.name)

	constructor() { }

	ngOnInit() {
		console.log(this.isShowAddButton)
	}

	editEvent(id: string, form: string) {
		this.editForm.emit({ id, form })
	}

	viewEvent(id: string) {
		this.viewForm.emit(id)
	}

	addEvent(row, form) {
		this.addForm.emit({ row, form })
	}

	getToForm(row: any, form: string) {
		this.addForm.emit({ row, form })
	}

	downloadFile() { }

	onClickFilter() {
		this.showFilters.emit();
	}

}
