import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { UsermasterService } from '../../../../../../src/app/services/usermaster/usermaster.service';
import { AlertService } from '../../../../../../src/app/services/alert.service';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from "sweetalert2";

@Component({
  selector: 'kt-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  dataSourceForUser: MatTableDataSource<any>;
  displayedColumns: string[] = ['select', 'email', 'msg'];
  displayedColumnsForUser: string[] = ['select', 'name', 'designation', 'email', 'mobile'];

  messageSelection = new SelectionModel(false, []);//false for radio button
  checkBoxSelection = new SelectionModel(true, []);
  showSpinner: boolean = false;
  constructor(
    private _alertService: AlertService,
    private _cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getData();
  }
  getData() {
    const alertData = this._alertService.getList({ where: { type: "alert" } });
    const userData = this._alertService.getList({ where: { type: "user" } });
    forkJoin([alertData, userData]).subscribe(([data1, data2]: any) => {
      console.log(data1, data2);
      data2.sort((a,b)=>a.name.localeCompare(b.name));
      this.dataSource = new MatTableDataSource(data1.length > 0 ? data1 : []);
      this.dataSourceForUser = new MatTableDataSource(data2.length > 0 ? data2 : []);
      this._cdr.detectChanges();
    })
  }
  isAllSelected() {
    const numSelected = this.checkBoxSelection.selected.length;
    const numRows = this.dataSourceForUser.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ? this.checkBoxSelection.clear() :
      this.dataSourceForUser.data.forEach(element => {
        this.checkBoxSelection.select(element)
      });
  }
  sendMeesage() {
    this.showSpinner = true;
    if (this.messageSelection.selected.length === 0) {
      alert("Select Message")
    } else if (this.checkBoxSelection.selected.length === 0) {
      alert("Select User")

    } else {
      Swal.fire({
        title: "<strong>Confirmation</strong>",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Continue",
        cancelButtonText: "Quit",
        width: "400px",
        html:
          '<style type="text/css">' +
          ".tg  {border-collapse:collapse;border-spacing:0;}" +
          ".tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black;}" +
          ".tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black;}" +
          ".tg .tg-gofb{background-color:#00897b;color:#ffffff;border-color:#333333;text-align:left;vertical-align:top}" +
          ".tg .tg-0lax{text-align:left;vertical-align:top}" +
          "</style>" +
          '<table class="tg" fixed; width: 577px">' +
          "<tr>" +
          '<th >Message</th>' +
          '<th >' + this.messageSelection.selected[0].email.subject + '</th>' +
          "</tr>" +
          "<tr>" +
          '<th >Total No. of Recipient</th>' +
          '<th >' + this.checkBoxSelection.selected.length + '</th>' +
          "</tr>" +
          "</table>"
      }).then(result => {
        if (result.value) {
          let passingObject = { message: this.messageSelection.selected[0], email: [], mobile: [] };
          this.checkBoxSelection.selected.forEach(user => {
            passingObject.email.push(user.email);
            passingObject.mobile.push(user.mobile);
          });
          console.log('passingObject', passingObject);

          this._alertService.sendEmailAndMessage(passingObject).subscribe(res => {
            console.log(res);
            const Toast = Swal.mixin({
              toast: true,
              position: "center",
              showConfirmButton: false,
              timer: 4000,
              timerProgressBar: true,
            });
            Toast.fire({
              icon: "success",
              title: "Alert sent successfully !!",
            });
            this.showSpinner = false;
            this.messageSelection.clear();
            this.checkBoxSelection.clear();
            this._cdr.detectChanges();

          })
        } else if (result.dismiss) {
          console.log("Cancel");
        }
      });
    }

  }

}
