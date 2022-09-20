import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import FormComponent from "./form.json";
import { ActivatedRoute } from "@angular/router";
import { Form1Service } from "../../../../../services/mdsr/form1.service";
import { Location } from '@angular/common';

@Component({
	selector: "kt-pdf",
	templateUrl: "./pdf.component.html",
	styleUrls: ["./pdf.component.scss"]
})
export class PdfComponent implements OnInit {
	component: any[] = [
		{
			label: "Panel",
			title: "Notification",
			collapsible: false,
			mask: false,
			tableView: false,
			alwaysEnabled: false,
			type: "panel",
			input: false,
			key: "panel",
			components: FormComponent.components
		}
	];
	submission: any;
	pdfConfig: any = {
		content: []
	};

	constructor(
		private activatedRoute: ActivatedRoute,
		private form1Service: Form1Service,
		private changeDetectorRef: ChangeDetectorRef,
		private _location:Location

	) {}

	ngOnInit() {
		this.activatedRoute.params.subscribe(({ id }) => {
			if (id) {
				this.form1Service
					.getOne(id
					// 	, {
					// 	include: [
					// 		{ relation: "state" },
					// 		{ relation: "block" },
					// 		{ relation: "village" },
					// 		{ relation: "district" },
					// 		{ relation: "facility" },
					// 		{ relation: "healthworker" }
					// 	]
					// }
					)
					.subscribe(response => {
						this.submission = {
							...response,
							deceased_women_name: response.getName,
							state_id: response.state_id.statename,
							block_id: response.block_id.subdistrictname,
							village_id: response.village_name,
							district_id: response.district_id.districtname,
							facility_id: response.facility_id.health_facility_name
						};

						setTimeout(() => {
							this.changeDetectorRef.detectChanges();
						}, 500);
					});
			}
		});
	}

	backClicked() {
		this._location.back();
	}
}
