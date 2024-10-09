import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private http: HttpClient) { }

  //crea un nevo proyecto, se realiza peticion post enviando documento excel
  create(data:any, file:any){
    const headers  = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user') || '{}').token + ''};
    let formParams = new FormData();
    formParams.append('nombre', data.nombre);
    formParams.append('fecha', data.fecha);
    formParams.append('archivo', file);
    return this.http.post(`${environment.API_URL}/proyectos/`, formParams, {headers});
  }

  //ontiene todos los proyectos guardados
  list(){
    const headers  = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user') || '{}').token + ''};
    return this.http.get(`${environment.API_URL}/proyectos`, {headers});
  }

  //elimina un proyecto    
  destroy(id:number){
    const headers  = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user') || '{}').token + ''};
    return this.http.delete(`${environment.API_URL}/proyectos/${id}/`, {headers});
  }

  //actualiza datos de un proyecto
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

  //obtiene datos de un proyecto para graficar el rendimiento hidrico
  async retrieve(id:string){
    const headers  = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user') || '{}').token + ''};
    return this.http.get(`${environment.API_URL}/proyectos/${id}`, {headers});
  }

  //obtiene los datos de un proyecto para graficar ohts
  async retrieve_ohts(id:string){
    const headers  = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user') || '{}').token + ''};
    return this.http.get(`${environment.API_URL}/proyectos/${id}/retrieve_ohts`, {headers});
  }
}