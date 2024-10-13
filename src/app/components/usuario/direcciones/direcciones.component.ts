import { Component, Input } from '@angular/core';
import { ClienteService } from 'src/app/service/cliente.service';
import { GuestService } from 'src/app/service/guest.service';

declare var $: any
declare var iziToast: any;

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


  public provincia_name: any
  public poblacion_name: any

  public direcciones:Array<any> = [];

  public cargando = true


  constructor(private _guestServices: GuestService,
    private _clienteService: ClienteService){



  }

 ngOnInit(): void {

  this.get_direcciones()

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

         // console.log(this.region);
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

         // console.log(this.direccion.region);

         resp.forEach( (element: any) =>{

          // Nota: el option [ngValue]="item" contiene el valor de todo su item como un objeto en cada iteracion del ngfor
          //Nota: si quisiera darle un solo valor al option usaria value = {{item.label}} por ejemplo para tener el valor de cada item.label

          // si la provincia pertenece a la region(estan referenciados el parent_code de provincia con el code de region)
           //se compara cada parent_code de provincia con cada id de region y se rellena this.provincias con los coincidentes

           if (element.parent_code == this.direccion.region.code) {

            this.provincia.push(
                {
                  label: element.label,
                  code: element.code
              }
               )
             }
           })

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


          // Nota: el option [ngValue]="item" contiene el valor de todo su item como un objeto en cada iteracion del ngfor
          //Nota: si quisiera darle un solo valor al option usaria value = {{item.label}} por ejemplo para tener el valor de cada item.label

          //si la poblaciones pertenece a la provincia(estan referenciados el parent_code de poblaciones con el code de provincia)
          //se compara cada parent_code de poblaciones con cada code de provincia y se rellena this.provincias con los coincidentes


         if (element.parent_code == this.direccion.provincia.code) {

          //se recoge el label del [(ngModel)]="direccion.provincia"
           this.provincia_name =  this.direccion.provincia.label


           this.poblaciones.push(
             {
               label: element.label,
               code: element.code
              }
            )
          }
        })



        } );

 }
 select_poblacion(){

  //se recoge el label del [(ngModel)]="direccion.poblaciones"
      this.poblacion_name = this.direccion.poblaciones.label
    //  console.log(this.poblacion_name);

 }


 //Registro de direccion de un cliente
 registrar(registroForm: any){

  if( registroForm.valid){

    //se rellena la data
    let data = {

      destinatario : this.direccion.destinatario,
      dni : this.direccion.dni,
      cp : this.direccion.cp,
      direccion : this.direccion.direccion,
      telefono : this.direccion.telefono,
      pais : this.direccion.pais,
      region : this.direccion.region.label,
      provincia : this.provincia_name,
      poblacion : this.poblacion_name,
      principal : this.direccion.principal,
      cliente: localStorage.getItem('_id')
    }


    //se envia la data
    this._clienteService.registro_direccion_cliente(data).subscribe(
      resp =>{
            console.log(resp);
            //una vez enviada la direccion se resetan los inputs
             this.direccion = {
              pais: '',
              region: '',
              provincia:'',
              poblaciones: '',
              principal: false
            }
          //y se bloquean los selects
          //si no es españa vuelve a estar disabled
          $('#sl-region').prop('disabled', true);
          $('#sl-provincia').prop('disabled', true);
          $('#sl-poblaciones').prop('disabled', true);

          iziToast.show({
            title:'OK',
            titleColor:'#0D922A',
            class: 'text-success',
            position: 'topRight',
            message: 'Direccion nueva añadida correctamente'
          })

          this.get_direcciones()

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
      message: 'Formulario no válido'
    })
  }

 }

 get_direcciones(){

  let id = localStorage.getItem('_id');

  this._clienteService.listar_direccion_cliente(id).subscribe(
    (resp:any)=>{
       this.direcciones = resp.data

       this.cargando = false;
    },
    err=>{
      console.log(err);

    }
  )
 }
 borrar_direccion( id: any){
     this._clienteService.borrar_direccion(id).subscribe(
      resp =>{
        iziToast.show({
          title:'OK',
          titleColor:'#0D922A',
          class: 'text-success',
          position: 'topRight',
          message: 'Direccion eliminada correctamente'
        })
        this.get_direcciones();
      },
      err=>{
         console.log(err);
      }
     )
 }

 establecer_dir_principal( id: any){
  let cliente_id = localStorage.getItem('_id');

    this._clienteService.cambiar_direccion_principal( id, cliente_id).subscribe(
      resp=>{
             console.log(resp);

          iziToast.show({
            title:'OK',
            titleColor:'#0D922A',
            class: 'text-success',
            position: 'topRight',
            message: 'Direccion principal actualizada'
          })
             this.get_direcciones();
      },err=>{
        console.log(err);

      }

    )
 }
}
