import {Title} from '@angular/platform-browser';
import {SignaturePad} from 'angular2-signaturepad/signature-pad';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GeocodingService } from 'src/services/geocoding.service';
import { Router, ActivatedRoute } from '@angular/router';
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
import {VarsGlobal} from 'src/services/VarsGlobal'
import { CamionsService } from 'src/services/camions.service';
import { Camion } from 'src/model/model.camion';
import { Chauffeur } from 'src/model/model.chauffeur';
import { ChauffeursService } from 'src/services/chauffeurs.service';
import * as FileSaver from "file-saver";
import { Subscription, timer, interval } from 'rxjs';

@Component({
  selector: 'app-detail-remorquage',
  templateUrl: './detail-remorquage.component.html',
  styleUrls: ['./detail-remorquage.component.css']
})
export class DetailRemorquageComponent implements OnInit {

  //* pour checkBox list
  formGroup: FormGroup;
  serviceTypes = ["Leger", "Moyenne", "Lourd"];
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

  shipper=new Shipper();
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
    //'canvasWidth': 250,
    //'canvasHeight': 100,
  };
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
  
  em:EmailMessage=new EmailMessage();
  id:number;
  camions:Array<Camion>;
  chauffeurs: Chauffeur[];
  chauffeur: Chauffeur;
  
vehiculeModeles = []; //myGlobals.d2cmediaacura;
marquesModeles = myGlobals.marquesModeles;
colors = myGlobals.colors

marqueChange(){
    this.vehiculeModeles=[];
    this.marquesModeles.forEach(mm =>{
      if(this.remorquage.marque.includes(mm.marque))
        this.vehiculeModeles=mm.modeles
    })
  }

  constructor(public remorquagesService : RemorquagesService, public geocoding : GeocodingService, 
    private formBuilder:FormBuilder, public router:Router, 
    public contactsService:ContactsService,
    public shipperservice:ShippersService,
    public bankClientsService:BankClientsService, // use to send email
    public activatedRoute:ActivatedRoute,
    private titleService: Title,
    public varsGlobal:VarsGlobal,
    public camionsService:CamionsService,
    public chauffeursService:ChauffeursService,
    ) { 
      this.id=activatedRoute.snapshot.params['id'];
    }

  async ngOnInit() {    
    sessionStorage.setItem('temporary', 'yes') // to control we are in session
    this.varsGlobal.session='yes'  // to control we are in session
    await this.remorquagesService.getDetailRemorquage(this.id).subscribe((data:Remorquage)=>{
      this.remorquage=data;
      if(localStorage.getItem('fullName')!=null && !(this.remorquage.nomDispatch.length>0)) 
        this.remorquage.nomDispatch=localStorage.getItem('fullName')
      //this.remorquage.collecterArgent=this.remorquage.total-this.remorquage.porterAuCompte
      //this.titleService.setTitle('Case : '+this.remorquage.id + 
      this.titleService.setTitle('Case : '+ this.remorquage.marque+' '+ this.remorquage.modele +' ' + this.remorquage.couleur +
      (this.remorquage.fini? " - fini" : this.remorquage.sent? " - encours" : this.remorquage.driverNote.includes("!!Cancelled!!")? " - Annule" : ' - en attente'))

      if(!this.remorquage.fini && this.remorquage.originLat!=0 && this.remorquage.destLat!=0){
        this.latLngOrigin= new google.maps.LatLng(
          this.remorquage.originLat,
          this.remorquage.originLong                                          
        )
        this.latLngDestination= new google.maps.LatLng(
          this.remorquage.destLat,
          this.remorquage.destLong                                          
        )
        // If appel come from a prof - get its price and its contacts
        if(this.remorquage.idEntreprise>0){
          this.shipperservice.getDetailShipper(this.remorquage.idEntreprise).subscribe((data:Shipper)=>{
            this.shipper=data;
            this.contactsService.contactsDeShipper(this.shipper.id).subscribe((data:Array<Contact>)=>{
              this.contacts=data;
            }, err=>{
              console.log(err);
            });
          }, err=>{
            console.log(err);
          })
        }
        
        this.showMap()
      }
    // begin taking list camions of SOSPrestige - Here 8 is the id of transporter SOSPrestige
    this.camionsService.camionsDeTransporter(8).subscribe((data:Array<Camion>)=>{
      //this.camions = data
      // this will take camions with gps monitor
      this.camions=[];
      data.forEach(camion=>{
        if(camion.status && (camion.uniteMonitor!=null && camion.monitor!=null) && (camion.uniteMonitor.length!=0 && camion.monitor.length!=0))
          this.camions.push(camion)
      })
      this.findCamionId(); // to find the truck we have choosen
      this.chauffeursService.chauffeursDeTransporter(8).subscribe((data:Array<Chauffeur>)=>{
        this.chauffeurs=data;
      }, err=>{
        console.log(err);
      });
    }, err=>{
      console.log();
    })
    // end of taking list camion SOSPrestige
    }, err=>{
      console.log(err);
      console.log("Il n'existe pas ce Bon.")
      //window.close();
    })
    
  }
  
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
  }
  problemService(){
    let probSer=" ";
    if(this.remorquage.panne)
      probSer=probSer+"Panne, "
    if(this.remorquage.accident)
      probSer=probSer+"Accident, "
    if(this.remorquage.pullOut)
      probSer=probSer+"PullOut, "
    if(this.remorquage.debaragePorte)
      probSer=probSer+"Debarage Porte, "
    if(this.remorquage.survoltage)
      probSer=probSer+"Survoltage, "
    if(this.remorquage.essence)
      probSer=probSer+"Essence, "
    if(this.remorquage.changementPneu)
      probSer=probSer+"Changement Pneu, "
    return probSer;
  }
  async gotoDetailRemorquage(r:Remorquage){
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
    }
    //this.refreshMap()
  }

  onFileUpLoad(event){
    //this.transport.imgUrl=event.target.files[0]
    //this.transport.imgUrl='';
    let selectedFile : File=event.target.files[0];
    if(selectedFile){
      const reader = new FileReader();
      reader.onload = ()=>{this.remorquage.imgUrl=reader.result.toString();}
      reader.readAsDataURL(selectedFile)
    }
    else this.remorquage.imgUrl='';
    //console.log('transport.imgUrl : '+this.transport.imgUrl)
    //this.getImageFromService();
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
    
    await this.geocoding.codeAddress(this.remorquage.origin).forEach(
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
      await this.showMap()
      //this.typeServiceChange(this.remorquage.typeService)
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
    await this.geocoding.codeAddress(this.remorquage.destination).forEach(
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
      await this.showMap()
      //this.typeServiceChange(this.remorquage.typeService)
    }
  }//this.showMap();
}
/* async refreshMap(){
  //if(this.remorquage.origin!=null && this.remorquage.origin.length>0){
    //await this.setDistanceTravel(this.remorquage.origin, this.remorquage.destination)
    await this.showMap()
    //await this.originChange();
    //await this.destinationChange();
    //this.typeServiceChange(this.remorquage.typeService)
  //}
}//*/

