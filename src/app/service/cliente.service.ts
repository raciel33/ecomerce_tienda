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


//--------cliente
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

 obtener_config_public( ){

  return this._http.get(`${this.url}/obtener_config_public`, this.headers)

 }

 listar_productos_publico(filtro: any  ){

  return this._http.get(`${this.url}/listar_productos_publico/` + filtro, this.headers)

}

get_producto_id( id: any ):Observable<any>{

  console.log(id);
  return this._http.get(`${this.url}/get_producto_id/`+id ,this.headers)

 }

detalle_producto_publico(data: any  ){

  return this._http.post(`${this.url}/detalle_producto_publico/` , data, this.headers)

}


agregar_carrito_cliente(data: any  ){

  return this._http.post(`${this.url}/agregar_carrito_cliente/` , data, this.headers)

}

get_carrito_cliente(id: any  ){

  return this._http.get(`${this.url}/get_carrito_cliente/`+ id , this.headers)

}
//
delete_carrito_cliente(id: any  ){

  return this._http.delete(`${this.url}/delete_carrito_cliente/`+ id , this.headers)

}
//Direcciones del cliente---------------

registro_direccion_cliente(data: any  ){

  return this._http.post(`${this.url}/registro_direccion_cliente/`, data , this.headers)

}
listar_direccion_cliente(id: any  ){

  return this._http.get(`${this.url}/listar_direccion_cliente/`+id , this.headers)

}
cambiar_direccion_principal(id: any , cliente_id: any ){

  return this._http.put(`${this.url}/cambiar_direccion_principal/`+id + '/'+ cliente_id,{data:true}, this.headers)

}
borrar_direccion(id: any  ){

  return this._http.delete(`${this.url}/borrar_direccion/`+id + '/', this.headers)

}

get_direccion_principal(id: any  ){

  return this._http.get(`${this.url}/get_direccion_principal/`+id + '/', this.headers)

}
//compra-------
registro_compra_cliente(data: any  ){

  return this._http.post(`${this.url}/registro_compra_cliente/`, data , this.headers)

}

//pagos
//realizar_pago_tarjeta

realizar_pago_tarjeta( ){

  return this._http.post(`/create-checkout-session/` , this.headers)

}

envio_correo_compra_cliente( id: any){
  return this._http.get(`${this.url}/envio_correo_compra_cliente/`+id , this.headers)

}

validarCupon( cupon: any){
  return this._http.get(`${this.url}/validarCupon/`+cupon , this.headers)

}

//Contacto

enviar_mensaje_contacto( data: any){
  return this._http.post(`${this.url}/enviar_mensaje_contacto/`, data , this.headers)

}

envio_correo_mensaje_cliente( id: any){
  return this._http.get(`${this.url}/envio_correo_mensaje_cliente/` + id , this.headers)

}

//ordernes del cliente
get_orders_cliente( id: any){
  return this._http.get(`${this.url}/get_orders_cliente/`+id , this.headers)

}
//
get_detail_order_cliente( id: any){
  return this._http.get(`${this.url}/get_detail_order_cliente/`+id , this.headers)

}
//
get_pedidos_cliente( id: any){
  return this._http.get(`${this.url}/get_pedidos_cliente/`+id , this.headers)

}
//Reseñas del cliente
//
emitir_review_producto_cliente( data: any){
  return this._http.post(`${this.url}/emitir_review_producto_cliente/`, data , this.headers)

}
//
get_review_producto_cliente( id: any){
  return this._http.get(`${this.url}/get_review_producto_cliente/`+id , this.headers)

}
//
get_review_cliente( id: any){
  return this._http.get(`${this.url}/get_review_cliente/`+id , this.headers)

}
//devolucion

registro_dev_prod_cliente( data: any){

 // console.log(data);
  return this._http.post(`${this.url}/registro_dev_prod_cliente/${data.venta_id}` , data , this.headers)

}
//
get_detail_venta( id: any){
  return this._http.get(`${this.url}/get_detail_venta/`+id , this.headers)

}
}
