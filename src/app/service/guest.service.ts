import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './GLOBAL';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  public url;

  constructor( private _http: HttpClient) {
    this.url = GLOBAL.url
 }



 detalle_producto_publico(slug: any  ){

 let headers = new HttpHeaders().set('Content-Type','application/json')

    return this._http.get(`${this.url}/detalle_producto_publico/` + slug, {headers: headers})

  }


  listar_productos_recomendados_publico(categoria: any  ){

    let headers = new HttpHeaders().set('Content-Type','application/json')

       return this._http.get(`${this.url}/listar_productos_recomendados_publico/${categoria}`,  {headers: headers})

     }

  //comunidades autonomas
  get_ccaa( ){
       return this._http.get('./assets/ccaa.json')
     }


  //provincias referencia a ccaa
  get_provincias( ){
       return this._http.get('./assets/provincias.json')
     }


  //poblaciones referencia a provincias
  get_poblaciones( ){
      return this._http.get('./assets/poblaciones.json')
    }

      //poblaciones referencia a los envios
  get_envios( ){
    return this._http.get('./assets/envios.json')
  }


  obtener_descuento_activo(){

    let headers = new HttpHeaders().set('Content-Type','application/json')

       return this._http.get(`${this.url}/obtener_descuento_activo/` , {headers: headers})

     }
}
