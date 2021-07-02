import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import {SignaturePad} from 'angular2-signaturepad';
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
import { LoadDetail } from 'src/model/model.loadDetail';
import { LoadDetailsService } from 'src/services/loadDetails.Service';
import { TransportersService } from 'src/services/transporters.service';
import { Transporter } from 'src/model/model.transporter';

@Component({
  selector: 'app-transport-client',
  templateUrl: './transport-client.component.html',
  styleUrls: ['./transport-client.component.css']
})
export class TransportClientComponent implements OnInit {

  imgUrl: string = ''; //  'https://picsum.photos/200/300/?random';
  imageToShow: any;
  isImageLoading: boolean;

  loadDetail:LoadDetail=new LoadDetail();
  loadDetails:Array<LoadDetail>=new Array<LoadDetail>();

  //* pour checkBox list
  formGroup: FormGroup;
  //formGroup01: FormGroup;
  serviceTypes = ["Leger", "Moyen", "Lourd"];
  camionTypes = myGlobals.camionTypes;
  optionTypes = myGlobals.optionTypes;
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

  taxList = myGlobals.taxList; // tax list of provinces' Canada  - example this.taxList['province'].gsthst
  taxProvince  = this.taxList[10]

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
  @ViewChild('SignaturePad') signaturePad: SignaturePad;
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
    
  }
 
  drawStart() {
    //console.log('begin drawing');
  }

  okHandler(){
    // First, we try once more to get detail of this appel whether it was deleted
    // if good, we make save - update
    this.transportsService.getDetailTransport(this.id).subscribe(async data=>{
      this.transport.signature=this.signaturePad.toDataURL()
      this.transportsService.saveTransports(this.transport).subscribe((data:Transport)=>{
        this.transport=data;
      }, 
        err=>{console.log(err)
      })
    }, err=>{
      if(this.varsGlobal.language.includes('English'))
        alert('This #Num'+this.id+' was canceled');
      else alert('Cette #Bon'+this.id+' a ete annule');
      window.close()
    })
  }

  onSelectTax(){
    if(this.transport.taxProvince==null || this.transport.taxProvince.length==0)
    {
      if(this.transporter.taxProvince==null || this.transporter.taxProvince.length==0){
        this.transport.taxProvince=this.provinceList[10] // Quebec is the province by default
        this.taxProvince=this.taxList[10]
      }
      else{ // exist tax province for this transporter
        this.transport.taxProvince=this.transporter.taxProvince
        this.taxList.forEach(tp=>{
          if(tp.id.localeCompare(this.transport.taxProvince)==0)
            this.taxProvince=tp
        })
      }
    }
    else{  // exist tax province for this towing
      this.taxList.forEach(tp=>{
        if(tp.id.localeCompare(this.transport.taxProvince)==0)
          this.taxProvince=tp
      })
    }
    //alert('province: '+this.taxProvince.id +' pst-tvq: '+ this.taxProvince.pst + ' gsthst: ' +this.taxProvince.gsthst)
  }
  
  onSaveHoursWP(){ // save time Waiting and PTO
    // First, we try once more to get detail of this appel whether it was deleted
    // if good, we make save - update
    this.transportsService.getDetailTransport(this.id).subscribe(async data=>{
      this.transportsService.saveTransports(this.transport).subscribe((data:Transport)=>{
        this.transport=data;
      }, 
        err=>{console.log(err)
      })
    }, err=>{
      if(this.varsGlobal.language.includes('English'))
        alert('This #Num'+this.id+' was canceled');
      else alert('Cette #Bon'+this.id+' a ete annule');
      window.close()
    })
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

  transporter: Transporter;
  
  constructor(public transportsService : TransportsService, 
    // public geocoding : GeocodingService, 
    private formBuilder:FormBuilder, public router:Router, 
    public contactsService:ContactsService,
    public shipperservice:ShippersService,
    public bankClientsService:BankClientsService, // use to send email
    public activatedRoute:ActivatedRoute,
    public varsGlobal:VarsGlobal,
    private titleService: Title,
    private datePipe: DatePipe,
    public camionsService:CamionsService,
    private imageService: ImageService,
    public loadDetailsService:LoadDetailsService,
    public transportersService:TransportersService
    ) { 
      // this.id=activatedRoute.snapshot.params['id'];
      let tempId:number = Number(activatedRoute.snapshot.params['id']);
      // console.log('tempId : '+tempId)
      this.id=(tempId+5.00)/100  //(this.remorquage.id*100-5)
      // console.log('this.id : '+this.id)
      //* construct for checkbox list
      const selectAllControl = new FormControl(false);
      //const selectAllControl01 = new FormControl(false);
      const formControls = this.camionTypes.map(control => new FormControl(false));
      const formControls01 = this.optionTypes.map(control => new FormControl(false));
      this.formGroup = this.formBuilder.group({
        optionTypes: new FormArray(formControls01),
        camionTypes: new FormArray(formControls),        
        selectAll: selectAllControl
      });/*/
      this.formGroup01 = this.formBuilder.group({
        optionTypes: new FormArray(formControls01),
        selectAll: selectAllControl01
      });//*/
  }
  deleteLoadDetail(load:LoadDetail){
    this.loadDetails.splice(this.loadDetails.findIndex(x=>x==load), 1); 
    //this.prixChange();
  }
  addLoadDetail(){
    let load:LoadDetail=new LoadDetail();
    load=this.loadDetail
    this.loadDetails.push(load)
    this.dimensionResume()
    /*
    if(load.longueur!=null){
      if(this.transport.longueur!=null)
        this.transport.longueur=this.transport.longueur + (load.longueur*load.quantity)
      else  
        this.transport.longueur=load.longueur*load.quantity
    }
    if(load.poids!=null){
      if(this.transport.poids!=null)
        this.transport.poids=this.transport.poids + (load.poids*load.quantity)
      else  
        this.transport.poids=load.poids*load.quantity
    }//*/
    this.loadDetail=new LoadDetail();
  }
  dimensionResume(){
    this.transport.longueur=0;
    this.transport.poids=0;
    this.loadDetails.forEach(async load=>{
      this.transport.longueur=this.transport.longueur+ (load.longueur*load.quantity)
      this.transport.poids=this.transport.poids+ (load.poids*load.quantity)
      //this.transport.hauteur=this.transport.hauteur+load.hauteur
      //this.transport.largeur=this.transport.largeur+load.largeur
    })
  }

  // on close window
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event){
    localStorage.clear();
    //this.router.navigateByUrl("");
  }//*/
  
  /*/ on focus windows
  @HostListener('window:focus', ['$event'])
  onfocus(event:any):void {
    this.onRefresh()
  }//*/
  
  async ngOnInit() {    
    this.varsGlobal.session='yes'  // to control we are in session
    // begin taking list camions of SOSPrestige - Here 8 is the id of transporter SOSPrestige
    //this.transport.collecterArgent=this.transport.total-this.transport.porterAuCompte
    // await this.camionsService.camionsDeTransporter(8).subscribe((data:Array<Camion>)=>{
    //   //this.camions = data
    //   // this will take camions with gps monitor
    //   this.camions=[];
    //   data.forEach(camion=>{
    //     if((camion.uniteMonitor!=null && camion.monitor!=null) && (camion.uniteMonitor.length!=0 && camion.monitor.length!=0))
    //       this.camions.push(camion)
    //   })
    // }, err=>{
    //   console.log();
    // })
    // end of taking list camion SOSPrestige
    await this.transportsService.getDetailTransport(this.id).subscribe((data:Transport)=>{
      this.transport=data;
      this.transportersService.getDetailTransporter(this.transport.idTransporter)
    .subscribe((data:Transporter)=>{
      this.transporter=data;
      this.onSelectTax(); // get tax province after having transporter
    }), err=>{
      console.log(err)
    };
      this.loadDetailsService.loadDetailsDeTransport(this.id).subscribe((lds:Array<LoadDetail>)=>{
        this.loadDetails=lds;
      }, err=>{
        console.log(err)
      })
      //this.transport.collecterArgent=this.transport.total-this.transport.porterAuCompte
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
        //this.showMap()
      }
    }, err=>{
      console.log(err);
      console.log("Il n'existe pas ce Bon.")
      //window.close();
    })
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
      .map((v, i) => (v==true && i<19) ? this.camionTypes[i].name : null)
      .filter(i => i !== null);
    console.log(selectedCamionTypesNames);
    console.log('selectedCamionTypesNames.toString() : '+selectedCamionTypesNames.toString());
    this.transport.typeCamion = selectedCamionTypesNames.toString();
  }

  onChangeOption() {
    const selectedOptionTypesNames = this.formGroup.value.optionTypes
      .map((v, i) => (v==true && i<16) ? this.optionTypes[i].name : null)
      .filter(i => i !== null);
    console.log(selectedOptionTypesNames);
    console.log('selectedCamionTypesNames.toString() : '+selectedOptionTypesNames.toString());
    this.transport.optionDemande = selectedOptionTypesNames.toString();
  }

  changeUnite(){
    /*
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
    }//*/
    if (this.mode==1){
      this.mode=2; // pouce en cm/0.39370, kg en 2.2046 lb, km en 0.621371 mile 
      this.transport.distance = Math.round(this.transport.distance / 0.621371);
      this.transport.prixKm = Math.round(this.transport.prixKm / 0.621371);
      this.loadDetails.forEach(load=>{
        load.poids=Math.round(load.poids / 2.2046);
        load.longueur=Math.round(load.longueur / 0.39370);
        load.largeur=Math.round(load.largeur / 0.39370);
        load.hauteur=Math.round(load.hauteur / 0.39370);        
      })
      this.dimensionResume();
    }
    else{
      this.mode=1; // cm en pouce
      this.transport.distance = Math.round(this.transport.distance * 0.621371);
      this.transport.prixKm = Math.round(this.transport.prixKm * 0.621371);
      this.loadDetails.forEach(load=>{
        load.poids=Math.round(load.poids * 2.2046);
        load.longueur=Math.round(load.longueur * 0.39370);
        load.largeur=Math.round(load.largeur * 0.39370);
        load.hauteur=Math.round(load.hauteur * 0.39370);
      })
      this.dimensionResume();
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
    let geocoding = new GeocodingService()
    await geocoding.codeAddress(this.transport.origin).forEach(
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
    let geocoding = new GeocodingService()
    await geocoding.codeAddress(this.transport.destination).forEach(
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
  // First, we try once more to get detail of this appel whether it was deleted
  // if good, we make save - update
  this.transportsService.getDetailTransport(this.id).subscribe(async data=>{
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
  }, err=>{
    alert('Cette appel '+this.id+' a ete annule');
    window.close()
  })
}
onWaitingTime(){
  this.transportsService.getDetailTransport(this.id).subscribe(async data=>{
    //this.transport.signature=this.signaturePad.toDataURL()
    this.transportsService.saveTransports(this.transport).subscribe((data:Transport)=>{
      this.transport=data;
    }, 
      err=>{console.log(err)
    })
  }, err=>{
    alert('On ne peut pas modifier temps attente!');
    window.close()
  })
}
async prixCalcul(){
  this.transport.horstax=this.transport.prixBase + this.transport.waitingFee + this.transport.ptoFee
  if((this.transport.distance-this.transport.inclus)>0){
    this.transport.horstax =await this.transport.horstax + (this.transport.distance-this.transport.inclus)*this.transport.prixKm
  }
  if(this.transport.taxable){
    this.onSelectTax();
    this.transport.tps =Math.round(this.transport.horstax*this.taxProvince.gsthst)/100
    this.transport.tvq =Math.round(this.transport.horstax*this.taxProvince.pst)/100
    this.transport.total= Math.round((this.transport.horstax+this.transport.tvq+this.transport.tps)*100)/100
  }
  else{
    this.transport.tps =0.00; //Math.round(this.transport.horstax*0.05*100)/100
    this.transport.tvq =0.00; //Math.round(this.transport.horstax*0.09975*100)/100
    this.transport.total= this.transport.horstax; //Math.round((this.transport.horstax+this.transport.tvq+this.transport.tps)*100)/100
  }
  this.ifAtPlace()
  this.ifDebit()
  this.onWaitingTime();
}
ifDebit(){ // porter au compte
  if(this.transport.debit){
    this.transport.porterAuCompte=this.transport.total
    this.transport.collecterArgent=0;
    this.transport.atPlace=false
    this.transport.byCash=false
    this.transport.byCheck=false
    this.transport.creditCard=false
    this.transport.byInterac=false
    this.transport.transfer=false
  }
  else{
    this.transport.porterAuCompte=0;
  }
}

ifAtPlace(){ // collecter d'argent
  if(this.transport.atPlace){
    this.transport.collecterArgent=this.transport.total
    this.transport.porterAuCompte=0;
    this.transport.debit=false
  }
  else{
    this.transport.collecterArgent=0;
  }
}
// async prixCalcul(){
//   this.transport.horstax=this.transport.prixBase
//   if((this.transport.distance-this.transport.inclus)>0){
//     this.transport.horstax =await this.transport.horstax + (this.transport.distance-this.transport.inclus)*this.transport.prixKm
//   }
//   this.transport.tps =await Math.round(this.transport.horstax*0.05*100)/100
//   this.transport.tvq =await Math.round(this.transport.horstax*0.09975*100)/100
//   this.transport.total=await Math.round((this.transport.horstax+this.transport.tvq+this.transport.tps)*100)/100
//   //this.transport.collecterArgent=await this.transport.total-this.transport.porterAuCompte
// }

prixCalculWithHorsTax(){
  /*
  this.transport.horstax=this.transport.prixBase
  if((this.transport.distance-this.transport.inclus)>0){
    this.transport.horstax =await this.transport.horstax + (this.transport.distance-this.transport.inclus)*this.transport.prixKm
  }//*/
  this.transport.tps =Math.round(this.transport.horstax*0.05*100)/100
  this.transport.tvq =Math.round(this.transport.horstax*0.09975*100)/100
  this.transport.total= Math.round((this.transport.horstax+this.transport.tvq+this.transport.tps)*100)/100
  //Math.round(this.transport.horstax*100)/100+this.transport.tvq+this.transport.tps
  //this.transport.collecterArgent=this.transport.total-this.transport.porterAuCompte
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

  onFini(){
    // First, we try once more to get detail of this appel whether it was deleted
    // if good, we make save - update
    this.transportsService.getDetailTransport(this.id).subscribe(async data=>{
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
    }, err=>{
          alert('Cette appel '+this.id+' a ete annule');
          window.close()
        })
  }

  onCancel(){
    // First, we try once more to get detail of this appel whether it was deleted
    // if good, we make save - update
    this.transportsService.getDetailTransport(this.id).subscribe(async data=>{
      var r = confirm("Etes vous sur d'annuller ce cas ?")
      if(r==true){
        console.log("Le cas est annulle.")
        this.loadDetails.forEach(load=>{
          this.loadDetailsService.deleteLoadDetail(load.id).subscribe(data=>{}, err=>{console.log()})
        })
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
    }, err=>{
          alert('Cette appel '+this.id+' a ete annule');
          window.close()
        })      
  }

  CloseWithWindowOpenTrick()
  {
    let stringsd:string[]=location.href.split('/transport-client/')
    window.open(stringsd[0], '_self');
    window.close();
  }
  
  
  // onFermer(){
  //   this.CloseWithWindowOpenTrick();
  // }

  onFermer(){
    localStorage.clear();
    localStorage.setItem('language', this.varsGlobal.language)
    this.router.navigateByUrl("").then(()=>{location.reload()});
    //location.reload();
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

  async onSave(){
    // First, we try once more to get detail of this appel whether it was deleted
    // if good, we make save - update
    this.transportsService.getDetailTransport(this.id).subscribe(async data=>{
      if(this.mode==2){
        this.changeUnite();  // we must change to mode=1
        await this.transportsService.saveTransports(this.transport).subscribe((data:Transport)=>{
          if(this.transport.id!=null)
            alert("C'est enregistre.")
          this.loadDetails.forEach(async load=>{
            load.idTransport=data.id;
            await this.loadDetailsService.saveLoadDetail(load).subscribe((d:LoadDetail)=>{
              load.id = d.id;
              //to empty the list loadDetails after save them
              //this.loadDetails.splice(this.loadDetails.findIndex(x=>x==load), 1); //test to remove loadDetail dans list loadDetail;
            }, err=>{
              console.log(err);
            })
          })
          this.transport=data;
        }, 
          err=>{console.log(err)
        })
        this.changeUnite();  // we must rechange to mode=2
      }
      else{ // mode=1 already, just save
        this.transportsService.saveTransports(this.transport).subscribe((data:Transport)=>{
          if(this.transport.id!=null)
            alert("C'est enregistre.")
          this.loadDetails.forEach(async load=>{
            load.idTransport=data.id;
            await this.loadDetailsService.saveLoadDetail(load).subscribe((d:LoadDetail)=>{
              load.id = d.id;
              //to empty the list loadDetails after save them
              //this.loadDetails.splice(this.loadDetails.findIndex(x=>x==load), 1); //test to remove loadDetail dans list loadDetail;
            }, err=>{
              console.log(err);
            })
          })
          this.transport=data;
        }, 
          err=>{console.log(err)
        })
      }
    }, err=>{
      alert('Cette appel '+this.id+' a ete annule');
      window.close()
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
  }

  /*/
  typeServiceChange(type){
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
    // First, we try once more to get detail of this appel whether it was deleted
    // if good, we make save - update
    this.transportsService.getDetailTransport(this.id).subscribe(async data=>{
      let stringsd:string[]=location.href.split('/transport-client/')
      if(this.transport.emailIntervenant!=null && this.transport.emailIntervenant.length>10){
        this.em.emailDest=this.transport.emailIntervenant
        this.em.titre="Case numero : " + this.transport.id.toString()
        this.em.content='<div><p> '+document.getElementById('toprint').innerHTML+
        " <br> <a href='"+ stringsd[0] +"/transport-client/"
        + this.transport.id   //1733  // replace by Number of Bon Transport
        +"'><h4>Ouvrir la Facture</h4></a>" +" </p></div>"    
        this.bankClientsService.envoyerMail(this.em).subscribe(data=>{
          //console.log('this.em.titre : ' + this.em.titre)
          //console.log('this.em.emailDest : '+ this.em.emailDest)
          //console.log('this.em.content : ' + this.em.content)
          alert("Le courriel a ete envoye au chauffeur.")
          this.transport.sent=true;
          this.onSave()
          this.gotoTop();
        }, err=>{
          console.log()
        })//*/
      }
      else 
        alert("Checkez le courriel de chauffer, SVP!!!")
    }, err=>{
      alert('Cette appel '+this.id+' a ete annule');
      window.close()
    })    
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
