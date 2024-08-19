import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Chart, registerables } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation';
Chart.register(...registerables)
Chart.register(annotationPlugin);

import { CrudService } from '../crud.service';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrl: './view-project.component.scss'
})
export class ViewProjectComponent implements OnInit, AfterViewInit {

  data: any = {
    id: "",
    nombre: "",
    fecha: "",
    archivo: ""
  }; 

  space: any;
  
  constructor(private elementRef:ElementRef, private service:CrudService, private activatedRoute:ActivatedRoute){}

  ngAfterViewInit(): void {
    /*this.space = this.elementRef.nativeElement.querySelector('#space');    
    const id = this.activatedRoute.snapshot.paramMap.get('id');      
    this.getProject(id!);*/         
  }

  ngOnInit(): void {
    this.space = this.elementRef.nativeElement.querySelector('#space');    
    const id = this.activatedRoute.snapshot.paramMap.get('id');      
    this.getProject(id!);   
  }

  async getProject(id:string){
    const prueba = await this.service.retrieve(id);    
    prueba.subscribe({
      next: (result:any) => {       
        this.data = result.project;

        for(let i=0; i<result.xlsx.rhah.columns.length; i++) {
          result.xlsx.rhah.columns[i] =   result.xlsx.rhah.columns[i].substring(0, 3);
        }

        for(let i=0; i<result.xlsx.rhas.columns.length; i++) {
          result.xlsx.rhas.columns[i] =  result.xlsx.rhas.columns[i].substring(0, 3);
        }  

        for(var i=0; i<result.xlsx.rham.data.length; i++){
          const myButton = document.createElement("button");
          myButton.setAttribute("class", "accordion");
          myButton.classList.add("active");
          myButton.style.backgroundColor = "#ccc";
          myButton.style.padding = "16px";
          myButton.style.width = "100%";
          myButton.style.border = "none";
          myButton.style.textAlign = "left";
          myButton.style.fontSize = "15px";
          myButton.style.marginBottom = "8px";
          myButton.style.marginTop = "8px";
          myButton.textContent =  (i+1) + "." + " " + result.xlsx.rham.index[i].replaceAll("_", " ");                    
          this.space.appendChild(myButton); 

          const spaceDiv = document.createElement("div");
          spaceDiv.setAttribute("id", "spaceDiv_" + i);          
          spaceDiv.style.display = "flex";         
          spaceDiv.style.gap = "32px";
          spaceDiv.style.flexWrap = "wrap"; 
          spaceDiv.style.justifyContent = "center";                                            
          this.space.appendChild(spaceDiv);  
          
          const area = document.getElementById("spaceDiv_" + i);
          
          const divWidth = '330px';
          const divHeight = '320px';

          const myDiv1 = document.createElement("div");                                       
          myDiv1.style.width = divWidth;
          myDiv1.style.height = divHeight;          
          myDiv1.style.display = "flex";                       
          area!.appendChild(myDiv1); 
          const myDiv1Child1 = document.createElement("div");
          myDiv1Child1.style.width = "13%";                   
          myDiv1Child1.innerHTML = "<p style='position:relative; writing-mode:tb-rl; transform:rotate(-180deg); top:25%;'>Rendimiento l/s/km<sup>2</sup></p>";
          const myDiv1Child2 = document.createElement("div");  
          myDiv1Child2.style.width = "87%";                    
          myDiv1.appendChild(myDiv1Child1);
          myDiv1.appendChild(myDiv1Child2);  
          
          const myDiv2 = document.createElement("div");                    
          myDiv2.style.width = divWidth;
          myDiv2.style.height = divHeight;         
          myDiv2.style.display = "flex";                    
          area!.appendChild(myDiv2);
          const myDiv2Child1 = document.createElement("div");
          myDiv2Child1.style.width = "13%";                   
          myDiv2Child1.innerHTML = "<p style='position:relative; writing-mode:tb-rl; transform:rotate(-180deg); top:25%;'>Rendimiento l/s/km<sup>2</sup></p>";
          const myDiv2Child2 = document.createElement("div");  
          myDiv2Child2.style.width = "87%";                    
          myDiv2.appendChild(myDiv2Child1);
          myDiv2.appendChild(myDiv2Child2); 

          const myDiv3 = document.createElement("div");                    
          myDiv3.style.width = divWidth;
          myDiv3.style.height = divHeight;          
          myDiv3.style.display = "flex";                    
          area!.appendChild(myDiv3);
          const myDiv3Child1 = document.createElement("div");
          myDiv3Child1.style.width = "13%";                   
          myDiv3Child1.innerHTML = "<p style='position:relative; writing-mode:tb-rl; transform:rotate(-180deg); top:25%;'>Rendimiento l/s/km<sup>2</sup></p>";
          const myDiv3Child2 = document.createElement("div");  
          myDiv3Child2.style.width = "87%";                    
          myDiv3.appendChild(myDiv3Child1);
          myDiv3.appendChild(myDiv3Child2); 

          const canvas1 = document.createElement("canvas");
          canvas1.setAttribute("id", "rham_"+i);           
          canvas1.style.width = "300px"                                    
          myDiv1Child2.appendChild(canvas1)
          var categorias = result.xlsx.rham.columns; 
          var valores = result.xlsx.rham.data[i]; 
          var promedio = valores.reduce((acc:any, curr:any) => acc + curr, 0) / valores.length;
          this.renderBar(categorias, valores, promedio, "rham_" + i, 'Rendimiento Hídrico Mensual Año Medio');    

          const canvas2 = document.createElement("canvas");
          canvas2.setAttribute("id", "rhah_"+i);                    
          myDiv2Child2.appendChild(canvas2)
          categorias = result.xlsx.rhah.columns;
          valores = result.xlsx.rhah.data[i]; 
          promedio = valores.reduce((acc:any, curr:any) => acc + curr, 0) / valores.length;
          this.renderBar(categorias, valores, promedio, "rhah_" + i, 'Rendimiento Hídrico Mensual Año Humedo');

          const canvas3 = document.createElement("canvas");
          canvas3.setAttribute("id", "rhas_"+i);                    
          myDiv3Child2.appendChild(canvas3)
          categorias = result.xlsx.rhas.columns; 
          valores = result.xlsx.rhas.data[i]; 
          promedio = valores.reduce((acc:any, curr:any) => acc + curr, 0) / valores.length;
          this.renderBar(categorias, valores, promedio, "rhas_" + i, 'Rendimiento Hídrico Mensual Año Seco');
        }  
        
        var acc = document.getElementsByClassName("accordion");
        for (var i=0; i<acc.length; i++) {
          acc[i].addEventListener("click", function(item:any) {
            item.target.classList.toggle("active");             
            if(item.target.classList[1] == "active"){
              item.target.style.backgroundColor = "#CCC";              
            }else{
              item.target.style.backgroundColor = "#F0F0F0";              
            }                  
            var panel = item.target.nextElementSibling;                        
            if (panel.style.display === "flex") {
              panel.style.display = "none";
            } else {
              panel.style.display = "flex";
              panel.style.gap = "32px";
              panel.style.flexWrap = "wrap";                           
            }
          });

          /*acc[i].addEventListener('mouseover', (item:any) => {    
            item.target.style.backgroundColor = '#F0F0F0';            
          });        
          
          acc[i].addEventListener('mouseout', (item:any) => {   
            item.target.style.backgroundColor = '#CCC';           
          });*/
        }
      }
    });
  }

