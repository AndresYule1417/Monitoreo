import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms"
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AccountsService } from '../accounts.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-account',
  templateUrl: './dialog-account.component.html',
  styleUrl: './dialog-account.component.scss'
})
export class DialogAccountComponent implements OnInit {

  flagEye: boolean = false;
  input: any;

  flagEye1: boolean = false;
  input1: any;

  flagPassword: boolean = false;

  submitted: boolean = false;

  form = new FormGroup({
    username: new FormControl({value: "", disabled: false}, Validators.required),
    email: new FormControl({value: "", disabled: false}, Validators.required),
    password: new FormControl({value: "", disabled: false}, Validators.required),
    rpassword: new FormControl({value: "", disabled: false}, Validators.required),
  })

  constructor(private service:AccountsService, private elementRef:ElementRef, public dialogRef: MatDialogRef<DialogAccountComponent>, @Inject(MAT_DIALOG_DATA) public data: {data:any}){}

  ngOnInit(): void {
    this.input = this.elementRef.nativeElement.querySelector('#input'); 
    this.input1 = this.elementRef.nativeElement.querySelector('#input1'); 

    this.form.controls["username"].setValue(this.data.data.username);
    this.form.controls["email"].setValue(this.data.data.email);    
  }

  get f() { 
    return this.form.controls; 
  }

  onSubmit(){        
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }     

    this.flagPassword = false;
    if(this.form.value["password"] != this.form.value["rpassword"]){
      this.flagPassword = true;
      return;
    }       

    this.service.update(this.data.data.id, this.form.value).subscribe({
      next: (result) => {        
        this.dialogRef.close();  
      },
      error: (e) => {     
        var msj = "";   
        console.log(e.error.error);
        if(e.error.error.username){
          msj = "Nombre de usuario ocupado,";
        }
        if(e.error.error.email){
          msj = msj + " Correo electronico ocupado";
        }
        this.ShowSweetAlert("error", "ERROR", msj);
      }
    });
  }

  closeDialog(){
    this.dialogRef.close();
  }

  onPassword(){    
    this.input.type = "text";
    this.flagEye = !this.flagEye;
  }

  onText(){    
    this.input.type = "password";
    this.flagEye = !this.flagEye;
  }

  onPassword1(){    
    this.input1.type = "text";
    this.flagEye1 = !this.flagEye1;
  }

  onText1(){    
    this.input1.type = "password";
    this.flagEye1 = !this.flagEye1;
  }

  ShowSweetAlert(myIcon:any, myTitle:any, myText:any){
    Swal.fire({
      icon: myIcon,
      title: myTitle,
      text: myText,     
      confirmButtonText: 'Aceptar', 
      showConfirmButton: true,
    });
  }

}
