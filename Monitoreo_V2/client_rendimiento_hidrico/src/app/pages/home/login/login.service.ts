import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment.development';
import { UserLogin } from '../../../shared/models/user-login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private user = new BehaviorSubject<UserLogin | null>(null); 

  public isLocalStorageAvailable = typeof localStorage !== 'undefined';

  constructor(private http: HttpClient, private myRouter: Router) { }

  get user$(): Observable<UserLogin | null> {    
    return this.user.asObservable();
  }

  login(data: any): Observable<UserLogin | void> {      
    return this.http.post<UserLogin>(`${environment.API_URL}/login/`, data).pipe(map((user: UserLogin) => {      
      this.user.next(user);        
      localStorage.setItem('user', JSON.stringify(user));         
      return user;
    }), catchError((error) => this.handlerError(error)));
  }

  logout(){
    //const headers  = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user') || '{}').token + ''};
    //this.usuario = JSON.parse(localStorage.getItem('user') || '{}').user; 
    //var data = {'user': this.usuario.id};    
    //this.http.post(`${environment.API_URL}/logout/`, data, {headers}).subscribe(result => {
    //  console.log(result);
    //});
    localStorage.removeItem('user');
    this.user.next(null);    
    this.myRouter.navigate(['/home/start']);    
  }

  checkToken(){           
    var data = this.getToken()
    return this.http.post(`${environment.API_URL}/api/token/verify/`, data).pipe(map(result => {      
      return true;
    }), catchError((error) => this.handlerError(error)));              
  }

  getToken(){
    var data = {};
    if(this.isLocalStorageAvailable) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');    
      data = {'token': user.token};       
    }
    return data; 
  }

  private handlerError(error: HttpErrorResponse){
    var message = '';
    console.log(error);
    if(error) {
      if(error.status == 400){
        message = 'Usuario o contraseña erroneos';
      }else if(error.status == 401){
        //this.logout();
        message = 'No autorizado'
      }      
    }    
    return throwError(() => new Error(message));
  }
}
