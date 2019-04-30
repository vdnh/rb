import { Component, OnInit } from '@angular/core';
import { PageDemande } from 'src/model/model.pageDemande';
import { DemandesService } from 'src/services/demandes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Demande } from 'src/model/model.demande';

@Component({
  selector: 'app-list-demande-de-chaque',
  templateUrl: './list-demande-de-chaque.component.html',
  styleUrls: ['./list-demande-de-chaque.component.css']
})
export class ListDemandeDeChaqueComponent implements OnInit {
  
  pageDemande:PageDemande = new  PageDemande();  // pour tenir des Demandes
  motCle:string="";
  currentPage:number=0;
  size:number=5;
  pages:Array<number>;  // pour tenir des numeros des pages
  demandes:Array<Demande>;
  role:string="";
  flag:string="";

  constructor(activatedRoute:ActivatedRoute ,public demandesService:DemandesService, public router:Router) { 
    this.flag=activatedRoute.snapshot.params['flag'];
  }

  ngOnInit() {
    this.role=localStorage.getItem("role");
    this.doSearch()
    console.log("this.flag : "+this.flag)
  }
  doSearch(){
    //*
    if(this.flag.includes('transporter')){
      this.demandesService.demandesDeTransporter(Number(localStorage.getItem("userId")))
      .subscribe((data:Array<Demande>)=>{
        this.demandes=data
      }, err=>{
        console.log(err)
      })
    }
    else if(this.flag.includes('shipper')){
      this.demandesService.demandesDeShipper(Number(localStorage.getItem("userId")))
      .subscribe((data:Array<Demande>)=>{
        this.demandes=data
      }, err=>{
        console.log(err)
      })      
    }//*/
    else{
      this.demandesService.getDemandes(this.motCle, localStorage.getItem('userId'), this.currentPage, this.size).subscribe((data:PageDemande)=>{
        this.pageDemande=data;
        this.pages=new Array(data.totalPages);
      }, err=>{
        console.log(err);
      })
    }
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

  deleteDemande(id:number){
    this.demandesService.deleteDemande(id).subscribe(data=>{}, err=>{console.log(err)});
    this.doSearch();
  }
}
