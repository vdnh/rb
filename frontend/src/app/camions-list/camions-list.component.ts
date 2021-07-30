import { MatMenuTrigger } from '@angular/material/menu';
// import { ContextMenuComponent } from 'ngx-contextmenu';
import { Component, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { Transporter } from '../../model/model.transporter';
import { TransportersService } from '../../services/transporters.service';
import { ActivatedRoute, Router } from '@angular/router';
//import { Contact } from 'src/model/model.contact';
//import { Chauffeur } from 'src/model/model.chauffeur';
//import { Adresse } from 'src/model/model.adresse';
import { ContactsService } from '../../services/contacts.service';
import { AdressesService } from '../../services/adresses.service';
import { CamionsService } from '../../services/camions.service';
//import { ServicesOffre } from 'src/model/model.servicesOffre';
import { Camion } from 'src/model/model.camion';
//import { FichePhysiqueEntretien } from 'src/model/model.fichePhysiqueEntretien';
//import { FichePhysiqueEntretienCont } from 'src/model/model.fichePhysiqueEntretienCont';
import { FichePhysiquesService } from 'src/services/fichePhysiques.service';
import { FichePhysiqueContsService } from 'src/services/fichePhysiqueConts.service';
//import { AutreEntretien } from 'src/model/model.autreEntretien';
import { AutreEntretiensService } from 'src/services/autreEntretiens.service';
//import { AutreEntretienList } from 'src/model/model.autreEntretienList';
import { Subscription, timer, interval, from, Observable, fromEvent } from 'rxjs';
// import {  } from 'rxjs/observable/fromEvent';
import { DomSanitizer } from '@angular/platform-browser';
import { ChauffeursService } from 'src/services/chauffeurs.service';
import { Itineraire } from 'src/model/model.itineraire';
// import { async } from '@angular/core/testing';
import { GeocodingService } from 'src/services/geocoding.service';
import { GeolocationService } from 'src/services/geolocation.service';
import { Repere } from 'src/model/model.repere';
import { ItinerairesService } from 'src/services/itineraires.service';
import { ReperesService } from 'src/services/reperes.service';
import { ViewportScroller } from '@angular/common';
import { FichePhysiqueEntretien } from 'src/model/model.fichePhysiqueEntretien';
import { FichePhysiqueEntretienCont } from 'src/model/model.fichePhysiqueEntretienCont';
import { VarsGlobal } from 'src/services/VarsGlobal';
import { TransportsService } from 'src/services/transports.service';
import { Transport } from 'src/model/model.transport';


@Component({
  selector: 'app-camions-list',
  templateUrl: './camions-list.component.html',
  styleUrls: ['./camions-list.component.css']
})
export class CamionsListComponent implements OnInit, OnDestroy {
  
  imgArrow = "assets/images/arrow.png";
  
  listNumberUnite:Array<string>=[];// collection of list number unite
  
  itineraire:boolean=false;
  camionsList:boolean=true; // par default, on voit la liste de camions
  repere:boolean=false;
  modeConfirm=false;
  modeProfil=false;

  itiner:Itineraire=new Itineraire();
  itiners:Array<Itineraire>=[];
  itinersFinis:Array<Itineraire>=[];
  itinersArchives:Array<Itineraire>=[];
  itinersCancels:Array<Itineraire>=[];
  rep:Repere=new Repere();
  reps:Array<Repere>=[];

  //* for map flotte truck
  subscriptionCSM : Subscription;
  //* for Itineraires and Reperes
  subscription : Subscription;
  //* for refresh raffic layer
  subscriptionTraffic : Subscription;
  //transporter:Transporter=new Transporter();
  detailCamion=false;
  camionCarrier:Camion; //=new Camion(); // camion which carry the trailer - just for trailer
  camion:Camion; //=new Camion(); // camion to modify detail 
  camionMap:Camion=new Camion();
  addcamion:Camion=new Camion(); // to add a new camion
  addUnite=false; // to hide/show tab add unite
  fichePhysiqueEntretien:FichePhysiqueEntretien= new FichePhysiqueEntretien();
  fichePhysiqueEntretienCont:FichePhysiqueEntretienCont = new FichePhysiqueEntretienCont();
  camionsSurMap:Camion[]//Array<Camion>=[]; //new Array<Camion>();
  camionsNoGPS:Camion[]//Array<Camion>;  // list of camions no-gps
  camionsGPSAndNoGPS:Camion[]//Array<Camion>;  // list of camions no-gps and gps
  camionsOutService:Camion[]//Array<Camion>;  // list of camions out of service temporary
  remorques:Camion[]//Array<Camion>;  // list of trailers
  
  camions: Camion[];
  _camions: Camion[];

  _camionsSurMap:Camion[]//Array<Camion>=[]; //new Array<Camion>();
  _camionsNoGPS:Camion[]//Array<Camion>;  // list of camions no-gps
  _camionsGPSAndNoGPS:Camion[]//Array<Camion>;  // list of camions no-gps and gps
  _camionsOutService:Camion[]//Array<Camion>;  // list of camions out of service temporary
  _remorques:Camion[]//Array<Camion>;  // list of trailers
  //idCamionMap:number=108;  // test wit Hino of SOS
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  markers=Array<google.maps.Marker>();
  carte:number=1; //-1;
  carteText:string="Reperer sur la carte";
  iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
  //infoWindow: google.maps.InfoWindow;
  transporter: Transporter;
  
  // camionsInOperation: Camion[];
  // camionsOutOperation: Camion[];

  today=new Date();
  todaySuite = new Date();

  // @ViewChild(MatMenuTrigger) contextMenuOneTruck: MatMenuTrigger;
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  camionClicked: Camion;

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item': "test" };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  onContextMenuRightClick(event: MouseEvent) {
    this.camionClicked=null;
    // if(this.camionClicked==null){
      event.preventDefault();
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      // this.contextMenu.menuData = { 'item': item };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    // }
  }

  onContextMenuAllTrucksClick(event:MouseEvent) {
    if(this.camionClicked!=null && !this.repere){ //
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }

  onContextMenuClick(x, y) {
    // event.preventDefault();
    // this.contextMenuPosition.x = event.clientX + 'px';
    // this.contextMenuPosition.y = event.clientY + 'px';
    if(this.camionClicked!=null){
      this.contextMenuPosition.x = x + 'px';
      this.contextMenuPosition.y = y + 'px';
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }

  onContextMenuAction1() {
    alert(`Click on Action 1 for`);
  }

  onContextMenuAction2() {
    alert(`Click on Action 2 for`);
  }

  calculateStopTime(timeStop:number){
    if(timeStop!=null){
      let duration = new Date().getTime() - timeStop
      //console.log('This terminal is stopping: ' + Math.round(duration/1000/60) + " minutes")
      return ' Stopped: ' + this.showStopDuration(Math.round(duration/1000/60))
      // return ' stopped: ' + Math.round(duration/1000/60) + " minutes"
    }
    else 
      return ''
  }
  
  // @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;

  // showMessage(message: any) {
  //   alert(message);
  //   console.log(message);
  // }

  // items = [
  //   { name: 'John', otherProperty: 'Foo' },
  //   { name: 'Joe', otherProperty: 'Bar' }
  // ];

  // numbersArray:any;
  
  constructor(public activatedRoute:ActivatedRoute, public transportersService:TransportersService, public contactsService:ContactsService,
    public adressesService:AdressesService, public camionsService:CamionsService,  public fichePhysiquesService:FichePhysiquesService,
    public fichePhysiqueContsService:FichePhysiqueContsService, public autreEntretiensService:AutreEntretiensService, private router:Router,
    public chauffeursService:ChauffeursService, private sanitizer:DomSanitizer, 
    // public geocoding : GeocodingService,
    private geolocation : GeolocationService,
    private itinerairesService:ItinerairesService, private reperesService:ReperesService,
    private viewportScroller: ViewportScroller,
    public transportsService : TransportsService,
    public varsGlobal:VarsGlobal,
    ){    
    // this.numbersArray=Array(100).map((x,i)=>i)
    // this.numbersArray=Array(5).fill(4)
  }
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    console.log('this.subscription.unsubscribe();')
    if(this.subscription!=null) this.subscription.unsubscribe();
    if(this.subscriptionCSM!=null) this.subscriptionCSM.unsubscribe();
    // this.subscriptionTraffic.unsubscribe();
  }

  ngOnInit() {
    //this.itiner.datePick.setFullYear(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    //this.itiner.dateDrop.setFullYear(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    console.log('new Date().getTimezoneOffset(): '+new Date().getTimezoneOffset())
    this.camionsSurMap=[];
    this.transportersService.getDetailTransporter(Number(localStorage.getItem('idTransporter'))).subscribe((data:Transporter)=>{
      this.transporter=data;
      // get list itineraires and then sort ithem
      // this.itinerairesService.itinerairesDeTransporter(this.transporter.id).subscribe((data:Array<Itineraire>)=>{
      this.itinerairesService.itinerairesLegerDeTransporter(this.transporter.id).subscribe((data:Array<Itineraire>)=>{
        if(data!=null) {
          this.itiners=data.filter(x=>(x.fini==false&&x.cancelled==false)).sort(
            (a,b)=>(a.id-b.id)).sort(
              (a,b)=>(new Date(a.datePick).getTime()-new Date(b.datePick).getTime())) // id asc - datePick asc
          this.itiners=this.sortItiners(this.itiners)
          this.itinersFinis=data.filter(x=>(x.fini==true&&x.archive==false)).sort(
            (b,a)=>(a.id-b.id)).sort(
              (b,a)=>(new Date(a.dateDrop).getTime()-new Date(b.dateDrop).getTime())) // id desc - dateDrop desc
          this.itinersArchives=data.filter(x=>(x.fini==true&&x.archive==true)).sort(
            (b,a)=>(a.id-b.id)).sort(
              (b,a)=>(new Date(a.dateDrop).getTime()-new Date(b.dateDrop).getTime())) // id desc - dateDrop desc
          this.itinersCancels=data.filter(x=>x.cancelled==true).sort(
            (b,a)=>(a.id-b.id))          
        }
        //get list reperes
        this.reperesService.reperesTransporter(this.transporter.id).subscribe((data:Array<Repere>)=>{
          if(data!=null) this.reps=data
          this.onPress(); // show carte right now
          // alert("Attendre 2 secondes, on loade la carte, SVP!")
        }, err=>{console.log(err)})
      },err=>{console.log(err)})
    }, err=>{
      console.log(err);
    });
  }

  //myWindow: any;

  sortItinersByDatePick(itiners:Array<Itineraire>){
    // alert("Hi sortItinersByDatePick");
    //*//
    itiners.sort((a,b)=>{
      if(a.id>b.id)
        return 1;
      if(a.id<b.id)
        return -1;
      if(new Date(a.datePick).getTime()>new Date(b.datePick).getTime())
        return 1;
      if(new Date(a.datePick).getTime()<new Date(b.datePick).getTime())
        return -1;
      return 0;
    })
    //*/
    // itiners.sort((a,b)=>(a.id-b.id)).sort(
    //     (a,b)=>(new Date(a.datePick).getTime()-new Date(b.datePick).getTime())) // // id asc - datePick asc
  }
  
  sortItinersByUnite(itiners:Array<Itineraire>){
    // alert("Hi sortItinersByUnite");
    //*//
    itiners.sort((a, b)=>{
      if(a.idCamion!=null&&b.idCamion!=null){
        if(Number(this.camionsGPSAndNoGPS.find(x=>x.id===a.idCamion).unite)>Number(this.camionsGPSAndNoGPS.find(x=>x.id===b.idCamion).unite))
        return 1;
      if(Number(this.camionsGPSAndNoGPS.find(x=>x.id===a.idCamion).unite)<Number(this.camionsGPSAndNoGPS.find(x=>x.id===b.idCamion).unite))
        return -1;
      return 0;
      }
      else{
        return a.camionAttribue.localeCompare(b.camionAttribue)
      }
    })
    // localStorage.setItem('sortItinersByUnite', '1')
    //*/

    // itiners.sort((a,b)=>(
    //       Number(this.camionsGPSAndNoGPS.find(x=>x.id===a.idCamion).unite)- 
    //       Number(this.camionsGPSAndNoGPS.find(x=>x.id===b.idCamion).unite)
    //     )
    //   ).sort(
    //       (a,b)=>(new Date(a.datePick).getTime()-new Date(b.datePick).getTime())
    //     ) // number unite asc - datePick asc
  }
  onPress(){
    //this.carte=-this.carte;
    if(this.carte==-1){
      //this.camionsSurMap=[];// to empty this list
      this.carteText='Reperer sur la carte'
      this.subscription.unsubscribe();
    }
    else{
      this.camionsSurMap=[];// to empty this list
      this.camionsNoGPS=[];// to empty this list
      this.camionsGPSAndNoGPS=[];// to empty this list
      this.remorques=[];// to empty this list
      this.camionsOutService=[];

      this._camionsSurMap=[];// to empty this list
      this._camionsNoGPS=[];// to empty this list
      this._camionsGPSAndNoGPS=[];// to empty this list
      this._remorques=[];// to empty this list
      this._camionsOutService=[];

      this.carteText='Fermer la carte'    
        this.camionsService.camionsDeTransporter(this.transporter.id).subscribe((data:Array<Camion>)=>{
          // check number of trucks follow plan pay
          if(data.length>this.transporter.trucks){
            // console.log('camions before splice : ' +data.length)
            data.sort((a,b)=>{
              if(a.id>b.id)
                return 1;
              if(a.id<b.id)
                return -1;
              return 0;
            });
            // remove number trucks excess number trucks of transporter
            data.splice(this.transporter.trucks, (data.length-this.transporter.trucks))
            // console.log('camions after splice : ' +data.length)
          }
          //
          this._camions=this.camions=data.sort((a,b)=>Number(a.unite)-Number(b.unite));
          this.listNumberUnite=[]; // empty the list number unite
          data.forEach(camion=>{
            this.listNumberUnite.push(camion.unite)
            // this is find all trucks actuals
            if(camion.status){ 
              // find all unites outService temporary
              if(camion.outService){ 
                this.camionsOutService.push(camion)
                this._camionsOutService.push(camion)
              }
              // the rest is all unite in service normally
              else{ 
                // find trailers / remorques
                if(camion.trailer) 
                {
                  this.remorques.push(camion)

                  this._remorques.push(camion)
                }
                // find all trucks
                else{
                  // find trucks with gps
                  // if(camion.gps)
                  if(camion.gps || (camion.idTerminal!=null && camion.idTerminal>0))
                  {
                    this.camionsSurMap.push(camion)
                    this.camionsGPSAndNoGPS.push(camion)

                    this._camionsSurMap.push(camion)
                    this._camionsGPSAndNoGPS.push(camion)
                  }
                  // find trucks without gps
                  // if(!camion.gps)
                  if(!camion.gps && (camion.idTerminal==null || camion.idTerminal<=0))
                  {
                    this.camionsNoGPS.push(camion)
                    this.camionsGPSAndNoGPS.push(camion)

                    this._camionsNoGPS.push(camion)
                    this._camionsGPSAndNoGPS.push(camion)
                  }
                }                
              }
            }
            else{
              // this is the list for antecedent trucks
              // perhelp for futur we us it
            }

            /*//begin the find trucks - old methode
            if(camion.outService){ // find all unites outService temporary
              this.camionsOutService.push(camion)

              this._camionsOutService.push(camion)
            }
            else{ // the rest is all unite in service normally
              if(camion.status && (camion.uniteMonitor!=null && camion.monitor!=null) && (camion.uniteMonitor.length!=0 && 
                camion.monitor.length!=0))// && (!camion.uniteMonitor.includes('no-gps'))) // !camion.uniteMonitor.includes('no-gps') - means : there isn't GPS
              {
                if(!camion.uniteMonitor.includes('no-gps'))
                {
                  this.camionsSurMap.push(camion)
                  this.camionsGPSAndNoGPS.push(camion)

                  this._camionsSurMap.push(camion)
                  this._camionsGPSAndNoGPS.push(camion)
                }
                else 
                  // if(camion.status && (camion.uniteMonitor!=null && camion.monitor!=null) && (camion.uniteMonitor.length!=0 && 
                  // camion.monitor.length!=0) && (camion.uniteMonitor.includes('no-gps'))) // !camion.uniteMonitor.includes('no-gps') - means : there isn't GPS
                {
                  this.camionsNoGPS.push(camion)
                  this.camionsGPSAndNoGPS.push(camion)

                  this._camionsNoGPS.push(camion)
                  this._camionsGPSAndNoGPS.push(camion)
                }
              }
              else 
                if(camion.status) 
                  {
                    this.remorques.push(camion)  // Camions in service without GPS are trailers

                    this._remorques.push(camion)
                  }

            }
            //end the find trucks - old methode //*/
          })
          let mapProp = {
            center: new google.maps.LatLng(45.568806, -73.918333),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
          this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

          this.map.addListener('click', (event)=>{
            this.camionClicked=null;
            if(this.repere){
              this.latLngAddress= new google.maps.LatLng(
                this.rep.originLat = event.latLng.lat(),
                this.rep.originLong = event.latLng.lng()
              )
              let geocodingTemp = new GeocodingService()
              // this.geocoding.geocode(new google.maps.LatLng(              
              geocodingTemp.geocode(new google.maps.LatLng(              
                this.rep.originLat,
                this.rep.originLong
              ))
              .forEach(
                (results: google.maps.GeocoderResult[]) => {
                  this.rep.address=results[0].formatted_address;
                }
              ).then(()=>{
                // this.addressChange()
                this.drawAddress();
              })     
              
            }
          })
          this.camionsSurMap.forEach(camion=>{
            if(camion.localName==null || camion.localName.length==0) this.belongingRepere(camion); //set repere si exist into
            //console.log("camion.id : "+ camion.id)
            if(camion.uniteMonitor!=null && camion.monitor!=null){
              //this.marker.setMap(null);
              let location1 = new google.maps.LatLng(camion.latitude, camion.longtitude);          
              let marker = new google.maps.Marker({
                position: location1,
                map: this.map,
                icon: {
                 // url:"http://maps.google.com/mapfiles/kml/shapes/truck.png",
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  //url:"http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                  scale:7,
                  rotation:camion.direction,
                  // fillOpacity: 1,
                  // fillColor: "#7FFF00", //"#FFFFFF"
                  strokeWeight: 3,
                  // strokeColor: "#008088", //"#FFFFFF",//"red",
                  strokeColor: ((camion.speed!=null&&camion.speed>0)?"#008088":"red"), //"#FFFFFF",//"red",
                },
                // icon:"assets/images/circles-animated.gif",
                title: ((camion.foreignName!=null && camion.foreignName.length>0) ? camion.foreignName : ("#"+camion.unite+" "+camion.marque+" "+camion.modele)),
                label: {text:((camion.foreignName!=null && camion.foreignName.length>0) ? camion.foreignName : ("#"+camion.unite+" "+camion.marque+" "+camion.modele)), color:"orange"},
                // animation:google.maps.Animation.BOUNCE
                // animation:google.maps.Animation.DROP
              });

              // const promise = new Promise(function(resolve, reject) {
              //     resolve('Promise returns after 1.5 second!');
              // });
              // let temp=fromEvent<MouseEvent>(document.body, 'click')

              marker.addListener('click', (event)=>{
                this.camionClicked=camion;
                // promise.then(()=> {
                //   this.subscribe01=temp.subscribe(async e => {
                //     this.onContextMenuClick(await e.pageX.toString(), await e.pageY.toString())
                //   })})
              })
              this.markers.push(marker)
              this.geolocation.getCurrentPosition().subscribe(async (data)=>{
                this.map.setCenter(new google.maps.LatLng(data.coords.latitude, data.coords.longitude));
                //this.itineraire=true; // to display again all fields itineraire, just for refresh data fields
              })
            }  
          })
          
          //begin show traffic layer
          this.showTraffic()
          // const intervalTraffic = interval(20000);  // we refresh the traffic each 20 seconde - 20000ms
          // this.subscriptionTraffic=intervalTraffic.subscribe(val=>{
          //   this.showTraffic(); 
          // })
          // setInterval(()=>{
          //   this.showTrafficNull();
          //   this.showTraffic()
          // },15000) // refresh traffic for 15 seconds

          //end procedure show traffic layer

          const intervalIsCs = interval(20000);  // we refresh the Camions/Itineraires each 20 seconde - 20000ms
          this.subscription=intervalIsCs.subscribe(val=>{
            if(!this.detailCamion){// We refresh just in mode show map
              //get list itineraires and then sort ithem
              // this.itinerairesService.itinerairesDeTransporter(this.transporter.id).subscribe((data:Array<Itineraire>)=>{
                this.itinerairesService.itinerairesLegerDeTransporter(this.transporter.id).subscribe((data:Array<Itineraire>)=>{
                if(data!=null) {
                  this.itiners=data.filter(x=>(x.fini==false&&x.cancelled==false)).sort(
                    (a,b)=>(a.id-b.id)).sort(
                      (a,b)=>(new Date(a.datePick).getTime()-new Date(b.datePick).getTime())) // id asc - datePick asc
                  this.itiners=this.sortItiners(this.itiners)
                  this.itinersFinis=data.filter(x=>(x.fini==true&&x.archive==false)).sort(
                    (b,a)=>(a.id-b.id)).sort(
                      (b,a)=>(new Date(a.dateDrop).getTime()-new Date(b.dateDrop).getTime())) // id desc - dateDrop desc
                  this.itinersArchives=data.filter(x=>(x.fini==true&&x.archive==true)).sort(
                    (b,a)=>(a.id-b.id)).sort(
                      (b,a)=>(new Date(a.dateDrop).getTime()-new Date(b.dateDrop).getTime())) // id desc - dateDrop desc
                  this.itinersCancels=data.filter(x=>x.cancelled==true).sort(
                    (b,a)=>(a.id-b.id))          
                
                  // if(localStorage.getItem('sortItinersByUnite')!=null&&localStorage.getItem('sortItinersByUnite').includes('1'))
                  //   this.sortItinersByUnite(this.itiners)
                }
                //get list reperes
                this.reperesService.reperesTransporter(this.transporter.id).subscribe((data:Array<Repere>)=>{
                  if(data!=null) this.reps=data
                  this.makeCIsLList(); // make the lists itiniers follow each camion
                }, err=>{console.log(err)})
              },err=>{console.log(err)})
            }
          })
          
          const intervalCSM = interval(120200); //intervel for refresh camions on the map
          this.subscriptionCSM=intervalCSM.subscribe(val=>{
            //this.getLocalisation()
            //this.onPress(); // replace this.getLocalisation() 
            this.onRefresh(); // replace this.getLocalisation() 
          })

          this.makeCIsLList(); // make the lists itiniers follow each camion
        }, err=>{
          console.log();
        })
      //})      
    }
    //this.router.navigate(["/map-flotte", this.id]);
  }

  trafficLayer: google.maps.TrafficLayer;
  showTraffic(){
    this.trafficLayer = new google.maps.TrafficLayer();
    this.trafficLayer.setMap(this.map);
    //console.log('traffic set')
  }
  showTrafficNull(){
    this.trafficLayer.setMap(null);
    //console.log('trffic null')
  }
  
  showTrafficLayer=true
  showOrStopTrafficLayer(){
    if(!this.showTrafficLayer){
      this.trafficLayer.setMap(null);
      // this.trafficLayer = null;
      // this.subscriptionTraffic.unsubscribe()
    }
    if(this.showTrafficLayer){
      this.showTraffic()
        // const intervalTraffic = interval(20000);  // we refresh the traffic each 20 seconde - 20000ms
        // this.subscriptionTraffic=intervalTraffic.subscribe(val=>{
        //   this.showTraffic(); 
        // })
    }
    //console.log('trffic null')
  }

  // subscribe01 : Subscription;
  // refreshCamionsSurMap(){
  //   this.subscribe01.unsubscribe();
  //   this.subscribe01.remove(this.subscribe01)
  //   this.camionClicked=null;
  //   this.markers.forEach(marker=>{
  //     marker.setMap(null);
  //     marker=null;
  //   })
  //   this.markers = [];
  //   this.camionsSurMap.forEach(camion=>{
  //     if(camion.localName==null || camion.localName.length==0) this.belongingRepere(camion); //set repere si exist into
  //     //console.log("camion.id : "+ camion.id)
  //     if(camion.uniteMonitor!=null && camion.monitor!=null){
  //       //this.marker.setMap(null);
  //       let location1 = new google.maps.LatLng(camion.latitude, camion.longtitude);          
  //       let marker = new google.maps.Marker({
  //         position: location1,
  //         map: this.map,
  //         icon: {
  //          // url:"http://maps.google.com/mapfiles/kml/shapes/truck.png",
  //           path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
  //           //url:"http://maps.google.com/mapfiles/ms/icons/green-dot.png",
  //           scale:5,
  //           rotation:camion.direction,
  //           fillOpacity: 1,
  //           fillColor: "#7FFF00", //"#FFFFFF"
  //           strokeWeight: 2,
  //           strokeColor: "#008088", //"#FFFFFF",//"red",
  //         },
  //         title: ((camion.foreignName!=null && camion.foreignName.length>0) ? camion.foreignName : (camion.unite+camion.type+camion.modele)),
  //         label: {text:((camion.foreignName!=null && camion.foreignName.length>0) ? camion.foreignName : (camion.unite+camion.type+camion.modele)), color:"orange"},
  //       });
  //       const promise = new Promise(function(resolve, reject) {
  //         // setTimeout(function() {
  //           resolve('Promise returns after 1.5 second!');
  //         // }, 1500);
  //       });
  //       let temp=fromEvent<MouseEvent>(document.body, 'click')
  //       marker.addListener('click', (event)=>{
  //         this.camionClicked=camion;
  //           var x :string//=ev.clientX
  //           var y : string //=ev.clientY
  //         promise.then(()=> {
  //           this.subscribe01=temp.subscribe(async e => {
  //             this.onContextMenuClick(await e.pageX.toString(), await e.pageY.toString())
  //           })})
  //       })
  //       this.markers.push(marker)
  //     }  
  //   })
  // }

  onRefresh(){
    if(this.detailCamion){
      //this.camionsSurMap=[];// to empty this list
      //this.carteText='Reperer sur la carte'
      //this.subscription.unsubscribe();
      console.log('this.detailCamion est true, on fait rien!!!')
    }
    else{
      let tempCamion:Camion=this.camion;
      
      this.camionsSurMap=[];// to empty this list
      this.camionsNoGPS=[];// to empty this list
      this.camionsGPSAndNoGPS=[];// to empty this list
      this.remorques=[];// to empty this list
      this.camionsOutService=[];

      this._camionsSurMap=[];// to empty this list
      this._camionsNoGPS=[];// to empty this list
      this._camionsGPSAndNoGPS=[];// to empty this list
      this._remorques=[];// to empty this list
      this._camionsOutService=[];

      this.carteText='Fermer la carte'    
        this.camionsService.camionsDeTransporter(this.transporter.id).subscribe((data:Array<Camion>)=>{
          // check number of trucks follow plan pay
          if(data.length>this.transporter.trucks){
            // console.log('camions before splice : ' +data.length)
            data.sort((a,b)=>{
              if(a.id>b.id)
                return 1;
              if(a.id<b.id)
                return -1;
              return 0;
            });
            // remove number trucks excess number trucks of transporter
            data.splice(this.transporter.trucks, (data.length-this.transporter.trucks))
            // console.log('camions after splice : ' +data.length)
          }
          //

          // let tempCamion:Camion=this.camion;
          //this.detailCamion=false // close detail camion, to refresh            
          // this.camionCarrier=null;
          // this.camion=null;
          this._camions=this.camions=data.sort((a,b)=>Number(a.unite)-Number(b.unite));
          this.listNumberUnite=[] ; // empty list number unite
          data.forEach(camion=>{
            this.listNumberUnite.push(camion.unite)
            // this is find all trucks actuals
            if(camion.status){ 
              // find all unites outService temporary
              if(camion.outService){ 
                this.camionsOutService.push(camion)
                this._camionsOutService.push(camion)
              }
              // the rest is all unite in service normally
              else{ 
                // find trailers / remorques
                if(camion.trailer) 
                {
                  this.remorques.push(camion)

                  this._remorques.push(camion)
                }
                // find all trucks
                else{
                  // find trucks with gps
                  // if(camion.gps)
                  if(camion.gps || (camion.idTerminal!=null && camion.idTerminal>0))
                  {
                    this.camionsSurMap.push(camion)
                    this.camionsGPSAndNoGPS.push(camion)

                    this._camionsSurMap.push(camion)
                    this._camionsGPSAndNoGPS.push(camion)
                  }
                  // find trucks without gps
                  // if(!camion.gps)
                  if(!camion.gps && (camion.idTerminal==null || camion.idTerminal<=0))
                  {
                    this.camionsNoGPS.push(camion)
                    this.camionsGPSAndNoGPS.push(camion)

                    this._camionsNoGPS.push(camion)
                    this._camionsGPSAndNoGPS.push(camion)
                  }
                }                
              }
            }
            else{
              // this is the list for antecedent trucks
              // perhelp for futur we us it
            }
            /* begin find trucks - old method
            // this.camion= new Camion(); //null;  // keep the same camion for DetailCamion
            // if(camion.status && (camion.uniteMonitor!=null && camion.monitor!=null) && (camion.uniteMonitor.length!=0 && 
            //   camion.monitor.length!=0) && (!camion.uniteMonitor.includes('no-gps'))) // !camion.uniteMonitor.includes('no-gps') - means : there isn't GPS
            //   this.camionsSurMap.push(camion)
            if(camion.outService){ // find all unites outService te,porary
              this.camionsOutService.push(camion)
              this._camionsOutService.push(camion)
            }
            else{ // the rest is all unite in service normally
              if(camion.status && (camion.uniteMonitor!=null && camion.monitor!=null) && (camion.uniteMonitor.length!=0 && 
                camion.monitor.length!=0))// && (!camion.uniteMonitor.includes('no-gps'))) // !camion.uniteMonitor.includes('no-gps') - means : there isn't GPS
              {
                if(!camion.uniteMonitor.includes('no-gps'))
                {
                  this.camionsSurMap.push(camion)
                  this.camionsGPSAndNoGPS.push(camion)

                  this._camionsSurMap.push(camion)
                  this._camionsGPSAndNoGPS.push(camion)
                }
                else 
                  // if(camion.status && (camion.uniteMonitor!=null && camion.monitor!=null) && (camion.uniteMonitor.length!=0 && 
                  // camion.monitor.length!=0) && (camion.uniteMonitor.includes('no-gps'))) // !camion.uniteMonitor.includes('no-gps') - means : there isn't GPS
                  {
                    this.camionsNoGPS.push(camion)
                    this.camionsGPSAndNoGPS.push(camion)

                    this._camionsNoGPS.push(camion)
                    this._camionsGPSAndNoGPS.push(camion)
                  }
              }
              else 
                if(camion.status) 
                  {
                    this.remorques.push(camion)  // Camions in service without GPS are trailers          
                    
                    this._remorques.push(camion)
                  }
            }
            // if(this.detailCamion){ // if we are in the detailCamion, refresh this function to show camion carrier/trailer
            //   this.detailCamion=false // close detail camion, to refresh
            //   this.onChangeCamionCapacity()// run that to refresh the carrier / trailer then detailcamion will be true
            //   console.log('this.onChangeCamionCapacity() after refresh list camion')
            // }
            // end find trucks - old method //*/
          })
          this.makeCIsLList();  // refresh the list itineraires of each truck
          if(this.detailCamion){ // if we are in the detailCamion, refresh this function to show camion carrier/trailer
            // let tempCamion:Camion=this.camion;
            // this.detailCamion=false // close detail camion, to refresh            
            // this.camionCarrier=null;
            //this.camion=tempCamion; //null;
            // this.onClickCamion(tempCamion)
            // let temp=document.getElementById('dtc')
            //this.onChangeCamionCapacity()// run that to refresh the carrier / trailer then detailcamion will be true
            // console.log('this.onChangeCamionCapacity() after refresh list camion')
            console.log('this.onChangeCamion() after refresh list camion')
            console.log('this.camion.unite: '+this.camion.unite)
            if(this.camionCarrier!=null) console.log('this.camionCarrier.unite: '+this.camionCarrier.unite)
            
          }
          else{
            // let mapProp = {
          //   center: new google.maps.LatLng(45.568806, -73.918333),
          //   zoom: 15,
          //   mapTypeId: google.maps.MapTypeId.ROADMAP
          // };
          // this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
          this.markers.forEach(marker=>{
            marker.setMap(null);
            marker=null;
          })
          this.markers = [];
          this.camionsSurMap.forEach(camion=>{
            if(camion.localName==null||camion.localName.length==0) this.belongingRepere(camion); //set repere si exist into
            //console.log("camion.id : "+ camion.id)
            if(camion.uniteMonitor!=null && camion.monitor!=null){
              //this.marker.setMap(null);
              let location1 = new google.maps.LatLng(camion.latitude, camion.longtitude);          
              let marker = new google.maps.Marker({
                position: location1,
                map: this.map,
                icon: {
                 // url:"http://maps.google.com/mapfiles/kml/shapes/truck.png",
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  //url:"http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                  scale:7,
                  rotation:camion.direction,
                  // fillOpacity: 1,
                  // fillColor: "#7FFF00", //"#FFFFFF"
                  strokeWeight: 3,
                  // strokeColor: "#008088", //"#FFFFFF",//"red",
                  strokeColor: ((camion.speed!=null&&camion.speed>0)?"#008088":"red"), //"#FFFFFF",//"red",
                },
                title: ((camion.foreignName!=null && camion.foreignName.length>0) ? camion.foreignName : ("#"+camion.unite+" "+camion.marque+" "+camion.modele)),
                label: {text:((camion.foreignName!=null && camion.foreignName.length>0) ? camion.foreignName : ("#"+camion.unite+" "+camion.marque+" "+camion.modele)), color:"orange"},
                // animation:google.maps.Animation.BOUNCE
                // animation:google.maps.Animation.DROP
              });
              //this.infoWindow = new google.maps.InfoWindow;
              marker.addListener('click', (event)=>{
                this.camionClicked=camion;
                // var contentString:string='<div><p> '+ ((camion.foreignName!=null && camion.foreignName.length>0) ? camion.foreignName : (camion.unite+camion.type+camion.modele))+" <br>" +
                //   '<table border="1">' +
                //   this.prepareText(camion)+
                //   '</table>'+'<br>'
                //   ' </p></div>'
                // this.infoWindow.setContent(contentString);
                // this.infoWindow.setPosition(event.latLng);
                // this.infoWindow.open(this.map);
              })
              this.markers.push(marker)
            }  
          })
          //this.makeCIsLList(); // make the lists itiniers follow each camion
          }
          
        }, err=>{
          console.log();
        })
      //})      
    }
    //this.router.navigate(["/map-flotte", this.id]);
  }

  orientation(c:Camion){
    //let degreeText="rotate("+c.direction+"deg)";
    return "rotate("+c.direction+"deg)"; //degreeText;
  }

  // to show the stop duration in day-hours-minute
  showStopDuration(stopDuration:number){
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
  prepareText(c:Camion){
    //find list itineraire
    let itiList= this.camionItinersFind(c.id)
    let tempText=''
    itiList.forEach(iti=>{
      //iti.datePick = new Date();
      //iti.dateDrop = new Date()
      tempText=tempText+
      '<tr>'+
        // '<td>'+iti.origin +"  -  "+ iti.destination+'</td>'+
        // '<td>'+ "<input type=date disabled value="+iti.datePick+" style='width: 17ch;'>"+" </input>"+"</td>"+ 
        // "<td>"+ "<input type=date disabled value="+iti.dateDrop+" style='width: 17ch;'>"+" </input>"+"</td>"+
        // '<td>'+(iti.longueur!=null ? iti.longueur+" ft" : '')+'</td>'+
        // '<td style="color: black; background-color:greenyellow;"></td>'+
        '<td>'+
        '<p>'+                                    
          '<strong>Pick</strong> '+ iti.origin+ '&nbsp;&nbsp;'+  
          "<input type=date disabled value="+iti.datePick+
          " style='width: 17ch; border: none; border-width: 0; box-shadow:none; background-color: transparent;'>"+
          " </input>" + '&nbsp;&nbsp;&nbsp;&nbsp;' +  (iti.longueur!=null ? iti.longueur+"'" : '') +
          
          '<br><strong>Drop</strong> '+ iti.destination +'&nbsp;&nbsp;'+ 
          "<input type=date disabled value="+iti.dateDrop+
          " style='width: 17ch; border: none; border-width: 0; box-shadow:none; background-color: transparent;'>"+
          " </input>"+                                    
        '</p>'+
        '</td>'+
      '</tr>'
    })
    let textHtnl = ''
    //obj=this.camionsSurMap;
    //obj.for
    // obj.forEach(camion=>{
    //   textHtnl=textHtnl+'<tr *ngFor="let c of camionsSurMap">'+
    //   '<td>Montreal, Quebec - Alma, Quebec</td> <td>17-06-2020</td> <td>18-06-2020</td> '+
    //   '<td>50"</td> <td style="color: black; background-color:greenyellow;">25"</td>'+
    //   '</tr>'
    // })
    //obj.forEach(iti=>{
      textHtnl=textHtnl+tempText
      if(textHtnl.length==0) textHtnl=
      '<tr>'+
      '<td>Aucun itineraire.</td>'+
      '</tr>'
      // '<tr *ngFor="let iti of camionItinersFind(c.id)">'+
      //   '<td>{{iti.origin +"  -  "+ iti.destination}}</td>'+
      //   "<td>Pick: {{iti.datePick | date: 'dd-MM-yyyy'}}</td>"+ 
      //   "<td>Drop: {{iti.dateDrop | date: 'dd-MM-yyyy'}}</td>"+
      //   '<td>Occupe: {{iti.longueur+" ft"}}</td>'+
      //   '<td style="color: black; background-color:greenyellow;">Dispo: 25 ft</td>'+
      // '</tr>'
    //})
    return textHtnl;
  }

  pickDateChange(event){
    this.itiner.datePick=event.target.value;
    // let tempString:string[] = event.target.value.toString().split('-');
    // this.itiner.yPick=tempString[0]
    // this.itiner.mPick=tempString[1]
    // this.itiner.dPick=tempString[2]
    // this.itiner.datePick=new Date();
    
    // this.itiner.datePick.setFullYear(Number(tempString[0]),Number(tempString[1])-1, Number(tempString[2]))
    this.todaySuite = this.itiner.datePick
    if(this.itiner.dateDrop<this.todaySuite) 
      {
        this.itiner.dateDrop=new Date();
        this.itiner.dateDrop=this.todaySuite
      }
    this.filterCamion();
    //console.log('event.target.value.toString(): '+ event.target.value.toString()) 
    // console.log('this.itiner.datePick.toString(): '+this.itiner.datePick.toString())
    // console.log('this.itiner.dPick: '+this.itiner.dPick)
    // console.log('this.itiner.mPick: '+this.itiner.mPick)
    // console.log('this.itiner.yPick: '+this.itiner.yPick)
    // console.log('this.itiner.dateDrop.toString(): '+this.itiner.dateDrop.toString())
  }
  dropDateChange(ev){
    this.itiner.dateDrop=ev.target.value
    // let tempString:string[] = ev.target.value.toString().split('-');
    // this.itiner.yDrop=tempString[0]
    // this.itiner.mDrop=tempString[1]
    // this.itiner.dDrop=tempString[2]
    // this.itiner.dateDrop=new Date();
    // this.itiner.dateDrop.setFullYear(Number(tempString[0]),Number(tempString[1])-1, Number(tempString[2]))
    this.filterCamion();
    //console.log('event.target.value.toString(): '+ event.target.value.toString()) 
    // console.log('this.itiner.dateDrop.toString(): '+this.itiner.dateDrop.toString())
    // console.log('this.itiner.dDrop: '+this.itiner.dDrop)
    // console.log('this.itiner.mDrop: '+this.itiner.mDrop)
    // console.log('this.itiner.yDrop: '+this.itiner.yDrop)
    // console.log('this.itiner.datePick.toString(): '+this.itiner.datePick.toString())
  }
  onChange(){
    this.map.setCenter(new google.maps.LatLng(this.camionMap.latitude, this.camionMap.longtitude));
    var c= this.camionMap;
    //this.infoWindow.close();
    this.map.setCenter(new google.maps.LatLng(c.latitude, c.longtitude));
    // this.infoWindow = new google.maps.InfoWindow;
    // var contentString:string='<div><p> '+ 'Unite '+c.unite+" <br>" +
    // '<table border="1">' +
    //     '</table>'+'<br>'
    // ' </p></div>'
    // this.infoWindow.setContent(contentString);
    // this.infoWindow.setPosition(new google.maps.LatLng(c.latitude, c.longtitude));
    // this.infoWindow.open(this.map);//*/      
  }
  
  sortItiners(itiners){
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
        // if b is father F1 of a then b (father) is always before a
        else  return 1; //(a.id-b.id);
      }
      // If a has father and b has father
      if(a.idRouteFatherF1!=null && b.idRouteFatherF1!=null){
        // if they have same father F1
        if(a.idRouteFatherF1==b.idRouteFatherF1) return (a.idRouteFather-b.idRouteFather);
        else  return (a.idRouteFatherF1-b.idRouteFatherF1);
      }
      // If a is lonely and b has father
      if(a.idRouteFatherF1==null && b.idRouteFatherF1!=null){
        // if a is father F1 of b then a (father) is always before b
        if(a.id==b.idRouteFatherF1) return -1; //(a.id-b.id);
        // if a is not father of b
        else  return (a.id-b.idRouteFatherF1);
      }
      return 0;
    }) 
    return itiners
  }
  camionItinersFind(idCamion){
    let cIsL= this.cIsLList.find(res=>res.camionId==idCamion)
    if(cIsL!=null)
    {
      // cIsL.itiners.sort((a,b)=>{
      //   // (a.id-b.id)

      //   // If a and b are lonely
      //   if(a.idRouteFatherF1==null && b.idRouteFatherF1==null){
      //     return (a.id-b.id);
      //   }
      //   // If a has father and b is lonely
      //   if(a.idRouteFatherF1!=null && b.idRouteFatherF1==null){
      //     // if b is not father F1 of a
      //     if(a.idRouteFatherF1!=b.id) return (a.idRouteFatherF1-b.id);
      //     // if b is father F1 of a
      //     else  return (a.id-b.id);
      //   }
      //   // If a has father and b has father
      //   if(a.idRouteFatherF1!=null && b.idRouteFatherF1!=null){
      //     // if they have same father F1
      //     if(a.idRouteFatherF1==b.idRouteFatherF1) return (a.idRouteFather-b.idRouteFather);
      //     else  return (a.idRouteFatherF1-b.idRouteFatherF1);
      //   }
      //   // If a is lonely and b has father
      //   if(a.idRouteFatherF1==null && b.idRouteFatherF1!=null){
      //     // if a is father F1 of b
      //     if(a.id==b.idRouteFatherF1) return (a.id-b.id);
      //     // if a is not father of b
      //     else  return (a.id-b.idRouteFatherF1);
      //   }
      //   return 0;
      // }) 
      return this.sortItiners(cIsL.itiners)
    }
    else return null
  }
  deleteRepere(r:Repere){
    this.reperesService.deleteRepere(r.id).subscribe(data=>{}, err=>console.log(err))
    this.reps.splice(this.reps.indexOf(r),1)
    // this.rep=new Repere()
  }
  deleteItiner(it:Itineraire){
    this.itinerairesService.deleteItineraire(it.id).subscribe(data=>{
      this.makeCIsLList() // make CamionItinerairesList replace for the line above
      this.onClearMap();
    }, err=>{console.log(err)})
    // this.itiners.splice(this.itiners.indexOf(it),1)
    // this.makeCIsLList()
  }
  onAjouter(){ 
    
    if(this.itiner.id==null||this.itiner.id==0){ // add new itineraire
      this.itiner.idTransporter=this.transporter.id;
      this.itinerairesService.saveItineraires(this.itiner).subscribe((data:Itineraire)=>{
        //this.itiner=data
        this.itiners.push(data) // put this itinaire to the list of transporter
        // Update this.routeSonNowTemp - route/itineraire temporary if it is not null
        if(this.routeSonNowTemp!=null){
          this.itinerairesService.saveItineraires(this.routeSonNowTemp).subscribe((data)=>{
            this.routeSonNowTemp=null // set him to null after recorded
            //this.cIsLList.find(res=>res.camionId==data.idCamion).itiners.push(data) // put this itineraire to this camion
            this.makeCIsLList() // make CamionItinerairesList replace for the line above
            this.onClearMap();
          }, err=>{console.log(err)})
        }
        else{
          //this.cIsLList.find(res=>res.camionId==data.idCamion).itiners.push(data) // put this itineraire to this camion
          this.makeCIsLList() // make CamionItinerairesList replace for the line above
          this.onClearMap();
        }
        
      }, err=>{console.log(err)})
    }
    else{ // modify one itineraire
      let tempTransport : Transport;
      this.itinerairesService.saveItineraires(this.itiner).subscribe(async (data:Itineraire)=>{
        if(this.itiner.idTransport!=null && this.itiner.idTransport>0){
          this.transportsService.getDetailTransport(this.itiner.idTransport).subscribe((tr:Transport)=>{
            tempTransport=tr;
            // set camion to transport
            if(this.itiner.idCamion!=null && this.itiner.idCamion>0 
              && this.itiner.camionAttribue!=null && this.itiner.camionAttribue.length>0)
            {
              // it means that it's schedule
              tempTransport.sent=true
            }
            else{
              // it means that it didn't schedule
              tempTransport.sent=false
            }
            tempTransport.camionAttribue = this.itiner.camionAttribue
            tempTransport.idCamion = this.itiner.idCamion
            tempTransport.imgUrl = this.itiner.imgUrl
            tempTransport.dateReserve = this.itiner.datePick
            tempTransport.timeResrvation = this.itiner.timeResrvation
            /*
            route.datePick = this.transport.dateReserve
      route.timeResrvation = this.transport.timeResrvation
            */
            // save transport just set camion
            this.transportsService.saveTransports(tempTransport).subscribe(dt=>{}, err=>{console.log(err)})
          }, err=>{console.log(err)})
          await this.sleep(1000) // wait 1 second before add camion unique to transport
        }
        // this.itiners.forEach(x=>{
        //   if(x.id==data.id) x=data
        // })
        // // this.itiners.push(data) // put this itinaire to the list of transporter
        // //this.cIsLList.find(res=>res.camionId==data.idCamion).itiners.push(data) // put this itineraire to this camion
        // this.makeCIsLList() // make CamionItinerairesList replace for the line above
        // this.onClearMap();
        if(this.routeSonNowTemp!=null){
          this.itinerairesService.saveItineraires(this.routeSonNowTemp).subscribe((data)=>{
            this.routeSonNowTemp=null // set him to null after recorded
            //this.cIsLList.find(res=>res.camionId==data.idCamion).itiners.push(data) // put this itineraire to this camion
            this.makeCIsLList() // make CamionItinerairesList replace for the line above
            this.onClearMap();
          }, err=>{console.log(err)})
        }
        else{
          //this.cIsLList.find(res=>res.camionId==data.idCamion).itiners.push(data) // put this itineraire to this camion
          this.makeCIsLList() // make CamionItinerairesList replace for the line above
          this.onClearMap();
        }
      }, err=>{console.log(err)})
    }
    
  }

  sleep(ms){
    return new Promise((resolve)=>{
      setTimeout(resolve, ms);
    })
  }

  camionTemp:Camion=new Camion(); // this is camion temporaire for list itineraires 
  findCamionById(id:number){
    //this.camionTemp=new Camion();
    //let c: Camion;
    this.camionTemp= this.camionsGPSAndNoGPS.find(x=>x.id===id)
    // this.infoWindow.close();
    // this.map.setCenter(new google.maps.LatLng(c.latitude, c.longtitude));
    // this.infoWindow = new google.maps.InfoWindow;
    // let contentString:string= (c.foreignName.length>0 ? c.foreignName : (c.unite+c.type+c.modele));
    // this.infoWindow.setContent(contentString);
    // this.infoWindow.setPosition(new google.maps.LatLng(c.latitude, c.longtitude));
    // this.infoWindow.open(this.map);//*/
    //return c;
  }
  onClickCamionId(id:number){  // for see it on the map
    let c: Camion;
    c= this.camionsSurMap.find(x=>x.id===id)
    // this.infoWindow.close();
    this.map.setCenter(new google.maps.LatLng(c.latitude, c.longtitude));
    this.map.setZoom(15)
    // this.infoWindow = new google.maps.InfoWindow;
    // let contentString:string= (c.foreignName.length>0 ? c.foreignName : (c.unite+c.type+c.modele));
    // this.infoWindow.setContent(contentString);
    // this.infoWindow.setPosition(new google.maps.LatLng(c.latitude, c.longtitude));
    // this.infoWindow.open(this.map);//*/
  }

  // name of point repere
  nameChange(){
    if(this.latLngAddress!=null){
      let label = this.markerAdsress.getLabel(); // google.maps.ReadonlyMarkerLabel
      label.color='orange'
      label.text=(this.rep.nom!=null && this.rep.nom.length>0) ? this.rep.nom : this.rep.address
      this.markerAdsress.setLabel(label)
      this.markerAdsress.setTitle(this.rep.nom)
    }
  }
  // adresse de point de repere
  latLngAddress:google.maps.LatLng =null;
  async addressChange(){
    if(this.rep.address!=null&&this.rep.address.length>2){
      this.latLngAddress=null
      let geocodingTemp = new GeocodingService()
      // await this.geocoding.codeAddress(this.rep.address).forEach(
      await geocodingTemp.codeAddress(this.rep.address).forEach(
        (results: google.maps.GeocoderResult[]) => {
          if(results[0].geometry.location.lat()>0){
            this.latLngAddress= new google.maps.LatLng(
              this.rep.originLat= results[0].geometry.location.lat(),
              this.rep.originLong= results[0].geometry.location.lng()                            
            )
          }
          else
            {
              if(localStorage.getItem('language')&&localStorage.getItem('language').includes('English'))
                alert("Can't locate this address.")
              else alert("Ne pas pouvoir localiser cette adresse.")
            }
      }).then(()=>{
        this.drawAddress();
      });
    }
    else{
      this.latLngAddress=null;
      this.drawAddress();
      this.geolocation.getCurrentPosition().subscribe(async (data)=>{
        this.map.setCenter(new google.maps.LatLng(data.coords.latitude, data.coords.longitude));
        //this.itineraire=true; // to display again all fields itineraire, just for refresh data fields
      })
    }
  }
  radiusChange(){
    this.drawAddress();
  }
  addressCircle : google.maps.Circle // = new google.maps.Circle(); 
  markerAdsress : google.maps.Marker  // =new google.maps.Marker();
  drawAddress(){
    if(this.addressCircle){
      this.addressCircle.setMap(null)
    }
    if(this.markerAdsress){
      this.markerAdsress.setMap(null)
    }
    if(this.latLngAddress!=null){
      this.addressCircle = new google.maps.Circle({
        center: new google.maps.LatLng(this.latLngAddress.lat(), this.latLngAddress.lng()),
        radius: (this.rep.radius>0 ? this.rep.radius : 100), // en metre, 1 metre par defaut
        fillColor: '#FFFF00',
        editable: false,
        draggable: false,
      });
      this.addressCircle.setMap(this.map);
      this.markerAdsress = new google.maps.Marker({
        position: this.latLngAddress,
        map: this.map,
        icon: {
          //url:"http://maps.google.com/mapfiles/kml/shapes/truck.png",
          //path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          url:"http://maps.google.com/mapfiles/ms/icons/green-dot.png",
          scale:5,
          //rotation:camion.direction,
          fillOpacity: 1,
          fillColor: "#7FFF00", //"#FFFFFF"
          strokeWeight: 2,
          strokeColor: "#008088", //"#FFFFFF",//"red",
        },
        title: ((this.rep.nom!=null && this.rep.nom.length>0) ? this.rep.nom : this.rep.address),
        label: {text:((this.rep.nom!=null && this.rep.nom.length>0) ? this.rep.nom : this.rep.address), color:"orange"},
      });
      //marker.setMap(this.map)
      this.map.setCenter(new google.maps.LatLng(this.latLngAddress.lat(), this.latLngAddress.lng()));
      this.map.setZoom(15) // Zoom actuel : 15  - Level 1->20 de petit a plus grand
    }
    
  }
  onDrawAddressPrecise(r:Repere){
    if(this.flightPath){
      this.flightPath.setMap(null)
    }
    if(this.originCircle){
      this.originCircle.setMap(null)
    }
    if(this.destCircle1){
      this.destCircle1.setMap(null)
    }
    if(this.addressCircle){
      this.addressCircle.setMap(null)
    }
    if(this.markerAdsress){
      this.markerAdsress.setMap(null)
    }
    //if(this.latLngAddress!=null){
      this.latLngAddress=new google.maps.LatLng(r.originLat, r.originLong)
      this.addressCircle = new google.maps.Circle({
        center: new google.maps.LatLng(r.originLat, r.originLong),
        radius: (r.radius>0 ? r.radius : 100), // en metre, 1 metre par defaut
        fillColor: '#FFFF00',
        editable: false,
        draggable: false,
      });
      this.addressCircle.setMap(this.map);
      this.markerAdsress = new google.maps.Marker({
        position: this.latLngAddress,
        map: this.map,
        icon: {
          //url:"http://maps.google.com/mapfiles/kml/shapes/truck.png",
          //path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          url:"http://maps.google.com/mapfiles/ms/icons/green-dot.png",
          scale:5,
          //rotation:camion.direction,
          fillOpacity: 1,
          fillColor: "#7FFF00", //"#FFFFFF"
          strokeWeight: 2,
          strokeColor: "#008088", //"#FFFFFF",//"red",
        },
        title: ((r.nom!=null && r.nom.length>0) ? r.nom : ''),// r.nom,
        label: {text:((r.nom!=null && r.nom.length>0) ? r.nom : ''), color:"orange"},
      });
      //marker.setMap(this.map)
      this.map.setCenter(this.latLngAddress)// new google.maps.LatLng(this.latLngAddress.lat(), this.latLngAddress.lng()));
      this.map.setZoom(15) // Zoom actuel : 15  - Level 1->20 de petit a plus grand
    //}
    
  }
  onFocusAddress(){
    if(this.latLngAddress!=null){
      this.map.setCenter(new google.maps.LatLng(this.latLngAddress.lat(), this.latLngAddress.lng()));
      this.map.setZoom(15);
    }
  }
  onAjouterRepere(){
    this.rep.idTransporter=this.transporter.id;
    this.reperesService.saveReperes(this.rep).subscribe((data:Repere)=>{
      this.reps.push(data)
      this.rep=new Repere()
    }, err=>{console.log(err)})
    // let rep=this.rep
    // this.reps.push(rep)
    // this.rep=new Repere()
    if(this.addressCircle){
      this.addressCircle.setMap(null)
    }
    if(this.markerAdsress){
      this.markerAdsress.setMap(null)
    }
    this.geolocation.getCurrentPosition().subscribe(async (data)=>{
      this.map.setCenter(new google.maps.LatLng(data.coords.latitude, data.coords.longitude));
    })
  }
  
  onClearMap(){
    //this.itineraire=false; // to hide all fields itineraire
    this.itiner = new Itineraire();
    this.rep = new Repere();
    this.today=this.todaySuite=new Date();
    // this.itiner.datePick.setFullYear(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    // this.itiner.dateDrop.setFullYear(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    // this.itiner.datePick=this.itiner.dateDrop

    // this.infoWindow.close();
    this.map.setZoom(9)
    
    if(this.addressCircle){
      this.addressCircle.setMap(null)
    }
    if(this.markerAdsress){
      this.markerAdsress.setMap(null)
    }

    this.itiner.longueur=null; 
    this.itiner.origin=''; 
    this.originChange();                     
    this.itiner.destination=''; 
    this.destinationChange();

    this.geolocation.getCurrentPosition().subscribe(async (data)=>{
      this.map.setCenter(new google.maps.LatLng(data.coords.latitude, data.coords.longitude));
      //this.itineraire=true; // to display again all fields itineraire, just for refresh data fields
    })

    //get list itineraires and then sort ithem
    // this.itinerairesService.itinerairesDeTransporter(this.transporter.id).subscribe((data:Array<Itineraire>)=>{
    this.itinerairesService.itinerairesLegerDeTransporter(this.transporter.id).subscribe((data:Array<Itineraire>)=>{
      if(data!=null) {
        this.itiners=data.filter(x=>(x.fini==false&&x.cancelled==false)).sort(
          (a,b)=>(a.id-b.id)).sort(
            (a,b)=>(new Date(a.datePick).getTime()-new Date(b.datePick).getTime())) // id asc - datePick asc
        this.itiners=this.sortItiners(this.itiners)
        this.itinersFinis=data.filter(x=>(x.fini==true&&x.archive==false)).sort(
          (b,a)=>(a.id-b.id)).sort(
            (b,a)=>(new Date(a.dateDrop).getTime()-new Date(b.dateDrop).getTime())) // id desc - dateDrop desc
        this.itinersArchives=data.filter(x=>(x.fini==true&&x.archive==true)).sort(
          (b,a)=>(a.id-b.id)).sort(
            (b,a)=>(new Date(a.dateDrop).getTime()-new Date(b.dateDrop).getTime())) // id desc - dateDrop desc
        this.itinersCancels=data.filter(x=>x.cancelled==true).sort(
          (b,a)=>(a.id-b.id))          
      }
    },err=>{console.log(err)})
    //get list reperes
    this.reperesService.reperesTransporter(this.transporter.id).subscribe((data:Array<Repere>)=>{
      if(data!=null) this.reps=data
    }, err=>{console.log(err)})
    //this.getLocalisation()
    
  }

  // latLngOrigin= new google.maps.LatLng(0,0);   //:any
  latLngOrigin:google.maps.LatLng =null;
  originFound=false;
  async originChange(){
    this.originFound=false;
    if(this.itiner.origin.length>4){ // address has at least 5 character
      this.latLngOrigin=null
      let geocodingTemp = new GeocodingService()
      // await this.geocoding.codeAddress(this.itiner.origin).forEach(
    await geocodingTemp.codeAddress(this.itiner.origin).forEach(
      (results: google.maps.GeocoderResult[]) => {
        if(results[0].geometry.location.lat()>0){
          this.originFound=true;
          this.latLngOrigin= new google.maps.LatLng(
            this.itiner.originLat= results[0].geometry.location.lat(),
            this.itiner.originLong= results[0].geometry.location.lng()                            
          )
          //this.drawOrigin();
          //if(this.latLngDestination!=null) this.drawDest()
          this.filterCamion();
        }
        else
          {
            // this.latLngOrigin=null;
            //this.latLngOrigin = new google.maps.LatLng(0,0);
            this.flightPath = new google.maps.Polyline(null)  //null;
            //this.drawOrigin()
            //this.drawflightPlan()
            //alert("Ne pas pouvoir localiser de cette endroit.")
          }
    }).then(()=>{
      this.drawOrigin();
      if(this.latLngDestination!=null) this.drawDest()
    });//*/
    // await this.drawOrigin();
    // if(this.latLngDestination!=null) await this.drawDest()
    }
    else {
      this.latLngOrigin=null
      //this.flightPath = new google.maps.Polyline(null)  //null; //alert("Ne pas pouvoir localiser de cette endroit.")
      if(this.flightPath){
        this.flightPath.setMap(null)
      }
      this.drawOrigin();
      //if(this.latLngDestination!=null) this.drawDest()
    }
    
  }
  
  // latLngDestination:any
  latLngDestination:google.maps.LatLng =null;
  destFound=false;
  async destinationChange(){
    this.destFound=false;
    if(this.itiner.destination.length>4){ // address has at least 5 character
      this.latLngDestination=null
    //if(this.latLngOrigin!=null)
      let geocodingTemp = new GeocodingService()
      // await this.geocoding.codeAddress(this.itiner.destination).forEach(
      await geocodingTemp.codeAddress(this.itiner.destination).forEach(
        (results: google.maps.GeocoderResult[]) => {
          if(results[0].geometry.location.lat()>0){
            this.destFound=true;
            this.latLngDestination= new google.maps.LatLng(
              this.itiner.destLat= results[0].geometry.location.lat(),
              this.itiner.destLong= results[0].geometry.location.lng()                            
            )
            //this.drawDest();
            this.filterCamion();
          }
          else
          {
            //this.latLngDestination= new google.maps.LatLng(0,0);
            this.flightPath = new google.maps.Polyline(null)  //null;this.flightPath=null;
            //this.drawDest();
            //alert("Ne pas pouvoir localiser cette endroit.")
          }
      }).then(()=>{
        this.drawDest();
      });//*/
    // else 
    //   alert("Ne pas pouvoir localiser d'Endroit Pick.")
    // await this.drawDest();
    }
    else {
      this.latLngDestination=null
      //this.flightPath = new google.maps.Polyline(null)  //null; this.flightPath=null; //alert("Ne pas pouvoir localiser de cette endroit.")
      if(this.flightPath){
        this.flightPath.setMap(null)
      }
      this.drawDest();
    }
    
  }
  onFocusOrigin(){
    // this.latLngOrigin=new google.maps.LatLng(it.originLat, it.originLong)
    if(this.itiner!=null && this.itiner.originLat!=0.00){
      this.map.setCenter(new google.maps.LatLng(this.itiner.originLat, this.itiner.originLong));
      //alert('this.map.zoom: '+ this.map.getZoom())
      this.map.setZoom(9) // Zoom actuel : 15  - Level 1->20 de petit a plus grand
    }
  }

  onFocusDestination(){
    // this.latLngDestination=new google.maps.LatLng(it.destLat, it.destLong)
    if(this.itiner!=null && this.itiner.destLat!=0.00){
      this.map.setCenter(new google.maps.LatLng(this.itiner.destLat, this.itiner.destLong));
      //alert('this.map.zoom: '+ this.map.getZoom())
      this.map.setZoom(9) // Zoom actuel : 15  - Level 1->20 de petit a plus grand
    }
  }
  

  originCircle : google.maps.Circle //= new google.maps.Circle(); 
  destCircle1 :google.maps.Circle // = new google.maps.Circle(); 
  flightPath : google.maps.Polyline //= new google.maps.Polyline();
  flightPlanCoordinates:any;
  drawOrigin(){
    if(this.flightPath){
      this.flightPath.setMap(null)
    }
    if(this.originCircle){
      this.originCircle.setMap(null)
    }
    if(this.latLngOrigin!=null){
      this.originCircle = new google.maps.Circle({
        center: new google.maps.LatLng(this.latLngOrigin.lat(), this.latLngOrigin.lng()),
        radius: 10000, // par default 10 kms --------  this.mileEnKm(this.voyage.radiusOrigin)*1000,  // en metre
        fillColor: '#FFFF00',
        editable: false,
        draggable: false,
      });
      this.originCircle.setMap(this.map);
      this.map.setCenter(new google.maps.LatLng(this.latLngOrigin.lat(), this.latLngOrigin.lng()));

      if(this.latLngDestination!=null){
        this.flightPlanCoordinates = [
          {lat: this.latLngOrigin.lat(), lng: this.latLngOrigin.lng()},
          {lat: this.latLngDestination.lat(), lng: this.latLngDestination.lng()}
        ];
        this.flightPath = new google.maps.Polyline({
          path: this.flightPlanCoordinates,
          geodesic: true,
          strokeColor: 'Gray',
          strokeOpacity: 0.5,
          strokeWeight: 5,
          icons: [{
            icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW},
            offset: '100%'
          }]
        });
        this.flightPath.setMap(this.map);
      }

      this.map.setZoom(9) // Zoom actuel : 15  - Level 1->20 de petit a plus grand
      // this.originCircle.addListener('click', (event)=>{
      //   var contentString:string='Origin : '+ this.voyage.origin + '  -  Rayon : ' + this.voyage.radiusOrigin + ' miles.';
      //   // Replace the info window's content and position.
      //   this.infoWindow.setContent(contentString);
      //   this.infoWindow.setPosition(event.latLng);
      //   this.infoWindow.open(this.map);
      // })
    }
    
  }
  drawDest(){
    if(this.destCircle1){
      this.destCircle1.setMap(null)
    }
    if(this.flightPath){
      this.flightPath.setMap(null)
    }
    if(this.latLngDestination!=null){
      this.destCircle1 = new google.maps.Circle({
        center: new google.maps.LatLng(this.latLngDestination.lat(), this.latLngDestination.lng()),
        radius: 10000, // par default 10 kms --------this.mileEnKm(this.voyage.radiusDestination)*1000, // en metre
        fillColor: '#FF00FF',
        editable: false,
        draggable: false,
      })
      this.destCircle1.setMap(this.map);
      // this.destCircle1.addListener('click', (event)=>{
      //   var contentString:string='Destination : '+ this.voyage.destination + '  -  Rayon : ' + this.voyage.radiusDestination + ' miles.';
      //   // Replace the info window's content and position.
      //   this.infoWindow.setContent(contentString);
      //   this.infoWindow.setPosition(event.latLng);
      //   this.infoWindow.open(this.map);
      // })
      if(this.latLngOrigin!=null){
        this.flightPlanCoordinates = [
          {lat: this.latLngOrigin.lat(), lng: this.latLngOrigin.lng()},
          {lat: this.latLngDestination.lat(), lng: this.latLngDestination.lng()}
        ];
        this.flightPath = new google.maps.Polyline({
          path: this.flightPlanCoordinates,
          geodesic: true,
          strokeColor: 'Gray',
          strokeOpacity: 0.5,
          strokeWeight: 5,
          icons: [{
            icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW},
            offset: '100%'
          }]
        });
        this.flightPath.setMap(this.map);
      }
      
      this.map.setZoom(9) // Zoom actuel : 15  - Level 1->20 de petit a plus grand
    }
    
  }
  
  drawflightPlan(){
    if(this.flightPath){
      this.flightPath.setMap(null)
    }
    // this.destCircle1 = new google.maps.Circle({
    //   center: new google.maps.LatLng(this.latLngDestination.lat(), this.latLngDestination.lng()),
    //   radius: 10000, // par default 10 kms --------this.mileEnKm(this.voyage.radiusDestination)*1000, // en metre
    //   fillColor: '#FF00FF',
    //   editable: false,
    //   draggable: false,
    // })
    // this.destCircle1.setMap(this.map);
    // this.destCircle1.addListener('click', (event)=>{
    //   var contentString:string='Destination : '+ this.voyage.destination + '  -  Rayon : ' + this.voyage.radiusDestination + ' miles.';
    //   // Replace the info window's content and position.
    //   this.infoWindow.setContent(contentString);
    //   this.infoWindow.setPosition(event.latLng);
    //   this.infoWindow.open(this.map);
    // })
    var flightPlanCoordinates = [
      {lat: this.latLngOrigin.lat(), lng: this.latLngOrigin.lng()},
      {lat: this.latLngDestination.lat(), lng: this.latLngDestination.lng()}
    ];
    this.flightPath = new google.maps.Polyline({
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
    this.flightPath.setMap(this.map);
  }
  onModifyRepere(r:Repere){
    this.rep=r;
    this.latLngAddress=new google.maps.LatLng(r.originLat, r.originLong)
    this.drawAddress();
  }
  onModify(it:Itineraire){
    if(this.itineraire==true){
      // get this itiner with all infos (it's means with image)
      this.itinerairesService.getDetailItineraire(it.id).subscribe((data:Itineraire)=>{
        // this.itiner=it;
        this.itiner=data;
        this.originFound = this.destFound = true;
        this.gotoAnchorID('truck'); // goto the table of detail Itineraire
        this.filterCamion();
      })
    }
    this.latLngOrigin=new google.maps.LatLng(it.originLat, it.originLong)
    this.latLngDestination=new google.maps.LatLng(it.destLat, it.destLong)
    this.drawOrigin();
    this.drawDest();
    //this.onClearMap()
  }

  onGoingToItineraire(it:Itineraire){
    this.latLngOrigin=new google.maps.LatLng(it.originLat, it.originLong)
    this.latLngDestination=new google.maps.LatLng(it.destLat, it.destLong)
    this.drawOrigin();
    this.drawDest();
  }

  async itinerFini(it: Itineraire){
    it.fini=true;
    let tempTransport: Transport
    if(it.idTransport!=null && it.idTransport>0){
      this.transportsService.getDetailTransport(it.idTransport).subscribe((tr:Transport)=>{
        tempTransport=tr;
        // set camion to transport
        tempTransport.fini = it.fini
        // save transport just set camion
        this.transportsService.saveTransports(tempTransport).subscribe(dt=>{}, err=>{console.log(err)})
      }, err=>{console.log(err)})
      await this.sleep(1000) // wait 1 second before add camion unique to transport
    }
    this.itinerairesService.saveItineraires(it).subscribe((data:Itineraire)=>{
      this.itinersFinis.push(it)
      this.itiners.splice(this.itiners.indexOf(it))
      this.makeCIsLList()
      this.onClearMap()
    },err=>{console.log(err)})
    // this.onClearMap()
  }

  itinerArchive(it: Itineraire){
    it.archive=true;
    this.itinerairesService.saveItineraires(it).subscribe((data:Itineraire)=>{
      this.itinersArchives.push(it)
      this.itinersFinis.splice(this.itinersFinis.indexOf(it))
    },err=>{console.log(err)})
  }

  async itinerCancel(it: Itineraire){
    it.cancelled=true;
    let tempTransport: Transport
    if(it.idTransport!=null && it.idTransport>0){
      this.transportsService.getDetailTransport(it.idTransport).subscribe((tr:Transport)=>{
        tempTransport=tr;
        // set camion to transport
        // tempTransport.fini = it.fini
        tempTransport.driverNote ="!!Cancelled!!"; //.includes("!!Cancelled!!")
        // save transport just set camion
        this.transportsService.saveTransports(tempTransport).subscribe(dt=>{}, err=>{console.log(err)})
      }, err=>{console.log(err)})
      await this.sleep(1000) // wait 1 second before add camion unique to transport
    }
    this.itinerairesService.saveItineraires(it).subscribe((data:Itineraire)=>{
      this.itinersCancels.push(it)
      this.itiners.splice(this.itiners.indexOf(it))
      this.makeCIsLList()
      this.onClearMap()
    },err=>{console.log(err)})
    // this.onClearMap()
  }

  itinerResumes(it: Itineraire){
    it.cancelled=false;
    this.itinerairesService.saveItineraires(it).subscribe((data:Itineraire)=>{
      this.itiners.push(it)
      this.itinersCancels.splice(this.itinersCancels.indexOf(it))
      this.makeCIsLList();
      this.onClearMap()
    },err=>{console.log(err)})
    // this.onClearMap()
  }

  onSelectCamion(c:Camion){
    this.itiner.idCamion=c.id
    this.itiner.camionAttribue= (c.foreignName!=null && c.foreignName.length>0) ? c.foreignName : (c.unite + ' - ' + c.marque +'  ' +c.modele)//(c.unite + ' - ' + c.marque +'  ' +c.modele);
    let trailer=this.remorques.find(x=>(x.id==c.idCarrier))
    if(trailer!=null){
      this.itiner.dispoReste = trailer.longueur+trailer.longueurTop-this.itiner.longueur
      // console.log("this.itiner.dispoReste by trailer: " + this.itiner.dispoReste + " ft")
    }
    else{
      this.itiner.dispoReste = c.longueur+c.longueurTop-this.itiner.longueur
      // console.log("this.itiner.dispoReste by camion self: " + this.itiner.dispoReste + " ft")
    }
    if(this.itiner.dispoReste<0){this.itiner.dispoReste=null;}
    // this.gotoTop();
    this.gotoAnchorID('truck');
    // this.infoWindow.close();
    // this.map.setCenter(new google.maps.LatLng(c.latitude, c.longtitude));
    // this.infoWindow = new google.maps.InfoWindow;
    
    // let contentString:string= (c.foreignName.length>0 ? c.foreignName : (c.unite+c.type+c.modele));
    // //let contentString:string= ('Unite '+c.unite+' - '+'A: '+ (c.localName.length>0 ? c.localName : c.location));//'unite : '+ camion.unite + '  -  Vitesse : ' + camion.speed;
    // this.infoWindow.setContent(contentString);
    // this.infoWindow.setPosition(new google.maps.LatLng(c.latitude, c.longtitude));
    // this.infoWindow.open(this.map);//*/
  }

  calculeDispoReste(){
    if(this.itiner.idCamion>0){
      let camion=this.camions.find(x=>(x.id==this.itiner.idCamion))
      let trailer=this.remorques.find(x=>(x.id==camion.idCarrier))
      if(trailer!=null){
        this.itiner.dispoReste = trailer.longueur+trailer.longueurTop-this.itiner.longueur
      }
      else{
        this.itiner.dispoReste = camion.longueur+camion.longueurTop-this.itiner.longueur
      }
      if(this.itiner.dispoReste<0){this.itiner.dispoReste=null;}
    }
  }

  cIsLList: Array<CamionItinersList>=new Array<CamionItinersList>();
  makeCIsLList(){
    this.cIsLList=new Array<CamionItinersList>();
    let cIsL : CamionItinersList;
    this.camionsSurMap.forEach(c=>{
      cIsL= new CamionItinersList();
      cIsL.camionId=c.id
      cIsL.itiners= this.camionItiners(c.id)
      this.cIsLList.push(cIsL)
    })
    this.camionsNoGPS.forEach(c=>{
      cIsL= new CamionItinersList();
      cIsL.camionId=c.id
      cIsL.itiners= this.camionItiners(c.id)
      this.cIsLList.push(cIsL)
    })
    // let test :CamionItinersList;
    // test = this.cIsLList.find(res=>res.camionId==108)
    // console.log("this.cIsLList.length: "+ ' - ' +this.cIsLList.length + ' - '+ test.camionId.toString())
  }
  camionItiners(id:number){
    let cIs:Array<Itineraire>=[]
    if(this.itiners.length>0){
      //alert("Hi from camionItiners(): " + id)
      this.itiners.forEach(it=>{
       if(it.idCamion==id) cIs.push(it)
      })
      //alert("Hi from camionItiners() - nombre itiners: " + cIs.length)
      //return cIs
    }
    return cIs
  }
  
  //this is to check whe we need compare between 2 functions calculate the distance
  calculateDistanceWithGoogle(point1:google.maps.LatLng, point2:google.maps.LatLng) { // must pass by Google Maps
    return Math.round(google.maps.geometry.spherical.computeDistanceBetween(point1, point2));
    // this.distance = Math.round(google.maps.geometry.spherical.computeDistanceBetween(point1, point2)/1000/1.609344) ;
    // this.distanceKm = Math.round(this.distance*1.609344)
  }

  calculateDistance( lat1, lng1, lat2, lng2) { // don't need pass by Google Map
    let dLat = this.toRadians(lat2 - lat1);
    let dLon = this.toRadians(lng2 - lng1);
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
            + Math.cos(this.toRadians(lat1))
            * Math.cos(this.toRadians(lat2)) * Math.sin(dLon / 2)
            * Math.sin(dLon / 2);
    let c = 2 * Math.asin(Math.sqrt(a));
    let distanceInMeters = Math.round(6371000 * c);
    //console.log('distanceInMeters: '+distanceInMeters)
    return distanceInMeters;
  }
  toRadians (angle) {
    return angle * (Math.PI / 180);
  }
  
  // return name repere if has
  belongingRepere(c:Camion){
    this.reps.forEach(r=>{
      if(r.radius>=this.calculateDistance(c.latitude, c.longtitude, r.originLat, r.originLong))
        {
          //console.log(c.unite +" -appartient- "+ r.nom)
          c.localName=r.nom
          //return r.nom;
        }
    })
    //return c.location;
  }

  itinersTemp: Array<Itineraire> = [];
  idCamionsFiltre=[]; // idCamions trouves correspondent parfaitment
  idCamionsItinersFar=[]; // idCamions avec endroit drop loin
  idCamionsItinersPasDerange=[]; //  idCamions avec itineraires mais sera libre
  camionsFiltre:Array<Camion>=[]; // camions correspondent parfaitment
  camionsItinersFar:Array<Camion>=[]; // camions avec endroit drop loin
  camionsFree:Array<Camion>=[]; // camions libres
  camionsFreeClose:Array<Camion>=[]; // camions libres et a cote
  camionsFreeFar:Array<Camion>=[]; // camions libres mais loins
  //filtre camions selon itinearie
  filterCamion(){
    if(this.originFound && this.destFound){
      //var itinersTemp: Array<Itineraire> = [];
      // this.itinersTemp= this.itiners;
      // this.itinerairesService.itinerairesDeTransporter(this.transporter.id).subscribe((data:Array<Itineraire>)=>{
      this.itinerairesService.itinerairesLegerDeTransporter(this.transporter.id).subscribe((data:Array<Itineraire>)=>{
        if(data!=null) {
          this.itinersTemp=data.filter(x=>(!x.cancelled&&!x.fini))
          //let itinersFitre:Array<Itineraire>=[];
          // get radius search - by defaut 50km - 50000m
          let radius = (this.itiner.radiusSearch>0?(this.itiner.radiusSearch*1000):50000)
          this.itiner.radiusSearch=radius/1000
          
          this.idCamionsFiltre=[];
          this.idCamionsItinersFar=[]; // idCamions avec endroit drop loin
          this.idCamionsItinersPasDerange=[]; //  idCamions avec itineraires mais sera libre
          this.camionsFiltre=[]
          this.camionsItinersFar=[]
          this.camionsFree=[];
          this.camionsFreeClose=[];
          this.camionsFreeFar=[];
          
          // console.log('itinersTemp.length begining: '+this.itinersTemp.length)
          // console.log('this.itiners.length begining: '+this.itiners.length)
          
          this.itinersTemp.forEach(iti=>{
            // console.log('this.itiner.datePick.getTime(): '+new Date(this.itiner.datePick).getTime())
            // console.log('iti.dateDrop.getTime(): '+new Date(iti.dateDrop).getTime())
            if(
              this.calculateDistance(iti.destLat, iti.destLong, this.itiner.originLat, this.itiner.originLong)<=radius &&
              (new Date(this.itiner.datePick).getTime() - new Date(iti.dateDrop).getTime())>=0 &&
              (new Date(this.itiner.datePick).getTime() - new Date(iti.dateDrop).getTime())<=(24*60*60*1000) // 86400000
            ){
              if(!this.idCamionsFiltre.includes(iti.idCamion))
                {
                  // console.log('iti.idCamion - match: '+iti.idCamion)
                  this.idCamionsFiltre.push(iti.idCamion) // to find truck match
                  //itinersTemp=
                  this.itinersTemp.splice(this.itinersTemp.indexOf(iti),1)
                }
            }
          })
          // console.log('itinersTemp.length after match: '+this.itinersTemp.length)
          // console.log('this.itiners.length after match: '+this.itiners.length)
          this.itinersTemp.forEach(iti=>{
            if(
              (this.calculateDistance(iti.destLat, iti.destLong, this.itiner.originLat, this.itiner.originLong)>radius &&
              (new Date(this.itiner.datePick).getTime() - new Date(iti.dateDrop).getTime())>=0 &&
              (new Date(this.itiner.datePick).getTime() - new Date(iti.dateDrop).getTime())<=(24*60*60*1000)) // 86400000
              ||
              (new Date(this.itiner.datePick).getTime()<new Date(iti.dateDrop).getTime() && new Date(iti.dateDrop).getTime()<new Date(this.itiner.dateDrop).getTime())
              ||
              (new Date(this.itiner.datePick).getTime()<new Date(iti.dateDrop).getTime() && new Date(iti.datePick).getTime()<new Date(this.itiner.dateDrop).getTime())
              ||
              (new Date(this.itiner.datePick).getTime()>new Date(iti.datePick).getTime() && new Date(iti.dateDrop).getTime()>new Date(this.itiner.dateDrop).getTime())
            ){
              if(!this.idCamionsItinersFar.includes(iti.idCamion))
                  {
                    // console.log('iti.idCamion - busy: '+iti.idCamion)
                    this.idCamionsItinersFar.push(iti.idCamion)  // to find truck busy
                    //itinersTemp=
                    this.itinersTemp.splice(this.itinersTemp.indexOf(iti), 1)
                  }
            }
          })
          // console.log('itinersTemp.length after busy: '+this.itinersTemp.length)
          // console.log('this.itiners.length after busy: '+this.itiners.length)
          /*//
          await itinersTemp.forEach(iti=>{  
            if(
                (new Date(iti.datePick).getTime() - new Date(this.itiner.datePick).getTime())<=0 &&
                (new Date(iti.dateDrop).getTime() - new Date(this.itiner.datePick).getTime())>=0
              ){
                  if(!this.idCamionsItinersPasDerange.includes(iti.idCamion))
                  {
                    this.idCamionsItinersPasDerange.push(iti.idCamion)  // to find truck will be free
                  }
              }
            // else
            //   {
            //     //this.idCamionsItinersFar
            //     if(!this.idCamionsItinersFar.includes(iti.idCamion))
            //     {
            //       this.idCamionsItinersFar.push(iti.idCamion)
            //     }
            //   }
          })
          //*/
          // this.idCamionsFiltre.forEach(id=>{
          //   //if(rq.fini) this.listRqsFini.push(rq)
          //   let c = this.camionsSurMap.find(camion=>{camion.id==id})
          //   if(c!=null){
          //     console.log('unite: '+c.unite) 
          //     this.camionsFiltre.push(c)
          //   }
          // })
          this.camionsSurMap.forEach(c=>{
            if(this.idCamionsFiltre.includes(c.id))
              this.camionsFiltre.push(c);
            else if(this.idCamionsItinersFar.includes(c.id))
              this.camionsItinersFar.push(c)
            
            else if(this.idCamionsItinersPasDerange.includes(c.id))
              this.camionsFree.push(c)
            else
              this.camionsFree.push(c)
          })
          this.camionsFree.forEach(c=>{
            if(
                //iti.dateDrop==it.datePick &&
                this.calculateDistance(c.latitude, c.longtitude, this.itiner.originLat, this.itiner.originLong)<radius
              ){
                //console.log('CamionFree Unite: '+c.unite) 
                this.camionsFreeClose.push(c)
              }
              else 
                this.camionsFreeFar.push(c)
          })
          //console.log('itinersFitre.length: '+itinersFitre.length)
          // console.log('idCamionsFiltre.length: '+this.idCamionsFiltre.length)
          // console.log('idCamionsFiltre: '+this.idCamionsFiltre.toString())

          // console.log('camionsFiltre.length: '+this.camionsFiltre.length)
          // console.log('camionsItinersFar.length: '+this.camionsItinersFar.length)
          // console.log('camionsFreeClose.length: '+this.camionsFreeClose.length)
          // console.log('camionsFreeFar.length: '+this.camionsFreeFar.length)
        }
      },err=>{console.log(err)})
      
    }
    
    //return this.camionsSurMap; //camionsFiltre
  }

  showDateLocal(d:Date){
    d=new Date(d);
    let dateLocal= new Date(d.getTime() + (new Date().getTimezoneOffset()*60000))
    return dateLocal;
  }
  onFileUpLoadRoute(event){
    let selectedFile : File=event.target.files[0];
    if(selectedFile){
      const reader = new FileReader();
      reader.onload = ()=>{this.itiner.imgUrl=reader.result.toString();}
      reader.readAsDataURL(selectedFile)
    }
    else this.itiner.imgUrl='';
  }

  onFileUpLoad(event){
    let selectedFile : File=event.target.files[0];
    if(selectedFile){
      const reader = new FileReader();
      reader.onload = ()=>{this.camion.imgUrl=reader.result.toString();}
      reader.readAsDataURL(selectedFile)
    }
    else this.camion.imgUrl='';
  }

  onFileUpLoadNewUnite(event){
    let selectedFile : File=event.target.files[0];
    if(selectedFile){
      const reader = new FileReader();
      reader.onload = ()=>{this.addcamion.imgUrl=reader.result.toString();}
      reader.readAsDataURL(selectedFile)
    }
    else this.addcamion.imgUrl='';
  }

  public gotoAnchorID(elementId: string): void { 
      this.viewportScroller.scrollToAnchor(elementId);
  }

  camionBeforeChange:Camion=new Camion(); // to keep the origin camion before change some thing
  idCarrierBeforeChange:number;// to help keep the idCarrier or this.camion
  idTemp: number; // to help keep the idCarrier of trailer
  onClickCamion(c:Camion){ // for see the detail of Camion
    //
    this.detailCamionWindown=false;
    this.camionsSurMap=[];// to empty this list
    this.camionsNoGPS=[];// to empty this list
    this.camionsGPSAndNoGPS=[];// to empty this list
    this.remorques=[];// to empty this list
    this.camionsOutService=[];

    this._camionsSurMap=[];// to empty this list
    this._camionsNoGPS=[];// to empty this list
    this._camionsGPSAndNoGPS=[];// to empty this list
    this._remorques=[];// to empty this list
    this._camionsOutService=[];
    this.camionsService.camionsDeTransporter(this.transporter.id).subscribe((data:Array<Camion>)=>{
      // check number of trucks follow plan pay
      if(data.length>this.transporter.trucks){
        // console.log('camions before splice : ' +data.length)
        data.sort((a,b)=>{
          if(a.id>b.id)
            return 1;
          if(a.id<b.id)
            return -1;
          return 0;
        });
        // remove number trucks excess number trucks of transporter
        data.splice(this.transporter.trucks, (data.length-this.transporter.trucks))
        // console.log('camions after splice : ' +data.length)
      }
      //
      this._camions=this.camions=data.sort((a,b)=>Number(a.unite)-Number(b.unite));
      this.listNumberUnite=[] ;// empty the list number unite 
      data.forEach(camion=>{
        this.listNumberUnite.push(camion.unite)
        // this is find all trucks actuals
        if(camion.status){ 
          // find all unites outService temporary
          if(camion.outService){ 
            this.camionsOutService.push(camion)
            this._camionsOutService.push(camion)
          }
          // the rest is all unite in service normally
          else{ 
            // find trailers / remorques
            if(camion.trailer) 
            {
              this.remorques.push(camion)

              this._remorques.push(camion)
            }
            // find all trucks
            else{
              // find trucks with gps
              // if(camion.gps)
              if(camion.gps || (camion.idTerminal!=null && camion.idTerminal>0))
              {
                this.camionsSurMap.push(camion)
                this.camionsGPSAndNoGPS.push(camion)

                this._camionsSurMap.push(camion)
                this._camionsGPSAndNoGPS.push(camion)
              }
              // find trucks without gps
              // if(!camion.gps)
              if(!camion.gps && (camion.idTerminal==null || camion.idTerminal<=0))
              {
                this.camionsNoGPS.push(camion)
                this.camionsGPSAndNoGPS.push(camion)

                this._camionsNoGPS.push(camion)
                this._camionsGPSAndNoGPS.push(camion)
              }
            }                
          }
        }
        else{
          // this is the list for antecedent trucks
          // perhelp for futur we us it
        }
        /* begin find trucks - old method
        if(camion.outService){ // find all unites outService te,porary
          this.camionsOutService.push(camion)

          this._camionsOutService.push(camion)
        }
        else{ // the rest is all unite in service normally
          if(camion.status && (camion.uniteMonitor!=null && camion.monitor!=null) && (camion.uniteMonitor.length!=0 && 
            camion.monitor.length!=0))// && (!camion.uniteMonitor.includes('no-gps'))) // !camion.uniteMonitor.includes('no-gps') - means : there isn't GPS
          {
            if(!camion.uniteMonitor.includes('no-gps'))
            {
              this.camionsSurMap.push(camion)
              this.camionsGPSAndNoGPS.push(camion)

              this._camionsSurMap.push(camion)
              this._camionsGPSAndNoGPS.push(camion)
            }
            else 
              // if(camion.status && (camion.uniteMonitor!=null && camion.monitor!=null) && (camion.uniteMonitor.length!=0 && 
              // camion.monitor.length!=0) && (camion.uniteMonitor.includes('no-gps'))) // !camion.uniteMonitor.includes('no-gps') - means : there isn't GPS
            {
              this.camionsNoGPS.push(camion)
              this.camionsGPSAndNoGPS.push(camion)

              this._camionsNoGPS.push(camion)
              this._camionsGPSAndNoGPS.push(camion)
            }
          }
          else 
            if(camion.status) 
              {
                this.remorques.push(camion)  // Camions in service without GPS are trailers

                this._remorques.push(camion)
              }

        }
        // end find trucks - old method //*/
      })
      //
      this.camionBeforeChange=c;  // to keep the origin camion before change some thing
    // this.camion=c;
    this.camion=this.camions.find(x=>(x.id==c.id))
    this.idTemp=null;
    if(c.idCarrier!=null&&c.idCarrier>0) {
      this.idCarrierBeforeChange=c.idCarrier
      //this.idTemp=c.id; //the idCarrier of trailer
    }
    this.detailCamionWindown=true;// to change the view map to view detail camion
    this.detailCamion=true;// to change the view map to view detail camion
    // this.gotoTop();
    this.gotoAnchorID('dtc');
    //console.log('this.camion.idCarrier (dans onclickcamion()): '+this.camion.idCarrier)
    // if(this.camion.idCarrier!=undefined){
      this.camionCarrier=this._camionsSurMap.find(x=>(x.id==this.camion.idCarrier))
      if(this.camionCarrier==undefined){
        this.camionCarrier=this._camionsNoGPS.find(x=>(x.id==this.camion.idCarrier))
      }
      if(this.camionCarrier==undefined){
        this.camionCarrier=this._remorques.find(x=>(x.id==this.camion.idCarrier))
      }
      if(this.camionCarrier==undefined){
        this.camionCarrier=this._camionsOutService.find(x=>(x.id==this.camion.idCarrier))
      }
      //
    }, err=>{
      console.log();
    })
    //
    // this.detailCamion=true;// to change the view map to view detail camion
    
    //}
    //console.log('this.camionCarrier.id (dans onClickCamion()): '+this.camionCarrier.id)
    // this.infoWindow.close();
    // this.map.setCenter(new google.maps.LatLng(c.latitude, c.longtitude));
    // this.infoWindow = new google.maps.InfoWindow;
    // let contentString:string= (c.foreignName.length>0 ? c.foreignName : (c.unite+c.type+c.modele));
    // this.infoWindow.setContent(contentString);
    // this.infoWindow.setPosition(new google.maps.LatLng(c.latitude, c.longtitude));
    // this.infoWindow.open(this.map);//*/
    
  }
  
  detailCamionWindown=true;
  onSetOutService(){
    let temp=this.camion
    if(temp.outService&&temp.idCarrier!=null&&temp.idCarrier>0){
      //this.camion=null;
      // this.detailCamionWindown=false
      // alert('SVP, Liberez Trailer/Carrier attache avant de le mettre hors service! ')
      // this.detailCamionWindown=true
      temp.outService=false; //!temp.outService;
      // this.camion.outService=
      //this._camionsSurMap.find(x=>(x.id==temp.id)).outService=false
      // this.remorques.find(x=>(x.id==temp.id))
      // this.camion.outService=false;
      if(localStorage.getItem('language')&&localStorage.getItem('language').includes('English'))
        alert('Please, Release Trailer / Carrier attached before taking it out of service! ')
      else
        alert('SVP, Liberez Trailer/Carrier attache avant de le mettre hors service! ')
      this.onClickCamion(temp)
      // this.camion=temp;
      // console.log('this.camion.outService: '+this.camion.outService)
      
      // this.camion.outService=false;
    }
  }
  saveCamion(){
    //the first delete the join between camion et trailer and then save change camion
    if(this.idCarrierBeforeChange!=null&&this.idCarrierBeforeChange>0){
      //this.findRemorque(this.camionBeforeChange.idCarrier) // find trailer - trailerTemp
      let trailerTemp = this._remorques.find(x=>(x.id==this.idCarrierBeforeChange))
      if(trailerTemp!=null) {
        trailerTemp.idCarrier=null
        this.camionsService.saveCamions(trailerTemp).subscribe((data:Camion)=>{
          // this.trailerTemp=null;
          // console.log('Delete liasion')
          this.camionsService.saveCamions(this.camion).subscribe((data:Camion)=>{
            // console.log('Save Camion')
            if(this.camionCarrier!=null){
              this.camionCarrier.idCarrier=this.camion.id
              this.camionsService.saveCamions(this.camionCarrier).subscribe((d:Camion)=>{
                // console.log('Save Trailer')
              }
              ,err=>(console.log(err)))
            }  
            if(localStorage.getItem('language')&&localStorage.getItem('language').includes('English'))          
              alert("It's saved.")
            else
              alert("C'est enregistre.")
            this.closecamion(); // close detailCamion after modifying somthing to refresh all
          }, err=>{
            console.log(err);
          });
        },
        err=>{console.log(err)})
      }
      else{
        this.camionsService.saveCamions(this.camion).subscribe((data:Camion)=>{
          if(localStorage.getItem('language')&&localStorage.getItem('language').includes('English'))
            alert("It's saved.")
          else
            alert("C'est enregistre.")
          this.closecamion(); // close detailCamion after modifying somthing to refresh all
        }, err=>{console.log(err)})
      }
    }
    // In the case have no liason, just save change camion
    else{
      this.camionsService.saveCamions(this.camion).subscribe((data:Camion)=>{
        // console.log('Save Camion')
        if(this.camionCarrier!=null){
          this.camionsService.saveCamions(this.camionCarrier).subscribe((d:Camion)=>{
            // console.log('Save Trailer')
          }
          ,err=>(console.log(err)))
        }
        if(localStorage.getItem('language')&&localStorage.getItem('language').includes('English'))
          alert("It's saved.")
        else
          alert("C'est enregistre.")
        this.closecamion();
      }, err=>{
        console.log(err);
      });
    }
  }

  onChangeCarrier(){
    /*//
    //
    this.detailCamionWindown=false;
    this.camionsSurMap=[];// to empty this list
    this.camionsNoGPS=[];// to empty this list
    this.camionsGPSAndNoGPS=[];// to empty this list
    this.remorques=[];// to empty this list
    this.camionsOutService=[];

    this._camionsSurMap=[];// to empty this list
    this._camionsNoGPS=[];// to empty this list
    this._camionsGPSAndNoGPS=[];// to empty this list
    this._remorques=[];// to empty this list
    this._camionsOutService=[];
    this.camionsService.camionsDeTransporter(this.transporter.id).subscribe((data:Array<Camion>)=>{
      this._camions=this.camions=data.sort((a,b)=>Number(a.unite)-Number(b.unite));
      data.forEach(camion=>{
        if(camion.outService){ // find all unites outService te,porary
          this.camionsOutService.push(camion)

          this._camionsOutService.push(camion)
        }
        else{ // the rest is all unite in service normally
          if(camion.status && (camion.uniteMonitor!=null && camion.monitor!=null) && (camion.uniteMonitor.length!=0 && 
            camion.monitor.length!=0))// && (!camion.uniteMonitor.includes('no-gps'))) // !camion.uniteMonitor.includes('no-gps') - means : there isn't GPS
          {
            if(!camion.uniteMonitor.includes('no-gps'))
            {
              this.camionsSurMap.push(camion)
              this.camionsGPSAndNoGPS.push(camion)

              this._camionsSurMap.push(camion)
              this._camionsGPSAndNoGPS.push(camion)
            }
            else 
              // if(camion.status && (camion.uniteMonitor!=null && camion.monitor!=null) && (camion.uniteMonitor.length!=0 && 
              // camion.monitor.length!=0) && (camion.uniteMonitor.includes('no-gps'))) // !camion.uniteMonitor.includes('no-gps') - means : there isn't GPS
            {
              this.camionsNoGPS.push(camion)
              this.camionsGPSAndNoGPS.push(camion)

              this._camionsNoGPS.push(camion)
              this._camionsGPSAndNoGPS.push(camion)
            }
          }
          else 
            if(camion.status) 
              {
                this.remorques.push(camion)  // Camions in service without GPS are trailers

                this._remorques.push(camion)
              }

        }
      })
      // add here your code //*/
      // find the idcarrier of trailer and set it to null
    if(this.idCarrierBeforeChange!=null&&this.idCarrierBeforeChange>0&&
      this._remorques.find(x=>(x.id==this.idCarrierBeforeChange))!=undefined){
      this._remorques.find(x=>(x.id==this.idCarrierBeforeChange)).idCarrier=null
    }
    if(this.idTemp!=null&&this.idTemp>0){
      this._remorques.find(x=>(x.id==this.idTemp)).idCarrier=null
      this.idTemp=null;
    }
    // if(this.idCarrierBeforeChange!=null&&this.idCarrierBeforeChange>0){
    //   this._remorques.find(x=>(x.id==this.idCarrierBeforeChange)).idCarrier=null
    // }
    if(this.camionCarrier!=null){
      if(this.camionCarrier.idCarrier==null || this.camionCarrier.idCarrier<=0)
      {
        this.camion.idCarrier=this.camionCarrier.id;
        this.camionCarrier.idCarrier=this.camion.id;
        this.idTemp=this.camionCarrier.id;// to kepp this.camionCarrier.id
      }
      else 
        {
          if(localStorage.getItem('language')&&localStorage.getItem('language').includes('English'))
            alert('This Unit is busy. Please get another one!')
          else
            alert('Cette Unite est occupe. Veuillez choisir un autre!')
          this.camionCarrier=null //new Camion();
      }
    }
    else{
      // let temp=this.camionBeforeChange.idCarrier
      this.camion.idCarrier=null;
      this.idTemp=null;
      //this.camionCarrier.idCarrier=null;
      // this.camionBeforeChange.idCarrier=temp
    }
    this.detailCamionWindown=true;
      /*// end here eyour code
    }, err=>{
      console.log();
    })
    //*/  
  }
  
  trailerTemp:Camion;
  findRemorque(id){
    this.trailerTemp=this.remorques.find(x=>(x.id==id))
  }
  camionWithGPSTemp:Camion;
  findCamionWithGPS(id){
    this.camionWithGPSTemp=this.camionsSurMap.find(x=>(x.id==id))
  }
  camionNoGPSTemp:Camion;
  findCamionNoGPS(id){
    this.camionNoGPSTemp=this.camionsNoGPS.find(x=>(x.id==id))
  }

  onChangeCamionCapacity(){
    this.onClickCamion(this.camion)
    /*//
    //
    this.detailCamionWindown=false;
    this.camionsSurMap=[];// to empty this list
    this.camionsNoGPS=[];// to empty this list
    this.camionsGPSAndNoGPS=[];// to empty this list
    this.remorques=[];// to empty this list
    this.camionsOutService=[];

    this._camionsSurMap=[];// to empty this list
    this._camionsNoGPS=[];// to empty this list
    this._camionsGPSAndNoGPS=[];// to empty this list
    this._remorques=[];// to empty this list
    this._camionsOutService=[];
    this.camionsService.camionsDeTransporter(this.transporter.id).subscribe((data:Array<Camion>)=>{
      this._camions=this.camions=data.sort((a,b)=>Number(a.unite)-Number(b.unite));
      data.forEach(camion=>{
        if(camion.outService){ // find all unites outService te,porary
          this.camionsOutService.push(camion)

          this._camionsOutService.push(camion)
        }
        else{ // the rest is all unite in service normally
          if(camion.status && (camion.uniteMonitor!=null && camion.monitor!=null) && (camion.uniteMonitor.length!=0 && 
            camion.monitor.length!=0))// && (!camion.uniteMonitor.includes('no-gps'))) // !camion.uniteMonitor.includes('no-gps') - means : there isn't GPS
          {
            if(!camion.uniteMonitor.includes('no-gps'))
            {
              this.camionsSurMap.push(camion)
              this.camionsGPSAndNoGPS.push(camion)

              this._camionsSurMap.push(camion)
              this._camionsGPSAndNoGPS.push(camion)
            }
            else 
              // if(camion.status && (camion.uniteMonitor!=null && camion.monitor!=null) && (camion.uniteMonitor.length!=0 && 
              // camion.monitor.length!=0) && (camion.uniteMonitor.includes('no-gps'))) // !camion.uniteMonitor.includes('no-gps') - means : there isn't GPS
            {
              this.camionsNoGPS.push(camion)
              this.camionsGPSAndNoGPS.push(camion)

              this._camionsNoGPS.push(camion)
              this._camionsGPSAndNoGPS.push(camion)
            }
          }
          else 
            if(camion.status) 
              {
                this.remorques.push(camion)  // Camions in service without GPS are trailers

                this._remorques.push(camion)
              }

        }
      })
      // add here your code 
      this.idTemp=null;
    this.camionBeforeChange=this.camion; // to keep the origin camion before change some thing
    if(this.camion.idCarrier!=null&&this.camion.idCarrier>0) 
    {
      this.idCarrierBeforeChange=this.camion.idCarrier
    
    }
    
      this.camionCarrier=this._camionsSurMap.find(x=>(x.id==this.camion.idCarrier))
      if(this.camionCarrier==null){
        this.camionCarrier=this._camionsNoGPS.find(x=>(x.id==this.camion.idCarrier))
      }
      if(this.camionCarrier==undefined){
        this.camionCarrier=this._remorques.find(x=>(x.id==this.camion.idCarrier))
      }
      if(this.camionCarrier==undefined){
        this.camionCarrier=this._camionsOutService.find(x=>(x.id==this.camion.idCarrier))
      }
      this.detailCamion=true // reconfirm to show the detail camion
      this.detailCamionWindown=true;
      // end here eyour code
    }, err=>{
      console.log();
    })
    //*/
  }

  onChangeImage(){
    this.camion.imgUrl=""
  }
  
  async closecamion(){
    if(this.idCarrierBeforeChange!=null&&this.idCarrierBeforeChange>0&&
      this._remorques.find(x=>(x.id==this.idCarrierBeforeChange))!=undefined){
      this._remorques.find(x=>(x.id==this.idCarrierBeforeChange)).idCarrier=null
    }
    if(this.idTemp!=null&&this.idTemp>0){
      this._remorques.find(x=>(x.id==this.idTemp)).idCarrier=null
      this.idTemp=null;
    }
    // if(this.idCarrierBeforeChange!=null&&this.idCarrierBeforeChange>0){
    //   this._remorques.find(x=>(x.id==this.idCarrierBeforeChange)).idCarrier=null
    // }
    this.camionBeforeChange=null;
    this.camionCarrier=null;
    this.camion.idCarrier=null;
    //this.idTemp=null;
    this.idCarrierBeforeChange=null;
    this.camion=null;
    // await this.onRefresh();
    this.detailCamion=false;
    this.onRefresh();
  }

  addCamionButton(){
    if(this.camions.length>=this.transporter.trucks){
      alert('Your must extend your plan, please !')
    }
    else{
      this.addcamion=new Camion();
      this.addUnite=!this.addUnite;
    }
    // this.addcamion=new Camion();
    // this.addUnite=!this.addUnite;
  }

  addCamion(){
    if(this.addcamion.unite!=null && this.addcamion.unite.length>0){
      let exist=false; // this number unite doesn't exist yet
      this.listNumberUnite.forEach(nu=>{
        if(nu.includes(this.addcamion.unite)&&(nu.length==this.addcamion.unite.length))
          {
            if(localStorage.getItem('language')&&localStorage.getItem('language').includes('English'))
              alert("Number Unit exist already. Please, get another one");
            else
              alert("Numero Unite existe deja. Choisir un autre Numero Unite, SVP!");
            exist=true; // this Number unite exist already
          }
      })
      if(!exist){
        this.addcamion.idTransporter=this.transporter.id;
        this.camionsService.saveCamions(this.addcamion).subscribe((data:Camion)=>{
          this.listNumberUnite.push(data.unite)
          this.addcamion=new Camion();
          this.fichePhysiqueEntretien.idCamion=data.id;
          this.fichePhysiqueEntretienCont.idCamion=data.id;
          this.fichePhysiquesService.saveFichePhysiqueEntretiens(this.fichePhysiqueEntretien).subscribe((data:FichePhysiqueEntretien)=>{ 
            // console.log('fiche1 ok ' +  data.idCamion)
            this.fichePhysiqueContsService.saveFichePhysiqueEntretienConts(this.fichePhysiqueEntretienCont).subscribe((data:FichePhysiqueEntretienCont)=>{
              // console.log('fiche2 ok ' +  data.idCamion) 
              if(localStorage.getItem('language')&&localStorage.getItem('language').includes('English'))
                alert("Unit was added well.")
              else
                alert("Unite a ete bien ajoute")
              // this.addcamion=new Camion();
              this.addUnite=false
              this.onRefresh()
            }, err=>{
              console.log(err)
            });
          }, err=>{
            console.log(err)
          });
        }, err=>{
          console.log(err)
        })//*/
      }
    }
    else{
      if(localStorage.getItem('language')&&localStorage.getItem('language').includes('English'))
        alert('You need to fill in infos for this unit')
      else
        alert('Vous devez remplir des infos de cette unite.')
    }
    
  }

  modifyProfil(){
    //this.router.navigate(['/detail-transporter/'+ this.transporter.id], {skipLocationChange: true});
    this.modeProfil=true;
  }

  routeSonNowTemp : Itineraire = null; // to obtain the route son temporaey
  onselectRouteFather(event){
    if(this.itiner.idRouteFather==null){
      // reconfirm null for idRrouteFather and idRrouteFatherF1
      this.itiner.idRouteFather = null
      this.itiner.idRouteFatherF1 = null
      console.log("set null for idRouteFather and idRoutefatherF1")
    }
    else{  // it means selected father
      // find infos route father
      let routeFather = this.itiners.find(x=>(x.id == this.itiner.idRouteFather))
      // must find if this father has already a son
      this.routeSonNowTemp = this.itiners.find(x=>(x.idRouteFather == this.itiner.idRouteFather))
      if(this.routeSonNowTemp!=null){ // found son 
        this.routeSonNowTemp.idRouteFather=this.itiner.id //null // set null his father
        // routeSonNowTemp.idRouteFather=this.itiner.id // this.itiner become his father
        // here we put a call back, it will be called when this.itiner is addad/ajoute
        // this is in onAjouter()
      }
      else{ // no son
        this.routeSonNowTemp=null // reconfirm it is null
      }
      //
      
      // here : Son is this.itiner
      // if routerFather have routeFatherF1 (route origin). Set route origin of son equal his father, 
      // it's mean they are in same family
      if(routeFather.idRouteFatherF1!=null && routeFather.idRouteFatherF1>0)
        this.itiner.idRouteFatherF1 = routeFather.idRouteFatherF1
      else // if route father hasn't origin, then it is th origin
        this.itiner.idRouteFatherF1 = this.itiner.idRouteFather
      console.log("id route father: " + this.itiner.idRouteFather)
    }
  }

  // variables for showing the unites 
  showingUnitsGps=true
  showingUnitsNoGps=false
  showingTrailers=false
  showUnitsGPS(){
    this.showingUnitsGps=true
    this.showingUnitsNoGps=false
    this.showingTrailers=false
  }
  showUnitsNoGPS(){
    this.showingUnitsGps=false
    this.showingUnitsNoGps=true
    this.showingTrailers=false
  }
  showTrailers(){
    this.showingUnitsGps=false
    this.showingUnitsNoGps=false
    this.showingTrailers=true
  }


  print(cmpId){
    //let envoy = document.getElementById('toprint').innerHTML;
    //console.log('Toprint : ' + document.getElementById('toprint').innerHTML + ' endOfToprint')
    //console.log(envoy)
    const printContent = document.getElementById(cmpId);
     //console.log('printContent.innerHTML : '+printContent.innerHTML+' *** end.')
    //const WindowPrt = window.open('','','left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    const WindowPrt = window.open();
    WindowPrt.document.write('<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }

  
  gotoTop() {
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }
  
  gotoBottom() {
    window.scroll({ 
      top: document.documentElement.scrollHeight, 
      left: 0, 
      behavior: 'smooth' 
    });
  }
  
  // @HostListener('window:beforeunload', ['$event'])
  //   beforeUnload(event:any){
  //     console.log('this.subscription.unsubscribe();')
  //     this.subscription.unsubscribe();
  //     this.subscriptionCSM.unsubscribe();
  //   }
}

export class CamionItinersList{
  camionId:number
  itiners:Array<Itineraire>
}

export class CarrierTrailer{
  carrier:Camion
  trailer:Camion
}