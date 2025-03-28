import { Component, OnInit } from '@angular/core';

import { AccountsService } from '../account.service';

@Component({
  selector: 'app-indice-uso',
  templateUrl: './indice-uso.component.html',
  styleUrl: './indice-uso.component.scss'
})
export class IndiceUsoComponent implements OnInit {

  constructor(private service:AccountsService){}

  ngOnInit(): void {
    this.service.listIndiceUso().subscribe({
      next: (result) => {
        console.log(result);
      }, error: (e) => {
        console.log(e);
      }
    });
  }

}
