import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms"
import { Router } from '@angular/router';

import { LoginService } from '../login/login.service';
import { AccountsService } from '../../account/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  //declaracion de variables
  submitted: boolean = false;

  flagEye: boolean = false;
  input: any;

  flagEye1: boolean = false;
  input1: any;

  flagPassword: boolean = false;

  //declaracion de formulario
  form = new FormGroup({
    username: new FormControl({value: "", disabled: false}, Validators.required),
    email: new FormControl({value: "", disabled: false}, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password: new FormControl({value: "", disabled: false}, [Validators.required, Validators.minLength(6), Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{6,}")]),
    rpassword: new FormControl({value: "", disabled: false}, [Validators.required, Validators.minLength(6), Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{6,}")]),
  })
  
  //invocacion de objetos o variables a utilizar
  constructor(private elementRef:ElementRef, private router:Router, private service: LoginService, private accountsService: AccountsService){}

  //funcion q se ejecuta despues del constructor
  //obtiene variables de html
  //valida si esta logeado
  ngOnInit(): void {
    this.input = this.elementRef.nativeElement.querySelector('#input'); 
    this.input1 = this.elementRef.nativeElement.querySelector('#input1'); 
    this.service.checkToken().subscribe({      
      next: (result)=>{
        this.router.navigate(['/account']);
        return false;
      }
    });
  }

  //funcion que retorna datos del formulario
  get f() {     
    return this.form.controls; 
  }

  //funcion que se ejecuta con el boton html del formulario
  onSubmit(){
    this.submitted = true;    
    this.flagPassword = false;

    //si formulario es invalido no pasa
    if (this.form.invalid) {      
      return;
    }  
    
    //si las contraseñas son diferentes no pasa
    if(this.form.value["password"] != this.form.value["rpassword"]){
      this.flagPassword = true;      
      return;
    }      

    //llamado a funcion create del servicio, crea un nuevo usuario    
    this.accountsService.create(this.form.value).subscribe({
      next: (result) => {          
        this.router.navigate(['/home']);    
      }
    });
  }

  //cambio de icono en la caja de texto de password
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

  onKeyPassword(event: any){
    this.flagPassword = false;
  }

}
