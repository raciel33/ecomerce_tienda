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


//para extraer los headers(token)
get headers(){
  return {
    headers: {
      'x-token':this.token //el this.token esta en la funcion get token()
     }
   }
}
  //Para extraer el token
  get token():string{
    return localStorage.getItem( 'token') || '';
  }



 detalle_producto_publico(slug: any  ){

 let headers = new HttpHeaders().set('Content-Type','application/json')

    return this._http.get(`${this.url}/detalle_producto_publico/` + slug, {headers: headers})

  }


  listar_productos_recomendados_publico(categoria: any  ){

    let headers = new HttpHeaders().set('Content-Type','application/json')

       return this._http.get(`${this.url}/listar_productos_recomendados_publico/${categoria}`,  {headers: headers})

     }
     //

     listar_productos_nuevos_publico(){

      let headers = new HttpHeaders().set('Content-Type','application/json')

         return this._http.get(`${this.url}/listar_productos_nuevos_publico/`,  {headers: headers})

       }
       //
       listar_mas_vendidos_publico(){

        let headers = new HttpHeaders().set('Content-Type','application/json')

           return this._http.get(`${this.url}/listar_mas_vendidos_publico/`,  {headers: headers})

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

listar_reviews_producto_publico(id: any):Observable<any>{

  let headers = new HttpHeaders().set('Content-Type','application/json')

      return this._http.get(`${this.url}/listar_reviews_producto_publico/${id}`, {headers: headers})

    }
  //

  starts_reviews_producto_publico( data: any):Observable<any>{

    //let headers = new HttpHeaders().set('Content-Type','application/json')

        return this._http.put(`${this.url}/starts_reviews_producto_publico/${data.id}`, data  )

      }
}
