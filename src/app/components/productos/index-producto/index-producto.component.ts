import { Component, OnInit } from '@angular/core';


declare var noUiSlider:any;
declare var $: any

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent implements OnInit {


  ngOnInit(): void {

var slider : any = document.getElementById('slider');
noUiSlider.create(slider, {
    start: [0, 1000],
    connect: true,
    decimals: false,
    range: {
        'min': 0,
        'max': 1000
    },
    tooltips: [true,true],
    pips: {
      mode: 'count',
      values: 5,

    }
})

slider.noUiSlider.on('update', function (values: any[]) {
    $('.cs-range-slider-value-min').val(values[0]);
    $('.cs-range-slider-value-max').val(values[1]);
});
$('.noUi-tooltip').css('font-size','11px');

  }
}
