import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import {SignaturePad} from 'angular2-signaturepad';
import { GeocodingService } from 'src/services/geocoding.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { } from 'googlemaps';
import * as myGlobals from 'src/services/globals';
import { Remorquage } from 'src/model/model.remorquage';
import { RemorquagesService } from 'src/services/remorquages.service';
import { ShippersService } from 'src/services/shippers.service';
import { Shipper } from 'src/model/model.shipper';
import { ContactsService } from 'src/services/contacts.service';
import { Contact } from 'src/model/model.contact';
import { BankClientsService } from 'src/services/bankClients.service';
import { EmailMessage } from 'src/model/model.emailMessage';
import {DatePipe} from '@angular/common';
import { Camion } from 'src/model/model.camion';
import { CamionsService } from 'src/services/camions.service';
import { Chauffeur } from 'src/model/model.chauffeur';
import { ChauffeursService } from 'src/services/chauffeurs.service';
import { AuthenticationService } from 'src/services/authentication.service';
import { VarsGlobal } from 'src/services/VarsGlobal';
import { UserLogsService } from 'src/services/userLogs.service';
import { UserLogs } from 'src/model/model.userLogs';
import { HttpClient } from '@angular/common/http';
import { GeolocationService } from 'src/services/geolocation.service';
import { ShipperParticuliersService } from 'src/services/shipperParticuliers.service';
import { ShipperParticulier } from 'src/model/model.shipperParticulier';

@Component({
  selector: 'app-appel-express-visitor',
  templateUrl: './appel-express-visitor.component.html',
  styleUrls: ['./appel-express-visitor.component.css']
})
export class AppelExpressVisitorComponent implements OnInit {

  //* pour checkBox list
  formGroup: FormGroup = new FormGroup({
    telContact: new FormControl(),
    emailContact: new FormControl(),
  });
  serviceTypes = ["Leger", "Moyen", "Lourd"];
  // prix remorquage (bas - km - inclus)
  prixBase1=85.00;
  prixKm1=2.65;
  inclus1=5.00; 
  prixBase2=95.00;
  prixKm2=3.15;
  inclus2=5.00;
  prixBase3=105.00;
  prixKm3=3.80;
  inclus3=7.00;
  /*ent1:Entreprise={id:1, nom:'Honda Laval'}
  ent2:Entreprise={id:2, nom:'Albi Eustache'}
  ent3:Entreprise={id:3, nom:'Incendie Rosemere'}
  ent4:Entreprise={id:4, nom:'Hyundai Terrebonne'}
  listEntreprise=[this.ent1, this.ent2, this.ent3, this.ent4];
  listIdEntreprise=[1, 2, 3, 4];
  filteredEntreprises=this.listEntreprise;//*/

  shipper=new Shipper(); //:any;
  listShipper=[];
  filteredShippers=[]; //=this.listShipper;
  firstFilteredShipper='' //new Shipper();

  provinceList=myGlobals.provinceList ;
  
  villeListO= myGlobals.QuebecVilles; //villeList Origin ;
  
  villeListD=this.villeListO; // villeList destination ;
  
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
//*/
  mode=2; // on est en cm et kg
  
  remorquage:Remorquage=new Remorquage();

  //vehiculeMarques = myGlobals.vehiculeMarques;
  vehiculeModeles = []; //myGlobals.d2cmediaacura;
  marquesModeles = myGlobals.marquesModeles;
  colors = myGlobals.colors;

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
  
  //for signature pad
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  private signaturePadOptions: Object = {
    'minWidth': 1,
    //'border': '2px dotted gray',
    //'canvasWidth': 'auto',
    //'canvasHeight': 'auto',
  };
  titreAjout: string='';
  shipperParticulier: ShipperParticulier;
  drawComplete(data) {
    //console.log(this.signaturePad.toDataURL('image/png', 0.5));
    //this.remorquage.signature=this.signaturePad.toDataURL()
    //console.log('this.remorquage.signature.length : '+ this.remorquage.signature.length)
  }
 
  drawStart() {
    //console.log('begin drawing');
  }

  okHandler(){
    //console.log(this.signaturePad.toDataURL('image/png', 0.5));
    this.remorquage.signature=this.signaturePad.toDataURL()
    //window.open(this.signaturePad.toDataURL(), ' blank')
  }

  clearHandler(){
    if(this.signaturePad)
      this.signaturePad.clear();
    this.remorquage.signature="";
  }
  //end for signature pad

  centerCoord={lat:45.568806, lng:-73.918333}  // 

  today=new Date();
  modeHistoire: number=-1;
  listRqs: Remorquage[]; // appels waitting
  listRqsSent: Remorquage[]; // appels sent
  listRqsFini: Remorquage[]; // appels finished
  contacts: Contact[];
  chauffeurs: Chauffeur[];
  chauffeur: Chauffeur;
  
  em:EmailMessage=new EmailMessage();

  camions:Array<Camion>;

  answer:number;
  form:FormGroup;  // use for chauffeur

  towing=false; // false : dont need towing, true: need towing

  constructor(public remorquagesService : RemorquagesService, 
    // public geocoding : GeocodingService, 
    private formBuilder:FormBuilder, public router:Router, 
    public contactsService:ContactsService,
    public chauffeursService:ChauffeursService,
    public shipperservice:ShippersService,
    public bankClientsService:BankClientsService, // use to send email
    private datePipe: DatePipe,
    public camionsService:CamionsService,
    private fb:FormBuilder,
    private authService:AuthenticationService,
    public varsGlobal:VarsGlobal, 
    public userLogsService: UserLogsService,
    private http: HttpClient,
    private geolocation : GeolocationService,
    public shipperParticuliersService:ShipperParticuliersService,
    )
  { 
    this.form = fb.group({
      username:'chauffeur',
      password:'chauffeur'
    })
  }
  /*/ on close window
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event){
    //alert("I'm leaving the app");
    //localStorage.clear();
    localStorage.removeItem('tonken');
    localStorage.removeItem('nom');
    localStorage.removeItem('tel');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    this.role="";
    this.router.navigateByUrl("");
  }//*/
  
  // on focus windows
  @HostListener('window:focus', ['$event'])
  onfocus(event:any):void {
    //this.onRefresh()
  }
  
