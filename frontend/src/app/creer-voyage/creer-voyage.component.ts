import { Component, OnInit, ViewChild} from '@angular/core';
import { VoyagesService } from 'src/services/voyages.service';
import { Voyage } from 'src/model/model.voyage';
import { MouseEvent, MapsAPILoader, LatLngLiteral } from '@agm/core';
import { GeocodingService } from 'src/services/geocoding.service';
import { GeolocationService} from 'src/services/geolocation.service';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { Demande } from 'src/model/model.demande';
import { DemandesService } from 'src/services/demandes.service';
declare var google: any;

@Component({
  selector: 'app-creer-voyage',
  templateUrl: './creer-voyage.component.html',
  styleUrls: ['./creer-voyage.component.css']
})
export class CreerVoyageComponent implements OnInit {
  today:Date; 
  voyage:Voyage=new Voyage();
  listRadius : Array<number> = [50, 100, 200, 300, 400, 500];
  //* pour checkBox list
  formGroup: FormGroup;
  camionTypes = [
    { id: 1, name: 'Van/DryBox' },
    { id: 2, name: 'FlatBed' },
    { id: 3, name: 'RackAndTarp' },
    { id: 4, name: 'Floats' },
    { id: 5, name: 'Reefer' },
    { id: 6, name: 'StepDeck' },
    { id: 7, name: 'Container' },
    { id: 8, name: 'LowBoy/RGN' },
    { id: 9, name: 'StraightTruck' },
    { id: 10, name: 'DoubleDrop' },
    { id: 11, name: 'SuperB' },
    { id: 12, name: 'PowerOnly' },
    { id: 13, name: 'CurtainSide' },
    { id: 14, name: 'RollTiteTrailer' },
    { id: 15, name: 'DumpTrailer' },
    { id: 16, name: 'Other' },
    { id: 17, name: 'Air Ride' },
    { id: 18, name: 'Chains' },
    { id: 19, name: 'Tarps' },
    { id: 20, name: 'Team' },
    { id: 21, name: 'Heat' },
    { id: 22, name: 'B-Train' },
    { id: 23, name: 'HazMat' },
    { id: 24, name: 'Vented' },
    { id: 25, name: 'Talgate' },
    { id: 26, name: 'Expedite' },
    { id: 27, name: 'Blanket Wrap' },
    { id: 28, name: 'Insulated' },
    { id: 29, name: 'Tri-Axle' },
    { id: 30, name: 'Frozen' },
    { id: 31, name: 'Inbond' },
    { id: 32, name: 'Other' }
  ];

  //*/  
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
  polygons = [];
  centerCoord={lat:45.568806, lng:-73.918333}  // location of SOS Prestige
  paths: Array<LatLngLiteral> = [];   
    /*/paths - around the site
    [
    { lat: 45.59484532374626,  lng: -73.97460678613282 },
    { lat: 45.5121445248795,  lng: -73.97598007714845 },
    { lat: 45.5256157388725, lng: -73.77410629785157 },
    { lat: 45.63518985644801, lng: -73.79882553613282 },
    { lat: 45.59484532374626,  lng: -73.97460678613282 },
    ]
  //*/
  originCircle = new google.maps.Circle(); /*{
    center: new google.maps.LatLng(this.latLngOrigin.lat, this.latLngOrigin.lng),
    radius: this.mileEnKm(this.voyage.radiusOrigin)*1000,  // en metre
    fillColor: '#FFFF00',
    editable: true,
    draggable: true,
  });//*/
  destCircle1 = new google.maps.Circle(); /*{
    center: new google.maps.LatLng(this.latLngDestination.lat, this.latLngDestination.lng),
    radius: this.mileEnKm(this.voyage.radiusDestination)*1000, // en metre
    fillColor: '#FF00FF',
    editable: true,
    draggable: true,
  })//*/
  polygon = new google.maps.Polygon(); /*{
    paths: this.paths,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF00EE',
    fillOpacity: 0.35,
    editable: true,
    draggable:true,
  })//*/
  /*
  managerOptions = {
    drawingControl: true,
    drawingControlOptions: {
      drawingModes: ['polygon']
    },
    polygonOptions: {
      draggable: true,
      editable: true
    },
    drawingMode: "polygon"
  };//*/

  
  //*/
  
