import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageVoyage } from 'src/model/model.pageVoyage';
import { VoyagesService } from 'src/services/voyages.service';
import { Voyage } from 'src/model/model.voyage';
import { LatLngLiteral } from '@agm/core';
import { GeocodingService } from 'src/services/geocoding.service';
import { DemandesService } from 'src/services/demandes.service';
import { Demande } from 'src/model/model.demande';

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
  size:number=5;
  pages:Array<number>;  // pour tenir des numeros des pages
  voyages:Array<Voyage>;
  role:string="";
  modeMatching=0;
  dLatLngOrigin: google.maps.LatLng=null;
  dLatLngDestination: google.maps.LatLng=null;
  demande:Demande = null; //=new Demande();
  
  constructor(public demandesService : DemandesService, public voyagesService:VoyagesService, public router:Router, public geocoding : GeocodingService) { }
  //*/ to help matching voyages
  latLngOrigin:google.maps.LatLng =null;
  latLngDestination:google.maps.LatLng =null;
  spherical: typeof google.maps.geometry.spherical;
  paths: Array<LatLngLiteral> = [];   
  originCircle = new google.maps.Circle();
  destCircle1 = new google.maps.Circle(); 
  polygon = new google.maps.Polygon(); 


  //*/
  async ngOnInit() {
    this.role=localStorage.getItem("role");
    if(localStorage.getItem('idDemande')!=null)
      await this.demandesService.getDetailDemande(Number(localStorage.getItem('idDemande').toString())).subscribe((data:Demande)=>{
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
      //getDetailDemande(+(localStorage.getItem('idDemande')).subscribe((data:Demande)
    else 
      await this.doSearch()
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
            matchVoyages.push(voyage)
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
      this.voyagesService.getVoyages(this.motCle, localStorage.getItem('userId'), this.currentPage, this.size).subscribe((data:PageVoyage)=>{
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
  gotoPage(i:number){
    this.currentPage=i;
    this.doSearch();
  }

  gotoDetailVoyage(v:Voyage){
    //this.modeModif=1;
    this.router.navigate(['detail-voyage',v.id]);
  }

  deleteVoyage(id:number){
    this.voyagesService.deleteVoyage(id).subscribe(data=>{

    }, err=>{
      console.log(err)
    })
    this.doSearch();
  }

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
  }

}
