import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import {api} from '../../../../utilities/api';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'kt-mom-drudcm',
  templateUrl: './mom-drudcm.component.html',
  styleUrls: ['./mom-drudcm.component.scss']
})
export class MOMDRUDCMComponent implements OnInit {
  currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  months = [
    {value: 1, name: "January"},
    {value: 2, name: "February"},
    {value: 3, name: "March"},
    {value: 4, name: "April"},
    {value: 5, name: "May"},
    {value: 6, name: "June"},
    {value: 7, name: "July"},
    {value: 8, name: "August"},
    {value: 9, name: "September"},
    {value: 10, name: "October"},
    {value: 11, name: "November"},
    {value: 12, name: "December"},
  ]
  recommendationsOfPrevMeetingDisplayedColumns: String[] = [
    "sn",
    "recommendationsPrevMeeting",
    "responsiblePerson",
    "actionTaken"
  ];
  meetingForm: FormGroup;
  recommendationsOfPrevMeetingDataSource: MatTableDataSource<unknown>;
  constructor(
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private http:HttpClient
  ) {
    this.createForm();
  }


  createForm() {
    this.meetingForm = new FormGroup({
      // month: new FormControl(""),
      // year: new FormControl(""),
      // facility: new FormControl(""),
      district: new FormControl(this.currentUser.user_district_id.districtname),
      dateOfMeeting: new FormControl(""),
      maternalDeathsPM: new FormControl(""),
      maternalDeathsPMReviewed: new FormControl(""),
      maternalDeathsFromApril: new FormControl(""),
      maternalDeathsFromAprilReviewed: new FormControl(""),
      recommendationsOfPrevMeeting: new FormArray([]),
      MDPresentMonthReview: new FormArray([this.MDPresentMonthReview()]),
      familyOfDeceased: new FormArray([this.familyOfDeceased()]),
      committeeMembersList: new FormArray([this.committeeMembersList()]),
    })
  }
  // Family Of Deceased Array Starts
  familyOfDeceased(): import("@angular/forms").AbstractControl {
    return this._fb.group({
      nameOfDeceased: [''],
      familyMemberName: [''],
      relationWithDeceased: ['']
    })
  }
  addFamilyOfDeceased() {
    const formArray = this.meetingForm.get('familyOfDeceased') as FormArray;
    formArray.push(this.familyOfDeceased());
  }
  removeFamilyOfDeceased(index) {
    const formArray = this.meetingForm.get('familyOfDeceased') as FormArray;
    formArray.removeAt(index);
  }
  // Committee Member Array Starts
  committeeMembersList(): import("@angular/forms").AbstractControl {
    return this._fb.group({
      name: [''],
      designation: [''],
      signature: ['']
    })
  }
  addcommitteeMembersList() {
    const formArray = this.meetingForm.get('committeeMembersList') as FormArray;
    formArray.push(this.committeeMembersList());
  }
  removecommitteeMembersList(index) {
    const formArray = this.meetingForm.get('committeeMembersList') as FormArray;
    formArray.removeAt(index);
  }
  // Committee Member Array Ends

  MDPresentMonthReview(): import("@angular/forms").AbstractControl {
    return this._fb.group({
      issueIdentified: [''],
      recommendations: [''],
      responsiblePersonWithTimeline: [''],
    })
  }
  addMDPresentMonthReview() {
    const formArray = this.meetingForm.get('MDPresentMonthReview') as FormArray;
    formArray.push(this.MDPresentMonthReview());
  }
  removeMDPresentMonthReview(index) {
    const formArray = this.meetingForm.get('MDPresentMonthReview') as FormArray;
    formArray.removeAt(index);
  }

  recommendationsOfPrevMeetingData = [{
    recommendationsPrevMeeting: "Issue 1",
    responsiblePerson: "Person 1",
    actionTaken: '',
  },
  {
    recommendationsPrevMeeting: "Issue 2",
    responsiblePerson: "Person 2",
    actionTaken: '',
  }
  ]
  setRecommendationsOfPrevMeetingTable() {
    let recommendationsOfPrevMeetingArray = this.meetingForm.get("recommendationsOfPrevMeeting") as FormArray;
    this.recommendationsOfPrevMeetingData.forEach((item, i) => {
      const tempForm = new FormGroup({
        i: new FormControl(i),
        recommendationsPrevMeeting: new FormControl(item.recommendationsPrevMeeting),
        responsiblePerson: new FormControl(item.responsiblePerson),
        actionTaken: new FormControl(null),
      });
      recommendationsOfPrevMeetingArray.push(tempForm);
    });
   
    this.meetingForm.updateValueAndValidity();
    this.recommendationsOfPrevMeetingDataSource = new MatTableDataSource(this.meetingForm.value.recommendationsOfPrevMeeting);
    this._cdr.detectChanges();
    console.log(this.recommendationsOfPrevMeetingDataSource.data);

  }

  recommendationsOfPrevMeeting(): import("@angular/forms").AbstractControl {
    return this._fb.group({
      recommendationsPrevMeeting: [''],
      responsiblePerson: [''],
      actionTaken: [''],
    })
  }
  addRecommendationsOfPrevMeeting() {
    const formArray = this.meetingForm.get('recommendationsOfPrevMeeting') as FormArray;
    formArray.push(this.recommendationsOfPrevMeeting());
  }
  removeRecommendationsOfPrevMeeting(index) {
    const formArray = this.meetingForm.get('recommendationsOfPrevMeeting') as FormArray;
    formArray.removeAt(index);
  }

  ngOnInit() {
    this.setRecommendationsOfPrevMeetingTable();
  }
  
  
  SaveMeetingForm(){
    const url = api.MOM_DRUDCM.common;
			// const params = { obj: JSON.stringify(filter || {}) };
			this.http.post(url,this.meetingForm.value).subscribe(response => {
				console.log(response);
        Swal.fire(
              'Submit Successfully..  !!!',
               'success'
               )
        this.meetingForm.reset();
			});
  }

}