  ngOnInit() {    
    /*//
    this.shipperParticuliersService.getDetailShipperParticulier(1).subscribe((data:ShipperParticulier)=>{
      this.shipperParticulier=<Shipper>data;
      this.shipper=this.shipperParticulier;
    }, err=>{
      console.log(err);
    });
    //*/
    this.remorquage.idTransporter=8; // par default appel visitor appartient de SOSPrestige
    // take particular price
    const user=this.form.value;
    this.authService.loginDefaultDriver(user).subscribe(resp=> {
      let jwtToken=resp.headers.get('Authorization');
      this.authService.saveTonken(jwtToken);
      this.shipperParticuliersService.getDetailShipperParticulier(1).subscribe((data:ShipperParticulier)=>{
        this.shipperParticulier=<Shipper>data;
        this.shipper=this.shipperParticulier;
        localStorage.clear();  //  erase localstorage after taken particular price 
        //console.clear(); // try to clear infos 
        this.geolocation.getCurrentPosition().subscribe(async (data)=>{
          let tempEtatCountry=''
          // let tempEtat=''
          // let tempCountry=''
          let geocoding = new GeocodingService()
          await geocoding.geocode(new google.maps.LatLng(              
            this.varsGlobal.userLogs.latitude=data.coords.latitude,
            this.varsGlobal.userLogs.longtitude=data.coords.longitude
          ))
          .forEach(
            (results: google.maps.GeocoderResult[]) => {
              // this.varsGlobal.userLogs.place=results[0].formatted_address;
              this.remorquage.originAdresse=results[0].formatted_address.split(',')[0];
              this.remorquage.originVille=results[1].formatted_address.split(',')[1];
              // tempEtatCountry=results[8].formatted_address
              this.remorquage.destProvince=this.remorquage.originProvince=results[8].formatted_address.split(',')[0];                
            }
          ).then(()=>{
            if(this.remorquage.originProvince.includes('Qu')&&this.remorquage.originProvince.includes('bec'))
            this.remorquage.destProvince=this.remorquage.originProvince='Quebec'
            // if(this.remorquage.destProvince.includes('Québec'))
            //   this.remorquage.destProvince='Quebec'
            // console.log('tempEtatCountry: '+ tempEtatCountry)
            // console.log('remorquage.originProvince: '+ this.remorquage.originProvince)
            // console.log('remorquage.destProvince: '+ this.remorquage.destProvince)
          })
        })
        // var CACHE_VERSION = 1;
        // var CURRENT_CACHES = {
        //   font: 'font-vache-v' + CACHE_VERSION
        // };
        // var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key){
        //   return CURRENT_CACHES[key];
        // });
        // caches.keys().then((cacheNames)=>{
        //   return Promise.all(
        //     cacheNames.map(function(cacheName){
        //       if(expectedCacheNames.indexOf(cacheName)==-1){
        //         console.log('Deleting out of date cach:', cacheName);
        //         return caches.delete(cacheName)
        //       }
        //     })
        //   )
        // })

      }, err=>{
        console.log(err);
      });
    }, err=>{          
      console.log(err);
    });

    if(localStorage.getItem('tonken')!=null) 
    {
      this.answer=61 // 35 + 25 = 61
      this.titreAjout= '  -  '+localStorage.getItem('entrepriseNom')
    }
    this.remorquage.prixBase=85;
    this.remorquage.prixKm=0;
    this.remorquage.inclus=0;
    this.remorquage.typeService=this.serviceTypes[0];
    this.typeServiceChange(this.serviceTypes[0]);
  }
  
  marqueChange(){
    this.vehiculeModeles=[];
    this.marquesModeles.forEach(mm =>{
      if(this.remorquage.marque.includes(mm.marque))
        this.vehiculeModeles=mm.modeles
    })
  }

