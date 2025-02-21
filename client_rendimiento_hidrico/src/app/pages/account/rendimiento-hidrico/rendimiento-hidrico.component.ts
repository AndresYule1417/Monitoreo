import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";

import jspdf from 'jspdf';
import html2canvas from 'html2canvas'; 

//import de librerias para realizar graficos
import { Chart, registerables } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(...registerables)
Chart.register(annotationPlugin);

import { CrudService } from '../crud/crud.service';

@Component({
  selector: 'app-rendimiento-hidrico',
  templateUrl: './rendimiento-hidrico.component.html',
  styleUrl: './rendimiento-hidrico.component.scss'
})
export class RendimientoHidricoComponent implements OnInit, OnDestroy {  

  listProyectos: any[] = [];

  myTitle: string = "";

  data: any = {
    id: "",
    nombre: "",
    fecha: "",
    archivo: ""
  }; 

  space: any;
  myChart: any;  

  constructor(private service:CrudService, private elementRef:ElementRef, private spinner: NgxSpinnerService){       
  }

  ngOnDestroy(): void {
    console.log("*****ngOnDestroy*****");
  }

  //funcion que se ejecuta al iniciar el componente, carga la lista de los proyectos
  ngOnInit(): void {     
    this.service.listCustom().subscribe({
      next: (result:any) => {  
        console.log(result);
        this.listProyectos = result;        
      }
    });    
  }

  //funcion que realiza el cambio de pestañas
  tabChanged(value:any){     
    document.querySelectorAll(".accordion").forEach(el => el.remove());
    document.querySelectorAll(".row").forEach(el => el.remove());
    document.querySelectorAll(".pdfButton").forEach(el => el.remove());
    
    this.space = this.elementRef.nativeElement.querySelector('.space'+value.index);//se obitiene el selector donde se renderiza el rendimiento hidrico     
    this.getProject(this.listProyectos[value.index].id);
  }

