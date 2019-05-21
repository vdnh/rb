import { Component, OnInit } from '@angular/core';
import { PageDemande } from 'src/model/model.pageDemande';
import { DemandesService } from 'src/services/demandes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Demande } from 'src/model/model.demande';
import { Voyage } from 'src/model/model.voyage';
import { VoyagesService } from 'src/services/voyages.service';
import { LatLngLiteral } from '@agm/core';

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
  today=new Date();

  constructor(activatedRoute:ActivatedRoute ,public demandesService:DemandesService, public router:Router,
    public voyagesService:VoyagesService) { 
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
      this.demandesService.getDemandes(this.motCle, this.currentPage, this.size).subscribe((data:PageDemande)=>{
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

  //*// function to take list Matching Voyage
  async onSearchTruck(demande:Demande){  // && this.demande.destination.length!=0){
    let spherical = google.maps.geometry.spherical;
    let latLngOrigin= new google.maps.LatLng(
      demande.originLat,
      demande.originLong
    )
    let latLngDestination= new google.maps.LatLng(
      demande.destLat,
      demande.destLong
    )
    let voyages:Array<Voyage>;
    let listIdVoyages:Array<string>=[]
    let dLatLngOrigin= new google.maps.LatLng(
      demande.originLat,
      demande.originLong
    )                            
    let dLatLngDestination= new google.maps.LatLng(
      demande.destLat,
      demande.destLong
    )
    await this.voyagesService.matchingVoyages(demande.typeCamion, demande.optionDemande)
    .subscribe(async (data:Array<Voyage>)=>{
      let matchVoyages:Array<Voyage>=[]
      // we filter voyages here
      await data.forEach(async voyage=>{
        console.log(voyage.origin)
        console.log(voyage.destination)
        console.log(voyage.radiusOrigin)
        console.log(voyage.radiusDestination)
        console.log(voyage.paths)
        // Rebuild paths
        let pathsRebuild = voyage.paths.split(",")
        console.log("pathsRebuild : "+pathsRebuild)
        let testPaths:Array<LatLngLiteral>= []; // rebuild from array of string
        for(var i=0; i<=pathsRebuild.length-2; i=i+2){
          testPaths.push({lat:Number(pathsRebuild[i]), lng:Number(pathsRebuild[i+1])})
        }
        let paths=testPaths;
        console.log("testPaths.toString() : ")
        testPaths.forEach((y:LatLngLiteral)=>{        
          console.log('lat : '+y.lat + ' lng : '+y.lng)
        })

        let latLngOriginV= new google.maps.LatLng(
          voyage.originLat,
          voyage.originLong                            
        )

        let latLngDestinationV= new google.maps.LatLng(
          voyage.destLat,
          voyage.destLong                            
        )

        let originCircle = new google.maps.Circle({
          center: new google.maps.LatLng(latLngOriginV.lat(), latLngOriginV.lng()),
          radius: voyage.radiusOrigin*1.60934*1000,  // mile en metre
          fillColor: '#FFFF00',
          //editable: false,
          //draggable: false,
        });

        let destCircle1 = new google.maps.Circle({
          center: new google.maps.LatLng(latLngDestinationV.lat(), latLngDestinationV.lng()),
          radius: voyage.radiusDestination*1.60934*1000, // mile en metre
          fillColor: '#FF00FF',
          //editable: false,
          //draggable: false,
        })
        //
        let polygon= new google.maps.Polygon();
        let angle:number;  // to get angle of voyage and demande 
        if(paths.length>0){
          polygon = new google.maps.Polygon({
            paths: paths,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF00EE',
            fillOpacity: 0.35,
            //editable: (this.role.includes('TRANSPORTER')),
            //draggable:false,
          });
          //var F: google.maps.LatLng = this.latLngOrigin //new google.maps.LatLng(this.latLngOrigin.lat(), this.latLngOrigin.lng()); 
          //var T: google.maps.LatLng = this.latLngDestination  //new google.maps.LatLng(this.latLngDestination.lat(), this.latLngDestination.lng()); 
          // Get direction of the segment
          let heading:number = spherical.computeHeading(latLngOriginV, latLngDestinationV);
          let dHeading:number = spherical.computeHeading(latLngOrigin, latLngDestination);
          angle=Math.abs(dHeading-heading);
          console.log('dHeading - heading = ' + angle)
        }    //*/   
        if(originCircle.getBounds().contains(latLngOrigin) && destCircle1.getBounds().contains(latLngDestination)){
          //matchVoyages.push(voyage);
          listIdVoyages.push(voyage.id.toString())
          //return;
        }
        if(originCircle.getBounds().contains(latLngOrigin) && originCircle.getBounds().contains(latLngDestination)){
          //matchVoyages.push(voyage)
          listIdVoyages.push(voyage.id.toString())
          //return;
        }
        if(destCircle1.getBounds().contains(latLngOrigin) && destCircle1.getBounds().contains(latLngDestination)){
          //matchVoyages.push(voyage)
          listIdVoyages.push(voyage.id.toString())
          //return;
        }
        
        if(paths.length>0){
          if(
            !originCircle.getBounds().contains(latLngOrigin) // originDemande not in origin
            && !destCircle1.getBounds().contains(latLngOrigin) // originDemande not in destination
            && google.maps.geometry.poly.containsLocation(latLngOrigin, polygon) // originDemande in corridor
            && destCircle1.getBounds().contains(latLngDestination)) // destinationDemande in destination
          {
            //matchVoyages.push(voyage)
            listIdVoyages.push(voyage.id.toString())
            //return;
          }
          if(
            !destCircle1.getBounds().contains(latLngDestination) // destinationDemande not in destination
            && !originCircle.getBounds().contains(latLngDestination) // destinationDemande not in origin
            && google.maps.geometry.poly.containsLocation(latLngDestination, polygon) // destinationDemande in corridor
            && originCircle.getBounds().contains(latLngOrigin)) // originDemande in origin
          {
            //matchVoyages.push(voyage)
            listIdVoyages.push(voyage.id.toString())
            //return;
          }
          // */
          if(
            !originCircle.getBounds().contains(latLngOrigin) // originDemande not in origin
            && !destCircle1.getBounds().contains(latLngOrigin) // originDemande not in destination
            && google.maps.geometry.poly.containsLocation(latLngOrigin, polygon) // originDemande in corridor
            && !destCircle1.getBounds().contains(latLngDestination) // destinationDemande not in destination 
            && !originCircle.getBounds().contains(latLngDestination) // destinationDemande not in origin
            && google.maps.geometry.poly.containsLocation(latLngDestination, polygon) // destinationDemande in corridor
            && (angle<=90 || angle>=270))
          {
            //matchVoyages.push(voyage)
            listIdVoyages.push(voyage.id.toString())
            //return;
          }
        }
        //if(google.maps.geometry.poly.containsLocation(this.dLatLngOrigin, this.polygon)){}          
      })
      //voyages=matchVoyages
      demande.idsVoyageMatchings=listIdVoyages.toString();
      console.log('this.demande.idsVoyageMatchings : ' + demande.idsVoyageMatchings)
      localStorage.setItem('idDemande', demande.id.toString());
      this.router.navigateByUrl("/list-voyage");
    }, err=>{
      console.log(err)
    })
  }//*/

}
