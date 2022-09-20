import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { api } from '../../utilities/api';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GisService {
  constructor(private http:HttpClient) { }

  //get gis districts
  getDistricts(obj):Observable<any>{

    const url = api.gis.getDistricts;
    const params = {params : JSON.stringify(obj) }
    return this.http
      .get(url,{params})
      .pipe(
        tap(
					() => {},
					({ error: { error } }) => {
						alert(error.message);
					}
				)
      )
  }

  //get gis districts
  getStates(obj):Observable<any>{
    const url = api.gis.getStates;
    const params = {params : JSON.stringify(obj) }
    return this.http
      .get(url,{params})
      .pipe(
        tap(
					() => {},
					({ error: { error } }) => {
						alert(error.message);
					}
				)
      )
  }

  //get gis subdistricts
  getSubDistricts(obj):Observable<any>{
    const url = api.gis.getSubDistricts;
    const params = {params : JSON.stringify(obj) }
    return this.http
      .get(url,{params})
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
