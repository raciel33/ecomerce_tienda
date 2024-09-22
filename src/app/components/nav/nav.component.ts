import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/service/cliente.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  public id;
  public cliente: any = undefined;
  public cliente_sesion: any = {};
  public token;
  public config_global : any= {};

  constructor(private _clienteService: ClienteService, private _router: Router){

       this.id = localStorage.getItem('_id');
       this.token = localStorage.getItem('token');

       this.init_data_tienda();

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


            }else{
               this.cliente_sesion = undefined;

            }


           },
           err=>{
             console.log(err);
             this.cliente_sesion = undefined;


           }
         )
       }else{
        this.cliente_sesion = undefined;
              }


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
  logout(){
    //window.location.reload();
    localStorage.clear();
    this._router.navigate(['/'])

  }
}
