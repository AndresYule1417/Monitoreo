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

  submitted: boolean = false;
  archivo?: File | any = null;

  form = new FormGroup({
    nombre: new FormControl({value: "", disabled: false}, Validators.required),
    fecha: new FormControl({value: "", disabled: false}, Validators.required),
    archivo: new FormControl({value: "", disabled: false}),
  })

  constructor(public dialogRef: MatDialogRef<DialogCrudComponent>, private service:CrudService, private datePipe:DatePipe, @Inject(MAT_DIALOG_DATA) public data: {data:any}){}

  ngOnInit(): void {
    this.form.controls["nombre"].setValue(this.data.data.nombre);
    this.form.controls["fecha"].setValue(this.datePipe.transform(this.data.data.fecha, 'yyyy-MM-ddTHH:mm'));
  }

  get f() { 
    return this.form.controls; 
  }

  onSubmit(){        
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }       
    this.service.update(this.data.data.id, this.form.value, this.archivo!).subscribe({
      next: (result => {        
        this.dialogRef.close();  
      })
    });
  }

  onChangeArchivo(event: any) {
    this.archivo = event.target.files[0];     
  }

  closeDialog(){
    this.dialogRef.close();
  }

}
