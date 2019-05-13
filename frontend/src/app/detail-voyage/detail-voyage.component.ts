import { Component, OnInit, ViewChild } from '@angular/core';
import { Voyage } from 'src/model/model.voyage';
import { Transporter } from 'src/model/model.transporter';
import { Contact } from 'src/model/model.contact';
import { Adresse } from 'src/model/model.adresse';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsService } from 'src/services/contacts.service';
import { AdressesService } from 'src/services/adresses.service';
import { VoyagesService } from 'src/services/voyages.service';
import { TransportersService } from 'src/services/transporters.service';
import { LatLngLiteral } from '@agm/core';
import { GeocodingService } from 'src/services/geocoding.service';
import { GeolocationService } from 'src/services/geolocation.service';
import { Demande } from 'src/model/model.demande';
import { DemandesService } from 'src/services/demandes.service';
import { Message } from 'src/model/model.message';
import { MessagesService } from 'src/services/messages.service';
import * as myGlobals from 'src/services/globals'; //<==== to use variables from globals.ts
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-detail-voyage',
  templateUrl: './detail-voyage.component.html',
  styleUrls: ['./detail-voyage.component.css']
})
export class DetailVoyageComponent implements OnInit {

  role:string="";
  voyage:Voyage=new Voyage();
  transporter:Transporter=new Transporter();
  id:number; // this is the id of voyage
  mode:number=1;
  contacts:Array<Contact>;
  adresses:Array<Adresse>;

  //*// pour map voyage
  today= new Date(); 
  //voyage:Voyage=new Voyage();
  listRadius : Array<number> = [50, 100, 200, 300, 400, 500];
  
  formGroup: FormGroup;
  camionTypes = myGlobals.camionTypes;
  
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

  originCircle = new google.maps.Circle();
  destCircle1 = new google.maps.Circle(); 
  polygon = new google.maps.Polygon(); 
  //*/ fin map voyage
  
  //message:Message=null;

  constructor(public messagesService : MessagesService,
    public activatedRoute:ActivatedRoute, public contactsService:ContactsService,
    public adressesService:AdressesService, public voyagesService:VoyagesService, 
    public demandesService : DemandesService, 
    public transportersService : TransportersService, public geocoding : GeocodingService, 
    private geolocation : GeolocationService, private formBuilder:FormBuilder, public router:Router)
  {    
    this.id=activatedRoute.snapshot.params['id'];
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
    this.role=localStorage.getItem('role');
    localStorage.setItem('idVoyage', this.id.toString());
    await this.voyagesService.getDetailVoyage(this.id).subscribe(async (data:Voyage)=>{
      //*
      console.log(data.origin)
      console.log(data.destination)
      console.log('data.dateDepart : '+data.dateDepart)
      /*await this.geocoding.codeAddress(data.origin).forEach(
        (results: google.maps.GeocoderResult[]) => {
          if(results[0].geometry.location.lat()>0){
            this.latLngOrigin= new google.maps.LatLng(
              results[0].geometry.location.lat(),
              results[0].geometry.location.lng()                            
            )                            
          }
        });//*/
      this.latLngOrigin= new google.maps.LatLng(
        data.originLat,
        data.originLong                            
      )  
      /*await this.geocoding.codeAddress(data.destination).forEach(
        (results: google.maps.GeocoderResult[]) => {
          if(results[0].geometry.location.lat()>0){
            this.latLngDestination= new google.maps.LatLng(
              results[0].geometry.location.lat(),
              results[0].geometry.location.lng()                            
            )
          }
        });//*/
        this.latLngDestination= new google.maps.LatLng(
          data.destLat,
          data.destLong                            
        )

        alert("Wait for 2 seconds, we load data, please!")        
        /*//
        console.log('this.latLngOrigin.lat() : '+this.latLngOrigin.lat())
        console.log('this.latLngOrigin.lng() : '+this.latLngOrigin.lng())
        console.log('this.latLngDestination.lat() : '+this.latLngDestination.lat())
        console.log('this.latLngDestination.lng() : '+this.latLngDestination.lng())
        //this.showMap();
        //*/
      this.voyage=data;
      this.transportersService.getDetailTransporter(this.voyage.idTransporter).subscribe((data:Transporter)=>{
        this.transporter=data;
      }, err=>{
        console.log(err);
      });
      this.contactsService.contactsDeTransporter(this.voyage.idTransporter).subscribe((data:Array<Contact>)=>{
        this.contacts=data;
      }, err=>{
        console.log(err);
      });
      this.adressesService.adressesDeTransporter(this.voyage.idTransporter).subscribe((data:Array<Adresse>)=>{
        this.adresses=data;
      }, err=>{
        console.log();
      });
      /*this.messagesService.messageVoyageContacted(Number(localStorage.getItem('userId')), this.voyage.id)
      .subscribe((data:Message)=>{
        this.message=data;
        //console.log("this.message.idSender : "+this.message.idSender)
        //console.log("this.message.idVoyage : "+this.message.idVoyage)
      }, err=>{
        console.log()
      })//*/
      await this.showMapInit();  
    }
    //}
    , err=>{
      console.log(err)
    })
    //await this.showMap();  
  }
  /*
  ngAfterContentInit(){
    this.showMap();
  }//*/
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
  
