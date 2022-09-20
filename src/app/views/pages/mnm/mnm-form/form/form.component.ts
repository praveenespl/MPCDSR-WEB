import { Component, OnInit, EventEmitter, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import generalInfoConfig from './json/general-info.json';
@Component({
  selector: 'kt-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit,AfterViewInit {

	generalInformationForm: Object = generalInfoConfig;

	/**
	 * @description General Information
	 */
	 step1refresh = new EventEmitter();

	currentUser;
  constructor(
		private cdf: ChangeDetectorRef
	) { }

  ngOnInit() {
		this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
		setTimeout(()=>this.cdf.detectChanges())
  }

	ngAfterViewInit(): void{

	}

	onSubmit(){

	}

	onChange($event){

	}

}
