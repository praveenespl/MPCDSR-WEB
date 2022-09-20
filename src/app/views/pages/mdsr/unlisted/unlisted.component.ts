import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { MatDialog } from "@angular/material";
import { FormFilterComponent } from "../filter/form-filter/form-filter.component";
import moment from "moment";
import { of, merge } from "rxjs";
import { catchError, map, startWith, switchMap } from "rxjs/operators";
import { Form1Service } from "../../../../services/mdsr/form1.service";
import { StateService } from "../../../../services/locality/state.service";
import { DistrictService } from "../../../../services/locality/district.service";
import { BlockService } from "../../../../services/locality/block.service";
import { AlertService } from "../../../../utilities/alert.service";

@Component({
	selector: "kt-unlisted",
	templateUrl: "./unlisted.component.html",
	styleUrls: ["./unlisted.component.scss"]
})
export class UnlistedComponent implements OnInit {
	columns = [
		"name",
		"husband",
		"state",
		"district",
		"block",
		"village",
		"place_of_death",
		// "isMaternal death",
		"remark",
		"new_state",
		"new_district",
		"new_block",
		"action"
	];
	dataSource: any[] = [];

	currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
	//
	blockName: string;
	stateName: string;
	districtName: string;
	fromDate: string;
	toDate: string;

	states: State[] = [];
	private districtsArray: Array<{
		statecode: number;
		districts: District[];
	}> = [];
	private blocksArray: Array<{ distritcode: number; blocks: Block[] }> = [];

	constructor(
		private dialog: MatDialog,
		private form1Service: Form1Service,
		private changeDetectorRef: ChangeDetectorRef,
		private stateService: StateService,
		private districtService: DistrictService,
		private blockService: BlockService,
		private alertService: AlertService
	) {}

	getList(where?: any) {
		// this.form1Service.count({ where }).subscribe(({ count }) => {
		// 	this.totalRecords = count;
		// });

		merge()
			.pipe(
				startWith({}),
				switchMap(() => {
					// this.isLoadingResults = true;
					return this.form1Service.getList({
						where: where,
						// skip: this.paginator.pageIndex * this.pageSize,
						// limit: this.pageSize,
						include: [{ relation: "village" }, { relation: "fileLibrary" }]
					});
					// (this.sort.active, this.sort.direction, this.paginator.pageIndex);
				}),
				map(data => {
					// Flip flag to show that loading has finished.
					// this.isLoadingResults = false;
					// this.isMaxLimitReached = false;

					return data;
				}),
				catchError(() => {
					// this.isLoadingResults = false;
					// this.isMaxLimitReached = true;
					return of([]);
				})
			)
			.subscribe(data => {
				this.dataSource = (data as any[]).map((i: any) => ({
					...i,
					getName: i.getName,
					newState: "",
					newDistrict: "",
					newBlock: ""
				}));
				this.changeDetectorRef.detectChanges();
			});
	}

	showFilers(): void {
		const dialogRef = this.dialog.open(FormFilterComponent, {
			width: "80%",
			height: "50%",
			data: "",
			panelClass: ["filterPopup"],
			hasBackdrop: true,
			disableClose: false
		});
		dialogRef.afterClosed().subscribe(res => {
			let where: Partial<any>;
			if (!res) {
				return;
			}
			if (res && res.action === 1) {
				this.stateName = res.data.state_id
					? res.data.state_id.statename
					: undefined;
				this.districtName = res.data.district_id
					? res.data.district_id.districtname
					: undefined;
				this.blockName = res.data.block_id
					? res.data.block_id.subdistrictname
					: undefined;
				this.fromDate = moment(res.data.from_date).format("DD-MM-YYYY");
				this.toDate = moment(res.data.to_date).format("DD-MM-YYYY");

				where = {
					"state_id.statecode": res.data.state_id
						? res.data.state_id.statecode
						: undefined,
					"district_id.districtcode": res.data.district_id
						? res.data.district_id.districtcode
						: undefined,
					"block_id.subdistrictcode": res.data.block_id
						? res.data.block_id.subdistrictcode
						: undefined,
					death_date_time: {
						between: [
							moment(res.data.from_date).format("YYYY-MM-DD"),
							moment(res.data.to_date).format("YYYY-MM-DD")
						]
					} as any,
					status: "unlist"
				};

				this.getList(where);
			}
			//this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
			//	this.loadRolesList();
		});
	}

	getBlocks(distritcode: number) {
		const record = this.blocksArray.find(i => i.distritcode == distritcode);
		let blocks = [];
		if (record) {
			blocks = record.blocks;
		} else {
			this.blockService.getBlocks(distritcode).subscribe(response => {
				blocks = response;
				this.blocksArray.push({ distritcode, blocks: response });
			});
		}
		return blocks;
	}

	getDistricts(statecode: number) {
		const record = this.districtsArray.find(i => i.statecode == statecode);
		let districts = [];
		if (record) {
			districts = record.districts;
		} else {
			this.districtService.getDistricts(statecode).subscribe(response => {
				districts = response;
				this.districtsArray.push({ statecode, districts: response });
			});
		}
		return districts;
	}

