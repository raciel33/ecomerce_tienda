import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ClienteService } from 'src/app/service/cliente.service';
import { GLOBAL } from 'src/app/service/GLOBAL';
import { io } from "socket.io-client";
import { GuestService } from 'src/app/service/guest.service';
import { PayamentService } from 'src/app/service/payament.service';

import { StripeService, Element, Elements as StripeElement , ElementsOptions, Elements } from 'ngx-stripe';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';



declare var iziToast: any;
//declare var Cleave: any //para el pago
declare var StickySidebar: any //para el scroll statico
declare var paypal: any;




interface HtmlInputEvent extends Event{
  target : HTMLInputElement & EventTarget;
}


@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  @ViewChild('paypalButton',{static:true}) paypalElement : ElementRef | any;

  public cliente_id: any = {};
  public carrito: Array<any> = []
  public subtotal = 0;
  public url;
  public totalPagar =0;
  public socket = io('http://localhost:3005');

  public direccion_principal: any = {};

  public envios:Array<any> =[];
  public precio_envio = "0";

  public venta: any = {};
  public detail_venta:Array<any> =[];

  public err_cupon = '';
  public descuento: any = undefined;

  public desc_cupon = 0;


  //Pago con tarjeta stripe------------------------------------
    public elements: Elements | any;
    public card: StripeElement | any;

    // optional parameters
    public elementsOptions: ElementsOptions = {

      locale: 'en'
    };

   public stripeForm: FormGroup | any;
   public payamentStatus: any;
   public stripeData: any;
   public submitted: any;
   public loading: any
//---------------------------------------------------------------------

//Nota: el objeto venta se va rellenando en distintas funciones ( lo especifico cuando ocurra )

  constructor( private _clienteService: ClienteService, private _guestService: GuestService,
     private _stripeService: StripeService, private fb: FormBuilder,private _payamentService: PayamentService, private _router: Router
    ){

          this.url = GLOBAL.url
          this.cliente_id = localStorage.getItem('_id');
          this.venta.cliente  = this.cliente_id; //objeto venta.cliente

          this.get_carrito_cliente();

          // formas de envio
          this._guestService.get_envios().subscribe(
            (resp: any)=>{

              this.envios = resp

             // console.log(this.envios);
            }
          )

  }

  ngOnInit(): void {

   // console.log(this.carrito);
    //eliminar en realtime
     this.socket.on('new-carrito', this.get_carrito_cliente.bind(this));



     setTimeout(()=>{

   // -------------  viene de la documentacion de https://nosir.github.io/cleave.js/------------

      //valida el numero de la tarjeta
    //   new Cleave('#cc-number', {
    //     creditCard: true,
    //         onCreditCardTypeChanged: function (type: any) {
    //             // update UI ...
    //         }
    //     });
    //  })
    //  //valida mes y año
    //  new Cleave('#cc-exp-date', {
    //       date: true,
    //       datePattern: ['m', 'y']
    //   });

      var sidebar = new StickySidebar('.sidebar-sticky', {topSpacing: 20});
//---------------------------------------------------------------------------------------------

     this.get_direccion_principal()


     //----------paypal-----------------
     //email: sb-zdots33264221@business.example.com
     //password: mMA,F-x0

     paypal.Buttons({
                style: {
                    layout: 'horizontal'
                },
                createOrder: (data: any,actions: any)=>{

                    return actions.order.create({
                      purchase_units : [{
                        description : 'Nombre del pago',
                        amount : {
                          currency_code : 'USD',
                          value: this.subtotal
                        },
                      }]
                    });

                },
                onApprove : async (data: any,actions: any)=>{
                        const order = await actions.order.capture();
                       //console.log(order);

                         // Al hacer la compra---------------

                         //id de la transaccion
                        this.venta.transaccion = order.purchase_units[0].payments.captures[0].id;////objeto venta.transaccion

                      //  console.log(this.detail_venta);

                      //preparamos el this.venta para el envío al backend
                      this.venta.details = this.detail_venta;

                      //registramos la compra-----------
                      this._clienteService.registro_compra_cliente( this.venta ).subscribe(
                       (resp: any) =>{
                        console.log(resp);

                        //envio de confirmacion al correo de la compra
                          this._clienteService.envio_correo_compra_cliente( resp.venta._id).subscribe(
                            resp=>{
                              console.log(resp);
                            },
                            err=>{
                              console.log(err);
                            }
                          )


                        Swal.fire({
                          position: "top-end",
                          icon: "success",
                          title: "Compra realizada con exito",
                          showConfirmButton: false,
                          timer: 1500
                    });

                        setTimeout(() => {
                          this.get_carrito_cliente()
                        }, 1000);

                        this._router.navigate(['/'])

                       },
                       err =>{
                         console.log(err);

                       }
                      )


                      },
                      onError : (err : any) =>{
                        console.log(err);

                      },
                      onCancel: function (data: any,actions: any) {

                      }
                    }).render(this.paypalElement.nativeElement);


//------pago- tarjeta-stripe

     this.loading = false;
     this.createForm();

     this._stripeService.elements( this.elementsOptions ).subscribe(
      elements =>{
        this.elements = elements;
        if( !this.card ){
          this.card = this.elements.create('card',{
            iconStyle: 'solid',
            style: {
              base: {
                iconColor: '#666EE8',
                color: '#31325F',
                lineHeight: '40px',
                fontWeight: 300,
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSize: '18px',
                '::placeholder': {
                  color: '#CFD7E0'
                }
              }
            }
          })

          this.card.mount('#card-element')
        }
      }
     )

    })
    //obtener los descuentos activos que hay en la tienda
    this._guestService.obtener_descuento_activo().subscribe(
      (resp:any)=>{
        if (resp.data != undefined) {
          this.descuento = resp.data[0]
          console.log(this.descuento);

        } else {
          this.descuento = undefined
        }
      },
      err=>{

      }
    )

  }


  //pago con tarjeta conectado a stripe

