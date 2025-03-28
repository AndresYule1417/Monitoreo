import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountComponent } from './account.component';
import { AdminComponent } from './admin/admin.component';
import { CrudComponent } from './crud/crud.component';
import { ViewProjectComponent } from './crud/view-project/view-project.component';
import { InformationComponent } from './information/information.component';
import { AccountsComponent } from './accounts/accounts.component';
import { NewsComponent } from './news/news.component';
import { OfertaHidricaComponent } from './oferta-hidrica/oferta-hidrica.component';
import { RendimientoHidricoComponent } from './rendimiento-hidrico/rendimiento-hidrico.component';
import { IndiceHidricoComponent } from './indice-hidrico/indice-hidrico.component';
import { IndiceUsoComponent } from './indice-uso/indice-uso.component';

import { roleGuard } from '../../shared/guards/role.guard';

//definicion de rutas hijas dentro de account
const routes: Routes = [
  {
    path: "",
    component: AccountComponent,
    children: [
      {path: '', redirectTo: 'admin', pathMatch: 'full'},
      {path: "admin", component: AdminComponent},
      {path: "crud", component: CrudComponent, canActivate: [roleGuard]},
      {path: "crud/view_project/:id", component: ViewProjectComponent, canActivate: [roleGuard]},
      {path: "information", component: InformationComponent, canActivate: [roleGuard]},
      {path: "accounts", component: AccountsComponent, canActivate: [roleGuard]},
      {path: "news", component: NewsComponent},
      {path: "rendimiento_hidrico", component: RendimientoHidricoComponent},
      {path: "oferta_hidrica", component: OfertaHidricaComponent},
      {path: "indice_hidrico", component: IndiceHidricoComponent},
      {path: "indice_uso", component: IndiceUsoComponent}
    ]
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }