import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from'@angular/common/http';

@Component({
  selector: 'app-nuevo-componente',
  templateUrl: './nuevo-componente.component.html',
  styleUrls: ['./nuevo-componente.component.css']
})
export class NuevoComponenteComponent implements OnInit {
   
  listado:any =  [];

  constructor(private http: HttpClient) { }


  async ngOnInit() {
    this.listado = await this.http.get('http://10.128.35.136:3000/api/artistas').toPromise();
  }

}
