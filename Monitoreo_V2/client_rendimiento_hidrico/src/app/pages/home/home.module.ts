import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {CarouselComponent, CarouselControlComponent, CarouselIndicatorsComponent, CarouselInnerComponent, CarouselItemComponent, ThemeDirective} from '@coreui/angular';

import { HomeRoutingModule } from './home-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { StartComponent } from './start/start.component';
import { RecoverComponent } from './recover/recover.component';

//archivo donde se cargan los modulos creados por el usuario y se importan 
//componentes que se van a utilizar
@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    StartComponent,
    RecoverComponent
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
  ]
})
export class HomeModule { }
