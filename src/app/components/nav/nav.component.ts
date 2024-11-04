import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/service/cliente.service';
import { GLOBAL } from 'src/app/service/GLOBAL';

import { io } from "socket.io-client";

declare var iziToast: any;
declare var $: any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit{

  public id;
  public cliente: any = undefined;
  public cliente_sesion: any = {};
  public token;
  public config_global : any= {};
  public open_cart = false;
  public carrito: Array<any> = []
  public url;
  public subtotal = 0;
  public socket = io('http://localhost:3005')

  constructor(private _clienteService: ClienteService, private _router: Router){


    this.url = GLOBAL.url

       this.id = localStorage.getItem('_id');
       this.token = localStorage.getItem('token');

       this.init_data_tienda();

       if ( this.token) {

         //hacemos una consulta a la BD del cliente en la sesion y lo guardamos en el localStorage
         this._clienteService.get_cliente_sesion_id(this.id).subscribe(
           (resp: any)=>{

             this.cliente = resp.data
             //console.log(this.cliente);

             //se guarda el cliente en el localStorage para evitar la consulta
             localStorage.setItem('cliente', JSON.stringify(this.cliente));

           //si el cliente está en la sesion cogemos los datos del localStorage
            if (localStorage.getItem('cliente')) {

             this.cliente_sesion = localStorage.getItem('cliente');

             this.cliente_sesion = JSON.parse(this.cliente_sesion);

             //  console.log(this.cliente_sesion);

             //carrito del cliente
             this.get_carrito_cliente();


            }else{
               this.cliente_sesion = undefined;

            }


           },
           err=>{
             console.log(err);
             this.cliente_sesion = undefined;


           }
         )
       }else{
        this.cliente_sesion = undefined;
              }


  }


ngOnInit(): void {

//eliminar en realtime
 this.socket.on('new-carrito', this.get_carrito_cliente.bind(this));

 //añadir al carrito con socket para que se haga en realtime
 this.socket.on('add-new-carrito', this.get_carrito_cliente.bind(this));


}

//información de la tienda
  init_data_tienda(){
    this._clienteService.obtener_config_public().subscribe(
     (resp:any)=>{
       this.config_global = resp.data
      // console.log(this.config_global);
     },err=>{
        console.log(err);
     }
   )
}

//carrito del cliente
get_carrito_cliente(){
    this._clienteService.get_carrito_cliente( this.cliente_sesion._id).subscribe(
      (resp: any) =>{
        this.carrito = resp.data
      //  console.log(this.carrito);

      //total del carrito
      this.calcular_carrito()
      },err=>{

      }
     )
}
  logout(){
    //window.location.reload();
    localStorage.clear();
    this._router.navigate(['/'])

  }

  //modal lateral con el carrito
  open_modal_cart(){
    if( !this.open_cart){
      this.open_cart = true
        $('#cart').addClass('show')
    }
    else{
      this.open_cart = false
      $('#cart').removeClass('show')
    }
  }

  //precio total del carrito
  calcular_carrito(){
    this.subtotal = 0;
    this.carrito.forEach(element=>{

      this.subtotal = this.subtotal + parseInt(element.producto.precio);
    }
    )
  }

  //eliminacion en el carrito , se utiliza socket para que actualice pagina en realtime
  eliminar_item(id: any){
    this._clienteService.delete_carrito_cliente( id ).subscribe(
      (resp: any)=>{
        iziToast.show({
          title:'OK',
          titleColor:'#0D922A',
          class: 'text-success',
          position: 'topRight',
          message: 'Producto eliminado'
        })

        this.socket.emit('delete-carrito', { data: resp.data})
       // console.log(resp);

       this.get_carrito_cliente();
      }, err=>{

      }
    )
  }
}
