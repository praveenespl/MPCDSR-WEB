import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { CdrForm1Service } from "../../../../../../../src/app/services/cdr/form1.service";
import { Form1Service } from "../../../../../../../src/app/services/mdsr/form1.service";
import moment from "moment";

@Component({
	selector: "kt-common-national-dashboard",
	templateUrl: "./common-national-dashboard.component.html",
	styleUrls: ["./common-national-dashboard.component.scss"],
})
export class CommonNationalDashboardComponent implements OnInit {
	fromDate: any;
	toDate: any;
	day: any;
	mon: any;
	mdsrIndicators: any;
	cdrIndicators = {
		cdrDeathCount: 0,
		cdrVerified: 0,
		cdrPending: 0,
		cdrDone: 0,
	};
	constructor(
		private _form1Service: Form1Service,
		private _cdrForm1Service: CdrForm1Service,
		private _changeDetectorRef: ChangeDetectorRef
	) {}
	ngOnInit() {
		this.mon = moment().month() + 1;
		if (moment().date() > 10) {
			this.day = moment().date();
		} else {
			this.day = "0" + moment().date();
		}
		this.fromDate = moment().year() - 1 + "-" + this.mon + "-" + "01";
		this.toDate = moment().year() + "-" + this.mon + "-" + this.day;
		this.getMDSRCounts();
		this.getCDRCounts();
	}
	getMDSRCounts() {
		let countParam = {
			updatedAt: {
				$gte: this.fromDate,
				$lte: this.toDate,
			},
		};

		//get Top 4 Indicator Details
		this._form1Service.getDashboardData(countParam).subscribe((res) => {
			this.mdsrIndicators = res[0];
			this._changeDetectorRef.detectChanges();
		});
	}
	getCDRCounts() {
		const where = {
			updatedAt: {
				$gte: this.fromDate,
				$lte: this.toDate,
			},
		};
		// @ Dashboard Block Count
		this._cdrForm1Service.getDashboardBlockCount(where).subscribe(
			(res) => {
				//console.log('res',res);
				this.cdrIndicators.cdrDeathCount = res[0].totDeath;
				this.cdrIndicators.cdrVerified = res[0].form2;
				this.cdrIndicators.cdrPending =
					this.cdrIndicators.cdrDeathCount -
					(res[0].form3A + res[0].form3B + res[0].form4A + res[0].form4B);
				this.cdrIndicators.cdrDone =
					this.cdrIndicators.cdrDeathCount - this.cdrIndicators.cdrPending;

				console.log(this.cdrIndicators);

				this._changeDetectorRef.detectChanges();
			},
			() => {}
		);
	}
}
