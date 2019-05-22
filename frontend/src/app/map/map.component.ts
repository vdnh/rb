import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { } from 'googlemaps';
import { Camion } from 'src/model/model.camion';
import { CamionsService } from 'src/services/camions.service';
import { Observable, timer, interval, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
//import 'rxjs/add/observable/interval';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  
  subscription : Subscription;
  
  camion:Camion=new Camion();
  //id:number=265;  // test wit F550 of SOS - Yannick
  id:number=108;  // test wit Hino of SOS
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  marker=new google.maps.Marker();

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
      this.camionsService.getDetailCamion(this.id).subscribe((data:Camion)=>{
        this.camion=data;
        if((this.camion.uniteMonitor!=null && this.camion.monitor!=null) && (this.camion.monitor.length!=0 && this.camion.monitor.length!=0)){
          this.latitude = this.camion.latitude;
          this.longitude= this.camion.longtitude
          this.marker.setMap(null);
          let location1 = new google.maps.LatLng(this.latitude, this.longitude);
          let mapProp = {
            center: new google.maps.LatLng(this.camion.latitude, this.camion.longtitude),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
          this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
          this.marker = new google.maps.Marker({
            position: location1,
            map: this.map,
            icon: "http://maps.google.com/mapfiles/kml/shapes/truck.png",
            title: this.camion.unite
          });

          console.log('this.camion.uniteMonotor  + this.camion.monitor : '+this.camion.uniteMonitor +' + '+ this.camion.monitor);
          const source = interval(60000);
          this.subscription=source.subscribe(val=>{this.getLocalisation()})  
        }
        else
          alert("Ce camion n'est pas suivi gps")
      }, err=>{
        console.log();
      })//*/
    })
    //console.log('this.camion.uniteMonotor  :+ this.camion.monitor : '+this.camion.uniteMonitor +' : '+ this.camion.monitor);
    //if(this.camion.uniteMonotor.length>0 && this.camion.monitor.length>0){
      //const source = interval(60000);
      //this.subscription=source.subscribe(val=>{this.getLocalisation()})
    //}
  }
  testAlert(){
    alert("hi, this is test every 2 seconds")
  }
  getLocalisation(){
    this.camionsService.getDetailCamion(this.id).subscribe((data:Camion)=>{
      this.camion=data;
      this.latitude = this.camion.latitude;
      this.longitude= this.camion.longtitude
      this.marker.setMap(null);
      let location1 = new google.maps.LatLng(this.latitude, this.longitude);
      this.marker = new google.maps.Marker({
        position: location1,
        map: this.map,
        icon: "http://maps.google.com/mapfiles/kml/shapes/truck.png",
        title: this.camion.unite
      });
    }, err=>{
      console.log();
    })//*/
  }
  // ngOnDestroy(): void {
  //   this.subscription.unsubscribe();
  //   console.log('Destroy timer')
  // }
  
  ngOnInit() {

  }

  setMapType(mapTypeId: string) {
    this.map.setMapTypeId(mapTypeId)
  }

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
