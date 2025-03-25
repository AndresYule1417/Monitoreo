import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { StartComponent } from './start/start.component';
import { RecoverComponent } from './recover/recover.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';

//definicion de rutas dentro de home
const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    children: [
      {path: '', redirectTo: 'start', pathMatch: 'full'},
      {path: "login", component: LoginComponent},
      {path: "start", component: StartComponent},
      {path: "register", component: RegisterComponent},      
      {path: "recover", component: RecoverComponent}, //falta
      {path: "recover-password/:id/:token", component: RecoverPasswordComponent},
    ]
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