createForm(){

  this.stripeForm = this.fb.group({

    name:['',[ Validators.required]],
    amount:['',[ Validators.required]]

  })
}

//pago con tarjeta
buy() {
  this.submitted = true;
  this.loading = true;
  this.stripeData = this.stripeForm.value;

  const name = this.stripeForm.get('name').value;

  this._stripeService.createToken(this.card, { name }).subscribe
  ((result: any) => {
      if (result.token) {

        this.stripeData['token'] = result.token;
        this.stripeData.name = this.direccion_principal.destinatario;
        this.stripeData.amount = this.totalPagar;

        this._payamentService.realizar_pago_tarjeta( this.stripeData ).subscribe(
          (resp:any)=>{
            if( resp['success']){
              this.loading = false;
              this.submitted = false;
              this.payamentStatus = resp['status'];
               //registramos la compra-----------

             //id de la transaccion
            this.venta.transaccion = result.token.id;////objeto venta.transaccion

            //preparamos el this.venta para el envío al backend
            this.venta.details = this.detail_venta;

               this._clienteService.registro_compra_cliente( this.venta ).subscribe(
                (resp: any) =>{
                 console.log(resp);

                 //envio de confirmacion al correo de la compra
                this._clienteService.envio_correo_compra_cliente( resp.venta._id).subscribe(
                  resp=>{
                    console.log(resp);
                  },
                  err=>{
                    console.log(err);
                  }
                )


                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Compra realizada con exito",
                  showConfirmButton: false,
                  timer: 1500
            });

                 setTimeout(() => {
                   this.get_carrito_cliente()
                 }, 1000);

                 this._router.navigate(['/'])


                },
                err =>{
                  console.log(err);

                }
               )
            }else{
              this.loading = false;
              this.submitted = false;
              this.payamentStatus = resp['status'];
            }
          }
        )


      } else if (result.error) {
        // Error creating the token
        iziToast.show({
          title:'ERROR',
          titleColor:'#ff0000',
          class: 'text-danger',
          position: 'topRight',
          message: result.error.message
        })
        console.log(result.error.message);
      }
    });
}

