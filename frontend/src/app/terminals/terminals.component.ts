import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Camion } from 'src/model/model.camion';
import { Chauffeur } from 'src/model/model.chauffeur';
import { Itineraire } from 'src/model/model.itineraire';
import { Transporter } from 'src/model/model.transporter';
import { CamionsService } from 'src/services/camions.service';
import { ChauffeursService } from 'src/services/chauffeurs.service';
// import { GeolocationService } from 'src/services/geolocation.service';
// import { ItinerairesService } from 'src/services/itineraires.service';
// import { ReperesService } from 'src/services/reperes.service';
import { TransportersService } from 'src/services/transporters.service';
import { VarsGlobal } from 'src/services/VarsGlobal';
import { Subscription, interval } from 'rxjs';
import { TerminalsService } from 'src/services/terminals.service';
import { Terminal } from 'src/model/model.terminal';
import { AppUser } from 'src/model/model.appUser';
import { AuthenticationService } from 'src/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terminals',
  templateUrl: './terminals.component.html',
  styleUrls: ['./terminals.component.css']
})
export class TerminalsComponent implements OnInit {
  driverNote="Speed : ";
  // driverMoved="Having moved : ";

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  
  constructor(
    public terminalsService:TerminalsService,
    public transportersService:TransportersService,
    public chauffeursService:ChauffeursService,
    public varsGlobal:VarsGlobal,
    // private geolocation : GeolocationService,
    // private itinerairesService:ItinerairesService, 
    // private reperesService:ReperesService,
    public router:Router,
    public camionsService:CamionsService, 
    public authenticationService:AuthenticationService, ) { }

  truckHooked:Camion
  truck:Camion;
  trucks:Camion[]; // list all trucks, but not trailer
  trucksGps:Camion[]; // list all trucks Gps
  trucksNoGps:Camion[]; // list all trucks NoGps
  appUser : AppUser = new AppUser();
  role:string="";
    
  listLoginName:Array<string>=[];
    
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
    
