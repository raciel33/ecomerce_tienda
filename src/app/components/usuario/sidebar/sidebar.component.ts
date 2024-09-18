import { Component } from '@angular/core';
import { ClienteService } from 'src/app/service/cliente.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  public id;
  public cliente: any = undefined;
  public cliente_sesion: any = {};
  public token;

  constructor(private _clienteService: ClienteService){

       this.id = localStorage.getItem('_id');
       this.token = localStorage.getItem('token');


       if ( this.token) {

         //hacemos una consulta a la BD del cliente en la sesion y lo guardamos en el localStorage
         this._clienteService.get_cliente_sesion_id(this.id).subscribe(
           (resp: any)=>{

             this.cliente = resp.data
             //console.log(this.cliente);

             //se guarda el cliente en el localStorage para evitar la consulta
             localStorage.setItem('cliente', JSON.stringify(this.cliente));

           //si el cliente está en la sesion cogemos los datos del localStorage
            if (localStorage.getItem('cliente')) {

             this.cliente_sesion = localStorage.getItem('cliente');

             this.cliente_sesion = JSON.parse(this.cliente_sesion);

            // console.log(this.cliente_sesion);

            }else{
               this.cliente_sesion = undefined;
            }


           },
           err=>{
             console.log(err);
             this.cliente = undefined;
           }
         )
       }
  }
}
