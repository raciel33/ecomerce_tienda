import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/service/cliente.service';
declare var iziToast: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public user: any = {};
  public cliente: any ={};

  public token;



  constructor(private _clienteService: ClienteService, private router: Router){

       this.token = localStorage.getItem('token');
        //si hay token al inicio
       if( this.token){
        this.router.navigate(['/']);
       }
  }

  login( loginForm: any){

    if (loginForm.valid) {

      let data = {
         email: this.user.email,
         password: this.user.password
      }

      this._clienteService.login_cliente( data).subscribe(
         (resp: any)=>{
          if (resp == undefined) {
            iziToast.show({
              title:'ERROR',
              titleColor:'#ff0000',
              class: 'text-danger',
              position: 'topRight',
              message: resp.msg
            })
          } else {

            this.cliente = resp.clienteBD;
            console.log(this.cliente);

            localStorage.setItem('token', resp.token);
            localStorage.setItem('_id', resp.clienteBD._id);

            this.router.navigate(['/'])
          }
         },
         err=>{
          iziToast.show({
            title:'ERROR',
            titleColor:'#ff0000',
            class: 'text-danger',
            position: 'topRight',
            message: err.error.msg
          })
        }

      )
    } else {
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
