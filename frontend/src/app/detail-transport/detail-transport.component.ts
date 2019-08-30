import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import {SignaturePad} from 'angular2-signaturepad/signature-pad';
import { GeocodingService } from 'src/services/geocoding.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { ImageService } from 'src/services/image.service';

import { } from 'googlemaps';

import * as myGlobals from 'src/services/globals';
import { Transport } from 'src/model/model.transport';
import { TransportsService } from 'src/services/transports.service';
import { ShippersService } from 'src/services/shippers.service';
import { Shipper } from 'src/model/model.shipper';
import { ContactsService } from 'src/services/contacts.service';
import { Contact } from 'src/model/model.contact';
import { BankClientsService } from 'src/services/bankClients.service';
import { EmailMessage } from 'src/model/model.emailMessage';
import {DatePipe} from '@angular/common';
import { Camion } from 'src/model/model.camion';
import { CamionsService } from 'src/services/camions.service';
import { Title } from '@angular/platform-browser';
import { VarsGlobal } from 'src/services/VarsGlobal';


@Component({
  selector: 'app-detail-transport',
  templateUrl: './detail-transport.component.html',
  styleUrls: ['./detail-transport.component.css']
})
export class DetailTransportComponent implements OnInit {

  imgUrl: string = ''; //  'https://picsum.photos/200/300/?random';
  imageToShow: any;
  isImageLoading: boolean;

  //* pour checkBox list
  formGroup: FormGroup;
  serviceTypes = ["Leger", "Moyen", "Lourd"];
  camionTypes = myGlobals.camionTypes;
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
  mode=1; // Si : mode = 2 on est en cm et kg // Si : mode = 1 en pouce et lbs
  
