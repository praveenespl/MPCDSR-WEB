import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { StillbirthService } from "../../../../services/stillbirth/stillbirth.service";
import { DataList } from "../../../../models/views/data-list";
import { MatPaginator, MatSort, MatDialog } from "@angular/material";
import * as objectPath from "object-path";
import { merge, of } from "rxjs";
import { startWith, switchMap, map, catchError } from "rxjs/operators";
import moment from "moment";
import { FormFilterComponent } from "../../mdsr/filter/form-filter/form-filter.component";

@Component({
  selector: 'kt-still-birth',
  templateUrl: './still-birth.component.html',
  styleUrls: ['./still-birth.component.scss']
})
export class StillBirthComponent implements OnInit {
  pageSize: number;
  columns: DataList["columns"] = [
   { name: "stillBirthNo", isActionField: true },
    { name: "baby_hospital_record_no", isActionField: true },
    { name: "mother_hospital_record_no", isActionField: true },
    // { name: "nbbd_number", isActionField: true },
    { name: "Date_of_Still_Birth", isActionField: true },
    { name: "Mother_age", isActionField: true },
    { name: "Consanguineous_Marriage", isActionField: true },
    { name: "date_of_notification", isActionField: true },
    { name: "Form_filled_by", isActionField: true },
    { name: "action", isActionField: true },
  ];
  totalRecords: number;
  isLoadingResults: boolean = false;
  isMaxLimitReached: boolean;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  columnsToDisplay: string[] = this.columns.map((c) => c.key || c.name);
  dataSource: any[];
  readonly objectPath = objectPath;

  stateName = "";
  districtName = "";
  blockName = "";
  fromDate;
  toDate;

  currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  constructor(
    private stillbirthService: StillbirthService,
    private changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog
  ) { }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.getList();
  }
  getList() {
    let where: Partial<any>;
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
    where = {
      "state.statecode": state_id ? state_id.statecode : undefined,
      "district.districtcode": district_id
        ? district_id.districtcode
        : undefined,
      "block.subdistrictcode": block_id
        ? block_id.subdistrictcode
        : undefined,
      updatedAt: {
        between: [
          moment().year() + "-" + mon + "-01",
          moment().add(1, "days").format("YYYY-MM-DD"),
        ],
      },
    };

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.stillbirthService.getList({
            where,
            skip: this.paginator.pageIndex * this.pageSize,
            limit: this.pageSize,
          });
          // (this.sort.active, this.sort.direction, this.paginator.pageIndex);
        }),
        map((data) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isMaxLimitReached = false;
          // this.resultsLength = data.total_count;
          data.map((item) => { });
          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isMaxLimitReached = true;
          return of([]);
        })
      )
      .subscribe((data) => {
        this.dataSource = data;
        this.totalRecords=this.dataSource.length;
        this.changeDetectorRef.detectChanges();
      });
  }
  ngOnInit() {

  }

  /** Show Filters code */
  showFilers() {
    const dialogRef = this.dialog.open(FormFilterComponent, {
      width: "80%",
      height: "50%",
      data: "",
      panelClass: ["filterPopup"],
      hasBackdrop: true,
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe((res) => {
      let where: any;
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
          "state.statecode": res.data.state_id
            ? res.data.state_id.statecode
            : undefined,
          "district.districtcode": res.data.district_id
            ? res.data.district_id.districtcode
            : undefined,
          "block.subdistrictcode": res.data.block_id
            ? res.data.block_id.subdistrictcode
            : undefined,
          updatedAt: {
            between: [
              moment(res.data.from_date).format("YYYY-MM-DD"),
              moment(res.data.to_date).add(1, 'days').format("YYYY-MM-DD"),
            ],
          } as any,
        };

        merge(this.sort.sortChange, this.paginator.page)
          .pipe(
            startWith({}),
            switchMap(() => {
              this.isLoadingResults = true;
              return this.stillbirthService.getList({
                skip: this.paginator.pageIndex * this.pageSize,
                limit: this.pageSize,
                where,
              });

              // (this.sort.active, this.sort.direction, this.paginator.pageIndex);
            }),
            map((data) => {
              // Flip flag to show that loading has finished.
              this.isLoadingResults = false;
              this.isMaxLimitReached = false;
              // this.resultsLength = data.total_count;
              data.map((item) => { });
              return data;
            }),
            catchError(() => {
              this.isLoadingResults = false;
              // Catch if the GitHub API has reached its rate limit. Return empty data.
              this.isMaxLimitReached = true;
              return of([]);
            })
          )
          .subscribe((data) => {
            this.dataSource = data as any[];
            this.totalRecords=this.dataSource.length;
            this.changeDetectorRef.detectChanges();
          });
      }
      //this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
      //	this.loadRolesList();
    });
  } 

}