  async gotoDetailRemorquage(r:Remorquage){
    /*
    this.remorquage=r;
    this.modeHistoire=-1;
    if(!this.remorquage.fini){
      this.latLngOrigin= new google.maps.LatLng(
        this.remorquage.originLat,
        this.remorquage.originLong                                          
      )
      this.latLngDestination= new google.maps.LatLng(
        this.remorquage.destLat,
        this.remorquage.destLong                                          
      )
      this.showMap()
    }//*/
    window.open("/detail-remorquage/"+r.id, "_blank")
  }
checkValid(){
  if(
    this.towing 
    && (this.remorquage.telClient.length>0 || this.remorquage.telClient2em.length>0) 
    && this.remorquage.nomClient.length>0 && this.remorquage.originAdresse.length>0
    && this.remorquage.originVille.length>0 && this.remorquage.originProvince.length>0
    && this.remorquage.destAdresse.length>0 && this.remorquage.destVille.length>0 
    && this.remorquage.destProvince.length>0 && this.remorquage.marque.length>0
    && (this.remorquage.panne||this.remorquage.accident||this.remorquage.pullOut||this.remorquage.debaragePorte
      ||this.remorquage.survoltage||this.remorquage.essence||this.remorquage.changementPneu)
  ){
    return true;  // form is filled well
  }
  else if(
    !this.towing 
    && (this.remorquage.telClient.length>0 || this.remorquage.telClient2em.length>0) 
    && this.remorquage.nomClient.length>0 && this.remorquage.originAdresse.length>0
    && this.remorquage.originVille.length>0 && this.remorquage.originProvince.length>0
    && this.remorquage.marque.length>0
    && (this.remorquage.pullOut||this.remorquage.debaragePorte
      ||this.remorquage.survoltage||this.remorquage.essence||this.remorquage.changementPneu)
  ){
    return true;
  }
  else 
    return false; // form is not filled well
}
//*
async originChange(){
  //*
  if(this.remorquage.originProvince!=null){
    // check the province to limit the cities
    if(this.remorquage.originProvince==this.provinceList[0])
      this.villeListO=this.AlbertaVilles;
    if(this.remorquage.originProvince==this.provinceList[1])
      this.villeListO=this.BritishColumbiaVilles;        
    if(this.remorquage.originProvince==this.provinceList[2])
      this.villeListO=this.ManitobaVilles;
    if(this.remorquage.originProvince==this.provinceList[3])
      this.villeListO=this.NewBrunswickVilles;    
    if(this.remorquage.originProvince==this.provinceList[4])
      this.villeListO=this.NewfoundlandLabradorVilles;    
    if(this.remorquage.originProvince==this.provinceList[5])
      this.villeListO=this.NorthwestTerritoriesVilles;
    if(this.remorquage.originProvince==this.provinceList[6])
      this.villeListO=this.NovaScotiaVilles;
    if(this.remorquage.originProvince==this.provinceList[7])
      this.villeListO=this.NunavutVilles;
    if(this.remorquage.originProvince==this.provinceList[8])
      this.villeListO=this.OntarioVilles;
    if(this.remorquage.originProvince==this.provinceList[9])
      this.villeListO=this.PrinceEdwardIslandVilles;
    if(this.remorquage.originProvince==this.provinceList[10])
      this.villeListO=this.QuebecVilles;
    if(this.remorquage.originProvince==this.provinceList[11])
      this.villeListO=this.SaskatchewanVilles;  
    if(this.remorquage.originProvince==this.provinceList[12])
      this.villeListO=this.YukonVilles;
    // end check the provine
    
    this.remorquage.origin=this.remorquage.originAdresse+', '+this.remorquage.originVille+', '+this.remorquage.originProvince //+', canada'
    let geocoding = new GeocodingService()
    await geocoding.codeAddress(this.remorquage.origin).forEach(
      (results: google.maps.GeocoderResult[]) => {
            if(results[0].geometry.location.lat()>0){
              this.latLngOrigin= new google.maps.LatLng(
                //results[0].geometry.location.lat(),
                //results[0].geometry.location.lng()                            
                this.remorquage.originLat = results[0].geometry.location.lat(),
                this.remorquage.originLong = results[0].geometry.location.lng()                            
              )
              //alert("En deplacant, attendre 2 secondes svp, puis press OK.")
            }
            else
              alert("Ne pas trouver de coordonnees de ce origin")
    });//*/
    if(this.remorquage.destination!=null && this.remorquage.destination.length>0){
      await this.setDistanceTravel(this.remorquage.origin, this.remorquage.destination)
      //await this.showMap()
      this.typeServiceChange(this.remorquage.typeService)
    }
  }
  //this.showMap();
}

async destinationChange(){
  //*
  if(this.remorquage.destProvince!=null){
    // check the province to limit the cities
    if(this.remorquage.destProvince==this.provinceList[0])
      this.villeListD=this.AlbertaVilles;
    if(this.remorquage.destProvince==this.provinceList[1])
      this.villeListD=this.BritishColumbiaVilles;        
    if(this.remorquage.destProvince==this.provinceList[2])
      this.villeListD=this.ManitobaVilles;
    if(this.remorquage.destProvince==this.provinceList[3])
      this.villeListD=this.NewBrunswickVilles;    
    if(this.remorquage.destProvince==this.provinceList[4])
      this.villeListD=this.NewfoundlandLabradorVilles;    
    if(this.remorquage.destProvince==this.provinceList[5])
      this.villeListD=this.NorthwestTerritoriesVilles;
    if(this.remorquage.destProvince==this.provinceList[6])
      this.villeListD=this.NovaScotiaVilles;
    if(this.remorquage.destProvince==this.provinceList[7])
      this.villeListD=this.NunavutVilles;
    if(this.remorquage.destProvince==this.provinceList[8])
      this.villeListD=this.OntarioVilles;
    if(this.remorquage.destProvince==this.provinceList[9])
      this.villeListD=this.PrinceEdwardIslandVilles;
    if(this.remorquage.destProvince==this.provinceList[10])
      this.villeListD=this.QuebecVilles;
    if(this.remorquage.destProvince==this.provinceList[11])
      this.villeListD=this.SaskatchewanVilles;  
    if(this.remorquage.destProvince==this.provinceList[12])
      this.villeListD=this.YukonVilles;
    // end check the provine
    this.remorquage.destination=this.remorquage.destAdresse+', '+this.remorquage.destVille+', '+this.remorquage.destProvince  //+', canada'
    let geocoding = new GeocodingService()
    await geocoding.codeAddress(this.remorquage.destination).forEach(
      (results: google.maps.GeocoderResult[]) => {
            if(results[0].geometry.location.lat()>0){
              this.latLngDestination= new google.maps.LatLng(
                //results[0].geometry.location.lat(),
                //results[0].geometry.location.lng()     
                this.remorquage.destLat = results[0].geometry.location.lat(),
                this.remorquage.destLong = results[0].geometry.location.lng()                                                   
              )
              //alert("En deplacant, attendre 2 secondes svp, puis press OK.")
            }
            else
              alert("Ne pas trouver de coordonnees de cet destination")
    });//*/
    if(this.remorquage.origin!=null && this.remorquage.origin.length>0){
      await this.setDistanceTravel(this.remorquage.origin, this.remorquage.destination)
      //await this.showMap()
      this.typeServiceChange(this.remorquage.typeService)
    }
  }//this.showMap();
}
onSortDate(data:Array<Remorquage>){
  data.sort((a, b)=>{
    if(a.dateReserve>b.dateReserve)
      return 1;
    if(a.dateReserve<b.dateReserve)
      return -1;
    return 0;
  })
}
onRefresh(){
  this.remorquagesService.getAllRemorquages().subscribe((data:Array<Remorquage>)=>{
    this.listRqs=[]  //data;
    this.listRqsSent=[]
    this.listRqsFini=[]
    //*
    data.sort((b, a)=>{
      if(a.id>b.id)
        return 1;
      if(a.id<b.id)
        return -1;
      return 0;
    })//*/
    data.forEach(rq=>{
      //if(!rq.sent && !rq.fini) 
      //this.listRqs.push(rq)
      //*
      if(rq.fini) this.listRqsFini.push(rq)
      else if (rq.sent) this.listRqsSent.push(rq)
      else if (rq.valid) this.listRqs.push(rq)//*/
    })
  }, err=>{
    console.log(err)
  })
}

printBonDeRemorquage(cmpId){
  let envoy = document.getElementById('toprint').innerHTML;
  console.log('Toprint : ' + document.getElementById('toprint').innerHTML + ' endOfToprint')
  //console.log(envoy)
  const printContent = document.getElementById(cmpId);
   console.log('printContent.innerHTML : '+printContent.innerHTML+' *** end.')
  //const WindowPrt = window.open('','','left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
  const WindowPrt = window.open();
  WindowPrt.document.write('<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');
  WindowPrt.document.write(printContent.innerHTML);
  WindowPrt.document.close();
  WindowPrt.focus();
  WindowPrt.print();
  WindowPrt.close();
}

async prixCalcul(){
  this.remorquage.horstax=this.remorquage.prixBase
  if((this.remorquage.distance-this.remorquage.inclus)>0){
    this.remorquage.horstax =await this.remorquage.horstax + (this.remorquage.distance-this.remorquage.inclus)*this.remorquage.prixKm
  }
  this.remorquage.tps =await Math.round(this.remorquage.horstax*0.05*100)/100
  this.remorquage.tvq =await Math.round(this.remorquage.horstax*0.09975*100)/100
  this.remorquage.total=await Math.round(this.remorquage.horstax*100)/100+this.remorquage.tvq+this.remorquage.tps
  //this.remorquage.collecterArgent=await this.remorquage.total-this.remorquage.porterAuCompte
}

async showMap() {
  let mapProp = {
    center: new google.maps.LatLng(this.centerCoord.lat, this.centerCoord.lng),
    zoom: 6,
    //mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
  var directionsDisplay = new google.maps.DirectionsRenderer; // declare google display
  var directionsService = new google.maps.DirectionsService; // declare google service
  /*var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: {lat: 41.85, lng: -87.65}
  });//*/
  directionsDisplay.setMap(this.map); // to see the routes on the map
  directionsDisplay.setPanel(document.getElementById('right-panel')); // to see the routes just by the text

  this.infoWindow = new google.maps.InfoWindow;
  let markerOrigin = new google.maps.Marker({
    position: this.latLngOrigin,
    map: this.map,
    //icon: 'https://maps.google.com/mapfiles/kml/shapes/info-i_maps.png', //;this.iconBase + this.selectedMarkerType,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 4
    },
    title: this.remorquage.origin
  });
  let markerDestination = new google.maps.Marker({
    position: this.latLngDestination,
    map: this.map,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 4
    },
    title: this.remorquage.destination
  });

