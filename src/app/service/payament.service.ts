import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import { GLOBAL } from './GLOBAL';



@Injectable({
  providedIn: 'root'
})
export class PayamentService {

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



  realizar_pago_tarjeta(data: any ){
    console.log(data);

    return this._http.post(`${this.url}/realizar_pago_tarjeta`,data, this.headers)

   }


}
