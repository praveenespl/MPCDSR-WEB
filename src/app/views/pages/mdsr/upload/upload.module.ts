import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { UploadComponent } from './upload.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogModule } from '@angular/material';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PartialsModule } from '../../../../views/partials/partials.module';



@NgModule({
  declarations: [UploadComponent, UploadFileComponent],
  imports: [
    
    CommonModule,
    PartialsModule,
    HttpClientModule,
  	ReactiveFormsModule,
  	NgbModule,
    MatDialogModule,
    PdfViewerModule
  ],
  entryComponents:[
    UploadFileComponent
  ]
})
export class UploadModule { }