  // centrer la carte
  var bounds = new google.maps.LatLngBounds();
  bounds.extend(this.latLngOrigin);
  bounds.extend(this.latLngDestination);
  this.map.fitBounds(bounds);
  //*/
  //document.getElementById('right-panel').innerHTML=remorquagre.testInnel
  await directionsService.route({
    origin: this.remorquage.origin,
    destination: this.remorquage.destination,
    travelMode: google.maps.TravelMode.DRIVING
  }, async function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      document.getElementById('right-panel').innerHTML="";
      await directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
  //*/
}
  
  // For input
  filterInputEnt(event) {
    console.log('event.target.value : ' + event.target.value)
    //this.filteredEntreprises = []
    this.filteredShippers = []
    //this.firstFilteredShipper = '' //new Shipper();
    for(let i = 0; i < this.listShipper.length; i++) {
        let ent:Shipper = this.listShipper[i];
        if(ent.nom.toLowerCase().indexOf(event.target.value.toLowerCase()) == 0) {
          if(i==0) 
            this.firstFilteredShipper=ent.nom;
          console.log('firstFilteredShipper :'+ this.firstFilteredShipper)
          this.filteredShippers.push(ent);
          console.log(ent.nom)
        }
    }
    let ent = this.listShipper.find(res=>
      res.nom.toLowerCase().indexOf(this.remorquage.nomEntreprise.toLowerCase())==0 && 
      res.nom.length==this.remorquage.nomEntreprise.length
      )
    if(ent!=null){
      this.remorquage.nomEntreprise=ent.nom
      this.prixBase1=ent.prixBase1;
      this.inclus1=ent.inclus1;
      this.prixKm1=ent.prixKm1;
      this.prixBase2=ent.prixBase2;
      this.inclus2=ent.inclus2;
      this.prixKm2=ent.prixKm2;
      this.prixBase3=ent.prixBase3;
      this.inclus3=ent.inclus3;
      this.prixKm3=ent.prixKm3;
      this.typeServiceChange(this.remorquage.typeService);
      this.contactsService.contactsDeShipper(ent.id).subscribe((data:Array<Contact>)=>{
        this.contacts=data;
      }, err=>{
        console.log(err);
      });
    }
  }
  //(keyup)="autoCharacter($event)"  in html
  autoCharacter(event:any){
    if (event.target.value.length === 3) {
      event.target.value=event.target.value + '-';
    }
    if (event.target.value.length === 7) {
      event.target.value=event.target.value + '-';
    }
  }
  
  reformTel(tel:any){
    console.log("tel before: " + tel)
    if(tel.indexOf('-')<0)
      {
        let sub1 = tel.substr(0,3)
        let sub2 = tel.substr(3,3)
        let sub3 = tel.substr(6,tel.length-6)
        tel=sub1+'-'+sub2+'-'+sub3
      }
      console.log("tel after: " + tel)
    return tel;
  }

  reformTelEvent(tel:any){
    //console.log("tel before: " + tel.target.value)
    if(tel.target.value.length>0 && tel.target.value.indexOf('-')<0)
      {
        let sub1 = tel.target.value.substr(0,3)
        let sub2 = tel.target.value.substr(3,3)
        let sub3 = tel.target.value.substr(6,tel.target.value.length-6)
        tel.target.value=sub1+'-'+sub2+'-'+sub3
      }
    //console.log("tel after: " + tel.target.value)
    return tel.target.value;
  }

  onFini(){
    var r = confirm("Etes vous sur que ce cas est fini ?")
    if(r==true){
      console.log("Le cas est termine.")
      this.remorquage.fini=true;
      this.remorquagesService.saveRemorquages(this.remorquage).subscribe(data=>{
        this.remorquage=new Remorquage();
      }, err=>{console.log(err)})
    }
    else {
      console.log('Le cas est continue.')
    }
    
  }