  /*
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
  //*/
  // finir ajouter des circles et markes */
  
  constructor(public voyagesService : VoyagesService, public geocoding : GeocodingService, public demandesService : DemandesService, 
    private geolocation : GeolocationService, private formBuilder:FormBuilder, public router:Router) 
    { 
    this.latLngOrigin=new google.maps.LatLng(this.lat, this.lng);
    this.latLngDestination=new google.maps.LatLng(this.lat, this.lng);
    //* construct for checkbox list
    const selectAllControl = new FormControl(false);
    const formControls = this.camionTypes.map(control => new FormControl(false));
    this.formGroup = this.formBuilder.group({
      camionTypes: new FormArray(formControls),
      selectAll: selectAllControl
    });//*/
  }

  //* fonctionnes de checkbox list
  onChangeCamionTypes(): void {
    // Subscribe to changes on the selectAll checkbox
    this.formGroup.get('selectAll').valueChanges.subscribe(bool => {
      this.formGroup
        .get('camionTypes')
        .patchValue(Array(this.camionTypes.length).fill(bool), { emitEvent: false });
    });

    // Subscribe to changes on the music preference checkboxes
    this.formGroup.get('camionTypes').valueChanges.subscribe(val => {
      const allSelected = val.every(bool => bool);
      if (this.formGroup.get('selectAll').value !== allSelected) {
        this.formGroup.get('selectAll').patchValue(allSelected, { emitEvent: false });
      }
    });
  }

  onChangeTypeCamion() {
    const selectedCamionTypesNames = this.formGroup.value.camionTypes
      .map((v, i) => (v==true && i<16) ? this.camionTypes[i].name : null)
      .filter(i => i !== null);
    console.log(selectedCamionTypesNames);
    console.log('selectedCamionTypesNames.toString() : '+selectedCamionTypesNames.toString());
    this.voyage.typeCamion = selectedCamionTypesNames.toString();
  }

  onChangeOptionVoyage() {
    const selectedCamionTypesNames = this.formGroup.value.camionTypes
      .map((v, i) => (v==true && i>=16) ? this.camionTypes[i].name : null)
      .filter(i => i !== null);
    console.log(selectedCamionTypesNames);
    console.log('selectedCamionTypesNames.toString() : '+selectedCamionTypesNames.toString());
    this.voyage.optionVoyage = selectedCamionTypesNames.toString();
  }
  //*/ fin de fonctionnes de checkbox list

