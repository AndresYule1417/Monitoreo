import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { fromEvent, Observable, Subscription } from "rxjs";

import { LoginService } from '../home/login/login.service';

@Component({
  selector: 'app-account',  
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit {

  //definicion de variables u objetos a utilizar
  @ViewChild('sidebarToggle', { static: false }) sidebarToggle!: ElementRef;

  resizeObservable!: Observable<Event>;
  resizeSubscription!: Subscription;

  onSidebar: any;
  onMainContent: any;

  myWidth: number = 0;

  flagExpanded: boolean = false;

  is_superuser = (JSON.parse(localStorage.getItem('user') || '{}').user).is_superuser; 

  //invocacion de servicio
  constructor(private service:LoginService){}

  //funcion que se ejecuta despues del constructor
  //si detecta cambios en el tamaño de la pantalla llama a una funcion
  ngOnInit(): void {    
    this.resizeObservable = fromEvent(window, 'resize')
    this.resizeSubscription = this.resizeObservable.subscribe( evt => {
      this.checkScreenSize();
    });

    this.checkScreenSize();      
  }

  //funcion que pregunta si la pantalla es mayor a 768 
  //reduce el tamaño de la barra izquierda
  checkScreenSize(){
    this.myWidth = window.innerWidth;    
    if(this.myWidth>768){
      this.flagExpanded = false;
      this.onSidebar = "sidebar";  
      this.onMainContent = "main-content";  
    }
  }  
  
  //funcion que detecta que el mouse este encima de sidebar y expande el contenido
  onHover_li(){    
    this.onSidebar = "sidebar-expanded";
    this.onMainContent = "main-content-expanded";
  }

  //funcion que detecta que el mouse este fuera de sidebar y vuelve al origen el contenido
  onHoverOut_li(){
    this.onSidebar = "sidebar";
    this.onMainContent = "main-content";
  }

  //funcion que expande y reduce sidebar dependiendo del tamaño de la pantalla
  onClick(){    
    this.flagExpanded = !this.flagExpanded;
    if(this.flagExpanded){
      this.onSidebar = "sidebar-expanded";  
      this.onMainContent = "main-content-expanded";  
    }else{
      this.onSidebar = "sidebar";  
      this.onMainContent = "main-content";  
    }    
  }

  //funcion para salir de la cuenta principal
  logout(){
    this.service.logout();
  }
}