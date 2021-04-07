import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import {SignaturePad} from 'angular2-signaturepad/signature-pad';
import { GeocodingService } from 'src/services/geocoding.service';
import { Router } from '@angular/router';
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
import { LoadDetail } from 'src/model/model.loadDetail';
import { LoadDetailsService } from 'src/services/loadDetails.Service';
import { Chauffeur } from 'src/model/model.chauffeur';
import { ChauffeursService } from 'src/services/chauffeurs.service';
import { VarsGlobal } from 'src/services/VarsGlobal';
import { TransportersService } from 'src/services/transporters.service';
import { Transporter } from 'src/model/model.transporter';
import { LoadFrequentsService } from 'src/services/loadFrequents.Service';
import { LoadFrequent } from 'src/model/model.loadFrequent';
import { Itineraire } from 'src/model/model.itineraire';
import { ItinerairesService } from 'src/services/itineraires.service';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';

@Component({
  selector: 'app-transport-pro',
  templateUrl: './transport-pro.component.html',
  styleUrls: ['./transport-pro.component.css']
})
export class TransportProComponent implements OnInit {

  //imgUrl: string = ''; //  'https://picsum.photos/200/300/?random';
  imageToShow: any;
  isImageLoading: boolean;

  loadDetail:LoadDetail=new LoadDetail();
  loadDetails:Array<LoadDetail>=new Array<LoadDetail>();

  loadFrequent:LoadFrequent=new LoadFrequent();
  loadFrequents:Array<LoadFrequent>=new Array<LoadFrequent>();

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

  @ViewChild("placesRef") placesRef : GooglePlaceDirective;
  options={
    types: [],
    componentRestrictions: { country: ["CA","US"] }
  }
  public async handleAddressOriginChange(address: Address) {
    // console.log('Before formatted - this.transport.origin: '+this.transport.origin)
    if (this.originSimpleChangeBusy){
      // console.log("destinationSimpleChangeBusy, we must sleep 3 seconds")
      await this.sleep(1000);
      this.handleAddressOriginChange(address)
      // console.log("After having Sleeped 3 seconds, destinationSimpleChangeBusy: " + this.destinationSimpleChangeBusy)
    }
    else{
      // Do some stuff
      // let adr:any
      this.transport.origin= await address.formatted_address;
      if(!this.varsGlobal.addressCookie.includes(this.transport.origin)){
        this.varsGlobal.addressCookie = this.varsGlobal.addressCookie + this.transport.origin + ';;-;; '
        this.varsGlobal.addressCookieToList.push(this.transport.origin)
      }
      // console.log('After formatted - this.transport.origin: '+this.transport.origin)
      //console.log('adresse: '+adr)
      // console.log('this.transport.origin: '+ this.transport.origin)
      this.originSimpleChange()
    }
    
  }

  public async handleAddressDestinationChange(address: Address) {
    // console.log('Before formatted - this.transport.destination: '+this.transport.destination)
    if (this.destinationSimpleChangeBusy){
      // console.log("destinationSimpleChangeBusy, we must sleep 3 seconds")
      await this.sleep(1000);
      this.handleAddressDestinationChange(address)
      // console.log("After having Sleeped 3 seconds, destinationSimpleChangeBusy: " + this.destinationSimpleChangeBusy)
    }
    else{
      // Do some stuff
      // let adr:any
      this.transport.destination=await address.formatted_address;
      if(!this.varsGlobal.addressCookie.includes(this.transport.destination)){
        this.varsGlobal.addressCookie = this.varsGlobal.addressCookie + this.transport.destination + ';;-;; '
        this.varsGlobal.addressCookieToList.push(this.transport.destination)
      }
      // console.log('After formatted - this.transport.destination: '+this.transport.destination)
      //console.log('adresse: '+adr)
      // console.log('this.transport.destination: '+this.transport.destination)
      this.destinationSimpleChange()
    }
  }

