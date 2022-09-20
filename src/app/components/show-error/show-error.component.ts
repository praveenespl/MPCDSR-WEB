import { Component, OnInit, Input } from "@angular/core";

@Component({
	selector: "[show-error]",
	templateUrl: "./show-error.component.html",
	styleUrls: ["./show-error.component.scss"]
})
export class ShowErrorComponent implements OnInit {
	@Input()
	errors: any;

	@Input()
	label: string = "Field";

	@Input() min:number;
	@Input() max:number;

	constructor() {}

	ngOnInit() {}
}
