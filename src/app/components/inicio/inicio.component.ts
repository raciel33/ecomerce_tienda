import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from 'src/app/service/cliente.service';
import { GLOBAL } from 'src/app/service/GLOBAL';
import { GuestService } from 'src/app/service/guest.service';
declare var tns: any
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

  public descuento: any = undefined;
  public ultimos_prod: any = {};
  public mas_vendidos: any = {};

  public categoria : Array<any>= [];


  public url;

  constructor( private _router: ActivatedRoute,
    private _guetsService: GuestService, private _clienteService: ClienteService){
      this.url = GLOBAL.url

      this._clienteService.obtener_config_public().subscribe(
        (resp:any)=>{

          resp.data.categorias.forEach((element:any) => {
               if (element.titulo == 'Smartphones') {
                    this.categoria.push({
                      titulo: element.titulo,
                      portada: 'assets/img/ecommerce/home/categories/portadaSmartphone.jpg'
                    })
               }
               else if( element.titulo == 'TV'){
                this.categoria.push({
                  titulo: element.titulo,
                  portada: 'assets/img/ecommerce/home/categories/tv.jpg'
                })
               }
               else if( element.titulo == 'Altavoces'){
                this.categoria.push({
                  titulo: element.titulo,
                  portada: 'assets/img/ecommerce/home/categories/altavoz.jpg'
                })
               }
               else if( element.titulo == 'Portátiles'){
                this.categoria.push({
                  titulo: element.titulo,
                  portada: 'assets/img/ecommerce/home/categories/portatil.jpg'
                })
               }
               else if( element.titulo == 'Electrodomésticos'){
                this.categoria.push({
                  titulo: element.titulo,
                  portada: 'assets/img/ecommerce/home/categories/electrodomestico.jpg'
                })
               }
               else if( element.titulo == 'Accesorios'){
                this.categoria.push({
                  titulo: element.titulo,
                  portada: 'assets/img/ecommerce/home/categories/accesorios.jpg'
                })
               }
               else if( element.titulo == 'Auriculares'){
                this.categoria.push({
                  titulo: element.titulo,
                  portada: 'assets/img/ecommerce/home/categories/auriculares.jpg'
                })
               }
               else if( element.titulo == 'Consolas'){
                this.categoria.push({
                  titulo: element.titulo,
                  portada: 'assets/img/ecommerce/home/categories/consolas.jpg'
                })
               }



          });


          ;
        },err=>{
           console.log(err);
        }
      )

      console.log(this.categoria);


 }
  ngOnInit(): void {

    setTimeout(()=>{
      tns({
        container: '.cs-carousel-inner',
        controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
        mode: 'gallery',
        navContainer: '#pager',
        responsive: {
          0: { controls: false },
          991: { controls: true }
        }
      });

      tns({
        container: '.cs-carousel-inner-two',
        controls: false,
        responsive: {
          0: {
            gutter: 20
          },
          400: {
            items: 2,
            gutter: 20
          },
          520: {
            gutter: 30
          },
          768: {
            items: 3,
            gutter: 30
          }
        }

      });

      tns({
        container: '.cs-carousel-inner-three',
        controls: false,
        mouseDrag: !0,
        responsive: {
          0: {
            items: 1,
            gutter: 20
          },
          420: {
            items: 2,
            gutter: 20
          },
          600: {
            items: 3,
            gutter: 20
          },
          700: {
            items: 3,
            gutter: 30
          },
          900: {
            items: 4,
            gutter: 30
          },
          1200: {
            items: 5,
            gutter: 30
          },
          1400: {
            items: 6,
            gutter: 30
          }
        }


      });

      tns({
        container: '.cs-carousel-inner-four',
        nav: false,
        controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
        controlsContainer:'#custom-controls-trending',
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

      tns({
        container: '.cs-carousel-inner-five',
        controls: false,
        gutter: 30,
        responsive: {
          0: { items: 1 },
          380: { items: 2 },
          550: { items: 3 },
          750: { items: 4 },
          1000: { items: 5 },
          1250: { items: 6 }
        }

      });

      tns({
        container: '.cs-carousel-inner-six',
        controls: false,
        gutter: 15,
        responsive: {
          0: { items: 2 },
          500: { items: 3 },
          1200: { items: 3 }
        }

      });

    },1500);

    setTimeout(()=>{

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

     this.listar_productos_nuevos_publico();
     this.listar_mas_vendidos_publico();

    },1000);

  }


  listar_productos_nuevos_publico(){
     this._guetsService.listar_productos_nuevos_publico().subscribe(
      (resp: any ) =>{
      //  console.log(resp);
          this.ultimos_prod = resp.data
      }, err =>{
        console.log(err);

      }
     )
  }
  //listar_mas_vendidos_publico
  listar_mas_vendidos_publico(){
    this._guetsService.listar_mas_vendidos_publico().subscribe(
     (resp: any ) =>{
      // console.log(resp);
         this.mas_vendidos = resp.data
     }, err =>{
       console.log(err);

     }
    )
 }
}