  onCancel(){
    var r = confirm("Etes vous sur d'annuller ce cas ?")
    if(r==true){
      console.log("Le cas est annulle.")
      if(this.remorquage.id>0){
        this.remorquagesService.deleteRemorquage(this.remorquage.id).subscribe(data=>{
          // commence d'envoyer email
          if(this.remorquage.emailIntervenant!=null && this.remorquage.emailIntervenant.length>10){
            this.em.emailDest=this.remorquage.emailIntervenant
            this.em.titre="Annuler case numero : " + this.remorquage.id.toString()
            this.em.content='<div><p> '+'Annuler case numero : ' + this.remorquage.id.toString()+' </p></div>'    
            this.bankClientsService.envoyerMail(this.em).subscribe(data=>{
              alert("Un courriel annulation a ete aussi envoye au chauffeur.")
            }, err=>{
              console.log()
            })
          }
          //*/
          this.remorquage=new Remorquage();
        }, err=>{console.log(err)})
      }
    }
    else {
      console.log('Le cas est continue.')
    }
  }

  onDelete(rq:Remorquage){
    var r = confirm("Etes vous sur d'annuller ce cas ?")
    if(r==true){
      console.log("Le cas est annulle.")
      if(rq.id>0){
        this.remorquagesService.deleteRemorquage(rq.id).subscribe(data=>{
          if(rq.fini)
            this.listRqsFini.splice(this.listRqsFini.indexOf(rq),1)
          else if(rq.sent)
            this.listRqsSent.splice(this.listRqsSent.indexOf(rq),1)
          else this.listRqs.splice(this.listRqs.indexOf(rq),1)
          //this.demandesBlue.splice(this.demandesBlue.indexOf(demande),1); // remove this demande from the list
        }, err=>{console.log(err)})
      }
    }
    else {
      console.log('Le cas est continue.')
    }
  }
  onGererEntreprise(){
    this.router.navigateByUrl("/shippers");
    //window.open("/shippers", "_blank")  // to test open in new tab
  }
  onNewEntreprise(){
    this.router.navigateByUrl("/new-shipper");
  }
  onSave(){
    if(this.remorquage.id==null){
      this.remorquage.dateDepart=new Date()
      this.remorquage.timeCall= (new Date().getHours().toString().length==2?new Date().getHours().toString():'0'+new Date().getHours().toString())+':'+ 
      (new Date().getMinutes().toString().length==2?new Date().getMinutes().toString():'0'+new Date().getMinutes().toString())  //"00:00";
    }
    this.remorquagesService.saveRemorquages(this.remorquage).subscribe((data:Remorquage)=>{
      this.remorquage=data;
    }, 
      err=>{console.log(err)
    })
  }
  onSavePlusAlert(){
    this.onSave();
    alert("C'est enregistre.")
  }
  onPrint(heure){    
    console.log(heure)
    console.log('this.remorquage.timeCall : '+this.remorquage.timeCall)
    console.log('this.remorquage.timeResrvation : '+this.remorquage.timeResrvation)
  }

  //* calculer distance travel en kms
  setDistanceTravel(address1: string, address2:string) { // in km
    let service = new google.maps.DistanceMatrixService;// = new google.maps.DistanceMatrixService()
    // calculate load distance - ld
    service.getDistanceMatrix({
      'origins': [address1], 'destinations': [address2], travelMode:google.maps.TravelMode.DRIVING
    }, (results: any) => {    
      this.remorquage.distance= Math.round((results.rows[0].elements[0].distance.value)/1000)  
      //this.distanceKm = Math.round(this.distance*1.609344)
    });  
  }

