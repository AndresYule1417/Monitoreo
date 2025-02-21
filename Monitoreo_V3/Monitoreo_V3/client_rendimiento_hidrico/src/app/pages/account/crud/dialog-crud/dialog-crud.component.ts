//importacion de librerias
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms"
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

import { CrudService } from '../crud.service';

@Component({
  selector: 'app-dialog-crud',
  templateUrl: './dialog-crud.component.html',
  styleUrl: './dialog-crud.component.scss',
  providers: [DatePipe]
})
export class DialogCrudComponent implements OnInit {

  flagExcel: boolean = false;

  //declaracion de variables
  submitted: boolean = false;
  archivo?: File | any = null;
  archivoGeo?: File | any = null;

  //declaracion de formulario
  form = new FormGroup({
    nombre: new FormControl({value: "", disabled: false}, Validators.required),
    fecha: new FormControl({value: "", disabled: false}, Validators.required),
    archivo: new FormControl({value: "", disabled: false}),
    archivo_geo: new FormControl({value: "", disabled: false}),//adicion de codigo
  })

  //invocacion de constructor para utilizar servicios
  constructor(public dialogRef: MatDialogRef<DialogCrudComponent>, private service:CrudService, private datePipe:DatePipe, @Inject(MAT_DIALOG_DATA) public data: {data:any}){}

  //funcion automatica q se ejecuta al iniciar el componente
  ngOnInit(): void {
    this.form.controls["nombre"].setValue(this.data.data.nombre);
    this.form.controls["fecha"].setValue(this.datePipe.transform(this.data.data.fecha, 'yyyy-MM-ddTHH:mm'));
  }

  //funcion que retorna errores invalidos en el formulario
  get f() { 
    return this.form.controls; 
  }

  //funcion que actualiza un proyecto, verifica si el formulario es valido
  onSubmit(){        
    this.submitted = true;
    console.log(this.flagExcel);
    if (this.form.invalid || this.flagExcel==true) {
      return;
    }       
    this.service.update(this.data.data.id, this.form.value, this.archivo!, this.archivoGeo!).subscribe({//adicion de codigo
      next: (result => {        
        this.dialogRef.close();  
      })
    });
  }

  //funcion que carga un archivo
  onChangeArchivo(event: any) {
    this.flagExcel = false;
    try{//adicion de codigo
      this.archivo = event.target.files[0];         
      if(this.archivo.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
        this.archivo = "";
        this.form.controls['archivo'].setValue("");
        this.flagExcel = true;
      }  
    }catch(error){
      this.archivo = "";
      this.form.controls["archivo"].setValue("");     
    }
    
  }

  //funcion que carga un archivo geojson
  onChangeArchivoGeo(event: any) { //adicion de codigo
    this.archivoGeo = event.target.files[0];     
  }

  //funcion q cierra el cuadro de dialogo
  closeDialog(){
    this.dialogRef.close();
  }
}
