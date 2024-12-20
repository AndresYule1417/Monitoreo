import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';


//import de librerias para realizar graficos
import { Chart, registerables } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(...registerables)
Chart.register(annotationPlugin);

//import de servicio donde se encuentran las peticiones
import { CrudService } from '../crud.service';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrl: './view-project.component.scss',  
})
export class ViewProjectComponent implements OnInit {    
    
    data: any = {
        id: "",
        nombre: "",
        fecha: "",
        archivo: ""
    }; 

    space: any;
    space_ohts: any;  

    map: google.maps.Map | undefined;  

    //inicializacion de constructor con sus clases
    constructor(private elementRef:ElementRef, private service:CrudService, private activatedRoute:ActivatedRoute){}

    ngOnInit(): void {    
        this.space = this.elementRef.nativeElement.querySelector('#space');//se obitiene el selector donde se renderiza el rendimiento hidrico
        this.space_ohts = this.elementRef.nativeElement.querySelector('#space_ohts');//selector para renderizar las grafias de OHTS    
        const id = this.activatedRoute.snapshot.paramMap.get('id');//se obtiene el id de la url        
        //this.getProject(id!);// funcion para renderizar el rendimiento hidrico
        this.getProject_OHTS(id!);//funcion para renderizar graficas de OHTS        
    } 


