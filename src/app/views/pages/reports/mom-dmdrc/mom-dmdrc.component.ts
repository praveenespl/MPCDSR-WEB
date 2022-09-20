import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {api} from '../../../../utilities/api';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'kt-mom-dmdrc',
  templateUrl: './mom-dmdrc.component.html',
  styleUrls: ['./mom-dmdrc.component.scss']
})
export class MOMDMDRCComponent implements OnInit {
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
	years = [
    {value: 2021},
    {value: 2022},
    {value: 2023},
    {value: 2024},
    {value: 2025},
    {value: 2026},
    {value: 2027},
    {value: 2028},
    {value: 2029},
    {value: 2030},

  ]
  meetingForm: FormGroup;
  constructor(
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private http:HttpClient
  ) {
    this.createForm();
  }


  createForm() {
    this.meetingForm = new FormGroup({
      month: new FormControl(""),
      year: new FormControl(""),
      district: new FormControl(this.currentUser.user_district_id.districtname),
      dateOfMeeting: new FormControl(""),
      maternalDeathsPM: new FormControl(""),
      maternalDeathsPMReviewed: new FormControl(""),
      maternalDeathsFromApril: new FormControl(""),
      maternalDeathsFromAprilReviewed: new FormControl(""),
      recommendationsOfPrevMeeting: new FormControl(""),
      committeeMembersList: new FormArray([this.committeeMembersList()]),
    })
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



  ngOnInit() {
  }


  SaveMeetingForm(){
    const url = api.MOM_DMDRC.common;
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
