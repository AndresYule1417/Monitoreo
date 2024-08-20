import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss'
})
export class StartComponent implements OnInit {
  
  slides = [
    { image: 'assets/img/carrulcl-monit-hidr.jpg', alt: 'First slide' },
    { image: 'assets/img/carrucl-segui-calid-agua.jpg', alt: 'Second slide' },
    { image: 'assets/img/carrucl-evalu-recur-hidr.jpg', alt: 'Third slide' }
  ];

  constructor(private elementRef:ElementRef, private service:LoginService, private router:Router){}

  ngOnInit(): void {     
    this.service.checkToken().subscribe(result => {      
      this.router.navigate(['/account']);
      return false;
    });
    
    const images = this.elementRef.nativeElement.querySelectorAll('.img-fluid');
    images.forEach((img:any) => {
      img.addEventListener('mousemove', (event:any) => {          
          const { left, top, width, height } = img.getBoundingClientRect();
          const x = (event.clientX - left) / width;
          const y = (event.clientY - top) / height;
          
          const tiltX = (y - 0.5) * 20; // Ajusta el 20 para más o menos inclinación
          const tiltY = (x - 0.5) * -20; // Ajusta el -20 para más o menos inclinación
          
          img.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.05, 1.05, 1.05)`;          
      });
      
      img.addEventListener('mouseleave', function() {
          img.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      });
    });
  }

  jumpToSection(section: string | null) {
    if(section){
      document.getElementById(section)?.scrollIntoView({behavior:'smooth'});
    }      
  }  

}
