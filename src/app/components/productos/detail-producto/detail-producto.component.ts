import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ClienteService } from 'src/app/service/cliente.service';
import { GLOBAL } from 'src/app/service/GLOBAL';
import { GuestService } from 'src/app/service/guest.service';
import { io } from "socket.io-client";

declare var tns: any;
declare var lightGallery:any
declare var iziToast: any;

@Component({
  selector: 'app-detail-producto',
  templateUrl: './detail-producto.component.html',
  styleUrls: ['./detail-producto.component.css']
})
export class DetailProductoComponent implements OnInit{

  public slug: any;
  public producto: any = {}
  public url;
  public prod_recomendado: Array<any> = [];

  public carrito_data: any = {
    variedad:'',
    cantidad : 1
  }
  public descuento: any = undefined;

  public cargando = false;
  public socket = io('http://localhost:3005')

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


 //para la paginacion
 public p: number = 1;
 public pageSize = 5;



  constructor( private _route: ActivatedRoute, private _gusestService: GuestService,
    private _clienteServices: ClienteService,
  ){
    this.url = GLOBAL.url

    this._route.params.subscribe(
      params =>{
        this.slug = params['slug'];

        this._gusestService.detalle_producto_publico(this.slug).subscribe(
          (resp:any) =>{

            this.producto = resp.data
            //console.log(this.producto);


    this._gusestService.listar_productos_recomendados_publico( this.producto.categoria).subscribe(
      (resp:any)=>{
        this.prod_recomendado = resp.data;
       //console.log(this.prod_recomendado);

      },
      err=>{
        console.log(err);
      }
    )
          },
          err=>{

          }
        )
      }
    )

  }


  ngOnInit(): void {

    //Tiempo de un segundo para que se carguen las imagenes del slider
    setTimeout(() =>{

      tns({
       //SECCION PARA DETALLE DE PRODUCTOS--Configuracion del Slider de imagenes
         container: '.cs-carousel-inner',
         controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
         navPosition: "top",
         controlsPosition: "top",
         mouseDrag: !0,
         speed: 600,
         autoplayHoverPause: !0,
         autoplayButtonOutput: !1,
         navContainer: "#cs-thumbnails",
         navAsThumbnails: true,
         gutter: 15,

       });

       var e = document.querySelectorAll(".cs-gallery");
       if (e.length){
         for (var t = 0; t < e.length; t++){
           lightGallery(e[t], { selector: ".cs-gallery-item", download: !1, videojs: !0, youtubePlayerParams: { modestbranding: 1, showinfo: 0, rel: 0 }, vimeoPlayerParams: { byline: 0, portrait: 0 } });
         }
       }

       //SECCION DE PRODUCTOS recomendados--Configuracion del Slider de imagenes
    tns({
      container: '.cs-carousel-inner-two',
      controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
      navPosition: "top",
      controlsPosition: "top",
      mouseDrag: !0,
      speed: 600,
      autoplayHoverPause: !0,
      autoplayButtonOutput: !1,
      nav: false,
      controlsContainer: "#custom-controls-related",

      responsive: {
        0: {
          items: 1,
          gutter: 20
        },
        480: {
          items: 2,
          gutter: 24
        },
        700: {
          items: 3,
          gutter: 24
        },
        1100: {
          items: 4,
          gutter: 30
        }
      }
    });

    }, 1000)

  //obtener los descuentos activos que hay en la tienda
  this._gusestService.obtener_descuento_activo().subscribe(
    (resp:any)=>{
      if (resp.data != undefined) {
        this.descuento = resp.data[0]
        console.log(this.descuento);

      } else {
        this.descuento = undefined
      }

      this.listar_reviews_producto_publico();

    },
    err=>{

    }

  )


  }




  agregarProducto(){
    if (this.carrito_data.variedad) {
      if (this.carrito_data.cantidad <= this.producto.stock) {

        let data = {
          producto: this.producto._id,
          cliente : localStorage.getItem('_id'),
          cantidad: this.carrito_data.cantidad,
          variedad: this.carrito_data.variedad,
        }
        this.cargando = true

     this._clienteServices.agregar_carrito_cliente( data ).subscribe(
      (resp:any)=>{

         if (resp.data == undefined) {
          iziToast.show({
            title:'ERROR',
            titleColor:'#ff0000',
            class: 'text-danger',
            position: 'topRight',
            message: 'EL producto ya existe en el carrito'
        })
        this.cargando = false

         }
         else{

           iziToast.show({
            title:'OK',
            titleColor:'#0D922A',
            class: 'text-success',
            position: 'topRight',
            message: 'Producto añadido'
          })
         //comunicacion con sockest para que se añada en realtime( componente receptor nav.component.ts)
         this.socket.emit('add-carrito',{ data:true});

          console.log(resp);

          this.cargando = false
         }


      },
      err=>{
 console.log(err);
      }
     )


      }else{
        iziToast.show({
          title:'ERROR',
          titleColor:'#ff0000',
          class: 'text-danger',
          position: 'topRight',
          message: 'Solo quedan ' + this.producto.stock + ' en stock'
      })
      }

    } else {
      iziToast.show({
          title:'ERROR',
          titleColor:'#ff0000',
          class: 'text-danger',
          position: 'topRight',
          message: 'Seleccione variedad de producto'
      })
    }
  }


  listar_reviews_producto_publico(){

    this._gusestService.listar_reviews_producto_publico( this.producto._id ).subscribe(
      resp=>{
        this.reviews = resp.data

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

       // console.log(this.puntos_rating);
      },err=>{

      }
    )
  }

}


