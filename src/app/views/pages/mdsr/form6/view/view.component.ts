import { Component, OnInit, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { Form6Service } from '../../../../../services/mdsr/form6.service';
import { Form1Service } from '../../../../../services/mdsr/form1.service';
import { ActivatedRoute } from '@angular/router';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import FormComponent from "../form/form6.json";
import { Location } from '@angular/common';
import { Form6Object } from '../../../../../models/forms/mdsr/form6';
import { UploadFileComponent } from '../../upload/upload-file/upload-file.component';
import { MatDialog } from '@angular/material';
import { FileLibraryService } from '../../../../../services/upload/file-library.service';

@Component({
	selector: 'kt-view',
	templateUrl: './view.component.html',
	styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

	refresh = new EventEmitter();
	submission: any;
	form: any = FormComponent;
	record: Form6Object;
	ImageForDownload;
	currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
	constructor(private changeDetectorRef: ChangeDetectorRef, private form1Service: Form1Service,
		private form6Service: Form6Service,
		private fileLibrary: FileLibraryService,
		private _location: Location,
		private dialog: MatDialog,
		private activatedRoute: ActivatedRoute) { }

	ngOnInit() {
		this.activatedRoute.params.subscribe(({ id }) => {
			if (id) {
				this.form6Service
					.getOne(id
						, {
							include: [{
								relation: 'mdsrForm1'
							}, {
								relation: 'fileLibrary'
							}]
						}
					)
					.subscribe(response => {
						this.form1Service.getFormData({ "deceased_women_id": response.deceased_women_id }).subscribe(form5Res => {
							this.initForm(response, form5Res[0]);
						});

						// setTimeout(() => {
						// 	this.changeDetectorRef.detectChanges();
						// }, 500);
					});
				setTimeout(() => this.changeDetectorRef.detectChanges(), 500);
			}
		});


	}
	private initForm(value?: Form6Object, records?: any) {
		this.record = value;
		this.refresh.emit({
			submission: {
				data: {
					...new Form6Object(value),
					// state_id: records.state_id,
					// district_id: records.district_id,
					// block_id: records.block_id,
					// facility_id: value.mdsrForm1.facility,
					// mcts_id: records.generalinformation.mcts_id,
					// deceased_women_native_address: records.generalinformation.deceased_women_native_address,
					// //deceased_women_name:value.mdsrForm1.getName,
					// deceased_women_current_address: records.generalinformation.deceased_women_current_address,
					 age: records.age,
					deceased_women_name: records.generalinformation.deceased_women_mname === '' ? records.generalinformation.deceased_women_fname + ' ' + records.generalinformation.deceased_women_lname : records.generalinformation.deceased_women_fname + ' ' + records.generalinformation.deceased_women_mname + ' ' + records.generalinformation.deceased_women_lname,
					// investigators: records.investigators ? records.investigators : [{}, {}, {}],
					// religion: records.religion ? records.religion : '',
					// caste: records.caste ? records.caste : '',
					place_of_death: records.place_of_death,
				  death_date_time: records.death_date_time,
					// gravida: records.gravida ? records.gravida : 0,
					// para: records.gravida ? records.para : 0,
					// alive_children: records.gravida ? records.alive_children_total : 0,
					// infant_outcome: records.gravida ? records.infant_outcome : 0,
					// induced_abortion: records.induced_abortion ? records.induced_abortion : 0,
					// spontaneous_abortion: records.spontaneous_abortion ? records.spontaneous_abortion : 0
				}
			}

		});
		setTimeout(() => this.changeDetectorRef.detectChanges(), 500);
	}
	backClicked() {
		this._location.back();
	}
	showUploadFile(id) {
		const dialogRef = this.dialog.open(UploadFileComponent, {
			width: '50%',
			height: '50%',
			data: id,
			panelClass: ['filterPopup'],
			hasBackdrop: true,
			disableClose: false,

		});
		dialogRef.afterClosed().subscribe(res => {

			if (!res) {
				return;
			}

		});
	}
	downloadFile(filename) {
		this.ImageForDownload = this.fileLibrary.downloadFile(filename);
		window.open(this.ImageForDownload, "MDSR Case Summary", 'toolbar=yes, resizable=yes, scrollbars=yes, width=600, height=600, top=200 , left=500');
	}
}
