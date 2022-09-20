import {
	Component,
	OnInit,
	Input,
	forwardRef,
	Output,
	EventEmitter
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { max, min } from 'lodash';

type InputTypes = "text" | "textarea" | "select" | "datepicker";

@Component({
	selector: "kt-form-input",
	templateUrl: "./form-input.component.html",
	styleUrls: ["./form-input.component.scss"],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => FormInputComponent),
			multi: true
		}
	]
})
export class FormInputComponent implements ControlValueAccessor {
	@Input()
	type: InputTypes = "text";
	maxDate;
	@Input()
	selectOptions: any;

	@Input()
	errors: any;
	@Input()
	showErrors: boolean = true;

	@Input()
	label: string;
	@Input()
	errorLabel: string;
	@Input()
	showLabel: boolean = true;

	@Input()
	tooltip: string;

	@Input()
	required: boolean = false;

	@Input("value")
	_value: string;
	@Input ("max")
	max:number;
	@Input ("min")
	min:number;
	network_locked;

	@Input() isSubmitted;
	@Input() viewOnly: boolean = false;
	@Input() readonly: boolean;

	disabled = false;
	touched = false;
	constructor() {}

	// Both onChange and onTouched are functions
	onChange: any = () => {};
	onTouched: any = () => {};
	ngOnInit(){
		this.viewOnly = this.viewOnly || this.readonly ? true: false;
	}

	@Output("change")
	change = new EventEmitter<any>();

	get value() {
		return this._value;
	}

	set value(val) {
		this._value = val;
		this.touched = true;
		this.onChange(val);
		this.change.emit(val);
		this.onTouched();
	}

	writeValue(value: any): void {
		if (value) {
			this.value = value;
		}
	}
	registerOnChange(fn: any): void {
		this.onChange = fn;
	}
	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

}
