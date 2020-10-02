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
import { TerminalsService } from 'src/services/terminals.service';
import { Terminal } from 'src/model/model.terminal';

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
    public terminalsService:TerminalsService,
    public transportersService:TransportersService,
    // public camionsService:CamionsService,
    public chauffeursService:ChauffeursService,
    public varsGlobal:VarsGlobal,
    private geolocation : GeolocationService,
    private itinerairesService:ItinerairesService, 
    private reperesService:ReperesService,) { }

  terminal : Terminal;
  terminalTemp : Terminal; // terminal temp to compare gps before update - to save time update null 
  terminals : Terminal[];
  // truck : Camion; // camion to modify detail 
  // truckTemp : Camion; // camion temp to compare gps before update - to save time update null 
  // allTrucks:Camion[]  // list of camions no-gps and gps
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
      // this.camionsService.camionsDeTransporter(this.transporter.id).subscribe((data:Array<Camion>)=>{
      //   this.allTrucks=data.filter(x=>(!x.trailer && x.status && !x.outService))
      //   // console.log('Number of trucks: ' + this.allTrucks.length)
      // }, err=>{
      //   console.log(err)
      // })
      this.terminalsService.terminalsDeTransporter(this.transporter.id).subscribe((data:Array<Terminal>)=>{
        this.terminals=data.filter(x=>(x.status))
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

  onSaveTerminal(){
    // must verify if the data have changed
    if(this.terminalTemp==null ||
        this.terminalTemp.latitude!=this.terminal.latitude || 
        this.terminalTemp.longitude!=this.terminal.longitude)
    {
      this.terminalsService.saveTerminals(this.terminal).subscribe((data:Terminal)=>{
        this.terminalTemp = data;
        // this.showMap();
        this.movingTerminal();
      },err=>{})
    }
    else { 
      // if data no change : do nothing
    }
  }

  marker : google.maps.Marker
  showMap() {
    this.terminalsService.getDetailTerminal(this.terminal.id).subscribe((data:Terminal)=>{
      this.terminal=data;
      if(this.marker!=null) this.marker.setMap(null)
      let mapProp = {
        center: new google.maps.LatLng(this.terminal.latitude, this.terminal.longitude),
        zoom: 15,
        //mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
      
      this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(this.terminal.latitude, this.terminal.longitude),
        map: this.map,
        //icon: 'https://maps.google.com/mapfiles/kml/shapes/info-i_maps.png', //;this.iconBase + this.selectedMarkerType,
        // icon: {
        //   path: google.maps.SymbolPath.CIRCLE,
        //   scale:7,
        // },
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale:5,
          rotation:this.terminal.direction,
          strokeWeight: 3,
          strokeColor: "#008088", //"#FFFFFF",//"red",
        },
        title: this.terminal.name
      });
      // centrer la carte
      this.map.setCenter(new google.maps.LatLng(this.terminal.latitude, this.terminal.longitude));
    },err=>{console.log(err)})

    const intervalCSM = interval(30000); //intervel 30 seconds for update data terminal on the map
    this.subscription=intervalCSM.subscribe(val=>{
      this.terminalsService.getDetailTerminal(this.terminal.id).subscribe((data:Terminal)=>{
        this.terminal=data;
        this.movingTerminal();
      },err=>{console.log(err)})
    })


  }

  movingTerminal() {
    //if(this.marker!=null) this.marker.setMap(null) 
    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(this.terminal.latitude, this.terminal.longitude),
      map: this.map,
      //icon: 'https://maps.google.com/mapfiles/kml/shapes/info-i_maps.png', //;this.iconBase + this.selectedMarkerType,
      // icon: {
      //   path: google.maps.SymbolPath.CIRCLE,
      //   scale:7,
      // },
      icon: {
         path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
         scale:5,
         rotation:this.terminal.direction,
         strokeWeight: 3,
         strokeColor: "#008088", //"#FFFFFF",//"red",
       },
      title: this.terminal.name
    });
    this.map.setCenter(new google.maps.LatLng(this.terminal.latitude, this.terminal.longitude));
  }

}
