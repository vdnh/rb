import { Component, OnInit} from '@angular/core';
import { VoyagesService } from 'src/services/voyages.service';
import { Voyage } from 'src/model/model.voyage';
import { MouseEvent, MapsAPILoader } from '@agm/core';
import { GeocodingService } from 'src/services/geocoding.service';

@Component({
  selector: 'app-creer-voyage',
  templateUrl: './creer-voyage.component.html',
  styleUrls: ['./creer-voyage.component.css']
})
export class CreerVoyageComponent implements OnInit {

  today:Date; 
  voyage:Voyage=new Voyage();
  listRadius : Array<number> = [50, 100, 200, 300, 400, 500];
  
  //* Pour ajouter des circles and markers sur la carte
  // google maps zoom level
  zoom: number = 6;
  
  // initial center position for the map
  lat: number = 45.503964;
  lng: number = -73.567426;
  latLngOrigin:google.maps.LatLng =null;
  latLngDestination:google.maps.LatLng =null;

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }
  
  mapClicked($event: MouseEvent) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });
  }
  
  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
    console.log('Moved to point m.lat : '+m.lat+' and m.lng : '+m.lng)
  }
  
  markers: marker[] = [
	  {
		  lat: 45.503964,
		  lng: -73.567426,
		  label: '#01',
		  draggable: true
	  },
	  {
		  lat: 45.503964,
		  lng: -73.567426,
		  label: '#02',
		  draggable: true
	  },
	  {
		  lat: 45.503964,
		  lng: -73.567426,
		  label: '#03',
		  draggable: true
	  }
  ]
  // finir ajouter des circles et markes */
  
  constructor(public voyagesService : VoyagesService, public geocoding : GeocodingService) { 
    this.latLngOrigin=new google.maps.LatLng(this.lat, this.lng);
    this.latLngDestination=new google.maps.LatLng(this.lat, this.lng);
  }

  async ngOnInit() {
    this.today=new Date();
    //console.log('this.today : '+this.today)
    this.voyage.origin="Montreal";
    this.voyage.destination="Toronto";
    this.voyage.radiusOrigin=200; // en miles
    this.voyage.radiusDestination=200; // en miles
    //this.latLngOrigin=new google.maps.LatLng(this.lat, this.lng);
    //this.latLngDestination=new google.maps.LatLng(this.lat, this.lng);
    //*
    await this.geocoding.codeAddress(this.voyage.origin).forEach(
      (results: google.maps.GeocoderResult[]) => {
            if(results[0].geometry.location.lat()>0){
              this.latLngOrigin= new google.maps.LatLng(
                results[0].geometry.location.lat(),
                results[0].geometry.location.lng()                            
              )                            
            }
            console.log('this.latLngOrigin.lat() : '+this.latLngOrigin.lat())
            console.log(this.latLngOrigin.lng())
      });
    await this.geocoding.codeAddress(this.voyage.destination).forEach(
      (results: google.maps.GeocoderResult[]) => {
            if(results[0].geometry.location.lat()>0){
              this.latLngDestination= new google.maps.LatLng(
                results[0].geometry.location.lat(),
                results[0].geometry.location.lng()                            
              )
            }
            console.log(this.latLngDestination.lat())
            console.log(this.latLngDestination.lng())
        });//*/
        console.log(this.latLngOrigin.lat())
        console.log(this.latLngOrigin.lng())
        console.log(this.latLngDestination.lat())
        console.log(this.latLngDestination.lng())    
    this.voyage.idTransporter = Number(localStorage.getItem("userId"));
    this.voyage.nomTransporter = localStorage.getItem("nom");
  }
  
  originChange(){
    //*
    this.geocoding.codeAddress(this.voyage.origin).forEach(
      (results: google.maps.GeocoderResult[]) => {
            if(results[0].geometry.location.lat()>0){
              this.latLngOrigin= new google.maps.LatLng(
                results[0].geometry.location.lat(),
                results[0].geometry.location.lng()                            
              )
            }
            alert("En deplacant, attendre 2 secondes svp, puis press OK.")
            //console.log(this.latLngOrigin.lat())
            //console.log(this.latLngOrigin.lng())
    });//*/
    //console.log('hi from originChange')
  }
  
  destinationChange(){
    //*
    this.geocoding.codeAddress(this.voyage.destination).forEach(
      (results: google.maps.GeocoderResult[]) => {
            if(results[0].geometry.location.lat()>0){
              this.latLngDestination= new google.maps.LatLng(
                results[0].geometry.location.lat(),
                results[0].geometry.location.lng()                            
              )
            }
            alert("En deplacant, attendre 2 secondes svp, puis press OK.")
            //alert("Attendre un peu en deplacant !!")
            //console.log(this.latLngDestination.lat())
            //console.log(this.latLngDestination.lng())
    });//*/
    //console.log('hi from destinationChange')
  }
  onSaveVoyage(){
    this.voyage.dateDepart = new Date(this.voyage.dateDepart)
    this.voyagesService.saveVoyages(this.voyage).subscribe((data:Voyage)=>{
    }
    , err=>{
      console.log(err)
    })
  }

  onReset(){
    this.voyage=new Voyage();
    this.ngOnInit()
  }

  // km en mile
  kmEnMile(distance:number){
    return distance = distance * 0.621371;
    console.log(distance+' miles');
  }

    // mile en km
    mileEnKm(distance:number){
      return distance = distance / 0.621371;
      //console.log(distance+' km');
    }

    private onRadius1Changed(radius:number){
      this.voyage.radiusOrigin=this.kmEnMile(radius)/1000;
      console.log('RadiusOrigin was changed.: '+ this.voyage.radiusOrigin)
    }
    private onRadius2Changed(radius:number){
      this.voyage.radiusDestination=this.kmEnMile(radius)/1000;
      console.log('RadiusDestination was changed.: '+ this.voyage.radiusDestination)
    }
    private async onCenter1Changed(center:Center){
      //console.log('center.lat + center.lng : '+center.lat+' '+center.lng)
      this.latLngOrigin = new google.maps.LatLng(center.lat, center.lng);
      //console.log(this.latLngOrigin.lat())
      //console.log(this.latLngOrigin.lng())
      //console.log("Address Origin")
      //await this.latLngToAddress(this.latLngOrigin)
    }
    private async onCenter2Changed(center:Center){
      //console.log('center.lat + center.lng : '+center.lat+' '+center.lng)
      this.latLngDestination = new google.maps.LatLng(center.lat, center.lng);
      //console.log(this.latLngDestination.lat())
      //console.log(this.latLngDestination.lng())
      //console.log("Address Destination")
      //await this.latLngToAddress(this.latLngDestination)
    }
    latLngToAddress(pos:google.maps.LatLng){
      this.geocoding.geocode(pos).forEach(
        (results: google.maps.GeocoderResult[]) => {
            //this.setMarker(this.center, "your locality", results[0].formatted_address);
            console.log('results[0].formatted_address : '+results[0].formatted_address)
            //console.log('results[0].address_components : '+results[0].address_components.toString())
            //console.log('results[0].geometry : '+results[0].geometry.location)
            //console.log('results[0].postcode_localities : '+results[0].postcode_localities.values)
            //console.log('results[0].place_id : '+results[0].place_id)
            //console.log('results[0].types : '+results[0].types)
        })
    }

  }

// just an interface for type safety.
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
