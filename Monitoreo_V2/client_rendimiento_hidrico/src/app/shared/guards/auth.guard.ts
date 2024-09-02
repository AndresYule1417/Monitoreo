import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment.development';

import { LoginService } from '../../pages/home/login/login.service';

export const authGuard: CanActivateFn = (route, state) => {

  const http = inject(HttpClient);  
  const myRouter = inject(Router);
  const service = inject(LoginService);   

  var data = service.getToken();

  return http.post(`${environment.API_URL}/api/token/verify/`, data).pipe(map(result => {      
    return true;
  }), catchError((error) => {     
    myRouter.navigate(['/home']);
    return of(false); 
  }));  
};