import { Component, OnInit, ElementRef } from '@angular/core';

import { AccountsService } from '../account.service';

@Component({
  selector: 'app-indice-uso',
  templateUrl: './indice-uso.component.html',
  styleUrl: './indice-uso.component.scss'
})
export class IndiceUsoComponent implements OnInit {

  space: any;
  space1: any;

  constructor(private service:AccountsService, private elementRef:ElementRef){}

  ngOnInit(): void {
    this.service.listIndiceUso().subscribe({
      next: (result:any) => {
        this.space = this.elementRef.nativeElement.querySelector('.space');  
        this.renderTable(result.data_pivot_an);

        this.space1 = this.elementRef.nativeElement.querySelector('.space1');
        this.renderTable1(result.data_pivot_as);
      }
    });      
  }

  renderTable(data_pivot_an:any){        
    console.log(data_pivot_an.length);
    
    var myTable = document.createElement("table");
    myTable.setAttribute("class", 'table_iuh');
    myTable.style.marginTop = "16px";

    var myTrSHead = document.createElement("tr");
    myTrSHead.setAttribute("class", 'th_iuh');

    var myThSHead = document.createElement("th");
    myThSHead.setAttribute("class", 'th_iuh');
    myThSHead.colSpan = 6;        
    
    var myTrHead = document.createElement("tr");
    myTrHead.setAttribute("class", 'tr_iuh');

    var myTh_nomb = document.createElement("th");
    myTh_nomb.setAttribute("class", 'th_iuh');

    var myTh_can = document.createElement("th");
    myTh_can.setAttribute("class", 'th_iuh');        

    var myTh_cat = document.createElement("th");
    myTh_cat.setAttribute("class", 'th_iuh');

    var myTh_dh = document.createElement("th");
    myTh_dh.setAttribute("class", 'th_iuh');

    var myTh_iu = document.createElement("th");
    myTh_iu.setAttribute("class", 'th_iuh');

    var myTh_oh = document.createElement("th");
    myTh_oh.setAttribute("class", 'th_iuh');

    myThSHead.innerText = "AÑO NEUTRO";
    myTh_nomb.innerText = "nombre_sub_zona";
    myTh_can.innerText = "CA";
    myTh_cat.innerText = "Cat-IUA_N";
    myTh_dh.innerText = "DH_M3PS";
    myTh_iu.innerText = "IUA_N";
    myTh_oh.innerText = "OHRD_N";

    myTrSHead.appendChild(myThSHead);
    myTrHead.appendChild(myTh_nomb);
    myTrHead.appendChild(myTh_can);
    myTrHead.appendChild(myTh_cat);
    myTrHead.appendChild(myTh_dh);
    myTrHead.appendChild(myTh_iu);
    myTrHead.appendChild(myTh_oh);

    myTable.appendChild(myTrSHead);
    myTable.appendChild(myTrHead);


    for(var i=0; i<data_pivot_an.nombre_sub_zona.length; i++){
      const myTr = document.createElement("tr");
      myTr.setAttribute("class", 'tr_iuh');

      const myTd_nomb = document.createElement("td");
      myTd_nomb.innerText = data_pivot_an['nombre_sub_zona'][i];
      myTd_nomb.setAttribute("class", 'tr_iuh');
      
      var resultColor = this.catColor(data_pivot_an['Cat-IUA_N'][i])

      const myTd_can = document.createElement("td");
      myTd_can.innerText = data_pivot_an['CA'][i];
      myTd_can.setAttribute("class", 'tr_iuh');
      myTd_can.style.backgroundColor = resultColor;

      const myTd_cat = document.createElement("td");
      myTd_cat.innerText = data_pivot_an['Cat-IUA_N'][i];
      myTd_cat.setAttribute("class", 'tr_iuh');

      const myTd_dh = document.createElement("td");
      myTd_dh.innerText = data_pivot_an['DH_M3PS'][i];
      myTd_dh.setAttribute("class", 'tr_iuh');

      const myTd_iu = document.createElement("td");
      myTd_iu.innerText = data_pivot_an['IUA_N'][i];
      myTd_iu.setAttribute("class", 'tr_iuh');

      const myTd_oh = document.createElement("td");
      myTd_oh.innerText = data_pivot_an['OHRD_N'][i];
      myTd_oh.setAttribute("class", 'tr_iuh');
      
      myTr.appendChild(myTd_nomb);
      myTr.appendChild(myTd_can);
      myTr.appendChild(myTd_cat);
      myTr.appendChild(myTd_dh);
      myTr.appendChild(myTd_iu);
      myTr.appendChild(myTd_oh);

      myTable.appendChild(myTr);
    }
    this.space.appendChild(myTable);   
  }

