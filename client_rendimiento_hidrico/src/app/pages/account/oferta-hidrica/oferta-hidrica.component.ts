import { Component, OnInit, ElementRef } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";

//import de librerias para realizar graficos
import { Chart, registerables } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation';

//librerias para convertir html a pdf
import jspdf from 'jspdf';
import html2canvas from 'html2canvas'; 

Chart.register(...registerables)
Chart.register(annotationPlugin);

import { CrudService } from '../crud/crud.service';

@Component({
  selector: 'app-oferta-hidrica',
  templateUrl: './oferta-hidrica.component.html',
  styleUrl: './oferta-hidrica.component.scss'
})
export class OfertaHidricaComponent implements OnInit {

  space_ohts: any;    

  listProyectos: any[] = [];

  map: google.maps.Map | undefined;  

  constructor(private service:CrudService, private elementRef:ElementRef, private spinner: NgxSpinnerService){}
  
  //funcion que se ejecuta al iniciar el componente carga las lista de los proyectos
  ngOnInit(): void {    
    this.service.listCustom().subscribe({
      next: (result:any) => {         
        this.listProyectos = result;        
      }
    });        
  }

  //funcion que realiza el cambio de las pestañas
  tabChanged(value:any){     
    document.querySelectorAll(".accordionOHTS").forEach(el => el.remove());
    document.querySelectorAll(".row").forEach(el => el.remove());
    
    this.space_ohts = this.elementRef.nativeElement.querySelector('.space_ohts'+value.index);//se obitiene el selector donde se renderiza el rendimiento hidrico     
    this.getProject_OHTS(this.listProyectos[value.index].id);
  }

