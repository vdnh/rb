import { Component, OnInit, ViewChild } from '@angular/core';
import { Demande } from 'src/model/model.demande';
import { DemandesService } from 'src/services/demandes.service';
import { GeocodingService } from 'src/services/geocoding.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { } from 'googlemaps';
import { VoyagesService } from 'src/services/voyages.service';
import { Voyage } from 'src/model/model.voyage';
import * as myGlobals from 'src/services/globals'; //<==== to use variables from globals.ts
import { Remorquage } from 'src/model/model.remorquage';
import { RemorquagesService } from 'src/services/remorquages.service';

@Component({
  selector: 'app-remorquage',
  templateUrl: './remorquage.component.html',
  styleUrls: ['./remorquage.component.css']
})
export class RemorquageComponent implements OnInit {

  searchTruck=true; //desactiver poster et rechercher
  //* pour checkBox list
  formGroup: FormGroup;
  serviceTypes = ["Leger", "Moyenne", "Lourd"];
  
  provinceList=myGlobals.provinceList ;
  
  villeListO= myGlobals.villeList ;
  
  villeListD=this.villeListO;
  
  AlbertaVilles=myGlobals.AlbertaVilles;
  
  BritishColumbiaVilles=myGlobals.BritishColumbiaVilles;
  
  ManitobaVilles=myGlobals.ManitobaVilles;
  
  NewBrunswickVilles=myGlobals.NewBrunswickVilles;
  
  NewfoundlandLabradorVilles=myGlobals.NewfoundlandLabradorVilles;
  
  NorthwestTerritoriesVilles=myGlobals.NorthwestTerritoriesVilles;
  
  NovaScotiaVilles=myGlobals.NovaScotiaVilles;
  
  NunavutVilles=myGlobals.NunavutVilles;
  
  OntarioVilles=myGlobals.OntarioVilles;
  
  PrinceEdwardIslandVilles=myGlobals.PrinceEdwardIslandVilles;
  
  QuebecVilles=myGlobals.QuebecVilles;
  
  SaskatchewanVilles=myGlobals.SaskatchewanVilles;
  
  YukonVilles=myGlobals.YukonVilles;
//*/
  mode=2; // en pouce et lbs   - Si : mode = 2 on est en cm et kg
  // // les details de marchandise
  // longeur:number=0.00;
  // largeur:number=0.00;
  // hauteur:number=0.00;
  // poids:number=0.00;
  // valeur:number=0.00;
  // distance:number=0.00; // en miles
  // distanceKm:number=0.00; // en km

  // heurs_supl:number=0.00;

  // totalPoints:number=0.00;
  // // le prix sugere
  // prix:number=0.00;

  // demande:Demande=new Demande();
  remorquage:Remorquage=new Remorquage();

  //* Pour ajouter des circles and markers sur la carte
  // google maps zoom level
  zoom: number = 6;
  
  // initial center position for the map
  lat: number = 45.503964;
  lng: number = -73.567426;

  center : google.maps.LatLng=null;
  latLngOrigin:google.maps.LatLng =null;
  latLngDestination:google.maps.LatLng =null;
  
  //* default 
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  // outils draw and geometry
  drawingManager: any;
  infoWindow : any;
  spherical: typeof google.maps.geometry.spherical;
  //fin
  
  centerCoord={lat:45.568806, lng:-73.918333}  // location of SOS Prestige  
  // finir ajouter des circles et markes */

  today=new Date();

  constructor(public remorquagesService : RemorquagesService, public geocoding : GeocodingService, private formBuilder:FormBuilder, public router:Router) { 
        /* construct for checkbox list
        const selectAllControl = new FormControl(false);
        const formControls = this.camionTypes.map(control => new FormControl(false));
        this.formGroup = this.formBuilder.group({
          camionTypes: new FormArray(formControls),
          selectAll: selectAllControl
        });//*/
  }