  disableInsurrance=false;
  disableEquifax=false;
  disableTransCreditCA=false;
  disableWebInfo=false;
  disableAuthority=false;
  disableTransCreditUS=false;
  modeGestionAppel: number = 2;
  id: number;
  transporter: Transporter;
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
    //window.open(this.signaturePad.toDataURL(), ' blank')
  }

  clearHandler(){
    if(this.signaturePad)
      this.signaturePad.clear();
    this.transport.signature="";
  }
  //end for signature pad
  
  appelsEncours(){
    this.modeGestionAppel=2
  }
  appelsAttentes(){
    this.modeGestionAppel=1
  }
  appelsFinis(){
    this.modeGestionAppel=3
  }
  appelsAnnules(){
    this.modeGestionAppel=4
  }
  
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
       this.imageService.getImage(this.transport.imgUrl).subscribe(data => {
         this.createImageFromBlob(data);
         this.isImageLoading = false;
       }, error => {
         this.isImageLoading = false;
         console.log(error);
       });
   }
   onFileUpLoad(event){
    //this.transport.imgUrl=event.target.files[0]
    //this.transport.imgUrl='';
    let selectedFile : File=event.target.files[0];
    if(selectedFile){
      const reader = new FileReader();
      reader.onload = ()=>{this.transport.imgUrl=reader.result.toString();}
      reader.readAsDataURL(selectedFile)
    }
    else this.transport.imgUrl='';
    //console.log('transport.imgUrl : '+this.transport.imgUrl)
    //this.getImageFromService();
   }
  //end funcions for photo
  centerCoord={lat:45.568806, lng:-73.918333}  // 

  today=new Date();
  modeHistoire: number=-1;
  modeListEvalue=false;
  modeListCommande=false;
  listTrs: Transport[]; // appels waitting
  listTrsSent: Transport[]; // appels sent
  listTrsFini: Transport[]; // appels finished
  listTrsAnnule: Transport[]; // appels annules
  listTrsCommande: {transport:Transport, loadDetail:LoadDetail}[]=[]; //Transport[]; // Transports commandes
  listTrsEvalue: {transport:Transport, loadDetail:LoadDetail}[]=[]; //Transport[]; // Transports evalues
  // test:[{transport:Transport; loadDetail:LoadDetail}]
  contacts: Contact[];
  chauffeurs: Chauffeur[];
  chauffeur: Chauffeur;

  em:EmailMessage=new EmailMessage();

  camions:Array<Camion>;
  
  templateName:string=''; // name of the transport model
  templates: Transport[]=[];  // liste transport models
  aStrings=[]
  tempId:number = null;
  idTransportTemp  : number = null; // to hold the number ID of transport
  modifyModels=false; // to appear the list models transport
  
  constructor(public transportsService : TransportsService, 
    // public geocoding : GeocodingService, 
    private formBuilder:FormBuilder, public router:Router, 
    public contactsService:ContactsService,
    public shipperservice:ShippersService,
    public bankClientsService:BankClientsService, // use to send email
    private datePipe: DatePipe,
    public camionsService:CamionsService,
    private imageService: ImageService,
    public loadDetailsService:LoadDetailsService,
    public chauffeursService:ChauffeursService,
    public varsGlobal:VarsGlobal,
    public loadFrequentsService:LoadFrequentsService,
    private itinerairesService:ItinerairesService,
    public transportersService:TransportersService
    ) { 
      this.id = Number (localStorage.getItem("userId"));
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

  // when you change the template name (modele)
  templateChange(){
    /// must revue and keep id and something must to do
    //if(this.transport.id>0) 
    this.idTransportTemp = this.transport.id; // we must keep this.transport.id as it as
    //let transportTemp=new Transport();
    
    //if(localStorage.getItem('fullName')!=null) this.transport.nomDispatch=localStorage.getItem('fullName')
    this.aStrings= this.templateName.split(".Id.");
    this.tempId =  Number(this.aStrings[1]) // get id from the string 
    this.templateName=this.aStrings[0]
    this.templateName=this.templateName.trim()
    //console.log('this.aStrings[0] : ' + this.aStrings[0])
    //console.log('this.templateName :' + this.templateName)
    this.templates.forEach(tempTr=>{
      if(tempTr.id==this.tempId) 
      {
        //let tp = temp;
        //tp.id = this.transport.id;
        let transportTemp = tempTr;
        this.transport=transportTemp;
        //if(this.idTransportTemp>0) 
        //this.transport.telIntervenant=ch.tel
        //this.transport.emailIntervenant=ch.email
      }
    })
    this.transport.id=this.idTransportTemp;
    if(localStorage.getItem('fullName')!=null) this.transport.nomDispatch=localStorage.getItem('fullName')
    this.transport.dateDepart=new Date()
    this.transport.timeCall= (new Date().getHours().toString().length==2?new Date().getHours().toString():'0'+new Date().getHours().toString())+':'+ 
      (new Date().getMinutes().toString().length==2?new Date().getMinutes().toString():'0'+new Date().getMinutes().toString())  //"00:00";
    // refresh the templates
    this.transportsService.getTransportModelsEntreprise(this.id).subscribe((data:Array<Transport>)=>{
      this.templates = data; // just for test
    },err=>{console.log(err)})
  }
  
  modifyTemplate(t:Transport){
    console.log('t.id -  before modifiy model : '+t.id)
    this.transportsService.saveTransportModels(t).subscribe((data:Transport)=>{
      console.log('data.id - after modified model : '+data.id)
      this.transportsService.getTransportModelsEntreprise(this.id).subscribe((data:Array<Transport>)=>{
        this.templates = data;
      },err=>{console.log(err)})
    }, err=>{
      console.log(err)
    })
  }

  deleteTemplate(id:any){
    this.transportsService.deleteTransportModel(id).subscribe((data:Transport)=>{
      console.log('deleted template id - name : '+id+' - '+data.modelName+' - d.id: '+data.id)
      this.transportsService.getTransportModelsEntreprise(this.id).subscribe((data:Array<Transport>)=>{
        this.templates = data;
      },err=>{console.log(err)})
    }, err=>{
      console.log(err)
    })
  }
  //*/ Control of surfer
  back=0;
  pagePresent=this.back+1;
  forward=this.back+2;
  onBack(){
    this.back=this.back-1;
    this.pagePresent=this.back+1;
    this.forward=this.back+2;
    //console.log('onBack(): '+ this.back +' '+this.pagePresent+' '+this.forward)
  }
  onForward(){
    this.modifyModels=false;  // must be sure for close list templates
    if(this.back==0){
      this.onSave();
    }
    this.back=this.back+1;
    this.pagePresent=this.back+1;
    this.forward=this.back+2;
    //console.log('onForward(): '+ this.back +' '+this.pagePresent+' '+this.forward)
  }
  //*/  End of control of surfer
  onNew(){
    this.back=0;
    this.pagePresent=this.back+1;
    this.forward=this.back+2;
    this.onSave();
  }
  onReset(){
    if(this.varsGlobal.language.includes('English'))
      var r = confirm("Do you want to cancel this load ?")
    else var r = confirm("Etes vous sur d'annuler cet appel ?")
    if(r) {
      this.back=0;
      this.pagePresent=this.back+1;
      this.forward=this.back+2
      if(this.transport.id!=null){
        this.transportsService.deleteTransport(this.transport.id).subscribe(data=>{
          this.transport=new Transport();
          this.loadDetail=new LoadDetail();
          this.loadDetails=new Array<LoadDetail>();
          this.transport.nomEntreprise=this.shipper.nom
          this.transport.idEntreprise=this.id
          this.templateName='';
          if(localStorage.getItem('fullName')!=null) this.transport.nomDispatch=localStorage.getItem('fullName')
        }, err=>{
          console.log(err)
        })
      }
      else this.transport=new Transport();      
      if(localStorage.getItem('fullName')!=null) this.transport.nomDispatch=localStorage.getItem('fullName')
      this.templateName='';
      this.transport.nomEntreprise=this.shipper.nom
      this.transport.idEntreprise=this.id
    }
  }

  getLoadDetail(id:number){ // we use idTransport to find loaddetail in transport
    this.loadDetailsService.getDetailLoadDetail(id).subscribe((data:LoadDetail)=>{

    })
  }

  deleteLoadDetail(load:LoadDetail){
    this.loadDetails.splice(this.loadDetails.findIndex(x=>x==load), 1); 
    //this.loadDetailsService.deleteLoadDetail(load.id).subscribe(data=>{}, err=>{console.log(err)})
    //this.prixChange();
  }
  // addLoadDetail(){
  //   let load:LoadDetail=new LoadDetail();
  //   load=this.loadDetail
  //   this.loadDetails.push(load)
  //   this.dimensionResume()
    
  //   this.loadDetail=new LoadDetail();
  // }

  addLoadSimpleDetail(){
    let load:LoadDetail=new LoadDetail();
    load=this.loadDetail
    this.loadDetails.push(load)
    this.prixBase(this.transport.totalpoints)
    this.loadDetail=new LoadDetail(); // after added set equal new
  }

  addLoadDetail(){
    let load:LoadDetail=new LoadDetail();
    load=this.loadDetail
    this.loadDetails.push(load)
    
    this.prixBase(this.transport.totalpoints)

    this.loadDetail=new LoadDetail(); // after added set equal new
    this.loadFrequent=null; // after added set to null
    this.dimensionResume()
    
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
  // // on focus windows
  // @HostListener('window:focus', ['$event'])
  // onfocus(event:any):void {
  //   this.onRefresh()
  // }
  
  async ngOnInit() {    
    //*
    this.varsGlobal.pro='yes'  // to control we are in professionnal
    this.loadDetails.length=0;
    
    //this.transport.collecterArgent=this.transport.total-this.transport.porterAuCompte

    // attacher idtransporter
    if(localStorage.getItem('idTransporter')!=undefined)
      this.transport.idTransporter=Number(localStorage.getItem('idTransporter'))
    
    await this.shipperservice.getDetailShipper(this.id).subscribe((data:Shipper)=>{
      this.shipper=data;
      this.transport.nomEntreprise=this.shipper.nom
      this.transport.idEntreprise=this.id
      this.contactsService.contactsDeShipper(this.shipper.id).subscribe((data:Array<Contact>)=>{
        this.contacts=data;
        this.loadFrequentsService.loadFrequentsDeShipper(this.id).subscribe((data:Array<LoadFrequent>)=>{
          this.loadFrequents=data.sort((a, b)=>{return a.nom.localeCompare(b.nom)});
        }, err=>{console.log(err)})
        this.transportsService.getTransportModelsEntreprise(this.id).subscribe((data:Array<Transport>)=>{
          this.templates = data; // just for test
          this.templates.forEach((t:Transport)=>{
            console.log('IDModel - Model Name : '+ t.id+' - '+t.modelName)
          })
        },err=>{console.log(err)})
      }, err=>{
        console.log(err);
      });
    }, err=>{
      console.log(err);
    })
    await this.transportersService.getDetailTransporter(Number(localStorage.getItem('idTransporter')))
    .subscribe((data:Transporter)=>{
      this.transporter=data;
    }), err=>{
      console.log(err)
    };
    var heure= this.transport.dateDepart.getHours().toString().length==2?this.transport.dateDepart.getHours().toString():'0'+this.transport.dateDepart.getHours().toString()
      //+':'+
    var minute= this.transport.dateDepart.getMinutes().toString().length==2?this.transport.dateDepart.getMinutes().toString():'0'+this.transport.dateDepart.getMinutes().toString()
    
    this.transport.timeCall=heure+':'+minute
    console.log('this.transport.timeCall : '+this.transport.timeCall)
    //this.transport.typeService=this.serviceTypes[0];
    //this.typeServiceChange(this.serviceTypes[0]);
    this.calculTotalpoints() 
    this.prixCalcul()
    //*/
  }
  
  onListEvalue(){
    this.modeListEvalue=true 
    this.modeListCommande=false
    this.onRefresh()
  }

  onListCommande(){
    this.modeListEvalue=false 
    this.modeListCommande=true
    this.onRefresh()
  }

  resetSimple(){
    // delete transport if this is type place command but not yet valid
    if(this.transport!=null && this.transport.id!=null && this.transport.id>0 &&
      this.transport.typeDoc==2 && !this.transport.valid){
      this.transportsService.deleteTransport(this.transport.id).subscribe((data:Transport)=>{
        if(this.loadDetail!=null && this.loadDetail.id!=null && this.loadDetail.id>0){
          this.loadDetailsService.deleteLoadDetail(this.loadDetail.id).subscribe(data=>{
            this.loadDetail=new LoadDetail();
          }, err=>{console.log(err)})
        }
      })
    }
    this.modeListEvalue=false
    this.modeListCommande=false
    this.transport = new Transport(); 
    this.transport.nomEntreprise=this.shipper.nom
    this.transport.idEntreprise=this.id
    // attacher idtransporter
    if(localStorage.getItem('idTransporter')!=undefined)
      this.transport.idTransporter=Number(localStorage.getItem('idTransporter'))
    this.loadFrequent=new LoadFrequent();
  }

  chauffeurChange(){
    let strings:Array<string>=this.transport.nomIntervenant.split("Id.");
    let chId:number =  Number(strings[1])
    this.chauffeurs.forEach(ch=>{
      if(ch.id==chId) 
      {
        this.transport.nomIntervenant=ch.nom
        this.transport.telIntervenant=ch.tel
        this.transport.emailIntervenant=ch.email
      }
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
    window.open("/detail-transport-pro/"+t.id, "_blank")
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
  // prixBase(totalPoints:number){
  //   this.transport.prixBase = 250.00;
  // }
  loadFrequentChange(){
    // if(this.loadFrequent==null) 
    this.loadDetail=new LoadDetail()
    if(this.loadFrequent!=null){
      this.loadDetail.description=this.loadFrequent.nom
      this.loadDetail.idLoadFrequent=this.loadFrequent.id
      this.priceLoad(this.loadDetail, this.loadFrequent)
    }
    
  }

  showKm(distance){
    return Math.round(distance / 0.621371)
  }

  priceLoad(loadDetail: LoadDetail, loadFrequent : LoadFrequent){
    if(loadDetail!=null && loadFrequent!=null){
      // let loadFrequent : LoadFrequent
      // loadFrequent=this.loadFrequents.find(x=>(x.id=load.idLoadFrequent))
      // load.price
      let distance : number;
      if(this.mode==1){ // if en mile change distance to km to calculate
        distance = Math.round(this.transport.distance / 0.621371);
      }
      else{ // if already in km, no change
        distance = this.transport.distance;
      }
      let quantity =(loadDetail.quantity>0?loadDetail.quantity:1)
      let priceKm = loadFrequent.priceKmType1 // just one type price now - (distance<=100?loadFrequent.priceKmType1:loadFrequent.priceKmType2)
      let priceLoadFrequent=(loadFrequent.priceBase + priceKm*distance)
      priceLoadFrequent = (priceLoadFrequent>loadFrequent.priceMinimum?priceLoadFrequent:loadFrequent.priceMinimum)
      loadDetail.price=Math.round(quantity*priceLoadFrequent*100)/100
    }
  }

  prixBase(totalPoints:number){
    this.transport.prixBase =0.00;

    this.transport.loadsFee=0.00;
    let tempLoadsFee=0.00;
    this.loadDetails.forEach(ld=>{
      this.priceLoad(ld, this.loadFrequents.find(x=>(x.id==ld.idLoadFrequent)))
      tempLoadsFee+=ld.price
    })
    this.transport.prixBase=this.transport.loadsFee=Math.round(this.roundPrice(tempLoadsFee)*100)/100
  
    this.prixCalcul()  // deactive temporary
  
    // this.loadDetails.forEach(load=>{
    //   //this.priceLoad(load)
    // })

    this.transport.waitingPrice=0.00;
    this.transport.waitingTime=0.00;
    this.transport.ptoPrice=0.00;
    this.transport.ptoTime=0.00;
    this.transport.ptoFee=0.00;
    this.transport.waitingFee=0.00;
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

  originSimpleChangeBusy=false;
  async originSimpleChange(){
    // if (this.originSimpleChangeBusy){
    //   // console.log("originSimpleChangeBusy, we must sleep 3 seconds")
    //   await this.sleep(3000);
    //   // console.log("After having Sleeped 3 seconds, originSimpleChangeBusy: " + this.originSimpleChangeBusy)
    // }
    let geocoding = new GeocodingService()
    let found = false;
    this.originSimpleChangeBusy=true
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
              found=true;
              // this.sleep(2000);
              // if(this.transport.destination!=null && this.transport.destination.length>0){
              //   // await 
              //   this.setDistanceTravel(this.transport.origin, this.transport.destination)
              //   //await this.showMap()
              //   //this.typeServiceChange(this.remorquage.typeService)
              // }
            }
            else
              {
                if(this.transport!=null){
                  found=false;
                  this.transport.loadsFee=null
                  this.transport.origin=''
                }
                if(this.varsGlobal.language.includes('English'))
                  alert("Can not locate this origin")
                else alert("Ne pas trouver de coordonnees de ce origin")
              }
    }).then(()=>{
      if(found && this.transport.destination!=null && this.transport.destination.length>0){
        this.setDistanceTravel(this.transport.origin, this.transport.destination).
        then(()=>this.originSimpleChangeBusy=false)
        //await this.showMap()
        //this.typeServiceChange(this.remorquage.typeService)
        // if(!this.varsGlobal.addressCookie.includes(this.transport.origin)){
        //   this.varsGlobal.addressCookie = this.varsGlobal.addressCookie + this.transport.origin + '; '
        //   this.varsGlobal.addressCookieToList.push(this.transport.origin)
        // }
      }
      else{
        found=false;
        this.transport.loadsFee=null
        this.originSimpleChangeBusy=false
        // this.transport.origin=''
      }
    });//*/
  }

  destinationSimpleChangeBusy = false
  async destinationSimpleChange(){
    // if (this.destinationSimpleChangeBusy){
    //   // console.log("destinationSimpleChangeBusy, we must sleep 3 seconds")
    //   await this.sleep(3000);
    //   // console.log("After having Sleeped 3 seconds, destinationSimpleChangeBusy: " + this.destinationSimpleChangeBusy)
    // }
    let geocoding = new GeocodingService()
    let found = false;
    this.destinationSimpleChangeBusy=true
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
              if(this.latLngDestination!=null) {
                found = true;
                // console.log("found latLngDestination at "+this.transport.destination)
                // console.log("results[0].geometry.location.lat(): "+results[0].geometry.location.lat())
                // console.log("results[0].geometry.location.lng(): "+results[0].geometry.location.lng())
              }
              // this.sleep(2000);
              // if(this.transport.origin!=null && this.transport.origin.length>0){
              //   // await 
              //   this.setDistanceTravel(this.transport.origin, this.transport.destination)
              //   //await this.showMap()
              //   //this.typeServiceChange(this.remorquage.typeService)
              // }
            }
            else
            {
              if(this.transport!=null) {
                found=false;
                this.transport.loadsFee=null
                this.transport.destination=''
              }
              if(this.varsGlobal.language.includes('English'))
                alert("Can not locate this destination")
              else alert("Ne pas trouver de coordonnees de cet destination")
            }
    }).then(()=>{
      if(found && this.transport.origin!=null && this.transport.origin.length>0){
        this.setDistanceTravel(this.transport.origin, this.transport.destination).
        then(()=>this.destinationSimpleChangeBusy=false)
        //await this.showMap()
        //this.typeServiceChange(this.remorquage.typeService)
        // if(!this.varsGlobal.addressCookie.includes(this.transport.destination)){
        //   this.varsGlobal.addressCookie = this.varsGlobal.addressCookie + this.transport.destination + '; '
        //   this.varsGlobal.addressCookieToList.push(this.transport.destination)
        // }
      }
      else{
        found=false;
        this.transport.loadsFee=null
        this.destinationSimpleChangeBusy=false
        // this.transport.destination=''
      }
    });//*/
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
              {
                if(this.varsGlobal.language.includes('English'))
                  alert("Can not locate this origin")
                else alert("Ne pas trouver de coordonnees de ce origin")
              }
    });//*/
    if(this.transport.destination!=null && this.transport.destination.length>0){
      await this.setDistanceTravel(this.transport.origin, this.transport.destination)
      //await this.showMap()
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
            {
              if(this.varsGlobal.language.includes('English'))
                alert("Can not locate this destination")
              else alert("Ne pas trouver de coordonnees de cet destination")
            }
    });//*/
    if(this.transport.origin!=null && this.transport.origin.length>0){
      await this.setDistanceTravel(this.transport.origin, this.transport.destination)
      //await this.showMap()
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
  async onRefresh(){
    this.transportsService.getTransportsEntreprise(this.id).subscribe((data:Array<Transport>)=>{
      // refresh the templates
      this.transportsService.getTransportModelsEntreprise(this.id).subscribe((data:Array<Transport>)=>{
        this.templates = data; // just for test
      },err=>{console.log(err)})

      this.listTrs=[]  //data;
      this.listTrsSent=[]
      this.listTrsFini=[]
      this.listTrsAnnule=[]
      this.listTrsCommande=[]
      this.listTrsEvalue=[]
      //*
      data.sort((b, a)=>{
        if(a.id>b.id)
          return 1;
        if(a.id<b.id)
          return -1;
        return 0;
      })//*/
      data.filter(transport=>(transport.valid)).forEach(tr=>{
        if(tr.typeDoc==1) {
          this.listTrsEvalue.push({transport:tr, loadDetail:new LoadDetail() });
          // this.loadDetailsService.loadDetailsDeTransport(tr.id).subscribe((data:Array<LoadDetail>)=>{
          //   if(data!=null&&data.length>0) {this.listTrsEvalue.push({transport:tr, loadDetail:data[0] });}
          // })        
        }
        else if(tr.typeDoc==2) {
          this.listTrsCommande.push({transport:tr, loadDetail:new LoadDetail() });
          // this.loadDetailsService.loadDetailsDeTransport(tr.id).subscribe((data:Array<LoadDetail>)=>{
          // if(data!=null&&data.length>0) {this.listTrsCommande.push({transport:tr, loadDetail:data[0] });}
          // })
        }
        else if(tr.fini) this.listTrsFini.push(tr)
        else if (tr.driverNote.includes("!!Cancelled!!")) this.listTrsAnnule.push(tr)
        else if (tr.sent) this.listTrsSent.push(tr)
        else if (tr.valid) this.listTrs.push(tr)//*/
      })
      // sort list evaluate
      if(this.modeListEvalue) this.listTrsEvalue.sort((b,a)=>{
        if(a.transport.id>b.transport.id)
          return 1;
        if(a.transport.id<b.transport.id)
          return -1;
        return 0;
      }).forEach(trEv=>{
        this.loadDetailsService.loadDetailsDeTransport(trEv.transport.id).subscribe((data:Array<LoadDetail>)=>{
          if(data!=null&&data.length>0) {trEv.loadDetail=data[0] };
        })
      })
      // sort list Commands
      if(this.modeListCommande) this.listTrsCommande.sort((b,a)=>{
        if(a.transport.id>b.transport.id)
          return 1;
        if(a.transport.id<b.transport.id)
          return -1;
        return 0;
      }).forEach(trCm=>{
        this.loadDetailsService.loadDetailsDeTransport(trCm.transport.id).subscribe((data:Array<LoadDetail>)=>{
          if(data!=null&&data.length>0) {trCm.loadDetail=data[0] };
        })
      })

    }, err=>{
      console.log(err)
    })

    // await this.sleep(1500) // wait 1,5 seconde before sort the list trscomande
    // this.onSortStatuslistTrsCommande(); // sort listTrsCommande by status
  }

  // sort listTrsCommande by status
  listTrsCommandeFini: {transport:Transport, loadDetail:LoadDetail}[];
  listTrsCommandeCancelled: {transport:Transport, loadDetail:LoadDetail}[];
  listTrsCommandeSchedule: {transport:Transport, loadDetail:LoadDetail}[];
  listTrsCommandeWaiting: {transport:Transport, loadDetail:LoadDetail}[];
  listTrsCommandeArchive: {transport:Transport, loadDetail:LoadDetail}[];
  onSortStatuslistTrsCommande(){
    this.listTrsCommandeFini = []; 
    this.listTrsCommandeCancelled = [];
    this.listTrsCommandeSchedule = [];
    this.listTrsCommandeWaiting = [];
    this.listTrsCommandeArchive = [];
    if(this.listTrsCommande.length>0) {
      this.listTrsCommande.forEach(trCo=>{
        if(trCo.transport.archive && trCo.transport.fini){
          this.listTrsCommandeArchive.push(trCo)
        }
        if(!trCo.transport.archive && trCo.transport.fini){
          this.listTrsCommandeFini.push(trCo)
        }
        if(trCo.transport.driverNote.includes('!!Cancelled!!')){
          this.listTrsCommandeCancelled.push(trCo)
        }
        if(trCo.transport.idCamion!=null && trCo.transport.idCamion>0 &&
          !trCo.transport.fini && !trCo.transport.driverNote.includes('!!Cancelled!!')){
          this.listTrsCommandeSchedule.push(trCo)
        }
        if((trCo.transport.idCamion==null || trCo.transport.idCamion==0) &&
        !trCo.transport.fini && !trCo.transport.driverNote.includes('!!Cancelled!!')){
          this.listTrsCommandeWaiting.push(trCo)
        }
      })
    }
    this.listTrsCommande = this.listTrsCommandeSchedule
    // .concat(
    //   this.listTrsCommandeWaiting.concat(this.listTrsCommandeCancelled.concat(
    //     this.listTrsCommandeFini)))
  }

  allCommands(){
    this.listTrsCommande = this.listTrsCommandeSchedule.concat(
      this.listTrsCommandeWaiting.concat(this.listTrsCommandeCancelled.concat(
        this.listTrsCommandeFini)))
  }
  waitingCommands(){
    this.listTrsCommande = this.listTrsCommandeWaiting
  }
  scheduleCommands(){
    this.listTrsCommande = this.listTrsCommandeSchedule
  }
  finishedCommands(){
    this.listTrsCommande = this.listTrsCommandeFini
  }
  cancelledCommands(){
    this.listTrsCommande = this.listTrsCommandeCancelled
  }
  archiveCommands(){
    this.listTrsCommande = this.listTrsCommandeArchive
  }

  roundPrice(price:number){ // no cent, last unit <=5 =>5; last unit >5 =>10;
    let modulo_10 = price%10;
    // console.log('modulo_10 of '+price+': '+modulo_10)
    if(modulo_10>0 && modulo_10<=5){
      price = (price - modulo_10) + 5
    }
    if(modulo_10>5 && modulo_10<10){
      price = (price - modulo_10) + 10
    }
    // console.log('price after rounded: '+price)
    return price;
  }

  showDateLocal(d:Date){
    d=new Date(d);
    let dateLocal= new Date(d.getTime() + (new Date().getTimezoneOffset()*60000))
    return dateLocal;
  }

  pickDateChange(event){
    this.transport.dateReserve=event.target.value;
  }

  // trEvTemp:{transport:Transport, loadDetail:LoadDetail}
  onCommandEvalue(trEv:{transport:Transport, loadDetail:LoadDetail}){
    var r = confirm("Commander cet Evalue : #" + trEv.transport.id + " ?")
    if(r){
      this.transport = trEv.transport
      this.transport.typeDoc = trEv.transport.typeDoc = 2; // 
      this.transport.dateReserve = new Date();
      this.modeListEvalue=false; 
      this.modeListCommande=false
      this.loadFrequentsService.getDetailLoadFrequent(trEv.loadDetail.idLoadFrequent)
      .subscribe((data:LoadFrequent)=>{
        if(data!=null) {
          this.loadFrequent=data
          alert("Ne pas oublier de donner la date de transport, SVP!")
        }
        else {alert("Ne pas trouver ce type transport, faire une nouvelle commande, SVP!")}
      })
    }
  }

  onDeleteEvalue(trEv:{transport:Transport, loadDetail:LoadDetail}){ // delete transport + loadDetail
    this.transportsService.deleteTransport(trEv.transport.id).subscribe(data=>{
      this.loadDetailsService.deleteLoadDetail(trEv.loadDetail.id).subscribe(data=>{
        this.listTrsEvalue.splice(this.listTrsEvalue.indexOf(trEv),1)
      }, err=>{console.log(err)})
    }, err=>{
      console.log()
    })
  }

  saveSimple(){
    this.transport.valid = true; // valid this transport ing saving
    this.transportsService.saveTransports(this.transport).subscribe((data:Transport)=>{
      this.transport=data;
      this.loadDetails.forEach(load=>{
        load.idTransport=data.id;
        this.loadDetailsService.saveLoadDetail(load).subscribe((d:LoadDetail)=>{
          load.id = d.id;
        }, err=>{
          console.log(err);
        })
      })
      if(this.varsGlobal.language.includes('Francais')) alert(this.transport.typeDoc==1?"C'est enregistre.":"Votre commande a ete envoye.")
      if(this.varsGlobal.language.includes('English')) alert(this.transport.typeDoc==1?"It's saved.":"Your order was sent.")
      // after create order then create itineraire
      if(this.transport.typeDoc==2){ // if a command, create route
        let route = new Itineraire();
        route.idEntreprise = this.transport.idEntreprise
        route.nomEntreprise = this.transport.nomEntreprise
        route.idTransport = this.transport.id
        route.idTransporter = this.transport.idTransporter

        route.datePick = this.transport.dateReserve
        route.timeResrvation = this.transport.timeResrvation
        route.dateDrop = route.datePick;  // set date Drop to route.datePick for avoiding the conflict showing
        
        route.destLat = this.transport.destLat
        route.destLong = this.transport.destLong
        route.destination = this.transport.destination
        
        route.origin = this.transport.origin
        route.originLat = this.transport.originLat
        route.originLong = this.transport.originLong
        this.itinerairesService.saveItineraires(route).subscribe((data:Itineraire)=>{
          route=data;
        }, err=>{console.log()}) 
        if(this.transport.typeDoc==2) this.onEnvoyerWithSaveSimple(); // essayer de envoyer to cts.solution.transport@gmail.com
      }
    }, err=>{
      console.log(err)
    })
  }

  sleep(ms){
    return new Promise((resolve)=>{
      setTimeout(resolve, ms);
    })
  }

  transportSelected:Transport
  loadDetailSelected:LoadDetail
  async printTransportSelected(tl:{transport:Transport, loadDetail:LoadDetail}){
    this.transportSelected=tl.transport
    this.loadDetailSelected=tl.loadDetail
    
    await this.sleep(400)

    if(this.transportSelected.typeDoc==1){
      this.printBonDeTransport('printevalueselected')
    }
    if(this.transportSelected.typeDoc==2){
      this.printBonDeTransport('printcommandselected')
    }
  }

  printBonDeTransport(cmpId){
    // let envoy = document.getElementById('toprint').innerHTML;
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
    this.resetSimple();
  }

  prixCalcul(){
    this.transport.horstax=this.transport.prixBase
    if((this.transport.distance-this.transport.inclus)>0){
      this.transport.horstax =this.transport.horstax + (this.transport.distance-this.transport.inclus)*this.transport.prixKm
    }
    this.transport.horstax=Math.round(this.transport.horstax*100)/100  // around to 2 number
    if(this.transport.taxable){
      this.transport.tps =Math.round(this.transport.horstax*0.05*100)/100
      this.transport.tvq =Math.round(this.transport.horstax*0.09975*100)/100
      this.transport.total= Math.round((this.transport.horstax+this.transport.tvq+this.transport.tps)*100)/100
    }
    else{
      this.transport.tps =0.00; //Math.round(this.transport.horstax*0.05*100)/100
      this.transport.tvq =0.00; //Math.round(this.transport.horstax*0.09975*100)/100
      this.transport.total= this.transport.horstax; //Math.round((this.transport.horstax+this.transport.tvq+this.transport.tps)*100)/100
    }
  }

  prixCalculWithHorsTax(){
    if(this.transport.taxable){
      this.transport.tps =Math.round(this.transport.horstax*0.05*100)/100
      this.transport.tvq =Math.round(this.transport.horstax*0.09975*100)/100
      this.transport.total= Math.round((this.transport.horstax+this.transport.tvq+this.transport.tps)*100)/100
    }
    else{
      this.transport.tps =0.00; //Math.round(this.transport.horstax*0.05*100)/100
      this.transport.tvq =0.00; //Math.round(this.transport.horstax*0.09975*100)/100
      this.transport.total= this.transport.horstax; //Math.round((this.transport.horstax+this.transport.tvq+this.transport.tps)*100)/100
    }
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
    if(this.varsGlobal.language.includes('English'))
      var r = confirm("Are you sure this load in finished?")
    else var r = confirm("Etes vous sur que ce load est fini ?")
    if(r==true){
      // console.log("Le cas est termine.")
      this.transport.fini=true;
      this.transportsService.saveTransports(this.transport).subscribe(data=>{
        this.transport=new Transport();
      }, err=>{console.log(err)})
    }
    else {
      console.log('Le cas est continue.')
    }
    
  }

  onCancel(){
    if(this.varsGlobal.language.includes('English'))
      var r = confirm("Do you want to cancel this load ?")
    else var r = confirm("Etes vous sur d'annuller ce load ?")
    if(r==true){
      console.log("Le cas est annulle.")
      if(this.transport.id>0){
        this.transportsService.deleteTransport(this.transport.id).subscribe(data=>{
          // commence d'envoyer email
          if(this.transport.sent && this.transport.emailIntervenant!=null && this.transport.emailIntervenant.length>10){
            this.em.emailDest=this.transport.emailIntervenant
            this.em.titre="Annuler case numero : " + this.transport.id.toString()
            this.em.content='<div><p> '+'Annuler case numero : ' + this.transport.id.toString()+' </p></div>'    
            this.bankClientsService.envoyerMail(this.em).subscribe(data=>{
              if(this.varsGlobal.language.includes('English'))
                alert("An email cancel was sent to driver.")
              else alert("Un courriel annulation a ete aussi envoye au chauffeur.")
            }, err=>{
              console.log()
            })
          }
          //*/
          this.transport=new Transport();
        }, err=>{console.log(err)})
      }
    }
    else {
      console.log('Le cas est continue.')
    }
  }

  onDelete(tr:Transport){
    if(this.varsGlobal.language.includes('English'))
      var r = confirm("Do you want to delete this load ?")
    else var r = confirm("Etes vous sur de supprimer ce cas ?")
    if(r==true){
      // console.log("Le cas est supprime.")
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

  contactChange(){
    let strings:Array<string>=this.transport.nomContact.split("Id.");
    let conId:number =  Number(strings[1])
    this.contacts.forEach(con=>{
      if(con.id==conId) 
      {
        this.transport.nomContact=con.prenom
        this.transport.telContact=con.tel.toString()
        this.transport.emailContact=con.email
      }
    })
  }

  async onSaveWithMessage(){  // will save with message confirmation
    if(this.transport.id==null){
      this.transport.dateDepart=new Date()
      this.transport.timeCall= (new Date().getHours().toString().length==2?new Date().getHours().toString():'0'+new Date().getHours().toString())+':'+ 
      (new Date().getMinutes().toString().length==2?new Date().getMinutes().toString():'0'+new Date().getMinutes().toString())  //"00:00";
    }
    if(localStorage.getItem('fullName')!=null) this.transport.nomDispatch=localStorage.getItem('fullName')
    if(this.mode==2){
      this.changeUnite();  // we must change to mode=1
      await this.transportsService.saveTransports(this.transport).subscribe(async(data:Transport)=>{
        if(this.transport.id!=null)
        {
          if(this.varsGlobal.language.includes('English'))
            alert("It's saved.")
          else alert("C'est enregistre.")
        }
        await this.loadDetails.forEach(load=>{
          load.idTransport=data.id;
          this.loadDetailsService.saveLoadDetail(load).subscribe((d:LoadDetail)=>{
            load.id = d.id;
            //to empty the list loadDetails after save them
            //this.loadDetails.splice(this.loadDetails.findIndex(x=>x==load), 1); //test to remove loadDetail dans list loadDetail;
          }, err=>{
            console.log(err);
          })
        })
        //this.transport=data;
        this.loadDetails=new Array<LoadDetail>();
        this.templateName='';
        this.back=0;
        this.pagePresent=this.back+1;
        this.forward=this.back+2
        this.transport=new Transport(); 
        this.transport.nomEntreprise=this.shipper.nom
        this.transport.idEntreprise=this.id     
        if(localStorage.getItem('fullName')!=null) this.transport.nomDispatch=localStorage.getItem('fullName')
      }, 
        err=>{console.log(err)
      })
      this.changeUnite();  // we must rechange to mode=2
    }
    else{ // mode=1 already, just save
      this.transportsService.saveTransports(this.transport).subscribe(async (data:Transport)=>{
        if(this.transport.id!=null)
          {
            if(this.varsGlobal.language.includes('English'))
              alert("it's saved.")
            else alert("C'est enregistre.")
          }
        await this.loadDetails.forEach(load=>{
          load.idTransport=data.id;
          this.loadDetailsService.saveLoadDetail(load).subscribe((d:LoadDetail)=>{
            load.id = d.id;            
            
            //to empty the list loadDetails after save them
            //this.loadDetails.splice(this.loadDetails.findIndex(x=>x==load), 1); //test to remove loadDetail dans list loadDetail;
          }, err=>{
            console.log(err);
          })
        })
        this.loadDetails=new Array<LoadDetail>();
        this.templateName='';
        this.back=0;
        this.pagePresent=this.back+1;
        this.forward=this.back+2
        this.transport=new Transport();      
        this.transport.nomEntreprise=this.shipper.nom
        this.transport.idEntreprise=this.id
        if(localStorage.getItem('fullName')!=null) this.transport.nomDispatch=localStorage.getItem('fullName')
        //this.transport=data;
      }, 
        err=>{console.log(err)
      })
    }
  }

  async onSave(){  // without message alert
    if(this.transport.id==null){
      this.transport.dateDepart=new Date()
      this.transport.timeCall= (new Date().getHours().toString().length==2?new Date().getHours().toString():'0'+new Date().getHours().toString())+':'+ 
      (new Date().getMinutes().toString().length==2?new Date().getMinutes().toString():'0'+new Date().getMinutes().toString())  //"00:00";
    }
    if(localStorage.getItem('fullName')!=null) this.transport.nomDispatch=localStorage.getItem('fullName')
    if(this.mode==2){
      this.changeUnite();  // we must change to mode=1
      await this.transportsService.saveTransports(this.transport).subscribe((data:Transport)=>{
        if(this.transport.id!=null)
          //alert("C'est enregistre.")
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
          //alert("C'est enregistre.")
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
  }
  onPrint(heure){    
    console.log(heure)
    console.log('this.transport.timeCall : '+this.transport.timeCall)
    console.log('this.transport.timeResrvation : '+this.transport.timeResrvation)
  }

  //* calculer distance travel en kms
  async setDistanceTravel(address1: string, address2:string) { // in km
    // if(!this.varsGlobal.addressCookie.includes(address1)){
    //   this.varsGlobal.addressCookie = this.varsGlobal.addressCookie + address1 + ';;-;; '
    //   this.varsGlobal.addressCookieToList.push(address1)
    // }
    // if(!this.varsGlobal.addressCookie.includes(address2)){
    //   this.varsGlobal.addressCookie = this.varsGlobal.addressCookie + address2 + ';;-;; '
    //   this.varsGlobal.addressCookieToList.push(address2)
    // }
    let okForWriting = false;
    this.transport.distance=null; // set distance to null, before calculate
    this.transport.loadsFee=null; // set loadsFee to null while calculating 
    let service = new google.maps.DistanceMatrixService;// = new google.maps.DistanceMatrixService()
    // calculate load distance - ld
    service.getDistanceMatrix({
      'origins': [address1], 'destinations': [address2], travelMode:google.maps.TravelMode.DRIVING
    }, (results: any) => {    
      if(results.rows[0].elements[0].distance!=undefined){
        okForWriting = true;
        if(this.mode==1){
          this.transport.distance= Math.round((results.rows[0].elements[0].distance.value)*0.621371/1000)  
        }
        else this.transport.distance= Math.round((results.rows[0].elements[0].distance.value)/1000)  
      }
      else{
        okForWriting = false;
      }
      
      // calculate price load actual and total price after distance
      //this.priceLoad(this.loadDetail, this.loadFrequent)
      // this.prixBase(this.transport.totalpoints)
      //return;
    });  
    await this.sleep(2000);
    if(okForWriting){
      this.prixBase(this.transport.totalpoints)
      // save 
      if(this.transport.typeDoc==1) this.transport.valid = true //valid for all evaluating whether save or don't save
      this.transportsService.saveTransports(this.transport).subscribe((data:Transport)=>{
        this.transport=data;
        this.loadDetails.forEach(load=>{
          load.idTransport=data.id;
          this.loadDetailsService.saveLoadDetail(load).subscribe((d:LoadDetail)=>{
            load.id = d.id;
            if(this.transport.typeDoc==2) this.loadDetail = d; // this is just for type place command
          }, err=>{
            console.log(err);
          })
        })
      }, err=>{console.log(err)})
    }
  }

  // dateChange(event){
  //   //(ngModelChange)="dateChange($event)"
  //   console.log('event : '+event.target.value.toString())
    
  //   this.transport.dateReserve = new Date(event.target.value);
  //   this.transport.dateReserve.setDate(this.transport.dateReserve.getDate())//+1)
    
  //   console.log('this.transport.dateDepart : '+this.transport.dateReserve)
  // }

  dateChange(event){
    this.transport.dateReserve =event.target.value // new Date(event.target.value);
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


  onHistoire(){
    this.modeHistoire=-this.modeHistoire;
    if(this.modeHistoire==1){
      this.transportsService.getTransportsEntreprise(this.id).subscribe((data:Array<Transport>)=>{
        //this.templates = data; // just for test
        this.listTrs=[]  //data;
        this.listTrsSent=[]
        this.listTrsFini=[]
        this.listTrsAnnule=[]
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
          else if (tr.driverNote.includes("!!Cancelled!!")) this.listTrsAnnule.push(tr)
          else if (tr.sent) this.listTrsSent.push(tr)
          else if (tr.valid) this.listTrs.push(tr)//*/
        })
      }, err=>{
        console.log(err)
      })
    }
    else {
      this.back=0;
      this.pagePresent=this.back+1
      this.forward=this.back+2
      /*
      if(this.transport.id==null){
        this.transport.dateDepart = new Date()
        this.transport.timeCall= (new Date().getHours().toString().length==2?new Date().getHours().toString():'0'+new Date().getHours().toString())+':'+ 
          (new Date().getMinutes().toString().length==2?new Date().getMinutes().toString():'0'+new Date().getMinutes().toString())  //"00:00";
        this.onSave();
      }//*/
    }
  }
  
  onEnvoyer(){
    let stringsd:string[]=location.href.split('/transport-pro')
    this.em.emailDest=myGlobals.emailPrincipal; 
    if(this.varsGlobal.language.includes('English'))
      this.em.titre= this.transport.nomEntreprise +" - Freight From: - " + this.transport.originVille+', '+this.transport.originProvince +
      ' To: - ' + this.transport.destVille+', '+this.transport.destProvince
    else this.em.titre= this.transport.nomEntreprise +" - Transport De: - " + this.transport.originVille+', '+this.transport.originProvince +
      ' A: - ' + this.transport.destVille+', '+this.transport.destProvince
    this.em.content='<div><p> '+document.getElementById('toprint').innerHTML+
    " <br> <a href='"+stringsd[0]+"/detail-transport/"   //+"/detail-transport-express/"
    + this.transport.id   //1733  // replace by Number of Bon Transport
    +"'><h4>Detail</h4></a>" +" </p></div>"    
    this.bankClientsService.envoyerMail(this.em).subscribe(data=>{
      {
        if(this.varsGlobal.language.includes('English'))
          alert("This load was sent")
        else alert("Ce load a ete envoye.")
      }
      //*/ Also App send confirmation email to client professionnel
      if(this.transport.emailContact.length>10){
        let em:EmailMessage=new EmailMessage();
        em.emailDest=this.transport.emailContact;  // email of professional
        em.titre= "Recu demande Transport - " + this.transport.origin+' -  A  - '+ this.transport.destination +' -  #Bon : ' + this.transport.id
        em.content='<div><p> '+ em.titre + " <br>" + 
          '<div>'+
            '<div><br></div>'+
            '<div>Merci de votre collaboration.</div>'+
            '<div><br></div>'+
            //'<div>Dispatch Marc-Andre Thiffeault </div>'+
            '<div>Dispatch - '+this.transporter.nom+' </div>'+
            '<font face="garamond,serif"><b></b><font size="4"></font></font>'+
            '</div>'+
            //'<div><font face="garamond,serif" size="4"><b>SOS Prestige</b></font></div>'+
            
            '<div><font face="garamond,serif" size="4"><b>'+this.transporter.email+'</b></font></div>'+
            //'<div><font face="garamond,serif" size="4"><b>520 Guindon St-Eustache,Qc</b></font></div>'+
            //'<div><font face="garamond,serif" size="4"><b>J7R 5B4</b></font></div>'+
            '<div><font face="garamond,serif" size="4"><b><br>'+this.transporter.tel+'</b></font></div>'+
            //'<div><font face="garamond,serif" size="4"><b><br>450-974-9111</b></font></div>'+
          " </p></div>"
        this.bankClientsService.envoyerMail(em).subscribe(data=>{
          console.log('Vous recevez aussi un courriel confirmation, merci de votre collaboration.')
        }, err=>{console.log(err)})
      }
      //*/
      this.onSaveWithMessage();
      this.transport = new Transport() // declare one new case
      this.back=0;
      this.pagePresent=this.back+1;
      this.forward=this.back+2;
    }, err=>{
      console.log()
    })
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });  // go to top  
  }

  onEnvoyerWithSaveSimple(){
    // let stringsd:string[]=location.href.split('/transport-pro')
    this.em.emailDest= this.transporter.email; // myGlobals.emailPrincipal; //
    // check validation of this.shipper.email
    if(this.shipper.email.length>8 && this.shipper.email.includes('@')) 
      this.em.emailDest=this.em.emailDest + ',' + this.shipper.email // add in list email to send
    if(this.varsGlobal.language.includes('English'))
      this.em.titre= this.transport.nomEntreprise + " - Order: " + this.loadFrequent.nom 
      //+
      // " - Freight From: - " + this.transport.originVille+', '+this.transport.originProvince +
      // ' To: - ' + this.transport.destVille+', '+this.transport.destProvince
    else this.em.titre= this.transport.nomEntreprise + " - Commande: " + this.loadFrequent.nom 
    // this.em.titre= this.transport.nomEntreprise +" - Transport De: - " + this.transport.originVille+', '+this.transport.originProvince +
    //   ' A: - ' + this.transport.destVille+', '+this.transport.destProvince
    this.em.content='<div><p> '+ "<h3>"+ this.shipper.nom+ " - " + 
    this.shipper.tel + " - " + this.shipper.email + " </h3> <br>"
    + document.getElementById('sendcommand').innerHTML
    /*//
    +
    " <br> <a href='"+stringsd[0]+"/detail-transport/"   //+"/detail-transport-express/"
    + this.transport.id   //1733  // replace by Number of Bon Transport
    +"'><h4>Detail</h4></a>" +" </p></div>"    
    //*/
    this.bankClientsService.envoyerMail(this.em).subscribe(data=>{
      // {
      //   // if(this.varsGlobal.language.includes('English'))
      //   //   alert("This load was sent")
      //   // else alert("Ce load a ete envoye.")
      // }
      // //*/ Also App send confirmation email to client professionnel
      // if(this.transport.emailContact.length>10){
      //   let em:EmailMessage=new EmailMessage();
      //   em.emailDest=this.transport.emailContact;  // email of professional
      //   em.titre= "Recu demande Transport - " + this.transport.origin+' -  A  - '+ this.transport.destination +' -  #Bon : ' + this.transport.id
      //   em.content='<div><p> '+ em.titre + " <br>" + 
      //     '<div>'+
      //       '<div><br></div>'+
      //       '<div>Merci de votre collaboration.</div>'+
      //       '<div><br></div>'+
      //       //'<div>Dispatch Marc-Andre Thiffeault </div>'+
      //       '<div>Dispatch - '+this.transporter.nom+' </div>'+
      //       '<font face="garamond,serif"><b></b><font size="4"></font></font>'+
      //       '</div>'+
      //       //'<div><font face="garamond,serif" size="4"><b>SOS Prestige</b></font></div>'+
            
      //       '<div><font face="garamond,serif" size="4"><b>'+this.transporter.email+'</b></font></div>'+
      //       //'<div><font face="garamond,serif" size="4"><b>520 Guindon St-Eustache,Qc</b></font></div>'+
      //       //'<div><font face="garamond,serif" size="4"><b>J7R 5B4</b></font></div>'+
      //       '<div><font face="garamond,serif" size="4"><b><br>'+this.transporter.tel+'</b></font></div>'+
      //       //'<div><font face="garamond,serif" size="4"><b><br>450-974-9111</b></font></div>'+
      //     " </p></div>"
      //   this.bankClientsService.envoyerMail(em).subscribe(data=>{
      //     console.log('Vous recevez aussi un courriel confirmation, merci de votre collaboration.')
      //   }, err=>{console.log(err)})
      // }
      // //*/
      // this.onSaveWithMessage();
      // this.transport = new Transport() // declare one new case
      // this.back=0;
      // this.pagePresent=this.back+1;
      // this.forward=this.back+2;
      this.resetSimple(); // reset/new after sent
    }, err=>{
      console.log()
    })
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });  // go to top  
  }

  onPage2(){
    this.modifyModels=false;  // must be sure for close list templates
    if(this.transport.id==null){
      this.onSave();
    }
    this.pagePresent=2;
    this.back=this.pagePresent-1;
    this.forward=this.pagePresent+1
  }
  onPage3(){
    this.modifyModels=false;  // must be sure for close list templates
    if(this.transport.id==null){
      this.onSave();
    }
    this.pagePresent=3;
    this.back=this.pagePresent-1;
    this.forward=this.pagePresent+1
  }
  onPage4(){
    this.modifyModels=false;  // must be sure for close list templates
    if(this.transport.id==null){
      this.onSave();
    }
    this.pagePresent=4;
    this.back=this.pagePresent-1;
    this.forward=this.pagePresent+1
  }
  onPage5(){
    this.modifyModels=false;  // must be sure for close list templates
    if(this.transport.id==null){
      this.onSave();
    }
    this.pagePresent=5;
    this.back=this.pagePresent-1;
    this.forward=this.pagePresent+1
  }
  onPage6(){
    this.modifyModels=false;  // must be sure for close list templates
    if(this.transport.id==null){
      this.onSave();
    }
    this.pagePresent=6;
    this.back=this.pagePresent-1;
    this.forward=this.pagePresent+1
  }
  onPage7(){
    this.modifyModels=false;  // must be sure for close list templates
    if(this.transport.id==null){
      this.onSave();
    }
    this.pagePresent=7;
    this.back=this.pagePresent-1;
    this.forward=this.pagePresent+1
  }
  onPage8(){
    this.modifyModels=false;  // must be sure for close list templates
    if(this.transport.id==null){
      this.onSave();
    }
    this.pagePresent=8;
    this.back=this.pagePresent-1;
    this.forward=this.pagePresent+1
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