printBonDeRemorquage(cmpId){
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

prixCalcul(){
  this.remorquage.horstax=this.remorquage.prixBase
  if((this.remorquage.distance-this.remorquage.inclus)>0){
    this.remorquage.horstax = this.remorquage.horstax + (this.remorquage.distance-this.remorquage.inclus)*this.remorquage.prixKm
  }
  this.remorquage.tps = Math.round(this.remorquage.horstax*0.05*100)/100
  this.remorquage.tvq = Math.round(this.remorquage.horstax*0.09975*100)/100
  this.remorquage.total=Math.round(this.remorquage.horstax*100)/100+this.remorquage.tvq+this.remorquage.tps
  //this.remorquage.collecterArgent=this.remorquage.total-this.remorquage.porterAuCompte
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
    if(tel.target.value.indexOf('-')<0)
      {
        let sub1 = tel.target.value.substr(0,3)
        let sub2 = tel.target.value.substr(3,3)
        let sub3 = tel.target.value.substr(6,tel.target.value.length-6)
        tel.target.value=sub1+'-'+sub2+'-'+sub3
      }
    //console.log("tel after: " + tel.target.value)
    return tel.target.value;
  }

  async onFini(){
    var r = confirm("Etes vous sur que ce cas est fini ?")
    if(r==true){
      this.onTextExporter(); //  write into text export sage et excel
      await this.printBonDeRemorquage('toprint');  // wait for print first tag html id="toprint"
      console.log("Le cas est termine.")
      this.remorquage.fini=true;
      this.remorquagesService.saveRemorquages(this.remorquage).subscribe(data=>{
        //this.remorquage=new Remorquage();
        //this.titleService.setTitle('Case : '+this.remorquage.id + 
        this.titleService.setTitle('Case : '+ this.remorquage.marque+' '+ this.remorquage.modele +' ' + this.remorquage.couleur +
        (this.remorquage.fini? " - fini" : this.remorquage.sent? " - encours" : ' - en attente'))
        if(this.remorquage.emailContact.length>10){
          let em:EmailMessage=new EmailMessage();
          em.emailDest=this.remorquage.emailContact;  // email of professional
          em.titre= "Succes - " + this.remorquage.marque+' '+ this.remorquage.modele +' ' + this.remorquage.couleur
          em.content='<div><p> '+ em.titre + " <br>" + 
            '<div>'+
              '<div><br></div>'+
              '<div>Merci de votre collaboration.</div>'+
              '<div><br></div>'+
              '<div>Dispatch Marc-Andre Thiffeault </div>'+
              '<font face="garamond,serif"><b></b><font size="4"></font></font>'+
            '</div>'+
            '<div><font face="garamond,serif" size="4"><b>SOS Prestige</b></font></div>'+
            '<div><font face="garamond,serif" size="4"><b>520 Guindon St-Eustache,Qc</b></font></div>'+
            '<div><font face="garamond,serif" size="4"><b>J7R 5B4</b></font></div>'+
            '<div><font face="garamond,serif" size="4"><b><br>450-974-9111</b></font></div>'+
            " </p></div>"
          this.bankClientsService.envoyerMail(em).subscribe(data=>{
            console.log('Le client professionnel recois aussi message succes .')
            window.close();
          }, err=>{console.log(err)})
        }
        else window.close();
        this.router.navigate(['/remorquage']);
      }, err=>{console.log(err)})
    }
    else {
      console.log('Le cas est continue.')
    }
    
  }
  //*/ des fonctionnes 
  CloseWindow()
  {
    console.log('*** 1 ****')
  window.close();
  }

  CloseOpenerWindow()
  {
    console.log('*** 2 ****')
  window.opener = window;
  window.close();
  }

  CloseOpenerHikks()
  {
    console.log('*** 3 ****')
  window.opener = "HikksNotAtHome";
  window.close();
  }

  CloseWithWindowOpenTrick()
  {
    let stringsd:string[]=location.href.split('/detail-remorquage/')  //split('/detail-remorquage-express/')
    window.open(stringsd[0]+"/remorquage", '_self');
    window.close();
  }
  //*/
  onFermer(){
    this.CloseWithWindowOpenTrick();
  }

  onDevoirAttendre(){
    var r = confirm("Etes vous sur de mettre ce cas sur la liste d'attente?")
    if(r==true){
      this.remorquage.sent=false; // dans le cas En Cours en attendre
      this.remorquage.driverNote=""; // dans le cas Annule en attendre
      this.remorquagesService.saveRemorquages(this.remorquage).subscribe(data=>{
        if(this.remorquage.emailContact.length>10){
          let em:EmailMessage=new EmailMessage();
          em.emailDest=this.remorquage.emailContact;  // email of professional
          em.titre= "Devoir attendre - " + this.remorquage.marque+' '+ this.remorquage.modele +' ' + this.remorquage.couleur
          em.content='<div><p> '+ em.titre + " <br>" + 
            '<div>'+
              '<div><br></div>'+
              '<div>Merci de votre comprehension.</div>'+
              '<div><br></div>'+
              '<div>Dispatch Marc-Andre Thiffeault </div>'+
              '<font face="garamond,serif"><b></b><font size="4"></font></font>'+
            '</div>'+
            '<div><font face="garamond,serif" size="4"><b>SOS Prestige</b></font></div>'+
            '<div><font face="garamond,serif" size="4"><b>520 Guindon St-Eustache,Qc</b></font></div>'+
            '<div><font face="garamond,serif" size="4"><b>J7R 5B4</b></font></div>'+
            '<div><font face="garamond,serif" size="4"><b><br>450-974-9111</b></font></div>'+
            " </p></div>"
          this.bankClientsService.envoyerMail(em).subscribe(data=>{
            console.log('Le client professionnel recois aussi message attente .')
            window.close();
          }, err=>{console.log(err)})
        }
        //this.onFermer();
        else window.close();
      }, err=>{console.log(err)})
    }
  }

  onCancel(){
    var r = confirm("Etes vous sur d'annuller ce cas ?")
    if(r==true){
      console.log("Le cas est annulle.")
      if(this.remorquage.id>0){
        this.remorquage.driverNote="!!Cancelled!!";
        this.remorquage.sent=false;
        this.remorquagesService.saveRemorquages(this.remorquage).subscribe(async data=>{          
          // commence d'envoyer email
          if(this.remorquage.emailIntervenant!=null && this.remorquage.emailIntervenant.length>10){
            this.em.emailDest=this.remorquage.emailIntervenant
            //this.em.titre="Annuler case numero : " + this.remorquage.id.toString()
            this.em.titre="Annuler case : " + this.remorquage.marque+' '+ this.remorquage.modele +' ' + this.remorquage.couleur
            //this.em.content='<div><p> '+'Annuler case numero : ' + this.remorquage.id.toString()+' </p></div>'    
            let styleCss = '<style> '
            +' div.cts_rotate {width: 150px; height: 80px; background-color: yellow; -ms-transform: rotate(340deg); -webkit-transform: rotate(340deg); transform: rotate(340deg);} '
            +' </style> '
            // styleCss + 
            this.em.content= ' <div  style="transform: rotate(340); background-color: yellow; width: 150px; height: 100px;">' 
            +'<p> <h4> '+'Annuler case : ' + this.remorquage.marque+' '+ this.remorquage.modele +' ' + this.remorquage.couleur+' </h4> </p>'
            +'</div>'    
            await this.bankClientsService.envoyerMail(this.em).subscribe(data=>{
              alert("Un courriel annulation a ete aussi envoye au chauffeur.")
              if(this.remorquage.emailContact.length>10){
                let em:EmailMessage=new EmailMessage();
                em.emailDest=this.remorquage.emailContact;  // email of professional
                em.titre= "Annule - " + this.remorquage.marque+' '+ this.remorquage.modele +' ' + this.remorquage.couleur
                em.content='<div><p> '+'Vous avez '+ em.titre + " <br>" + 
                  '<div>'+
                    '<div><br></div>'+
                    //'<div>Merci de votre collaboration.</div>'+
                    //'<div><br></div>'+
                    '<div>Dispatch Marc-Andre Thiffeault </div>'+
                    '<font face="garamond,serif"><b></b><font size="4"></font></font>'+
                  '</div>'+
                  '<div><font face="garamond,serif" size="4"><b>SOS Prestige</b></font></div>'+
                  '<div><font face="garamond,serif" size="4"><b>520 Guindon St-Eustache,Qc</b></font></div>'+
                  '<div><font face="garamond,serif" size="4"><b>J7R 5B4</b></font></div>'+
                  '<div><font face="garamond,serif" size="4"><b><br>450-974-9111</b></font></div>'+
                  " </p></div>"
                this.bankClientsService.envoyerMail(em).subscribe(data=>{
                  console.log('Le client professionnel recois aussi message annulation .')
                  window.close();
                }, err=>{console.log(err)})
              }
              
              this.CloseWithWindowOpenTrick();
            }, err=>{
              console.log()
            })
            //this.CloseWithWindowOpenTrick();
          }
          //*/
          //else 
          else {
            console.log('Case cancelled - We are trying to send confirmation to client pro.')
            if(this.remorquage.emailContact.length>10){
              console.log("Case cancelled - Emails' pro is valid.")
              let em:EmailMessage=new EmailMessage();
              em.emailDest=this.remorquage.emailContact;  // email of professional
              em.titre= "Annule - " + this.remorquage.marque+' '+ this.remorquage.modele +' ' + this.remorquage.couleur
              em.content='<div><p> '+'Vous avez '+ em.titre + " <br>" + 
                '<div>'+
                  '<div><br></div>'+
                  //'<div>Merci de votre collaboration.</div>'+
                  //'<div><br></div>'+
                  '<div>Dispatch Marc-Andre Thiffeault </div>'+
                  '<font face="garamond,serif"><b></b><font size="4"></font></font>'+
                '</div>'+
                '<div><font face="garamond,serif" size="4"><b>SOS Prestige</b></font></div>'+
                '<div><font face="garamond,serif" size="4"><b>520 Guindon St-Eustache,Qc</b></font></div>'+
                '<div><font face="garamond,serif" size="4"><b>J7R 5B4</b></font></div>'+
                '<div><font face="garamond,serif" size="4"><b><br>450-974-9111</b></font></div>'+
                " </p></div>"
              await this.bankClientsService.envoyerMail(em).subscribe(data=>{
                console.log('Le client professionnel recois aussi message annulation.')
                window.close();
              }, err=>{console.log(err)})
            }
            else this.CloseWithWindowOpenTrick();
          }
            //this.CloseWithWindowOpenTrick();
        }, err=>{console.log(err)})
      }
    }
    else {
      console.log('Le cas est continue.')
    }
  }

  onDelete(){
    var r = confirm("Etes vous sur de supprimer ce cas ?")
    if(r==true){
      console.log("Le cas est supprime.")
      if(this.remorquage.id>0){
        this.remorquagesService.deleteRemorquage(this.remorquage.id).subscribe(data=>{
          window.close();
          close();
        }, err=>{console.log(err)})
      }
    }
    else {
      console.log('Le cas ne peut pas supprimer.')
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
    this.remorquagesService.saveRemorquages(this.remorquage).subscribe((data:Remorquage)=>{
      //this.remorquage=data;
    }, 
      err=>{console.log(err)
    })
  }

  onSavePlusAlert(){
    this.onSave();
    alert("C'est enregistre." );
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
      this.typeServiceChange(this.remorquage.typeService)
    });  
  }

  // dateChange(event){
  //   //(ngModelChange)="dateChange($event)"
  //   console.log('event : '+event.target.value.toString())
  //   //this.remorquage.dateReserve = new Date(this.datePipe.transform(event.target.value,"yyyy-MM-dd"));
  //   this.remorquage.dateReserve = new Date(event.target.value);
  //   this.remorquage.dateReserve.setDate(this.remorquage.dateReserve.getDate())//+1)
  //   //this.remorquage.dateDepart=event.value;
  //   console.log('this.remorquage.dateDepart : '+this.remorquage.dateReserve)
  // }

  dateChange(event){
    this.remorquage.dateReserve =event.target.value // new Date(event.target.value);
  }
  
  nomContactChange(event){
    this.remorquage.nomContact=event.nom
    this.remorquage.telContact=event.tel
    //console.log('this.remorquage.telContact : '+ this.remorquage.telContact)
    if(this.remorquage.telContact.indexOf('-')<0)
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
    else this.shipper=new Shipper()
    this.firstFilteredShipper=this.remorquage.nomEntreprise
  }
  ifAccident(){
    if(this.remorquage.accident)
      this.remorquage.panne=false
    this.typeServiceChange(this.remorquage.typeService)
  }
  ifPanne(){
    if(this.remorquage.panne)
      this.remorquage.accident=false
    this.typeServiceChange(this.remorquage.typeService)
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
    else if(this.remorquage.typeService.includes('Moyenne')){ 
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
    else if(this.remorquage.typeService.includes('Moyenne')){
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
      this.remorquage.prixBase=-1.00;
      this.remorquage.inclus=-1.00;
      this.remorquage.prixKm=-1.00;
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
          else this.listRqs.push(rq)//*/
        })
      }, err=>{
        console.log(err)
      })
    }
  }
  
  onEnvoyer(){
    if(this.remorquage.emailIntervenant!=null && this.remorquage.emailIntervenant.length>10){
      let stringsd:string[]=location.href.split('/detail-remorquage')
      this.em.emailDest=this.remorquage.emailIntervenant
      //this.em.titre="Case numero : " + this.remorquage.id.toString()
      this.em.titre="Case : " + this.remorquage.marque+' '+ this.remorquage.modele +' ' + this.remorquage.couleur
      this.em.content='<div><p> '+document.getElementById('toprint').innerHTML+
      " <br> <a href='"+stringsd[0]+"/remorquage-client/"
      + this.remorquage.id   //1733  // replace by Number of Bon Remorquage
      +"'><h4>Ouvrir la Facture</h4></a>" +" </p></div>"    
      this.bankClientsService.envoyerMail(this.em).subscribe(data=>{
        //console.log('this.em.titre : ' + this.em.titre)
        //console.log('this.em.emailDest : '+ this.em.emailDest)
        //console.log('this.em.content : ' + this.em.content)
        alert("Le courriel a ete envoye au chauffeur.")
        if(this.remorquage.emailContact.length>10){
          let em:EmailMessage=new EmailMessage();
          em.emailDest=this.remorquage.emailContact;  // email of professional
          em.titre= "Encours traitement - " + this.remorquage.marque+' '+ this.remorquage.modele +' ' + this.remorquage.couleur
          em.content='<div><p> '+ em.titre + " <br>" + 
            '<div>'+
              '<div><br></div>'+
              '<div>Merci de votre collaboration.</div>'+
              '<div><br></div>'+
              '<div>Dispatch Marc-Andre Thiffeault </div>'+
              '<font face="garamond,serif"><b></b><font size="4"></font></font>'+
            '</div>'+
            '<div><font face="garamond,serif" size="4"><b>SOS Prestige</b></font></div>'+
            '<div><font face="garamond,serif" size="4"><b>520 Guindon St-Eustache,Qc</b></font></div>'+
            '<div><font face="garamond,serif" size="4"><b>J7R 5B4</b></font></div>'+
            '<div><font face="garamond,serif" size="4"><b><br>450-974-9111</b></font></div>'+
            " </p></div>"
          this.bankClientsService.envoyerMail(em).subscribe(data=>{
            console.log('Le client professionnel recois aussi .')
          }, err=>{console.log(err)})
        }
        this.remorquage.sent=true;
        this.onSave();
        //this.titleService.setTitle('Case : '+this.remorquage.id + 
        this.titleService.setTitle('Case : '+ this.remorquage.marque+' '+ this.remorquage.modele +' ' + this.remorquage.couleur +
        (this.remorquage.fini? " - fini" : this.remorquage.sent? " - encours" : ' - en attente'))
      }, err=>{
        console.log()
      })//*/
      window.scroll({ 
        top: 0, 
        left: 0, 
        behavior: 'smooth' 
      });  // go to top  
    }
    else 
      alert("Checkez le courriel de chauffer, SVP!!!")
  }
  
  ifDebit(){ // porter au compte
    if(this.remorquage.debit){
      this.remorquage.porterAuCompte=this.remorquage.total
      this.remorquage.collecterArgent=0;
      this.remorquage.atPlace=false
      this.remorquage.byCash=false
      this.remorquage.byCheck=false
      this.remorquage.creditCard=false
      this.remorquage.byInterac=false
      this.remorquage.transfer=false
    }
    else{
      this.remorquage.porterAuCompte=0;
    }
  }
  
  ifAtPlace(){ // collecter d'argent
    if(this.remorquage.atPlace){
      this.remorquage.collecterArgent=this.remorquage.total
      this.remorquage.porterAuCompte=0;
      this.remorquage.debit=false
    }
    else{
      this.remorquage.collecterArgent=0;
    }
  }

  async onExporterSage50(){
    //let text=await document.getElementById(cmpId).innerHTML
    console.log('this.remorquage.dateReserve : '+this.remorquage.dateReserve.toString())
    let yyyymmdd= this.remorquage.dateReserve.toString().split('-')
    let date = yyyymmdd[2]
    let month = yyyymmdd[1]
    let year = yyyymmdd[0]
    let dateSage=month+'-'+date+'-'+year
    let po = this.remorquage.numPO
    let invoiceNo = this.remorquage.id  // only use this invoiceNo when the Sage50 unse this invoiceNo
    console.log('dateSage : '+dateSage)
    
    let textSage=
        '<Version>\r\n'+  // ne pas changer
        '"12001","1"\r\n'+  // ne pas changer
        '</Version>\r\n'+  // ne pas changer
        '<SalInvoice>\r\n'+  // ne pas changer
        
        '"'+(this.remorquage.nomEntreprise.length>1 ? this.remorquage.nomEntreprise : 'occasionnel')+'"'+ '\r\n'+  // non client  //"nom4"
        // quantite - PO - FacNo - date - payer apres - source payer - total avec tax - frais rammaser
        //avec remorquage quantite=1
        //'"1",,,"1-15-2020","0",,"34492.00","0.00"\r\n'+
        '"1","'+po+'",,"'+dateSage+'","0",,"'+this.remorquage.total+'","0.00"\r\n'+
        // article No/name - quantity - prix - montant sans tax - table de taxation
        '"Remorquage","0.0000","0.0000","'+this.remorquage.horstax+'","TPS/TVH","0","1","5.00","'+this.remorquage.tps+'","TVQ","0","1","9.9750","'+this.remorquage.tvq+'"\r\n'+
        //'"Rm_Tr","0.0000","0.0000","15000.00","TPS/TVH","0","1","5.00","750.00","TVQ","0","1","9.9750","1496.00"\r\n'+
        
        '</SalInvoice>\r\n'  // ne pas changer
    
    // 
    // '
    //console.log('text to write to file : ' + text)
    let blob = new Blob([textSage], {
      //type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-16le"
      type: "text/plain;charset=utf-8"
    });
    let filenameExport = this.remorquage.dateReserve+(this.remorquage.nomEntreprise.length>1 ? this.remorquage.nomEntreprise : 'occasionnel')
    FileSaver.saveAs(blob, filenameExport+"-export.IMP");   
  }

  async onExporterExcel(){
    console.log('this.remorquage.dateReserve : '+this.remorquage.dateReserve.toString())
    let yyyymmdd= this.remorquage.dateReserve.toString().split('-')
    let date = yyyymmdd[2]
    let month = yyyymmdd[1]
    let year = yyyymmdd[0]
    let dateExcel= date+'-'+month+'-'+year
    let po = this.remorquage.numPO
    let invoiceNo = "" //  this.remorquage.id  // only use this invoiceNo when the Sage50 unse this invoiceNo
    console.log('dateExcel : '+dateExcel)
    
    let textExcel=
        // "000123","1-14-2020","Customer 1","34492.00","Maison Test"
        '"","'+dateExcel+'","'+(this.remorquage.nomEntreprise.length>1 ? this.remorquage.nomEntreprise : 'occasionnel')+'","'+this.remorquage.total+'","'+this.remorquage.nomIntervenant+'"'+ '\r\n'

        // '"'+(this.remorquage.nomEntreprise.length>1 ? this.remorquage.nomEntreprise : 'occasionnel')+'"'+ '\r\n'+  // non client  //"nom4"
        // '"1","'+invoiceNo+'",,"'+dateExcel+'","0",,"'+this.remorquage.total+'","0.00"\r\n'+
        
        // '"Remorquage","0.0000","0.0000","'+this.remorquage.horstax+'","TPS/TVH","0","1","5.00","'+this.remorquage.tps+'","TVQ","0","1","9.9750","'+this.remorquage.tvq+'"\r\n'+
        
        // '</SalInvoice>\r\n'  // ne pas changer
    
    // 
    // '
    //console.log('text to write to file : ' + text)
    let blob = new Blob([textExcel], {
      //type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-16le"
      type: "text/plain;charset=utf-8"
    });
    let filenameExport = this.remorquage.dateReserve+(this.remorquage.nomEntreprise.length>1 ? this.remorquage.nomEntreprise : 'occasionnel')
    FileSaver.saveAs(blob, filenameExport+"-export.txt");   
  }

  onExporter(){
    this.onExporterSage50();
    this.onExporterExcel();
  }

  async onTextSage50(){
    let yyyymmdd= this.remorquage.dateReserve.toString().split('-')
    let date = yyyymmdd[2]
    let month = yyyymmdd[1]
    let year = yyyymmdd[0]
    let dateSage=month+'-'+date+'-'+year
    let po = this.remorquage.numPO
    let invoiceNo = this.remorquage.id  // only use this invoiceNo when the Sage50 unse this invoiceNo

    this.remorquage.sage=
      //'<Version>\r\n'+  // ne pas changer
      //'"12001","1"\r\n'+  // ne pas changer
      //'</Version>\r\n'+  // ne pas changer
      '<SalInvoice>\r\n' + //  '**fin**'+  // ne pas changer
      
      '"'+(this.remorquage.nomEntreprise.length>1 ? this.remorquage.nomEntreprise : 'occasionnel')+'"'+ '\r\n'+ //'**fin**'+  // non client  //"nom4"
      // quantite - PO - FacNo - date - payer apres - source payer - total avec tax - frais rammaser
      //avec remorquage quantite=1
      //'"1",,,"1-15-2020","0",,"34492.00","0.00"\r\n'+
      '"1","'+po+'",,"'+dateSage+'","0",,"'+this.remorquage.total+'","0.00"\r\n'+ //'**fin**'+
      // article No/name - quantity - prix - montant sans tax - table de taxation
      '"Remorquage","0.0000","0.0000","'+this.remorquage.horstax+'","TPS/TVH","0","1","5.00","'+this.remorquage.tps+'","TVQ","0","1","9.9750","'+this.remorquage.tvq+'"\r\n'+ //'**fin**'+
      //'"Rm_Tr","0.0000","0.0000","15000.00","TPS/TVH","0","1","5.00","750.00","TVQ","0","1","9.9750","1496.00"\r\n'+
      
      '</SalInvoice>\r\n' //+'**fin**'  // ne pas changer
  }

  async onTextExcel(){
    let yyyymmdd= this.remorquage.dateReserve.toString().split('-')
    let date = yyyymmdd[2]
    let month = yyyymmdd[1]
    let year = yyyymmdd[0]
    let dateExcel= date+'-'+month+'-'+year
    let po = this.remorquage.numPO
    let invoiceNo = "" //  this.remorquage.id  // only use this invoiceNo when the Sage50 unse this invoiceNo
    
    this.remorquage.excel=
      '"","'+dateExcel+'","'+(this.remorquage.nomEntreprise.length>1 ? this.remorquage.nomEntreprise : 'occasionnel')+'","'+this.remorquage.total+'","'+this.remorquage.nomIntervenant+'"\r\n'  //+'**fin**'
  }

  onTextExporter(){
    this.onTextSage50();
    this.onTextExcel();
  }

  // for camion on map
  carte=-1;
  carteText="Voir le camion"
  subscription : Subscription;
  marker=new google.maps.Marker();
  camion:Camion=new Camion();
  idCamion:any;

  onPress(id:number){
    this.carte=-this.carte;
    if(this.carte==-1){
      this.carteText='Mettre sur la map'
      this.marker.setMap(null);
      this.subscription.unsubscribe();
    }
    else{
      this.carteText='Supprimer sur la map'
      var numbers = timer(2000);
      numbers.subscribe(x =>{
        this.camionsService.getDetailCamion(this.camion.id).subscribe((data:Camion)=>{
          this.camion=data;
          if(data.status && (data.uniteMonitor!=null && data.monitor!=null) && (data.monitor.length!=0 && data.monitor.length!=0)){
            //this.latitude = this.camion.latitude;
            //this.longitude= this.camion.longtitude
            //this.marker.setMap(null);
            let location1 = new google.maps.LatLng(data.latitude, data.longtitude);
            let mapProp = {
              center: new google.maps.LatLng(data.latitude, data.longtitude),
              zoom: 15,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            //this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
            this.marker = new google.maps.Marker({
              position: location1,
              map: this.map,
              //icon: "http://maps.google.com/mapfiles/kml/shapes/truck.png",
              title: data.unite,
              icon: {
                //url:"http://maps.google.com/mapfiles/kml/shapes/truck.png",
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale:4,
                rotation:data.direction,
                fillOpacity: 1,
                fillColor: "#FFFFFF",
                strokeWeight: 2,
                strokeColor: "red",
              },
              
            });
            this.infoWindow = new google.maps.InfoWindow;
            //*  
            this.marker.addListener('click', (event)=>{
              var contentString:string=' Vitesse : ' + data.speed;
              if(data.stopDuration>0)
                contentString='Arrete depuis : ' + this.showStopDuration(data.stopDuration)
              // Replace the info window's content and position.
              this.infoWindow.setContent(contentString);
              this.infoWindow.setPosition(event.latLng);
              this.infoWindow.open(this.map);///
            })//*/
            /*
            this.infoWindow.setPosition(new google.maps.LatLng( this.camion.latitude, this.camion.latitude));
            this.infoWindow.open(this.map);//*/
            //console.log('this.camion.uniteMonotor  + this.camion.monitor : '+this.camion.uniteMonitor +' + '+ this.camion.monitor);
            const source = interval(60000);
            this.subscription=source.subscribe(val=>{this.getLocalisation()})  
          }
          else
            alert("Ce camion n'est pas suivi gps")
        }, err=>{
          console.log();
        })//*/
      })  
    }
  }
  showStopDuration(stopDuration:number){
    let duration='';
    let days =  Number.parseInt((stopDuration/1440).toString()) +' jour(s) '
    let hours = Number.parseInt(((stopDuration%1440)/60).toString()) +' heure(s) '
    let minutes = ((stopDuration%1440)%60).toString() +' minute(s) '    
    if((stopDuration/1440)>=1)
      duration = duration+days;
    if(((stopDuration%1440)/24)>=1)
      duration=duration+hours
    duration=duration+minutes
    return duration;
  }
  
  getLocalisation(){
    this.camionsService.getDetailCamion(this.camion.id).subscribe((data:Camion)=>{
      console.log("from camion every 1 minute")
      this.marker.setMap(null);
      let location1 = new google.maps.LatLng(data.latitude, data.longtitude);
      this.marker = new google.maps.Marker({
        position: location1,
        map: this.map,
        title: data.unite,
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale:4,
          rotation:data.direction,
          fillOpacity: 1,
          fillColor: "#FFFFFF",
          strokeWeight: 2,
          strokeColor: "red",
        },
      });
      this.infoWindow = new google.maps.InfoWindow;
      this.marker.addListener('click', (event)=>{
        var contentString:string=' Vitesse : ' + this.camion.speed;
        if(data.stopDuration>0)
          contentString='Arrete depuis : ' + this.showStopDuration(data.stopDuration)
        this.infoWindow.setContent(contentString);
        this.infoWindow.setPosition(event.latLng);
        this.infoWindow.open(this.map);
      })
    }, err=>{
      console.log();
    })
  }
  async camionChange(){
    let strings:Array<string>=this.remorquage.camionAttribue.split("Id.");
    if(strings.length>1){
      let cId:number =  Number(strings[1])
      await this.camions.forEach(c=>{
        if(c.id==cId) 
        {
          this.camion=c;
          this.remorquage.camionAttribue = c.unite.trim() +' - ' +c.marque.trim() +' ' +c.modele.trim()
        }
      })
      if(cId!=this.camion.id)
        this.camion=null;
    }
    else this.camion=null;
  }
  
  async findCamionId(){
    //console.log("this.remorquage.camionAttribue : "+ this.remorquage.camionAttribue)
    await this.camions.forEach(c=>{
      //console.log("c.unite +' - ' +c.marque +'  ' +c.modele : "+ c.unite.trim() +' - ' +c.marque.trim() +' ' +c.modele.trim())
      if(this.remorquage.camionAttribue.includes(c.unite.trim() +' - ' +c.marque.trim() +' ' +c.modele.trim()) &&
       this.remorquage.camionAttribue.length== (c.unite.trim() +' - ' +c.marque.trim() +' ' +c.modele.trim()).length) 
      {
        this.camion=c;
        //console.log("find the truck : "+ this.camion.unite)
      }
    })
  }
  // end of show camion on map

  
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
