import { Form4Service } from './../../../../../services/mdsr/form4.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import FormComponent from "./json/generalinfo.json";
@Component({
	selector: 'kt-pdf',
	templateUrl: './pdf.component.html',
	styleUrls: ['./pdf.component.scss']
})
export class PdfComponent implements OnInit {
	component: any[] = [
		{
			label: "Panel",
			title: "Form 4: Facility Based Maternal Death Review Form",
			collapsible: false,
			mask: false,
			tableView: false,
			alwaysEnabled: false,
			type: "panel",
			input: false,
			key: "panel",
			components: [...FormComponent.components]
		}
	];
	submission: any;
	pdfConfig: any = {
		content: [],
		style: {
			pageStyle: {
				fontSize: 12
			}
		}
	};
	constructor(
		private activatedRoute: ActivatedRoute,
		private form4Service: Form4Service,
		private cdf: ChangeDetectorRef
	) { }

	ngOnInit() {
		this.activatedRoute.params.subscribe(({ id }) => {
			if (id) {
				this.form4Service.getOne(id)
					.subscribe(res => {
						const { general_information } = res;
						this.submission = {
							statename: general_information.state.statename,
							districtname: general_information.district.districtname,
							subdistrictname: general_information.block.subdistrictname,
							facilityType:'',
							health_facility_name:''

						}

						setTimeout(() => {
							this.cdf.detectChanges();
						}, 500);
					})
			}
		})
	}

}