  //funcion que renderiza las graficas
  async getProject(id:string){    
    this.spinner.show();
    const prueba = await this.service.retrieve(id);    
    prueba.subscribe({
      next: (result:any) => {        
        this.data = result.project;        

        for(let i=0; i<result.xlsx.rhah.columns.length; i++) {
            result.xlsx.rhah.columns[i] = result.xlsx.rhah.columns[i].substring(0, 3);
        }

        for(let i=0; i<result.xlsx.rhas.columns.length; i++) {
            result.xlsx.rhas.columns[i] = result.xlsx.rhas.columns[i].substring(0, 3);
        }  

        for(var i=0; i<result.xlsx.rham.data.length; i++){
          const myButton = document.createElement("button");
          myButton.setAttribute("class", "accordion");
          myButton.classList.add("active");                
          myButton.textContent =  (i+1) + "." + " " + result.xlsx.rham.index[i].replaceAll("_", " ");                            
          this.space.appendChild(myButton);

          const spaceDiv = document.createElement("div");
          spaceDiv.setAttribute("id", "spaceDiv"+i);//    
          spaceDiv.setAttribute("class", "row");      
          spaceDiv.style.display = "flex";         
          spaceDiv.style.gap = "32px";
          spaceDiv.style.flexWrap = "wrap"; 
          spaceDiv.style.justifyContent = "center";                                            
          this.space.appendChild(spaceDiv);                 
          
          const divWidth = '330px';
          const divHeight = '320px';

          const myDiv1 = document.createElement("div");                                       
          myDiv1.style.width = divWidth;
          myDiv1.style.height = divHeight;          
          myDiv1.style.display = "flex";                       
          spaceDiv.appendChild(myDiv1); //
          const myDiv1Child1 = document.createElement("div");
          myDiv1Child1.style.width = "13%";                   
          myDiv1Child1.innerHTML = "<p class='rotateText'>Rendimiento(l/s/km)<sup>2</sup></p>";
          const myDiv1Child2 = document.createElement("div");  
          myDiv1Child2.style.width = "87%";                    
          myDiv1.appendChild(myDiv1Child1);
          myDiv1.appendChild(myDiv1Child2);  
          
          const myDiv2 = document.createElement("div");                    
          myDiv2.style.width = divWidth;
          myDiv2.style.height = divHeight;         
          myDiv2.style.display = "flex";                    
          spaceDiv.appendChild(myDiv2);//
          const myDiv2Child1 = document.createElement("div");
          myDiv2Child1.style.width = "13%";                   
          myDiv2Child1.innerHTML = "<p class='rotateText'>Rendimiento(l/s/km)<sup>2</sup></p>";
          const myDiv2Child2 = document.createElement("div");  
          myDiv2Child2.style.width = "87%";                    
          myDiv2.appendChild(myDiv2Child1);
          myDiv2.appendChild(myDiv2Child2); 

          const myDiv3 = document.createElement("div");                    
          myDiv3.style.width = divWidth;
          myDiv3.style.height = divHeight;          
          myDiv3.style.display = "flex";                    
          spaceDiv.appendChild(myDiv3);//
          const myDiv3Child1 = document.createElement("div");
          myDiv3Child1.style.width = "13%";                   
          myDiv3Child1.innerHTML = "<p class='rotateText'>Rendimiento(l/s/km)<sup>2</sup></p>";
          const myDiv3Child2 = document.createElement("div");  
          myDiv3Child2.style.width = "87%";                    
          myDiv3.appendChild(myDiv3Child1);
          myDiv3.appendChild(myDiv3Child2); 

          var canvas1 = document.createElement("canvas");
          canvas1.setAttribute("id", "rham_"+i);           
          canvas1.style.width = "300px"                                    
          myDiv1Child2.appendChild(canvas1)
          var categorias = result.xlsx.rham.columns; 
          var valores = result.xlsx.rham.data[i]; 
          var promedio = valores.reduce((acc:any, curr:any) => acc + curr, 0) / valores.length;
          this.renderBar(categorias, valores, promedio, "rham_" + i, 'Rendimiento Hídrico Mensual Año Medio', 0);

          const canvas2 = document.createElement("canvas");
          canvas2.setAttribute("id", "rhah_"+i);                    
          myDiv2Child2.appendChild(canvas2)
          var categorias = result.xlsx.rhah.columns;
          var valores = result.xlsx.rhah.data[i]; 
          var promedio = valores.reduce((acc:any, curr:any) => acc + curr, 0) / valores.length;
          this.renderBar(categorias, valores, promedio, "rhah_" + i, 'Rendimiento Hídrico Mensual Año Humedo', 0);

          const canvas3 = document.createElement("canvas");
          canvas3.setAttribute("id", "rhas_"+i);                    
          myDiv3Child2.appendChild(canvas3)
          categorias = result.xlsx.rhas.columns; 
          valores = result.xlsx.rhas.data[i]; 
          promedio = valores.reduce((acc:any, curr:any) => acc + curr, 0) / valores.length;
          this.renderBar(categorias, valores, promedio, "rhas_" + i, 'Rendimiento Hídrico Mensual Año Seco', 0);

          /*const pdfButton = document.createElement("button");
          pdfButton.setAttribute("id", "pdfButton"+i);
          pdfButton.setAttribute("class", "pdfButton");
          //pdfButton.style.display = "none";
          pdfButton.style.borderRadius = "4px";
          pdfButton.style.backgroundColor = "#3498db";
          pdfButton.style.borderColor = "#3498db";
          pdfButton.style.color = "white";
          let pdfButtonCont = "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-filetype-pdf' viewBox='0 0 16 16'>";
          pdfButtonCont +=       "<path fill-rule='evenodd' d='M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM1.6 11.85H0v3.999h.791v-1.342h.803q.43 0 .732-.173.305-.175.463-.474a1.4 1.4 0 0 0 .161-.677q0-.375-.158-.677a1.2 1.2 0 0 0-.46-.477q-.3-.18-.732-.179m.545 1.333a.8.8 0 0 1-.085.38.57.57 0 0 1-.238.241.8.8 0 0 1-.375.082H.788V12.48h.66q.327 0 .512.181.185.183.185.522m1.217-1.333v3.999h1.46q.602 0 .998-.237a1.45 1.45 0 0 0 .595-.689q.196-.45.196-1.084 0-.63-.196-1.075a1.43 1.43 0 0 0-.589-.68q-.396-.234-1.005-.234zm.791.645h.563q.371 0 .609.152a.9.9 0 0 1 .354.454q.118.302.118.753a2.3 2.3 0 0 1-.068.592 1.1 1.1 0 0 1-.196.422.8.8 0 0 1-.334.252 1.3 1.3 0 0 1-.483.082h-.563zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638z'/>";
          pdfButtonCont +=    "</svg>";
          pdfButtonCont +=    "Descargar"
          pdfButton.innerHTML = pdfButtonCont; 
          this.space.appendChild(pdfButton);*/

        }  
          
        //funcion que agrega el evento click al boton
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
              
              /*let index = panel.id.substring(8);
              let buttonIndex = document.getElementById("pdfButton"+index);   
              if(buttonIndex!.style.display == "none"){
                buttonIndex!.style.display = "block";
              }else{
                buttonIndex!.style.display = "none";
              }*/
              
              if (panel.style.display === "flex") {
                  panel.style.display = "none";
              } else {
                  panel.style.display = "flex";
                  panel.style.gap = "32px";
                  panel.style.flexWrap = "wrap";                           
              }
          });            
        }

        /*var onPdfButton = document.getElementsByClassName("pdfButton");
        for(var i=0; i<onPdfButton.length; i++){
          onPdfButton[i].addEventListener("click", function(item:any){       
            var panel = item.target.id;
            let index = panel.substring(9);                      
            
            var myContHtml = document.getElementById("spaceDiv"+index);

            html2canvas(myContHtml!, {
              backgroundColor: null,
              useCORS: true
            }).then(canvas => {
              let imgWidth = 208;   
              let pageHeight = 295;    
              let imgHeight = canvas.height * imgWidth / canvas.width;  
              let heightLeft = imgHeight;  
        
              const contentDataURL = canvas.toDataURL('image/png')  
              let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
              let position = 0;  
              pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
              pdf.save('MYPdf.pdf'); // Generated PDF   
            });
          })
        }*/
        this.spinner.hide();
      }
    });
  }

  //funcion para renderizar graficas tipo bar
  renderBar(categorias:any, valores:any, promedio:any, id:any, titulo:any, flag:number){
    var backgroundColors = []
    if(flag==0){
      backgroundColors = valores.map((value:any) => this.getBackgroundColor(value));  
    }else{
      backgroundColors = valores.map((value:any) => this.getBackgroundColorEsco(value));
    }
    
    const canvas = <HTMLCanvasElement> document.getElementById(id);
    //const canvas = <HTMLCanvasElement> document.getElementsByClassName(id)[0];
    const ctx = canvas.getContext('2d');    
    this.myChart = new Chart(ctx!, {
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

  //funcion que obtiene colores dependiendo un rango
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

  //funcion que obtiene colores dependiendo un rango
  getBackgroundColorEsco(value:any){
    if (value <= 20) {
        return 'rgba(255, 0, 0)'; 
    } else if (value<=40 && value>20) {
        return 'rgba(255, 80, 0)'; 
    } else if (value<=60 && value>40) {
        return 'rgba(255, 120, 0)'; 
    }else if (value<=80 && value>60) {
        return 'rgba(255, 255, 0)'; 
    }else if (value<=100 && value>80) {
        return 'rgba(160, 255, 115)'; 
    }else if (value<=150 && value>100) {
        return 'rgba(75, 230, 0)'; 
    }else if (value<=200 && value>150) {
        return 'rgba(0, 135, 50)'; 
    }else if (value<=250 && value>200) {
        return 'rgba(115, 180, 255)'; 
    }else if (value<=300 && value>250) {
        return 'rgba(0, 90, 230)'; 
    }else if (value<=400 && value>300) {
        return 'rgba(220, 115, 255)'; 
    }else{
    return 'rgba(135, 0, 170)'; 
    }
  };
}
