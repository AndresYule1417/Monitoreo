//importacion de librerias
import { Component, OnInit, ElementRef } from '@angular/core';

import { CrudService } from '../crud/crud.service';

@Component({
  selector: 'app-indice-hidrico',
  templateUrl: './indice-hidrico.component.html',
  styleUrl: './indice-hidrico.component.scss'
})
export class IndiceHidricoComponent implements OnInit {

  //declaracion de variables
  listProyectos: any[] = [];
  space: any;

  //inicializacion de constructor con servicios
  constructor(private crudServ:CrudService, private elementRef:ElementRef){}

  //funcion que se inicia al arrancar el componente 
  ngOnInit(): void {
    //funcion que retorna la lista de proyectos publicados
    this.crudServ.listCustom().subscribe({
      next: (result:any) => {  
        console.log(result);
        this.listProyectos = result;        
      }
    });       
  }

  //funcion que realiza el cambio de pestañas
  tabChanged(value:any){     
    document.querySelectorAll("table").forEach(el => el.remove());    
    document.querySelectorAll(".divMedio").forEach(el => el.remove());   
    document.querySelectorAll(".divSeco").forEach(el => el.remove()); 
    document.querySelectorAll(".divHumedo").forEach(el => el.remove());   
    
    this.space = this.elementRef.nativeElement.querySelector('.space'+value.index);//se obitiene el selector donde se renderiza el rendimiento hidrico      
    this.getProject(this.listProyectos[value.index].id);
  }

