import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { api } from '../../utilities/api';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {

  constructor(private http:HttpClient) { }

  //get captcha
  getCaptcha():Observable<any>{
    const url = api.captcha.generate;
    return this.http
      .get(url)
      .pipe(
        tap(
					() => {},
					({ error: { error } }) => {
						alert(error.message);
					}
				)
      )
  }
  //valdiate captcha
  validateCaptcha(optios : any):Observable<any>{
    const url = api.captcha.validateCaptcha;

    const params = {param :JSON.stringify(optios)}

    return this.http
      .get(url, {params})
      .pipe(
        tap(
					() => {},
					({ error: { error } }) => {
						alert(error.message);
					}
				)
      )   
  }
}
