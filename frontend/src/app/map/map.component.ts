import { Component, OnInit, OnDestroy } from '@angular/core';
import { ViewChild } from '@angular/core';
import { } from 'googlemaps';
import { Camion } from 'src/model/model.camion';
import { CamionsService } from 'src/services/camions.service';
import { Observable, timer, interval, Subscription } from 'rxjs';
//import 'rxjs/add/observable/interval';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  
  subscription : Subscription;
  

  camion:Camion=new Camion();
  id:number=106;  // test wit truck 17 of transporter01

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

  constructor(public camionsService:CamionsService){
    var numbers = timer(2000);
    numbers.subscribe(x =>{
      let mapProp = {
        center: new google.maps.LatLng(45.568806, -73.918333),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    })
    // let mapProp = {
    //   center: new google.maps.LatLng(45.568806, -73.918333),
    //   zoom: 15,
    //   mapTypeId: google.maps.MapTypeId.ROADMAP
    // };
    // this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    const source = interval(10000);
    this.subscription=source.subscribe(val=>{this.getLocalisation()})
  }
  testAlert(){
    alert("hi, this is test every 2 seconds")
  }
  getLocalisation(){
    this.camionsService.getDetailCamion(this.id).subscribe((data:Camion)=>{
      this.camion=data;
      this.latitude = this.camion.latitude;
      this.longitude= this.camion.longtitude
      //console.log('latitude camion in init() : '+this.camion.latitude);
      //console.log('longtitude camion in init() : '+this.camion.longtitude);
      //*
      // let mapProp = {
      //   center: new google.maps.LatLng(45.568806, -73.918333),
      //   zoom: 15,
      //   mapTypeId: google.maps.MapTypeId.ROADMAP
      // };
      // this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
      
      // this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));
  
      
      //marker.setMap(null);
      this.marker.setMap(null);
      let location1 = new google.maps.LatLng(this.latitude, this.longitude);
      this.marker = new google.maps.Marker({
        position: location1,
        map: this.map,
        icon: "http://maps.google.com/mapfiles/kml/shapes/truck.png",
        title: 'Camion 17'
      });
      //this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));
    }, err=>{
      console.log();
    })//*/
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    console.log('Destroy timer')
  }
  
  ngOnInit() {
    // let mapProp = {
    //   center: new google.maps.LatLng(45.568806, -73.918333),
    //   zoom: 15,
    //   mapTypeId: google.maps.MapTypeId.ROADMAP
    // };
    // this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    
    //setTimeout(this.testAlert, 2000, "mom teste")
    //Observable.interval(2000).subscribe((val)=>{console.log('testAlert called')}) //interval(2000);
    /*
    this.camionsService.getDetailCamion(this.id).subscribe((data:Camion)=>{
      this.camion=data;
      this.latitude = this.camion.latitude;
      this.longitude= this.camion.longtitude
      console.log('latitude camion in init() : '+this.camion.latitude);
      console.log('longtitude camion in init() : '+this.camion.longtitude);
      //*
      let mapProp = {
        center: new google.maps.LatLng(45.568806, -73.918333),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
      
      this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));
  
      let location1 = new google.maps.LatLng(this.latitude, this.longitude);
      let marker = new google.maps.Marker({
        position: location1,
        map: this.map,
        icon: "http://maps.google.com/mapfiles/kml/shapes/truck.png",
        title: 'Camion 17'
      });
     
    }, err=>{
      console.log();
    })//*/
    /*
    let mapProp = {
      center: new google.maps.LatLng(45.568806, -73.918333),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    
    this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));
    //*/
    //let location1 = new google.maps.LatLng(45.568874, -73.918333);
    // console.log('this.latitude out Init() : '+this.latitude);
    // console.log('this.longitude out Init() : '+this.longitude);
    // console.log('this.camion.latitude out Init() : '+this.camion.latitude);
    // console.log('this.camion.longtitude out Init() : '+this.camion.longtitude);
    /*
    let location1 = new google.maps.LatLng(this.latitude, this.longitude);
    let marker = new google.maps.Marker({
      position: location1,
      map: this.map,
      icon: "http://maps.google.com/mapfiles/kml/shapes/truck.png",
      title: 'Camion 17'
    });//*/

    //*
    /*
    let location2 = new google.maps.LatLng(45.569234, -73.918440);
    let marker02 = new google.maps.Marker({
      position: location2,
      map: this.map,
      icon: "http://maps.google.com/mapfiles/kml/shapes/truck.png",
      title: 'Camion test'
    });//*/
  }
  /*
  ngDoCheck(){
    this.latitude = this.camion.latitude;
    this.longitude= this.camion.longtitude
    console.log('latitude camion in doCheck() : '+this.camion.latitude);
    console.log('longtitude camion in doCheck() : '+this.camion.longtitude);
  }//*/
  /*
  ngAfterContentChecked(){
    console.log('latitude camion in ngAfterContentChecked() : '+this.camion.latitude);
    console.log('longtitude camion in ngAfterContentChecked() : '+this.camion.longtitude);
    
    console.log('this.latitude in ngAfterContentChecked() : '+this.latitude);
    console.log('this.longitude in ngAfterContentChecked() : '+this.longitude);
        
  }//*/
  /*
  async ngAfterContentInit() {
    await this.camionsService.getDetailCamion(this.id).subscribe((data:Camion)=>{
      this.camion=data;
      this.latitude = this.camion.latitude;
      this.longitude= this.camion.longtitude
      console.log('latitude camion in ngAfterContentInit() after call webservice : '+this.camion.latitude);
      console.log('longtitude camion in ngAfterContentInit() after call webservice : '+this.camion.longtitude);
    }, err=>{
      console.log();
    })
    //center: new google.maps.LatLng(this.camion.latitude, this.camion.longtitude),
    console.log('latitude camion in AfterContentInit() : '+this.camion.latitude);
    console.log('longtitude camion in AfterContentInit() : '+this.camion.longtitude);
    let mapProp = {
      center: new google.maps.LatLng(45.568806, -73.918333),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    
    //this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));

    //let location1 = new google.maps.LatLng(45.568874, -73.918333);
    console.log('this.latitude in AfterContentInit() : '+this.latitude);
    console.log('this.longitude in AfterContentInit() : '+this.longitude);
    let location1 = new google.maps.LatLng(this.latitude, this.longitude);
    let marker = new google.maps.Marker({
      position: location1,
      map: this.map,
      icon: "http://maps.google.com/mapfiles/kml/shapes/truck.png",
      title: 'Camion 17'
    });

    //*
    let location2 = new google.maps.LatLng(45.569234, -73.918440);
    let marker02 = new google.maps.Marker({
      position: location2,
      map: this.map,
      icon: "http://maps.google.com/mapfiles/kml/shapes/truck.png",
      title: 'Camion test'
    });
    /*
    let location3 = new google.maps.LatLng(45.719947, -73.674694);
    let marker03 = new google.maps.Marker({
      position: location3,
      map: this.map,
      icon: "http://maps.google.com/mapfiles/kml/shapes/truck.png",
      title: 'Camion 03'
    });
    //*

  }//*/

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
    //marker.setMap(null); // Remove a marker from map
    //marker.setVisible(false);
  }

  toggleMap() {
    this.isHidden = !this.isHidden;

    this.gmapElement.nativeElement.hidden = this.isHidden;
  }
}
