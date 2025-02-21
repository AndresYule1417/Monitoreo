import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms"
import { Router } from '@angular/router';

import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit  {

  //declaracion de variables
  flagEye: boolean = false;

  submitted: boolean = false;

  input: any;

  //declaracion de formulario
  form = new FormGroup({
    email: new FormControl({value: "", disabled: false}, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password: new FormControl({value: "", disabled: false}, Validators.required),
  })

  //invoca objetos o variables a utilizar
  constructor(private router: Router, private elementRef:ElementRef, private service:LoginService){}

  //funcion que se ejecuta despues del constructor
  ngOnInit(): void {
    this.input = this.elementRef.nativeElement.querySelector('#input');//obtiene un elemento de html
    //funcion que se llama para validar el token
    this.service.checkToken().subscribe({      
      next: (result)=>{
        this.router.navigate(['/account']);
        return false;
      }
    });
  }

  //funcion que retorna datos de un formulario
  get f() {     
    return this.form.controls; 
  }

  //funcion que se ejecuta al dar aceptar en el boton del formulario
  //si los datos no son validos no se ejecuta el servicio de login
  onSubmit(){    
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }  
    //si los datos son correctos y estan en base de datos lo redirige a la pagina de account   
    this.service.login(this.form.value).subscribe({
      next: (result) => {
        console.log(result);
        this.router.navigate(['/account']); 
      }
    });
  }

  //funciones para cambiar el icono de password
  onPassword(){    
    this.input.type = "text";
    this.flagEye = !this.flagEye;
  }

  onText(){    
    this.input.type = "password";
    this.flagEye = !this.flagEye;
  }

}
