import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Form1Object } from "../../../../../models/forms/mdsr/form1";

@Component({
	selector: "kt-duplicate-popup",
	templateUrl: "./duplicate-popup.component.html",
	styleUrls: ["./duplicate-popup.component.scss"]
})
export class DuplicatePopupComponent {
	constructor(
		public dialogRef: MatDialogRef<DuplicatePopupComponent>,
		@Inject(MAT_DIALOG_DATA)
		public data: Form1Object[]
	) {}
}
