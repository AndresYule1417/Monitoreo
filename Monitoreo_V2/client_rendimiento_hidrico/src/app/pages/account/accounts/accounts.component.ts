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

  displayedColumns: string[] = ['id', 'username', 'email', 'acciones'];
  dataSource: any; 

  constructor(private service: AccountsService, public dialog: MatDialog){}

  ngOnInit(): void {
    this.getList();    
  }

  edit(value:any){    
    const dialogo = this.dialog.open(DialogAccountComponent, {         
      width: '500px',        
      data: {data: value},
    });
    dialogo.afterClosed().subscribe(result => {
      this.getList();      
    });
  }

  delete(id:number){
    this.service.destroy(id).subscribe({
      next: (result) => {
        this.getList();
      }
    });
  }

  getList(){
    this.service.list().subscribe({
      next: (result:any) => {
        this.dataSource = new MatTableDataSource(result);
      }
    });    
  }

}
