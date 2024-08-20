import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from './shared/guards/auth.guard';

//constantes donde se encuentrar las dos rutas principales de la pagina web
const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', loadChildren: () => import('./pages/home/home.module').then((m) => m.HomeModule)},
  {path: 'account', loadChildren: () => import('./pages/account/account.module').then((m) => m.AccountModule), canActivate: [authGuard],},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
