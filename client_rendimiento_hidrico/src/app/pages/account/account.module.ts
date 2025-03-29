import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatTabsModule } from '@angular/material/tabs';

import { AccountRoutingModule } from './account-routing.module';
import { AccountsComponent } from './accounts/accounts.component';
import { DialogAccountComponent } from './accounts/dialog-account/dialog-account.component';
import { AdminComponent } from './admin/admin.component';
import { CrudComponent } from './crud/crud.component';
import { DialogCrudComponent } from './crud/dialog-crud/dialog-crud.component';
import { ViewProjectComponent } from './crud/view-project/view-project.component';
import { InformationComponent } from './information/information.component';
import { NewsComponent } from './news/news.component';
import { OfertaHidricaComponent } from './oferta-hidrica/oferta-hidrica.component';
import { RendimientoHidricoComponent } from './rendimiento-hidrico/rendimiento-hidrico.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { IndiceHidricoComponent } from './indice-hidrico/indice-hidrico.component';
import { IndiceUsoComponent } from './indice-uso/indice-uso.component';

import { HomeModule } from '../home/home.module'; 

//declaracion de componentes creados por el usuario
//importacion de modulos a utilizar
@NgModule({
  declarations: [  
    AccountsComponent,
    DialogAccountComponent,
    AdminComponent,
    CrudComponent,
    DialogCrudComponent,
    ViewProjectComponent,
    InformationComponent,
    NewsComponent,
    OfertaHidricaComponent,
    RendimientoHidricoComponent,
    IndiceHidricoComponent,  
    IndiceUsoComponent,     
  ],  
  imports: [
    CommonModule,
    AccountRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatTableModule,   
    GoogleMapsModule,
    MatTabsModule,    
    NgxSpinnerModule,    
    HomeModule
  ]
  
})
export class AccountModule { }