  //fucnion que retorna datos para graficar los indices hidricos
  async getProject(id:string){     
    const data = await this.crudServ.retrieve_indice(id); 
    data.subscribe({
      next: (result:any) => {       
        
        /**********INDICE MEDIO**********/
        const divMedio = document.createElement("div");
        divMedio.setAttribute("class", 'divMedio');
        divMedio.style.marginTop = "16px";
        divMedio.style.border = "solid 1px";
        divMedio.style.background = "#41556b";
        divMedio.style.color = "white";
        divMedio.style.paddingLeft = "16px";
        divMedio.innerText = "AÑO MEDIO";

        this.space.appendChild(divMedio);
        
        const table_1 = document.createElement("table");
        table_1.style.fontSize = "0.8em";
        table_1.style.border = "solid 1px";
        table_1.style.width = "100%";
        const tr_1 = document.createElement("tr"); 
        for(var i=0; i<result.xlsx.medio.columns.length; i++){          
          const th_1 = document.createElement("th");
          th_1.innerHTML = "<p style='margin:4px'>" + result.xlsx.medio.columns[i] + "</p>";
          tr_1.appendChild(th_1);          
        }       
        table_1.appendChild(tr_1);

        for(var i=0; i<result.xlsx.medio.data.length; i++){
          var tr = document.createElement("tr"); 
          tr.style.border = "solid 1px";
          for(var j=0; j<result.xlsx.medio.data[i].length; j++){
            var td = document.createElement("td");
            var myString = result.xlsx.medio.data[i][j].replace('(', '');
            myString = myString.replaceAll("_", " ");
            myString = myString.replace(')', '');
            myString = myString.replaceAll("'", '');            
            //myString = myString.replaceAll(' ', '');
            var myList = myString.split(",");
            td.style.background = myList[1];           
            if(isNaN(Number(myList[0]))){
              td.innerHTML = "<p style='margin:4px'>" + myList[0] + "</p>"; 
            }else{
              td.innerHTML = "<p style='margin:4px'>" + Number(myList[0]).toFixed(4) + "</p>"; 
            }
                       
            tr.appendChild(td);
          }  
          table_1.appendChild(tr);      
        }

        const tr_2 = document.createElement("tr"); 
        tr_2.style.border = "solid 1px";
        tr_2.style.height = "35px";
        tr_2.style.background = "red";
        table_1.appendChild(tr_2);

        const tr_3 = document.createElement("tr");
        tr_3.style.border = "solid 1px";
        tr_3.style.width = "100%";
        var td_3_0 = document.createElement("td");
        var td_3_1 = document.createElement("td");
        td_3_1.colSpan = 3;
        td_3_1.style.background = "red";        
        td_3_1.innerHTML = "<p style='margin:4px'>Altamente deficitario</p>"
        var td_3_2 = document.createElement("td");
        td_3_2.colSpan = 3;
        td_3_2.style.background = "rgb(255, 165, 0)";        
        td_3_2.innerHTML = "<p style='margin:4px'>Deficitario</p>"
        var td_3_3 = document.createElement("td");
        td_3_3.colSpan = 3;
        td_3_3.style.background = "rgb(238, 238, 0)";        
        td_3_3.innerHTML = "<p style='margin:4px'>Moderado o deficitario</p>"
        var td_3_4 = document.createElement("td");
        td_3_4.style.background = "rgb(152, 227, 32)";    
        td_3_4.colSpan = 3;    
        td_3_4.innerHTML = "<p style='margin:4px'>Moderado</p>"

        tr_3.appendChild(td_3_0);
        tr_3.appendChild(td_3_1);
        tr_3.appendChild(td_3_2);
        tr_3.appendChild(td_3_3);
        tr_3.appendChild(td_3_4);
        table_1.appendChild(tr_3);

        const tr_4 = document.createElement("tr");
        tr_4.style.border = "solid 1px";
        tr_4.style.width = "100%";
        var td_4_0 = document.createElement("td");
        var td_4_1 = document.createElement("td");
        td_4_1.colSpan = 3;
        td_4_1.style.background = "rgb(6, 186, 33)";        
        td_4_1.innerHTML = "<p style='margin:4px'>Moderado a excedentes</p>"
        var td_4_2 = document.createElement("td");
        td_4_2.colSpan = 3;
        td_4_2.style.background = "rgb(93, 209, 232)";        
        td_4_2.innerHTML = "<p style='margin:4px'>Excedentes</p>"
        var td_4_3 = document.createElement("td");
        td_4_3.colSpan = 3;
        td_4_3.style.background = "rgb(7, 88, 168)";        
        td_4_3.innerHTML = "<p style='margin:4px'>Altos excedentes</p>"
        var td_4_4 = document.createElement("td");
        td_4_4.style.background = "white";    
        td_4_4.colSpan = 3;    
        td_4_4.innerHTML = "<p style='margin:4px'></p>"

        tr_4.appendChild(td_4_0);
        tr_4.appendChild(td_4_1);
        tr_4.appendChild(td_4_2);
        tr_4.appendChild(td_4_3);
        tr_4.appendChild(td_4_4);
        table_1.appendChild(tr_4);
        
        this.space.appendChild(table_1);
        /********************************/

        /**********INDICE SECO**********/
        const divSeco = document.createElement("div");
        divSeco.setAttribute("class", 'divSeco');
        divSeco.style.marginTop = "16px";
        divSeco.style.background = "#41556b";
        divSeco.style.color = "white";
        divSeco.style.paddingLeft = "16px";
        divSeco.style.border = "solid 1px";
        divSeco.innerText = "AÑO SECO";

        this.space.appendChild(divSeco);
        
        const table_2 = document.createElement("table");
        table_2.style.fontSize = "0.8em";
        table_2.style.border = "solid 1px";
        table_2.style.width = "100%";
        const tr_2_1 = document.createElement("tr"); 
        for(var i=0; i<result.xlsx.seco.columns.length; i++){          
          const th_2_1 = document.createElement("th");
          th_2_1.innerHTML = "<p style='margin:4px'>" + result.xlsx.seco.columns[i] + "</p>";
          tr_2_1.appendChild(th_2_1);          
        }       
        table_2.appendChild(tr_2_1);

        for(var i=0; i<result.xlsx.seco.data.length; i++){
          var tr_22 = document.createElement("tr"); 
          tr_22.style.border = "solid 1px";
          for(var j=0; j<result.xlsx.seco.data[i].length; j++){
            var td22 = document.createElement("td");
            var myString = result.xlsx.seco.data[i][j].replace('(', '');
            myString = myString.replaceAll("_", " ");
            myString = myString.replace(')', '');
            myString = myString.replaceAll("'", '');            
            //myString = myString.replaceAll(' ', '');
            var myList = myString.split(",");
            td22.style.background = myList[1];
            if(isNaN(Number(myList[0]))){
              td22.innerHTML = "<p style='margin:4px'>" + myList[0] + "</p>";
            }else{
              td22.innerHTML = "<p style='margin:4px'>" + Number(myList[0]).toFixed(4) + "</p>";
            }
                        
            tr_22.appendChild(td22);
          }  
          table_2.appendChild(tr_22);      
        }

        const tr_2_11 = document.createElement("tr"); 
        tr_2_11.style.border = "solid 1px";
        tr_2_11.style.height = "35px";
        tr_2_11.style.background = "red";
        table_2.appendChild(tr_2_11);

        const tr_3_1 = document.createElement("tr");
        tr_3_1.style.border = "solid 1px";
        tr_3_1.style.width = "100%";
        var td_3_0_2 = document.createElement("td");
        var td_3_1_2 = document.createElement("td");
        td_3_1_2.colSpan = 3;
        td_3_1_2.style.background = "red";        
        td_3_1_2.innerHTML = "<p style='margin:4px'>Altamente deficitario</p>"
        var td_3_2_2 = document.createElement("td");
        td_3_2_2.colSpan = 3;
        td_3_2_2.style.background = "rgb(255, 165, 0)";        
        td_3_2_2.innerHTML = "<p style='margin:4px'>Deficitario</p>"
        var td_3_3_2 = document.createElement("td");
        td_3_3_2.colSpan = 3;
        td_3_3_2.style.background = "rgb(238, 238, 0)";        
        td_3_3_2.innerHTML = "<p style='margin:4px'>Moderado o deficitario</p>"
        var td_3_4_2 = document.createElement("td");
        td_3_4_2.style.background = "rgb(152, 227, 32)";    
        td_3_4_2.colSpan = 3;    
        td_3_4_2.innerHTML = "<p style='margin:4px'>Moderado</p>"

        tr_3_1.appendChild(td_3_0_2);
        tr_3_1.appendChild(td_3_1_2);
        tr_3_1.appendChild(td_3_2_2);
        tr_3_1.appendChild(td_3_3_2);
        tr_3_1.appendChild(td_3_4_2);
        table_2.appendChild(tr_3_1);

        const tr_4_2 = document.createElement("tr");
        tr_4_2.style.border = "solid 1px";
        tr_4_2.style.width = "100%";
        var td_4_0_2 = document.createElement("td");
        var td_4_1_2 = document.createElement("td");
        td_4_1_2.colSpan = 3;
        td_4_1_2.style.background = "rgb(6, 186, 33)";        
        td_4_1_2.innerHTML = "<p style='margin:4px'>Moderado a excedentes</p>"
        var td_4_2_2 = document.createElement("td");
        td_4_2_2.colSpan = 3;
        td_4_2_2.style.background = "rgb(93, 209, 232)";        
        td_4_2_2.innerHTML = "<p style='margin:4px'>Excedentes</p>"
        var td_4_3_2 = document.createElement("td");
        td_4_3_2.colSpan = 3;
        td_4_3_2.style.background = "rgb(7, 88, 168)";        
        td_4_3_2.innerHTML = "<p style='margin:4px'>Altos excedentes</p>"
        var td_4_4_2 = document.createElement("td");
        td_4_4_2.style.background = "white";    
        td_4_4_2.colSpan = 3;    
        td_4_4_2.innerHTML = "<p style='margin:4px'></p>"

        tr_4_2.appendChild(td_4_0_2);
        tr_4_2.appendChild(td_4_1_2);
        tr_4_2.appendChild(td_4_2_2);
        tr_4_2.appendChild(td_4_3_2);
        tr_4_2.appendChild(td_4_4_2);
        table_2.appendChild(tr_4_2);
        
        this.space.appendChild(table_2);
        /********************************/

        /**********INDICE HUMEDO**********/
        const divHumedo = document.createElement("div");
        divHumedo.setAttribute("class", 'divHumedo');
        divHumedo.style.marginTop = "16px";
        divHumedo.style.border = "solid 1px";
        divHumedo.style.background = "#41556b";
        divHumedo.style.color = "white";
        divHumedo.style.paddingLeft = "16px";
        divHumedo.innerText = "AÑO HUMEDO";

        this.space.appendChild(divHumedo);
        
        const table_3 = document.createElement("table");
        table_3.style.fontSize = "0.8em";
        table_3.style.border = "solid 1px";
        table_3.style.width = "100%";
        const tr_1_3 = document.createElement("tr"); 
        for(var i=0; i<result.xlsx.humedo.columns.length; i++){          
          const th_2_3 = document.createElement("th");
          th_2_3.innerHTML = "<p style='margin:4px'>" + result.xlsx.seco.columns[i] + "</p>";
          tr_1_3.appendChild(th_2_3);          
        }       
        table_3.appendChild(tr_1_3);

        for(var i=0; i<result.xlsx.humedo.data.length; i++){
          var tr_23 = document.createElement("tr"); 
          tr_23.style.border = "solid 1px";
          for(var j=0; j<result.xlsx.humedo.data[i].length; j++){
            var td23 = document.createElement("td");
            var myString = result.xlsx.humedo.data[i][j].replace('(', '');
            myString = myString.replaceAll("_", " ");
            myString = myString.replace(')', '');
            myString = myString.replaceAll("'", '');            
            //myString = myString.replaceAll(' ', '');
            var myList = myString.split(",");
            td23.style.background = myList[1];
            if(isNaN(Number(myList[0]))){
              td23.innerHTML = "<p style='margin:4px'>" + myList[0] + "</p>"; 
            }else{
              td23.innerHTML = "<p style='margin:4px'>" + Number(myList[0]).toFixed(4) + "</p>"; 
            }                       
            tr_23.appendChild(td23);
          }  
          table_3.appendChild(tr_23);      
        }

        const tr_2_13 = document.createElement("tr"); 
        tr_2_13.style.border = "solid 1px";
        tr_2_13.style.height = "35px";
        tr_2_13.style.background = "red";
        table_3.appendChild(tr_2_13);

        const tr_3_3 = document.createElement("tr");
        tr_3_3.style.border = "solid 1px";
        tr_3_3.style.width = "100%";
        var td_3_0_3 = document.createElement("td");
        var td_3_1_3 = document.createElement("td");
        td_3_1_3.colSpan = 3;
        td_3_1_3.style.background = "red";        
        td_3_1_3.innerHTML = "<p style='margin:4px'>Altamente deficitario</p>"
        var td_3_2_3 = document.createElement("td");
        td_3_2_3.colSpan = 3;
        td_3_2_3.style.background = "rgb(255, 165, 0)";        
        td_3_2_3.innerHTML = "<p style='margin:4px'>Deficitario</p>"
        var td_3_3_3 = document.createElement("td");
        td_3_3_3.colSpan = 3;
        td_3_3_3.style.background = "rgb(238, 238, 0)";        
        td_3_3_3.innerHTML = "<p style='margin:4px'>Moderado o deficitario</p>"
        var td_3_4_3 = document.createElement("td");
        td_3_4_3.style.background = "rgb(152, 227, 32)";    
        td_3_4_3.colSpan = 3;    
        td_3_4_3.innerHTML = "<p style='margin:4px'>Moderado</p>"

        tr_3_3.appendChild(td_3_0_3);
        tr_3_3.appendChild(td_3_1_3);
        tr_3_3.appendChild(td_3_2_3);
        tr_3_3.appendChild(td_3_3_3);
        tr_3_3.appendChild(td_3_4_3);
        table_3.appendChild(tr_3_3);

        const tr_4_3 = document.createElement("tr");
        tr_4_3.style.border = "solid 1px";
        tr_4_3.style.width = "100%";
        var td_4_0_3 = document.createElement("td");
        var td_4_1_3 = document.createElement("td");
        td_4_1_3.colSpan = 3;
        td_4_1_3.style.background = "rgb(6, 186, 33)";        
        td_4_1_3.innerHTML = "<p style='margin:4px'>Moderado a excedentes</p>"
        var td_4_2_3 = document.createElement("td");
        td_4_2_3.colSpan = 3;
        td_4_2_3.style.background = "rgb(93, 209, 232)";        
        td_4_2_3.innerHTML = "<p style='margin:4px'>Excedentes</p>"
        var td_4_3_3 = document.createElement("td");
        td_4_3_3.colSpan = 3;
        td_4_3_3.style.background = "rgb(7, 88, 168)";        
        td_4_3_3.innerHTML = "<p style='margin:4px'>Altos excedentes</p>"
        var td_4_4_3 = document.createElement("td");
        td_4_4_3.style.background = "white";    
        td_4_4_3.colSpan = 3;    
        td_4_4_3.innerHTML = "<p style='margin:4px'></p>"

        tr_4_3.appendChild(td_4_0_3);
        tr_4_3.appendChild(td_4_1_3);
        tr_4_3.appendChild(td_4_2_3);
        tr_4_3.appendChild(td_4_3_3);
        tr_4_3.appendChild(td_4_4_3);
        table_3.appendChild(tr_4_3);
        
        this.space.appendChild(table_3);
        /********************************/
      }
    });
  }
}