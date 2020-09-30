import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Camion } from 'src/model/model.camion';
import { Chauffeur } from 'src/model/model.chauffeur';
import { Itineraire } from 'src/model/model.itineraire';
import { Transporter } from 'src/model/model.transporter';
import { CamionsService } from 'src/services/camions.service';
import { ChauffeursService } from 'src/services/chauffeurs.service';
import { GeolocationService } from 'src/services/geolocation.service';
import { ItinerairesService } from 'src/services/itineraires.service';
import { ReperesService } from 'src/services/reperes.service';
import { TransportersService } from 'src/services/transporters.service';
import { VarsGlobal } from 'src/services/VarsGlobal';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-terminal-follow',
  templateUrl: './terminal-follow.component.html',
  styleUrls: ['./terminal-follow.component.css']
})
export class TerminalFollowComponent implements OnInit {
  driverNote="Speed : ";
  // driverMoved="Having moved : ";

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  
  constructor(
    public transportersService:TransportersService,
    public camionsService:CamionsService,
    public chauffeursService:ChauffeursService,
    public varsGlobal:VarsGlobal,
    private geolocation : GeolocationService,
    private itinerairesService:ItinerairesService, 
    private reperesService:ReperesService,) { }

  truck : Camion; // camion to modify detail 
  truckTemp : Camion; // camion temp to compare gps before update - to save time update null 
  allTrucks:Camion[]  // list of camions no-gps and gps
  driver : Chauffeur;
  allDrivers : Chauffeur[];
  transporter : Transporter;
  itiner:Itineraire=new Itineraire();
  itiners:Array<Itineraire>=[];
  itinersFinis:Array<Itineraire>=[];

  subscription : Subscription;
  ngOnDestroy(): void {
    if(this.subscription!=null) this.subscription.unsubscribe();
  }

  ngOnInit(){
    this.transportersService.getDetailTransporter(Number(localStorage.getItem('userId'))).subscribe((data:Transporter)=>{
      this.transporter=data; 
      this.camionsService.camionsDeTransporter(this.transporter.id).subscribe((data:Array<Camion>)=>{
        this.allTrucks=data.filter(x=>(!x.trailer && x.status && !x.outService))
        // console.log('Number of trucks: ' + this.allTrucks.length)
      }, err=>{
        console.log(err)
      })
    },err=>{
      console.log(err)
    }) 

  }

  calculateDistance(p1:google.maps.LatLng, p2:google.maps.LatLng ){ //lat1, lng1, lat2, lng2) {
    let dLat = this.toRadians(p2.lat() - p1.lat());
    let dLon = this.toRadians(p2.lng() - p1.lng());
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
            + Math.cos(this.toRadians(p1.lat()))
            * Math.cos(this.toRadians(p2.lat())) * Math.sin(dLon / 2)
            * Math.sin(dLon / 2);
    let c = 2 * Math.asin(Math.sqrt(a));
    let distanceInMeters = Math.round(6371000 * c);
    return distanceInMeters;
  }
  
  toRadians (angle) {
    return angle * (Math.PI / 180);
  }
  
  toDegrees (angle) {
    return angle * (180 / Math.PI);
  }

  onSaveTruck(){
    // must verify if the data have changed
    if(this.truckTemp==null || this.truckTemp.odometre!=this.truck.odometre ||
        this.truckTemp.latitude!=this.truck.latitude || 
        this.truckTemp.longtitude!=this.truck.longtitude)
    {
      this.camionsService.saveCamions(this.truck).subscribe((data:Camion)=>{
        this.truckTemp = data;
        // this.showMap();
        this.movingTruck();
      },err=>{})
    }
    else { 
      // if data no change : do nothing
    }
  }

  marker : google.maps.Marker
  showMap() {
    this.camionsService.getDetailCamion(this.truck.id).subscribe((data:Camion)=>{
      this.truck=data;
      if(this.marker!=null) this.marker.setMap(null)
      let mapProp = {
        center: new google.maps.LatLng(this.truck.latitude, this.truck.longtitude),
        zoom: 15,
        //mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
      
      this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(this.truck.latitude, this.truck.longtitude),
        map: this.map,
        //icon: 'https://maps.google.com/mapfiles/kml/shapes/info-i_maps.png', //;this.iconBase + this.selectedMarkerType,
        // icon: {
        //   path: google.maps.SymbolPath.CIRCLE,
        //   scale:7,
        // },
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale:5,
          rotation:this.truck.direction,
          strokeWeight: 3,
          strokeColor: "#008088", //"#FFFFFF",//"red",
        },
        title: this.truck.unite
      });
      // centrer la carte
      this.map.setCenter(new google.maps.LatLng(this.truck.latitude, this.truck.longtitude));
    },err=>{console.log(err)})

    const intervalCSM = interval(30000); //intervel 30 seconds for update data truck on the map
    this.subscription=intervalCSM.subscribe(val=>{
      this.camionsService.getDetailCamion(this.truck.id).subscribe((data:Camion)=>{
        this.truck=data;
        this.movingTruck();
      },err=>{console.log(err)})
    })


  }

  movingTruck() {
    //if(this.marker!=null) this.marker.setMap(null) 
    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(this.truck.latitude, this.truck.longtitude),
      map: this.map,
      //icon: 'https://maps.google.com/mapfiles/kml/shapes/info-i_maps.png', //;this.iconBase + this.selectedMarkerType,
      // icon: {
      //   path: google.maps.SymbolPath.CIRCLE,
      //   scale:7,
      // },
      icon: {
         path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
         scale:5,
         rotation:this.truck.direction,
         strokeWeight: 3,
         strokeColor: "#008088", //"#FFFFFF",//"red",
       },
      title: this.truck.unite
    });
    this.map.setCenter(new google.maps.LatLng(this.truck.latitude, this.truck.longtitude));
  }

}
