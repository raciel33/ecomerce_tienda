import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/service/cliente.service';
declare var iziToast: any;
declare var $:any;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public cliente: any ={};
  public id:any ;
  public cargando: boolean = false;



constructor( private _clienteService: ClienteService){
  this.id = localStorage.getItem('_id');
  this.init_data_perfil()



}

init_data_perfil(){
  if( this.id){
    this._clienteService.get_cliente_sesion_id(this.id).subscribe(
      (resp: any)=>{
        this.cliente = resp.data
      //  console.log(this.cliente);

      },
      err=>{
        console.log(err);
        this.cliente = undefined;
      }
    )

  }
}

  ngOnInit(): void {

    }
  actualizar(actualizarForm:any){

    this.cargando = true;


    if(actualizarForm.valid){

      //se obtiene el password con JQUERY
      this.cliente.password = $('#input_password').val()

      this._clienteService.update_cliente_perfil( this.cliente ).subscribe(
          (resp:any)=>{
             iziToast.show({
              title:'OK',
              titleColor:'#0D922A',
              class: 'text-success',
              position: 'topRight',
              message: 'Perfil actualizado'
            })

           // this.cliente = resp.data
            this.init_data_perfil();

            this.cargando = false;

               },err=>{
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

}