  transport:Transport=new Transport();

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
  disableInsurrance=false;
  disableEquifax=false;
  disableTransCreditCA=false;
  disableWebInfo=false;
  disableAuthority=false;
  disableTransCreditUS=false;
  id: any;
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
    this.transport.signature=this.signaturePad.toDataURL()
    this.transportsService.saveTransports(this.transport).subscribe((data:Transport)=>{
      this.transport=data;
    }, 
      err=>{console.log(err)
    })
    //window.open(this.signaturePad.toDataURL(), ' blank')
  }

  clearHandler(){
    if(this.signaturePad)
      this.signaturePad.clear();
    this.transport.signature="";
  }
  //end for signature pad

  // funtions for photo
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
       this.imageToShow = reader.result;
    }, false);
 
    if (image) {
       reader.readAsDataURL(image);
    }
   }
 
   getImageFromService() {
       this.isImageLoading = true;
       this.imageService.getImage(this.imgUrl).subscribe(data => {
         this.createImageFromBlob(data);
         this.isImageLoading = false;
       }, error => {
         this.isImageLoading = false;
         console.log(error);
       });
   }
   onFileUpLoad(event){
    //this.imgUrl=event.target.files[0]
    let selectedFile : File=event.target.files[0];
    const reader = new FileReader();
    reader.onload = ()=>{this.imgUrl=reader.result.toString();}
    reader.readAsDataURL(selectedFile)
    console.log('imgUrl : '+this.imgUrl)
    //this.getImageFromService();
   }
  //end funcions for photo
  centerCoord={lat:45.568806, lng:-73.918333}  // 

  today=new Date();
  modeHistoire: number=-1;
  listTrs: Transport[]; // appels waitting
  listTrsSent: Transport[]; // appels sent
  listTrsFini: Transport[]; // appels finished
  contacts: Contact[];
  
  em:EmailMessage=new EmailMessage();

  camions:Array<Camion>;

  constructor(public transportsService : TransportsService, public geocoding : GeocodingService, 
    private formBuilder:FormBuilder, public router:Router, 
    public contactsService:ContactsService,
    public shipperservice:ShippersService,
    public bankClientsService:BankClientsService, // use to send email
    private datePipe: DatePipe,
    public activatedRoute:ActivatedRoute,
    private titleService: Title,
    public varsGlobal:VarsGlobal,
    public camionsService:CamionsService,
    private imageService: ImageService,
    ) { 
      this.id=activatedRoute.snapshot.params['id'];
      //* construct for checkbox list
      const selectAllControl = new FormControl(false);
      const formControls = this.camionTypes.map(control => new FormControl(false));
      this.formGroup = this.formBuilder.group({
        camionTypes: new FormArray(formControls),
        selectAll: selectAllControl
      });//*/
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
    this.onRefresh()
  }
  
  async ngOnInit() {    
    // begin taking list camions of SOSPrestige - Here 8 is the id of transporter SOSPrestige
    this.varsGlobal.session='yes'  // to control we are in session
    //this.transport.collecterArgent=this.transport.total-this.transport.porterAuCompte
    await this.camionsService.camionsDeTransporter(8).subscribe((data:Array<Camion>)=>{
      //this.camions = data
      // this will take camions with gps monitor
      this.camions=[];
      data.forEach(camion=>{
        if((camion.uniteMonitor!=null && camion.monitor!=null) && (camion.uniteMonitor.length!=0 && camion.monitor.length!=0))
          this.camions.push(camion)
      })
    }, err=>{
      console.log();
    })
    // end of taking list camion SOSPrestige
    await this.transportsService.getDetailTransport(this.id).subscribe((data:Transport)=>{
      this.transport=data;
      this.transport.collecterArgent=this.transport.total-this.transport.porterAuCompte
      this.titleService.setTitle('Case : '+this.transport.id + (this.transport.fini? " - fini" : this.transport.sent? " - encours" : ' - en attente'))
      if(!this.transport.fini && this.transport.originLat!=0 && this.transport.destLat!=0){
        this.latLngOrigin= new google.maps.LatLng(
          this.transport.originLat,
          this.transport.originLong                                          
        )
        this.latLngDestination= new google.maps.LatLng(
          this.transport.destLat,
          this.transport.destLong                                          
        )
        this.showMap()
      }
    }, err=>{
      console.log(err);
      console.log("Il n'existe pas ce Bon.")
      //window.close();
    })
    /*
    await this.shipperservice.getAllShippers().subscribe((data:Array<Shipper>)=>{
      this.listShipper=this.filteredShippers=data;
    }, err=>{
      console.log(err);
    })
    var heure= this.transport.dateDepart.getHours().toString().length==2?this.transport.dateDepart.getHours().toString():'0'+this.transport.dateDepart.getHours().toString()
    var minute= this.transport.dateDepart.getMinutes().toString().length==2?this.transport.dateDepart.getMinutes().toString():'0'+this.transport.dateDepart.getMinutes().toString()
    
    this.transport.timeCall=heure+':'+minute
    console.log('this.transport.timeCall : '+this.transport.timeCall)
    this.calculTotalpoints() 
    this.prixCalcul()
    //*/
  }
  
  calculTotalpoints(){ // calculate the base price in the same time
    this.transport.totalpoints = this.longeurPointage(this.transport.longueur, this.mode) 
      + this.largeurPointage(this.transport.largeur, this.mode) 
      + this.hauteurPointage(this.transport.hauteur, this.mode) 
      + this.poidsPointage(this.transport.poids, this.mode);
    this.prixBase(this.transport.totalpoints)
  }

  async gotoDetailTransport(t:Transport){
    window.open("/detail-transport/"+t.id, "_blank")
  }

  gotoTop(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });  // go to top  
  }

  mouseOverInsurance(){
    this.disableInsurrance = !this.disableInsurrance
  }
  mouseOverEquifax(){
    this.disableEquifax = !this.disableEquifax
  }
  mouseOverTransCreditCA(){
    this.disableTransCreditCA = !this.disableTransCreditCA
  }
  mouseOverAuthority(){
    this.disableAuthority = !this.disableAuthority
  }
  mouseOverTransCreditUS(){
    this.disableTransCreditUS = !this.disableTransCreditUS
  }
  mouseOverWebInfo(){
    this.disableWebInfo = !this.disableWebInfo
  }
  onChangeTypeCamion() {
    const selectedCamionTypesNames = this.formGroup.value.camionTypes
      .map((v, i) => (v==true && i<16) ? this.camionTypes[i].name : null)
      .filter(i => i !== null);
    console.log(selectedCamionTypesNames);
    console.log('selectedCamionTypesNames.toString() : '+selectedCamionTypesNames.toString());
    this.transport.typeCamion = selectedCamionTypesNames.toString();
  }

  onChangeOption() {
    const selectedCamionTypesNames = this.formGroup.value.camionTypes
      .map((v, i) => (v==true && i>=16) ? this.camionTypes[i].name : null)
      .filter(i => i !== null);
    console.log(selectedCamionTypesNames);
    console.log('selectedCamionTypesNames.toString() : '+selectedCamionTypesNames.toString());
    this.transport.optionDemande = selectedCamionTypesNames.toString();
  }

  changeUnite(){
    if (this.mode==1){
      this.mode=2; // pouce en cm/0.39370, kg en 2.2046 lb, km en 0.621371 mile 
      this.transport.poids=Math.round(this.transport.poids / 2.2046);
      this.transport.longueur=Math.round(this.transport.longueur / 0.39370);
      this.transport.largeur=Math.round(this.transport.largeur / 0.39370);
      this.transport.hauteur=Math.round(this.transport.hauteur / 0.39370);
      this.transport.distance = Math.round(this.transport.distance / 0.621371);
      this.transport.prixKm = Math.round(this.transport.prixKm / 0.621371);
    }
    else{
      this.mode=1; // cm en pouce
      this.transport.poids=Math.round(this.transport.poids * 2.2046);
      this.transport.longueur=Math.round(this.transport.longueur * 0.39370);
      this.transport.largeur=Math.round(this.transport.largeur * 0.39370);
      this.transport.hauteur=Math.round(this.transport.hauteur * 0.39370);
      this.transport.distance = Math.round(this.transport.distance * 0.621371);
      this.transport.prixKm = Math.round(this.transport.prixKm * 0.621371);
    }
  }
  
  // kg en lbs   ---    lb = kg * 2.2046
  kgEnLbs(poids:number){
    poids = poids * 2.2046;
    console.log(poids);
  }
  
  // cm en pouce  ---   pouce = cm * 0.39370
  cmEnPouce(longeur:number){
    longeur = longeur * 0.39370;
    console.log(longeur);
  }
  
  // km en mile
  kmEnMile(distance:number){
    distance = distance * 0.621371;
    console.log(distance);
  }

  // calcule le pointage de poids (en lbs)
  poidsPointage(poids:number, mode:number){
    if (mode == 2)
      poids = poids * 2.2046;
    if (poids>0 && poids<=10000)    
      return 1;
    if (poids>10000 && poids<=20000)    
      return 2;
    if (poids>20000 && poids<=30000)    
      return 3;
    if (poids>30000 && poids<=40000)    
      return 4;
    if (poids>40000 )    
      return 5;    
    return 0;        
  }

  // calcule le pointage de longueur (en pouce)
  longeurPointage(longeur:number, mode:number){
    if (mode == 2)
      longeur = longeur * 0.39370;
    if (longeur>0 && longeur<=120)    
      return 1;
    if (longeur>121 && longeur<=240)    
      return 2;
    if (longeur>240 && longeur<=360)    
      return 3;
    if (longeur>360 && longeur<=480)    
      return 4;
    if (longeur>480 )    
      return 5;
    return 0;            
  }

  // calcule le pointage de largeur (en pouce)
  largeurPointage(largeur:number, mode:number){
    if (mode == 2)
      largeur = largeur * 0.39370;
    if (largeur>0 && largeur<=48)    
      return 1;
    if (largeur>48 && largeur<=102)    
      return 2;
    if (largeur>102 && largeur<=120)    
      return 4;
    if (largeur>120 && largeur<=144)    
      return 6;
    if (largeur>144)   // on va ajouter encore des paremes
      return 6;
    return 0;            
  }

  // calcule le pointage de hauteur (en pouce)
  hauteurPointage(hauteur:number, mode:number){
    if (mode == 2)
      hauteur = hauteur * 0.39370;
    if (hauteur>0 && hauteur<=92)    
      return 1;
    if (hauteur>92 && hauteur<=120)    
      return 2;
    if (hauteur>120)  // on va ajouter encore des paremes  
      return 4;   
    return 0;            
  }

  // prix base
  prixBase(totalPoints:number){
    this.transport.prixBase = 250.00;
  }
  prixDistance(totalPoints:number){
    
    return 250.00;
  }
  prixToile(totalPoints:number){
    
    return 250.00;
  }
  prixAttendre(totalPoints:number){
    
    return 0.00;
  }
  prixSuplement(totalPoints:number, heurs_supl:number){
    
    return 0.00;
  }
