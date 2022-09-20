import { Component, OnInit } from "@angular/core";
import { interval } from "rxjs";
import { map, share } from "rxjs/operators";
import { Router } from "@angular/router";
@Component({
	selector: "kt-guest",
	templateUrl: "./guest.component.html",
	styleUrls: ["./guest.component.scss"]
})
export class GuestComponent implements OnInit {
	clock = interval(1000).pipe(map(tick => new Date()));

	constructor(private router: Router) {}

	ngOnInit() {
		this.router.navigateByUrl("/login");
	}
}