    async getProject_OHTS(id:string){
        const prueba = await this.service.retrieve_ohts(id);
        prueba.subscribe({
            next: (result:any) =>{ 
                for(let i=0; i<result.data1.length; i++){

                    const r1 = document.createElement("div");
                    r1.setAttribute("class", "row");

                    const r1c1 = document.createElement("div");
                    r1c1.setAttribute("class", "col-xl-4");
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
                    r1c2.setAttribute("class", "col-xl-8");
                    const mapDiv = document.createElement("div");             
                    mapDiv.setAttribute("id", "map"+i); 
                    
                    r1c2.appendChild(mapDiv);
                    r1.appendChild(r1c1);
                    r1.appendChild(r1c2);
                    this.space_ohts?.appendChild(r1);

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


                    const r2 = document.createElement("div");
                    r2.setAttribute("class", "row");
                    const r2c1 = document.createElement("div");
                    r2c1.setAttribute("class", "col-xl-12");
                    const canvas2 = document.createElement("canvas");
                    canvas2.setAttribute("id", "canvas2_" + i);                     
                    canvas2.style.width = "100%";
                    canvas2.style.height = "400px";  

                    r2c1.appendChild(canvas2);
                    r2.appendChild(r2c1);
                    this.space_ohts?.appendChild(r2);
                    this.renderArea2(result.data3.columns, result.data3.data[i], "canvas2_" + i, 'Caudal Medio Diario');


                    const r3 = document.createElement("div");
                    r3.setAttribute("class", "row");
                    const r3c1 = document.createElement("div");
                    r3c1.setAttribute("class", "col-xl-12");
                    r3c1.style.display = "flex";
                    r3c1.style.flexWrap = "wrap";  

                    const r3c1a1 = document.createElement("div");
                    r3c1a1.style.width = "10%";  
                    r3c1a1.style.height = "400px";  
                    r3c1a1.innerHTML = "<p style='position:relative; writing-mode:tb-rl; transform:rotate(-180deg); top:35%;'>Caudal (m3/s)</p>";

                    const r3c1a2 = document.createElement("div");
                    r3c1a2.style.width = "90%";    
                    r3c1a2.style.height = "400px";         
                    const canvas3_e1 = document.createElement("canvas");
                    canvas3_e1.setAttribute("id", "canvas3_" + i);                     
                    canvas3_e1.style.width = "100%";
                    canvas3_e1.style.height = "400px";   

                    r3c1a2.appendChild(canvas3_e1); 
                    r3c1.appendChild(r3c1a1);
                    r3c1.appendChild(r3c1a2);
                    r3.appendChild(r3c1);
                    this.space_ohts?.appendChild(r3);
                    this.renderLine(result.data4[i]['index'], result.data4[i]['data4'], "canvas3_" + i, 'Rendimiento Hídrico Mensual Año Humedo');

                    //*******************AREA 4*******************
                    const r4 = document.createElement("div");
                    r4.setAttribute("class", "row");

                    const r4c1 = document.createElement("div");
                    r4c1.setAttribute("class", "col-xl-4 col-lg-4 col-md-4 col-sm-12");
                    r4c1.style.display = "flex";         
                    r4c1.style.flexWrap = "wrap"; 
                    const r4c1a1 = document.createElement("div"); 
                    r4c1a1.style.width = "10%";                   
                    r4c1a1.innerHTML = "<p style='position:relative; writing-mode:tb-rl; transform:rotate(-180deg); top:25%;'>Escorrentia (mm)</p>";   
                    const r4c1a2 = document.createElement("div"); 
                    r4c1a2.style.width = "90%";
                    const canvas5 = document.createElement("canvas");
                    canvas5.setAttribute("id", "escom_"+i);  
                    canvas5.style.height = "400px";
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
                    r4c2a1.innerHTML = "<p style='position:relative; writing-mode:tb-rl; transform:rotate(-180deg); top:25%;'>Escorrentia (mm)</p>";
                    const r4c2a2 = document.createElement("div"); 
                    r4c2a2.style.width = "90%";  
                    const canvas6 = document.createElement("canvas");
                    canvas6.setAttribute("id", "escoh_"+i);   
                    canvas6.style.height = "400px";                                                 
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
                    r4c3a1.innerHTML = "<p style='position:relative; writing-mode:tb-rl; transform:rotate(-180deg); top:25%;'>Escorrentia (mm)</p>";
                    const r4c3a2 = document.createElement("div"); 
                    r4c3a2.style.width = "90%"; 
                    const canvas7 = document.createElement("canvas");
                    canvas7.setAttribute("id", "escos_"+i);     
                    canvas7.style.height = "400px";                                               
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
                    this.space_ohts?.appendChild(r4);

                    this.renderBar(categorias, valores, promedio, "escom_"+i, 'Escorrentía Mensual Año Medio' , 1); 
                    this.renderBar(categorias6, valores6, promedio6, "escoh_"+i, 'Escorrentía Mensual Año Humedo', 1);      
                    this.renderBar(categorias7, valores7, promedio7, "escos_"+i, 'Escorrentía Mensual Año Seco', 1);   


                    const r5 = document.createElement("div");
                    r5.setAttribute("class", "row");

                    const r5c1 = document.createElement("div");
                    r5c1.setAttribute("class", "col-xl-8");
                    r5c1.style.display = "flex";
                    r5c1.style.flexWrap = "wrap";
                    const r5c1a1 = document.createElement("div");
                    r5c1a1.style.width = "12%";      
                    r5c1a1.style.height = "400px";    
                    r5c1a1.innerHTML = "<p style='position:relative; writing-mode:tb-rl; transform:rotate(-180deg); top:25%;'>Caudal (m3/s)</p>";   
                    const r5c1a2 = document.createElement("div");
                    r5c1a2.style.width = "88%";      
                    r5c1a2.style.height = "400px";                    
                    const canvas8 = document.createElement("canvas");
                    canvas8.setAttribute("id", "qamed_"+i);                     
                    canvas8.style.width = "100%";
                    canvas8.style.height = "400px";                                                        
                    r5c1a2.appendChild(canvas8)         
                    var colu_qamed = result.data8.qamed.columns; 
                    var valo_qamed = result.data8.qamed.data[i]; 
                    var valo_qamin = result.data8.qamin.data[i]; 
                    var valo_qamax = result.data8.qamax.data[i]; 
                    
                    var valo_lamed = result.data8.lamed.data[i]; 
                    var valo_lamin = result.data8.lamin.data[i]; 
                    var valo_lamax = result.data8.lamax.data[i]; 


                    const r5c2 = document.createElement("div");
                    r5c2.setAttribute("class", "col-xl-4");

                    r5c1.appendChild(r5c1a1);
                    r5c1.appendChild(r5c1a2);

                    r5.appendChild(r5c1);
                    r5.appendChild(r5c2);
                    this.space_ohts?.appendChild(r5);

                    this.renderLineTend(colu_qamed, valo_qamed, valo_qamin, valo_qamax, valo_lamed, valo_lamin, valo_lamax,  "qamed_"+i, "Tendencia de caudales");


                    /*
                    const area5 = document.createElement("div");
                    area5.style.display = "flex";            
                    area5.style.marginBottom = "8px";
                    this.space_ohts?.appendChild(area5);

                    const area5_e1 = document.createElement("div");                        
                    area5_e1.style.width = "75%";            
                    area5_e1.style.display = "flex";
                    area5.appendChild(area5_e1);
                    const area5_e1_d1 = document.createElement("div");
                    area5_e1_d1.style.width = "12%";      
                    area5_e1_d1.style.height = "400px";                     
                    area5_e1_d1.innerHTML = "<p style='position:relative; writing-mode:tb-rl; transform:rotate(-180deg); top:25%;'>Caudal (m3/s)</p>";
                    area5_e1.appendChild(area5_e1_d1);
                    const area5_e1_d2 = document.createElement("div");
                    area5_e1_d2.style.width = "88%";    
                    area5_e1_d2.style.height = "400px";          
                    area5_e1.appendChild(area5_e1_d2);
                    const canvas8 = document.createElement("canvas");
                    canvas8.setAttribute("id", "qamed_"+i);     
                    canvas8.style.position = "absolute"; 
                    //canvas8.style.width = "100%";
                    canvas8.style.height = "400px";                                                        
                    area5_e1_d2.appendChild(canvas8)         
                    var colu_qamed = result.data8.qamed.columns; 
                    var valo_qamed = result.data8.qamed.data[i]; 
                    var valo_qamin = result.data8.qamin.data[i]; 
                    var valo_qamax = result.data8.qamax.data[i]; 
                    
                    var valo_lamed = result.data8.lamed.data[i]; 
                    var valo_lamin = result.data8.lamin.data[i]; 
                    var valo_lamax = result.data8.lamax.data[i]; 

                    const area5_e2 = document.createElement("div");            
                    area5_e2.style.width = "25%";
                    area5.appendChild(area5_e2);
                    */


                    
                    
                    /*const area1 = document.createElement("div");
                    area1.setAttribute("id", "area1_" + i);          
                    area1.style.display = "flex";         
                    area1.style.flexWrap = "wrap"; 
                    area1.style.width = "100%";               
                    area1.style.marginBottom = "8px";
                    this.space_ohts?.appendChild(area1);

                    const area1_e1 = document.createElement("div");              
                    area1_e1.style.width = "30%"    
                    area1_e1.style.maxWidth = "400px";
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
                    area1_e1.innerHTML =  myHTML          

                    //**********Area Para Mapa**********
                    const area1_e2 = document.createElement("div");             
                    area1_e2.setAttribute("id", "map"+i); 
                    area1_e2.style.width = "70%";    
                    //**********************************

                    const get_area1 = document.getElementById("area1_" + i);
                    get_area1?.appendChild(area1_e1);
                    get_area1?.appendChild(area1_e2);

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
                    const area2 = document.createElement("div");
                    area2.style.marginBottom = "8px";      
                    area2.style.width = "100%";
                    area2.style.height = "400px";
                    const canvas2 = document.createElement("canvas");
                    canvas2.setAttribute("id", "canvas2_" + i);   
                    canvas2.style.position = "absolute"; 
                    canvas2.style.width = "100%";
                    canvas2.style.height = "400px";                 
                    area2.appendChild(canvas2);
                    this.space_ohts?.appendChild(area2);
                    this.renderArea2(result.data3.columns, result.data3.data[i], "canvas2_" + i, 'Caudal Medio Diario');          
                    //**********************************************

                    //********************Area 3********************
                    const area3 = document.createElement("div");  
                    area3.style.width = "100%"; 
                    area3.style.height = "400px";       
                    area3.style.display = "flex";         
                    area3.style.flexWrap = "wrap";   
                    area3.style.marginBottom = "8px";
                    this.space_ohts?.appendChild(area3);
                    
                    const area3_e1 = document.createElement("div");
                    area3_e1.style.width = "5%";                       
                    area3_e1.innerHTML = "<p style='position:relative; writing-mode:tb-rl; transform:rotate(-180deg); top:35%;'>Caudal (m3/s)</p>";
                    
                    const area3_e2 = document.createElement("div");
                    area3_e2.style.width = "95%";           
                    const canvas3_e1 = document.createElement("canvas");
                    canvas3_e1.setAttribute("id", "canvas3_" + i); 
                    canvas3_e1.style.position = "absolute"; 
                    canvas3_e1.style.width = "100%";
                    canvas3_e1.style.height = "400px";          
                    area3_e2.appendChild(canvas3_e1);     

                    area3.appendChild(area3_e1);
                    area3.appendChild(area3_e2);               

                    //********************Area 4********************
                    const area4 = document.createElement("div");
                    area4.style.width = "100%";            
                    area4.style.marginBottom = "8px";
                    area4.style.display = "flex";         
                    area4.style.flexWrap = "wrap";          
                    this.space_ohts?.appendChild(area4);

                    const area4_e1 = document.createElement("div");
                    area4_e1.style.width = "100%";  
                    area4_e1.style.height = "320px";
                    area4_e1.style.display = "flex";   
                    const area4_e1_d1 = document.createElement("div"); 
                    area4_e1_d1.style.width = "10%";                   
                    area4_e1_d1.innerHTML = "<p style='position:relative; writing-mode:tb-rl; transform:rotate(-180deg); top:25%;'>Escorrentia (mm)</p>";
                    const area4_e1_d2 = document.createElement("div"); 
                    area4_e1_d2.style.width = "90%"; 
                    area4_e1?.appendChild(area4_e1_d1);
                    area4_e1?.appendChild(area4_e1_d2);
                    const canvas5 = document.createElement("canvas");
                    canvas5.setAttribute("id", "escom_"+i);                                                    
                    area4_e1_d2.appendChild(canvas5)         
                    var categorias = result.data5.columns; 
                    var valores = result.data5.data[i]; 
                    var promedio = valores.reduce((acc:any, curr:any) => acc + curr, 0) / valores.length;

                    const area4_e2 = document.createElement("div");
                    area4_e2.style.width = "100%";   
                    area4_e2.style.height = "320px";        
                    area4_e2.style.display = "flex";
                    const area4_e2_d1 = document.createElement("div"); 
                    area4_e2_d1.style.width = "10%";                   
                    area4_e2_d1.innerHTML = "<p style='position:relative; writing-mode:tb-rl; transform:rotate(-180deg); top:25%;'>Escorrentia (mm)</p>";
                    const area4_e2_d2 = document.createElement("div"); 
                    area4_e2_d2.style.width = "90%"; 
                    area4_e2?.appendChild(area4_e2_d1);
                    area4_e2?.appendChild(area4_e2_d2);
                    const canvas6 = document.createElement("canvas");
                    canvas6.setAttribute("id", "escoh_"+i);                                                    
                    area4_e2_d2.appendChild(canvas6)         
                    var categorias6 = result.data6.columns; 
                    var valores6 = result.data6.data[i]; 
                    var promedio6 = valores6.reduce((acc:any, curr:any) => acc + curr, 0) / valores6.length;

                    const area4_e3 = document.createElement("div");
                    area4_e3.style.width = "100%";  
                    area4_e3.style.height = "320px";          
                    area4_e3.style.display = "flex";  
                    const area4_e3_d1 = document.createElement("div"); 
                    area4_e3_d1.style.width = "10%";                   
                    area4_e3_d1.innerHTML = "<p style='position:relative; writing-mode:tb-rl; transform:rotate(-180deg); top:25%;'>Escorrentia (mm)</p>";
                    const area4_e3_d2 = document.createElement("div"); 
                    area4_e3_d2.style.width = "90%"; 
                    area4_e3?.appendChild(area4_e3_d1);
                    area4_e3?.appendChild(area4_e3_d2);
                    const canvas7 = document.createElement("canvas");
                    canvas7.setAttribute("id", "escos_"+i);                                                    
                    area4_e3_d2.appendChild(canvas7)         
                    var categorias7 = result.data7.columns; 
                    var valores7 = result.data7.data[i]; 
                    var promedio7 = valores7.reduce((acc:any, curr:any) => acc + curr, 0) / valores7.length;          
                    
                    //********************Area 5********************
                    const area5 = document.createElement("div");
                    area5.style.display = "flex";            
                    area5.style.marginBottom = "8px";
                    this.space_ohts?.appendChild(area5);

                    const area5_e1 = document.createElement("div");                        
                    area5_e1.style.width = "75%";            
                    area5_e1.style.display = "flex";
                    area5.appendChild(area5_e1);
                    const area5_e1_d1 = document.createElement("div");
                    area5_e1_d1.style.width = "12%";      
                    area5_e1_d1.style.height = "400px";                     
                    area5_e1_d1.innerHTML = "<p style='position:relative; writing-mode:tb-rl; transform:rotate(-180deg); top:25%;'>Caudal (m3/s)</p>";
                    area5_e1.appendChild(area5_e1_d1);
                    const area5_e1_d2 = document.createElement("div");
                    area5_e1_d2.style.width = "88%";    
                    area5_e1_d2.style.height = "400px";          
                    area5_e1.appendChild(area5_e1_d2);
                    const canvas8 = document.createElement("canvas");
                    canvas8.setAttribute("id", "qamed_"+i);     
                    canvas8.style.position = "absolute"; 
                    //canvas8.style.width = "100%";
                    canvas8.style.height = "400px";                                                        
                    area5_e1_d2.appendChild(canvas8)         
                    var colu_qamed = result.data8.qamed.columns; 
                    var valo_qamed = result.data8.qamed.data[i]; 
                    var valo_qamin = result.data8.qamin.data[i]; 
                    var valo_qamax = result.data8.qamax.data[i]; 
                    
                    var valo_lamed = result.data8.lamed.data[i]; 
                    var valo_lamin = result.data8.lamin.data[i]; 
                    var valo_lamax = result.data8.lamax.data[i]; 

                    const area5_e2 = document.createElement("div");            
                    area5_e2.style.width = "25%";
                    area5.appendChild(area5_e2);

                    area4?.appendChild(area4_e1);
                    area4?.appendChild(area4_e2);
                    area4?.appendChild(area4_e3);

                    area3?.appendChild(area3_e1);
                    area3?.appendChild(area3_e2);

                    this.renderBar(categorias, valores, promedio, "escom_"+i, 'Escorrentía Mensual Año Medio' , 1);
                    this.renderBar(categorias6, valores6, promedio6, "escoh_"+i, 'Escorrentía Mensual Año Humedo', 1);
                    this.renderBar(categorias7, valores7, promedio7, "escos_"+i, 'Escorrentía Mensual Año Seco', 1);

                    this.renderLineTend(colu_qamed, valo_qamed, valo_qamin, valo_qamax, valo_lamed, valo_lamin, valo_lamax,  "qamed_"+i, "Tendencia de caudales");
                    this.renderLine(result.data4[i]['index'], result.data4[i]['data4'], "canvas3_" + i, 'Rendimiento Hídrico Mensual Año Humedo');*/          
                }
            }
        });
    }