  //funcion para renderizar las imagenes
  async getProject_OHTS(id:string){
    this.spinner.show();
    const prueba = await this.service.retrieve_ohts(id);
    prueba.subscribe({
      next: (result:any) =>{ 
        for(let i=0; i<result.data1.length; i++){
          const myButton = document.createElement("button");
          myButton.setAttribute("class", "accordionOHTS");
          myButton.textContent =  (i+1) + "." + " " + result.data1[i]['Unidad de analisis'].replaceAll("_", " ");
          this.space_ohts?.appendChild(myButton);

          const areaRow = document.createElement("div");
          areaRow.setAttribute("id", "spaceDiv"+i);//  
          areaRow.setAttribute("class", "row");        
          areaRow.style.display = "none";            

          const areaCol = document.createElement("div");
          areaCol.setAttribute("class", "col");

          areaRow.appendChild(areaCol);
          this.space_ohts?.appendChild(areaRow);
          
          const r1 = document.createElement("div");
          r1.setAttribute("class", "row");

          const r1c1 = document.createElement("div");
          r1c1.setAttribute("class", "col-xl-4 col-lg-5 col-md-6 col-sm-12");
          var myHTML = "<h3 style='margin-left:16px; margin-right:16px;'>Oferta Hídrica Total Superficial (OHTS)</h3>";
          myHTML += "<div style='background-color:rgba(64, 224, 208, 0.3); border:solid 1px #abb2b9; margin-left:32px; margin-right:32px; border-radius:8px; padding:8px; max-width:300px;'>"
          myHTML +=   "<p style='margin:0 auto;'><strong>Subzona Hidrográfica: </strong></p>";
          myHTML +=   "<p style='margin:0 auto;'><strong>Unidad de Análisis: </strong>" + result.data1[i]['Unidad de analisis'].replaceAll("_", " ") + "</p>";
          myHTML +=   "<p style='margin:0 auto;'><strong>Punto Cierre en Modelo (CTM12): </strong></p>"
          myHTML +=   "<p style='margin:0 auto;'>X: " + result.data1[i]['coord_x'] + "m Y:" + result.data1[i]['coord_y'] + "m" + "</p>";
          myHTML += "</div>";
          myHTML += "<br>";
          myHTML += "<div style='background-color:rgba(144, 238, 144, 0.3); border:solid 1px #abb2b9; border-radius:8px; margin-left:32px; margin-right:32px; padding:8px; max-width:400px;'>";
          myHTML +=   "<p style='margin:0 auto;'><strong>Descripción: </strong></p>";
          myHTML +=   "<p style='margin:0 auto;'>" + result.data1[i]['desc_info'] + "</p>";
          myHTML += "</div>";
          r1c1.innerHTML =  myHTML;                    

          const r1c2 = document.createElement("div");
          r1c2.setAttribute("class", "col-xl-8 col-lg-7 col-md-6 col-sm-12");
          const mapDiv = document.createElement("div");             
          mapDiv.setAttribute("id", "map"+i); 
          mapDiv.style.width = "100%";
          mapDiv.style.height = "304px";   
            
          r1c2.appendChild(mapDiv);
          r1.appendChild(r1c1);
          r1.appendChild(r1c2);
          areaCol.appendChild(r1);

          this.map = new google.maps.Map(document.getElementById("map"+i) as HTMLElement, {zoom: 9, center: { lat: 4.4, lng: -75.33 }, mapTypeId: "terrain"});
          let flightPlanCoordinates;
          let flightPath;

          for(let i_map=0; i_map<result.data2.length; i_map++){
            flightPlanCoordinates = result.data2[i_map];
            if(i==i_map){
              flightPath = new google.maps.Polygon({
                paths: flightPlanCoordinates,
                geodesic: false,
                strokeColor: "#000000",
                fillColor: 'yellow',
                strokeOpacity: 1.0,
                strokeWeight: 2,
              });
            }else{
              flightPath = new google.maps.Polygon({
                paths: flightPlanCoordinates,
                geodesic: false,
                strokeColor: "#000000",
                strokeOpacity: 1.0,
                strokeWeight: 2,
              });  
            } 
            flightPath.setMap(this.map);
          }

          //********************Area 2********************
          const r2 = document.createElement("div");
          r2.setAttribute("class", "row");
          r2.style.marginTop = "16px";
          const r2c1 = document.createElement("div");
          r2c1.setAttribute("class", "col-xl-12");
          const canvas2 = document.createElement("canvas");
          canvas2.setAttribute("id", "canvas2_" + i);  
          canvas2.style.position = "absolute !important";                   
          canvas2.style.width = "100vw";
          canvas2.style.height = "400px";  

          r2c1.appendChild(canvas2);
          r2.appendChild(r2c1);
          areaCol.appendChild(r2);
          this.renderArea2(result.data3.columns, result.data3.data[i], "canvas2_" + i, 'Caudal Medio Diario');
          //**********************************************

          //********************Area 3********************
          const r3 = document.createElement("div");
          r3.setAttribute("class", "row");
          r3.style.marginTop = "16px";
          const r3c1 = document.createElement("div");
          r3c1.setAttribute("class", "col-xl-12");
          r3c1.style.display = "flex";
          r3c1.style.flexWrap = "wrap";  

          const r3c1a1 = document.createElement("div");          
          r3c1a1.style.width = "10%";  
          r3c1a1.style.height = "400px";  
          r3c1a1.innerHTML = "<p class='rotateText'>Caudal (m3/s)</p>";

          const r3c1a2 = document.createElement("div");
          r3c1a2.style.width = "90%";    
          r3c1a2.style.height = "400px";         
          const canvas3_e1 = document.createElement("canvas");
          canvas3_e1.setAttribute("id", "canvas3_" + i);  
          canvas3_e1.style.position = "absolute !important";
          canvas3_e1.style.width = "100vw";
          canvas3_e1.style.height = "400px";   

          r3c1a2.appendChild(canvas3_e1); 
          r3c1.appendChild(r3c1a1);
          r3c1.appendChild(r3c1a2);
          r3.appendChild(r3c1);
          areaCol.appendChild(r3);
          this.renderLine(result.data4[i]['index'], result.data4[i]['data4'], "canvas3_" + i, 'Rendimiento Hídrico Mensual Año Humedo');
          //********************************************

          //*******************Area 4*******************
          const r4 = document.createElement("div");
          r4.setAttribute("class", "row");

          const r4c1 = document.createElement("div");
          r4c1.setAttribute("class", "col-xl-4 col-lg-4 col-md-4 col-sm-12");
          r4c1.style.display = "flex";         
          r4c1.style.flexWrap = "wrap"; 
          const r4c1a1 = document.createElement("div"); 
          r4c1a1.style.width = "10%";      
          r4c1a1.style.height = "400px";             
          r4c1a1.innerHTML = "<p class='rotateText'>Escorrentia(mm)</p>";   
          const r4c1a2 = document.createElement("div"); 
          r4c1a2.style.width = "90%";
          r4c1a2.style.height = "400px";
          const canvas5 = document.createElement("canvas");
          canvas5.setAttribute("id", "escom_"+i);                    
          canvas5.style.height = "400px !important";
          r4c1a2.appendChild(canvas5)         
          var categorias = result.data5.columns; 
          var valores = result.data5.data[i]; 
          var promedio = valores.reduce((acc:any, curr:any) => acc + curr, 0) / valores.length;                                              

          const r4c2 = document.createElement("div");
          r4c2.setAttribute("class", "col-xl-4 col-lg-4 col-md-4 col-sm-12");
          r4c2.style.display = "flex";         
          r4c2.style.flexWrap = "wrap"; 
          const r4c2a1 = document.createElement("div"); 
          r4c2a1.style.width = "10%";     
          r4c2a1.style.height = "400px";              
          r4c2a1.innerHTML = "<p class='rotateText'>Escorrentia(mm)</p>";
          const r4c2a2 = document.createElement("div"); 
          r4c2a2.style.width = "90%";  
          r4c2a2.style.height = "400px";
          const canvas6 = document.createElement("canvas");
          canvas6.setAttribute("id", "escoh_"+i);   
          canvas6.style.height = "400px !important";                                                 
          r4c2a2.appendChild(canvas6)         
          var categorias6 = result.data6.columns; 
          var valores6 = result.data6.data[i]; 
          var promedio6 = valores6.reduce((acc:any, curr:any) => acc + curr, 0) / valores6.length;                             

          const r4c3 = document.createElement("div");
          r4c3.setAttribute("class", "col-xl-4 col-lg-4 col-md-4 col-sm-12");
          r4c3.style.display = "flex";         
          r4c3.style.flexWrap = "wrap"; 
          const r4c3a1 = document.createElement("div"); 
          r4c3a1.style.width = "10%"; 
          r4c3a1.style.height = "400px";                  
          r4c3a1.innerHTML = "<p class='rotateText'>Escorrentia(mm)</p>";
          const r4c3a2 = document.createElement("div"); 
          r4c3a2.style.width = "90%"; 
          r4c3a2.style.height = "400px";
          const canvas7 = document.createElement("canvas");
          canvas7.setAttribute("id", "escos_"+i);     
          canvas7.style.height = "400px !important";                                               
          r4c3a2.appendChild(canvas7)         
          var categorias7 = result.data7.columns; 
          var valores7 = result.data7.data[i]; 
          var promedio7 = valores7.reduce((acc:any, curr:any) => acc + curr, 0) / valores7.length;  

          r4c1.appendChild(r4c1a1);
          r4c1.appendChild(r4c1a2);

          r4c2.appendChild(r4c2a1);
          r4c2.appendChild(r4c2a2);

          r4c3.appendChild(r4c3a1);
          r4c3.appendChild(r4c3a2);

          r4.appendChild(r4c1);
          r4.appendChild(r4c2);
          r4.appendChild(r4c3);
          areaCol.appendChild(r4);

          this.renderBar(categorias, valores, promedio, "escom_"+i, 'Escorrentía Mensual Año Medio' , 1); 
          this.renderBar(categorias6, valores6, promedio6, "escoh_"+i, 'Escorrentía Mensual Año Humedo', 1);      
          this.renderBar(categorias7, valores7, promedio7, "escos_"+i, 'Escorrentía Mensual Año Seco', 1);   
          //**********************************************

          //********************Area 5********************
          const r5 = document.createElement("div");
          r5.setAttribute("class", "row");
          r5.style.marginTop = "16px";

          const r5c1 = document.createElement("div");
          r5c1.setAttribute("class", "col-xl-8 col-lg-8");
          r5c1.style.display = "flex";
          r5c1.style.flexWrap = "wrap";
          const r5c1a1 = document.createElement("div");
          r5c1a1.style.width = "12%";      
          r5c1a1.style.height = "400px";    
          r5c1a1.innerHTML = "<p class='rotateText'>Caudal (m3/s)</p>";   
          const r5c1a2 = document.createElement("div");
          r5c1a2.style.width = "88%";      
          r5c1a2.style.height = "400px";                    
          const canvas8 = document.createElement("canvas");
          canvas8.setAttribute("id", "qamed_"+i);                     
          canvas8.style.width = "100vw";
          canvas8.style.height = "400px !important";                                                        
          r5c1a2.appendChild(canvas8)         
          var colu_qamed = result.data8.qamed.columns; 
          var valo_qamed = result.data8.qamed.data[i]; 
          var valo_qamin = result.data8.qamin.data[i]; 
          var valo_qamax = result.data8.qamax.data[i]; 
            
          var valo_lamed = result.data8.lamed.data[i]; 
          var valo_lamin = result.data8.lamin.data[i]; 
          var valo_lamax = result.data8.lamax.data[i]; 

          const r5c2 = document.createElement("div");
          r5c2.setAttribute("class", "col-xl-4 col-lg-4");

          r5c1.appendChild(r5c1a1);
          r5c1.appendChild(r5c1a2);

          r5.appendChild(r5c1);
          r5.appendChild(r5c2);
          areaCol.appendChild(r5);

          this.renderLineTend(colu_qamed, valo_qamed, valo_qamin, valo_qamax, valo_lamed, valo_lamin, valo_lamax,  "qamed_"+i, "Tendencia de caudales");       
          
          //********************Area 6********************
          const r6 = document.createElement("div");
          r6.setAttribute("class", "row");

          const r6c1 = document.createElement("div");
          r6c1.setAttribute("class", "col-xl-12 col-lg-12");

          const pdfButton = document.createElement("button");
          pdfButton.setAttribute("id", "pdfButton"+i);
          pdfButton.setAttribute("class", "pdfButton");
          pdfButton.style.display = "none";
          pdfButton.style.borderRadius = "4px";
          pdfButton.style.backgroundColor = "#3498db";
          pdfButton.style.borderColor = "#3498db";
          pdfButton.style.color = "white";
          let pdfButtonCont = "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-filetype-pdf' viewBox='0 0 16 16'>";
          pdfButtonCont +=       "<path fill-rule='evenodd' d='M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM1.6 11.85H0v3.999h.791v-1.342h.803q.43 0 .732-.173.305-.175.463-.474a1.4 1.4 0 0 0 .161-.677q0-.375-.158-.677a1.2 1.2 0 0 0-.46-.477q-.3-.18-.732-.179m.545 1.333a.8.8 0 0 1-.085.38.57.57 0 0 1-.238.241.8.8 0 0 1-.375.082H.788V12.48h.66q.327 0 .512.181.185.183.185.522m1.217-1.333v3.999h1.46q.602 0 .998-.237a1.45 1.45 0 0 0 .595-.689q.196-.45.196-1.084 0-.63-.196-1.075a1.43 1.43 0 0 0-.589-.68q-.396-.234-1.005-.234zm.791.645h.563q.371 0 .609.152a.9.9 0 0 1 .354.454q.118.302.118.753a2.3 2.3 0 0 1-.068.592 1.1 1.1 0 0 1-.196.422.8.8 0 0 1-.334.252 1.3 1.3 0 0 1-.483.082h-.563zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638z'/>";
          pdfButtonCont +=    "</svg>";
          pdfButtonCont +=    "Descargar"
          pdfButton.innerHTML = pdfButtonCont; 
          
          r6c1.appendChild(pdfButton);
          r6.appendChild(r6c1);
          //areaCol.appendChild(r6);
          this.space_ohts.appendChild(r6);
        }

        //funcion para agregar click a botones
        var acc = document.getElementsByClassName("accordionOHTS");
        for (var i=0; i<acc.length; i++) {
          acc[i].addEventListener("click", function(item:any) {                 
            var panel = item.target.nextElementSibling;    
            let index = panel.id.substring(8);
            let buttonIndex = document.getElementById("pdfButton"+index);           

            if(buttonIndex!.style.display == "none"){
              buttonIndex!.style.display = "block";
            }else{
              buttonIndex!.style.display = "none";
            }

            if (panel.style.display === "flex") {
                panel.style.display = "none";
            } else {
                panel.style.display = "flex";                           
                panel.style.flexWrap = "wrap";                           
            }
          });
        }

        //funcion para agregar click a boton de descargar pdf
        var onPdfButton = document.getElementsByClassName("pdfButton");
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
        }
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

  //fincion que renderiza graficas tipo line con caudales
  renderLineTend(columns:any, qamed:any, qamin:any, qamax:any, lamed:any, lamin:any, lamax:any, id:any, titulo:any){
    const canvas = <HTMLCanvasElement> document.getElementById(id);    
    const ctx = canvas.getContext('2d');
    const lineChart = new Chart(ctx!, {
      type: 'line',
      data: {
        labels: columns,
        datasets: [{
          label: "Q medio",
          data: qamed,
          fill: false,
          borderColor: 'rgb(0, 0, 255)',
          backgroundColor: 'rgb(255, 255, 255)',
          tension: 0.1,         
          borderDash: [6, 4],
          pointRadius: 4,
        },{
          label: "TQ medio",
          data: lamed,
          fill: false,
          borderColor: 'rgb(0, 128, 255)',
          backgroundColor: 'rgb(255, 255, 255)',
          tension: 0.1,         
          borderDash: [6, 4],
          pointRadius: 0,
        },{
          label: "Q min",
          data: qamin,
          fill: false,
          borderColor: 'rgb(255, 0, 0)',
          backgroundColor: 'rgb(255, 255, 255)',
          tension: 0.1,
          pointStyle: 'rect',
          borderDash: [6, 4],
          pointRadius: 4,
        },{
          label: "TQ min",
          data: lamin,
          fill: false,
          borderColor: 'rgb(255, 128, 0)',
          backgroundColor: 'rgb(255, 255, 255)',
          tension: 0.1,
          pointStyle: 'rect',
          borderDash: [6, 4],
          pointRadius: 0,
        },{
          label: "Q max",
          data: qamax,
          fill: false,
          borderColor: 'rgb(0, 128, 0)',
          backgroundColor: 'rgb(255, 255, 255)',
          tension: 0.1,
          pointStyle: 'triangle',
          borderDash: [6, 4],
          pointRadius: 5,
        },{
          label: "TQ max",
          data: lamax,
          fill: false,
          borderColor: 'rgb(128, 128, 0)',
          backgroundColor: 'rgb(255, 255, 255)',
          tension: 0.1,
          pointStyle: 'triangle',
          borderDash: [6, 4],
          pointRadius: 0,
        }]
      },
      options: {
        plugins: {
          legend: {
            display: true,
            title: {
                display: true,
                text: 'Tendencias de Caudales Medios, Minimos y Maximos Anuales',
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
          },            
        }
      }
    });
  }

  //funcion q renderiza graficas tipo lineas
  renderArea2(columns:any, data3:any, id:any, titulo:any){    
    const canvas = <HTMLCanvasElement> document.getElementById(id);    
    const ctx = canvas.getContext('2d');
    const lineChart = new Chart(ctx!, {
      type: 'line',        
      data: {
        labels: columns,
        datasets: [{
          label: titulo,
          data: data3,
          fill: false,
          borderColor: 'rgba(0, 0, 255, 1.0)',
          backgroundColor: 'rgba(0, 0, 255, 1.0)',
          tension: 0.1          
        }] 
      }, 
      options: {
        plugins: {
          legend: {
            display: true
          }
        }
      }    
    });
  }

  //funcion q renderiza graficas tipo line con percentiles
  renderLine(columns:any, data4:any, id:any, titulo:any){         
    const canvas = <HTMLCanvasElement> document.getElementById(id);    
    const ctx = canvas.getContext('2d');
    const lineChart = new Chart(ctx!, {
    type: 'line',        
    data: {
        labels: columns,
        datasets: [{
        label: 'Qq5',
        data: data4['Qq5'],
        fill: '+1',
        borderColor: 'rgba(0, 0, 255, 0.1)',
        backgroundColor: 'rgba(0, 0, 255, 0.1)',
        tension: 0.1
        //pointRadius: 0,
        },{
        label: 'Qq10',
        data: data4['Qq10'],
        fill: '+1',
        borderColor: 'rgba(0, 0, 255, 0.2)',
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
        tension: 0.1
        },{
        label: 'Qq15',
        data: data4['Qq15'],
        fill: '+1',
        borderColor: 'rgba(0, 0, 255, 0.3)',
        backgroundColor: 'rgba(0, 0, 255, 0.3)',
        tension: 0.1
        },{
        label: 'Qq20',
        data: data4['Qq20'],
        fill: '+1',
        borderColor: 'rgba(0, 0, 255, 0.4)',
        backgroundColor: 'rgba(0, 0, 255, 0.4)',
        tension: 0.1
        },{
        label: 'Qq25',
        data: data4['Qq25'],
        fill: '+1',
        borderColor: 'rgba(0, 0, 255, 0.5)',
        backgroundColor: 'rgba(0, 0, 255, 0.5)',
        tension: 0.1,          
        },{
        label: 'Qq30',
        data: data4['Qq30'],
        fill: '+1',
        borderColor: 'rgba(0, 0, 255, 0.6)',
        backgroundColor: 'rgba(0, 0, 255, 0.6)',
        tension: 0.1,          
        },{
        label: 'Qq35',
        data: data4['Qq35'],
        fill: '+1',
        borderColor: 'rgba(0, 0, 255, 0.7)',
        backgroundColor: 'rgba(0, 0, 255, 0.7)',
        tension: 0.1,          
        },{
        label: 'Qq40',
        data: data4['Qq40'],
        fill: '+1',
        borderColor: 'rgba(0, 0, 255, 0.8)',
        backgroundColor: 'rgba(0, 0, 255, 0.8)',
        tension: 0.1,          
        },{
        label: 'Qq45',
        data: data4['Qq45'],
        fill: '+1',
        borderColor: 'rgba(0, 0, 255, 0.9)',
        backgroundColor: 'rgba(0, 0, 255, 0.9)',
        tension: 0.1,          
        },{
        label: 'MEDIANA',
        data: data4['Qq50'],
        fill: '+1',//false
        borderColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgb(0, 0, 255)',
        tension: 0.1,             
        },{
        label: 'MEDIA',//*****
        data: data4['Qm_mes'],   
        borderWidth: 4,     
        fill: false,
        borderColor: 'rgb(255, 140, 0)',          
        backgroundColor: 'rgb(0, 0, 255)',
        borderDash: [6, 4],
        tension: 0.1,      
        pointHoverRadius: 6,            
        },{          
        label: 'Qq55',
        data: data4['Qq55'],        
        fill: '-1',
        borderColor: 'rgba(0, 0, 255, 0.9)',
        backgroundColor: 'rgba(0, 0, 255, 0.9)',
        tension: 0.1,          
        },{        
        label: 'Qq60',  
        data: data4['Qq60'],        
        fill: '-1',
        borderColor: 'rgba(0, 0, 255, 0.8)',
        backgroundColor: 'rgba(0, 0, 255, 0.8)',
        tension: 0.1,          
        },{
        label: 'Qq65',
        data: data4['Qq65'],        
        fill: '-1',
        borderColor: 'rgba(0, 0, 255, 0.7)',
        backgroundColor: 'rgba(0, 0, 255, 0.7)',
        tension: 0.1,          
        },{
        label: 'Qq70',
        data: data4['Qq70'],        
        fill: '-1',
        borderColor: 'rgba(0, 0, 255, 0.6)',
        backgroundColor: 'rgba(0, 0, 255, 0.6)',
        tension: 0.1,          
        },{
        label: 'Qq75',
        data: data4['Qq75'],        
        fill: '-1',
        borderColor: 'rgba(0, 0, 255, 0.5)',
        backgroundColor: 'rgba(0, 0, 255, 0.5)',
        tension: 0.1,          
        },{
        label: 'Qq80',
        data: data4['Qq80'],        
        fill: '-1',
        borderColor: 'rgba(0, 0, 255, 0.4)',
        backgroundColor: 'rgba(0, 0, 255, 0.4)',
        tension: 0.1,          
        },{
        label: 'Qq85',
        data: data4['Qq85'],        
        fill: '-1',
        borderColor: 'rgba(0, 0, 255, 0.3)',
        backgroundColor: 'rgba(0, 0, 255, 0.3)',
        tension: 0.1,          
        },{
        label: 'Qq90',
        data: data4['Qq90'],        
        fill: '-1',
        borderColor: 'rgba(0, 0, 255, 0.2)',
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
        tension: 0.1,          
        },{
        label: 'Qq95',
        data: data4['Qq95'],        
        fill: '-1',
        borderColor: 'rgba(0, 0, 255, 0.1)',
        backgroundColor: 'rgba(0, 0, 255, 0.1)',
        tension: 0.1,          
        }] 
    }, 
    options: {        
        plugins: {
        legend: {
                position: 'top',
                align: 'center',
                display: true,
                title: {
                    display: true,
                    text: 'Percentiles Mensuales de Caudal',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                /*labels: {                    
                    font: {
                        size: 32
                    }
                }*/
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