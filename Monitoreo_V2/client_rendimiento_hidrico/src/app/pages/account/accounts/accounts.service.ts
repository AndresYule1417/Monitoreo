import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  constructor(private http: HttpClient) { }

  list(){
    const headers  = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user') || '{}').token + ''};
    return this.http.get(`${environment.API_URL}/usuarios`, {headers});
  }

  update(id:number, data:any){
    const headers  = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user') || '{}').token + ''};    
    return this.http.put(`${environment.API_URL}/usuarios/${id}/`, data, {headers});
  }

  destroy(id:number){
    const headers  = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user') || '{}').token + ''};
    return this.http.delete(`${environment.API_URL}/usuarios/${id}/`, {headers});
  }

  create(data:any){           
    return this.http.post(`${environment.API_URL}/usuarios/1/custom_create/`, data);
  }

}
