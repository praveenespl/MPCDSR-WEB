import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FileLibraryService } from '../../../../../services/upload/file-library.service';

@Component({
  selector: 'kt-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  fileToUpload: File = null;
  selectedFile;
  UploadedImage;
  ImageForDownload;
  ShowUplodedPDF:boolean=false;
  ShowUplodedImage:boolean=false;
  acceptedFormatForImage: string[] = ['jpeg', 'jpg', 'png'];
  constructor(private _changeDetectorRef:ChangeDetectorRef,public dialogRef: MatDialogRef<UploadFileComponent>,@Inject(MAT_DIALOG_DATA) public data: any, private fileLibrary: FileLibraryService) { }

  ngOnInit() {
  }
  
  methodToSameFileSelected(event) {
    //Method to delete same file from source which is previsioly selected.
    event.target.value = '';
  }
  selectFile(event) {
    this.selectedFile = <File>event.target.files[0];
    const fileExtension: string = this.selectedFile.name.substring(this.selectedFile.name.lastIndexOf(".") + 1)
    if (fileExtension.toLowerCase() == 'pdf' || this.acceptedFormatForImage.includes(fileExtension.toLowerCase())) {
        if (fileExtension.toLowerCase() == 'pdf') {
          this.ShowUplodedPDF = true;
          this.ShowUplodedImage = false;
        } else if (this.acceptedFormatForImage.includes(fileExtension.toLowerCase())) {
          this.ShowUplodedPDF = false;
          this.ShowUplodedImage = true;
        }


        //Show Image Preview
        let reader = new FileReader();
        reader.onload = (event: any) => {
          this.UploadedImage = event.target.result
          this._changeDetectorRef.detectChanges();
        }
        reader.readAsDataURL(this.selectedFile);
        this._changeDetectorRef.detectChanges();
      }else{
        alert("Please upload Images in jpeg, jpg, png or PDF only")
      }
  }
  onNoClick() {
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('fields', this.data);
    this.fileLibrary.uploadFile(formData).subscribe(res=>{
      alert('FILE UPLOADED SUCCESSFULLY !!');
      this.dialogRef.close({action: 1, data: res});

    })
  }
  // View image without uploading need to check
  // viewImage(url) {
  //   window.open(url, "Title but its not working", 'toolbar=yes, resizable=yes, scrollbars=yes, width=400, height=400, top=200 , left=500');
  // }

}
