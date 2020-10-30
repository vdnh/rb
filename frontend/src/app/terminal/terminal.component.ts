import { HostListener, ViewChild } from '@angular/core';
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
import { Clipboard} from '@angular/cdk/clipboard';
import { ViewportScroller } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import FingerprintJS  from '@fingerprintjs/fingerprintjs';
// declare var Fingerprint2: any;

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
    private reperesService:ReperesService,
    private clipboard : Clipboard,
    private viewportScroller: ViewportScroller,
    private sanitizer: DomSanitizer) 
    {
      // new Fingerprint2().get((result, components)   // this is deprecated
      // Fingerprint2().get((result, components) => {
      //   this.hash = result;
      //   // document.execCommand('copy', false, this.hash)
      //   this.clipboard.copy(this.hash)
      //   // console.log(result); //a hash, representing your device fingerprint
      //   //console.log(components); // an array of FP components
      // });
      // var options = {}
      // Fingerprint2.get(options, function (components) {
      //   var values = components.map(function (component) { return component.value })
      //   //var murmur
      //   this.hash = Fingerprint2.x64hash128(values.join(''), 31)
      //  this.clipboard.copy(this.hash)
      // })
      // Fingerprint2.get(async () => {
      //   const components = await Fingerprint2.getPromise();
      //   const values = components.map(component => component.value);
      //   const murmur = Fingerprint2.x64hash128(values.join(""), 31);
      //   console.log('fingerprint:', murmur);
      //   this.hash=murmur;
      //   this.clipboard.copy(this.hash)
      // })
      FingerprintJS.load().then(fp=>{
        fp.get().then(result=>{
          this.hash=result.visitorId
        })
      })
     }
  camionForRoute= new CamionForRoute ();
  truck:Camion;
  truckTemp:Camion;
  terminal : Terminal = null; // terminal to modify detail 
  terminalTemp : Terminal = new Terminal(); // terminal temp to compare gps before update - to save time update null 
  terminals:Terminal[]  // list of terminal
  driver : Chauffeur;
  allDrivers : Chauffeur[];
  transporter : Transporter;
  itiner:Itineraire=new Itineraire();
  itiners:Array<Itineraire>=[];
  itinersFinis:Array<Itineraire>=[];

  subscription : Subscription;
  subscription2 : Subscription
  subscription3 : Subscription
  subscription4 : Subscription
  countTime=0;  // for each time call function saveTerminal
  countTimeNoWrite=0; // for each time no write
  stopped = false; // at beginning the terminal is in working

  codeValided=true; //false;
  codeValidation:number;
  timeTried=0;

  transferDaoToDtoTruck(){
    this.camionForRoute.id= this.truck.id;
    this.camionForRoute.odometre= this.truck.odometre;     
    this.camionForRoute.longtitude= this.truck.longtitude;
    this.camionForRoute.latitude=this.truck.latitude;
    this.camionForRoute.direction=this.truck.direction;  
    this.camionForRoute.speed=this.truck.speed;
    this.camionForRoute.timeStop=this.truck.timeStop;
    this.camionForRoute.location=this.truck.location;
  }
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
      localStorage.setItem('unit',this.truck.unite)
    }
    else
    {
      this.codeValided=false;
      this.timeTried++
      alert("Code validation error!!!")
      if(this.timeTried==4){
        localStorage.clear();
        localStorage.setItem('language', this.varsGlobal.language)  // keep the last language
        location.reload();
      }
      
    }
  }

  // use to copy to clipboard this hash id
  copyHash(){ 
    this.clipboard.copy(this.hash)
  }

  wait10seconds(){
    this.subscription3 = interval(20000).subscribe(val => {
      // alert("You haven't Autorisation !!! Contact Admin, please!")
      localStorage.clear();
      localStorage.setItem('language', this.varsGlobal.language)  // keep the last language
      location.reload();
    });
  }
  
  @HostListener('window:beforeunload')
  // async ngOnDestroy() {
  ngOnDestroy(): void {
    if(this.subscription!=null) this.subscription.unsubscribe();
    if(this.subscription2!=null) this.subscription2.unsubscribe();
    if(this.subscription3!=null) this.subscription3.unsubscribe();
    if(this.subscription4!=null) this.subscription4.unsubscribe();
  }

  ngOnInit(){
    this.transportersService.getDetailTransporter(Number(localStorage.getItem('userId'))).subscribe((data:Transporter)=>{
      this.transporter=data; 
      this.terminalsService.terminalsDeTransporter(this.transporter.id).subscribe((data:Array<Terminal>)=>{
        this.terminals=data.filter(x=>(x.status))
        this.terminal=data.find(x=>(x.loginName.localeCompare(localStorage.getItem('usernameLogin'))==0))
        // if(this.hash!=null && (this.terminal.accepts==null || !this.terminal.accepts.includes(this.hash)))
        // {
        //   this.wait10seconds()
        // }
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
                this.terminalTemp.latitude=position.coords.latitude 
                this.terminalTemp.longitude=position.coords.longitude
                // set the field accepts of terminal to 'savingfromterminal', Server will recognize and save infos just been changed
                this.terminal.tempora= "savingfromterminal";
                this.terminalsService.saveTerminals(this.terminal).subscribe((data:Terminal)=>{
                  this.terminal= data; 
                  // this.terminalTemp = data;
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
                        this.transferDaoToDtoTruck()
                        this.camionsService.updateCamionFromterminal(this.camionForRoute).subscribe((data:CamionForRoute)=>{
                        // this.camionsService.saveCamions(this.truck).subscribe((data:Camion)=>{
                        //   this.truck=data
                          console.log("Updated trucks' location and find list itiners and then showMap()")
                          // this.itinerairesService.itinerairesDeCamion(this.truck.id).
                          this.itinerairesService.itinerairesLegerDeCamion(this.truck.id).
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
          // if b is father F1 of a => b (father) is always before a
          else  return 1 //(a.id-b.id);
        }
        // If a has father and b has father
        if(a.idRouteFatherF1!=null && b.idRouteFatherF1!=null){
          // if they have same father F1
          if(a.idRouteFatherF1==b.idRouteFatherF1) return (a.idRouteFather-b.idRouteFather);
          else  return (a.idRouteFatherF1-b.idRouteFatherF1);
        }
        // If a is lonely and b has father
        if(a.idRouteFatherF1==null && b.idRouteFatherF1!=null){
          // if a is father F1 of b then a (father) is always front of b
          if(a.id==b.idRouteFatherF1) return -1; //(a.id-b.id);
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
        (this.terminalTemp.latitude!=this.terminal.latitude || 
        this.terminalTemp.longitude!=this.terminal.longitude)
        &&
        (this.terminal.speed>0 ) //  || this.instantMoved>0
        )
    {
      this.movingTerminal(); // move marker if data gps change
      this.terminal.timeStop=null; // in moving the timeStop is null
      this.countTimeNoWrite=0;  // reset time no write eache time we can write
      this.stopped = false; // eache time write, we reset stopped to false, teminal in working
      // set the field accepts of terminal to 'savingfromterminal', Server will recognize and save infos just been changed
      this.terminal.tempora= "savingfromterminal";
      this.terminalsService.saveTerminals(this.terminal).subscribe((data:Terminal)=>{
        // if no truck hooked with this terminal, set this.truck to null
        if(this.truck!=null && (data.idTruck==null || data.idTruck==0)){
          // let langTemp = localStorage.getItem('language');
          // localStorage.clear();
          // localStorage.setItem('language', langTemp);
          location.reload();

        }
        if(this.truck==null && (data.idTruck!=null && data.idTruck>0)){
          // let langTemp = localStorage.getItem('language');
          // localStorage.clear();
          // localStorage.setItem('language', langTemp);
          location.reload();
        }
        // else{
        //   if(this.truck==null){
        //     this.camionsService.getDetailCamion(this.terminal.idTruck).subscribe((data:Camion)=>{
        //       this.truck=data
        //       this.itinerairesService.itinerairesLegerDeCamion(this.truck.id).
        //       subscribe((data:Array<Itineraire>)=>{
        //         this.itiners=this.sortItiners(data.filter(x=>(!x.fini && !x.cancelled)))
        //         this.itinersFinis=data.filter(x=>(x.fini))
        //         this.showMap()  
        //       }, err=>{console.log(err)})
        //     }, err=>{console.log(err)})
        //   }
        // }
        console.log("Save Terminal when terminalTemp != terminal : ")
        // alert("Save Terminal when terminalTemp != terminal : ")
        console.log("this.hash: " + this.hash)
        console.log("data.status: " + data.status)
        console.log("data.accepts: " + data.accepts)
        if(data.status&&data.accepts!=null&&data.accepts.includes(this.hash))
        {
          // it is good,
          this.terminal= data; 
          // this.terminalTemp = data;
          this.terminalTemp.latitude=data.latitude 
          this.terminalTemp.longitude=data.longitude
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
                this.transferDaoToDtoTruck()
                this.camionsService.updateCamionFromterminal(this.camionForRoute).subscribe((data:CamionForRoute)=>{
                // this.camionsService.saveCamions(this.truck).subscribe((data:Camion)=>{
                //   this.truck=data
                },err=>{console.log(err)})
              })
            }
            else{
              this.transferDaoToDtoTruck()
              this.camionsService.updateCamionFromterminal(this.camionForRoute).subscribe((data:CamionForRoute)=>{
              // this.camionsService.saveCamions(this.truck).subscribe((data:Camion)=>{
              //   this.truck=data
              },err=>{console.log(err)})
            }
          }
          if (this.countTime>8640) this.countTime=0;  // if countTime last more than 1 day reset countTime
          // this.movingTerminal();
        }
        else{ //  if no more autorisation, clear memo and reload
          // alert("Reload at terminaltemp != terminal, because of no more autorisation")
          localStorage.clear()
          localStorage.setItem('language', this.varsGlobal.language)  // keep the last language
          location.reload();
        }

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
        // set the field accepts of terminal to 'savingfromterminal', Server will recognize and save infos just been changed
        this.terminal.tempora= "savingfromterminal";
        this.terminalsService.saveTerminals(this.terminal).subscribe((data:Terminal)=>{
          // if no truck hooked with this terminal, set this.truck to null
          // if(data.idTruck==null || data.idTruck==0){
          //   // let langTemp = localStorage.getItem('language');
          //   // localStorage.clear();
          //   // localStorage.setItem('language', langTemp);
          //   // // location.href=location.href.split("logout")[0]
          //   // location.reload();
          //   this.truck==null;
          //   this.itiners=null;
          //   this.itinersFinis=null;
          //   this.itiner=null
          //   this.terminal=data;
          // }
          // else{
          //   if(this.truck==null){
          //     this.camionsService.getDetailCamion(this.terminal.idTruck).subscribe((data:Camion)=>{
          //       this.truck=data
          //       this.itinerairesService.itinerairesLegerDeCamion(this.truck.id).
          //       subscribe((data:Array<Itineraire>)=>{
          //         this.itiners=this.sortItiners(data.filter(x=>(!x.fini && !x.cancelled)))
          //         this.itinersFinis=data.filter(x=>(x.fini))
          //         this.showMap()  
          //       }, err=>{console.log(err)})
          //     }, err=>{console.log(err)})
          //   }
          // }
          console.log("Save Terminal when terminalTemp == terminal or Gps no change : ")
          // alert("Save Terminal when terminalTemp == terminal or Gps no change : ")
          console.log("this.hash: " + this.hash)
          console.log("data.status: " + data.status)
          console.log("data.accepts: " + data.accepts)
          if(data.status&&data.accepts!=null&&data.accepts.includes(this.hash))
          {
            // it is good,
            this.terminal= data; 
            // this.terminalTemp = data;
            this.terminalTemp.latitude=data.latitude 
            this.terminalTemp.longitude=data.longitude
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
                this.transferDaoToDtoTruck()
                this.camionsService.updateCamionFromterminal(this.camionForRoute).subscribe((data:CamionForRoute)=>{
                // this.camionsService.saveCamions(this.truck).subscribe((data:Camion)=>{
                //   this.truck=data
                },err=>{console.log(err)})
              })
            }
          }
          else{ //  if no more autorisation, clear memo and reload
            // alert("Reload at terminaltemp == terminal or Gps data no change, because of no more autorisation")
            localStorage.clear()
            localStorage.setItem('language', this.varsGlobal.language)  // keep the last language
            location.reload();
          }
          
        }, err=>{console.log(err)})
      }
      else if(this.stopped && this.countTimeNoWrite%12==0){ 
        // each 2 minutes check if there is truck hooked with this terminal, set this.truck==null
        let duration = new Date().getTime() - this.terminal.timeStop
        console.log('This terminal is stopping: ' + Math.round(duration/1000/60) + " minutes")
        // this.terminalsService.getDetailTerminal(this.terminal.id).subscribe((data:Terminal)=>{
        //   this.terminal=data
        //   if(data.idTruck==null || data.idTruck==0){
        //     // let langTemp = localStorage.getItem('language');
        //     // localStorage.clear();
        //     // localStorage.setItem('language', langTemp);
        //     // // location.href=location.href.split("logout")[0]
        //     // location.reload();
        //     this.truck==null;
        //     this.itiners=null;
        //     this.itinersFinis=null;
        //     this.itiner=null
        //   }
        //   else{
        //     if(this.truck==null){
        //       this.camionsService.getDetailCamion(this.terminal.idTruck).subscribe((data:Camion)=>{
        //         this.truck=data
        //         this.itinerairesService.itinerairesLegerDeCamion(this.truck.id).
        //         subscribe((data:Array<Itineraire>)=>{
        //           this.itiners=this.sortItiners(data.filter(x=>(!x.fini && !x.cancelled)))
        //           this.itinersFinis=data.filter(x=>(x.fini))
        //           this.showMap()  
        //         }, err=>{console.log(err)})
        //       }, err=>{console.log(err)})
        //     }
        //   }
        // })
      }
    }
  }

  marker : google.maps.Marker
  showMap() {
    if(this.subscription!=null) this.subscription.unsubscribe();
    if(this.subscription2!=null) this.subscription2.unsubscribe();
    if(this.subscription3!=null) this.subscription3.unsubscribe();
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
      // this.movingTerminal();
      this.onSaveTerminal(); // in onSaveTerminal will move marker if data gps change
    })
    const intervalItiners = interval(30000); //intervel 30 seconds for update itineraires/routes leger/light
    this.subscription2=intervalItiners.subscribe(val=>{
      if(this.truck!=null && this.truck.id!=null){ // always check truck do nothing if it is null
        // this.itiners=null // set the itiners to null
        this.itinersFinis=null // set the itinersFinis to null
        // this.itinerairesService.itinerairesDeCamion(this.truck.id).
        this.itinerairesService.itinerairesLegerDeCamion(this.truck.id).
        subscribe((data:Array<Itineraire>)=>{
          if(data!=null){
            let itinersTemp:Array<Itineraire>=this.sortItiners(data.filter(x=>(!x.fini && !x.cancelled)))
            this.itinersFinis=data.filter(x=>(x.fini))
            if(itinersTemp!=null){
              this.compareListRoutes(this.itiners, itinersTemp)
              this.itiners=itinersTemp
              if(this.listRoutesChanged) 
              // if the listRoutes changed, the route selected to find image must change the position
              {
                this.itiner=null; 
              }
              if(this.itiner!=null&&this.itiner.id!=null&&this.itiner.id>0) {
                let itiTemp:Itineraire=null;
                this.itiners.forEach(x=>{
                  if(x.id==this.itiner.id)
                  {
                    itiTemp=x;
                    // alert("found itiTemp.id: "+itiTemp.id)
                  }
                  // else{
                  //   this.itiner=null;
                  // }
                })
                if(itiTemp==null) this.itiner=null;
              }  
            }
            else{
              this.itiners=null
              this.itiner=null
              // this.listRoutesChanged=false
            }
          }
          else{// data==null
            this.itiners=null
            this.itiner=null
          }
        }, err=>{console.log(err)})                                            
      }
    })
    
    // we load tonken every minute+2' - 62000 - to test, 
    //reality  every 22 hours - 60000*60*22
    this.subscription4 = interval(60000*60*22).subscribe(val => {
      this.terminalsService.loadTonken();
    });

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
        // this.movingTerminal();
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
      maximumAge: 2000,  //10000, //5000, // age of the position cached by the browser. Don't accept one older than the set amount
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

  listRoutesChanged=false; // each time list routes change => listRoutesChanged=true, terminal will play sound "Message Received"
  compareListRoutes(ls1:Array<Itineraire>, ls2:Array<Itineraire>){
    this.listRoutesChanged=false;
    if(ls1!=null&&ls2==null)
      {this.listRoutesChanged=true;
        // alert("ls1!=null&&ls2==null")
      }
    else if(ls1==null&&ls2!=null)
      {this.listRoutesChanged=true;
        // alert("ls1==null&&ls2!=null")
      }
    else if(ls1!=null&&ls2!=null&&ls1.length!=ls2.length){
      {this.listRoutesChanged=true;
        // alert("ls1.length!=ls2.length")
      }
    }
    else if(ls1!=null&&ls2!=null&&ls1.length==ls2.length){
      ls1.forEach((r)=>{
        // ls2[1]
        if(r.id != ls2[ls1.indexOf(r)].id) // If r is not in list ls2 so the list was changed
        {
          this.listRoutesChanged=true
          // alert("It is not same order.")
        }
      })
    }
    else{
      this.listRoutesChanged=false
    }
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
      title: this.terminal.name //+ this.calculateStopTime(this.terminal.timeStop)
    });
    this.map.setCenter(new google.maps.LatLng(this.terminal.latitude, this.terminal.longitude));
  }

  onSaveTruck(){
    this.transferDaoToDtoTruck()
    this.camionsService.updateCamionFromterminal(this.camionForRoute).subscribe((data:CamionForRoute)=>{
    // this.camionsService.saveCamions(this.truck).subscribe((data:Camion)=>{
    //   this.truck=data
    },err=>{console.log(err)})
  }
  
  imgtUrlTrust:any
  onclickRoute(itiner:Itineraire){
    this.itinerairesService.getDetailItineraire(itiner.id).subscribe((data:Itineraire)=>{
      this.itiner=data;
      this.imgtUrlTrust =this.sanitizer.bypassSecurityTrustResourceUrl(this.itiner.imgUrl)
      this.gotoAnchorID('photo')
    }, err=>{console.log(err)})
  }
  
  public gotoAnchorID(elementId: string): void { 
    this.viewportScroller.scrollToAnchor(elementId);
  }

  showDateLocal(d:Date){
    d=new Date(d);
    let dateLocal= new Date(d.getTime() + (new Date().getTimezoneOffset()*60000))
    return dateLocal;
  }

}

export class CamionItinersList{
  camionId:number
  itiners:Array<Itineraire>
}
export class CamionForRoute {
  id:number;
  odometre:number;     
  longtitude:number;
  latitude:number;
  direction:number; // 0.00 - 359.99 -- north-east-south-west;    
  speed:number;
  timeStop:number; // the time when terminal stopped;  new Date().getTime()
  location:string; // address in AVL
}