	save() {
		const request = this.dataSource
			.filter(i => i.newBlock)
			.map(i => {
				const record = JSON.parse(JSON.stringify(i));
				record.state_id = record.newState ? record.newState : record.state_id;
				record.district_id = record.newDistrict
					? record.newDistrict
					: record.district_id;
				record.block_id = record.newBlock ? record.newBlock : record.block_id;
				delete record.newState;
				delete record.newDistrict;
				delete record.newBlock;
				record.status = "";
				return record;
			});

		this.form1Service.updateMiltple(request).subscribe(response => {
			// console.log(response);
			this.alertService.fireAlert({
				title: "Update successfully!",
				icon: "success"
			});

			//
			// let where: Partial<any>;
			let mon = moment().month() + 1;
			let day;
			let block_id, district_id, state_id;

			if (moment().date() >= 10) {
				day = moment().date();
			} else {
				day = "0" + moment().date();
			}
			if (this.currentUser.accessupto == "Block") {
				this.blockName = this.currentUser.user_block_id
					? this.currentUser.user_block_id.subdistrictname
					: undefined;
				this.stateName = this.currentUser.user_state_id
					? this.currentUser.user_state_id.statename
					: undefined;
				this.districtName = this.currentUser.user_district_id
					? this.currentUser.user_district_id.districtname
					: undefined;
				block_id = this.currentUser.user_block_id
					? this.currentUser.user_block_id
					: undefined;
			} else if (this.currentUser.accessupto == "District") {
				this.stateName = this.currentUser.user_state_id
					? this.currentUser.user_state_id.statename
					: undefined;
				this.districtName = this.currentUser.user_district_id
					? this.currentUser.user_district_id.districtname
					: undefined;
				district_id = this.currentUser.user_district_id
					? this.currentUser.user_district_id
					: undefined;
			} else if (this.currentUser.accessupto == "State") {
				this.stateName = this.currentUser.user_state_id
					? this.currentUser.user_state_id.statename
					: undefined;
				state_id = this.currentUser.user_state_id
					? this.currentUser.user_state_id
					: undefined;
			} else {
				this.stateName = "All States";
			}
			this.fromDate = "01" + "-" + mon + "-" + moment().year();
			this.toDate = day + "-" + mon + "-" + moment().year();
			const where = {
				"state_id.statecode": state_id ? state_id.statecode : undefined,
				"district_id.districtcode": district_id
					? district_id.districtcode
					: undefined,
				"block_id.subdistrictcode": block_id
					? block_id.subdistrictcode
					: undefined,
				// death_date_time
				createdAt: {
					between: [moment().year() + "-" + mon + "-01", new Date()]
				},
				status: "unlist"
			};

			this.getList(where);
		});
	}

	ngOnInit() {
		this.stateService.getStates().subscribe(states => {
			this.states = states;
		});
		// let where: Partial<any>;
		let mon = moment().month() + 1;
		let day;
		let block_id, district_id, state_id;

		if (moment().date() >= 10) {
			day = moment().date();
		} else {
			day = "0" + moment().date();
		}
		if (this.currentUser.accessupto == "Block") {
			//
			this.columns.splice(this.columns.indexOf("new_state"), 1);
			this.columns.splice(this.columns.indexOf("new_district"), 1);
			this.columns.splice(this.columns.indexOf("new_block"), 1);
			//
			this.blockName = this.currentUser.user_block_id
				? this.currentUser.user_block_id.subdistrictname
				: undefined;
			this.stateName = this.currentUser.user_state_id
				? this.currentUser.user_state_id.statename
				: undefined;
			this.districtName = this.currentUser.user_district_id
				? this.currentUser.user_district_id.districtname
				: undefined;
			block_id = this.currentUser.user_block_id
				? this.currentUser.user_block_id
				: undefined;
		} else if (this.currentUser.accessupto == "District") {
			//
			this.columns.splice(this.columns.indexOf("new_state"), 1);
			this.columns.splice(this.columns.indexOf("new_district"), 1);
			//
			this.stateName = this.currentUser.user_state_id
				? this.currentUser.user_state_id.statename
				: undefined;
			this.districtName = this.currentUser.user_district_id
				? this.currentUser.user_district_id.districtname
				: undefined;
			district_id = this.currentUser.user_district_id
				? this.currentUser.user_district_id
				: undefined;
		} else if (this.currentUser.accessupto == "State") {
			//
			this.columns.splice(this.columns.indexOf("new_state"), 1);
			//
			this.stateName = this.currentUser.user_state_id
				? this.currentUser.user_state_id.statename
				: undefined;
			state_id = this.currentUser.user_state_id
				? this.currentUser.user_state_id
				: undefined;
		} else {
			this.stateName = "All States";
		}
		this.fromDate = "01" + "-" + mon + "-" + moment().year();
		this.toDate = day + "-" + mon + "-" + moment().year();
		const where = {
			"state_id.statecode": state_id ? state_id.statecode : undefined,
			"district_id.districtcode": district_id
				? district_id.districtcode
				: undefined,
			"block_id.subdistrictcode": block_id
				? block_id.subdistrictcode
				: undefined,
			// death_date_time
			createdAt: {
				between: [moment().year() + "-" + mon + "-01", new Date()]
			},
			status: "unlist"
		};
		//
		this.getList(where);
	}
}
