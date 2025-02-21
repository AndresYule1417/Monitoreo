import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';


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

    //inicializacion de constructor con sus clases
    constructor(private service:CrudService, private activatedRoute:ActivatedRoute){}

    ngOnInit(): void {        
        const id = this.activatedRoute.snapshot.paramMap.get('id');//se obtiene el id de la url             
        //this.getProject_OHTS(id!);//funcion para renderizar graficas de OHTS        
    }
}