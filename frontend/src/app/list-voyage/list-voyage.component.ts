import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageVoyage } from 'src/model/model.pageVoyage';
import { VoyagesService } from 'src/services/voyages.service';
import { Voyage } from 'src/model/model.voyage';
import { LatLngLiteral } from '@agm/core';
import { GeocodingService } from 'src/services/geocoding.service';
import { DemandesService } from 'src/services/demandes.service';
import { Demande } from 'src/model/model.demande';
import { Message } from 'src/model/model.message';
import { MessagesService } from 'src/services/messages.service';
import { async } from 'q';

@Component({
  selector: 'app-list-voyage',
  templateUrl: './list-voyage.component.html',
  styleUrls: ['./list-voyage.component.css']
})
export class ListVoyageComponent implements OnInit {
  modeModif=0;
  pageVoyage:PageVoyage = new  PageVoyage();  // pour tenir des Voyages
  motCle:string="";
  currentPage:number=0;
  size:number=100;
  pages:Array<number>;  // pour tenir des numeros des pages
  voyages:Array<Voyage>=[];
  voyagesBlue:Array<Voyage>=[];
  role:string="";
  modeMatching=0;
  dLatLngOrigin: google.maps.LatLng=null;
  dLatLngDestination: google.maps.LatLng=null;
  demande:Demande = null; //=new Demande();
  today = new Date();
  
  constructor(public messagesService : MessagesService, public demandesService : DemandesService, 
    public voyagesService:VoyagesService, public router:Router, public geocoding : GeocodingService) 
  { 

  }
  //*/ to help matching voyages
  latLngOrigin:google.maps.LatLng =null;
  latLngDestination:google.maps.LatLng =null;
  spherical: typeof google.maps.geometry.spherical;
  paths: Array<LatLngLiteral> = [];   
  originCircle = new google.maps.Circle();
  destCircle1 = new google.maps.Circle(); 
  polygon = new google.maps.Polygon(); 


  //*/
  ngOnInit() {
    this.role=localStorage.getItem("role");
    if(localStorage.getItem('idDemande')!=null)
      this.demandesService.getDetailDemande(Number(localStorage.getItem('idDemande').toString())).subscribe((data:Demande)=>{
        this.demande=data;
        console.log(this.demande.id)
        console.log(this.demande.originLat)
        console.log(this.demande.originLong)
        console.log(this.demande.origin)
        console.log(this.demande.destination)
        this.doSearch();
      }, err=>{
        console.log(err)
      })
    else 
      this.doSearch()
  }
  
  doSearch(){
    if(this.role.includes("TRANSPORTER") && localStorage.getItem("userId")!=null){
      this.voyagesService.voyagesDeTransporter(Number(localStorage.getItem("userId")))
      .subscribe((data:Array<Voyage>)=>{
        this.voyages=data
      }, err=>{
        console.log(err)
      })
    }  
    else if(this.demande!=null){ 
      this.voyagesService.getAllVoyages()
      .subscribe((data:Array<Voyage>)=>{
        this.modeMatching=1
        let matchVoyages:Array<Voyage>=[]
        let matchVoyagesBlue:Array<Voyage>=[]
        data.forEach(voyage=>{            
          if(this.demande.idsVoyageMatchings.includes(voyage.id.toString())
            && !this.demande.idsVoyagePasBesoins.split(',').includes(voyage.id.toString()))
          {
            this.setDistanceTravel(voyage, matchVoyages)              
          }
          if(this.demande.idsVoyageMatchings.includes(voyage.id.toString())
            && this.demande.idsVoyagePasBesoins.includes(voyage.id.toString()))
          {
            this.setDistanceTravel(voyage, matchVoyagesBlue)
          }
        })
        this.voyages=matchVoyages;
        this.voyagesBlue=matchVoyagesBlue;
      }, err=>{
        console.log(err);
      })
    }
    else
      this.voyagesService.getVoyages(this.motCle, this.currentPage, this.size).subscribe((data:PageVoyage)=>{
        this.pageVoyage=data;
        this.pages=new Array(data.totalPages);
        let matchVoyages:Array<Voyage>=[]
        let matchVoyagesBlue:Array<Voyage>=[]
        this.pageVoyage.content.forEach(voyage=>{
          if(!voyage.idsUsersPasBesoins.split(',').includes(localStorage.getItem('userId')))
          {
            matchVoyages.push(voyage)
          }
          else
          {
            matchVoyagesBlue.push(voyage)
          }
        })
        this.pageVoyage.content=matchVoyages;
        this.voyagesBlue=matchVoyagesBlue;
        //
      }, err=>{
        console.log(err);
      })
    //}
  }