  renderBar(categorias:any, valores:any, promedio:any, id:any, titulo:any){
    const backgroundColors = valores.map((value:any) => this.getBackgroundColor(value));  
    const canvas = <HTMLCanvasElement> document.getElementById(id);
    const ctx = canvas.getContext('2d');
    const waterLevelChart = new Chart(ctx!, {
      type: 'bar',
      data: {
          labels: categorias,
          datasets: [{
              label: titulo,
              data: valores,
              backgroundColor: backgroundColors,
              borderColor: backgroundColors,
              borderWidth: 2,              
          }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,                                             
            },
            x: {
                ticks: {                            
                    minRotation: 90,
                }
            },                    
        },         
        plugins: {
            annotation: {
                annotations: [{
                    type: 'line',                    
                    scaleID: 'y',
                    value: promedio,
                    borderColor: '#ABB2B9',
                    borderWidth: 2,
                    label: {
                        content: `RH Anual: ${promedio.toFixed(2)}`,
                        display: true,                        
                        position: 'start',                                
                        backgroundColor: 'rgba(255, 99, 132, 0.8)',
                        font: {
                            size: 12
                        }
                    }
                }]
            }
        }        
      }        
    });
  }

  getBackgroundColor(value:any){
    if (value <= 3) {
        return 'rgba(255, 0, 0)'; 
    } else if (value<=6 && value>3) {
        return 'rgba(255, 80, 0)'; 
    } else if (value<=10 && value>6) {
        return 'rgba(255, 120, 0)'; 
    }else if (value<=15 && value>10) {
        return 'rgba(255, 180, 0)'; 
    }else if (value<=20 && value>15) {
        return 'rgba(255, 205, 0)'; 
    }else if (value<=30 && value>20) {
        return 'rgba(255, 255, 0)'; 
    }else if (value<=40 && value>30) {
        return 'rgba(255, 255, 150)'; 
    }else if (value<=50 && value>40) {
        return 'rgba(160, 255, 115)'; 
    }else if (value<=70 && value>50) {
        return 'rgba(75, 230, 0)'; 
    }else if (value<=100 && value>70) {
        return 'rgba(0, 135, 50)'; 
    }else if (value<=150 && value>100) {
        return 'rgba(115, 180, 255)'; 
    }else if (value<=200 && value>150) {
        return 'rgba(0, 90, 230)'; 
    }else {
        return 'rgba(0, 40, 115)'; 
    }
  };


}
