//importacion de librerias
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { DialogAccountComponent } from './dialog-account/dialog-account.component';

import { AccountsService } from './accounts.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss'
})
export class AccountsComponent implements OnInit{

  //declaracion de variables para tabla
  displayedColumns: string[] = ['id', 'username', 'email', 'acciones'];
  dataSource: any; 

  //invocacion de constructor con sobrenombres para clases
  constructor(private service: AccountsService, public dialog: MatDialog){}

  //funcion que se ejecuta al iniciar el componente
  ngOnInit(): void {
    this.getList();    
  }

  //funcion que abre un cuadro de dialogo para editar un usuario
  edit(value:any){    
    const dialogo = this.dialog.open(DialogAccountComponent, {         
      width: '500px',        
      data: {data: value},
    });
    dialogo.afterClosed().subscribe(result => {
      this.getList();      
    });
  }

  //funcion que elimina un usuario
  delete(id:number){
    this.service.destroy(id).subscribe({
      next: (result) => {
        this.getList();
      }
    });
  }

  //funcion que retorna una lista de usuarios
  getList(){
    this.service.list().subscribe({
      next: (result:any) => {
        this.dataSource = new MatTableDataSource(result);
      }
    });    
  }
}