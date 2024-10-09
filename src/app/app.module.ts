import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InicioComponent } from './components/inicio/inicio.component';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/usuario/perfil/perfil.component';
import { SidebarComponent } from './components/usuario/sidebar/sidebar.component';
import { IndexProductoComponent } from './components/productos/index-producto/index-producto.component';

import {NgxPaginationModule} from 'ngx-pagination';
import { DetailProductoComponent } from './components/productos/detail-producto/detail-producto.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { DireccionesComponent } from './components/usuario/direcciones/direcciones.component'; // <-- import the module


@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    NavComponent,
    FooterComponent,
    LoginComponent,
    PerfilComponent,
    SidebarComponent,
    IndexProductoComponent,
    DetailProductoComponent,
    CarritoComponent,
    DireccionesComponent
  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
