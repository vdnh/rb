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
  
  villeListO= myGlobals.QuebecVilles; //villeList Origin ;
  
  villeListD=this.villeListO; // villeList destination ;
  
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
    console.log(this.remorquage.dateDepart)
    var heure= this.remorquage.dateDepart.getHours().toString().length==2?this.remorquage.dateDepart.getHours().toString():'0'+this.remorquage.dateDepart.getHours().toString()
      //+':'+
    var minute= this.remorquage.dateDepart.getMinutes().toString().length==2?this.remorquage.dateDepart.getMinutes().toString():'0'+this.remorquage.dateDepart.getMinutes().toString()
    //if(this.remorquage.timeCall.length)
    this.remorquage.timeCall=heure+':'+minute
    console.log('this.remorquage.timeCall : '+this.remorquage.timeCall)
    this.remorquage.typeService=this.serviceTypes[0];
    this.typeServiceChange(this.serviceTypes[0]);
    this.prixCalcul()
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
    if(this.remorquage.destination!=null && this.remorquage.destination.length>0){
      await this.setDistanceTravel(this.remorquage.origin, this.remorquage.destination)
      await this.showMap()
      this.prixCalcul()
    }
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
    if(this.remorquage.origin!=null && this.remorquage.origin.length>0){
      await this.setDistanceTravel(this.remorquage.origin, this.remorquage.destination)
      await this.showMap()
      this.prixCalcul()
    }
  }//this.showMap();
}

printBonDeRemorquage(cmpId){
  const printContent = document.getElementById(cmpId);
   console.log('printContent.innerHTML : '+printContent.innerHTML+' *** end.')
  //const WindowPrt = window.open('','','left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
  const WindowPrt = window.open();
  WindowPrt.document.write('<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');
  WindowPrt.document.write(printContent.innerHTML);
  WindowPrt.document.close();
  WindowPrt.focus();
  WindowPrt.print();
  WindowPrt.close();
}

prixCalcul(){
  this.remorquage.horstax=this.remorquage.prixBase
  if((this.remorquage.distance-this.remorquage.inclus)>0){
    this.remorquage.horstax = this.remorquage.horstax + (this.remorquage.distance-this.remorquage.inclus)*this.remorquage.prixKm
  }
  this.remorquage.tps = Math.round(this.remorquage.horstax*0.05*100)/100
  this.remorquage.tvq = Math.round(this.remorquage.horstax*0.09975*100)/100
  this.remorquage.total=this.remorquage.horstax+this.remorquage.tvq+this.remorquage.tps
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
  
  autoCharacter(event:any){
    //event.val(event.val().replace(/(\d{3})\-?(\d{3})\-?(\d{4})/,'$1-$2-$3'))
    
    //this.remorquage.telContact = event.target.value
    //var text = this.remorquage.telContact; 
    //if (key !== 8 && key !== 9) {
        if (event.target.value.length === 3) {
          event.target.value=event.target.value + '-';
        }
        if (event.target.value.length === 7) {
          event.target.value=event.target.value + '-';
        }
    //}
    //console.log('event.target.value : '+event.target.value)
    //return (key == 8 || key == 9 || key == 46 || (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
  }

  onFini(){
    var r = confirm("Etes vous sur que ce cas est fini ?")
    if(r==true){
      console.log("Le cas est termine.")
      this.remorquage.fini=true;
      this.remorquagesService.saveRemorquages(this.remorquage).subscribe(data=>{
        this.remorquage=new Remorquage();
      }, err=>{console.log(err)})
    }
    else {
      console.log('Le cas est continue.')
    }
    
  }
  onCancel(){
    var r = confirm("Etes vous sur d'annuller ce cas ?")
    if(r==true){
      console.log("Le cas est annulle.")
      if(this.remorquage.id>0){
        this.remorquagesService.deleteRemorquage(this.remorquage.id).subscribe(data=>{
          this.remorquage=new Remorquage();;
        }, err=>{console.log(err)})
      }
    }
    else {
      console.log('Le cas est continue.')
    }
  }
  onSave(){
    this.remorquagesService.saveRemorquages(this.remorquage).subscribe((data:Remorquage)=>{
      this.remorquage=data;
    }, 
      err=>{console.log(err)
    })
  }
  onPrint(heure){    
    console.log(heure)
    console.log('this.remorquage.timeCall : '+this.remorquage.timeCall)
    console.log('this.remorquage.timeResrvation : '+this.remorquage.timeResrvation)
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

  dateChange(date){
    //(ngModelChange)="dateChange($event)"
    this.remorquage.dateDepart=date;
    console.log('this.remorquage.dateDepart : '+this.remorquage.dateDepart)
  }

  typeServiceChange(type){
    //alert('Must write this function, typeServiceChange')
    //console.log('type entre : '+type)
    this.remorquage.typeService=type
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
    this.prixCalcul()
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