  async ngOnInit() {
    this.today=new Date();
    //console.log('this.today : '+this.today)
    this.voyage.origin="";
    this.voyage.destination="";
    this.voyage.radiusOrigin=0; // en miles
    this.voyage.radiusDestination=0; // en miles
    //this.latLngOrigin=new google.maps.LatLng(this.lat, this.lng);
    //this.latLngDestination=new google.maps.LatLng(this.lat, this.lng);
    //*
    if(navigator.geolocation){
      await this.geolocation.getCurrentPosition().subscribe(
        (position)=>{
          this.center=new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
          this.latLngOrigin=this.center
          this.latLngDestination=this.center
        }
      )
    }
    
    /*
    await this.geocoding.codeAddress(this.voyage.origin).forEach(
      (results: google.maps.GeocoderResult[]) => {
            if(results[0].geometry.location.lat()>0){
              this.latLngOrigin= new google.maps.LatLng(
                results[0].geometry.location.lat(),
                results[0].geometry.location.lng()                            
              )                            
            }
            else{
              this.latLngOrigin=this.center
            }
            //console.log('this.latLngOrigin.lat() : '+this.latLngOrigin.lat())
            //console.log(this.latLngOrigin.lng())
      });
    await this.geocoding.codeAddress(this.voyage.destination).forEach(
      (results: google.maps.GeocoderResult[]) => {
        if(results[0].geometry.location.lat()>0){
          this.latLngDestination= new google.maps.LatLng(
            results[0].geometry.location.lat(),
            results[0].geometry.location.lng()                            
          )
        }
        else{
          this.latLngDestination=this.center
        }
      });//*/
    await this.showMap();  
    this.voyage.idTransporter = Number(localStorage.getItem("userId"));
    this.voyage.nomTransporter = localStorage.getItem("nom");
    
    this.onChangeCamionTypes(); // pour selectAll ou deselectAll checkbox list
  }
  async bk_ngAfterContentInit(){
    let mapProp = {
      center: new google.maps.LatLng(this.centerCoord.lat, this.centerCoord.lng),
      zoom: 6,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.infoWindow = new google.maps.InfoWindow;
    google.maps.event.addListener(this.map, 'click', (e)=> {
      let resultColor =
          google.maps.geometry.poly.containsLocation(e.latLng, this.polygon) ?
          'blue' :
          'red';

      let resultPath =
          google.maps.geometry.poly.containsLocation(e.latLng, this.polygon) ?
          // A triangle.
          "m 0 -1 l 1 2 -2 0 z" :
          google.maps.SymbolPath.CIRCLE;
      console.log('resultPath  -  resultColor: '+ resultPath +' - '+ resultColor)
      //*
      new google.maps.Marker({
        position: e.latLng,
        map: this.map,
        icon: {
          path: resultPath,
          fillColor: resultColor,
          fillOpacity: .2,
          strokeColor: 'white',
          strokeWeight: .5,
          scale: 10
        }
      });//*/
    });
    await this.showMap();
  }
  drawOrigin(){
    if(this.originCircle){
      this.originCircle.setMap(null)
    }
    this.originCircle = new google.maps.Circle({
      center: new google.maps.LatLng(this.latLngOrigin.lat(), this.latLngOrigin.lng()),
      radius: this.mileEnKm(this.voyage.radiusOrigin)*1000,  // en metre
      fillColor: '#FFFF00',
      editable: false,
      draggable: false,
    });
    this.originCircle.setMap(this.map);
    this.originCircle.addListener('click', (event)=>{
      var contentString:string='Origin : '+ this.voyage.origin + '  -  Rayon : ' + this.voyage.radiusOrigin + ' miles.';
      // Replace the info window's content and position.
      this.infoWindow.setContent(contentString);
      this.infoWindow.setPosition(event.latLng);
      this.infoWindow.open(this.map);
    })
  }
  drawDest(){
    if(this.destCircle1){
      this.destCircle1.setMap(null)
    }
    this.destCircle1 = new google.maps.Circle({
      center: new google.maps.LatLng(this.latLngDestination.lat(), this.latLngDestination.lng()),
      radius: this.mileEnKm(this.voyage.radiusDestination)*1000, // en metre
      fillColor: '#FF00FF',
      editable: false,
      draggable: false,
    })
    this.destCircle1.setMap(this.map);
    this.destCircle1.addListener('click', (event)=>{
      var contentString:string='Destination : '+ this.voyage.destination + '  -  Rayon : ' + this.voyage.radiusDestination + ' miles.';
      // Replace the info window's content and position.
      this.infoWindow.setContent(contentString);
      this.infoWindow.setPosition(event.latLng);
      this.infoWindow.open(this.map);
    })
  }
  /*
  drawCorridor(){
    let polygonOptions = {
      draggable: true,
      editable: true,
      fillColor: '#f00'
    }
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      polygonOptions: polygonOptions,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: google.maps.drawing.OverlayType.POLYGON['POLYGON'],
      }
    });
    this.drawingManager.setMap(this.map);
    google.maps.event.addListener(this.drawingManager, 'polygoncomplete', (polygon)=> {
      this.paths=[];
      if(this.polygon){
        console.log('this.polygon.setMap(null); before')
        this.polygon.setMap(null)
        console.log('this.polygon.setMap(null); after')
      }
      console.log('this.polygon=polygon; before')
      this.polygon=polygon;
      console.log('this.polygon=polygon; after')
      this.addPolygonChangeEvent(this.polygon);
      google.maps.event.addListener(this.polygon, 'coordinates_changed', function (index, obj) {
        // Polygon object: yourPolygon
        console.log('coordinates_changed - c"est nous.');  
        //this.getPaths(); 
        //console.log("After this.getPaths()")
      });
      var path = this.polygon.getPath()
      var coordinates = [];
  
      for (var i = 0 ; i < path.getLength() ; i++) {
        coordinates.push({
          lat: path.getAt(i).lat(),
          lng: path.getAt(i).lng()
        });
      }
      console.log(coordinates);
    });
  }//*/

  showMap() {
    let mapProp = {
      center: new google.maps.LatLng(this.centerCoord.lat, this.centerCoord.lng),
      zoom: 6,
      //mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.infoWindow = new google.maps.InfoWindow;
    /*
    google.maps.event.addListener(this.map, 'click', (e)=> {
      let resultColor =
          google.maps.geometry.poly.containsLocation(e.latLng, this.polygon) ?
          'blue' :
          'red';

      let resultPath =
          google.maps.geometry.poly.containsLocation(e.latLng, this.polygon) ?
          // A triangle.
          "m 0 -1 l 1 2 -2 0 z" :
          google.maps.SymbolPath.CIRCLE;
      console.log('resultPath  -  resultColor: '+ resultPath +' - '+ resultColor)
      //*
      new google.maps.Marker({
        position: e.latLng,
        map: this.map,
        icon: {
          path: resultPath,
          fillColor: resultColor,
          fillOpacity: .2,
          strokeColor: 'white',
          strokeWeight: .5,
          scale: 10
        }
      });///
    });
    //*/
    this.drawOrigin();
    this.drawDest();
    //this.drawCorridor();
    //*/

    //* spherical
    this.spherical = google.maps.geometry.spherical;
    var F: google.maps.LatLng = this.latLngOrigin //new google.maps.LatLng(this.latLngOrigin.lat(), this.latLngOrigin.lng()); 
    //console.log('F: '+F.lat()+' '+F.lng())
    var T: google.maps.LatLng = this.latLngDestination  //new google.maps.LatLng(this.latLngDestination.lat(), this.latLngDestination.lng()); 
    //console.log('T: '+T.lat()+' '+T.lng())
    // Center on the segment
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(F);
    bounds.extend(T);
    this.map.fitBounds(bounds);//*/
    // Begin - If we find with corridor
    if(this.voyage.chercheCorridor==true){
      // Get direction of the segment
      var heading = this.spherical.computeHeading(F, T);
      var center1:google.maps.LatLng = new google.maps.LatLng(F.lat(), F.lng())
      //console.log('center1: '+center1.lat()+' '+center1.lng())
      var center2:google.maps.LatLng = new google.maps.LatLng(T.lat(), T.lng())
      //console.log('center2: '+center1.lat()+' '+center2.lng())
      var vertex1 = this.spherical.computeOffset(center1, this.mileEnKm(this.voyage.radiusOrigin)*1000, heading+90);
      //console.log('vertex1: '+vertex1.lat()+' '+vertex1.lng())
      var vertex2 = this.spherical.computeOffset(center1, this.mileEnKm(this.voyage.radiusOrigin)*1000, heading-90);
      //console.log('vertex2: '+vertex2.lat()+' '+vertex2.lng())
      var vertex3 = this.spherical.computeOffset(center2, this.mileEnKm(this.voyage.radiusDestination)*1000, heading-90);
      //console.log('vertex3: '+vertex3.lat()+' '+vertex3.lng())
      var vertex4 = this.spherical.computeOffset(center2, this.mileEnKm(this.voyage.radiusDestination)*1000, heading+90);
      //console.log('vertex4: '+vertex4.lat()+' '+vertex4.lng())
      this.paths=[];
      if(this.polygon){
        //console.log('this.polygon.setMap(null); before')
        this.polygon.setMap(null)
        //console.log('this.polygon.setMap(null); after')
      }
      this.paths=[
        {lat: vertex1.lat(), lng:vertex1.lng() },
        {lat: vertex2.lat(), lng:vertex2.lng() },
        {lat: vertex3.lat(), lng:vertex3.lng() },
        {lat: vertex4.lat(), lng:vertex4.lng() }
      ]
      this.polygon = new google.maps.Polygon({
        paths: this.paths,
        strokeColor: '#F08080',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#F08080',
        fillOpacity: 0.35,
        editable: true,
        draggable:false,
      });
      this.polygon.setMap(this.map);
      //*
      this.polygon.addListener('click', (event)=>{
        var vertices = this.polygon.getPath();
        var contentString = '<b>Corridor de ce voyage.</b>'; // +
          //'Clicked location: <br>' + event.latLng.lat() + ',' + event.latLng.lng() +
          //'<br>';
        /*/ Iterate over the vertices.
        for (var i =0; i < vertices.getLength(); i++) {
          var xy = vertices.getAt(i);
          contentString += '<br>' + 'Coordinate ' + i + ':<br>' + xy.lat() + ',' +
            xy.lng();
        }//*/
        // Replace the info window's content and position.
        this.infoWindow.setContent(contentString);
        this.infoWindow.setPosition(event.latLng);
        this.infoWindow.open(this.map);
      })
    }// End - If we find with corridor
    //*/
      //* line fron origin to destination
  var flightPlanCoordinates = [
    {lat: this.latLngOrigin.lat(), lng: this.latLngOrigin.lng()},
    {lat: this.latLngDestination.lat(), lng: this.latLngDestination.lng()}
  ];
  var flightPath = new google.maps.Polyline({
    path: flightPlanCoordinates,
    geodesic: true,
    strokeColor: 'Gray',
    strokeOpacity: 0.5,
    strokeWeight: 5,
    icons: [{
      icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW},
      offset: '100%'
    }]
  });
  flightPath.setMap(this.map);
  //*/
  }

  onCheckCorridor(){
    //if(this.voyage.chercheCorridor==true){
      this.showMap();
    //}
  }

addPolygonChangeEvent(polygon) {
  var me = polygon,
    isBeingDragged = false,
    triggerCoordinatesChanged = function () {
      // Broadcast normalized event
      google.maps.event.trigger(me, 'coordinates_changed');
    };
  // If  the overlay is being dragged, set_at gets called repeatedly,
  // so either we can debounce that or igore while dragging,
  // ignoring is more efficient
  google.maps.event.addListener(me, 'dragstart', function () {
    isBeingDragged = true;
  });

  // If the overlay is dragged
  google.maps.event.addListener(me, 'dragend', function () {
    triggerCoordinatesChanged();
    isBeingDragged = false;
  });

  // Or vertices are added to any of the possible paths, or deleted
  var paths = me.getPaths();
  paths.forEach(function (path, i) {      
    google.maps.event.addListener(path, "insert_at", function () {
      triggerCoordinatesChanged();
    });
    google.maps.event.addListener(path, "set_at", function () {
      if (!isBeingDragged) {
        triggerCoordinatesChanged();
      }
    });
    google.maps.event.addListener(path, "remove_at", function () {
      triggerCoordinatesChanged();
    });
  });
  console.log('this.polygon.getPath() : '+this.polygon.getPath().getLength())
  let path=this.polygon.getPath()
  path.forEach((latLng)=>{
    console.log('latLng.lat: ' +latLng.lat())
    console.log('latLng.lng: ' +latLng.lng())
  })
}
getPaths() {
  console.log("get path");
  let pathsToArrayString:Array<string>=[];
  let pathsToString:string="";
  let pathsRebuild:Array<string>=[];
  if (this.polygon) {
    const vertices = this.polygon.getPaths().getArray()[0];
    let paths = [] ;//Array<LatLngLiteral>();
    vertices.getArray().forEach(function (xy, i) {
      console.log("inside vertices : "+ xy.lat()+","+xy.lng()) 
      pathsToArrayString.push(xy.lat().toString())
      pathsToArrayString.push(xy.lng().toString())
      paths.push({lat:xy.lat(), lng:xy.lng()})
    });
    pathsToString=pathsToArrayString.toString()
    this.voyage.paths=pathsToString; // assignment paths to voyage
    console.log('pathsToString : '+pathsToString)
    console.log('pathsToArrayString : '+pathsToArrayString)
    console.log('pathsToArrayString.toString() : '+pathsToArrayString.toString())
    // Rebuild paths
    pathsRebuild = pathsToString.split(",")
    console.log("pathsRebuild : "+pathsRebuild)
    let testPaths:Array<LatLngLiteral>= []; // rebuild from array of string
    for(var i=0; i<=pathsRebuild.length-2; i=i+2){
      testPaths.push({lat:Number(pathsRebuild[i]), lng:Number(pathsRebuild[i+1])})
    }
    console.log("testPaths.toString() : ")
    testPaths.forEach((y:LatLngLiteral)=>{        
      console.log('lat : '+y.lat + ' lng : '+y.lng)
    })
    this.paths=paths;
    console.log("This is paths of polyon after polygon was moved : ") 
    this.paths.forEach((x:LatLngLiteral, i:number)=>{
      console.log('voici : '+ i++)
      console.log('lat : '+x.lat + ' lng : '+x.lng)
    })
    return paths;
  }
  return [];
}
  async originChange(){
    //*
    await this.geocoding.codeAddress(this.voyage.origin).forEach(
      (results: google.maps.GeocoderResult[]) => {
            if(results[0].geometry.location.lat()>0){
              this.latLngOrigin= new google.maps.LatLng(
                this.voyage.originLat = results[0].geometry.location.lat(),
                this.voyage.originLong = results[0].geometry.location.lng()                            
              )
              alert("En deplacant, attendre 2 secondes svp, puis press OK.")
            }
            else
              alert("Ne pas trouver de coordonnees de ce origin")
            //alert("En deplacant, attendre 2 secondes svp, puis press OK.")
            //console.log(this.latLngOrigin.lat())
            //console.log(this.latLngOrigin.lng())
    });//*/
    await this.showMap();
    //console.log('hi from originChange')
  }
  
  async destinationChange(){
    //*
    await this.geocoding.codeAddress(this.voyage.destination).forEach(
      (results: google.maps.GeocoderResult[]) => {
            if(results[0].geometry.location.lat()>0){
              this.latLngDestination= new google.maps.LatLng(
                this.voyage.destLat = results[0].geometry.location.lat(),
                this.voyage.destLong = results[0].geometry.location.lng()                            
              )
              alert("En deplacant, attendre 2 secondes svp, puis press OK.")
            }
            else
              alert("Ne pas trouver de coordonnees de cet destination")
            //alert("En deplacant, attendre 2 secondes svp, puis press OK.")
            //alert("Attendre un peu en deplacant !!")
            //console.log(this.latLngDestination.lat())
            //console.log(this.latLngDestination.lng())
    });//*/
    this.showMap();
    //console.log('hi from destinationChange')
  }

  async getMatchingDemandes(){
    let demandes:Array<Demande>;
    let listIdDemandes:Array<string>=[]
    let vLatLngOrigin= new google.maps.LatLng(
      this.voyage.originLat,
      this.voyage.originLong
    )                            
    let vLatLngDestination= new google.maps.LatLng(
      this.voyage.destLat,
      this.voyage.destLong
    )
    await this.demandesService.getAllDemandes()
    .subscribe(async (data:Array<Demande>)=>{
      let matchDemandes:Array<Demande>=[]
      // we filter demandes here
      await data.forEach(async demande=>{
        console.log(demande.origin)
        console.log(demande.destination)

        let latLngOriginD= new google.maps.LatLng(
          demande.originLat,
          demande.originLong                            
        )

        let latLngDestinationD= new google.maps.LatLng(
          demande.destLat,
          demande.destLong                            
        )

        let angle:number;  // to get angle of voyage and demande 
          this.spherical = google.maps.geometry.spherical;
          let heading:number = this.spherical.computeHeading(vLatLngOrigin, vLatLngDestination);
          let dHeading:number = this.spherical.computeHeading(latLngOriginD, latLngDestinationD);
          angle=Math.abs(dHeading-heading);
          console.log('dHeading - heading = ' + angle)
               
        if(this.originCircle.getBounds().contains(latLngOriginD) && this.destCircle1.getBounds().contains(latLngDestinationD)){
          listIdDemandes.push(demande.id.toString())
          return;
        }
        if(this.originCircle.getBounds().contains(latLngOriginD) && this.originCircle.getBounds().contains(latLngDestinationD)){
          listIdDemandes.push(demande.id.toString())
          return;
        }
        if(this.destCircle1.getBounds().contains(latLngOriginD) && this.destCircle1.getBounds().contains(latLngDestinationD)){
          listIdDemandes.push(demande.id.toString())
          return;
        }
        
        if(this.paths.length>0){
          if(
            !this.originCircle.getBounds().contains(latLngOriginD) // originDemande not in origin
            && !this.destCircle1.getBounds().contains(latLngOriginD) // originDemande not in destination
            && google.maps.geometry.poly.containsLocation(latLngOriginD, this.polygon) // originDemande in corridor
            && this.destCircle1.getBounds().contains(latLngDestinationD)) // destinationDemande in destination
          {
            listIdDemandes.push(demande.id.toString())
            return;
          }
          if(
            !this.destCircle1.getBounds().contains(latLngDestinationD) // destinationDemande not in destination
            && !this.originCircle.getBounds().contains(latLngDestinationD) // destinationDemande not in origin
            && google.maps.geometry.poly.containsLocation(latLngDestinationD, this.polygon) // destinationDemande in corridor
            && this.originCircle.getBounds().contains(latLngOriginD)) // originDemande in origin
          {
            listIdDemandes.push(demande.id.toString())
            return;
          }
          // */
          if(
            !this.originCircle.getBounds().contains(latLngOriginD) // originDemande not in origin
            && !this.destCircle1.getBounds().contains(latLngOriginD) // originDemande not in destination
            && google.maps.geometry.poly.containsLocation(latLngOriginD, this.polygon) // originDemande in corridor
            && !this.destCircle1.getBounds().contains(latLngDestinationD) // destinationDemande not in destination 
            && !this.originCircle.getBounds().contains(latLngDestinationD) // destinationDemande not in origin
            && google.maps.geometry.poly.containsLocation(latLngDestinationD, this.polygon) // destinationDemande in corridor
            && (angle<=90 || angle>=270))
          {
            listIdDemandes.push(demande.id.toString())
            return;
          }
        }
        //if(google.maps.geometry.poly.containsLocation(this.dLatLngOrigin, this.polygon)){}          
      })
      //voyages=matchVoyages
      this.voyage.idsDemandeMatchings=listIdDemandes.toString();
      this.doSaveVoyage();
    }, err=>{
      console.log(err)
    })
    //this.doSaveVoyage()
  }
  
  onSaveVoyage(){
    this.getMatchingDemandes()
  }

  doSaveVoyage(){
    this.getPaths();
    this.voyage.originLat=this.latLngOrigin.lat()
    this.voyage.originLong=this.latLngOrigin.lng()
    this.voyage.destLat=this.latLngDestination.lat()
    this.voyage.destLong=this.latLngDestination.lng()
    this.voyage.dateDepart = new Date(this.voyage.dateDepart)
    console.log('this.voyage.originLat : ' + this.voyage.originLat)
    console.log('this.voyage.originLong : ' + this.voyage.originLong)
    console.log('this.voyage.destLat : ' + this.voyage.destLat)
    console.log('this.voyage.destLong : ' + this.voyage.destLong)
    this.voyagesService.saveVoyages(this.voyage).subscribe((data:Voyage)=>{
      localStorage.setItem('idVoyage', data.id.toString());
      this.router.navigateByUrl("/list-demande");
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
    //console.log(distance+' miles');
  }

    // mile en km
  mileEnKm(distance:number){
    return distance = distance / 0.621371;
      //console.log(distance+' km');
  }

  onRadius1Changed(radius:number){
    //await(()=> {
      //this.voyage.radiusOrigin=this.mileEnKm(radius)/1000;
      //await 
      this.showMap(); // to test
    //})
    console.log('RadiusOrigin was changed.: '+ this.voyage.radiusOrigin)    
  }
  onRadius2Changed(radius:number){
    //await (()=> {
      //this.voyage.radiusDestination=this.mileEnKm(radius)/1000;
      //await 
      this.showMap(); // to test
    //})
    console.log('RadiusDestination was changed.: '+ this.voyage.radiusDestination)
  }
  async onCenter1Changed(center:Center){
      //console.log('center.lat + center.lng : '+center.lat+' '+center.lng)
    this.latLngOrigin = new google.maps.LatLng(center.lat, center.lng);
      //console.log(this.latLngOrigin.lat())
      //console.log(this.latLngOrigin.lng())
      //console.log("Address Origin")
      //await this.latLngToAddress(this.latLngOrigin)
      this.showMap(); // to test
  }
  async onCenter2Changed(center:Center){
      //console.log('center.lat + center.lng : '+center.lat+' '+center.lng)
    this.latLngDestination = new google.maps.LatLng(center.lat, center.lng);
      //console.log(this.latLngDestination.lat())
      //console.log(this.latLngDestination.lng())
      //console.log("Address Destination")
      //await this.latLngToAddress(this.latLngDestination)
      this.showMap(); // to test
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

export interface LatLngLiteral{
  lat:number,
  lng:number
}
