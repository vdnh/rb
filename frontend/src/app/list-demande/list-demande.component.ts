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
    console.log('localStorage.getItem("idVoyage") : ' +  localStorage.getItem("idVoyage"));
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
      else
        this.demandesService.getDemandes(this.motCle, localStorage.getItem('userId'), this.currentPage, this.size).subscribe((data:PageDemande)=>{
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
    if(this.voyage!=null){
      this.voyage.idsDemandePasBesoins=this.voyage.idsDemandePasBesoins+','+demande.id;
      this.voyagesService.saveVoyages(this.voyage).subscribe((data:Voyage)=>{
        //this.voyage=data; // we don't to do it
      }, err=>{
        console.log(err);
      })
      this.demandes.splice(this.demandes.indexOf(demande), 1)
    }
    if(this.pageDemande.totalPages!=null && this.pageDemande.totalPages>0){
      demande.idsUsersPasBesoins = demande.idsUsersPasBesoins+","+localStorage.getItem("userId");
      this.demandesService.saveDemandes(demande).subscribe(data=>{}, err=>{ console.log(err)})
      this.pageDemande.content.splice(this.pageDemande.content.indexOf(demande),1); // remove this demande from the list
    }
  }
  /*
    removeVoyage(voyage:Voyage){
    if(this.demande!=null){
      this.demande.idsVoyagePasBesoins = this.demande.idsVoyagePasBesoins+","+voyage.id;
      this.demandesService.saveDemandes(this.demande).subscribe((data:Demande)=>{
        this.demande=data;
      }, err=>{
        console.log(err)
      })
      this.voyages.splice(this.voyages.indexOf(voyage),1); // remove this voyage from the list
    }
    if(this.pageVoyage.totalPages!=null && this.pageVoyage.totalPages>0){
      voyage.idsUsersPasBesoins = voyage.idsUsersPasBesoins + "," + localStorage.getItem('userId');
      this.voyagesService.saveVoyages(voyage).subscribe(data=>{},err=>{console.log(err)})
      this.pageVoyage.content.splice(this.pageVoyage.content.indexOf(voyage),1); // remove this voyage from the content list
    }
  }
  //*/
}
