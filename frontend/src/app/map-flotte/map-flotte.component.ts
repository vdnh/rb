import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { } from 'googlemaps';
import { Camion } from 'src/model/model.camion';
import { CamionsService } from 'src/services/camions.service';
import { Observable, timer, interval, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Transporter } from 'src/model/model.transporter';

@Component({
  selector: 'app-map-flotte',
  templateUrl: './map-flotte.component.html',
  styleUrls: ['./map-flotte.component.css']
})
export class MapFlotteComponent implements OnInit {

  subscription : Subscription;
  transporter:Transporter=new Transporter();
  camion:Camion=new Camion();
  camions:Array<Camion>=new Array<Camion>();
  //id:number=265;  // test wit F550 of SOS - Yannick
  //id:number=8;  // test transporter SOS
  id:number=1;  // test transporter01
  idCamion:number=108;  // test wit Hino of SOS
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  markers=Array<google.maps.Marker>();

  latitude:number=45;
  longitude:number=-73;

  iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

  markerTypes = [
    {
      text: "Parking", value: "parking_lot_maps.png"
    }
    /* ,
     {
       text: "Library", value: "library_maps.png"
     },
     {
       text: "Information", value: "info-i_maps.png"
     }//*/
  ];

  selectedMarkerType: string = "parking_lot_maps.png";

  isHidden = false;

  constructor(public activatedRoute:ActivatedRoute, public camionsService:CamionsService, private router:Router){
    
    this.id=activatedRoute.snapshot.params['id'];      
    
    var numbers = timer(2000);
    numbers.subscribe(x =>{
      this.camionsService.camionsDeTransporter(this.id).subscribe((data:Array<Camion>)=>{
        this.camions=data;
        let mapProp = {
          center: new google.maps.LatLng(45.568806, -73.918333),
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
        this.camions.forEach(camion=>{
          //console.log("camion.id : "+ camion.id)
          if(camion.uniteMonitor!=null && camion.monitor!=null){
            //this.marker.setMap(null);
            let location1 = new google.maps.LatLng(camion.latitude, camion.longtitude);
            
            let marker = new google.maps.Marker({
              position: location1,
              map: this.map,
              icon: "http://maps.google.com/mapfiles/kml/shapes/truck.png",
              title: camion.unite
            });
            this.markers.push(marker)
          }  
        })
        const source = interval(60000);
        this.subscription=source.subscribe(val=>{this.getLocalisation()})
      }, err=>{
        console.log();
      })

    })
  }
  testAlert(){
    alert("hi, this is test every 2 seconds")
  }
  getLocalisation(){
    this.camionsService.camionsDeTransporter(this.id).subscribe((data:Array<Camion>)=>{
      this.camions=data;
      //* demarsk the list of trucks
      this.markers.forEach(marker=>{
        marker.setMap(null);
        marker=null;
      })
      this.markers = [];
      //*/
      this.camions.forEach(camion=>{
        //console.log("camion.id : "+ camion.id)
        if(camion.uniteMonitor!=null && camion.monitor!=null){
          let location1 = new google.maps.LatLng(camion.latitude, camion.longtitude);          
          let marker = new google.maps.Marker({
            position: location1,
            map: this.map,
            icon: "http://maps.google.com/mapfiles/kml/shapes/truck.png",
            title: camion.unite
          });
          this.markers.push(marker);
        }  
      })
    }, err=>{
      console.log();
    })
  }
  ngOnInit() {

  }

  setMapType(mapTypeId: string) {
    this.map.setMapTypeId(mapTypeId)
  }
/*
  setCenter() {
    this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));

    let location = new google.maps.LatLng(this.latitude, this.longitude);

    this.marker = new google.maps.Marker({
      position: location,
      map: this.map,
      title: 'Got you!'
    });

    this.marker.addListener('click', this.simpleMarkerHandler);

    this.marker.addListener('click', () => {
      this.markerHandler(this.marker);
    });
  }
//*/
  simpleMarkerHandler() {
    alert('Simple Component\'s function...');
  }

  markerHandler(marker: google.maps.Marker) {
    alert('Marker\'s Title: ' + marker.getTitle());
  }

  showCustomMarker() {


    this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));

    let location = new google.maps.LatLng(this.latitude, this.longitude);

    console.log(`selected marker: ${this.selectedMarkerType}`);

    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: this.iconBase + this.selectedMarkerType,
      title: 'Got you!'
    });
  }

  toggleMap() {
    this.isHidden = !this.isHidden;

    this.gmapElement.nativeElement.hidden = this.isHidden;
  }

}
