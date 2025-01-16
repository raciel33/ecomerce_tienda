import { Component } from '@angular/core';
import { ClienteService } from 'src/app/service/cliente.service';
declare var iziToast: any;

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {

  public contacto: any = {};
  public cargando = false

  constructor( private _clienteService: ClienteService){

  }

  registro( registroForm: any ){

    this.cargando = true;

    if( registroForm.valid){
      this._clienteService.enviar_mensaje_contacto( this.contacto).subscribe(
        (resp:any)=>{
          console.log(resp);
          iziToast.show({
            title:'OK',
            titleColor:'#0D922A',
            class: 'text-success',
            position: 'topRight',
            message: 'Mensaje enviado'
          })


          this._clienteService.envio_correo_mensaje_cliente( resp.data._id).subscribe(
            resp=>{
                  console.log(resp);

            }
          )
          this.contacto = {};
          this.cargando = false

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

}
