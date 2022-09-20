import { FormControl } from '@angular/forms';
import { MatOption } from '@angular/material';
import { Component, Input, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'kt-state-input',
  templateUrl: './state-input.component.html',
  styleUrls: ['./state-input.component.scss']
})
export class StateInputComponent implements OnInit {
	@Input() stateList = [];
	@Output() changeState = new EventEmitter<number[]>();
  constructor() { }
	states = new FormControl();
  ngOnInit() {
  }
	@ViewChild('allSelected', { static: false }) private allSelected: MatOption;

	tosslePerOne(all) {
		if (this.allSelected.selected) {
			this.allSelected.deselect();
			return false;
		}
		if (this.states.value.length == this.stateList.length)
			this.allSelected.select();

	}
	toggleAllSelection() {
		if (this.allSelected.selected) {
			const statecodes = this.stateList.map(state => state.statecode)
			this.states.patchValue(statecodes)
		} else {
			this.states.patchValue([]);
		}
		this.changeState.emit(this.states.value);
		//this.getSubmittedFormsStatus({ state_id: { "statecode": this.states.value } });

	}

	onStateChange(){
		this.changeState.emit(this.states.value);
		//this.getSubmittedFormsStatus({ state_id: { "statecode": this.states.value } });
	}
}