//*
async originChange(){
  //*
  if(this.transport.originProvince!=null){
    // check the province to limit the cities
    if(this.transport.originProvince==this.provinceList[0])
      this.villeListO=this.AlbertaVilles;
    if(this.transport.originProvince==this.provinceList[1])
      this.villeListO=this.BritishColumbiaVilles;        
    if(this.transport.originProvince==this.provinceList[2])
      this.villeListO=this.ManitobaVilles;
    if(this.transport.originProvince==this.provinceList[3])
      this.villeListO=this.NewBrunswickVilles;    
    if(this.transport.originProvince==this.provinceList[4])
      this.villeListO=this.NewfoundlandLabradorVilles;    
    if(this.transport.originProvince==this.provinceList[5])
      this.villeListO=this.NorthwestTerritoriesVilles;
    if(this.transport.originProvince==this.provinceList[6])
      this.villeListO=this.NovaScotiaVilles;
    if(this.transport.originProvince==this.provinceList[7])
      this.villeListO=this.NunavutVilles;
    if(this.transport.originProvince==this.provinceList[8])
      this.villeListO=this.OntarioVilles;
    if(this.transport.originProvince==this.provinceList[9])
      this.villeListO=this.PrinceEdwardIslandVilles;
    if(this.transport.originProvince==this.provinceList[10])
      this.villeListO=this.QuebecVilles;
    if(this.transport.originProvince==this.provinceList[11])
      this.villeListO=this.SaskatchewanVilles;  
    if(this.transport.originProvince==this.provinceList[12])
      this.villeListO=this.YukonVilles;
    // end check the provine
    
    this.transport.origin=this.transport.originAdresse+', '+this.transport.originVille+', '+this.transport.originProvince //+', canada'
    
    await this.geocoding.codeAddress(this.transport.origin).forEach(
      (results: google.maps.GeocoderResult[]) => {
            if(results[0].geometry.location.lat()>0){
              this.latLngOrigin= new google.maps.LatLng(
                //results[0].geometry.location.lat(),
                //results[0].geometry.location.lng()                            
                this.transport.originLat = results[0].geometry.location.lat(),
                this.transport.originLong = results[0].geometry.location.lng()                            
              )
              //alert("En deplacant, attendre 2 secondes svp, puis press OK.")
            }
            else
              alert("Ne pas trouver de coordonnees de ce origin")
    });//*/
    if(this.transport.destination!=null && this.transport.destination.length>0){
      await this.setDistanceTravel(this.transport.origin, this.transport.destination)
      await this.showMap()
      //this.typeServiceChange(this.remorquage.typeService)
    }
  }
  //this.showMap();
}