    this.transportersService.getDetailTransporter(Number(localStorage.getItem('idTransporter'))).subscribe((data:Transporter)=>{
      this.transporter=data; 
      
      this.terminalsService.terminalsDeTransporter(this.transporter.id).subscribe((data:Array<Terminal>)=>{
        this.terminals=data //.filter(x=>(x.status))
        if(data!=null) this.showMapInit();
        this.authenticationService.getAllAppUsers().subscribe((data:Array<AppUser>)=>{
          //this.listAppUsers=data;
          data.forEach(aU=>{
            this.listLoginName.push(aU.username)
          })
        }, err=>{console.log(err)})
        this.camionsService.camionsDeTransporter(this.transporter.id).subscribe((data:Array<Camion>)=>{
          this.trucks=data.sort((a,b)=>Number(a.unite)-Number(b.unite)).filter(x=>(
            !x.trailer && x.status && (x.idTerminal==null || x.idTerminal<=0)
            // we select truck that : no-trailer + in Exploit + not yet terminal
          ));
          this.trucksGps=this.trucks.filter(x=>(x.gps))
          this.trucksNoGps=this.trucks.filter(x=>(!x.gps))
        }, err=>{console.log(err)})
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

  showMapInit(){    
          let mapProp = {
            center: new google.maps.LatLng(45.568806, -73.918333),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
          this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
          let index = 0;
          this.terminals.forEach(ter=>{
              let location1 = new google.maps.LatLng(ter.latitude, ter.longitude);          
              let marker = new google.maps.Marker({
                position: location1,
                map: this.map,
                icon: {
                  //url:"http://maps.google.com/mapfiles/kml/shapes/truck.png",
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  scale:3,
                  rotation:ter.direction,
                  fillOpacity: 1,
                  fillColor: "#008088",
                  strokeWeight: 3,
                  strokeColor: "red",
                },
                // title: ter.name
                title: ter.name + this.calculateStopTime(ter.timeStop)
              });  
              if(index==0) this.map.setCenter(new google.maps.LatLng(ter.latitude, ter.longitude)); // setcenter map follow first terminal
              ++ index 
          })
          this.map.setZoom(8)
  }

  marker : google.maps.Marker
  showMap() {
    this.terminalsService.getDetailTerminal(this.terminal.id).subscribe((data:Terminal)=>{
      this.terminal=data;
      if(this.terminal.idTruck!=null && this.terminal.idTruck>0)
        this.camionsService.getDetailCamion(this.terminal.idTruck).subscribe((data:Camion)=>{
          this.truckHooked=data
          this.truck=data; // set 2 truck and truckhooked to data
        },
        err=>{console.log(err)})
      else this.truckHooked=null;
      this.truck=null;
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
    },err=>{console.log(err)})

    // const intervalCSM = interval(30000); //intervel 30 seconds for update data terminal on the map
    // this.subscription=intervalCSM.subscribe(val=>{
    //   this.terminalsService.getDetailTerminal(this.terminal.id).subscribe((data:Terminal)=>{
    //     this.terminal=data;
    //     this.movingTerminal();
    //   },err=>{console.log(err)})
    // })
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
      title: this.terminal.name + this.calculateStopTime(this.terminal.timeStop)
    });
    this.map.setCenter(new google.maps.LatLng(this.terminal.latitude, this.terminal.longitude));
  }

  onSelectTruck(){
    if(this.truck!=null) 
    {
      this.terminal.idTruck=this.truck.id; // assign idtruck for this terminal
      this.terminal.unitTruck=this.truck.unite
    }
    else 
    {
      this.terminal.idTruck=null
      this.terminal.unitTruck=""
    }
    // console.log('this.terminal.idTruck when select: '+this.terminal.idTruck)
  }

  onNameChange(){
    // this.shipper.loginName=this.shipper.nom.trim().replace(/\s/g,"").toLowerCase();
    this.terminal.loginName=this.terminal.name.trim().replace(/\s/g,"").toLowerCase();
  }
  
  onCreateUser(){
    this.appUser.username=this.terminal.loginName
    this.appUser.password=this.terminal.password
    this.appUser.roleSimple='TERMINAL'
    this.appUser.idUser=this.terminal.idTransporter.toString()
    this.authenticationService.createAppUser(this.appUser).subscribe((data:AppUser)=>{
      this.appUser = new AppUser();
      console.log('User was created.')
    }, err=>{
      console.log(err);
    });
  }
  
  signUpTerminal(){
    let exist=false; // this loginName doesn't exist yet
    this.listLoginName.forEach(loginName=>{
      if(loginName.includes(this.terminal.loginName)&&(loginName.length==this.terminal.loginName.length))
        {
          alert("Username existed Already. Choose another Username, please!");
          exist=true; // this loginName exist already
        }
    })
    if(this.terminal.password.length<4)
      alert('Password must have at least 4 characteres!')

    if(!exist && this.terminal.password.length>=4){
      this.terminalsService.saveTerminals(this.terminal).subscribe((data:Terminal)=>{
        // this.mode=2;
        this.terminal=data;
        this.onCreateUser();
        if(this.truck!=null){
          this.truck.idTerminal=this.terminal.id; // set this terminal for the truck
          this.truck.nameTerminal=this.terminal.name
          this.camionsService.saveCamions(this.truck).subscribe((data:Camion)=>{
            this.truck=data
          })
        }
          // this.router.navigate(['/terminals']);  //this.mode=2;
      }, err=>{
        console.log(err);
      });
    }
  }

  onModifyTerminal(){
    // release truck when terminal inactivated
    if(!this.terminal.status) {
      this.terminal.idTruck=null
      this.truck=null
    }
    // console.log('this.terminal.idTruck before modify: '+this.terminal.idTruck)
    this.terminalsService.saveTerminals(this.terminal).subscribe((data:Terminal)=>{
      this.terminal=data;
      // console.log('this.terminal.idTruck after modify: '+this.terminal.idTruck)
      // Truck in not null, there are 2 ways : existed before or just being choosen
      if(this.truck!=null){
        // do nothing if this truck hooked already with terminal
        if(this.truck.idTerminal!=null && this.truck.idTerminal==this.terminal.id){
          // do nothing
           console.log("Truck hooked already with Terminal. Just modify terminal in case infos changed")
        }
        // if truck is not hooked with terminal and just being choosen we must set and save the choice
        else{
          this.truck.idTerminal=this.terminal.id; // set this terminal for the truck
          this.truck.nameTerminal=this.terminal.name
          this.camionsService.saveCamions(this.truck).subscribe((data:Camion)=>{
            this.truckHooked=data  // it means this truck hook terminal now
            this.camionsService.camionsDeTransporter(this.transporter.id).subscribe((data:Array<Camion>)=>{
              this.trucks=data.sort((a,b)=>Number(a.unite)-Number(b.unite)).filter(x=>(
                !x.trailer && x.status && (x.idTerminal==null || x.idTerminal<=0)
              ));
            }, err=>{console.log(err)});
          })
        }
      }
      // in case truck is null, if already null it is mean  truckhooked is null, if just choose set truckhooked to null
      else{
        if(this.truckHooked!=null){
          this.truckHooked.idTerminal=null;
          this.truckHooked.nameTerminal=""
          this.camionsService.saveCamions(this.truckHooked).subscribe((data:Camion)=>{
            this.truckHooked=null // it means this truck without terminal
            this.camionsService.camionsDeTransporter(this.transporter.id).subscribe((data:Array<Camion>)=>{
              this.trucks=data.sort((a,b)=>Number(a.unite)-Number(b.unite)).filter(x=>(
                !x.trailer && x.status && (x.idTerminal==null || x.idTerminal<=0)
              ));
            }, err=>{console.log(err)});
          })
        }
      }
      // this.truck=null;
      alert("Ok, it's modified")
      //
      this.terminalsService.terminalsDeTransporter(this.transporter.id).subscribe((data:Array<Terminal>)=>{
        this.terminals=data
      }, err=>{console.log(err)})
      //
        // this.router.navigate(['/terminals']);  //this.mode=2;
    }, err=>{
      console.log(err);
    })
    
    // await this.camionsService.camionsDeTransporter(this.transporter.id).subscribe((data:Array<Camion>)=>{
    //   this.trucks=data.sort((a,b)=>Number(a.unite)-Number(b.unite)).filter(x=>(
    //     !x.trailer && x.status && (x.idTerminal==null || x.idTerminal<=0)
    //   ));
    // }, err=>{console.log(err)});
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
}
