import { Injectable } from '@angular/core';
import Swal, { SweetAlertArrayOptions, SweetAlertOptions } from 'sweetalert2'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }
  fireAlert(object:SweetAlertOptions){
    const config:SweetAlertOptions = {
      timer: 3000,
      showConfirmButton:false
    }
    Swal.fire({
      ...config,
      ...object
    })
  }
}
