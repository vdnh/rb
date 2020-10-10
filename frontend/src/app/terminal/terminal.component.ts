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
import { DatePipe } from '@angular/common';

declare var Fingerprint2: any;

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements OnInit {
  driverNote="Speed : ";
  // driverMoved="Having moved : ";
  instantMoved: number; // in meter, distance moved after each watch navigator

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  hash: any;
  
  
  constructor(
    public terminalsService:TerminalsService,
    public transportersService:TransportersService,
    public camionsService:CamionsService,
    public chauffeursService:ChauffeursService,
    public varsGlobal:VarsGlobal,
    private geolocation : GeolocationService,
    private itinerairesService:ItinerairesService, 
    private reperesService:ReperesService,) {
      new Fingerprint2().get((result, components) => {
        this.hash = result;
        // console.log(result); //a hash, representing your device fingerprint
        //console.log(components); // an array of FP components
      });
     }

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

  codeValided=false;
  codeValidation:number;
  timeTried=0;
  onCodeValidation(){
    // console.log("this.codeValidaton entered: "+this.codeValidation)
    // console.log("this.codeValidaton must be: "+(this.terminal.id + (this.terminal.idTruck>0 ? this.terminal.idTruck : 0)))
    if(this.terminal.accepts.includes(this.hash)){

    }
    if(this.codeValidation==(this.terminal.id + (this.terminal.idTruck>0 ? this.terminal.idTruck : 0)))
    {
      this.codeValided=true;
      localStorage.setItem('terus',this.terminal.loginName)
      localStorage.setItem('terpw',this.terminal.password)
      localStorage.setItem('terky',this.codeValidation.toString())
    }
    else
    {
      this.codeValided=false;
      this.timeTried++
      alert("Code validation error!!!")
      if(this.timeTried==4){
        localStorage.clear();
        location.reload();
      }
      
    }
  }

  wait10seconds(){
    interval(10000).subscribe(val => {
      localStorage.clear();
      location.reload();
    });
  }
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
        // terminal active
        if(this.terminal.status){
          if(localStorage.getItem('terus')!=null && localStorage.getItem('terpw')!=null &&
           Number(localStorage.getItem('terky'))==(this.terminal.id + (this.terminal.idTruck>0 ? this.terminal.idTruck : 0))) this.codeValided=true
          // if(this.terminal.idTruck!=null && this.terminal.idTruck>0){
          //   this.camionsService.getDetailCamion(this.terminal.idTruck).subscribe((data:Camion)=>{
          //     this.truck=data
              
          //   })
          // }
          // at beginning, we write the position actual and set data for terminalTemp
          navigator.geolocation.getCurrentPosition(
            (position: Position) => {
                // observer.next(position);
                // observer.complete();
                this.terminal.latitude=position.coords.latitude 
                this.terminal.longitude=position.coords.longitude
                this.terminalsService.saveTerminals(this.terminal).subscribe((data:Terminal)=>{
                  this.terminalTemp = data;
                  console.log("Set terminalTemp to the actual position")
                  // and then find the truck and update his location then showMap()
                  if(this.terminal.idTruck!=null && this.terminal.idTruck>0){
                    this.camionsService.getDetailCamion(this.terminal.idTruck).subscribe((data:Camion)=>{
                      this.truck=data  
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
                        this.camionsService.saveCamions(this.truck).subscribe((data:Camion)=>{
                          this.truck=data
                          console.log("Updated trucks' location and find list itiners and then showMap()")
                          this.itinerairesService.itinerairesDeCamion(this.truck.id).
                          subscribe((data:Array<Itineraire>)=>{
                            this.itiners=this.sortItiners(data.filter(x=>(!x.fini && !x.cancelled)))
                            this.itinersFinis=data.filter(x=>(x.fini))
                            this.showMap()  
                          }, err=>{console.log(err)})                                            
                        }
                        ,err=>{console.log(err)})
                      })
                    })
                  }
                  // Just showMap(), if there are no truck
                  else this.showMap();
                }, err=>{console.log(err)})
            },
            (error: PositionError) => {
                console.log('Geolocation service: ' + error.message);
                // observer.error(error);
            },{
              timeout: 2000, // 2 second before the request errors out
              maximumAge: 3000,  //10000, //5000, // age of the position cached by the browser. Don't accept one older than the set amount
              enableHighAccuracy: true  // require a position with highest level of accuracy possible
            }
          );
          // if(this.terminalTemp==null){ // at beginning, we write the position actual and set data for terminalTemp
          //   this.terminalsService.saveTerminals(this.terminal).subscribe((data:Terminal)=>{
          //     this.terminalTemp = data;
          //   }, err=>{console.log(err)})
          // }
          // this.showMap();
        }
        // terminal inactive
        else{
          alert('This terminal inactivated.')
          localStorage.clear();
          localStorage.setItem('language', this.varsGlobal.language)  // keep the last language
          location.reload();
        }
        
      }, err=>{
        console.log(err)
      })
     
    },err=>{
      console.log(err)
    }) 

  }

  sortItiners(itiners){
    // let cIsL= this.cIsLList.find(res=>res.camionId==idCamion)
    // if(cIsL!=null)
    // {
      itiners.sort((a,b)=>{
        // (a.id-b.id)

        // If a and b are lonely
        if(a.idRouteFatherF1==null && b.idRouteFatherF1==null){
          return (a.id-b.id);
        }
        // If a has father and b is lonely
        if(a.idRouteFatherF1!=null && b.idRouteFatherF1==null){
          // if b is not father F1 of a
          if(a.idRouteFatherF1!=b.id) return (a.idRouteFatherF1-b.id);
          // if b is father F1 of a
          else  return (a.id-b.id);
        }
        // If a has father and b has father
        if(a.idRouteFatherF1!=null && b.idRouteFatherF1!=null){
          // if they have same father F1
          if(a.idRouteFatherF1==b.idRouteFatherF1) return (a.idRouteFather-b.idRouteFather);
          else  return (a.idRouteFatherF1-b.idRouteFatherF1);
        }
        // If a is lonely and b has father
        if(a.idRouteFatherF1==null && b.idRouteFatherF1!=null){
          // if a is father F1 of b
          if(a.id==b.idRouteFatherF1) return (a.id-b.id);
          // if a is not father of b
          else  return (a.id-b.idRouteFatherF1);
        }
        return 0;
      }) 
      return itiners
    // }
    // else return null
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
    // if(this.terminalTemp==null){ // at beginning, we write the position actual and set data for terminalTemp
    //   this.terminalsService.saveTerminals(this.terminal).subscribe((data:Terminal)=>{
    //     this.terminalTemp = data;
    //   }, err=>{console.log(err)})
    // }
    // else 
    if( // since now, we know terminalTemp is not equal null
      //this.terminalTemp==null ||
        (
        this.terminalTemp.latitude!=this.terminal.latitude || 
        this.terminalTemp.longitude!=this.terminal.longitude)
        &&
        (this.terminal.speed>0 || this.instantMoved>0))
    {
      this.terminal.timeStop=null; // in moving the timeStop is null
      this.countTimeNoWrite=0;  // reset time no write eache time we can write
      this.stopped = false; // eache time write, we reset stopped to false, teminal in working
      this.terminalsService.saveTerminals(this.terminal).subscribe((data:Terminal)=>{
        this.terminalTemp = data;
        if(this.truck!=null && !this.truck.gps){
          this.truck.timeStop=null; // in moving the timeStop is null
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
        if(this.terminal.timeStop!=null){
          // this terminal is stopping
          // do nothing
          // console.log('Do nothing')
          let duration = new Date().getTime() - this.terminal.timeStop
          console.log('This terminal is stopping: ' + Math.round(duration/1000/60) + " minutes")
        }
        else{
          // this terminal just stop
          this.terminal.timeStop = new Date().getTime() - 120000; // -120000 - means 2 minutes we wait to determine stop or non
          console.log('this.terminal.timeStop: '+ this.terminal.timeStop)
          let dt= new Date(this.terminal.timeStop)
          console.log(dt.getHours() +" - " + dt.getDate() +" - " + (dt.getMonth()+1) +" - " + dt.getFullYear())
          // console.log(dt.getUTCHours() +" - " + dt.getUTCDate() +" - " + (dt.getUTCMonth()+1) +" - " + dt.getUTCFullYear())
        }
        this.stopped=true; // set teminal stop
        this.terminal.speed=0; // set speed to 0
        this.terminalsService.saveTerminals(this.terminal).subscribe((data:Terminal)=>{
          this.terminalTemp = data;
          if(this.truck!=null && !this.truck.gps){
            this.truck.speed=0
            this.truck.timeStop=this.terminal.timeStop
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
      else if(this.stopped && this.countTimeNoWrite%12==0){
        let duration = new Date().getTime() - this.terminal.timeStop
        console.log('This terminal is stopping: ' + Math.round(duration/1000/60) + " minutes")
      }
    }
  }

  marker : google.maps.Marker
  showMap() {
    if(this.subscription!=null) this.subscription.unsubscribe();
    if(this.subscription2!=null) this.subscription2.unsubscribe();
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
      title: this.terminal.name + this.calculateStopTime(this.terminal.timeStop)
    });
    // centrer la carte
    this.map.setCenter(new google.maps.LatLng(this.terminal.latitude, this.terminal.longitude));
    const intervalCSM = interval(10000); //intervel 10 seconds for update data terminal on the map
    // if this truck no-gps, get the GPS of terminal
    this.subscription=intervalCSM.subscribe(val=>{
      this.onSaveTerminal();
    })
    const intervalItiners = interval(20000); //intervel 20 seconds for update itineraires/routes
    this.subscription2=intervalItiners.subscribe(val=>{
      if(this.truck!=null && this.truck.id!=null){ // always check truck do nothing if it is null
        this.itiners=null // set the itiners to null
        this.itinersFinis=null // set the itinersFinis to null
        this.itinerairesService.itinerairesDeCamion(this.truck.id).
        subscribe((data:Array<Itineraire>)=>{
          this.itiners=this.sortItiners(data.filter(x=>(!x.fini && !x.cancelled)))
          this.itinersFinis=data.filter(x=>(x.fini))
        }, err=>{console.log(err)})                                            
      }
    })
    

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
    // let index=0;
    // let note = "Speed : ";
    // let havingMoved = "Having moved : ";
    let oldPoint : google.maps.LatLng;
    // let watchId;
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
        // if(oldPoint!=null)
        //   this.driverMoved= havingMoved + this.instantMoved + " meter.";
        // else this.driverMoved= havingMoved
        oldPoint=newPoint;
        // index++;
        // this.driverNote= note + (this.terminal.speed>0? ' '+this.terminal.speed+' km/h' : '0 km/h');
          // (speed>0? ' \r\n Vitesse actuelle : '+speed+' kmh' + ' \r\n accuracy : '+position.coords.accuracy + ' m' : '');
      }
    }, err=>{
      console.log(err)
    },
    {
      timeout: 2000, // 2 second before the request errors out
      maximumAge: 3000,  //10000, //5000, // age of the position cached by the browser. Don't accept one older than the set amount
      enableHighAccuracy: true  // require a position with highest level of accuracy possible
    })//*/
  }

  calculateStopTime(timeStop:number){
    if(timeStop!=null){
      let duration = new Date().getTime() - timeStop
      //console.log('This terminal is stopping: ' + Math.round(duration/1000/60) + " minutes")
      // return ' stopped: ' + Math.round(duration/1000/60) + " minutes"
      return ' stopped: ' + this.showStopDuration(Math.round(duration/1000/60))
    }
    else 
      return ''
  }
  // to show the stop duration in day-hours-minute
  showStopDuration(stopDuration:number){  // this stopDuration is in minute
    let duration='';
    let days =  Number.parseInt((stopDuration/1440).toString()) +' day(s) '
    let hours = Number.parseInt(((stopDuration%1440)/60).toString()) +' hour(s) '
    let minutes = ((stopDuration%1440)%60).toString() +' minute(s) '
    
    if((stopDuration/1440)>=1)
      duration = duration+days;
    if(((stopDuration%1440)/24)>=1)
      duration=duration+hours
    duration=duration+minutes
    
    //duration = days+' jour(s) '+hours+' heure(s) '+minutes+' minute(s) '

    return duration;
  }

  movingTerminal() {
    if(this.marker!=null) this.marker.setMap(null) 
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
      title: this.terminal.name + this.calculateStopTime(this.terminal.timeStop)
    });
    this.map.setCenter(new google.maps.LatLng(this.terminal.latitude, this.terminal.longitude));
  }

}

export class CamionItinersList{
  camionId:number
  itiners:Array<Itineraire>
}