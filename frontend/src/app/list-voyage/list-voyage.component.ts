import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageVoyage } from 'src/model/model.pageVoyage';
import { VoyagesService } from 'src/services/voyages.service';
import { Voyage } from 'src/model/model.voyage';

@Component({
  selector: 'app-list-voyage',
  templateUrl: './list-voyage.component.html',
  styleUrls: ['./list-voyage.component.css']
})
export class ListVoyageComponent implements OnInit {

  pageVoyage:PageVoyage = new  PageVoyage();  // pour tenir des Voyages
  motCle:string="";
  currentPage:number=0;
  size:number=5;
  pages:Array<number>;  // pour tenir des numeros des pages

  constructor(public voyagesService:VoyagesService, public router:Router) { }

  ngOnInit() {
    this.doSearch()
  }
  doSearch(){
    this.voyagesService.getVoyages(this.motCle, this.currentPage, this.size).subscribe((data:PageVoyage)=>{
      this.pageVoyage=data;
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

  gotoDetailDemande(v:Voyage){
    this.router.navigate(['detail-voyage',v.id]);
  }

}
