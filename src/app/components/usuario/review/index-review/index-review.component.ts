import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from 'src/app/service/cliente.service';

@Component({
  selector: 'app-index-review',
  templateUrl: './index-review.component.html',
  styleUrls: ['./index-review.component.css']
})

export class IndexReviewComponent implements OnInit {

  public review:Array<any>= [];

  public cargando = true;
  //para la paginacion
public p: number = 1;
public pageSize = 5;

  constructor( private _clienteServices: ClienteService){

  }

ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  this.get_review_cliente()
}

  get_review_cliente(){

    this._clienteServices.get_review_cliente( localStorage.getItem('_id')).subscribe(
      (resp:any)=>{
           console.log(resp);
           this.review = resp.data
      },err=>{

      }
    )
  }




}
