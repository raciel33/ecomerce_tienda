import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'descuentos'
})
export class DescuentosPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {

    //en el value viene el precio y en el args el porcentaje del descuento

    /**
     * ejemplo:
     * value = 45
     * args= 30
     *
     * (value*args[0]/100)--> (45*10)/100 seria el 10% de 45
     *
     * la operacion completa para saber el resultado del porcentaje de un producto
     *
     *  value - (value*args[0]/100))
     *  45 - 4.5 = 40.5
     *
     *
     */

    let descuento = Math.round( value - (value*args[0]/100))
    return descuento;
  }

}
