import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from 'src/app/service/cliente.service';
import { GLOBAL } from 'src/app/service/GLOBAL';
import Swal from 'sweetalert2';
declare var iziToast: any;

@Component({
  selector: 'app-devolucion',
  templateUrl: './devolucion.component.html',
  styleUrls: ['./devolucion.component.css'],
})
export class DevolucionComponent {

  public cargando = true;
  public producto: any ={};
  public venta: any ={};
   public fecha = new Date()
  public id: any;
  public url;
  public estado: String ='' ;
  public imgSelect: any | ArrayBuffer ;

  public devolucion: any = {};

  constructor( private _clienteService: ClienteService, private _route: ActivatedRoute,  private router: Router){
    this.url = GLOBAL.url;



  }

  ngOnInit(): void {

     this.init_data()

  }

  init_data(){
    this._route.params.subscribe(
      params => {
        this.id = params['id'];

        this._clienteService.get_detail_venta( this.id ).subscribe(
          (resp: any) =>{

            console.log(resp);

            if( resp.detail_venta == undefined){

              this.producto = undefined;

            }else{

              this.producto = resp.detail_venta[0].producto
              this.venta = resp.detail_venta

             this.estado = this.venta[0].estado;

              //Imagen de portada del producto seleccionado para actualizar
              this.imgSelect = this.url + '/obtener_portada/'+ this.producto.portada

              this.devolucion = {
                detail_venta: this.id,
                venta_id: this.id,
                cliente: localStorage.getItem('_id'),
                producto: this.producto,
                estado: 'Iniciada',

              }
            }
          }


        )


      }


    );
  }





  devolver(registroForm:any){
    this.cargando = true;
    if( registroForm.valid){
     // console.log(this.devolucion);
     Swal.fire({
      title: "Estás seguro ",
      text: "Vas a devolver este producto: " + this.producto.titulo,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {

        this._clienteService.registro_dev_prod_cliente( this.devolucion).subscribe(
          resp=>{
            console.log(resp);
            iziToast.show({
              title:'OK',
              titleColor:'#0D922A',
              class: 'text-success',
              position: 'topRight',
              message: 'Devolución iniciada'
            });

            this.router.navigate(['/cuenta/orders']);
          },err=>{
            console.log(err);
          }
        )

      }
    });




   }else{
     iziToast.show({
       title:'ERROR',
       titleColor:'#ff0000',
       class: 'text-danger',
       position: 'topRight',
       message: 'Formulario no válido'
     })
   }
  }

}


