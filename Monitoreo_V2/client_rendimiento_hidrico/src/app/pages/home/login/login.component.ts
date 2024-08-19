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

  flagEye: boolean = false;

  submitted: boolean = false;

  input: any;

  form = new FormGroup({
    email: new FormControl({value: "", disabled: false}, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password: new FormControl({value: "", disabled: false}, Validators.required),
  })

  constructor(private router: Router, private elementRef:ElementRef, private service:LoginService){}

  ngOnInit(): void {
    this.input = this.elementRef.nativeElement.querySelector('#input'); 
    this.service.checkToken().subscribe(result => {      
      this.router.navigate(['/account']);
      return false;
    });
  }

  get f() {     
    return this.form.controls; 
  }

  onSubmit(){    
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }     
    this.service.login(this.form.value).subscribe({
      next: (result) => {
        this.router.navigate(['/account']); 
      }
    });
  }

  onPassword(){    
    this.input.type = "text";
    this.flagEye = !this.flagEye;
  }

  onText(){    
    this.input.type = "password";
    this.flagEye = !this.flagEye;
  }

}

