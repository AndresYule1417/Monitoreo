//importacion de librerias
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms"
import { Router } from '@angular/router';

//importacion de libreria para alertas
import Swal from 'sweetalert2';

import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrl: './recover.component.scss'
})
export class RecoverComponent implements OnInit {

  //declaracion de variable para errores en formulario
  submitted: boolean = false;

  //declaracion de formulario
  form = new FormGroup({
    email: new FormControl({value: "", disabled: false}, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),      
  })

  //inicializacion de constructor con servicios a utilizar
  constructor(private logiServ:LoginService, private router:Router){}

  ngOnInit(): void {
    
  }

  //funcion para validar datos del formulario
  onSubmit(){
    this.submitted = true;
    //si formulario es invalido sale de la funcion
    if (this.form.invalid) {
      return;
    }  

    //funcion que envia emial para recuperar contraseña
    this.logiServ.resetPassword(this.form.value).subscribe({
      next: (result:any) => {
        console.log(result);
        if(result.success){
          this.ShowSweetAlert("success", "Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña.", "");
          this.router.navigate(['/home/login']);     
        }else{
          this.ShowSweetAlert("error", "Error en envio de mensaje a correo electronico", "");
        }        
      }, error: (e) => {
        console.log(e);
        this.ShowSweetAlert("error", "Error en envio de mensaje a correo electronico", "");
      }
    });

  }

  //funcion que retorna datos de un formulario
  get f() {     
    return this.form.controls; 
  }

  //funcion que despliega un dialogo de alertas
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
