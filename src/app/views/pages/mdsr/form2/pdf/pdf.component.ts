import { DataList } from './../../../../../models/views/data-list';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'kt-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent implements OnInit {

	@Input() data:any;
	@Input() columns: DataList['columns'];
  constructor() { }

  ngOnInit() {
  }

}
