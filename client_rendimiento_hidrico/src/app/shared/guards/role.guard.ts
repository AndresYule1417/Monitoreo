import { CanActivateFn } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  var usuario = JSON.parse(localStorage.getItem('user') || '{}').user; 
  if(usuario.is_superuser){
    return true;
  }else{
    return false;
  }  
};
