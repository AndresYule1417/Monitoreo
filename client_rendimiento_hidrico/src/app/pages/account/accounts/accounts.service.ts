//importacion de librerias
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  //declaracion de constructor y seudonimo a clase 
  constructor(private http: HttpClient) { }

  //funcion que retorna lista de usuarios
  list(){
    const headers  = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user') || '{}').token + ''};
    return this.http.get(`${environment.API_URL}/usuarios`, {headers});
  }

  //fuancion que actualiza un usuario
  update(id:number, data:any){
    const headers  = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user') || '{}').token + ''};    
    return this.http.put(`${environment.API_URL}/usuarios/${id}/`, data, {headers});
  }

  //funcion que elimina un usuario
  destroy(id:number){
    const headers  = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user') || '{}').token + ''};
    return this.http.delete(`${environment.API_URL}/usuarios/${id}/`, {headers});
  }

  //funcion que crea un usuario
  create(data:any){           
    return this.http.post(`${environment.API_URL}/usuarios/1/custom_create/`, data);
  }
}