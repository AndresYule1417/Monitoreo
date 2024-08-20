import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private http: HttpClient) { }

  create(data:any, file:any){
    const headers  = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user') || '{}').token + ''};
    let formParams = new FormData();
    formParams.append('nombre', data.nombre);
    formParams.append('fecha', data.fecha);
    formParams.append('archivo', file);
    return this.http.post(`${environment.API_URL}/proyectos/`, formParams, {headers});
  }

  list(){
    const headers  = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user') || '{}').token + ''};
    return this.http.get(`${environment.API_URL}/proyectos`, {headers});
  }

  destroy(id:number){
    const headers  = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user') || '{}').token + ''};
    return this.http.delete(`${environment.API_URL}/proyectos/${id}/`, {headers});
  }

  update(id:number, data:any, file:any){
    const headers  = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user') || '{}').token + ''};
    if(file == null)
      file = '';
    console.log(file);
    let formParams = new FormData();    
    formParams.append('nombre', data.nombre);
    formParams.append('fecha', data.fecha);
    formParams.append('archivo', file);    
    return this.http.put(`${environment.API_URL}/proyectos/${id}/`, formParams, {headers});
  }

  async retrieve(id:string){
    const headers  = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user') || '{}').token + ''};
    return this.http.get(`${environment.API_URL}/proyectos/${id}`, {headers});
  }


}
