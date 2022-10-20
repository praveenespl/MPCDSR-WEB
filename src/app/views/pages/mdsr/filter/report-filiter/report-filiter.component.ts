import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef,MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { StateService } from '../../../../../services/locality/state.service';
import moment from 'moment';
import { DistrictService } from '../../../../../services/locality/district.service';
import { BlockService } from '../../../../../services/locality/block.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { iif } from 'rxjs';
@Component({
  selector: 'kt-report-filiter',
  templateUrl: './report-filiter.component.html',
  styleUrls: ['./report-filiter.component.scss'],
})
export class ReportFiliterComponent implements OnInit {
  states:State;
  districts:District;
  blocks:Block;
  // groups;
  currentUser;
  filterForm = new FormGroup({
    state_id: new FormControl(''),
    district_id: new FormControl(''),
    block_id: new FormControl(''),
    accessupto:new FormControl(''),
    from_date:new FormControl(''),
    to_date : new FormControl('')
  });
  constructor(private blockservice:BlockService, 
    private districtservice:DistrictService,
    private stateservice:StateService,
    public dialogRef: MatDialogRef<ReportFiliterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    
    private changedetectref:ChangeDetectorRef) {}

  ngOnInit() {
    this.onLoad();
    this.updateVisibilityFields();
  }
  isShowState: boolean=false;

  onLoad() {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    console.log('this.user',this.currentUser)
    let month=parseInt(moment().format("MM"));
    let year= parseInt(moment().format("YYYY"));
    this.filterForm.patchValue({from_date:moment(`${year}-${month}-01`)})

    // this.groups=[{
    //   "id":"National",
    //   "name":"State"
    // },{
    //   "id":"State",
    //   "name":"District"
    // },{
    //   "id":"District",
    //   "name":"Block"
    // }]
   
    let state_id:State =this.currentUser && (this.currentUser.accessupto === "Block" || this.currentUser.accessupto === "District" || this.currentUser.accessupto ==="State")
    ? this.currentUser.user_state_id.statecode
    : null;
    
    if(state_id!=null){
      this.filterForm.patchValue({"state_id":state_id})
      this.changedetectref.detectChanges();
    }
    
    let district_id=  this.currentUser && (this.currentUser.accessupto === "Block" || this.currentUser.accessupto === "District")
    ? this.currentUser.user_district_id.districtcode
    : null;
    
    if(district_id!=null){
      this.filterForm.patchValue({"district_id":district_id});
    }
    let block_id= this.currentUser && this.currentUser.accessupto === "Block"
    ? this.currentUser.user_block_id.subdistrictcode : null;
    if(block_id!=null){
      this.filterForm.patchValue({"block_id":block_id});
    }
    this.changedetectref.detectChanges();
if(this.currentUser.accessUpto === "National"){
  this.isShowState = true;
}
    // const data = {
    //   state_id:
    //     this.currentUser && (this.currentUser.accessupto === "Block" || this.currentUser.accessupto === "District" || this.currentUser.accessupto ==="State")
    //     ? this.currentUser.user_state_id
    //     : null,
    //   district_id:
    //     this.currentUser && (this.currentUser.accessupto === "Block" || this.currentUser.accessupto === "District")
    //     ? this.currentUser.user_district_id
    //     : null,
    //   block_id:
    //     this.currentUser && this.currentUser.accessupto === "Block"
    //     ? { "subdistrictcode" : this.currentUser.user_block_id.subdistrictcode, 
    //     "subdistrictname" : this.currentUser.user_block_id.subdistrictname} as Block
    //     : null,
    //   from_date: moment(`${year}-${month}-01`),
    //   to_date: moment()
    //   };
    
      
      this.stateservice.getStates( ).subscribe(stateres=>{      
        this.states=JSON.parse(JSON.stringify(stateres));
     }) 
    
     if(this.filterForm.value.state_id!='' || this.filterForm.value.state_id!=null){
      this.districtservice.getDistricts( this.filterForm.value.state_id).subscribe(districtres=>{
        this.districts=JSON.parse(JSON.stringify(districtres));
      })
     }
     if(this.filterForm.value.district_id!='' || this.filterForm.value.district_id!=null){
      this.blockservice.getBlocks( this.filterForm.value.district_id).subscribe(blockres=>{
        this.blocks=JSON.parse(JSON.stringify(blockres));
      })
     }


  }
  isShowDistrict:boolean = false;
  isShowBlock:boolean = false;
  updateVisibilityFields(){
    const accessUpto = this.currentUser.accessupto;
    if(accessUpto==='National'){
      this.isShowState=true;
      this.isShowDistrict = true;
      this.isShowBlock = true;
    }else
    if(accessUpto==='State'){
      this.isShowState=false;
      this.isShowDistrict = true;
      this.isShowBlock = true;

    }else if(accessUpto==='District'){
      this.isShowState=false;
      this.isShowDistrict = false;
      this.isShowBlock = true;
    }else if(accessUpto==='Block'){
      this.isShowState=false;
      this.isShowDistrict = false;
      this.isShowBlock = false;
    }
  }
  
  onClose(data?:any):void {
    this.dialogRef.close(data);
   // this.dialogRef.close({ action: 1, data: event.data });
  }
  getDistrictsOnStateBasis(state){
   // alert(statecode)
    this.filterForm.patchValue({district_id:''});
    this.filterForm.patchValue({block_id:''});
    this.districts=JSON.parse(JSON.stringify([]));
    this.blocks=JSON.parse(JSON.stringify([]));
    if(state!=undefined){
      this.districtservice.getDistricts(state.statecode).subscribe(districtres=>{
        this.districts=JSON.parse(JSON.stringify(districtres));
      })
    }
   
  }
  getBlocksOnDistrictBasis(district){
    this.filterForm.patchValue({block_id:''});
    this.blocks=JSON.parse(JSON.stringify([]));
    if(district!=undefined){
      this.blockservice.getBlocks(district.districtcode).subscribe(blockres=>{
        this.blocks=JSON.parse(JSON.stringify(blockres));
      })
    }
  }

}
