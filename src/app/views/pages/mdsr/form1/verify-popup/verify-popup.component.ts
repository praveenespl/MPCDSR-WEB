import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Form1Object } from "../../../../../models/forms/mdsr/form1";
import { FileLibraryService } from "../../../../../services/upload/file-library.service";
import { Form1Service } from "../../../../../services/mdsr/form1.service";
import { switchMap } from "rxjs/operators";

// interface VerifyForm {
// 	is_maternal_death: boolean;
// 	it_was_maternal_death: boolean;
// 	when_death_occur: string;
// }

@Component({
	selector: "kt-verify-popup",
	templateUrl: "./verify-popup.component.html",
	styleUrls: ["./verify-popup.component.scss"]
})
export class VerifyPopupComponent {
	// form: VerifyForm;
	file: File;
	uploading = false;
	selectFileData: any;
	remark = "";

	constructor(
		public dialogRef: MatDialogRef<VerifyPopupComponent>,
		@Inject(MAT_DIALOG_DATA)
		public data: { type: "verify" | "unlist"; form: Form1Object },
		private fileLibrary: FileLibraryService,
		private form1Service: Form1Service
	) {
		// this.form = {
		// 	is_maternal_death: this.data.is_maternal_death,
		// 	it_was_maternal_death: this.data.is_maternal_death,
		// 	when_death_occur: this.data.when_death_occur
		// };
	}

	onFileSelect(event: any) {
		this.file = event.target.files[0];
		// let reader = new FileReader();
		// reader.onload = (event: any) => {
		// 	//
		// 	const imageData = event.target.result;
		// };
		// reader.readAsDataURL(file);
		console.log(this.file);
		let reader = new FileReader();
		reader.onload = (event: any) => {
			this.selectFileData = event.target.result;
		};
		reader.readAsDataURL(this.file);
		// selectFileData
	}

	onSave(): void {
		this.uploading = true;
		const formData = new FormData();
		formData.append("file", this.file);
		formData.append("fields", this.data.form.id);
		this.fileLibrary.uploadFile(formData).subscribe(
			response => {
				console.log(response);
				if (this.data.type == "unlist") {
					const user = JSON.parse(sessionStorage.getItem("currentUser"));
					this.form1Service
						.backup(this.data.form)
						.pipe(
							switchMap(res =>
								this.form1Service.update(<any>{
									id: this.data.form.id,
									modified_by: user.id,
									modified_date: new Date().toString(),
									status: "unlist"
								})
							)
						)
						.subscribe(response => {
							this.dialogRef.close({ type: "unlist", response });
						});
				}
				if (this.data.type == "verify") {
					this.dialogRef.close({ type: "verify", response });
				}
			},
			() => (this.uploading = false)
		);
	}
}
