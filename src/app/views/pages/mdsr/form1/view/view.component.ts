import {
	Component,
	OnInit,
	ChangeDetectorRef,
	EventEmitter
} from "@angular/core";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import FormComponent from "../form/form1-config.json";
import { Form1Service } from "../../../../../services/mdsr/form1.service";
import { ActivatedRoute } from "@angular/router";
import { Form1Object } from "../../../../../models/forms/mdsr/form1";
import { MatDialog } from "@angular/material";
import { VerifyPopupComponent } from "../verify-popup/verify-popup.component";
import { UploadFileComponent } from "../../upload/upload-file/upload-file.component.js";
import { AlertService } from "../../../../../utilities/alert.service.js";
import { Location } from "@angular/common";
@Component({
	selector: "kt-view",
	templateUrl: "./view.component.html",
	styleUrls: ["./view.component.scss"]
})
export class ViewComponent implements OnInit {
	form: any = FormComponent;
	refresh = new EventEmitter();
	currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
	record: Form1Object;
	// submission: any;
	// pdfconfig: any = {};

	constructor(
		private alertService: AlertService,
		private changeDetectorRef: ChangeDetectorRef,
		private form1Service: Form1Service,
		private activatedRoute: ActivatedRoute,
		private dialog: MatDialog,
		private _location: Location
	) {}

	verifyRecord(type: "verify" | "unlist") {
		const dialogRef = this.dialog.open(VerifyPopupComponent, {
			data: { type, form: this.record },
			width: "500px"
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.alertService.fireAlert({
					icon: "success",
					text: `${result.type} successfully`
				});
				console.log("popup close", result);
			}
		});
	}

	ngOnInit() {
		this.activatedRoute.params.subscribe(({ id }) => {
			if (id) {
				this.form1Service
					.getOne(
						id
						// , {
						// include: [
						// 	{ relation: "state" },
						// 	{ relation: "block" },
						// 	{ relation: "village" },
						// 	{ relation: "district" },
						// 	{ relation: "facility" },
						// 	{ relation: "healthworker" }
						// ]
						//}
					)
					.subscribe(response => {
						console.log('response--->',response);
						this.record = response;
						this.refresh.emit({
							submission: {
								data: {
									...response
									// state_id: response.state,
									// block_id: response.block,
									// village_id: response.village,
									// district_id: response.district,
									// facility_id: response.facility
								}
							}
						});

						setTimeout(() => {
							this.changeDetectorRef.detectChanges();
						}, 500);
					});
			}
		});
	}
	showUploadFile(id) {
		const dialogRef = this.dialog.open(UploadFileComponent, {
			width: "50%",
			height: "50%",
			data: id,
			panelClass: ["filterPopup"],
			hasBackdrop: true,
			disableClose: false
		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			//this.getList();
		});
	}

	backClicked() {
		this._location.back();
	}
}
