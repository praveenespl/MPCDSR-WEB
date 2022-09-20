import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import {
	FormArray,
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from "@angular/forms";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {api} from '../../../../utilities/api';
import { HttpClient } from '@angular/common/http';


@Component({
	selector: "kt-district-mdr-meeting",
	templateUrl: "./district-mdr-meeting.component.html",
	styleUrls: ["./district-mdr-meeting.component.scss"],
})
export class DistrictMdrMeetingComponent implements OnInit {
	form: FormGroup;
	selectedFile: File;
	url: any;
	
	selectedMeetingMinutesFiles=[];
	MeetingMinutesUrls=[];
	Meetings=[];
	NewMeeting = {
		"MeetingDate": "",
		"MeetingAttendees": [],
		"MeetingPhoto": "",
		"MeetingMinutes": ""
	}
	ShowModal=false;

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private fb: FormBuilder,
		public dialog: MatDialog,
		private http: HttpClient
	) {
		this.initForm();
	}
	initForm() {
		this.form = this.fb.group({
			// date_of_meeting: new FormControl("", Validators.required),
			// metting_attend_by: new FormArray([]),
			// meeting_photos: new FormControl("", Validators.required),
			// meeting_minutes: new FormControl("", Validators.required),
			date: new FormControl("", Validators.required),
			attendees: new FormArray([]),
			meeting_photos: new FormControl("", Validators.required),
			meeting_minutes: new FormControl("", Validators.required),
		});
	}
	ngOnInit() {
		const add = this.form.get("attendees") as FormArray;
		const arr = [
			{ name: "", designation: "" },
			{ name: "", designation: "" },
			{ name: "", designation: "" },
			{ name: "", designation: "" },
		];
		arr.forEach((item) => add.push(this.fb.group(item)));

		this.getMeetings();
	}
	addItem() {
		const add = this.form.get("attendees") as FormArray;
		add.push(this.fb.group({ name: "", designation: "" }));
	}
	deleteMeetingAttendee(index: number) {
		const add = this.form.get("attendees") as FormArray;
		add.removeAt(index);
	}
	getFile(e) {
		if (e.target.files && e.target.files[0]) {
			this.selectedFile = <File>e.target.files[0];
			console.log('this.selectedFile: '+JSON.stringify(this.selectedFile.name))
			let fReader = new FileReader();
			fReader.readAsDataURL(this.selectedFile);
			fReader.onload = (event: any) => {
				this.form.patchValue({
					meeting_photos: this.selectedFile.name,
				});
				this.url = event.target.result;
				console.log('this.url: '+this.url)
			};
		}
	}
	getFileMinutes(e) {
		let selectedMeetingMinutesFilesNames = []
		if (e.target.files && e.target.files[0]) {
			let selectedFiles = e.target.files;
			for (var i = 0; i < selectedFiles.length; i++) {
				console.log(i)
				selectedMeetingMinutesFilesNames.push(selectedFiles[i].name)
				let fReader = new FileReader();
				fReader.readAsDataURL(selectedFiles[i]);
				fReader.onload = (event: any) => {
					this.MeetingMinutesUrls.push(event.target.result)
				}
			}
			this.form.patchValue({
				meeting_minutes: selectedMeetingMinutesFilesNames,
			});
		}
	}

	removePicture() {
		this.url = "";
		this.form.patchValue({
			meeting_photos: "",
		});
	}
	onSubmit() {}
	getMeetings(){
		const url = api.StateMDRMeetingApi.common;
			// const params = { obj: JSON.stringify(filter || {}) };
			this.http.get<any>(url).subscribe(response => {
				
				this.Meetings=response
			});
	}
	createMeeting(){
		const url = api.StateMDRMeetingApi.common;
			// const params = { obj: JSON.stringify(filter || {}) };
			this.http.post(url,this.form.value).subscribe(response => {
				this.getMeetings() //re-reads the meetings
			});
			
			this.ShowModal=false; //closes the modal
	}
}