  lineOriginDestination()
  {
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

  async showMap() {
    let mapProp = {
      center: new google.maps.LatLng(this.centerCoord.lat, this.centerCoord.lng),
      zoom: 6,
      //mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.infoWindow = new google.maps.InfoWindow;
    await this.drawOrigin();
    await this.drawDest();
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
      /*/ Rebuild paths
      let pathsRebuild = this.voyage.paths.split(",")
      console.log("pathsRebuild : "+pathsRebuild)
      let testPaths:Array<LatLngLiteral>= []; // rebuild from array of string
      for(var i=0; i<=pathsRebuild.length-2; i=i+2){
        //let j=i+1;
        testPaths.push({lat:Number(pathsRebuild[i]), lng:Number(pathsRebuild[i+1])})
      }
      this.paths=testPaths;
      console.log("testPaths.toString() : ")
      testPaths.forEach((y:LatLngLiteral)=>{        
        console.log('lat : '+y.lat + ' lng : '+y.lng)
      })

      //*/

      this.polygon = new google.maps.Polygon({
        paths: this.paths,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF00EE',
        fillOpacity: 0.35,
        editable: (this.role.includes('TRANSPORTER')),
        draggable:false,
      });
      this.polygon.setMap(this.map);
      //*
      //if(this.role.includes('TRANSPORTER')){
        this.polygon.addListener('click', (event)=>{
          var vertices = this.polygon.getPath();
          var contentString = '<b>Corridor de ce voyage</b><br>'; // +
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
      //}

    }// End - If we find with corridor
    //*/
    this.lineOriginDestination()  // draw a line from origin to dest
  }
  async showMapInit() {
    let mapProp = {
      center: new google.maps.LatLng(this.centerCoord.lat, this.centerCoord.lng),
      zoom: 6,
      //mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.infoWindow = new google.maps.InfoWindow;
    await this.drawOrigin();
    await this.drawDest();
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
      // Rebuild paths
      let pathsRebuild = this.voyage.paths.split(",")
      console.log("pathsRebuild : "+pathsRebuild)
      let testPaths:Array<LatLngLiteral>= []; // rebuild from array of string
      for(var i=0; i<=pathsRebuild.length-2; i=i+2){
        //let j=i+1;
        testPaths.push({lat:Number(pathsRebuild[i]), lng:Number(pathsRebuild[i+1])})
      }
      this.paths=testPaths;
      console.log("testPaths.toString() : ")
      testPaths.forEach((y:LatLngLiteral)=>{        
        console.log('lat : '+y.lat + ' lng : '+y.lng)
      })

      //

      this.polygon = new google.maps.Polygon({
        paths: this.paths,
        strokeColor: '#F08080',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#F08080',
        fillOpacity: 0.35,
        editable: (this.role.includes('TRANSPORTER')),
        draggable:false,
      });
      this.polygon.setMap(this.map);
      //*
      //if(this.role.includes('TRANSPORTER')){
        this.polygon.addListener('click', (event)=>{
          var vertices = this.polygon.getPath();
          var contentString = '<b>Corridor de ce voyage</b>'; // +
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
      //}
    }// End - If we find with corridor
    //*/
    this.lineOriginDestination()  // draw a line from origin to dest
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
  if(this.voyage.originProvince!=null){
    // check the province to limit the cities
    if(this.voyage.originProvince==this.provinceList[0])
      this.villeListO=this.AlbertaVilles;
    if(this.voyage.originProvince==this.provinceList[1])
      this.villeListO=this.BritishColumbiaVilles;        
    if(this.voyage.originProvince==this.provinceList[2])
      this.villeListO=this.ManitobaVilles;
    if(this.voyage.originProvince==this.provinceList[3])
      this.villeListO=this.NewBrunswickVilles;    
    if(this.voyage.originProvince==this.provinceList[4])
      this.villeListO=this.NewfoundlandLabradorVilles;    
    if(this.voyage.originProvince==this.provinceList[5])
      this.villeListO=this.NorthwestTerritoriesVilles;
    if(this.voyage.originProvince==this.provinceList[6])
      this.villeListO=this.NovaScotiaVilles;
    if(this.voyage.originProvince==this.provinceList[7])
      this.villeListO=this.NunavutVilles;
    if(this.voyage.originProvince==this.provinceList[8])
      this.villeListO=this.OntarioVilles;
    if(this.voyage.originProvince==this.provinceList[9])
      this.villeListO=this.PrinceEdwardIslandVilles;
    if(this.voyage.originProvince==this.provinceList[10])
      this.villeListO=this.QuebecVilles;
    if(this.voyage.originProvince==this.provinceList[11])
      this.villeListO=this.SaskatchewanVilles;  
    if(this.voyage.originProvince==this.provinceList[12])
      this.villeListO=this.YukonVilles;
    // end check the provine
    
    this.voyage.origin=this.voyage.originAdresse+', '+this.voyage.originVille+', '+this.voyage.originProvince+', canada'
    await this.geocoding.codeAddress(this.voyage.origin).forEach(
      (results: google.maps.GeocoderResult[]) => {
            if(results[0].geometry.location.lat()>0){
              this.latLngOrigin= new google.maps.LatLng(
                this.voyage.originLat = results[0].geometry.location.lat(),
                this.voyage.originLong = results[0].geometry.location.lng()                            
              )
              //alert("En deplacant, attendre 2 secondes svp, puis press OK.")
            }
            else
              alert("Ne pas trouver de coordonnees de ce origin")
            //alert("En deplacant, attendre 2 secondes svp, puis press OK.")
            //console.log(this.latLngOrigin.lat())
            //console.log(this.latLngOrigin.lng())
    });//*/
    await this.showMap();
  }
  /*else
    alert('Province ne peut etre vide!!')//*/
}

async destinationChange(){
  //*
  if(this.voyage.destProvince!=null){
    // check the province to limit the cities
    if(this.voyage.destProvince==this.provinceList[0])
      this.villeListD=this.AlbertaVilles;
    if(this.voyage.destProvince==this.provinceList[1])
      this.villeListD=this.BritishColumbiaVilles;        
    if(this.voyage.destProvince==this.provinceList[2])
      this.villeListD=this.ManitobaVilles;
    if(this.voyage.destProvince==this.provinceList[3])
      this.villeListD=this.NewBrunswickVilles;    
    if(this.voyage.destProvince==this.provinceList[4])
      this.villeListD=this.NewfoundlandLabradorVilles;    
    if(this.voyage.destProvince==this.provinceList[5])
      this.villeListD=this.NorthwestTerritoriesVilles;
    if(this.voyage.destProvince==this.provinceList[6])
      this.villeListD=this.NovaScotiaVilles;
    if(this.voyage.destProvince==this.provinceList[7])
      this.villeListD=this.NunavutVilles;
    if(this.voyage.destProvince==this.provinceList[8])
      this.villeListD=this.OntarioVilles;
    if(this.voyage.destProvince==this.provinceList[9])
      this.villeListD=this.PrinceEdwardIslandVilles;
    if(this.voyage.destProvince==this.provinceList[10])
      this.villeListD=this.QuebecVilles;
    if(this.voyage.destProvince==this.provinceList[11])
      this.villeListD=this.SaskatchewanVilles;  
    if(this.voyage.destProvince==this.provinceList[12])
      this.villeListD=this.YukonVilles;
    // end check the provine
    this.voyage.destination=this.voyage.destAdresse+', '+this.voyage.destVille+', '+this.voyage.destProvince+', canada'
    await this.geocoding.codeAddress(this.voyage.destination).forEach(
      (results: google.maps.GeocoderResult[]) => {
            if(results[0].geometry.location.lat()>0){
              this.latLngDestination= new google.maps.LatLng(
                this.voyage.destLat = results[0].geometry.location.lat(),
                this.voyage.destLong = results[0].geometry.location.lng()                            
              )
              //alert("En deplacant, attendre 2 secondes svp, puis press OK.")
            }
            else
              alert("Ne pas trouver de coordonnees de cet destination")
            //alert("En deplacant, attendre 2 secondes svp, puis press OK.")
            //alert("Attendre un peu en deplacant !!")
            //console.log(this.latLngDestination.lat())
            //console.log(this.latLngDestination.lng())
    });//*/
    this.showMap();
  }
  /*else
    alert('Province ne peut etre vide!!')//*/
}

  async originChangeBK(){
    //*
    await this.geocoding.codeAddress(this.voyage.origin).forEach(
      (results: google.maps.GeocoderResult[]) => {
            if(results[0].geometry.location.lat()>0){
              this.latLngOrigin= new google.maps.LatLng(
                results[0].geometry.location.lat(),
                results[0].geometry.location.lng()                            
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
  
  async destinationChangeBK(){
    //*
    await this.geocoding.codeAddress(this.voyage.destination).forEach(
      (results: google.maps.GeocoderResult[]) => {
            if(results[0].geometry.location.lat()>0){
              this.latLngDestination= new google.maps.LatLng(
                results[0].geometry.location.lat(),
                results[0].geometry.location.lng()                            
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
    console.log('this.voyage.originLat : ' + this.voyage.originLat)
    console.log('this.voyage.originLong : ' + this.voyage.originLong)
    console.log('this.voyage.destLat : ' + this.voyage.destLat)
    console.log('this.voyage.destLong : ' + this.voyage.destLong)
    this.voyage.dateDepart = new Date(this.voyage.dateDepart)
    this.voyagesService.saveVoyages(this.voyage).subscribe((data:Voyage)=>{
      //localStorage.setItem('idVoyage', data.id.toString());
      this.router.navigateByUrl("/list-demande");
    }
    , err=>{
      console.log(err)
    })
  }
  /*
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

  //*/

  onRetour(){
    this.router.navigateByUrl("/list-voyage")
  }
  disableContactVoyage():boolean{
    let disableContact:boolean=false;  // by default, contact is actif
    if((this.voyage.idsDemandeContactes+',').includes(','+localStorage.getItem("userId")+','))
      disableContact=true;
    return disableContact;
  }
  onContact(){
    console.log("OK, We have had your message!")
    let message= new Message()
    this.voyage.idsDemandeContactes=this.voyage.idsDemandeContactes+","+localStorage.getItem('userId')
    console.log('this.voyage.idsDemandeContactes : before write in database :'+this.voyage.idsDemandeContactes)
    message.idSender=Number(localStorage.getItem('userId'));
    message.roleSender=localStorage.getItem('role');
    message.idReceiver=this.voyage.idTransporter;
    message.roleReceiver="TRANSPORTER";
    //message.idDemande
    message.idVoyage=this.voyage.id
    /*
    message.message=localStorage.getItem('nom') +" - tel:  "+localStorage.getItem('tel')
    +" - email:  " + localStorage.getItem('email')
    +" -  besoins votre Voyage de  "+ this.voyage.origin +"  a  " + this.voyage.destination;
    //*/
    let temp1Tel:string= '<strong><a href="tel:'
    let temp1Mail:string='<strong><a href="mailto:'
    let temp2:string='">'
    let temp3:string='</a></strong>'
    
    message.message=localStorage.getItem('nom') +" - Tel:  "
    + temp1Tel+localStorage.getItem('tel')+temp2+localStorage.getItem('tel')+temp3
    + " - Email:  " 
    + temp1Mail+localStorage.getItem('email')+temp2+localStorage.getItem('email')+temp3
    + " -  besoins votre Voyage de  "+ this.voyage.origin +"  a  " + this.voyage.destination;

    this.messagesService.saveMessages(message).subscribe(data=>{
      this.voyagesService.updateVoyage(this.voyage.id, this.voyage).subscribe(data=>{
        console.log('this.voyage.idsDemandeContactes : after write in database :'+this.voyage.idsDemandeContactes)
      },err=>{console.log(err)})
    }, err=>{
      console.log(err)
    });
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