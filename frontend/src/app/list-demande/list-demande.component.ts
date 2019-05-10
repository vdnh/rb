import { Component, OnInit } from '@angular/core';
import { PageDemande } from 'src/model/model.pageDemande';
import { DemandesService } from 'src/services/demandes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Demande } from 'src/model/model.demande';
import { VoyagesService } from 'src/services/voyages.service';
import { Voyage } from 'src/model/model.voyage';
import { Message } from 'src/model/model.message';
import { MessagesService } from 'src/services/messages.service';

@Component({
  selector: 'app-list-demande',
  templateUrl: './list-demande.component.html',
  styleUrls: ['./list-demande.component.css']
})
export class ListDemandeComponent implements OnInit {
  
  pageDemande:PageDemande = new  PageDemande();  // pour tenir des Demandes
  motCle:string="";
  currentPage:number=0;
  size:number=100;
  pages:Array<number>;  // pour tenir des numeros des pages
  demandes:Array<Demande>;
  demandesBlue:Array<Demande>=[];
  role:string="";
  flag:string="";
  voyage:Voyage = null; //=new Voyage();
  modeMatching=0;
  today=new Date();

  constructor(activatedRoute:ActivatedRoute, public voyagesService : VoyagesService, 
    public messagesService : MessagesService, public demandesService:DemandesService, public router:Router) { 
    
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
          let matchDemandesBlue:Array<Demande>=[]
          //this.voyages=data
          this.modeMatching=1
          // we filter voyages here
          await data.forEach(async demande=>{
            if(this.voyage.idsDemandeMatchings.includes(demande.id.toString())
              && !this.voyage.idsDemandePasBesoins.split(',').includes(demande.id.toString()))
            {
              matchDemandes.push(demande)
            }
            if(this.voyage.idsDemandeMatchings.includes(demande.id.toString())
              && this.voyage.idsDemandePasBesoins.includes(demande.id.toString()))
            {
              matchDemandesBlue.push(demande)
            }
          })
          this.demandes=matchDemandes;
          this.demandesBlue=matchDemandesBlue;
        }, err=>{
          console.log(err);
        })
      }
      else
        this.demandesService.getDemandes(this.motCle, this.currentPage, this.size).subscribe(async (data:PageDemande)=>{
          this.pageDemande=data;
          this.pages=new Array(data.totalPages);
          // filter to take d demandes blue
          let matchDemandes:Array<Demande>=[]
          let matchDemandesBlue:Array<Demande>=[]
          await this.pageDemande.content.forEach(async demande=>{
            if(!demande.idsUsersPasBesoins.split(',').includes(localStorage.getItem('userId')))
            {
              matchDemandes.push(demande)
            }
            else
            {
              matchDemandesBlue.push(demande)
            }
          })
          this.pageDemande.content=matchDemandes;
          this.demandesBlue=matchDemandesBlue;
          //
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
    //this.router.navigate(['detail-demande',d.id]);
    this.router.navigate([{ outlets: { detailDemande: ['detail-demande',d.id]}}]);
  }

  deleteDemande(id:number){
    this.demandesService.deleteDemande(id);
    this.doSearch();
  }

  
  disableContactDemande(d:Demande):boolean{
    let disableContact:boolean=false;  // by default, contact is actif
    if((d.idsVoyageContactes+',').includes(','+localStorage.getItem("userId")+','))
      disableContact=true;
    return disableContact;
  }
  contactDemande(d:Demande){
    let message= new Message()
    d.idsVoyageContactes=d.idsVoyageContactes+","+localStorage.getItem('userId')
    message.idSender=Number(localStorage.getItem('userId'));
    message.roleSender=localStorage.getItem('role');
    message.idReceiver=d.idDemander;
    message.roleReceiver="SHIPPER";
    message.idDemande=d.id;
    //message.idVoyage=
    /*
    message.message=localStorage.getItem('nom') +" - tel:  "+localStorage.getItem('tel')
    +" - email:  " + localStorage.getItem('email')
    +" -  On peut charger votre demande de  "+ d.origin +"  a  " + d.destination;
    //*/
    //*
    let temp1Tel:string= '<strong><a href="tel:'
    let temp1Mail:string='<strong><a href="mailto:'
    let temp2:string='">'
    let temp3:string='</a></strong>'
    
    message.message=localStorage.getItem('nom') +" - Tel:  "
    + temp1Tel+localStorage.getItem('tel')+temp2+localStorage.getItem('tel')+temp3
    + " - Email:  " 
    + temp1Mail+localStorage.getItem('email')+temp2+localStorage.getItem('email')+temp3
    + " -  On peut charger votre demande de  "+ d.origin +"  a  " + d.destination;
    //*/

    this.messagesService.saveMessages(message).subscribe(data=>{
      this.demandesService.updateDemande(d.id, d).subscribe(data=>{},err=>{console.log(err)})
    }, err=>{console.log(err)})
  }
  removeDemande(demande:Demande){
    if(this.voyage!=null){
      //*
      this.voyage.idsDemandePasBesoins=this.voyage.idsDemandePasBesoins+','+demande.id;
      this.voyagesService.saveVoyages(this.voyage).subscribe((data:Voyage)=>{
        //this.voyage=data; // we don't do it
      }, err=>{
        console.log(err);
      })//*/
      this.demandesBlue.push(demande)// to keep the demande blue
      this.demandes.splice(this.demandes.indexOf(demande), 1)
    }
    if(this.pageDemande.totalPages!=null && this.pageDemande.totalPages>0){
      //*
      demande.idsUsersPasBesoins = demande.idsUsersPasBesoins+","+localStorage.getItem("userId");
      this.demandesService.saveDemandes(demande).subscribe(data=>{}, err=>{ console.log(err)})
      //*/
      this.demandesBlue.push(demande)
      this.pageDemande.content.splice(this.pageDemande.content.indexOf(demande),1); // remove this demande from the list
    }
  }
  unRemoveDemande(demande:Demande){
    if(this.voyage!=null){
      //*
      this.voyage.idsDemandePasBesoins=this.voyage.idsDemandePasBesoins+',';
      this.voyage.idsDemandePasBesoins=this.voyage.idsDemandePasBesoins.replace(','+demande.id.toString()+',', ',') //+','+demande.id;
      this.voyage.idsDemandePasBesoins=this.voyage.idsDemandePasBesoins.replace(',,', ',');
      this.voyagesService.saveVoyages(this.voyage).subscribe((data:Voyage)=>{
        //this.voyage=data; // we don't do it
      }, err=>{
        console.log(err);
      })//*/
      this.demandes.push(demande)// to keep the demande
      this.demandesBlue.splice(this.demandesBlue.indexOf(demande), 1)
    }
    if(this.pageDemande.totalPages!=null && this.pageDemande.totalPages>0){
      //*
      demande.idsUsersPasBesoins = demande.idsUsersPasBesoins+",";
      demande.idsUsersPasBesoins = demande.idsUsersPasBesoins.replace(","+localStorage.getItem("userId")+",", ',');
      demande.idsUsersPasBesoins = demande.idsUsersPasBesoins.replace(',,', ',');
      this.demandesService.saveDemandes(demande).subscribe(data=>{}, err=>{ console.log(err)})
      //*/
      this.pageDemande.content.push(demande)
      this.demandesBlue.splice(this.demandesBlue.indexOf(demande),1); // remove this demande from the list
    }
  }
  calculateDistance(lat1:number, long1:number, lat2:number, long2:number) { // en miles
    let point1 = new google.maps.LatLng(lat1, long1)
    let point2 = new google.maps.LatLng(lat2, long2)
    return Math.round(google.maps.geometry.spherical.computeDistanceBetween(point1, point2)/1000/1.609344) ;
  }
}
