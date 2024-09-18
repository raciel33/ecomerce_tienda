import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './GLOBAL';
import { JwtHelperService } from '@auth0/angular-jwt';

declare var iziToast: any;


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  public url;
  public user : any;

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


/*------------------------Para los guards----------------------------------------------*/
validarToken():boolean{

  const token = this.token;

  if (!token ) {
    return false;
  }
  try {
      //asi podemos validar un token
       const helper = new JwtHelperService();
       const decodedToken  = helper.decodeToken( token );

       if(!decodedToken){
        console.log('token no valido');
        localStorage.clear();

         return false;
        }

        if (helper.isTokenExpired( token)) {
          localStorage.clear();
          return false;
        }


      } catch (error) {
        localStorage.clear();

         return false;
     }


    return true;

   }



 login_cliente(data: any ){

  return this._http.post(`${this.url}/login_cliente`,data, this.headers)

 }

   get_cliente_sesion_id( id:any){
    return this._http.get(`${this.url}/get_cliente_sesion_id/`+id , this.headers)

   }
 update_cliente_perfil( data: any){
  let headers = new HttpHeaders({'x-token': this.token})

  return this._http.put(`${this.url}/update_cliente_perfil/${data._id}`, data , this.headers)

 }
}
