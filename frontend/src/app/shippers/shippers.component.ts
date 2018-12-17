import { Component, OnInit } from '@angular/core';
//import {Http} from '@angular/http';
import { map } from 'rxjs/operators';
import { ShippersService } from '../../services/shippers.service';
import { Router } from '@angular/router';
import { PageShipper } from 'src/model/model.pageShipper';
//import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-shippers',
  templateUrl: './shippers.component.html',
  styleUrls: ['./shippers.component.css']
})
export class ShippersComponent implements OnInit 
{
  pageShipper:PageShipper = new  PageShipper();  // pour tenir des Shippers
  motCle:string="";
  currentPage:number=0;
  size:number=5;
  pages:Array<number>;  // pour tenir des numeros des pages

  //*/
  constructor(public shipperservice:ShippersService, public router:Router) { }

  ngOnInit() {
    this.doSearch();
    console.log("this from shippers component")
  }
//*
  doSearch(){
    this.shipperservice.getShippers(this.motCle, this.currentPage, this.size).subscribe((data:PageShipper)=>{
      this.pageShipper=data;
      this.pages=new Array(data.totalPages);
    }, err=>{
      console.log(err);
    })
  }
  chercher(){
    this.doSearch();
  }
  gotoPage(i:number){
    this.currentPage=i;
    this.doSearch();
  }
  gotoDetailShipper(id:number){
    this.router.navigate(['detail-shipper',id]);
  }

  deleteShipper(id:number){
    this.shipperservice.deleteShipper(id)
    .subscribe(data=>{
    }, err=>{
      console.log(err);
    });

    this.gotoPage(this.currentPage);
    alert("Avoir rafraichi apres delete!!");
  }
//*/
}