  dateChange(event){
    //(ngModelChange)="dateChange($event)"
    console.log('event : '+event.target.value.toString())
    //this.remorquage.dateReserve = new Date(this.datePipe.transform(event.target.value,"yyyy-MM-dd"));
    this.remorquage.dateReserve = new Date(event.target.value);
    this.remorquage.dateReserve.setDate(this.remorquage.dateReserve.getDate()+1)
    //this.remorquage.dateDepart=event.value;
    console.log('this.remorquage.dateDepart : '+this.remorquage.dateReserve)
  }
  nomContactChange(event){
    this.remorquage.nomContact=event.nom
    this.remorquage.telContact=event.tel
    //console.log('this.remorquage.telContact : '+ this.remorquage.telContact)
    if(this.remorquage.telContact.length>0 && this.remorquage.telContact.indexOf('-')<0)
      {
        let sub1 = this.remorquage.telContact.substr(0,3)
        let sub2 = this.remorquage.telContact.substr(3,3)
        let sub3 = this.remorquage.telContact.substr(6,this.remorquage.telContact.length-6)
        //console.log('sub1 : '+ sub1)
        //console.log('sub2 : '+ sub2)
        //console.log('sub3 : '+ sub3)
        this.remorquage.telContact=sub1+'-'+sub2+'-'+sub3
      }
      //console.log('this.remorquage.telContact after : '+ this.remorquage.telContact)
    this.remorquage.extTelContact=event.extTel
  }
  nomEntrepriseChange(ent){
    this.shipper=ent
    this.remorquage.nomEntreprise=ent.nom
    this.prixBase1=ent.prixBase1;
    this.inclus1=ent.inclus1;
    this.prixKm1=ent.prixKm1;
    this.prixBase2=ent.prixBase2;
    this.inclus2=ent.inclus2;
    this.prixKm2=ent.prixKm2;
    this.prixBase3=ent.prixBase3;
    this.inclus3=ent.inclus3;
    this.prixKm3=ent.prixKm3;
    this.typeServiceChange(this.remorquage.typeService);
    this.contactsService.contactsDeShipper(ent.id).subscribe((data:Array<Contact>)=>{
      this.contacts=data;
      console.log('this.contacts : ' + this.contacts)
    }, err=>{
      console.log(err);
    });
  }
  nomEntrepriseInputChange(){
    console.log("this.remorquage.nomEntreprise : "+this.remorquage.nomEntreprise) 
    /**
      let ent = this.listEntreprise.find(res=>
      res.nom.includes(this.remorquage.nomEntreprise) && 
      res.nom.length==this.remorquage.nomEntreprise.length
      )
     */
    let ent = this.listShipper.find(res=>
      res.nom.includes(this.remorquage.nomEntreprise) && 
      res.nom.length==this.remorquage.nomEntreprise.length
      )
    if(ent!=null){
      this.shipper=ent
      this.remorquage.idEntreprise=ent.id
      this.remorquage.nomEntreprise=ent.nom
      this.prixBase1=ent.prixBase1;
      this.inclus1=ent.inclus1;
      this.prixKm1=ent.prixKm1;
      this.prixBase2=ent.prixBase2;
      this.inclus2=ent.inclus2;
      this.prixKm2=ent.prixKm2;
      this.prixBase3=ent.prixBase3;
      this.inclus3=ent.inclus3;
      this.prixKm3=ent.prixKm3;
      this.typeServiceChange(this.remorquage.typeService);
      this.contactsService.contactsDeShipper(ent.id).subscribe((data:Array<Contact>)=>{
        this.contacts=data;
      }, err=>{
        console.log(err);
      });
    }
    else this.shipper= this.shipperParticulier //new Shipper()
    this.firstFilteredShipper=this.remorquage.nomEntreprise
  }
  ifAccident(){
    if(this.remorquage.accident)
      this.remorquage.panne=false
    if(this.towing)
      this.remorquage.panne=!this.remorquage.accident
    this.typeServiceChange(this.remorquage.typeService)
  }
  ifPanne(){
    if(this.remorquage.panne)
      this.remorquage.accident=false
    if(this.towing)
      this.remorquage.accident=!this.remorquage.panne
    this.typeServiceChange(this.remorquage.typeService)
  }
  ifTowing(){
    if(this.towing)
      this.remorquage.panne = !this.remorquage.accident //false;
    else{
      this.remorquage.panne=false;
      this.remorquage.accident=false;
    }
      //this.remorquage.accident=false;
      /*
      this.remorquage.destAdresse=''
      this.remorquage.destination=''
      this.remorquage.destVille=''//*/
    //}
  }
  calculePrixbase(){
    let panne=0, accident=0, pullOut=0, debarragePorte=0, boost=0, essence=0, changementPneu=0;
    if(this.remorquage.typeService.includes('Leger')){ 
      if(this.remorquage.panne) {
        panne=this.shipper.panne1;
        //this.remorquage.accident=false;
      }
      if(this.remorquage.accident) {
        accident=this.shipper.accident1
        //this.remorquage.panne=false;
      }
      if(this.remorquage.pullOut) pullOut=this.shipper.pullOut1
      if(this.remorquage.debaragePorte) debarragePorte=this.shipper.debarragePorte1
      if(this.remorquage.survoltage) boost=this.shipper.boost1
      if(this.remorquage.essence) essence=this.shipper.essence1
      if(this.remorquage.changementPneu) changementPneu=this.shipper.changementPneu1
      
      this.remorquage.prixBase=panne+accident+pullOut+debarragePorte+boost+essence+changementPneu;
      /*if (this.remorquage.prixBase>this.shipper.accident1) this.remorquage.prixBase=this.shipper.accident1
      else//*/ if(this.remorquage.prixBase==0) this.remorquage.prixBase=this.shipper.panne1
    }
    else if(this.remorquage.typeService.includes('Moyen')){ 
      if(this.remorquage.panne) {
        panne=this.shipper.panne2
        //this.remorquage.accident=false;
      }
      if(this.remorquage.accident) {
        accident=this.shipper.accident2
        //this.remorquage.panne=false;
      }
      if(this.remorquage.pullOut) pullOut=this.shipper.pullOut2
      if(this.remorquage.debaragePorte) debarragePorte=this.shipper.debarragePorte2
      if(this.remorquage.survoltage) boost=this.shipper.boost2
      if(this.remorquage.essence) essence=this.shipper.essence2
      if(this.remorquage.changementPneu) changementPneu=this.shipper.changementPneu2

      this.remorquage.prixBase=panne+accident+pullOut+debarragePorte+boost+essence+changementPneu;
      /*if (this.remorquage.prixBase>this.shipper.accident2) this.remorquage.prixBase=this.shipper.accident2
      else//*/ if(this.remorquage.prixBase==0) this.remorquage.prixBase=this.shipper.panne2
    }
    else if(this.remorquage.typeService.includes('Lourd')){ 
      if(this.remorquage.panne) {
        panne=this.shipper.panne3
        //this.remorquage.accident=false;
      }
      if(this.remorquage.accident) {
        accident=this.shipper.accident3
        //this.remorquage.panne=false;
      }
      if(this.remorquage.pullOut) pullOut=this.shipper.pullOut3
      if(this.remorquage.debaragePorte) debarragePorte=this.shipper.debarragePorte3
      if(this.remorquage.survoltage) boost=this.shipper.boost3
      if(this.remorquage.essence) essence=this.shipper.essence3
      if(this.remorquage.changementPneu) changementPneu=this.shipper.changementPneu3

      this.remorquage.prixBase=panne+accident+pullOut+debarragePorte+boost+essence+changementPneu;
      /*if (this.remorquage.prixBase>this.shipper.accident3) this.remorquage.prixBase=this.shipper.accident3
      else//*/ if(this.remorquage.prixBase==0) this.remorquage.prixBase=this.shipper.panne3
    }
  }
  /*
  calculePrixbase(){
    let panne=0, accident=0, pullOut=0, debarragePorte=0, boost=0, essence=0, changementPneu=0;
    if(this.remorquage.typeService.includes('Leger')){ 
      if(this.remorquage.panne) panne=this.shipper.panne1
      if(this.remorquage.accident) accident=this.shipper.accident1
      if(this.remorquage.pullOut) pullOut=this.shipper.pullOut1
      if(this.remorquage.debaragePorte) debarragePorte=this.shipper.debarragePorte1
      if(this.remorquage.survoltage) boost=this.shipper.boost1
      if(this.remorquage.essence) essence=this.shipper.essence1
      if(this.remorquage.changementPneu) changementPneu=this.shipper.changementPneu1
      
      this.remorquage.prixBase=panne+accident+pullOut+debarragePorte+boost+essence+changementPneu;
      if (this.remorquage.prixBase>this.shipper.accident1) this.remorquage.prixBase=this.shipper.accident1
      else if(this.remorquage.prixBase==0) this.remorquage.prixBase=this.shipper.panne1
    }
    else if(this.remorquage.typeService.includes('Moyen')){ 
      if(this.remorquage.panne) panne=this.shipper.panne2
      if(this.remorquage.accident) accident=this.shipper.accident2
      if(this.remorquage.pullOut) pullOut=this.shipper.pullOut2
      if(this.remorquage.debaragePorte) debarragePorte=this.shipper.debarragePorte2
      if(this.remorquage.survoltage) boost=this.shipper.boost2
      if(this.remorquage.essence) essence=this.shipper.essence2
      if(this.remorquage.changementPneu) changementPneu=this.shipper.changementPneu2

      this.remorquage.prixBase=panne+accident+pullOut+debarragePorte+boost+essence+changementPneu;
      if (this.remorquage.prixBase>this.shipper.accident2) this.remorquage.prixBase=this.shipper.accident2
      else if(this.remorquage.prixBase==0) this.remorquage.prixBase=this.shipper.panne2
    }
    else if(this.remorquage.typeService.includes('Lourd')){ 
      if(this.remorquage.panne) panne=this.shipper.panne3
      if(this.remorquage.accident) accident=this.shipper.accident3
      if(this.remorquage.pullOut) pullOut=this.shipper.pullOut3
      if(this.remorquage.debaragePorte) debarragePorte=this.shipper.debarragePorte3
      if(this.remorquage.survoltage) boost=this.shipper.boost3
      if(this.remorquage.essence) essence=this.shipper.essence3
      if(this.remorquage.changementPneu) changementPneu=this.shipper.changementPneu3

      this.remorquage.prixBase=panne+accident+pullOut+debarragePorte+boost+essence+changementPneu;
      if (this.remorquage.prixBase>this.shipper.accident3) this.remorquage.prixBase=this.shipper.accident3
      else if(this.remorquage.prixBase==0) this.remorquage.prixBase=this.shipper.panne3
    }
  }//*/
  typeServiceChange(type){
    this.remorquage.typeService=type
    /*if(this.remorquage.accident){
      this.remorquage.inclus=0
      this.remorquage.panne=false
      this.remorquage.pullOut=false
      this.remorquage.debaragePorte=false
      this.remorquage.survoltage=false
      this.remorquage.essence=false
      this.remorquage.changementPneu=false
    }
    else if(this.remorquage.panne){
      this.remorquage.accident=false
      this.remorquage.pullOut=false
      this.remorquage.debaragePorte=false
      this.remorquage.survoltage=false
      this.remorquage.essence=false
      this.remorquage.changementPneu=false
    }//*/
    if(!this.remorquage.accident && !this.remorquage.panne){
      this.remorquage.prixKm=0;
      this.remorquage.inclus=0;
    }
    if(this.remorquage.typeService.includes('Leger')){
      //this.remorquage.prixBase=this.prixBase1;
      this.calculePrixbase()
      if(this.remorquage.accident){
        this.remorquage.inclus=0
        this.remorquage.prixKm=this.shipper.prixKm1A;
      }
      else if(this.remorquage.panne){
        this.remorquage.inclus=this.shipper.inclus1;
        this.remorquage.prixKm=this.shipper.prixKm1P;
      }
    }
    else if(this.remorquage.typeService.includes('Moyen')){
      //this.remorquage.prixBase=this.prixBase2;
      this.calculePrixbase()
      if(this.remorquage.accident){
        this.remorquage.inclus=0
        this.remorquage.prixKm=this.shipper.prixKm2A;
      }
      else if(this.remorquage.panne){
        this.remorquage.inclus=this.shipper.inclus2;
        this.remorquage.prixKm=this.shipper.prixKm2P;
      }
    }
    else if(this.remorquage.typeService.includes('Lourd')){
      //this.remorquage.prixBase=this.prixBase3;
      this.calculePrixbase()
      if(this.remorquage.accident){
        this.remorquage.inclus=0
        this.remorquage.prixKm=this.shipper.prixKm3A;
      }
      else if(this.remorquage.panne){
        this.remorquage.inclus=this.shipper.inclus3;
        this.remorquage.prixKm=this.shipper.prixKm3P;
      }
    }
    else{
      this.remorquage.prixBase=100.00;
      this.remorquage.inclus=5;
      this.remorquage.prixKm=2.75;
    }
    this.prixCalcul()
  }

