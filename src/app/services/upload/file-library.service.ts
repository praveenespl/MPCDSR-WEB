import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { api } from '../../utilities/api';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileLibraryService {

  constructor(private http:HttpClient) { }
    //Upload File through container 
    uploadFile(formData:FormData) {      
      const url = api.container.upload
      return this.http.post(url, formData).pipe(
        tap(
          () => {},
          ({ error: { error } }) => {
            alert(error.message);
          }
        )
      );
    }
    downloadFile(fileName) {     
      const url = api.container.download;
      return url+ '/'+fileName;
    }
}
