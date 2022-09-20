import { Component, OnInit, ViewChild, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { replaceStringWith } from "../../../../../utilities/decorators/replace-string-with";
import { localizationApiEndPoint } from "../../../../../utilities/api";
import FormGeneratorConfig from "./form-filter.json";
import { FormioComponent } from 'angular-formio';
import { MatDialogRef } from '@angular/material';
import moment from 'moment';
//import $ from 'jquery'
let stateDisabledStatus: boolean = false;
let districtDisabledStatus: boolean = false;
let blockDisabledStatus: boolean = false;
@Component({
	selector: 'kt-form-filter',
	templateUrl: './form-filter.component.html',
	styleUrls: ['./form-filter.component.scss']
})
export class FormFilterComponent implements OnInit {
	@replaceStringWith({ string: ["{{url}}", "{{stateDisabled}}", "{{districtDisabled}}", "{{blockDisabled}}"], replaceWith: [localizationApiEndPoint, stateDisabledStatus, districtDisabledStatus, blockDisabledStatus], accessUpto: JSON.parse(sessionStorage.getItem("currentUser")) ? [JSON.parse(sessionStorage.getItem("currentUser")).accessupto] : [""] })

	filterForm: Object = FormGeneratorConfig;
	@ViewChild("filterFormRef", { static: true })
	@Output() public filterData: EventEmitter<{}> = new EventEmitter();
	filterFormRef: FormioComponent;
	constructor(public dialogRef: MatDialogRef<FormFilterComponent>) { }

	refreshForm = new EventEmitter();
	currentUser: any;
	projectToDate: string;
	ngOnInit() {
		this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
		this.projectToDate = sessionStorage.getItem("ptd");
		let month = parseInt(moment().format("MM"));
		let year = parseInt(moment().format("YYYY"));
		const data = {
			type:
				this.currentUser && (this.currentUser.accessupto === "Block" || this.currentUser.accessupto === "District" || this.currentUser.accessupto === "State")
					? this.currentUser.user_state_id
					: null,
			state_id:
				this.currentUser && (this.currentUser.accessupto === "Block" || this.currentUser.accessupto === "District" || this.currentUser.accessupto === "State")
					? this.currentUser.user_state_id
					: null,
			district_id:
				this.currentUser && (this.currentUser.accessupto === "Block" || this.currentUser.accessupto === "District")
					? this.currentUser.user_district_id
					: null,
			block_id:
				this.currentUser && this.currentUser.accessupto === "Block"
					? {
						"subdistrictcode": this.currentUser.user_block_id.subdistrictcode,
						"subdistrictname": this.currentUser.user_block_id.subdistrictname
					} as Block
					: null,
			from_date: moment(this.projectToDate),
			to_date: moment()

		};

		// to set value State, district & block according to login user
		setTimeout(() => {
			this.refreshForm.emit({
				submission: {
					data
				}
			});
		}, 1000);

	}

	onNoClick(event) {
		this.dialogRef.close({ action: 1, data: event.data });
	}

	closeDialog(): void {
		this.dialogRef.close();
	}

}
