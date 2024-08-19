import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { DialogCrudComponent } from './dialog-crud/dialog-crud.component';

import { CrudService } from './crud.service';


@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.scss'
})
export class CrudComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nombre', 'fecha', 'archivo', 'acciones'];
  dataSource: any;  

  submitted: boolean = false;
  archivo?: File | any = null;

  form = new FormGroup({
    nombre: new FormControl({value: "", disabled: false}, Validators.required),
    fecha: new FormControl({value: "", disabled: false}, Validators.required),
    archivo: new FormControl({value: "", disabled: false}, Validators.required),
  });

  constructor(private router:Router, private service:CrudService, public dialog: MatDialog){}

  ngOnInit(): void {
    this.getList();    
  }

  get f() { 
    return this.form.controls; 
  }

  onSubmit(){    
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }     
    this.service.create(this.form.value, this.archivo).subscribe({
      next: (result) => {        
        this.form.reset();
        this.submitted = false;
        this.getList();    
      }
    });
  }

  onChangeArchivo(event: any) {
    this.archivo = event.target.files[0];     
  }

  deleteProject(id: number){
    this.service.destroy(id).subscribe({
      next: (result) => {        
        this.getList();  
      }
    });    
  }

  editProject(value: any){
    const dialogo = this.dialog.open(DialogCrudComponent, {         
      width: '500px',        
      data: {data: value},
    });
    dialogo.afterClosed().subscribe(result => {
      this.getList();      
    });
  }

  getList(){
    this.service.list().subscribe({
      next: (result: any) => {         
        this.dataSource = new MatTableDataSource(result);
      }
    });    
  }

  applyFilter(event:any){
    const filterValue = (event.target as HTMLInputElement).value;     
    this.dataSource.filter = filterValue.trim().toLowerCase();       
  }
}
