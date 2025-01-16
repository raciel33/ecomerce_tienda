import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/service/cliente.service';
import { GLOBAL } from 'src/app/service/GLOBAL';

@Component({
  selector: 'app-index-orders',
  templateUrl: './index-orders.component.html',
  styleUrls: ['./index-orders.component.css']
})
export class IndexOrdersComponent implements OnInit{

  public url;
  public orders:Array<any>= [];
  public cargando = true;

   //para la paginacion
 public p: number = 1;
 public pageSize = 5;

 public pedidos:Array<any>= [];

 public orden:Array<any>= [];

 constructor(private _clienteService: ClienteService){
    this.url = GLOBAL.url

  }


  ngOnInit(): void {

      this.get_orders_cliente()
      this.get_pedidos_cliente()

  }

  get_orders_cliente(){

    this._clienteService.get_orders_cliente( localStorage.getItem('_id')).subscribe(
      (resp: any)=>{
        this.orders = resp.data;

         // console.log(this.orders);



             this.cargando = false
      },
      err=>{

      }
    )
  }

   get_pedidos_cliente(){

     this._clienteService.get_pedidos_cliente(localStorage.getItem('_id')).subscribe(
       (resp: any)=>{

        console.log(resp);

         this.pedidos = resp.detail_venta;

         this.orden = resp.data

           //se recorre las respuesta de detail_venta y para cada iteracion se busca una reseña del producto
           resp.detail_venta.forEach((element: any) => {

            this._clienteService.get_review_producto_cliente( element.producto._id).subscribe(
             (resp: any)=>{
             //  console.log(resp);
               let emitido = false;

               //se recorre el resultado de la iteracion anterior
               resp.data.forEach((_element:any) => {

                 //si el cliente que emitio la reseña es el mismo de la sesion
                 if (_element.cliente == localStorage.getItem('_id')) {
                      emitido = true
                 }
               });
               element.estado = emitido //se añade el campo estado a detail_order para comprobar si tiene reseña o no
             }
            )
      });


       //  console.log(this.pedidos);
       //  console.log(this.orden);

       }
     )
   }
}
