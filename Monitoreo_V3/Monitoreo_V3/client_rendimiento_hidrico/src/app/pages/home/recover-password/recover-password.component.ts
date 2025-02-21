//importacion de librerias
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from '@angular/router';

//importacion de libreria para alertas
import Swal from 'sweetalert2';

import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.scss'
})
export class RecoverPasswordComponent implements OnInit{

  //declaracion de variables
  submitted: boolean = false;

  id:string | null = "";
  token:string | null = "";

  flagPassword: boolean = false;

  //declaracion de formulario
  form = new FormGroup({
    password: new FormControl({value: "", disabled: false}, [Validators.required, Validators.minLength(6), Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{6,}")]),      
    confirmPassword: new FormControl({value: "", disabled: false}, [Validators.required, Validators.minLength(6), Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{6,}")]),
  });  

  //inicializacion de contructor con servicios
  constructor(private activatedRoute:ActivatedRoute, private logiServ:LoginService, private router: Router){}

  //funcion que se inicializa al cargar el componente, obtiene de la url los parametros
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.token = this.activatedRoute.snapshot.paramMap.get('token');    
  }

  //funcion que se ejecuta al validar el formulario
  onSubmit(){
    this.submitted = true;
    this.flagPassword = false;

    if (this.form.invalid) {
      return;
    }  

    //si las contraseñas son diferentes no pasa
    if(this.form.value["password"] != this.form.value["confirmPassword"]){
      this.flagPassword = true;      
      return;
    }      

    var data = {"id":this.id, "token":this.token, "password":this.form.value['password']};    

    //funcion que se ejecuta para enviar datos y actualizar la contraseña
    this.logiServ.updatePassword(data).subscribe({
      next: (result:any) => {
        if(result.success){
          this.ShowSweetAlert("success", "Contraseña Actualizada", "")   
          this.router.navigate(['/home/login']);       
        }        
      },error: (e) => {
        console.log(e);
        this.ShowSweetAlert("error", "Contraseña No Actualizada", "")
      }
    });
  }

  //funcion que retorna datos de un formulario
  get f() {     
    return this.form.controls; 
  }

  onKeyPassword(event: any){
    this.flagPassword = false;
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