  bk_doSearch_bk(){
    if(this.role.includes("TRANSPORTER") && localStorage.getItem("userId")!=null){
      this.voyagesService.voyagesDeTransporter(Number(localStorage.getItem("userId")))
      .subscribe((data:Array<Voyage>)=>{
        this.voyages=data
      }, err=>{
        console.log(err)
      })
    }
    //*  C'est pour les voyages matches
    else if(this.demande!=null){  // && this.demande.destination.length!=0){
      this.dLatLngOrigin= new google.maps.LatLng(
        this.demande.originLat,
        this.demande.originLong
      )                            
      this.dLatLngDestination= new google.maps.LatLng(
        this.demande.destLat,
        this.demande.destLong
      )
      this.voyagesService.matchingVoyages(this.demande.typeCamion, this.demande.optionDemande)
      .subscribe(async (data:Array<Voyage>)=>{
        let matchVoyages:Array<Voyage>=[]
        //this.voyages=data
        this.modeMatching=1
        // we filter voyages here : if idVoyage in demandeMatching but not in demande.idsVoyagePasBesoins
        // and this userId not in voyage.idsUsersPasBesoins
        await data.forEach(async voyage=>{
          if(this.demande.idsVoyageMatchings.includes(voyage.id.toString())
            && !this.demande.idsVoyagePasBesoins.split(",").includes(voyage.id.toString())
            //&& !voyage.idsUsersPasBesoins.includes(localStorage.getItem('userId'))
            )
          {
            this.setDistanceTravel(voyage,  matchVoyages)
            //matchVoyages.push(voyage)
          }        
        })
        this.voyages=matchVoyages
        // end of filter voyages
        localStorage.removeItem('demande.origin');
        localStorage.removeItem('demande.destination');
        localStorage.removeItem('demande.typeCamion');
        localStorage.removeItem('demande.optionDemande');
        localStorage.removeItem('demande.dateDepart');
        // write out demande to console.log
        console.log("Write out demande after cleared.")
        console.log(localStorage.getItem('demande.origin'));
        console.log(localStorage.getItem('demande.destination'));
        console.log(localStorage.getItem('demande.typeCamion'));
        console.log(localStorage.getItem('demande.optionDemande'));
        console.log(localStorage.getItem('demande.dateDepart'));
        //
      }, err=>{
        console.log(err)
      })
    }//*/
    else{
      this.voyagesService.getVoyages(this.motCle, this.currentPage, this.size).subscribe((data:PageVoyage)=>{
        this.pageVoyage=data;
        this.pages=new Array(data.totalPages);
      }, err=>{
        console.log(err);
      })
    }  
  }

  chercher(){
    this.demande=null;
    this.modeMatching=0;
    this.doSearch();
  }
  refreshDistance(){
    this.router.navigateByUrl("/list-voyage"); // call one more time to refresh
  }
  gotoPage(i:number){
    this.currentPage=i;
    this.doSearch();
  }

  gotoDetailVoyage(v:Voyage){
    //this.modeModif=1;
    this.router.navigate(['detail-voyage',v.id]);
  }

  matchingVoyage(v){
    localStorage.setItem('idVoyage', v.id.toString());
    this.router.navigateByUrl("/list-demande");
  }
  
  deleteVoyage(v:Voyage){
    this.voyagesService.deleteVoyage(v.id).subscribe(data=>{

    }, err=>{
      console.log(err)
    })
    this.voyages.splice(this.voyages.indexOf(v), 1)
    //this.doSearch();
  }

