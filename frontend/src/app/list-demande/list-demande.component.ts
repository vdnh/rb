import { Component, OnInit } from '@angular/core';
import { PageDemande } from 'src/model/model.pageDemande';
import { DemandesService } from 'src/services/demandes.service';
import { Router } from '@angular/router';
import { Demande } from 'src/model/model.demande';

@Component({
  selector: 'app-list-demande',
  templateUrl: './list-demande.component.html',
  styleUrls: ['./list-demande.component.css']
})
export class ListDemandeComponent implements OnInit {
  
  pageDemande:PageDemande = new  PageDemande();  // pour tenir des Demandes
  motCle:string="";
  currentPage:number=0;
  size:number=5;
  pages:Array<number>;  // pour tenir des numeros des pages

  constructor(public demandesService:DemandesService, public router:Router) { }

  ngOnInit() {
    this.doSearch()
  }
  doSearch(){
    this.demandesService.getDemandes(this.motCle, this.currentPage, this.size).subscribe((data:PageDemande)=>{
      this.pageDemande=data;
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

  gotoDetailDemande(d:Demande){
    this.router.navigate(['detail-demande',d.id]);
  }

  /* gotoDetailShipper(id:number){
    this.router.navigate(['detail-shipper',id]);
  } */
}
