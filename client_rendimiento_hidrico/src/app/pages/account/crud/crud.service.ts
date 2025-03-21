import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private http: HttpClient) { }

  //crea un nevo proyecto, se realiza peticion post enviando documento excel
  create(data:any, file:any, file_geo:any){//adicion de codigo
    const headers  = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user') || '{}').token + ''};
    let formParams = new FormData();
    formParams.append('nombre', data.nombre);
    formParams.append('fecha', data.fecha);
    formParams.append('archivo', file);
    formParams.append('archivo_geo', file_geo);
    return this.http.post(`${environment.API_URL}/proyectos/`, formParams, {headers});
  }

  //obtiene todos los proyectos guardados
  list(){
    const headers  = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user') || '{}').token + ''};
    return this.http.get(`${environment.API_URL}/proyectos`, {headers});
  }

  //obtiene todos los proyectos publicados
  listCustom(){
    const headers  = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user') || '{}').token + ''};
    return this.http.get(`${environment.API_URL}/proyectos/list_custom`, {headers});
  }

  //elimina un proyecto    
  destroy(id:number){
    const headers  = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user') || '{}').token + ''};
    return this.http.delete(`${environment.API_URL}/proyectos/${id}/`, {headers});
  }

  //actualiza datos de un proyecto
  update(id:number, data:any, file:any, fileGeo:any){
    const headers  = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user') || '{}').token + ''};
    if(file == null)
      file = '';
    if(fileGeo == null)
      fileGeo = '';
    
    let formParams = new FormData();    
    formParams.append('nombre', data.nombre);
    formParams.append('fecha', data.fecha);
    formParams.append('archivo', file);    
    formParams.append('archivo_geo', fileGeo);
    return this.http.put(`${environment.API_URL}/proyectos/${id}/`, formParams, {headers});
  }

  updateCustom(id:number, data:any){
    const headers  = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user') || '{}').token + ''};
    return this.http.put(`${environment.API_URL}/proyectos/${id}/update_custom/`, data, {headers});
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

  //adicion de codigo
  //obtiene los datos de un proyecto para graficar indices hidricos
  async retrieve_indice(id:string){
    const headers  = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user') || '{}').token + ''};
    return this.http.get(`${environment.API_URL}/proyectos/${id}/retrieve_indice`, {headers});
  }
}