import { Routes, RouterModule } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { InicioComponent } from "./components/inicio/inicio.component";
import { LoginComponent } from "./components/login/login.component";
import { PerfilComponent } from "./components/usuario/perfil/perfil.component";

import { AuthGuard } from './guards/auth.guard';
import { IndexProductoComponent } from "./components/productos/index-producto/index-producto.component";
import { DetailProductoComponent } from "./components/productos/detail-producto/detail-producto.component";
import { CarritoComponent } from "./components/carrito/carrito.component";
import { DireccionesComponent } from "./components/usuario/direcciones/direcciones.component";
import { ContactoComponent } from "./components/contacto/contacto.component";
import { IndexOrdersComponent } from "./components/usuario/orders/index-orders/index-orders.component";
import { DetailsOrderComponent } from "./components/usuario/orders/details-order/details-order.component";
import { IndexReviewComponent } from "./components/usuario/review/index-review/index-review.component";
import { DevolucionComponent } from "./components/productos/devolucion/devolucion.component";

const appRoute : Routes = [
 { path: '', component: InicioComponent},
 { path: 'login', component: LoginComponent},

 { path: 'cuenta/perfil', component: PerfilComponent, canActivate:[ AuthGuard]},
 { path: 'cuenta/direcciones', component: DireccionesComponent, canActivate:[ AuthGuard]},
 { path: 'cuenta/orders', component: IndexOrdersComponent, canActivate:[ AuthGuard]},
 { path: 'cuenta/detail_orders/:id', component: DetailsOrderComponent, canActivate:[ AuthGuard]},
 { path: 'cuenta/review', component: IndexReviewComponent, canActivate:[ AuthGuard]},

 { path: 'carrito', component: CarritoComponent, canActivate:[ AuthGuard]},

 { path: 'productos', component: IndexProductoComponent},
 { path: 'productos/categoria/:categoria', component: IndexProductoComponent},
 { path: 'productos/:slug', component: DetailProductoComponent},
 { path: 'dev/producto/:id', component: DevolucionComponent, canActivate: [ AuthGuard ] },

 { path: 'contacto', component: ContactoComponent},





];

export const appRoutingProvide: any [] = [];

export const routing : ModuleWithProviders<any> = RouterModule.forRoot(appRoute);
