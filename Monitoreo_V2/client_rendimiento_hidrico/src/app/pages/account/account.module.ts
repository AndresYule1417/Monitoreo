import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';

import { AccountRoutingModule } from './account-routing.module';
import { AdminComponent } from './admin/admin.component';
import { CrudComponent } from './crud/crud.component';
import { DialogCrudComponent } from './crud/dialog-crud/dialog-crud.component';
import { ViewProjectComponent } from './crud/view-project/view-project.component';
import { InformationComponent } from './information/information.component';
import { AccountsComponent } from './accounts/accounts.component';
import { DialogAccountComponent } from './accounts/dialog-account/dialog-account.component';
import { NewsComponent } from './news/news.component';

//declaracion de componentes creados por el usuario
//importacion de modulos a utilizar
@NgModule({
  declarations: [
    AdminComponent,
    CrudComponent,
    DialogCrudComponent,
    ViewProjectComponent,
    InformationComponent,
    AccountsComponent,
    DialogAccountComponent,
    NewsComponent,
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatTableModule,   
  ]
})
export class AccountModule { }
