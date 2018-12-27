import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { } from 'googlemaps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  latitude: any;
  longitude: any;

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

  ngOnInit() {

  }

  ngAfterContentInit() {
    let mapProp = {
      center: new google.maps.LatLng(45.568806, -73.918333),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    
    //this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));

    let location1 = new google.maps.LatLng(45.568874, -73.918333);
    let marker = new google.maps.Marker({
      position: location1,
      map: this.map,
      icon: "http://maps.google.com/mapfiles/kml/shapes/truck.png",
      title: 'Camion 01'
    });

    let location2 = new google.maps.LatLng(45.569234, -73.918440);
    let marker02 = new google.maps.Marker({
      position: location2,
      map: this.map,
      icon: "http://maps.google.com/mapfiles/kml/shapes/truck.png",
      title: 'Camion 02'
    });

    let location3 = new google.maps.LatLng(45.719947, -73.674694);
    let marker03 = new google.maps.Marker({
      position: location3,
      map: this.map,
      icon: "http://maps.google.com/mapfiles/kml/shapes/truck.png",
      title: 'Camion 03'
    });

  }

  setMapType(mapTypeId: string) {
    this.map.setMapTypeId(mapTypeId)
  }

  setCenter() {
    this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));

    let location = new google.maps.LatLng(this.latitude, this.longitude);

    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      title: 'Got you!'
    });

    marker.addListener('click', this.simpleMarkerHandler);

    marker.addListener('click', () => {
      this.markerHandler(marker);
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