  renderTable1(data_pivot_as){
    const myTable = document.createElement("table");
    myTable.setAttribute("class", 'table_iuh');
    myTable.style.marginTop = "16px";

    const myTrSHead = document.createElement("tr");
    myTrSHead.setAttribute("class", 'th_iuh');

    const myThSHead = document.createElement("th");
    myThSHead.setAttribute("class", 'th_iuh');
    myThSHead.colSpan = 6;        
    
    const myTrHead = document.createElement("tr");
    myTrHead.setAttribute("class", 'tr_iuh');

    const myTh_nomb = document.createElement("th");
    myTh_nomb.setAttribute("class", 'th_iuh');

    const myTh_can = document.createElement("th");
    myTh_can.setAttribute("class", 'th_iuh');        

    const myTh_cat = document.createElement("th");
    myTh_cat.setAttribute("class", 'th_iuh');

    const myTh_dh = document.createElement("th");
    myTh_dh.setAttribute("class", 'th_iuh');

    const myTh_iu = document.createElement("th");
    myTh_iu.setAttribute("class", 'th_iuh');

    const myTh_oh = document.createElement("th");
    myTh_oh.setAttribute("class", 'th_iuh');

    myThSHead.innerText = "AÑO SECO";
    myTh_nomb.innerText = "nombre_sub_zona";
    myTh_can.innerText = "CA_S";
    myTh_cat.innerText = "Cat-IUA_S";
    myTh_dh.innerText = "DH_M3PS";
    myTh_iu.innerText = "IUA_S";
    myTh_oh.innerText = "OHRD_S";

    myTrSHead.appendChild(myThSHead);
    myTrHead.appendChild(myTh_nomb);
    myTrHead.appendChild(myTh_can);
    myTrHead.appendChild(myTh_cat);
    myTrHead.appendChild(myTh_dh);
    myTrHead.appendChild(myTh_iu);
    myTrHead.appendChild(myTh_oh);

    myTable.appendChild(myTrSHead);
    myTable.appendChild(myTrHead);

    for(var i=0; i<data_pivot_as.nombre_sub_zona.length; i++){
      const myTr = document.createElement("tr");
      myTr.setAttribute("class", 'tr_iuh');

      const myTd_nomb = document.createElement("td");
      myTd_nomb.innerText = data_pivot_as['nombre_sub_zona'][i];
      myTd_nomb.setAttribute("class", 'tr_iuh');
      
      var resultColor = this.catColor(data_pivot_as['Cat-IUA_S'][i])

      const myTd_can = document.createElement("td");
      myTd_can.innerText = data_pivot_as['CA_S'][i];
      myTd_can.setAttribute("class", 'tr_iuh');
      myTd_can.style.backgroundColor = resultColor;

      const myTd_cat = document.createElement("td");
      myTd_cat.innerText = data_pivot_as['Cat-IUA_S'][i];
      myTd_cat.setAttribute("class", 'tr_iuh');

      const myTd_dh = document.createElement("td");
      myTd_dh.innerText = data_pivot_as['DH_M3PS'][i];
      myTd_dh.setAttribute("class", 'tr_iuh');

      const myTd_iu = document.createElement("td");
      myTd_iu.innerText = data_pivot_as['IUA_S'][i];
      myTd_iu.setAttribute("class", 'tr_iuh');

      const myTd_oh = document.createElement("td");
      myTd_oh.innerText = data_pivot_as['OHRD_S'][i];
      myTd_oh.setAttribute("class", 'tr_iuh');
      
      myTr.appendChild(myTd_nomb);
      myTr.appendChild(myTd_can);
      myTr.appendChild(myTd_cat);
      myTr.appendChild(myTd_dh);
      myTr.appendChild(myTd_iu);
      myTr.appendChild(myTd_oh);

      myTable.appendChild(myTr);
    }

    this.space1.appendChild(myTable);      
  }

  catColor(value:string){
    var color = ""
    switch(value){
      case "Muy Bajo":  color = "#90EE90";
                        break;
      case "Bajo":  color = "#FFFF99";
                    break;
      case "Moderado":  color = "#FFD700";
                        break;
      case "Alto":  color = "#FFA07A";
                    break;
      case "Muy Alto":  color = "#FF6347";
                  break;
    }
    return color;
  }

}
