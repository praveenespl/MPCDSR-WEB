import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Form6Service } from '../../../../../services/mdsr/form6.service';
import { Form1Service } from '../../../../../services/mdsr/form1.service';
import { ActivatedRoute } from '@angular/router';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import FormJson from './form.json'
import * as moment from 'moment';
import { Location } from '@angular/common';
@Component({
  selector: 'kt-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent implements OnInit {

  component = [
    {
      label: "Panel",
      title: "MDR Case Summary",
      collapsible: false,
      mask: false,
      tableView: false,
      alwaysEnabled: false,
      type: "panel",
      input: false,
      key: "panel",
      components: FormJson.components
			//[
        // {
        //   label: "Name",
        //   allowMultipleMasks: false,
        //   showWordCount: false,
        //   showCharCount: false,
        //   tableView: true,
        //   alwaysEnabled: false,
        //   type: "textfield",
        //   input: true,
        //   key: "name",
        //   properties: {},
        //   tags: []
        // },
        //...FormJson.components
      //]
    }
  ];

	submission: any;
	pdfconfig: any = {};

	constructor(private changeDetectorRef: ChangeDetectorRef,		private form1Service: Form1Service,
    private form6Service: Form6Service,
    private _location:Location,
		private activatedRoute: ActivatedRoute) {}

  ngOnInit() {

    	this.activatedRoute.params.subscribe(({ id }) => {
			if (id) {
        console.log(id);

				this.form6Service
					.getOne(id, {
					include: [{
						relation:'mdsrForm1',
						"scope":{include:[{relation:"block"},{relation:"facility"}]}
					}]
				})
				.subscribe(data => {
          this.form1Service.getFormData({"deceased_women_id":data.deceased_women_id}).subscribe(form5Res => {

					//this.form5Service.getList({"where":{"deceased_women_id":data.deceased_women_id}}).subscribe(form5Res=>{
            //this.initForm(data,form5Res[0]);
            setTimeout(() => {
              let investigators=[];
              investigators=form5Res[0].investigators?form5Res[0].investigators:[{},{},{}];
              this.submission = {
                block:data?data.block_id.subdistrictname:'',
                facility:data?data.facility_id.health_facility_name:'',
                mcts_id:form5Res[0].generalinformation.mcts_id?form5Res[0].generalinformation.mcts_id:'',
                deceased_women_name:form5Res[0].generalinformation.deceased_women_mname===''?form5Res[0].generalinformation.deceased_women_fname+' '+form5Res[0].generalinformation.deceased_women_lname:form5Res[0].generalinformation.deceased_women_fname+' '+form5Res[0].generalinformation.deceased_women_mname+' '+form5Res[0].generalinformation.deceased_women_lname,
                age:form5Res[0].age?form5Res[0].age:'',
                religion:form5Res[0].religion?form5Res[0].religion:'',
                caste:form5Res[0].caste?form5Res[0].caste:'',
                place_of_death:form5Res[0].place_of_death?form5Res[0].place_of_death:'',
                death_date_time:form5Res[0].death_date_time?moment(form5Res[0].death_date_time).format('DD-MM-YYYY HH:mm:ss'):'',
                timing_of_death:data?data.timing_of_death:'',
                deceased_women_current_address:form5Res[0].generalinformation?form5Res[0].generalinformation.deceased_women_current_address:'',
                deceased_women_native_address:form5Res[0].generalinformation?form5Res[0].generalinformation.deceased_women_native_address:'',
                name1:form5Res && form5Res[0].investigators && form5Res[0].investigators[0]?form5Res[0].investigators[0].investigator_name:'',
                designation1:form5Res && form5Res[0].investigators && form5Res[0].investigators[0]?form5Res[0].investigators[0].investigator_designation:'',
                name2:form5Res && form5Res[0].investigators && form5Res[0].investigators[1]?form5Res[0].investigators[1].investigator_name:'',
                designation2:form5Res && form5Res[0].investigators && form5Res[0].investigators[1]?form5Res[0].investigators[1].investigator_designation:'',
                name3:form5Res && form5Res[0].investigators && form5Res[0].investigators[2]?form5Res[0].investigators[2].investigator_name:'',
                designation3:form5Res && form5Res[0].investigators && form5Res[0].investigators[2]?form5Res[0].investigators[2].investigator_designation:'',
                gravida:form5Res[0].gravida?form5Res[0].gravida:'',
                para:form5Res[0].para?form5Res[0].para:'',
                infant_outcome:form5Res[0].infant_outcome?form5Res[0].infant_outcome:'',
                alive_children:form5Res[0].alive_children_total?form5Res[0].alive_children_total:'',
                spontaneous_abortion:form5Res[0].spontaneous_abortion?form5Res[0].spontaneous_abortion:'',
                induced_abortion:form5Res[0].induced_abortion?form5Res[0].induced_abortion:'',
                interview_date:data?moment(data.interview_date).format('DD-MM-YYYY'):'',
                second_interviewdate:data?moment(data.second_interviewdate).format('DD-MM-YYYY'):'',
                respondent_name:data?data.respondent_name:'',
                respondent_contact:data?data.respondent_contact:'',
                delay_seeking_care:data?data.delay_seeking_care:'',
                delay_seeking_care_other:data?data.delay_seeking_care_other:'',
                delay_reaching_facility:data?data.delay_reaching_facility:'',
                delay_reaching_facility_other:data?data.delay_reaching_facility_other:'',
                delay_receiving:data?data.delay_receiving:'',
                delay_receiving_other:data?data.delay_receiving_other:'',
                probable_direct_obstetric_cause:data?data.probable_direct_obstetric_cause:'',
                indirect_obstetric_cause:data?data.indirect_obstetric_cause:'',
                contributory_cause_of_death:data?data.contributory_cause_of_death:'',
                initiatives_suggested:data?data.initiatives_suggested:''
              };
              this.pdfconfig = {
              // by default we use portrait, you can change it to landscape if you wish
                pageOrientation: 'landscape',
                content: [] ,
                defaultStyle: {
                   columnGap:2,
                   alignment:'left',
                   fontSize: 12
                },
                anotherStyle: {
                  italics: true,
                  alignment: 'right'
                }// should always be empty array
              };

              this.changeDetectorRef.detectChanges()
            }, 3000);
					})

				});
			}
		});

	}
  // private initForm(value?: Form6Object,form5Res?:Form5Object) {


	// 		this.submission= {
	// 			data: {
	// 				...value,
	// 				state_id:value.state_id,
	// 			    district_id:value.district_id,
	// 				block_id: value.mdsrForm1.block,
	// 				facility_id: value.mdsrForm1.facility,
	// 				mcts_id:value.mdsrForm1.mcts_id,
	// 				deceased_women_native_address:value.mdsrForm1.deceased_women_native_address,
  //         deceased_women_current_address:value.mdsrForm1.deceased_women_current_address,
  //         deceased_women_name:form5Res.generalinformation.deceased_women_mname===''?form5Res.generalinformation.deceased_women_fname+' '+form5Res.generalinformation.deceased_women_lname:form5Res.generalinformation.deceased_women_fname+' '+form5Res.generalinformation.deceased_women_mname+' '+form5Res.generalinformation.deceased_women_lname,
	// 				age:form5Res.module1.background_info.age,
	// 				investigators:form5Res.generalinformation.investigators,
	// 				religion:form5Res.module1.profile.religion,
	// 					caste:form5Res.module1.profile.caste,
	// 					place_of_death:form5Res.module1.background_info.place_of_death,
	// 					death_date_time:form5Res.module1.background_info.death_date_time

	// 			}

	// 		}

  // }

	backClicked() {
		this._location.back();
	}

}
