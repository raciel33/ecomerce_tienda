import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from 'src/app/service/cliente.service';
import { GLOBAL } from 'src/app/service/GLOBAL';

import { io } from "socket.io-client";
import { GuestService } from 'src/app/service/guest.service';

declare var noUiSlider:any;
declare var $: any
declare var iziToast: any;

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent implements OnInit {

  //info de la tienda
  public config_global: any = {};

  public url;

  //busqueda de categoria
  public filter_categoria = ''
  public productos: any= [];

  //filtro de producto
  public filtro :any = '';

  public cargando = true;

  //productos por categoria
  public filter_cat_productos = 'todos';
  public route_categoria: any;

  //para la paginacion
 public p: number = 1;

 //paginacion y orden productos
 public pageSize = 10;

  //ordenar productos
  public sort_by= 'Defecto';

  public carrito_data: any = {
    variedad:'',
    cantidad : 1
  }

  public descuento: any = undefined;

  public load_btn = false;

  public socket = io('http://localhost:3005')



  constructor( private _clienteService: ClienteService, private _router: ActivatedRoute,
     private _clienteServices: ClienteService, private _guetsService: GuestService){

        this.url = GLOBAL.url

       this.init_data_tienda();

       this.lista_productos();

/**NOTA: En el navbar podemos seleccionar productos por categoria ,hay una ruta :
'productos/categoria/:categoria' donde se le pasa desde el navbar la categoria por parametro
para que el index.producto la capte y muestre los productos por dicha categoria
 */
   this._router.params.subscribe(
    params=>{
      //se capta la categoria por parametro
      this.route_categoria = params['categoria'];

      if (this.route_categoria) {

        /**Nota: He metido el filtro por categoria dentro del listado para se muestre correctamenta
              * al ir cambiando de una categoria a otra
             */
        this._clienteService.listar_productos_publico(this.filtro ).subscribe(
          (resp:any)=>{
               this.productos = resp.data;
               //se filtra los productos por categorias
               this.productos = this.productos.filter((item :any)=>item.categoria.toLowerCase() == this.route_categoria )

               this.cargando = false;
          },
          (          err: any)=>{

          }
        )
      } else {

        this.lista_productos();

      }
    }

   )
  }

  init_data_tienda(){
       //información de la tienda
       this._clienteService.obtener_config_public().subscribe(
        (resp:any)=>{
          this.config_global = resp.data
         // console.log(this.config_global);
        },err=>{
           console.log(err);
        }
      )
  }

  lista_productos(){
    //console.log(this.filtro);
    this._clienteService.listar_productos_publico(this.filtro ).subscribe(
      (resp:any)=>{
           console.log(resp);
           this.productos = resp.data;

           this.cargando = false;
      },
      err=>{

      }
    )
  }

  reset_productos(){
    this.filtro = '';
    this.lista_productos();

  }


  ngOnInit(): void {


    //-----------BARRA DE PRECIO QUE SE MUESTRA EN EL ASIDE--------------
          //elemento slider
        var slider : any = document.getElementById('slider');

        //creacion de la barra slider
        noUiSlider.create(slider, {
            start: [0, 1000],
            connect: true,
            range: {
                'min': 0,
                'max': 1000
            },
            tooltips: [true,true],
            pips: {
              mode: 'count',
              values: 5,

            }
        })

        slider.noUiSlider.on('update', function (values: any[]) {
            $('.cs-range-slider-value-min').val(values[0]);
            $('.cs-range-slider-value-max').val(values[1]);
        });
        $('.noUi-tooltip').css('font-size','11px');


        //obtener los descuentos activos que hay en la tienda
        this._guetsService.obtener_descuento_activo().subscribe(
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
//FUNCIONES EN EL NAVBAR DEL CONTAINER
orden_por(){

  if( this.sort_by == 'Defecto'){
    this.lista_productos();
  }
  else if(this.sort_by == 'Popularidad'){
     //se toma como referencia para la popularidad el numero de ventas de los productos
     this.productos.sort(function(a: any,b: any){
         if(a.n_ventas < b.n_ventas){
          return 1
         }
         if(a.n_ventas > b.n_ventas){
          return -1
         }
        return 0
     })
  }
  else if(this.sort_by == '+-Precio'){
    //se toma como referencia para la popularidad el numero de ventas de los productos
    this.productos.sort(function(a: any,b: any){
        if(a.precio < b.precio){
         return 1
        }
        if(a.precio > b.precio){
         return -1
        }
       return 0
    })
 }
 else if(this.sort_by == '-+Precio'){
  //se toma como referencia para la popularidad el numero de ventas de los productos
  this.productos.sort(function(a: any,b: any){
      if(a.precio > b.precio){
       return 1
      }
      if(a.precio < b.precio){
       return -1
      }
     return 0
  })
}
else if(this.sort_by == 'azTitulo'){
  //se toma como referencia para la popularidad el numero de ventas de los productos
  this.productos.sort(function(a: any,b: any){
      if(a.titulo > b.titulo){
       return 1
      }
      if(a.titulo < b.titulo){
       return -1
      }
     return 0
  })

}
else if(this.sort_by == 'zaTitulo'){
  //se toma como referencia para la popularidad el numero de ventas de los productos
  this.productos.sort(function(a: any,b: any){
      if(a.titulo < b.titulo){
       return 1
      }
      if(a.titulo > b.titulo){
       return -1
      }
     return 0
  })
}

}
  //ESTAS FUNCIONES ESTAN EN EL ASIDE
  filtrar_categoria(){

    if (this.filter_categoria) {

      //variable local que va rastrear el array de this.config_global.categorias y se va a quedar con el titulo
      var search = new RegExp(this.filter_categoria, 'i');

      this.config_global.categorias = this.config_global.categorias.filter(
        (item:any)=> search.test(item.titulo)
      )
    } else {
        this.init_data_tienda();
    }
  }

  filtar_precio(){
   /**Nota: He metido el filtro por el precio dentro del listado para se muestre
    * los productos tanto cuando hay filtrado por precio y cuando no
    */
    this._clienteService.listar_productos_publico(this.filtro ).subscribe(
      (resp:any)=>{

           this.productos = resp.data;

           //valor min y max
           let min = parseInt($('.cs-range-slider-value-min').val())
           let max = parseInt( $('.cs-range-slider-value-max').val())

           //filtro del producto con estos valores
           this.productos = this.productos.filter((item: any)=>{
            return item.precio >= min && item.precio <= max

           })      },
      err=>{

      }
    )




  }

  buscar_prod_x_categoria(){
  // console.log(this.filter_cat_productos);

        if (this.filter_cat_productos == 'todos') {
           this.lista_productos();
        } else {
             /**Nota: He metido el filtro por categoria dentro del listado para se muestre correctamenta
              * al ir cambiando de una categoria a otra
             */
          this._clienteService.listar_productos_publico(this.filtro ).subscribe(
            (resp:any)=>{
                 this.productos = resp.data;
                 //se filtra los productos por categorias
                 this.productos = this.productos.filter((item :any)=>item.categoria == this.filter_cat_productos )

                 this.cargando = false;
            },
            err=>{

            }
          )

            }
  }


  agregarProducto(producto: any){
    console.log(producto);

    if (this.carrito_data.cantidad <= producto.stock) {

      let data = {
        producto: producto._id,
        cliente : localStorage.getItem('_id'),
        cantidad: 1,
        variedad: producto.variedades[0].titulo,
      }
      this.load_btn = true

   this._clienteServices.agregar_carrito_cliente( data ).subscribe(
    (resp:any)=>{
      console.log(data);

       if (resp.data == undefined) {
        iziToast.show({
          title:'ERROR',
          titleColor:'#ff0000',
          class: 'text-danger',
          position: 'topRight',
          message: 'EL producto ya existe en el carrito'
      })
      this.load_btn = false

       }
       else{

         iziToast.show({
          title:'OK',
          titleColor:'#0D922A',
          class: 'text-success',
          position: 'topRight',
          message: 'Producto añadido'
        })

        console.log(resp);

        //comunicacion con sockest para que se añada en realtime( componente receptor nav.component.ts)
        this.socket.emit('add-carrito',{ data:true});

        this.load_btn = false
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
        message: 'Solo quedan ' + producto.stock + ' en stock'
    })
    }
  }


}
