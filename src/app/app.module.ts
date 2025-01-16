import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { DireccionesComponent } from './components/usuario/direcciones/direcciones.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import {  NgxStripeModule } from 'ngx-stripe';
import { DescuentosPipe } from './pipes/descuentos.pipe';
import { ContactoComponent } from './components/contacto/contacto.component';
import { IndexOrdersComponent } from './components/usuario/orders/index-orders/index-orders.component';
import { DetailsOrderComponent } from './components/usuario/orders/details-order/details-order.component';

import { RatingModule } from 'ng-starrating';
import { IndexReviewComponent } from './components/usuario/review/index-review/index-review.component';
import { DevolucionComponent } from './components/productos/devolucion/devolucion.component';



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
    DireccionesComponent,
    CheckoutComponent,
    DescuentosPipe,
    ContactoComponent,
    IndexOrdersComponent,
    DetailsOrderComponent,
    IndexReviewComponent,
    DevolucionComponent,


  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    RatingModule,
    HttpClientModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    NgxStripeModule.forRoot('pk_test_51QC60CKzje4IjR2rrNmHOmapYwSRSzgT5q8qGZF7wQQS7RrxQsNV88beMhuEwanShqRI0GPKBvdazqNUQemy1zyI00MHLttpDL')


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
