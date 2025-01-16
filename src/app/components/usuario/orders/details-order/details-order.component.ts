import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { StarRatingComponent } from 'ng-starrating';
import { ClienteService } from 'src/app/service/cliente.service';
import { GLOBAL } from 'src/app/service/GLOBAL';
import { GuestService } from 'src/app/service/guest.service';

declare var iziToast: any;
declare var $: any

@Component({
  selector: 'app-details-order',
  templateUrl: './details-order.component.html',
  styleUrls: ['./details-order.component.css']
})
export class DetailsOrderComponent implements OnInit{

  public detail_order:Array<any>= [];
  public order: any = {};
  public cargando = true;
  public id: any;
  public url;
  public totaStarts = 5;

  public review: any = {};

  public reviews: Array<any> = [];

  //contador de estrellas
  public count_five_start = 0;
  public count_four_start = 0;
  public count_three_start = 0;
  public count_two_start = 0;
  public count_one_start = 0;

  //calculo del porcentaje en base a las reseñas
  public total_puntos = 0;
  public max_puntos = 0;
  public porcent_rating = 0;
  public puntos_rating = 0;


  //para el progressBar de las reviews
  public cinco_porcent = 0;
  public cuatro_porcent = 0;
  public tres_porcent = 0;
  public dos_porcent = 0;
  public uno_porcent = 0;


  constructor(private _clienteService: ClienteService, private _route: ActivatedRoute,
    private _guestService: GuestService
  ){

    this.url = GLOBAL.url


    this._route.params.subscribe(
      params=>{
        this.id = params['id']
      }
    )
  }


  ngOnInit(): void {
    this.get_detail_order_cliente()


}

//-------Resañas del clienta-------------
onRate($event:{oldValue:number, newValue:number, starRating:StarRatingComponent}) {

  this.totaStarts = $event.newValue

}

//Cargamos parte de la data de las review antes de abrir el modal
openModal( item: any){

  this.totaStarts = 5;

  this.review = {};

  this.review.producto = item.producto._id;
  this.review.cliente = item.cliente;
  this.review.venta = this.id

}
//Completamos la data de las review con el formulario del modal
emitirReview( id: any){
  console.log(this.review);
  if( this.review.review ){

    if (this.totaStarts && this.totaStarts >=0) {

      this.review.starts = this.totaStarts

      this._clienteService.emitir_review_producto_cliente( this.review ).subscribe(
        resp=>{

          this._guestService.listar_reviews_producto_publico( this.review.producto ).subscribe(
            (resp: any)=>{
              this.reviews = resp.data

              console.log(this.reviews);
              //Para contar las reseñas por el numero de estrellas

              resp.data.forEach((element: any) => {

                if(element.starts == 5){
                  this.count_five_start  += 1 ;
                }
                else if( element.starts == 4){
                  this.count_four_start +=1;

                }
                else if( element.starts == 3){
                  this.count_three_start +=1;

                }
                else if( element.starts == 2){
                  this.count_two_start +=1;

                }
                else if( element.starts == 1){
                  this.count_one_start +=1;

                }
              });

              //calculo del porcentaje por cada puntuacion de las reseñas

              this.cinco_porcent = ( this.count_five_start *100 )/resp.data.length;
              this.cuatro_porcent = ( this.count_four_start *100 )/resp.data.length
              this.tres_porcent = ( this.count_three_start *100 )/resp.data.length
              this.dos_porcent = ( this.count_two_start *100 )/resp.data.length
              this.uno_porcent = ( this.count_one_start *100 )/resp.data.length

              //calculo del valor de las reseñas

              let cinco_puntos = this.count_five_start * 5;
              let cuatro_puntos = this.count_four_start * 4;
              let tres_puntos = this.count_three_start * 3;
              let dos_puntos = this.count_two_start * 2;
              let un_punto = this.count_one_start * 1;

              this.total_puntos = cinco_puntos + cuatro_puntos + tres_puntos + dos_puntos + un_punto

              this.max_puntos = resp.data.length * 5;

              //porcentaje total de las reseñas
              this.porcent_rating = ( this.total_puntos * 100 )/this.max_puntos

              //puntuacion total de las reseñas
              this.puntos_rating = ( this.porcent_rating * 5)/100

             console.log(this.puntos_rating);

             let data = {
              id: this.review.producto,
              start: this.puntos_rating
             }

             this._guestService.starts_reviews_producto_publico( data ).subscribe(
              resp=>{
                console.log(resp);
              }
             )

            },err=>{

            }
          )


          iziToast.show({
          title:'OK',
          titleColor:'#0D922A',
          class: 'text-success',
          position: 'topRight',
          message: 'Reseña emitida correctamente'
        });


        //cerrar el modal
          $('#review-'+id).modal('hide');
          $('.modal-backrop').removeClass('show');

          this.get_detail_order_cliente();

       }
       ,
       err=>{}

      )



    }else{
      iziToast.show({
        title:'ERROR',
        titleColor:'#ff0000',
        class: 'text-danger',
        position: 'topRight',
        message: 'Seleccione el numero de estrellas'
      })
    }
  }else{
    iziToast.show({
      title:'ERROR',
      titleColor:'#ff0000',
      class: 'text-danger',
      position: 'topRight',
      message: 'Ingrese valoración del producto'
    })
  }
}


//----------------------------------------------------------------------
  get_detail_order_cliente(){
   // console.log(this.id);
    this._clienteService.get_detail_order_cliente( this.id ).subscribe(
      (resp: any)=>{
       // console.log(resp);
           if (resp.data!= undefined) {

             this.order = resp.data;

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

             this.detail_order = resp.detail_venta;
             this.cargando = false;

           } else {

             this.order = undefined;
           }

           console.log(this.detail_order);

      },
      err=>{
        console.log(err);

      }
    )
  }

}
