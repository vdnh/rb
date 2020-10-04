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
import { GeocodingService } from 'src/services/geocoding.service';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements OnInit {
  driverNote="Speed : ";
  driverMoved="Having moved : ";
  instantMoved: number; // in meter, distance moved after each watch navigator

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  
  
  constructor(
    public terminalsService:TerminalsService,
    public transportersService:TransportersService,
    public camionsService:CamionsService,
    public chauffeursService:ChauffeursService,
    public varsGlobal:VarsGlobal,
    private geolocation : GeolocationService,
    private itinerairesService:ItinerairesService, 
    private reperesService:ReperesService,) { }

  truck:Camion;
  truckTemp:Camion;
  terminal : Terminal; // terminal to modify detail 
  terminalTemp : Terminal; // terminal temp to compare gps before update - to save time update null 
  terminals:Terminal[]  // list of terminal
  driver : Chauffeur;
  allDrivers : Chauffeur[];
  transporter : Transporter;
  itiner:Itineraire=new Itineraire();
  itiners:Array<Itineraire>=[];
  itinersFinis:Array<Itineraire>=[];

  subscription : Subscription;
  subscription2 : Subscription
  countTime=0;  // for each time call function saveTerminal
  countTimeNoWrite=0; // for each time no write
  stopped = false; // at beginning the terminal is in working

  ngOnDestroy(): void {
    if(this.subscription!=null) this.subscription.unsubscribe();
    if(this.subscription2!=null) this.subscription2.unsubscribe()
  }

  ngOnInit(){
    this.transportersService.getDetailTransporter(Number(localStorage.getItem('userId'))).subscribe((data:Transporter)=>{
      this.transporter=data; 
      this.terminalsService.terminalsDeTransporter(this.transporter.id).subscribe((data:Array<Terminal>)=>{
        this.terminals=data.filter(x=>(x.status))
        this.terminal=data.find(x=>(x.loginName.localeCompare(localStorage.getItem('usernameLogin'))==0))
        if(this.terminal.idTruck!=null && this.terminal.idTruck>0){
          this.camionsService.getDetailCamion(this.terminal.idTruck).subscribe((data:Camion)=>{
            this.truck=data
          })
        }
        this.showMap();
      }, err=>{
        console.log(err)
      })
      // // get list itineraires and then sort ithem
      // this.itinerairesService.itinerairesDeTransporter(this.transporter.id).subscribe((data:Array<Itineraire>)=>{
      //   if(data!=null) {
      //     this.itiners=data.filter(x=>(x.fini==false&&x.cancelled==false)).sort(
      //       (a,b)=>(a.id-b.id)).sort(
      //         (a,b)=>(new Date(a.datePick).getTime()-new Date(b.datePick).getTime())) // id asc - datePick asc
      //     this.itinersFinis=data.filter(x=>(x.fini==true&&x.archive==false)).sort(
      //       (b,a)=>(a.id-b.id)).sort(
      //         (b,a)=>(new Date(a.dateDrop).getTime()-new Date(b.dateDrop).getTime())) // id desc - dateDrop desc
      //   }
      // },
      // err=>{
      //   console.log(err)
      // })
    },err=>{
      console.log(err)
    }) 

    // function calculateDistance(p1:google.maps.LatLng, p2:google.maps.LatLng ){ //lat1, lng1, lat2, lng2) {
    //   let dLat = toRadians(p2.lat() - p1.lat());
    //   let dLon = toRadians(p2.lng() - p1.lng());
    //   let a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    //           + Math.cos(toRadians(p1.lat()))
    //           * Math.cos(toRadians(p2.lat())) * Math.sin(dLon / 2)
    //           * Math.sin(dLon / 2);
    //   let c = 2 * Math.asin(Math.sqrt(a));
    //   let distanceInMeters = Math.round(6371000 * c);
    //   return distanceInMeters;
    // }
    
    // function toRadians (angle) {
    //   return angle * (Math.PI / 180);
    // }
    
    // function toDegrees (angle) {
    //   return angle * (180 / Math.PI);
    // }

    // //*// watchposition deactivate for temporary
    // let speed=0;
    // let index=0;
    // let note = "Speed : ";
    // let havingMoved = "Having moved : ";
    // let oldPoint : google.maps.LatLng;
    // let watchId;
    // navigator.geolocation.watchPosition(position=>{
    //   if(position.coords.accuracy<=10){ // take the position when accuracy<=10 meter  // && position.coords.altitudeAccuracy<=10
    //     let newPoint= new google.maps.LatLng(this.truck.latitude=position.coords.latitude, this.truck.longtitude=position.coords.longitude)
    //     if(this.marker!=null) this.movingTruck()
    //     // let distanceMetter = this.calculateDistance(oldPoint.lat(), oldPoint.lng(), newPoint.lat(), newPoint.lng()) ;
    //     speed = Math.round(position.coords.speed*3.6) //distanceMetter*4*60/1000; // => kmh (15s*4=1minute, minute*60=hour, m/1000=km)
    //     // let degree = Math.round(position.coords.heading);
    //     //this.bearing(oldPoint.lat(), oldPoint.lng(), newPoint.lat(), newPoint.lng())
    //     if(oldPoint!=null)
    //       this.driverMoved= havingMoved + calculateDistance(oldPoint, newPoint).toString() + " meter.";
    //     else this.driverMoved= havingMoved
    //     oldPoint=newPoint;
    //     index++;
    //     this.driverNote= note + (speed>0? ' '+speed+' km/h' : '');
    //       // (speed>0? ' \r\n Vitesse actuelle : '+speed+' kmh' + ' \r\n accuracy : '+position.coords.accuracy + ' m' : '');
    //   }
    // }, err=>{
    //   console.log(err)
    // },
    // {
    //   timeout: 1000, // 1 second before the request errors out
    //   maximumAge: 5000, // age of the position cached by the browser. Don't accept one older than the set amount
    //   enableHighAccuracy: true  // require a position with highest level of accuracy possible
    // })//*/
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
    this.countTime++; // we count every time save terminal
    // must verify if the data have changed
    if(
        (this.terminalTemp==null ||
        this.terminalTemp.latitude!=this.terminal.latitude || 
        this.terminalTemp.longitude!=this.terminal.longitude)
        &&
        (this.terminal.speed>0 || this.instantMoved>0))
    {
      this.countTimeNoWrite=0;  // reset time no write eache time we can write
      this.stopped = false; // eache time write, we reset stopped to false, teminal in working
      this.terminalsService.saveTerminals(this.terminal).subscribe((data:Terminal)=>{
        this.terminalTemp = data;
        if(this.truck!=null && !this.truck.gps){
          this.truck.latitude=this.terminal.latitude;
          this.truck.longtitude=this.terminal.longitude;
          this.truck.direction=this.terminal.direction
          this.truck.speed=this.terminal.speed

          if(this.countTime%12==0){ // we locate address 1 time per 12 times saveTerminal ()
            let geocodingTemp = new GeocodingService()             
            geocodingTemp.geocode(new google.maps.LatLng(              
              this.truck.latitude,
              this.truck.longtitude
            ))
            .forEach(
              (results: google.maps.GeocoderResult[]) => {
                this.truck.location=results[0].formatted_address;
              }
            ).then(()=>{
              console.log('this.countTime: '+ this.countTime)
              this.camionsService.saveCamions(this.truck).subscribe((data:Camion)=>{}
              ,err=>{console.log(err)})
            })
          }
          else{
            this.camionsService.saveCamions(this.truck).subscribe((data:Camion)=>{}
            ,err=>{console.log(err)})
          }
        }
        if (this.countTime>8640) this.countTime=0;  // if countTime last more than 1 day reset countTime
        this.movingTerminal();
      },err=>{})
    }
    else { 
      // if data no change : do nothing
      this.countTimeNoWrite++
      if(!this.stopped && this.countTimeNoWrite%12==0){ // if there are no data for 2 minutes, it means the terminal is stopped
        this.stopped=true; // set teminal stop
        this.terminal.speed=0; // set speed to 0
        this.terminalsService.saveTerminals(this.terminal).subscribe((data:Terminal)=>{
          this.terminalTemp = data;
          if(this.truck!=null && !this.truck.gps){
            this.truck.speed=0
            let geocodingTemp = new GeocodingService()             
            geocodingTemp.geocode(new google.maps.LatLng( // locate the address of the last location        
              this.truck.latitude=this.terminal.latitude,
              this.truck.longtitude=this.terminal.longitude
            ))
            .forEach(
              (results: google.maps.GeocoderResult[]) => {
                this.truck.location=results[0].formatted_address;
              }
            ).then(()=>{
              this.camionsService.saveCamions(this.truck).subscribe((data:Camion)=>{}
              ,err=>{console.log(err)})
            })
          }
        }, err=>{console.log(err)})
      }
    }
  }

  marker : google.maps.Marker
  showMap() {
    if(this.subscription!=null) this.subscription.unsubscribe();
    if(this.marker!=null) this.marker.setMap(null)
    let mapProp = {
      center: new google.maps.LatLng(this.terminal.latitude, this.terminal.longitude),
      zoom: 15,
      //mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    // let marker = new google.maps.Marker({
    //   position: new google.maps.LatLng(this.truck.latitude, this.truck.longtitude),
    //   map: this.map,
    //   icon: {
    //     path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    //     scale:7,
    //     // rotation:this.truck.direction,
    //     // fillOpacity: 1,
    //     // fillColor: "#7FFF00", //"#FFFFFF"
    //     strokeWeight: 3,
    //     strokeColor: "#008088", //"#FFFFFF",//"red",
    //   },
    //   title: ((this.truck.foreignName!=null && this.truck.foreignName.length>0) ? this.truck.foreignName : ("#"+this.truck.unite+" "+this.truck.marque+" "+this.truck.modele)),
    //   label: {text:((this.truck.foreignName!=null && this.truck.foreignName.length>0) ? this.truck.foreignName : ("#"+this.truck.unite+" "+this.truck.marque+" "+this.truck.modele)), color:"orange"},
    // });
    
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
    const intervalCSM = interval(10000); //intervel 10 seconds for update data terminal on the map
    // if this truck no-gps, get the GPS of terminal
    this.subscription=intervalCSM.subscribe(val=>{
      this.onSaveTerminal();
    })

    // encode address every 2 minutes
    // const intervalAddress = interval(120000)
    
    // if(this.truck!=null){
    //   this.subscription2=intervalAddress.subscribe(val=>{
    //     if(this.truckTemp==null || 
    //       this.truckTemp.latitude!=this.truck.latitude ||
    //       this.truckTemp.longtitude!=this.truck.longtitude)
    //     {
    //       let geocodingTemp = new GeocodingService()             
    //       geocodingTemp.geocode(new google.maps.LatLng(              
    //         this.truck.latitude,
    //         this.truck.longtitude
    //       ))
    //       .forEach(
    //         (results: google.maps.GeocoderResult[]) => {
    //           this.truck.location=results[0].formatted_address;
    //         }
    //       ).then(()=>{
    //         this.truckTemp=this.truck
    //       })
    //     }
        
    //   })  
    // }

    function calculateDistance(p1:google.maps.LatLng, p2:google.maps.LatLng ){ //lat1, lng1, lat2, lng2) {
      let dLat = toRadians(p2.lat() - p1.lat());
      let dLon = toRadians(p2.lng() - p1.lng());
      let a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
              + Math.cos(toRadians(p1.lat()))
              * Math.cos(toRadians(p2.lat())) * Math.sin(dLon / 2)
              * Math.sin(dLon / 2);
      let c = 2 * Math.asin(Math.sqrt(a));
      let distanceInMeters = Math.round(6371000 * c);
      return distanceInMeters;
    }
    
    function toRadians (angle) {
      return angle * (Math.PI / 180);
    }
    
    function toDegrees (angle) {
      return angle * (180 / Math.PI);
    }

    //*// watchposition deactivate for temporary
    // let speed=0;
    let index=0;
    let note = "Speed : ";
    let havingMoved = "Having moved : ";
    let oldPoint : google.maps.LatLng;
    let watchId;
    navigator.geolocation.watchPosition(position=>{
      if(position.coords.accuracy<=10){ // take the position when accuracy<=10 meter  // && position.coords.altitudeAccuracy<=10
        let newPoint= new google.maps.LatLng(this.terminal.latitude=position.coords.latitude, this.terminal.longitude=position.coords.longitude)
        // if(this.marker!=null) this.movingTruck()
        // let distanceMetter = this.calculateDistance(oldPoint.lat(), oldPoint.lng(), newPoint.lat(), newPoint.lng()) ;
        this.terminal.speed = Math.round(position.coords.speed*3.6) //distanceMetter*4*60/1000; // => kmh (15s*4=1minute, minute*60=hour, m/1000=km)
        this.terminal.direction = position.coords.heading
        this.instantMoved = calculateDistance(oldPoint, newPoint)
        // let degree = Math.round(position.coords.heading);
        //this.bearing(oldPoint.lat(), oldPoint.lng(), newPoint.lat(), newPoint.lng())
        if(oldPoint!=null)
          this.driverMoved= havingMoved + this.instantMoved + " meter.";
        else this.driverMoved= havingMoved
        oldPoint=newPoint;
        index++;
        this.driverNote= note + (this.terminal.speed>0? ' '+this.terminal.speed+' km/h' : '0 km/h');
          // (speed>0? ' \r\n Vitesse actuelle : '+speed+' kmh' + ' \r\n accuracy : '+position.coords.accuracy + ' m' : '');
      }
    }, err=>{
      console.log(err)
    },
    {
      timeout: 1000, // 1 second before the request errors out
      maximumAge: 5000, // age of the position cached by the browser. Don't accept one older than the set amount
      enableHighAccuracy: true  // require a position with highest level of accuracy possible
    })//*/
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
