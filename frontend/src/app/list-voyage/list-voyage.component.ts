import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageVoyage } from 'src/model/model.pageVoyage';
import { VoyagesService } from 'src/services/voyages.service';
import { Voyage } from 'src/model/model.voyage';
import { LatLngLiteral } from '@agm/core';
import { GeocodingService } from 'src/services/geocoding.service';

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
  constructor(public voyagesService:VoyagesService, public router:Router, public geocoding : GeocodingService) { }
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
    // write out demande to console.log
    console.log(localStorage.getItem('demande.origin'));
    console.log(localStorage.getItem('demande.destination'));
    console.log(localStorage.getItem('demande.typeCamion'));
    console.log(localStorage.getItem('demande.optionDemande'));
    console.log(localStorage.getItem('demande.dateDepart'));
    //
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
    //*  C'est pour les voyages matches
    else if(localStorage.getItem("demande.origin")!=null && localStorage.getItem("demande.destination")!=null){
      this.geocoding.codeAddress(localStorage.getItem("demande.origin")).forEach(
        (results: google.maps.GeocoderResult[]) => {
          if(results[0].geometry.location.lat()>0){
            this.dLatLngOrigin= new google.maps.LatLng(
              results[0].geometry.location.lat(),
              results[0].geometry.location.lng()                            
            )                            
          }
      });
      this.geocoding.codeAddress(localStorage.getItem("demande.destination")).forEach(
        (results: google.maps.GeocoderResult[]) => {
          if(results[0].geometry.location.lat()>0){
            this.dLatLngDestination= new google.maps.LatLng(
              results[0].geometry.location.lat(),
              results[0].geometry.location.lng()                            
            )
          }
      });
      this.voyagesService.matchingVoyages(localStorage.getItem('demande.typeCamion'), localStorage.getItem('demande.optionDemande'))
      .subscribe(async (data:Array<Voyage>)=>{
        let matchVoyages:Array<Voyage>=[]
        //this.voyages=data
        this.modeMatching=1
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
          this.paths=testPaths;
          console.log("testPaths.toString() : ")
          testPaths.forEach((y:LatLngLiteral)=>{        
            console.log('lat : '+y.lat + ' lng : '+y.lng)
          })
          //
          await this.geocoding.codeAddress(voyage.origin).forEach(
            (results: google.maps.GeocoderResult[]) => {
              if(results[0].geometry.location.lat()>0){
                this.latLngOrigin= new google.maps.LatLng(
                  results[0].geometry.location.lat(),
                  results[0].geometry.location.lng()                            
                )                            
              }
          });
          await this.geocoding.codeAddress(voyage.destination).forEach(
            (results: google.maps.GeocoderResult[]) => {
              if(results[0].geometry.location.lat()>0){
                this.latLngDestination= new google.maps.LatLng(
                  results[0].geometry.location.lat(),
                  results[0].geometry.location.lng()                            
                )
              }
          });

          this.originCircle = new google.maps.Circle({
            center: new google.maps.LatLng(this.latLngOrigin.lat(), this.latLngOrigin.lng()),
            radius: voyage.radiusOrigin*1.60934*1000,  // mile en metre
            fillColor: '#FFFF00',
            //editable: false,
            //draggable: false,
          });

          this.destCircle1 = new google.maps.Circle({
            center: new google.maps.LatLng(this.latLngDestination.lat(), this.latLngDestination.lng()),
            radius: voyage.radiusDestination*1.60934*1000, // mile en metre
            fillColor: '#FF00FF',
            //editable: false,
            //draggable: false,
          })
          // 
          if(this.paths.length>0){
            this.polygon = new google.maps.Polygon({
              paths: this.paths,
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#FF00EE',
              fillOpacity: 0.35,
              //editable: (this.role.includes('TRANSPORTER')),
              //draggable:false,
            });
            this.spherical = google.maps.geometry.spherical;
            //var F: google.maps.LatLng = this.latLngOrigin //new google.maps.LatLng(this.latLngOrigin.lat(), this.latLngOrigin.lng()); 
            //var T: google.maps.LatLng = this.latLngDestination  //new google.maps.LatLng(this.latLngDestination.lat(), this.latLngDestination.lng()); 
            // Get direction of the segment
            let heading:number = this.spherical.computeHeading(this.latLngOrigin, this.latLngDestination);
            let dHeading:number = this.spherical.computeHeading(this.dLatLngOrigin, this.dLatLngDestination);
            console.log('dHeading - heading = ' + (dHeading-heading))
          }    //*/      
          if(this.originCircle.getBounds().contains(this.dLatLngOrigin) && this.destCircle1.getBounds().contains(this.dLatLngDestination)){
            matchVoyages.push(voyage)
          }
          if(this.originCircle.getBounds().contains(this.dLatLngOrigin) && this.originCircle.getBounds().contains(this.dLatLngDestination)){
            matchVoyages.push(voyage)
          }
          if(this.destCircle1.getBounds().contains(this.dLatLngOrigin) && this.destCircle1.getBounds().contains(this.dLatLngDestination)){
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
      this.voyagesService.getVoyages(this.motCle, this.currentPage, this.size).subscribe((data:PageVoyage)=>{
        this.pageVoyage=data;
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

}