async destinationChange(){
  //*
  if(this.transport.destProvince!=null){
    // check the province to limit the cities
    if(this.transport.destProvince==this.provinceList[0])
      this.villeListD=this.AlbertaVilles;
    if(this.transport.destProvince==this.provinceList[1])
      this.villeListD=this.BritishColumbiaVilles;        
    if(this.transport.destProvince==this.provinceList[2])
      this.villeListD=this.ManitobaVilles;
    if(this.transport.destProvince==this.provinceList[3])
      this.villeListD=this.NewBrunswickVilles;    
    if(this.transport.destProvince==this.provinceList[4])
      this.villeListD=this.NewfoundlandLabradorVilles;    
    if(this.transport.destProvince==this.provinceList[5])
      this.villeListD=this.NorthwestTerritoriesVilles;
    if(this.transport.destProvince==this.provinceList[6])
      this.villeListD=this.NovaScotiaVilles;
    if(this.transport.destProvince==this.provinceList[7])
      this.villeListD=this.NunavutVilles;
    if(this.transport.destProvince==this.provinceList[8])
      this.villeListD=this.OntarioVilles;
    if(this.transport.destProvince==this.provinceList[9])
      this.villeListD=this.PrinceEdwardIslandVilles;
    if(this.transport.destProvince==this.provinceList[10])
      this.villeListD=this.QuebecVilles;
    if(this.transport.destProvince==this.provinceList[11])
      this.villeListD=this.SaskatchewanVilles;  
    if(this.transport.destProvince==this.provinceList[12])
      this.villeListD=this.YukonVilles;
    // end check the provine
    this.transport.destination=this.transport.destAdresse+', '+this.transport.destVille+', '+this.transport.destProvince  //+', canada'
    await this.geocoding.codeAddress(this.transport.destination).forEach(
      (results: google.maps.GeocoderResult[]) => {
            if(results[0].geometry.location.lat()>0){
              this.latLngDestination= new google.maps.LatLng(
                //results[0].geometry.location.lat(),
                //results[0].geometry.location.lng()     
                this.transport.destLat = results[0].geometry.location.lat(),
                this.transport.destLong = results[0].geometry.location.lng()                                                   
              )
              //alert("En deplacant, attendre 2 secondes svp, puis press OK.")
            }
            else
              alert("Ne pas trouver de coordonnees de cet destination")
    });//*/
    if(this.transport.origin!=null && this.transport.origin.length>0){
      await this.setDistanceTravel(this.transport.origin, this.transport.destination)
      await this.showMap()
      //this.typeServiceChange(this.remorquage.typeService)
    }
  }//this.showMap();
}
onSortDate(data:Array<Transport>){
  data.sort((a, b)=>{
    if(a.dateReserve>b.dateReserve)
      return 1;
    if(a.dateReserve<b.dateReserve)
      return -1;
    return 0;
  })
}
onRefresh(){
  this.transportsService.getAllTransports().subscribe((data:Array<Transport>)=>{
    this.listTrs=[]  //data;
    this.listTrsSent=[]
    this.listTrsFini=[]
    //*
    data.sort((b, a)=>{
      if(a.id>b.id)
        return 1;
      if(a.id<b.id)
        return -1;
      return 0;
    })//*/
    data.forEach(tr=>{
      if(tr.fini) this.listTrsFini.push(tr)
      else if (tr.sent) this.listTrsSent.push(tr)
      else this.listTrs.push(tr)//*/
    })
  }, err=>{
    console.log(err)
  })
}