//----------------------------------------------------------------------------------------------------
  get_carrito_cliente(){
     //carrito del cliente
     this._clienteService.get_carrito_cliente( this.cliente_id).subscribe(
      (resp: any) =>{
        this.carrito = resp.data
       console.log(this.carrito);

      //se rellena el array detail_venta
      this.carrito.forEach( element => {

        this.detail_venta.push({
              producto : element.producto._id,
              subtotal : element.producto.precio,
              variedad : element.variedad,
              cantidad : element.cantidad,
              cliente : this.cliente_id,
        })

       //console.log(this.detail_venta);
      })

      //total del carrito
      this.calcular_carrito();

      this.calcular_total('Envío gratis')
      },err=>{

      }
     )
  }

//----------------------------------------------------------------------------------------------------

  //se calcula el importe del carrito
  calcular_carrito(){
    this.subtotal = 0;
    if( this.descuento == undefined){

      this.carrito.forEach(element=>{

        this.subtotal = this.subtotal + parseInt(element.producto.precio);
      }
      )
    }
    //si hay descuento
    else if( this.descuento != undefined){

      this.carrito.forEach(element=>{

        //parseInt(element.producto.precio)*this.descuento.descuento)/100 --> calculo del porcentaje del descuento

        let precio_con_descuento = Math.round(parseInt(element.producto.precio) - ( parseInt(element.producto.precio)*this.descuento.descuento)/100)

        this.subtotal = this.subtotal + precio_con_descuento;
      }
      )
    }
  }

//------------------------------------------------------

  //calcula el importe del carrito + el coste del envío
  calcular_total( envio_titulo: any ){


    this.totalPagar = this.subtotal + parseInt(this.precio_envio);

    this.venta.subtotal = this.totalPagar; //objeto venta.subtotal

    this.venta.envio_precio = parseInt(this.precio_envio) ////objeto venta.envio_precio

    this.venta.envio_titulo = envio_titulo; ////objeto venta.envio_titulo

    console.log(this.venta);


  }


  //----------------------------------------------------------------------------------------------------
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

        this.socket.emit('delete-carrito', { data: resp.data })
        //console.log(resp);
        this.get_carrito_cliente();
      }, err=>{

      }
    )
  }



//----------------------------------------------------------------------------------------------------
//direccion principal de envío
  get_direccion_principal(){

    this._clienteService.get_direccion_principal( this.cliente_id ).subscribe(

      (resp: any )=>{

        if (resp.data == undefined) {

          this.direccion_principal = undefined;

        } else {

          this.direccion_principal = resp.data

          this.venta.direccion = this.direccion_principal._id // //objeto venta.direccion


        }
      },err=>{
        console.log(err);

      }
    )
  }

validar_cupon(){

   if (this.venta.cupon) {
    if (this.venta.cupon.toString().length <= 25 ) {
      //si es valido
      this.err_cupon = '';

      this._clienteService.validarCupon( this.venta.cupon).subscribe(
        (resp:any)=>{
          //cupon valido
          if( resp.data != undefined){
            this.err_cupon = '';

            //calculo del descuento segun el tipo de cupon

            if ( resp.data.tipo == 'Valor fijo') {

              this.desc_cupon = resp.data.valor;
              this.totalPagar = this.totalPagar - this.desc_cupon;
            }
            else if(  resp.data.tipo == 'Porcentaje' ){

              this.desc_cupon = (this.totalPagar *  resp.data.valor)/100;
              this.totalPagar = this.totalPagar - this.desc_cupon;
            }



          }else{
            this.err_cupon = 'El cupón no se pudo aplicar'

          }
        },err=>{

        }
      )

    }else{
      //no es valido
      this.err_cupon = 'El cupón debe ser menos de 25 caracteres'
    }
   } else {
     this.err_cupon = 'El cupón no es valido'
   }

}

}
