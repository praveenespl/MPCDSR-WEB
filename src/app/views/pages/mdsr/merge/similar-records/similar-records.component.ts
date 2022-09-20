import { Component, OnInit, ChangeDetectorRef, Inject } from "@angular/core";
import { Form1Service } from "../../../../../services/mdsr/form1.service";
import moment from "moment";
import { MAT_DIALOG_DATA, MatCheckboxChange } from "@angular/material";
import { Form1Object } from "../../../../../models/forms/mdsr/form1";

type MergeFormModal = { keep: string; merge: string[] };

@Component({
	selector: "kt-similar-records",
	templateUrl: "./similar-records.component.html",
	styleUrls: ["./similar-records.component.scss"]
})
export class SimilarRecordsComponent implements OnInit {
	currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

	form: MergeFormModal = {
		keep: null,
		merge: []
	};

	columns = [
		"#",
		"keep",
		"name",
		"husband",
		"state",
		"district",
		"block",
		"village",
		"place_of_death"
		// "action"
	];
	dataSource: any[] = [];

	constructor(
		private form1Service: Form1Service,
		private changeDetectorRef: ChangeDetectorRef,
		@Inject(MAT_DIALOG_DATA)
		public data: { record: Form1Object }
	) {}

	onCheckboxChange(e: MatCheckboxChange, id: string) {
		if (e.checked) {
			this.form.merge.push(id);
		} else {
			const index = this.form.merge.indexOf(id);
			if (~index) {
				this.form.merge.splice(index, 1);
			}
			if (this.form.keep == id) {
				this.form.keep = null;
			}
		}
	}

	getList(where?: any) {
		this.form1Service
			.getList({
				where: where,
				// skip: this.paginator.pageIndex * this.pageSize,
				// limit: this.pageSize,
				include: [{ relation: "village" }]
			})
			.subscribe(data => {
				this.dataSource = (data as any[]).map((i: any) => ({
					...i,
					getName: i.getName,
					newState: "",
					newDistrict: "",
					newBlock: ""
				}));
				this.changeDetectorRef.detectChanges();
			});
	}

	ngOnInit() {
		let block_id, district_id, state_id;

		if (this.currentUser.accessupto == "Block") {
			//
			this.columns.splice(this.columns.indexOf("state"), 1);
			this.columns.splice(this.columns.indexOf("district"), 1);
			this.columns.splice(this.columns.indexOf("block"), 1);
			//
			block_id = this.currentUser.user_block_id
				? this.currentUser.user_block_id
				: undefined;
		} else if (this.currentUser.accessupto == "District") {
			//
			this.columns.splice(this.columns.indexOf("new_state"), 1);
			this.columns.splice(this.columns.indexOf("new_district"), 1);
			//
			district_id = this.currentUser.user_district_id
				? this.currentUser.user_district_id
				: undefined;
		} else if (this.currentUser.accessupto == "State") {
			//
			this.columns.splice(this.columns.indexOf("new_state"), 1);
			//
			state_id = this.currentUser.user_state_id
				? this.currentUser.user_state_id
				: undefined;
		} else {
		}
		const where = {
			"state_id.statecode": state_id ? state_id.statecode : undefined,
			"district_id.districtcode": district_id
				? district_id.districtcode
				: undefined,
			"block_id.subdistrictcode": block_id
				? block_id.subdistrictcode
				: undefined,
			createdAt: {
				between: [moment().startOf("month"), moment().endOf("month")]
			},
			or: [{}]
		};
		//
		this.getList(where);
	}
}
