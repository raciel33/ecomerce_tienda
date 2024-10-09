import { Component } from '@angular/core';
import { GuestService } from 'src/app/service/guest.service';

declare var $: any
@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.component.html',
  styleUrls: ['./direcciones.component.css']
})
export class DireccionesComponent {

  public direccion: any = {
    pais: '',
    region: '',
    provincia:'',
    poblaciones: '',
    principal: false
  }

  public region:Array<any> = [];
  public provincia:Array<any> = [];
  public poblaciones:Array<any> = [];

  constructor(private _guestServices: GuestService){


  }

  //Cuando se selecciona el pais se activa  input( region)
  //metodo llamado en un change en los option de paises
 select_pais(){
    //si el país es España se le quita el disabled de region
    if( this.direccion.pais == 'España'){

      //se activa el input de region
      $('#sl-region').prop('disabled', false);

      this._guestServices.get_ccaa().subscribe(
        (resp: any)=>{

          //se rellena this.region con la respuesta del servicio
         resp.forEach( (element: any) =>{
            this.region.push({
              label: element.label,
              code: element.code,

            })
          })

          console.log(this.region);
        } );
    }else {
      //si no es españa vuelve a estar disabled
      $('#sl-region').prop('disabled', true);
      $('#sl-provincia').prop('disabled', true);
      $('#sl-poblaciones').prop('disabled', true);

      //se vacian los inputs
      this.region = [];
      this.provincia = [];
      this.poblaciones = [];
    }
   }


  //metodo llamado en un change en los option de region

   select_region(){

      this.provincia = [];

      //se activa el input
      $('#sl-provincia').prop('disabled', false);

      //se desactiva y reinicia los inputs( para que funcione correctamente al cambiar de region y no se quede activado)
      $('#sl-poblaciones').prop('disabled', true);
      this.direccion.provincia = ''
      this.direccion.poblaciones = '';


      this._guestServices.get_provincias().subscribe(
        (resp: any)=>{

         resp.forEach( (element: any) =>{

           //Nota: en el option value = code es el valor id que se le ha dado a cada item de this.direccion.region en su en ngModel

           //si la provincia pertenece a la region(estan referenciados el parent_code de provincia con el code de region)
           //se compara cada parent_code de provincia con cada id de region y se rellena this.provincias con los coincidentes

          if (element.parent_code == this.direccion.region) {
              this.provincia.push(
                element
              )
            }
          })

          console.log(this.provincia);
        } );



   }

  //metodo llamado en un change en los option de provincia

   select_provincia(){

     this.poblaciones = [];

     //se activa el input de poblaciones
     $('#sl-poblaciones').prop('disabled', false);


      //se  reinicia los inputs( para que funcione correctamente al cambiar de provincia y no se quede activado)
     this.direccion.poblaciones = '';

     this._guestServices.get_poblaciones().subscribe(
       (resp: any)=>{

        resp.forEach( (element: any) =>{

         // Nota: en el option value =_id es el valor que se le ha dado a cada item de this.direccion.region en su en ngModel

          //si la poblaciones pertenece a la provincia(estan referenciados el parent_code de poblaciones con el code de provincia)
          //se compara cada parent_code de poblaciones con cada code de provincia y se rellena this.provincias con los coincidentes

         if (element.parent_code == this.direccion.provincia) {
             this.poblaciones.push(
               element
             )
           }
         })

         console.log(this.poblaciones);
       } );



 }
}
