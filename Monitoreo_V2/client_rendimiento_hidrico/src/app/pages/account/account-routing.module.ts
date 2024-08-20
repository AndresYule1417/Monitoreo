import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountComponent } from './account.component';
import { AdminComponent } from './admin/admin.component';
import { CrudComponent } from './crud/crud.component';
import { ViewProjectComponent } from './crud/view-project/view-project.component';
import { InformationComponent } from './information/information.component';
import { AccountsComponent } from './accounts/accounts.component';
import { NewsComponent } from './news/news.component';

const routes: Routes = [
  {
    path: "",
    component: AccountComponent,
    children: [
      {path: '', redirectTo: 'admin', pathMatch: 'full'},
      {path: "admin", component: AdminComponent},
      {path: "crud", component: CrudComponent},
      {path: "crud/view_project/:id", component: ViewProjectComponent},
      {path: "information", component: InformationComponent},
      {path: "accounts", component: AccountsComponent},
      {path: "news", component: NewsComponent}
    ]
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
