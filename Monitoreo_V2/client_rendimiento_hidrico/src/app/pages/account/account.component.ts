import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { fromEvent, Observable, Subscription } from "rxjs";

import { LoginService } from '../home/login/login.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit {

  @ViewChild('sidebarToggle', { static: false }) sidebarToggle!: ElementRef;

  resizeObservable!: Observable<Event>;
  resizeSubscription!: Subscription;

  onSidebar: any;
  onMainContent: any;

  myWidth: number = 0;

  flagExpanded: boolean = false;

  constructor(private service:LoginService){}

  ngOnInit(): void {
    this.resizeObservable = fromEvent(window, 'resize')
    this.resizeSubscription = this.resizeObservable.subscribe( evt => {
      this.checkScreenSize();
    });

    this.checkScreenSize();      
  }

  checkScreenSize(){
    this.myWidth = window.innerWidth;    
    if(this.myWidth>768){
      this.flagExpanded = false;
      this.onSidebar = "sidebar";  
      this.onMainContent = "main-content";  
    }
  }  
  
  onHover_li(){    
    this.onSidebar = "sidebar-expanded";
    this.onMainContent = "main-content-expanded";
  }

  onHoverOut_li(){
    this.onSidebar = "sidebar";
    this.onMainContent = "main-content";
  }

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

  logout(){
    this.service.logout();
  }
}
