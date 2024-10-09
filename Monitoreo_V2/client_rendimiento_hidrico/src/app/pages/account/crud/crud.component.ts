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

  //declaracion de variables para renderizar tablas html
  displayedColumns: string[] = ['id', 'nombre', 'fecha', 'archivo', 'acciones'];
  dataSource: any;  

  submitted: boolean = false;
  archivo?: File | any = null;

  //declaracion de formulario para enviar datos
  form = new FormGroup({
    nombre: new FormControl({value: "", disabled: false}, Validators.required),
    fecha: new FormControl({value: "", disabled: false}, Validators.required),
    archivo: new FormControl({value: "", disabled: false}, Validators.required),
  });

  //inizializacion de clases
  constructor(private router:Router, private service:CrudService, public dialog: MatDialog){}

  //al inicializar el componente se obtiene la lista de todos los proyectos
  ngOnInit(): void {
    this.getList();    
  }

  //retorna errores presente en la entrada del formulario
  get f() { 
    return this.form.controls; 
  }

  //captura los datos del formulario
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

  //carga el archivo excel
  onChangeArchivo(event: any) {
    this.archivo = event.target.files[0];     
  }

  //elimina un proyecto
  deleteProject(id: number){
    this.service.destroy(id).subscribe({
      next: (result) => {        
        this.getList();  
      }
    });    
  }
  
  //edita un proyecto
  editProject(value: any){
    const dialogo = this.dialog.open(DialogCrudComponent, {         
      width: '500px',        
      data: {data: value},
    });
    dialogo.afterClosed().subscribe(result => {
      this.getList();      
    });
  }

  //obtiene todos los proyectos
  getList(){
    this.service.list().subscribe({
      next: (result: any) => {         
        this.dataSource = new MatTableDataSource(result);
      }
    });    
  }

  //filtra datos en tabla
  applyFilter(event:any){
    const filterValue = (event.target as HTMLInputElement).value;     
    this.dataSource.filter = filterValue.trim().toLowerCase();       
  }
}
