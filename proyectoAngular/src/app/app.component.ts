import { Component } from '@angular/core';
import { GuardsCheckStart } from '@angular/router';
import { HttpHeaders, HttpClient } from'@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

constructor(private http: HttpClient) {}

  title = 'my new proyect';
  nombre = '';
  apellido = '';
  

  hizoClick(){
    this.nombre = 'Liza Minelli';
  }
  
  async guardar(){
   const body = {
     nombre: this.nombre,
     apellido: this.apellido
   }
   var respuesta = await this.http.post('https://localhost:3000/api/artistas', body).toPromise();
   
} 

}//end AppComponent
  