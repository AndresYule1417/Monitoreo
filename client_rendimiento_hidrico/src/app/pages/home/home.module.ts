import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {CarouselComponent, CarouselControlComponent, CarouselIndicatorsComponent, CarouselInnerComponent, CarouselItemComponent, ThemeDirective} from '@coreui/angular';

import { HomeRoutingModule } from './home-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { StartComponent } from './start/start.component';
import { RecoverComponent } from './recover/recover.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';


//archivo donde se cargan los modulos creados por el usuario y se importan 
//componentes que se van a utilizar
@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    StartComponent,
    RecoverComponent,
    RecoverPasswordComponent,       
  ],
  imports: [
    CommonModule,    
    HomeRoutingModule,
    CarouselComponent,
    CarouselControlComponent,
    CarouselIndicatorsComponent,
    CarouselInnerComponent,
    CarouselItemComponent,
    ThemeDirective,
    FormsModule, 
    ReactiveFormsModule
  ],
  exports: [
    StartComponent,    
  ]
})
export class HomeModule { }