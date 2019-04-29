import { Component, OnInit } from '@angular/core';
import { PageDemande } from 'src/model/model.pageDemande';
import { DemandesService } from 'src/services/demandes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Demande } from 'src/model/model.demande';
import { VoyagesService } from 'src/services/voyages.service';
import { Voyage } from 'src/model/model.voyage';

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
  demandes:Array<Demande>;
  role:string="";
  flag:string="";
  voyage:Voyage = null; //=new Voyage();
  modeMatching=0;

  constructor(activatedRoute:ActivatedRoute, public voyagesService : VoyagesService, public demandesService:DemandesService, public router:Router) { 
    
  }

  async ngOnInit() {
    this.role=localStorage.getItem("role");
    if(localStorage.getItem('idVoyage')!=null)
      await this.voyagesService.getDetailVoyage(Number(localStorage.getItem('idVoyage').toString())).subscribe((data:Voyage)=>{
        this.voyage=data;
        console.log(this.voyage.id)
        console.log(this.voyage.originLat)
        console.log(this.voyage.originLong)
        console.log(this.voyage.origin)
        console.log(this.voyage.destination)
        this.modeMatching=1;
        this.doSearch();
      }, err=>{
        console.log(err)
      })
    else 
      this.doSearch()
    //console.log("this.flag : "+this.flag)

  }
  doSearch(){
    /*if(this.flag.includes('transporter')){
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
    //else{

      if(this.voyage!=null){ 
        this.demandesService.getAllDemandes()
        .subscribe(async (data:Array<Demande>)=>{
          let matchDemandes:Array<Demande>=[]
          //this.voyages=data
          this.modeMatching=1
          // we filter voyages here
          await data.forEach(async demande=>{
            if(this.voyage.idsDemandeMatchings.includes(demande.id.toString())
              && !this.voyage.idsDemandePasBesoins.includes(demande.id.toString()))
            {
              matchDemandes.push(demande)
            }
          })
          this.demandes=matchDemandes;
        }, err=>{
          console.log(err);
        })
      }
      this.demandesService.getDemandes(this.motCle, this.currentPage, this.size).subscribe((data:PageDemande)=>{
        this.pageDemande=data;
        this.pages=new Array(data.totalPages);
      }, err=>{
        console.log(err);
      })
    //}
  }
  chercher(){
    this.modeMatching=0;
    this.voyage=null;
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
    this.demandesService.deleteDemande(id);
    this.doSearch();
  }
  removeDemande(demande:Demande){
    this.voyage.idsDemandePasBesoins=this.voyage.idsDemandePasBesoins+','+demande.id;
    this.voyagesService.saveVoyages(this.voyage).subscribe((data:Voyage)=>{
      this.voyage=data;
    }, err=>{
      console.log(err);
    })
    this.demandes.splice(this.demandes.indexOf(demande), 1)
  }
}