printBonDeTransport(cmpId){
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
  this.transport.horstax=this.transport.prixBase
  if((this.transport.distance-this.transport.inclus)>0){
    this.transport.horstax =await this.transport.horstax + (this.transport.distance-this.transport.inclus)*this.transport.prixKm
  }
  this.transport.tps =await Math.round(this.transport.horstax*0.05*100)/100
  this.transport.tvq =await Math.round(this.transport.horstax*0.09975*100)/100
  this.transport.total=await Math.round(this.transport.horstax*100)/100+this.transport.tvq+this.transport.tps
  this.transport.collecterArgent=await this.transport.total-this.transport.porterAuCompte
}

prixCalculWithHorsTax(){
  /*
  this.transport.horstax=this.transport.prixBase
  if((this.transport.distance-this.transport.inclus)>0){
    this.transport.horstax =await this.transport.horstax + (this.transport.distance-this.transport.inclus)*this.transport.prixKm
  }//*/
  this.transport.tps =Math.round(this.transport.horstax*0.05*100)/100
  this.transport.tvq =Math.round(this.transport.horstax*0.09975*100)/100
  this.transport.total=Math.round(this.transport.horstax*100)/100+this.transport.tvq+this.transport.tps
  this.transport.collecterArgent=this.transport.total-this.transport.porterAuCompte
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
    title: this.transport.origin
  });
  let markerDestination = new google.maps.Marker({
    position: this.latLngDestination,
    map: this.map,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 4
    },
    title: this.transport.destination
  });

  // centrer la carte
  var bounds = new google.maps.LatLngBounds();
  bounds.extend(this.latLngOrigin);
  bounds.extend(this.latLngDestination);
  this.map.fitBounds(bounds);
  //*/
  //document.getElementById('right-panel').innerHTML=transport.testInnel
  await directionsService.route({
    origin: this.transport.origin,
    destination: this.transport.destination,
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
      res.nom.toLowerCase().indexOf(this.transport.nomEntreprise.toLowerCase())==0 && 
      res.nom.length==this.transport.nomEntreprise.length
      )
    if(ent!=null){
      this.transport.nomEntreprise=ent.nom
      this.prixBase1=ent.prixBase1;
      this.inclus1=ent.inclus1;
      this.prixKm1=ent.prixKm1;
      this.prixBase2=ent.prixBase2;
      this.inclus2=ent.inclus2;
      this.prixKm2=ent.prixKm2;
      this.prixBase3=ent.prixBase3;
      this.inclus3=ent.inclus3;
      this.prixKm3=ent.prixKm3;
      //this.typeServiceChange(this.remorquage.typeService);
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
  
  CloseWithWindowOpenTrick()
  {
    let stringsd:string[]=location.href.split('/detail-transport-express/')
    window.open(stringsd[0]+"/transport", '_self');
    window.close();
  }
  //*/
  onFermer(){
    this.CloseWithWindowOpenTrick();
  }

  onFini(){
    var r = confirm("Etes vous sur que ce cas est fini ?")
    if(r==true){
      console.log("Le cas est termine.")
      this.transport.fini=true;
      this.transportsService.saveTransports(this.transport).subscribe(data=>{
        this.transport=new Transport();
        window.close()
        this.router.navigate(['/transport']);
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
      if(this.transport.id>0){
        this.transportsService.deleteTransport(this.transport.id).subscribe(data=>{
          // commence d'envoyer email
          if(this.transport.emailIntervenant!=null && this.transport.emailIntervenant.length>10){
            this.em.emailDest=this.transport.emailIntervenant
            this.em.titre="Annuler case numero : " + this.transport.id.toString()
            this.em.content='<div><p> '+'Annuler case numero : ' + this.transport.id.toString()+' </p></div>'    
            this.bankClientsService.envoyerMail(this.em).subscribe(data=>{
              alert("Un courriel annulation a ete aussi envoye au chauffeur.")
            }, err=>{
              console.log()
            })
          }
          //*/
          window.close()
          this.router.navigate(['/transport']);
        }, err=>{console.log(err)})
      }
    }
    else {
      console.log('Le cas est continue.')
    }
  }

  onDelete(tr:Transport){
    var r = confirm("Etes vous sur d'annuller ce cas ?")
    if(r==true){
      console.log("Le cas est annulle.")
      if(tr.id>0){
        this.transportsService.deleteTransport(tr.id).subscribe(data=>{
          if(tr.fini)
            this.listTrsFini.splice(this.listTrsFini.indexOf(tr),1)
          else if(tr.sent)
            this.listTrsSent.splice(this.listTrsSent.indexOf(tr),1)
          else this.listTrs.splice(this.listTrs.indexOf(tr),1)
          //this.demandesBlue.splice(this.demandesBlue.indexOf(demande),1); // remove this demande from the list
        }, err=>{console.log(err)})
      }
    }
    else {
      console.log('Le cas est continue.')
    }
  }

  onSave(){
    if(this.transport.id==null){
      this.transport.dateDepart=new Date()
      this.transport.timeCall= (new Date().getHours().toString().length==2?new Date().getHours().toString():'0'+new Date().getHours().toString())+':'+ 
      (new Date().getMinutes().toString().length==2?new Date().getMinutes().toString():'0'+new Date().getMinutes().toString())  //"00:00";
    }
    if(this.mode==2){
      this.changeUnite();
    }
    this.transportsService.saveTransports(this.transport).subscribe((data:Transport)=>{
      this.transport=data;
      alert("C'est enregistre.")
    }, 
      err=>{console.log(err)
    })
  }
  onPrint(heure){    
    console.log(heure)
    console.log('this.transport.timeCall : '+this.transport.timeCall)
    console.log('this.transport.timeResrvation : '+this.transport.timeResrvation)
  }

  //* calculer distance travel en kms
  setDistanceTravel(address1: string, address2:string) { // in km
    let service = new google.maps.DistanceMatrixService;// = new google.maps.DistanceMatrixService()
    // calculate load distance - ld
    service.getDistanceMatrix({
      'origins': [address1], 'destinations': [address2], travelMode:google.maps.TravelMode.DRIVING
    }, (results: any) => {    
      if(this.mode==1){
        this.transport.distance= Math.round((results.rows[0].elements[0].distance.value)*0.621371/1000)  
      }
      else this.transport.distance= Math.round((results.rows[0].elements[0].distance.value)/1000)  
    });  
  }

  dateChange(event){
    //(ngModelChange)="dateChange($event)"
    console.log('event : '+event.target.value.toString())
    
    this.transport.dateReserve = new Date(event.target.value);
    this.transport.dateReserve.setDate(this.transport.dateReserve.getDate()+1)
    
    console.log('this.transport.dateDepart : '+this.transport.dateReserve)
  }
  nomContactChange(event){
    this.transport.nomContact=event.nom
    this.transport.telContact=event.tel
    
    if(this.transport.telContact.indexOf('-')<0)
      {
        let sub1 = this.transport.telContact.substr(0,3)
        let sub2 = this.transport.telContact.substr(3,3)
        let sub3 = this.transport.telContact.substr(6,this.transport.telContact.length-6)
        this.transport.telContact=sub1+'-'+sub2+'-'+sub3
      }

    this.transport.extTelContact=event.extTel
  }
  nomEntrepriseChange(ent){
    this.shipper=ent
    this.transport.nomEntreprise=ent.nom
    this.prixBase1=ent.prixBase1;
    this.inclus1=ent.inclus1;
    this.prixKm1=ent.prixKm1;
    this.prixBase2=ent.prixBase2;
    this.inclus2=ent.inclus2;
    this.prixKm2=ent.prixKm2;
    this.prixBase3=ent.prixBase3;
    this.inclus3=ent.inclus3;
    this.prixKm3=ent.prixKm3;
    //this.typeServiceChange(this.remorquage.typeService);
    this.contactsService.contactsDeShipper(ent.id).subscribe((data:Array<Contact>)=>{
      this.contacts=data;
      console.log('this.contacts : ' + this.contacts)
    }, err=>{
      console.log(err);
    });
  }
  nomEntrepriseInputChange(){
    console.log("this.transport.nomEntreprise : "+this.transport.nomEntreprise) 

    let ent = this.listShipper.find(res=>
      res.nom.includes(this.transport.nomEntreprise) && 
      res.nom.length==this.transport.nomEntreprise.length
      )
    if(ent!=null){
      this.shipper=ent
      this.transport.idEntreprise=ent.id
      this.transport.nomEntreprise=ent.nom
      this.prixBase1=ent.prixBase1;
      this.inclus1=ent.inclus1;
      this.prixKm1=ent.prixKm1;
      this.prixBase2=ent.prixBase2;
      this.inclus2=ent.inclus2;
      this.prixKm2=ent.prixKm2;
      this.prixBase3=ent.prixBase3;
      this.inclus3=ent.inclus3;
      this.prixKm3=ent.prixKm3;
      //this.typeServiceChange(this.remorquage.typeService);
      this.contactsService.contactsDeShipper(ent.id).subscribe((data:Array<Contact>)=>{
        this.contacts=data;
      }, err=>{
        console.log(err);
      });
    }
    else this.shipper=new Shipper()
    this.firstFilteredShipper=this.transport.nomEntreprise
  }

  calculePrixbase(){
    /*/
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
    //*/
  }

  /*/
  typeServiceChange(type){
    this.remorquage.typeService=type
    if(!this.remorquage.accident && !this.remorquage.panne){
      this.remorquage.prixKm=0;
      this.remorquage.inclus=0;
    }
    if(this.remorquage.typeService.includes('Leger')){
      //this.remorquage.prixBase=this.prixBase1;
      this.calculePrixbase()
      if(this.remorquage.accident){
        this.remorquage.inclus=0
        this.remorquage.prixKm=this.shipper.prixKm1;
      }
      else if(this.remorquage.panne){
        this.remorquage.inclus=this.shipper.inclus1;
        this.remorquage.prixKm=this.shipper.prixKm1;
      }
    }
    else if(this.remorquage.typeService.includes('Moyen')){
      //this.remorquage.prixBase=this.prixBase2;
      this.calculePrixbase()
      if(this.remorquage.accident){
        this.remorquage.inclus=0
        this.remorquage.prixKm=this.shipper.prixKm2;
      }
      else if(this.remorquage.panne){
        this.remorquage.inclus=this.shipper.inclus2;
        this.remorquage.prixKm=this.shipper.prixKm2;
      }
    }
    else if(this.remorquage.typeService.includes('Lourd')){
      //this.remorquage.prixBase=this.prixBase3;
      this.calculePrixbase()
      if(this.remorquage.accident){
        this.remorquage.inclus=0
        this.remorquage.prixKm=this.shipper.prixKm3;
      }
      else if(this.remorquage.panne){
        this.remorquage.inclus=this.shipper.inclus3;
        this.remorquage.prixKm=this.shipper.prixKm3;
      }
    }
    else{
      this.remorquage.prixBase=-1.00;
      this.remorquage.inclus=-1.00;
      this.remorquage.prixKm=-1.00;
    }
    this.prixCalcul()
  }
  //*/

  onReset(){
    this.transport=new Transport();
  }

  onHistoire(){
    this.modeHistoire=-this.modeHistoire;
    if(this.modeHistoire==1){
      this.transportsService.getAllTransports().subscribe((data:Array<Transport>)=>{
        this.listTrs=[]  //data;
        this.listTrsSent=[]
        this.listTrsFini=[]
        //*
        data.sort((b, a)=>{
          if(a.id>b.id)
            return 1;
          if(a.id<b.id)
            return -1;
          return 0;
        })//*/
        data.forEach(tr=>{
          if(tr.fini) this.listTrsFini.push(tr)
          else if (tr.sent) this.listTrsSent.push(tr)
          else this.listTrs.push(tr)//*/
        })
      }, err=>{
        console.log(err)
      })
    }
    else {
      this.transport.dateDepart = new Date()
      this.transport.timeCall= (new Date().getHours().toString().length==2?new Date().getHours().toString():'0'+new Date().getHours().toString())+':'+ 
        (new Date().getMinutes().toString().length==2?new Date().getMinutes().toString():'0'+new Date().getMinutes().toString())  //"00:00";
    }
  }
  
  onEnvoyer(){
    let stringsd:string[]=location.href.split('/transport-client/')
    if(this.transport.emailIntervenant!=null && this.transport.emailIntervenant.length>10){
      this.em.emailDest=this.transport.emailIntervenant
      this.em.titre="Case numero : " + this.transport.id.toString()
      this.em.content='<div><p> '+document.getElementById('toprint').innerHTML+
      " <br> <a href='"+stringsd[0]+"/transport-client/"
      + this.transport.id   //1733  // replace by Number of Bon Transport
      +"'><h4>Ouvrir la Facture</h4></a>" +" </p></div>"    
      this.bankClientsService.envoyerMail(this.em).subscribe(data=>{
        //console.log('this.em.titre : ' + this.em.titre)
        //console.log('this.em.emailDest : '+ this.em.emailDest)
        //console.log('this.em.content : ' + this.em.content)
        alert("Le courriel a ete envoye au chauffeur.")
        this.transport.sent=true;
        this.onSave();
        this.gotoTop();
      }, err=>{
        console.log()
      })//*/
    }
    else 
      alert("Checkez le courriel de chauffer, SVP!!!")
  }

  logout(){
    localStorage.clear();
    //this.router.navigateByUrl("");
    //this.router.navigateByUrl('/transporters/');
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