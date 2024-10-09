import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/service/cliente.service';
import { GLOBAL } from 'src/app/service/GLOBAL';
import { io } from "socket.io-client";
declare var iziToast: any;

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  public cliente_id: any = {};
  public carrito: Array<any> = []
  public subtotal = 0;
  public url;
  public totalPagar =0;
  public socket = io('http://localhost:3005')

  constructor( private _clienteService: ClienteService){

    this.url = GLOBAL.url

    this.cliente_id = localStorage.getItem('_id');

    this.get_carrito_cliente();

  }

  ngOnInit(): void {

    //eliminar en realtime
     this.socket.on('new-carrito', this.get_carrito_cliente.bind(this));




    }


  get_carrito_cliente(){
     //carrito del cliente
     this._clienteService.get_carrito_cliente( this.cliente_id).subscribe(
      (resp: any) =>{
        this.carrito = resp.data
      //  console.log(this.carrito);

      //total del carrito
      this.calcular_carrito()
      },err=>{

      }
     )
  }
  calcular_carrito(){
    this.carrito.forEach(element=>{

      this.subtotal = this.subtotal + parseInt(element.producto.precio);
    }
    );
    this.totalPagar = this.subtotal
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
        console.log(resp);
      }, err=>{

      }
    )
  }
}