  onReset(){
    this.remorquage=new Remorquage();
  }
  onHistoire(){
    this.modeHistoire=-this.modeHistoire;
    if(this.modeHistoire==1){
      this.remorquagesService.getAllRemorquages().subscribe((data:Array<Remorquage>)=>{
        this.listRqs=[]  //data;
        this.listRqsSent=[]
        this.listRqsFini=[]
        //*
        data.sort((b, a)=>{
          if(a.id>b.id)
            return 1;
          if(a.id<b.id)
            return -1;
          return 0;
        })//*/
        data.forEach(rq=>{
          //if(!rq.sent && !rq.fini) 
          //this.listRqs.push(rq)
          //*
          if(rq.fini) this.listRqsFini.push(rq)
          else if (rq.sent) this.listRqsSent.push(rq)
          else if (rq.valid) this.listRqs.push(rq)//*/
        })
      }, err=>{
        console.log(err)
      })
    }
    else {
      this.remorquage.dateDepart = new Date()
      this.remorquage.timeCall= (new Date().getHours().toString().length==2?new Date().getHours().toString():'0'+new Date().getHours().toString())+':'+ 
        (new Date().getMinutes().toString().length==2?new Date().getMinutes().toString():'0'+new Date().getMinutes().toString())  //"00:00";
    }
  }
  