    async getProject(id:string){
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
            this.renderBar(categorias, valores, promedio, "rham_" + i, 'Rendimiento Hídrico Mensual Año Medio', 0);    

            const canvas2 = document.createElement("canvas");
            canvas2.setAttribute("id", "rhah_"+i);                    
            myDiv2Child2.appendChild(canvas2)
            categorias = result.xlsx.rhah.columns;
            valores = result.xlsx.rhah.data[i]; 
            promedio = valores.reduce((acc:any, curr:any) => acc + curr, 0) / valores.length;
            this.renderBar(categorias, valores, promedio, "rhah_" + i, 'Rendimiento Hídrico Mensual Año Humedo', 0);

            const canvas3 = document.createElement("canvas");
            canvas3.setAttribute("id", "rhas_"+i);                    
            myDiv3Child2.appendChild(canvas3)
            categorias = result.xlsx.rhas.columns; 
            valores = result.xlsx.rhas.data[i]; 
            promedio = valores.reduce((acc:any, curr:any) => acc + curr, 0) / valores.length;
            this.renderBar(categorias, valores, promedio, "rhas_" + i, 'Rendimiento Hídrico Mensual Año Seco', 0);
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

/*select * from Usuarios;
select * from UsuaGrup where CC='1085905749';
select * from GrupUsua order by CodiGrup;
select * from Permisos where CodiGrup=5;
select * from Objetos order by NombObje;
select * from ModuObje;
select * from Modulos order by NombModu;
select * from InstModu;
select * from PersAtie;*/