  ngOnInit() {
    // this.demande.roleDemander = localStorage.getItem("role");
    // this.demande.idDemander = Number(localStorage.getItem("userId"));
    // this.demande.nomDemander = localStorage.getItem("nom");
    //console.log('this.demande.roleDemander : '+this.demande.roleDemander)
    //console.log('this.demande.idDemander : '+this.demande.idDemander)
  }
  //* fonctionnes de checkbox list

//*
async originChange(){
  //*
  if(this.remorquage.originProvince!=null){
    // check the province to limit the cities
    if(this.remorquage.originProvince==this.provinceList[0])
      this.villeListO=this.AlbertaVilles;
    if(this.remorquage.originProvince==this.provinceList[1])
      this.villeListO=this.BritishColumbiaVilles;        
    if(this.remorquage.originProvince==this.provinceList[2])
      this.villeListO=this.ManitobaVilles;
    if(this.remorquage.originProvince==this.provinceList[3])
      this.villeListO=this.NewBrunswickVilles;    
    if(this.remorquage.originProvince==this.provinceList[4])
      this.villeListO=this.NewfoundlandLabradorVilles;    
    if(this.remorquage.originProvince==this.provinceList[5])
      this.villeListO=this.NorthwestTerritoriesVilles;
    if(this.remorquage.originProvince==this.provinceList[6])
      this.villeListO=this.NovaScotiaVilles;
    if(this.remorquage.originProvince==this.provinceList[7])
      this.villeListO=this.NunavutVilles;
    if(this.remorquage.originProvince==this.provinceList[8])
      this.villeListO=this.OntarioVilles;
    if(this.remorquage.originProvince==this.provinceList[9])
      this.villeListO=this.PrinceEdwardIslandVilles;
    if(this.remorquage.originProvince==this.provinceList[10])
      this.villeListO=this.QuebecVilles;
    if(this.remorquage.originProvince==this.provinceList[11])
      this.villeListO=this.SaskatchewanVilles;  
    if(this.remorquage.originProvince==this.provinceList[12])
      this.villeListO=this.YukonVilles;
    // end check the provine
    
    this.remorquage.origin=this.remorquage.originAdresse+', '+this.remorquage.originVille+', '+this.remorquage.originProvince //+', canada'
    if(this.remorquage.destination!=null && this.remorquage.destination.length>0)
      this.setDistanceTravel(this.remorquage.origin, this.remorquage.destination)
    await this.geocoding.codeAddress(this.remorquage.origin).forEach(
      (results: google.maps.GeocoderResult[]) => {
            if(results[0].geometry.location.lat()>0){
              this.latLngOrigin= new google.maps.LatLng(
                //results[0].geometry.location.lat(),
                //results[0].geometry.location.lng()                            
                this.remorquage.originLat = results[0].geometry.location.lat(),
                this.remorquage.originLong = results[0].geometry.location.lng()                            
              )
              //alert("En deplacant, attendre 2 secondes svp, puis press OK.")
            }
            else
              alert("Ne pas trouver de coordonnees de ce origin")
    });//*/
  }
  //this.showMap();
}

async destinationChange(){
  //*
  if(this.remorquage.destProvince!=null){
    // check the province to limit the cities
    if(this.remorquage.destProvince==this.provinceList[0])
      this.villeListD=this.AlbertaVilles;
    if(this.remorquage.destProvince==this.provinceList[1])
      this.villeListD=this.BritishColumbiaVilles;        
    if(this.remorquage.destProvince==this.provinceList[2])
      this.villeListD=this.ManitobaVilles;
    if(this.remorquage.destProvince==this.provinceList[3])
      this.villeListD=this.NewBrunswickVilles;    
    if(this.remorquage.destProvince==this.provinceList[4])
      this.villeListD=this.NewfoundlandLabradorVilles;    
    if(this.remorquage.destProvince==this.provinceList[5])
      this.villeListD=this.NorthwestTerritoriesVilles;
    if(this.remorquage.destProvince==this.provinceList[6])
      this.villeListD=this.NovaScotiaVilles;
    if(this.remorquage.destProvince==this.provinceList[7])
      this.villeListD=this.NunavutVilles;
    if(this.remorquage.destProvince==this.provinceList[8])
      this.villeListD=this.OntarioVilles;
    if(this.remorquage.destProvince==this.provinceList[9])
      this.villeListD=this.PrinceEdwardIslandVilles;
    if(this.remorquage.destProvince==this.provinceList[10])
      this.villeListD=this.QuebecVilles;
    if(this.remorquage.destProvince==this.provinceList[11])
      this.villeListD=this.SaskatchewanVilles;  
    if(this.remorquage.destProvince==this.provinceList[12])
      this.villeListD=this.YukonVilles;
    // end check the provine
    this.remorquage.destination=this.remorquage.destAdresse+', '+this.remorquage.destVille+', '+this.remorquage.destProvince  //+', canada'
    if(this.remorquage.origin!=null && this.remorquage.origin.length>0)
      await this.setDistanceTravel(this.remorquage.origin, this.remorquage.destination)
    await this.geocoding.codeAddress(this.remorquage.destination).forEach(
      (results: google.maps.GeocoderResult[]) => {
            if(results[0].geometry.location.lat()>0){
              this.latLngDestination= new google.maps.LatLng(
                //results[0].geometry.location.lat(),
                //results[0].geometry.location.lng()     
                this.remorquage.destLat = results[0].geometry.location.lat(),
                this.remorquage.destLong = results[0].geometry.location.lng()                                                   
              )
              //alert("En deplacant, attendre 2 secondes svp, puis press OK.")
            }
            else
              alert("Ne pas trouver de coordonnees de cet destination")
    });//*/
  }//this.showMap();
}

showMap() {
  let mapProp = {
    center: new google.maps.LatLng(this.centerCoord.lat, this.centerCoord.lng),
    zoom: 6,
    //mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
  var directionsDisplay = new google.maps.DirectionsRenderer; // declare google display
  var directionsService = new google.maps.DirectionsService; // declare google service
  /*var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: {lat: 41.85, lng: -87.65}
  });//*/
  directionsDisplay.setMap(this.map); // to see the routes on the map
  //directionsDisplay.setPanel(document.getElementById('right-panel')); // to see the routes just by the text

  this.infoWindow = new google.maps.InfoWindow;
  let markerOrigin = new google.maps.Marker({
    position: this.latLngOrigin,
    map: this.map,
    //icon: 'https://maps.google.com/mapfiles/kml/shapes/info-i_maps.png', //;this.iconBase + this.selectedMarkerType,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 4
    },
    title: this.remorquage.origin
  });
  let markerDestination = new google.maps.Marker({
    position: this.latLngDestination,
    map: this.map,
    //icon: 'https://maps.google.com/mapfiles/kml/shapes/info-i_maps.png', //;this.iconBase + this.selectedMarkerType,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 4
    },
    title: this.remorquage.destination
  });
  //markerDestination.addListener('click', this.simpleMarkerHandler);
  /*markerDestination.addListener('click', () => {
    this.markerHandler(markerDestination);
  });//*/
  // centrer la carte
  var bounds = new google.maps.LatLngBounds();
  bounds.extend(this.latLngOrigin);
  bounds.extend(this.latLngDestination);
  this.map.fitBounds(bounds);
  //*/
  //* line fron origin to destination
  var flightPlanCoordinates = [
    {lat: this.latLngOrigin.lat(), lng: this.latLngOrigin.lng()},
    {lat: this.latLngDestination.lat(), lng: this.latLngDestination.lng()}
  ];
  var flightPath = new google.maps.Polyline({
    path: flightPlanCoordinates,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2,
    icons: [{
      icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW},
      offset: '100%'
    }]
  });
  flightPath.setMap(this.map);
  //*/
  //* Totest find my route/
  //var start = document.getElementById('start').textContent;
  //var end = document.getElementById('end').textContent;
  directionsService.route({
    origin: this.remorquage.origin,
    destination: this.remorquage.destination,
    travelMode: google.maps.TravelMode.DRIVING
  }, async function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      //await directionsDisplay.setDirections(response);
      //console.log('response : '+response.routes.toString())
      let result = await document.getElementById('right-panel').textContent;
      //console.log('result : '+result)
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
  //*/
}

  onPrint(){    
    /* //this.distance=this.calculateDistance() / 1000
    //this.distance2Ads(this.demande.origin, this.demande.destination)
    this.setDistanceTravel(this.demande.origin, this.demande.destination)
    this.totalPoints = this.longeurPointage(this.longeur, this.mode) + this.largeurPointage(this.largeur, this.mode) + this.hauteurPointage(this.hauteur, this.mode) 
      + this.poidsPointage(this.poids, this.mode); // + this.valeur + this.distance;
    
    this.prix = this.prixDepart(this.totalPoints) + this.prixDistance(this.totalPoints) + this.prixToile(this.totalPoints)
      + this.prixAttendre(this.totalPoints) + this.prixSuplement(this.totalPoints, this.heurs_supl);
    this.searchTruck=false; //activer poster et rechercher
 */
  }

  //* calculer distance travel en kms
  setDistanceTravel(address1: string, address2:string) { // in km
    let service = new google.maps.DistanceMatrixService;// = new google.maps.DistanceMatrixService()
    // calculate load distance - ld
    service.getDistanceMatrix({
      'origins': [address1], 'destinations': [address2], travelMode:google.maps.TravelMode.DRIVING
    }, (results: any) => {    
      this.remorquage.distance= Math.round((results.rows[0].elements[0].distance.value)/1000)  
      //this.distanceKm = Math.round(this.distance*1.609344)
    });  
  }

  typeServiceChange(){
    //alert('Must write this function, typeServiceChange')
    if(this.remorquage.typeService.includes('Leger')){
      this.remorquage.prixBase=85.00;
      this.remorquage.inclus=5.00;
      this.remorquage.prixKm=2.65;
    }
    else if(this.remorquage.typeService.includes('Moyenne')){
      this.remorquage.prixBase=95.00;
      this.remorquage.inclus=6.00;
      this.remorquage.prixKm=3.15;
    }
    else if(this.remorquage.typeService.includes('Lourd')){
      this.remorquage.prixBase=105.00;
      this.remorquage.inclus=7.00;
      this.remorquage.prixKm=3.80;
    }
    else{
      this.remorquage.prixBase=-1.00;
      this.remorquage.inclus=-1.00;
      this.remorquage.prixKm=-1.00;
    }
  }

  onReset(){
    this.remorquage=new Remorquage();
  }

}

interface marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
}

interface Center{
  lat:number;
  lng:number;
}

export interface LatLngLiteral{
  lat:number,
  lng:number
}