  disableContactVoyage(v:Voyage):boolean{
    let disableContact:boolean=false;  // by default, contact is actif
    if((v.idsDemandeContactes+',').includes(','+localStorage.getItem("userId")+','))
      disableContact=true;
    return disableContact;
  }
  contactVoyage(v:Voyage){
    let message= new Message()
    v.idsDemandeContactes=v.idsDemandeContactes+","+localStorage.getItem('userId')
    //console.log('v.idsDemandeContactes : before write in database :'+v.idsDemandeContactes)
    message.idSender=Number(localStorage.getItem('userId'));
    message.roleSender=localStorage.getItem('role');
    message.idReceiver=v.idTransporter;
    message.roleReceiver="TRANSPORTER";
    //message.idDemande
    message.idVoyage=v.id
    /*message.message=localStorage.getItem('nom') +" - tel:  "+localStorage.getItem('tel')
    +" - email:  " + localStorage.getItem('email')
    +" -  besoins votre Voyage de  "+ v.origin +"  a  " + v.destination;//*/

    let temp1Tel:string= '<strong><a href="tel:'
    let temp1Mail:string='<strong><a href="mailto:'
    let temp2:string='">'
    let temp3:string='</a></strong>'
    
    message.message=localStorage.getItem('nom') +" - Tel:  "
    + temp1Tel+localStorage.getItem('tel')+temp2+localStorage.getItem('tel')+temp3
    + " - Email:  " 
    + temp1Mail+localStorage.getItem('email')+temp2+localStorage.getItem('email')+temp3
    + " -  besoins votre Equipment de  "+ v.origin +"  a  " + v.destination;

    /*
    <strong><a href="tel:  --temp1Tel
    localStorage.getItem('tel')
    ">  ----temp2
    localStorage.getItem('tel')
    </a></strong><br>  --temp3
    
    ==> temp1Tel+localStorage.getItem('tel')+temp2+localStorage.getItem('tel')+temp3


    <strong><a href="mailto:  ----temp1Mail
    localStorage.getItem('email')
    ">  ----temp2
    localStorage.getItem('email')
    </a></strong>  --temp3

    ==> temp1Mail+localStorage.getItem('email')+temp2+localStorage.getItem('email')+temp3
    //*/
    this.messagesService.saveMessages(message).subscribe(async data=>{
      await this.voyagesService.updateVoyage(v.id, v).subscribe((data:Voyage)=>{
        //console.log('v.idsDemandeContactes : after write in database :'+data.idsDemandeContactes)
      },err=>{console.log(err)})
    }, err=>{console.log(err)});
    alert("Votre demande a ete envoye!")
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
      //voyage.idsUsersPasBesoins = voyage.idsUsersPasBesoins + "," + localStorage.getItem('userId');
      //this.voyagesService.saveVoyages(voyage).subscribe(data=>{},err=>{console.log(err)})
      this.voyages.splice(this.voyages.indexOf(voyage),1); // remove this voyage from the list
    }
    if(this.pageVoyage.totalPages!=null && this.pageVoyage.totalPages>0){
      voyage.idsUsersPasBesoins = voyage.idsUsersPasBesoins + "," + localStorage.getItem('userId');
      this.voyagesService.saveVoyages(voyage).subscribe(data=>{},err=>{console.log(err)})
      this.pageVoyage.content.splice(this.pageVoyage.content.indexOf(voyage),1); // remove this voyage from the content list
    }
  }//*/
  removeVoyage(voyage:Voyage){
    if(this.demande!=null){
      //*
      this.demande.idsVoyagePasBesoins=this.demande.idsVoyagePasBesoins+','+voyage.id;
      this.demandesService.saveDemandes(this.demande).subscribe((data:Demande)=>{
      }, err=>{
        console.log(err);
      })//*/
      this.voyagesBlue.push(voyage)// to keep the voyage blue
      this.voyages.splice(this.voyages.indexOf(voyage), 1)
    }
    if(this.pageVoyage.totalPages!=null && this.pageVoyage.totalPages>0){
      //*
      voyage.idsUsersPasBesoins = voyage.idsUsersPasBesoins+","+localStorage.getItem("userId");
      this.voyagesService.saveVoyages(voyage).subscribe(data=>{}, err=>{ console.log(err)})
      //*/
      this.voyagesBlue.push(voyage)
      this.pageVoyage.content.splice(this.pageVoyage.content.indexOf(voyage),1); // remove this voyage from the list
    }
  }
  unRemoveVoyage(voyage:Voyage){
    if(this.demande!=null){
      //*
      this.demande.idsVoyagePasBesoins=this.demande.idsVoyagePasBesoins+',';
      this.demande.idsVoyagePasBesoins=this.demande.idsVoyagePasBesoins.replace(','+voyage.id.toString()+',', ',') //+','+voyage.id;
      this.demande.idsVoyagePasBesoins=this.demande.idsVoyagePasBesoins.replace(',,', ',');
      this.demandesService.saveDemandes(this.demande).subscribe((data:Demande)=>{
      }, err=>{
        console.log(err);
      })//*/
      this.voyages.push(voyage)// to keep the voyage
      this.voyagesBlue.splice(this.voyagesBlue.indexOf(voyage), 1)
    }
    if(this.pageVoyage.totalPages!=null && this.pageVoyage.totalPages>0){
      //*
      voyage.idsUsersPasBesoins = voyage.idsUsersPasBesoins+",";
      voyage.idsUsersPasBesoins = voyage.idsUsersPasBesoins.replace(","+localStorage.getItem("userId")+",", ',');
      voyage.idsUsersPasBesoins = voyage.idsUsersPasBesoins.replace(',,', ',');
      this.voyagesService.saveVoyages(voyage).subscribe(data=>{}, err=>{ console.log(err)})
      //*/
      this.pageVoyage.content.push(voyage)
      this.voyagesBlue.splice(this.voyagesBlue.indexOf(voyage),1); // remove this voyage from the list
    }
  }
  //* Calculate and set distance travel in miles
  setDistanceTravel(v: Voyage, voyages:Array<Voyage>) {
    //*
    //this.modeMatching=2
    let service = new google.maps.DistanceMatrixService;// = new google.maps.DistanceMatrixService()
    // get back distances - ld - dfo - dfd
    if(localStorage.getItem(v.id+'-ld-'+this.demande.id)!=null
        && localStorage.getItem(v.id+'-dfo-'+this.demande.id)!=null
        && localStorage.getItem(v.id+'-dfd-'+this.demande.id)!=null
      )
    {
      v.ld=Number(localStorage.getItem(v.id+'-ld-'+this.demande.id))
      v.dfo=Number(localStorage.getItem(v.id+'-dfo-'+this.demande.id))
      v.dfd=Number(localStorage.getItem(v.id+'-dfd-'+this.demande.id))
    }
    else{
      // calculate load distance - ld - allways for for the Load
      service.getDistanceMatrix({
        'origins': [this.demande.origin], 'destinations': [this.demande.destination], travelMode:google.maps.TravelMode.DRIVING
      }, (results: any) => {    
        v.ld= Math.round((results.rows[0].elements[0].distance.value)/1000/1.609344)  
        localStorage.setItem(v.id+'-ld-'+this.demande.id, Math.round((results.rows[0].elements[0].distance.value)/1000/1.609344).toString())
        //console.log( 'ld (miles -) -- ' + d.ld)
        //return;
      });
      
      // calculate distance from origin - dfo
      service.getDistanceMatrix({
        'origins': [v.origin], 'destinations': [this.demande.origin], travelMode:google.maps.TravelMode.DRIVING
      }, (results: any) => {    
        v.dfo= Math.round((results.rows[0].elements[0].distance.value)/1000/1.609344)  
        localStorage.setItem(v.id+'-dfo-'+this.demande.id, Math.round((results.rows[0].elements[0].distance.value)/1000/1.609344).toString())
        //console.log( 'dfo (miles -) -- ' + d.dfo)
        //return;
      });
      // calculate distance from destination - dfd
      service.getDistanceMatrix({
        'origins': [v.destination], 'destinations': [this.demande.destination], travelMode:google.maps.TravelMode.DRIVING
      }, (results: any) => {    
        v.dfd= Math.round((results.rows[0].elements[0].distance.value)/1000/1.609344)  
        localStorage.setItem(v.id+'-dfd-'+this.demande.id, Math.round((results.rows[0].elements[0].distance.value)/1000/1.609344).toString())
        //console.log( 'dfd (miles -) -- ' + d.dfd)
        //return;
      });
    }
    voyages.push(v);
  }
  
  dFOSort(){    // sort by DFO
    this.voyages.sort((a, b)=>{
      if(a.dfo>b.dfo)
        return 1;
      if(a.dfo<b.dfo)
        return -1
      return 0;
    })
    this.voyagesBlue.sort((a, b)=>{
      if(a.dfo>b.dfo)
        return 1;
      if(a.dfo<b.dfo)
        return -1
      return 0;
    })
  }
  dFDSort(){  // sort by DFD
    this.voyages.sort((a, b)=>{
      if(a.dfd>b.dfd)
        return 1;
      if(a.dfd<b.dfd)
        return -1
      return 0;
    })
    this.voyagesBlue.sort((a, b)=>{
      if(a.dfd>b.dfd)
        return 1;
      if(a.dfd<b.dfd)
        return -1
      return 0;
    })
  }
  lDSort(){   // sort by LD
    this.voyages.sort((a, b)=>{
      if(a.ld>b.ld)
        return 1;
      if(a.ld<b.ld)
        return -1
      return 0;
    })
    this.voyagesBlue.sort((a, b)=>{
      if(a.ld>b.ld)
        return 1;
      if(a.ld<b.ld)
        return -1
      return 0;
    })
  }
  clientSort(){   // sort by name client
    this.pageVoyage.content.sort((a, b)=>{
      return a.nomTransporter.localeCompare(b.nomTransporter)
    })
    this.voyages.sort((a, b)=>{
      return a.nomTransporter.localeCompare(b.nomTransporter)
    })
    this.voyagesBlue.sort((a, b)=>{
      return a.nomTransporter.localeCompare(b.nomTransporter)
    })
  }
  originSort(){   // sort by origin
    this.pageVoyage.content.sort((a, b)=>{
      return a.origin.localeCompare(b.origin)
    })
    this.voyages.sort((a, b)=>{
      return a.origin.localeCompare(b.origin)
    })
    this.voyagesBlue.sort((a, b)=>{
      return a.origin.localeCompare(b.origin)
    })
  }
  destSort(){   // sort by destination
    this.pageVoyage.content.sort((a, b)=>{
      return a.destination.localeCompare(b.destination)
    })
    this.voyages.sort((a, b)=>{
      return a.destination.localeCompare(b.destination)
    })
    this.voyagesBlue.sort((a, b)=>{
      return a.destination.localeCompare(b.destination)
    })
  }


}