  async onEnvoyer(){
    this.remorquage.timeCall= (new Date().getHours().toString().length==2?new Date().getHours().toString():'0'+new Date().getHours().toString())+':'+ 
      (new Date().getMinutes().toString().length==2?new Date().getMinutes().toString():'0'+new Date().getMinutes().toString())  //"00:00";

    //if(this.remorquage.telIntervenant!=null && this.remorquage.telIntervenant.length>=10){
      let telSosPrestige= myGlobals.telPrincipal; //"514-728-3785";  // cellphone de cts.solution.transport
      let listeOperateurs : Array<string> = 
      [
        telSosPrestige.replace("-","").replace("-","")+"@txt.bellmobility.ca",
        //telSosPrestige.replace("-","").replace("-","")+"@text.mtsmobility.com",
        telSosPrestige.replace("-","").replace("-","")+"@pcs.rogers.com",
        telSosPrestige.replace("-","").replace("-","")+"@msg.telus.com",
      ];
      let eList:string='';
      listeOperateurs.forEach(telmail=>{
        if(eList=='')
          eList=eList+telmail;
        else
          eList=eList+','+telmail;
      })

      this.em.titre="Demande Express : " + this.remorquage.timeCall + this.titreAjout
      this.em.content='<div><p> '+document.getElementById('tosms').innerHTML + " </p></div>"    
      
      this.em.emailDest=eList  // send this list in string form to java
      if(localStorage.getItem('tonken')!=null){
        this.remorquagesService.saveRemorquages(this.remorquage).subscribe((data:Remorquage)=>{
          this.bankClientsService.envoyerMail(this.em).subscribe(data=>{
            if(this.varsGlobal.language.includes('Francais')){
              alert("Un sms a ete envoye.")  
            }
            if(this.varsGlobal.language.includes('English')){
              alert("An sms has been sent.")  
            }
              this.em.emailDest= myGlobals.emailPrincipal; //"ventesosprestige@gmail.com";//this.remorquage.emailIntervenant
              //this.em.titre="Demande Express : " + this.remorquage.timeCall 
              this.em.content='<div><p> '+document.getElementById('toprint').innerHTML + " </p></div>"    
              this.bankClientsService.envoyerMail(this.em).subscribe(data=>{
                if(this.varsGlobal.language.includes('Francais')){
                  alert("Un courriel a ete envoye aussi.")  
                }
                if(this.varsGlobal.language.includes('English')){
                  alert("An email was also sent.")  
                }
                
                //this.answer=null;
                this.remorquage=new Remorquage();
                //localStorage.clear();  //  erase localstorage after sent sms and email
              }, err=>{
                console.log()
              })
          }, err=>{
            console.log(err)
          })          
        }, 
          err=>{console.log(err)
        })
                
      }
      else{
        const user=this.form.value;
        this.authService.loginDefaultDriver(user).subscribe(resp=> {
          let jwtToken=resp.headers.get('Authorization');
          this.authService.saveTonken(jwtToken);
          this.remorquagesService.saveRemorquages(this.remorquage).subscribe((data:Remorquage)=>{
            this.bankClientsService.envoyerMail(this.em).subscribe(data=>{
              if(this.varsGlobal.language.includes('Francais')){
                alert("Le sms a ete envoye.")
              }
              if(this.varsGlobal.language.includes('English')){
                alert("A sms has been sent.")
              } 
                this.em.emailDest= myGlobals.emailPrincipal;//this.remorquage.emailIntervenant
                //this.em.titre="Demande Express : " + this.remorquage.timeCall 
                this.em.content='<div><p> '+document.getElementById('toprint').innerHTML + " </p></div>"    
                this.bankClientsService.envoyerMail(this.em).subscribe(data=>{
                  
                  if(this.varsGlobal.language.includes('Francais')){
                    alert("Le courriel a ete envoye, aussi.")
                  }
                  if(this.varsGlobal.language.includes('English')){
                    alert("An email was also sent.")
                  }
                this.varsGlobal.userLogs.entreprise='Remorquage Express';
                this.varsGlobal.userLogs.usernameLogin=this.remorquage.telClient2em  // this is email
                this.varsGlobal.userLogs.role=this.remorquage.telClient
                this.varsGlobal.userLogs.loginTime=new Date();
                this.http.get('https://api.ipify.org?format=json').subscribe(async data => {
                  this.varsGlobal.userLogs.ipPublic=data['ip'];
                  await this.geolocation.getCurrentPosition().subscribe(async (data)=>{
                    let geocoding = new GeocodingService()
                    await geocoding.geocode(new google.maps.LatLng(              
                      this.varsGlobal.userLogs.latitude=data.coords.latitude,
                      this.varsGlobal.userLogs.longtitude=data.coords.longitude
                    ))
                    .forEach(
                      (results: google.maps.GeocoderResult[]) => {
                        this.varsGlobal.userLogs.place=results[0].formatted_address;
                      }
                    )            
                    this.userLogsService.saveUserLogs(this.varsGlobal.userLogs).subscribe((data:UserLogs)=>{
                      this.answer=null;
                      this.remorquage=new Remorquage();
                      localStorage.clear();  //  erase localstorage after sent sms and email
                      this.varsGlobal.userLogs = new UserLogs();
                    }, err=>{
                      console.log(err)
                    })
                  },err=>{console.log(err)})
                });
                  //localStorage.clear();  //  erase localstorage after sent sms and email
                }, err=>{
                  console.log()
                })
            }, err=>{
              console.log(err)
            })
          }, err=>{
              console.log(err)
          })
          
        }, err=>{          
          console.log(err);
        });
      }
      
      
  }
  //*
  chauffeurChange(){
    let strings:Array<string>=this.remorquage.nomIntervenant.split("Id.");
    let chId:number =  Number(strings[1])
    this.chauffeurs.forEach(ch=>{
      if(ch.id==chId) 
      {
        this.remorquage.nomIntervenant=ch.nom
        this.remorquage.telIntervenant=ch.tel
        this.remorquage.emailIntervenant=ch.email
      }
    })
    /*
    this.remorquage.nomIntervenant=ch.nom
    this.remorquage.telIntervenant=ch.tel
    this.remorquage.emailIntervenant=ch.email

    let temp = this.remorquage.nomIntervenant
    let strings:Array<string>=this.remorquage.nomIntervenant.split("/");
    this.appUser.idUser=strings[1];
    this.appUser.entrepriseNom = temp.split(this.appUser.idUser)[1]
    if(strings[0]=='Trans') this.listPros2em = this.listShippers
    else if(strings[0]=='Ship') this.listPros2em = this.listTrans//*/
  }//*/
  infoChauffeur(ch:Chauffeur):string{
    this.remorquage.nomIntervenant=ch.nom
    this.remorquage.telIntervenant=ch.tel
    this.remorquage.emailIntervenant=ch.email
    return ch.nom
  }
  logout(){
    localStorage.clear();
    //this.router.navigateByUrl("");
    this.router.navigateByUrl('/transporters/');
    this.router.navigate(['']);
  }
}

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

export interface Entreprise{
  id:number;
  nom:string;
}

export interface LatLngLiteral{
  lat:number,
  lng:number
}
