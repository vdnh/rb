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
import { Voyage } from 'src/model/model.voyage';
import { VoyagesService } from 'src/services/voyages.service';
import { TransportersService } from 'src/services/transporters.service';
import { Transporter } from 'src/model/model.transporter';
import { LoadFrequent } from 'src/model/model.loadFrequent';
import { VarsGlobal } from 'src/services/VarsGlobal';
import { LoadFrequentsService } from 'src/services/loadFrequents.Service';
import { Itineraire } from 'src/model/model.itineraire';
import { ItinerairesService } from 'src/services/itineraires.service';

@Component({
  selector: 'app-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.css']
})
export class TransportComponent implements OnInit {

  //imgUrl: string = ''; //  'https://picsum.photos/200/300/?random';
  imageToShow: any;
  isImageLoading: boolean;

  loadDetail:LoadDetail=new LoadDetail();
  loadDetails:Array<LoadDetail>=new Array<LoadDetail>();

  loadFrequent:LoadFrequent=new LoadFrequent();
  loadFrequents:Array<LoadFrequent>=new Array<LoadFrequent>();

  modeListEvalue=false;
  modeListCommande=false;
  listTrsCommande: {transport:Transport, loadDetail:LoadDetail}[]=[]; //Transport[]; // Transports commandes
  listTrsEvalue: {transport:Transport, loadDetail:LoadDetail}[]=[]; //Transport[]; // Transports evalues


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
  modeGestionAppel: number = 2;
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
  listTrs: Transport[]=[]; // appels waitting
  listTrsSent: Transport[]=[]; // appels sent
  listTrsFini: Transport[]=[]; // appels finished
  listTrsAnnule: Transport[]=[]; // appels annules
  contacts: Contact[]=[];
  chauffeurs: Chauffeur[]=[];
  chauffeur: Chauffeur;

  em:EmailMessage=new EmailMessage();

  camions:Array<Camion>;  // truck no GPS
  camionsGps:Array<Camion>; // truck with Gps
  remorques:Array<Camion>;  // list of trailers
  camion:Camion;
  trailer1:Camion;
  trailer2:Camion;
  voyage:Voyage = new Voyage();
  
  templateName:string=''; // name of the transport model
  templates: Transport[]=[];  // liste transport models
  aStrings=[]
  tempId:number = null;
  idTransportTemp  : number = null; // to hold the number ID of transport
  modifyModels=false; // to appear the list models transport
  
  constructor(public transportsService : TransportsService, 
    public varsGlobal:VarsGlobal,
    private formBuilder:FormBuilder, public router:Router, 
    public contactsService:ContactsService,
    public shipperservice:ShippersService,
    public bankClientsService:BankClientsService, // use to send email
    public loadFrequentsService:LoadFrequentsService,
    public camionsService:CamionsService,
    private imageService: ImageService,
    public loadDetailsService:LoadDetailsService,
    public chauffeursService:ChauffeursService,
    public voyagesService : VoyagesService, 
    private itinerairesService:ItinerairesService,
    public transportersService:TransportersService
    ) { 
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
   
    // clear all infos of camion, chauffeur, loaddetails, and trailers
    this.camion=null;
    this.chauffeur=null;
    this.loadDetail=new LoadDetail();
    this.loadDetails=new Array<LoadDetail>();
    this.trailer1=null;
    this.trailer2=null;
    this.nomEntrepriseInputChange()   // to get shipper (client pro) and his client list
    //

    if(localStorage.getItem('fullName')!=null) this.transport.nomDispatch=localStorage.getItem('fullName')
    this.transport.dateDepart=new Date()
    this.transport.timeCall= (new Date().getHours().toString().length==2?new Date().getHours().toString():'0'+new Date().getHours().toString())+':'+ 
      (new Date().getMinutes().toString().length==2?new Date().getMinutes().toString():'0'+new Date().getMinutes().toString())  //"00:00";
    // refresh the templates
    this.transportsService.getAllTransportModels().subscribe((data:Array<Transport>)=>{
      this.templates = data; // just for test
    },err=>{console.log(err)})
  }
  
  modifyTemplate(t:Transport){
    console.log('t.id -  before modifiy model : '+t.id)
    this.transportsService.saveTransportModels(t).subscribe((data:Transport)=>{
      console.log('data.id - after modified model : '+data.id)
      this.transportsService.getAllTransportModels().subscribe((data:Array<Transport>)=>{
        this.templates = data;
      },err=>{console.log(err)})
    }, err=>{
      console.log(err)
    })
  }

  deleteTemplate(id:any){
    this.transportsService.deleteTransportModel(id).subscribe((data:Transport)=>{
      console.log('deleted template id - name : '+id+' - '+data.modelName+' - d.id: '+data.id)
      this.transportsService.getAllTransportModels().subscribe((data:Array<Transport>)=>{
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
    if(this.varsGlobal.language.includes('English')){
      var r = confirm("Are you sure to cancel this case ?")
    }
    else var r = confirm("Etes vous sur d'annuler cet appel ?")
    if(r) {
      this.camion=null;
      this.chauffeur=null;
      this.loadDetail=new LoadDetail();;
      this.loadDetails=new Array<LoadDetail>();
      this.trailer1=null;
      this.trailer2=null;
      this.back=0;
      this.pagePresent=this.back+1;
      this.forward=this.back+2
      if(this.transport.id!=null){
        this.transportsService.deleteTransport(this.transport.id).subscribe(data=>{
          this.transport=new Transport();
          this.onSelectTax(); // select tax when re-init a transport
          this.templateName='';
          if(localStorage.getItem('fullName')!=null) this.transport.nomDispatch=localStorage.getItem('fullName')
        }, err=>{
          console.log(err)
        })
      }
      else {
        this.transport=new Transport();
        this.onSelectTax(); // select tax when re-init a transport
      }
      if(localStorage.getItem('fullName')!=null) this.transport.nomDispatch=localStorage.getItem('fullName')
      this.templateName='';
    }
  }


  deleteLoadDetail(load:LoadDetail){
    this.loadDetails.splice(this.loadDetails.findIndex(x=>x==load), 1); 
    //this.loadDetailsService.deleteLoadDetail(load.id).subscribe(data=>{}, err=>{console.log(err)})
    //this.prixChange();
  }

  addLoadDetail(){
    let load:LoadDetail=new LoadDetail();
    load=this.loadDetail
    this.loadDetails.push(load)
    
    // let tempLoadsFee=0.00;
    // this.loadDetails.forEach(ld=>{
    //   tempLoadsFee+=ld.price
    // })
    // this.transport.loadsFee=tempLoadsFee;
    this.prixBase(this.transport.totalpoints)

    this.loadDetail=new LoadDetail(); // after added set equal new
    this.loadFrequent=null; // after added set to null
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
    // this.loadDetail=new LoadDetail();
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
  // on focus windows
  // @HostListener('window:focus', ['$event'])
  // onfocus(event:any):void {
  //   this.onRefresh()
  // }
  
  async ngOnInit() {    
    // attacher idtransporter
    if(localStorage.getItem('idTransporter')!=undefined)
      this.transport.idTransporter=Number(localStorage.getItem('idTransporter'))

    if(localStorage.getItem('fullName')!=null) this.transport.nomDispatch=localStorage.getItem('fullName')
    this.loadDetails.length=0;
    // begin taking list camions of SOSPrestige - Here 8 is the id of transporter SOSPrestige
    //this.transport.collecterArgent=this.transport.total-this.transport.porterAuCompte
    if(localStorage.getItem('fullName')!=null) 
      this.transport.nomDispatch=localStorage.getItem('fullName')
    await this.camionsService.camionsDeTransporter(Number(localStorage.getItem('idTransporter')))
    .subscribe((data:Array<Camion>)=>{
      //this.camions = data
      // this will take camions with gps monitor
      this.camions=[];
      this.camionsGps=[];
      this.remorques=[];
      // data.forEach(camion=>{
      //   if(camion.status && (camion.uniteMonitor!=null && camion.monitor!=null) && (camion.uniteMonitor.length!=0 && camion.monitor.length!=0))
      //     this.camions.push(camion)
      //   else
      //     if(camion.status) this.remorques.push(camion)  // Camions in service without GPS are trailers
      // })
      data.forEach(camion=>{
        if(camion.trailer && !camion.outService && camion.status) // trailer + not out ofservice + in operation
          this.remorques.push(camion)
        if(!camion.trailer && !camion.outService && camion.status) // not trailer + not out ofservice + in operation
        {
          if(!camion.gps && (camion.idTerminal==null || camion.idTerminal==0)) this.camions.push(camion)
          //if(camion.gps || (camion.idTerminal!=null && camion.idTerminal>0))
          if(camion.gps || (camion.idTerminal!=null && camion.idTerminal>0)) this.camionsGps.push(camion)
        }          
      })
      this.chauffeursService.chauffeursDeTransporter(Number(localStorage.getItem('idTransporter')))
      .subscribe((data:Array<Chauffeur>)=>{
        this.chauffeurs=data;
      }, err=>{
        console.log(err);
      });
    }, err=>{
      console.log();
    })
    // end of taking list camion SOSPrestige
    //await this.shipperservice.getAllShippers().subscribe((data:Array<Shipper>)=>{
    await this.shipperservice.getShippersTransporter(Number(localStorage.getItem('idTransporter')))
    .subscribe((data:Array<Shipper>)=>{
      this.listShipper=this.filteredShippers=data.sort((a, b)=>{
        return a.nom.localeCompare(b.nom)
      });
      /*this.listShipper.forEach((sh:Shipper)=>{
        console.log('Shipper nom : '+ sh.nom)
      })
      this.filteredShippers.forEach((sh:Shipper)=>{
        console.log('Shipper filtered nom : '+ sh.nom)
      })//*/
      this.transportsService.getAllTransportModels().subscribe((data:Array<Transport>)=>{
        this.templates = data; // just for test
        this.templates.forEach((t:Transport)=>{
          console.log('IDModel - Model Name : '+ t.id+' - '+t.modelName)
        })
      },err=>{console.log(err)})
    }, err=>{
      console.log(err);
    })
    
    await this.transportersService.getDetailTransporter(Number(localStorage.getItem('idTransporter')))
    .subscribe((data:Transporter)=>{
      this.transporter=data;
      // this.onSelectTax(); // get tax province after having transporter
      this.prixBaseInit();
      this.prixCalcul(); // there are already function onSelectTax()
    }), err=>{
      console.log(err)
    };
    
    var heure= this.transport.dateDepart.getHours().toString().length==2?this.transport.dateDepart.getHours().toString():'0'+this.transport.dateDepart.getHours().toString()
      //+':'+
    var minute= this.transport.dateDepart.getMinutes().toString().length==2?this.transport.dateDepart.getMinutes().toString():'0'+this.transport.dateDepart.getMinutes().toString()
    
    this.transport.timeCall=heure+':'+minute
    //console.log('this.transport.timeCall : '+this.transport.timeCall)
    //this.transport.typeService=this.serviceTypes[0];
    //this.typeServiceChange(this.serviceTypes[0]);
    //this.calculTotalpoints() 
    // this.prixBaseInit();
    // this.prixCalcul()
    // this.onSave();  // replace in onForward() when this.back==0 or this.presentPage==1
  }
  
  async chauffeurChange(){
    let strings:Array<string>=this.transport.nomIntervenant.split("Id.");
    if(strings.length>1){
      let chId:number =  Number(strings[1])
      await this.chauffeurs.forEach(ch=>{
        if(ch.id==chId) 
        {
          this.chauffeur=ch
          this.transport.nomIntervenant=this.chauffeur.nom
          this.transport.telIntervenant=this.chauffeur.tel
          this.transport.emailIntervenant=this.chauffeur.email
        }
      })
      if(chId!=this.chauffeur.id)
        {
          this.chauffeur=null;
          this.transport.nomIntervenant=''
          this.transport.telIntervenant=''
          this.transport.emailIntervenant=''
        }
    }  
    else this.chauffeur=null;
  }
  
  // this is to help the datalist show all 
  tempDatalist="";
  clickDatalist(transport:Transport){
    if(this.tempDatalist.length==0) this.tempDatalist=transport.camionAttribue
    transport.camionAttribue=""
  }
  mouseleaveDatalist(transport:Transport){
    if(transport.camionAttribue.length==0 && this.tempDatalist.length>0){
      transport.camionAttribue=this.tempDatalist
    }
   }

  subCamionChange(transport:Transport){
    if(transport.camionAttribue.includes('Waiting')){
      transport.camionAttribue="";
      transport.idCamion=null
      let r = confirm("Voulez vous le placer dans Waiting List ?")
        if(r)
        {
          this.transportsService.saveTransports(transport).subscribe((data:Transport)=>{
            this.itinerairesService.itineraireDeTransport(transport.id).subscribe((it:Itineraire)=>{
              if(it!=null){
                it.camionAttribue = ""
                it.idCamion = null
                this.itinerairesService.saveItineraires(it).subscribe(data=>{
                  this.onRefresh();
                }, err=>{console.log(err)})
              }
            }, err=>{console.log(err)})
          }, err=>{console.log(err)})    
        }
        else { 
          this.onRefresh();
        }
    }
    else{ // it is not the text Waiting
      let camion: Camion;
      let allCamions: Array<Camion>=[]
      allCamions = allCamions.concat(this.camionsGps, this.camions)
      let strings:Array<string>=transport.camionAttribue.split(".Id.");
      if(strings.length>1){
        let string0 :string = strings[0]
        let cId:number =  Number(strings[1])
        allCamions.forEach(c=>{
          if(c.id==cId) 
          {
            camion=c;
            transport.camionAttribue= string0.trim();
            transport.idCamion=c.id
          }
        })
        if(camion!=null){
          let r = confirm("Voulez vous prendre "+transport.camionAttribue+" ?")
          if(r)
          {
            this.transportsService.saveTransports(transport).subscribe((data:Transport)=>{
              this.itinerairesService.itineraireDeTransport(transport.id).subscribe((it:Itineraire)=>{
                if(it!=null){
                  it.camionAttribue = transport.camionAttribue
                  it.idCamion = transport.idCamion
                  this.itinerairesService.saveItineraires(it).subscribe(data=>{
                    this.onRefresh();
                  }, err=>{console.log(err)})
                }
              }, err=>{console.log(err)})
            }, err=>{console.log(err)})    
          }
          else { 
            this.onRefresh();
          }
        }
        else{ // don't find out truck
          this.onRefresh();
        }
      }
      else  // name dosen't correspond to truck
        this.onRefresh();    
    }    
  }

  camionChange(){
    let allCamions: Array<Camion>=[]
    allCamions = allCamions.concat(this.camionsGps, this.camions)
    let strings:Array<string>=this.transport.camionAttribue.split(".Id.");
    //let string0 :string = strings[0]
    // console.log('strings.length : '+strings.length);
    // console.log('strings[0] : '+strings[0]);
    // console.log('strings[1] : '+strings[1]);
    if(strings.length>1){
      let string0 :string = strings[0]
      let cId:number =  Number(strings[1])
      // this.camions
      allCamions.forEach(c=>{
        if(c.id==cId) 
        {
          this.camion=c;
          this.transport.camionAttribue= string0.trim(); //this.camion.unite
          this.transport.idCamion=this.camion.id
        }
      })
      if(cId!=this.camion.id)
        this.camion=null;
    }
    else this.camion=null;
  }

  trailer1Change(){
    let strings:Array<string>=this.transport.trailer1.split(".Id.");
    //let string0 :string = strings[0]
    if(strings.length>1){
      let string0 :string = strings[0]
      let tId:number =  Number(strings[1])
      this.remorques.forEach(r=>{
        if(r.id==tId) 
        {
          this.trailer1=r;
          this.transport.trailer1= string0.trim(); //this.trailer1.unite
          this.transport.idTrailer1=this.trailer1.id
        }
      })
      if(this.trailer1==undefined || tId!=this.trailer1.id)
        {
          this.trailer1=null;
          this.trailer2=null;
          this.transport.trailer2=''
        }
    }
    else {
      this.trailer1=null;
      this.trailer2=null;
      this.transport.trailer2=''
    }
  }

  trailer2Change(){
    let strings:Array<string>=this.transport.trailer2.split(".Id.");
    //let string0 :string = strings[0]
    if(strings.length>1){
      let string0 :string = strings[0]
      let tId:number =  Number(strings[1])
      if(tId==this.trailer1.id){
        if(this.varsGlobal.language.includes('English')){
          alert('Do not choose the same trailer1 !!')
        }
        else alert('Il ne faut pas le meme de trailer1 !!')
        this.transport.trailer2=''
      }
      else{
        this.remorques.forEach(r=>{
          if(r.id==tId) 
          {
            this.trailer2=r;
            this.transport.trailer2= string0.trim(); //this.trailer2.unite
            this.transport.idTrailer2=this.trailer2.id
          }
        })
      }
      
      if(this.trailer2==undefined || tId!=this.trailer2.id)
        this.trailer2=null;
    }
    else this.trailer2=null;
  }

  volumeLongueur(){
    let tot : number = 0;
    if(this.camion && this.camion.longueur!=undefined) tot = tot+this.camion.longueur
    if(this.trailer1 && this.trailer1.longueur!=undefined) tot = tot+this.trailer1.longueur
    if(this.trailer2 && this.trailer2.longueur!=undefined) tot = tot+this.trailer2.longueur
    return tot
  }

  volumePoids(){
    let tot : number = 0;
    if(this.camion && this.camion.poids!=undefined) tot = tot+this.camion.poids
    if(this.trailer1 && this.trailer1.poids!=undefined) tot = tot+this.trailer1.poids
    if(this.trailer2 && this.trailer2.poids!=undefined) tot = tot+this.trailer2.poids
    return tot
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

  shipperChange(){
    // this.transport=new Transport()
    if(this.shipper!=null){
      // this.transport=new Transport()
      this.transport.nomEntreprise=this.shipper.nom
      this.transport.idEntreprise=this.shipper.id
      // attacher idtransporter
      if(localStorage.getItem('idTransporter')!=undefined)
        this.transport.idTransporter=Number(localStorage.getItem('idTransporter'))
      this.loadFrequentsService.loadFrequentsDeShipper(this.shipper.id)
      .subscribe((data:Array<LoadFrequent>)=>{
        this.loadFrequents=data.sort((a, b)=>{return a.nom.localeCompare(b.nom)})
        this.onRefresh()
      })
    }
    else{
      this.transport.nomEntreprise=''
      this.transport.idEntreprise=null
      this.loadFrequents=[]
      this.onRefresh()
    }
    this.resetSimple(); // when we change shipper, we must begin from scratch the command/evaluate
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
    this.modeListEvalue=false
    this.modeListCommande=false
    this.transport = new Transport(); 
    this.loadFrequent=new LoadFrequent();
    if(this.shipper!=null) {
      this.transport.nomEntreprise=this.shipper.nom
      this.transport.idEntreprise=this.shipper.id
    }
    // attacher idtransporter
    if(localStorage.getItem('idTransporter')!=undefined)
      this.transport.idTransporter=Number(localStorage.getItem('idTransporter'))
  }

  loadFrequentChange(){
    // if(this.loadFrequent==null) 
    this.loadDetail=new LoadDetail()
    if(this.loadFrequent!=null){
      this.loadDetail.description=this.loadFrequent.nom
      this.loadDetail.idLoadFrequent=this.loadFrequent.id
      this.priceLoad(this.loadDetail, this.loadFrequent)
    }
    
  }

  addLoadSimpleDetail(){
    let load:LoadDetail=new LoadDetail();
    load=this.loadDetail
    this.loadDetails.push(load)
    this.prixBase(this.transport.totalpoints)
    this.loadDetail=new LoadDetail(); // after added set equal new
  }

  async originSimpleChange(){
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
      // add evaluatedtime and add textTime  (to know how many times client evaluated for this transport)
      ++this.transport.evaluatedTimes;
      this.transport.textTimes = this.transport.textTimes + (this.transport.origin + " - " + this.transport.destination+ "; ")
      await this.setDistanceTravel(this.transport.origin, this.transport.destination)
      //await this.showMap()
      //this.typeServiceChange(this.remorquage.typeService)
    }
  }

  async destinationSimpleChange(){
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
              // // add evaluatedtime and add textTime  (to know how many times client evaluated for this transport)
              // ++this.transport.evaluatedTimes;
              // this.transport.textTimes = this.transport.textTimes + (this.transport.origin + " - " + this.transport.destination+ "; ")
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
      // add evaluatedtime and add textTime  (to know how many times client evaluated for this transport)
      ++this.transport.evaluatedTimes;
      this.transport.textTimes = this.transport.textTimes + (this.transport.origin + " - " + this.transport.destination+ "; ")
      
      await this.setDistanceTravel(this.transport.origin, this.transport.destination)
      //await this.showMap()
      //this.typeServiceChange(this.remorquage.typeService)
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
    
    if(this.shipper!=null && this.shipper.id!=null && this.shipper.id>0)
      this.transport.idEntreprise=this.shipper.id // add id shipper if there is
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
      alert(this.transport.typeDoc==1?"C'est enregistre.":"C'est envoye.")
      // after create order then create itineraire
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

      route.camionAttribue = this.transport.camionAttribue //= string0.trim(); //this.camion.unite
      route.idCamion = this.transport.idCamion //=this.camion.id

      this.itinerairesService.saveItineraires(route).subscribe((data:Itineraire)=>{
        route=data;
      }, err=>{console.log()})
    }, err=>{
      console.log(err)
    })
  }

  showDateLocal(d:Date){
    d=new Date(d);
    let dateLocal= new Date(d.getTime() + (new Date().getTimezoneOffset()*60000))
    return dateLocal;
  }
  
  pickDateChange(event){
    this.transport.dateReserve=event.target.value;
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
      loadDetail.price=quantity*priceLoadFrequent
    }
  }
  // prix base
  prixBase(totalPoints:number){
    this.transport.prixBase =0.00;

    this.transport.loadsFee=0.00;
    let tempLoadsFee=0.00;
    this.loadDetails.forEach(ld=>{
      this.priceLoad(ld, this.loadFrequents.find(x=>(x.id===ld.idLoadFrequent)))
      tempLoadsFee+=ld.price
    })
    this.transport.prixBase=this.transport.loadsFee=Math.round(this.roundPrice(tempLoadsFee)*100)/100
    this.prixCalcul()
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
  // prix base
  prixBaseInit(){
    this.transport.prixBase = 0.00;
    this.transport.loadsFee= 0.00;
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
              if(this.varsGlobal.language.includes('English')){
                alert('Can not locate this origin !!')
              }
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
              if(this.varsGlobal.language.includes('English')){
                alert('can not locate this destination')
              }
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
    this.tempDatalist=""; // initial the tempdata of datalist
    if(this.shipper!=null && this.shipper.id!=null && this.shipper.id>0){
      this.transportsService.getTransportsEntreprise(this.shipper.id).subscribe((data:Array<Transport>)=>{
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
            this.loadDetailsService.loadDetailsDeTransport(tr.id).subscribe((data:Array<LoadDetail>)=>{
              if(data!=null&&data.length>0) {this.listTrsEvalue.push({transport:tr, loadDetail:data[0] });}
            })        
          }
          else if(tr.typeDoc==2) {
            this.loadDetailsService.loadDetailsDeTransport(tr.id).subscribe((data:Array<LoadDetail>)=>{
            if(data!=null&&data.length>0) {this.listTrsCommande.push({transport:tr, loadDetail:data[0] });}
            })
          }
        })
      })
    }

    // if shipper null => find all transports
    else this.transportsService.getTransportsTransporter(Number(localStorage.getItem('idTransporter')))
    .subscribe((data:Array<Transport>)=>{
      // refresh the templates
      this.transportsService.getAllTransportModels().subscribe((data:Array<Transport>)=>{
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
          this.loadDetailsService.loadDetailsDeTransport(tr.id).subscribe((data:Array<LoadDetail>)=>{
            if(data!=null&&data.length>0) {this.listTrsEvalue.push({transport:tr, loadDetail:data[0] });}
          })        
        }
        else if(tr.typeDoc==2) {
          this.loadDetailsService.loadDetailsDeTransport(tr.id).subscribe((data:Array<LoadDetail>)=>{
          if(data!=null&&data.length>0) {this.listTrsCommande.push({transport:tr, loadDetail:data[0] });}
          })
        }
        else if(tr.fini) this.listTrsFini.push(tr)
        else if (tr.driverNote.includes("!!Cancelled!!")) this.listTrsAnnule.push(tr)
        else if (tr.sent) this.listTrsSent.push(tr)
        else if (tr.valid) this.listTrs.push(tr)//*/
      })
    }, err=>{
      console.log(err)
    })
    await this.sleep(1500) // wait 1,5 seconde before sort the list trscomande
    this.listTrsEvalue.sort((b,a)=>{
      if(a.transport.id>b.transport.id)
        return 1;
      if(a.transport.id<b.transport.id)
        return -1;
      return 0;
    });
    this.onSortStatuslistTrsCommande(); // sort listTrsCommande by status
  }

  // sort listTrsCommande by status
  numListShow = 1; // 1:schedule, 2:waiting, 3:finished, 4:cancelled, 5:archive
  listTrsCommandeShow: {transport:Transport, loadDetail:LoadDetail}[];
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
    
    if(this.listTrsCommande!=null && this.listTrsCommande.length>0) {
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
    // this.listTrsCommande = this.listTrsCommandeSchedule.concat(
    //   this.listTrsCommandeWaiting.concat(this.listTrsCommandeCancelled.concat(
    //     this.listTrsCommandeFini)))
    if(this.numListShow==1) 
      this.listTrsCommandeShow = this.listTrsCommandeSchedule
    if(this.numListShow==2) 
      this.listTrsCommandeShow = this.listTrsCommandeWaiting
    if(this.numListShow==3) 
      this.listTrsCommandeShow = this.listTrsCommandeFini
    if(this.numListShow==4) 
      this.listTrsCommandeShow = this.listTrsCommandeCancelled
    if(this.numListShow==5) 
      this.listTrsCommandeShow = this.listTrsCommandeArchive
  }

  allCommands(){
    this.listTrsCommandeShow = this.listTrsCommandeSchedule.concat(
      this.listTrsCommandeWaiting.concat(this.listTrsCommandeCancelled.concat(
        this.listTrsCommandeFini)))
  }
  
  waitingCommands(){
    this.listTrsCommandeShow = this.listTrsCommandeWaiting
    this.numListShow = 2; // 2:waiting
  }
  
  scheduleCommands(){
    this.listTrsCommandeShow = this.listTrsCommandeSchedule
    this.numListShow = 1; // 1:schedule
  }
  
  finishedCommands(){
    this.listTrsCommandeShow = this.listTrsCommandeFini
    this.numListShow = 3; // 3:finished
  }
  
  cancelledCommands(){
    this.listTrsCommandeShow = this.listTrsCommandeCancelled
    this.numListShow = 4; // 4:cancelled
  }

  archiveCommands(){
    this.listTrsCommandeShow = this.listTrsCommandeArchive
    this.numListShow = 5; // 5:archive
  }

  onCancelTransportInList(transport:Transport){
    if(this.varsGlobal.language.includes('English')){
      var r = confirm("Are you sure to cancel this freight ?")
    }
    else var r = confirm("Etes vous sur d'annuler ce transport ?")
    if(r==true){
      transport.driverNote="!!Cancelled!!";  
      transport.idCamion=null;   
      transport.camionAttribue=""   
      this.transportsService.saveTransports(transport).subscribe(data=>{
        this.itinerairesService.itineraireDeTransport(transport.id).subscribe((it:Itineraire)=>{
          if(it!=null){
            it.cancelled = true
            it.camionAttribue = ""
            it.idCamion = null
            this.itinerairesService.saveItineraires(it).subscribe(data=>{
              this.onRefresh();
            }, err=>{console.log(err)})
          }
        }, err=>{console.log(err)})
      }, err=>{console.log(err)})
    }
  }

  onFinishTransportInList(transport:Transport){
    if(this.varsGlobal.language.includes('English')){
      var r = confirm("Are you sure this freight finished ?")
    }
    else var r = confirm("Etes vous sur ce transport a fini ?")
    if(r==true){
      transport.fini=true;  
      this.transportsService.saveTransports(transport).subscribe(data=>{
        this.itinerairesService.itineraireDeTransport(transport.id).subscribe((it:Itineraire)=>{
          if(it!=null){
            it.fini = true
            this.itinerairesService.saveItineraires(it).subscribe(data=>{
              this.onRefresh();
            }, err=>{console.log(err)})
          }
        }, err=>{console.log(err)})
      }, err=>{console.log(err)})
    }
  }

  onResumeTransportInList(transport:Transport){
    if(this.varsGlobal.language.includes('English')){
      var r = confirm("Do you resume this freight ?")
    }
    else var r = confirm("Voulez vous reprendre ce transport ?")
    if(r==true){
      transport.driverNote="";  
      this.transportsService.saveTransports(transport).subscribe(data=>{
        this.itinerairesService.itineraireDeTransport(transport.id).subscribe((it:Itineraire)=>{
          if(it!=null){
            // it.fini = false
            it.cancelled = false;
            this.itinerairesService.saveItineraires(it).subscribe(data=>{
              this.onRefresh();
            }, err=>{console.log(err)})
          }
        }, err=>{console.log(err)})
      }, err=>{console.log(err)})
    }
  }

  onDeleteTransportInList(transport:Transport){
    if(this.varsGlobal.language.includes('English')){
      var r = confirm("Would you delete this freight ?")
    }
    else var r = confirm("Voulez vous supprimer ce transport ?")
    if(r==true){
      this.transportsService.deleteTransport(transport.id).subscribe(data=>{
        this.loadDetailsService.loadDetailsDeTransport(transport.id).subscribe((lds:Array<LoadDetail>)=>{
          this.loadDetails=lds;
          this.loadDetails.forEach(load=>{
            load.idTransport=this.transport.id;
            this.loadDetailsService.deleteLoadDetail(load.id).subscribe(data=>{}, err=>{console.log(err)})
          })
        }, err=>{
          console.log(err)
        })
        this.itinerairesService.itineraireDeTransport(transport.id).subscribe((it:Itineraire)=>{
          if(it!=null){
            this.itinerairesService.deleteItineraire(it.id).subscribe(data=>{
              this.onRefresh();
            }, err=>{console.log(err)})
          }
        }, err=>{console.log(err)})
      }, err=>{console.log(err)})
    }
  }

  onArchiveTransportInList(transport:Transport){
    if(this.varsGlobal.language.includes('English')){
      var r = confirm("Would you archive this freight ?")
    }
    else var r = confirm("Voulez vous archiver ce transport ?")
    if(r==true){
      transport.archive = true;
      this.transportsService.saveTransports(transport).subscribe(data=>{
        this.itinerairesService.itineraireDeTransport(transport.id).subscribe((it:Itineraire)=>{
          if(it!=null){
            it.archive = true;
            this.itinerairesService.saveItineraires(it).subscribe(data=>{
              this.onRefresh();
            }, err=>{console.log(err)})
          }
        }, err=>{console.log(err)})
      }, err=>{console.log(err)})
    }
  }

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
      // let promise = new Promise(function(resolve, reject){
      //   setTimeout(function(){
      //     resolve('Print after 1 seconde')
      //   },1000);
      // });
      // promise.then(function(value){
      //   console.log('value: ' + value)
      // });
      this.printBonDeTransport('printevalueselected')
    }
    if(this.transportSelected.typeDoc==2&&this.transportSelected.fini){
      this.printBonDeTransport('toprint')
    }
    if(this.transportSelected.typeDoc==2 && !this.transportSelected.fini){
      this.printBonDeTransport('printcommandselected')
    }
    // if(this.transportSelected.typeDoc==2){
    //   this.printBonDeTransport('printcommandselected')
    // }
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
    // this.resetSimple();
  }

  async prixCalcul(){
    //this.transport.prixBase +
    this.transport.horstax= this.transport.loadsFee + this.transport.waitingFee + this.transport.ptoFee
    if((this.transport.distance-this.transport.inclus)>0){
      this.transport.horstax =await this.transport.horstax + (this.transport.distance-this.transport.inclus)*this.transport.prixKm
    }
    this.transport.horstax=Math.round(this.transport.horstax*100)/100  // around to 2 number
    if(this.transport.taxable){
      this.onSelectTax();
      // this.transport.tps =Math.round(this.transport.horstax*0.05*100)/100
      // this.transport.tvq =Math.round(this.transport.horstax*0.09975*100)/100
      // we must remember : tps is gsthst and tvq is pst
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
  }

  // prixCalculWithHorsTax(){
  //   if(this.remorquage.taxable){
  //     if(this.remorquage.taxProvince==null || this.remorquage.taxProvince.length==0)
  //       this.remorquage.taxProvince=this.provinceList[10] // Quebec is the province by default
  //     this.onSelectTax();

  //     // this.remorquage.tps =Math.round(this.remorquage.horstax*0.05*100)/100
  //     // this.remorquage.tvq =Math.round(this.remorquage.horstax*0.09975*100)/100
  //     // we must remember : tps is gsthst and tvq is pst
  //     this.remorquage.tps =Math.round(this.remorquage.horstax*this.taxProvince.gsthst)/100
  //     this.remorquage.tvq =Math.round(this.remorquage.horstax*this.taxProvince.pst)/100
  //     this.remorquage.total= Math.round((this.remorquage.horstax+this.remorquage.tvq+this.remorquage.tps)*100)/100
  //   }
  //   else{
  //     this.remorquage.tps =0.00; 
  //     this.remorquage.tvq =0.00; 
  //     this.remorquage.total= this.remorquage.horstax; 
  //   }
  // }

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

  prixCalculWithHorsTax(){
    if(this.transport.taxable){
      this.onSelectTax();
      // this.transport.tps =Math.round(this.transport.horstax*0.05*100)/100
      // this.transport.tvq =Math.round(this.transport.horstax*0.09975*100)/100
      // we must remember : tps is gsthst and tvq is pst
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
    if(this.varsGlobal.language.includes('English')){
      var r = confirm("Are you sure this case is finished ?")
    }
    else var r = confirm("Etes vous sur que ce cas est fini ?")
    if(r==true){
      console.log("Le cas est termine.")
      this.transport.fini=true;
      this.transportsService.saveTransports(this.transport).subscribe(data=>{
        this.transport=new Transport();
        this.onSelectTax(); // select tax when re-init a transport
      }, err=>{console.log(err)})
    }
    else {
      console.log('Le cas est continue.')
    }
    
  }

  onCancel(){
    if(this.varsGlobal.language.includes('English')){
      var r = confirm("Are you sure to cancel this case ?")
    }
    else var r = confirm("Etes vous sur d'annuler ce cas ?")
    if(r==true){
      console.log("Le cas est annulle.")
      if(this.transport.id>0){
        this.transportsService.deleteTransport(this.transport.id).subscribe(data=>{
          // commence d'envoyer email
          if(this.transport.sent && this.transport.emailIntervenant!=null && this.transport.emailIntervenant.length>10){
            this.em.emailDest=this.transport.emailIntervenant
            if(this.varsGlobal.language.includes('English')){
              this.em.titre="Cancel case #Num : " + this.transport.id.toString()
              this.em.content='<div><p> '+'Cancel case #Num : ' + this.transport.id.toString()+' </p></div>'
            }
            else{
              this.em.titre="Annuler case #Bon : " + this.transport.id.toString()
              this.em.content='<div><p> '+'Annuler case #Bon : ' + this.transport.id.toString()+' </p></div>'    
            }
            this.bankClientsService.envoyerMail(this.em).subscribe(data=>{
              if(this.varsGlobal.language.includes('English')){
                alert('A canceled email was sent to driver.')
              }
              else alert("Un courriel annulation a ete aussi envoye au chauffeur.")
            }, err=>{
              console.log()
            })
          }
          //*/
          this.transport=new Transport();
          this.onSelectTax(); // select tax when re-init a transport
        }, err=>{console.log(err)})
      }
    }
    else {
      console.log('Le cas est continue.')
    }
  }

  onDelete(tr:Transport){
    if(this.varsGlobal.language.includes('English')){
      var r = confirm("Are you sure to delete this case ?")
    }
    else var r = confirm("Etes vous sur de supprimer ce transport ?")
    if(r==true){
      console.log("Ce Transport est supprime.")
      if(tr.id>0){
        this.transportsService.deleteTransport(tr.id).subscribe(data=>{
          this.listTrsAnnule.splice(this.listTrsAnnule.indexOf(tr),1)
        }, err=>{console.log(err)})
      }
    }
    else {
      console.log('Ce Transport est maintenu.')
    }
  }
  
  contactChange(){
    let strings:Array<string>=this.transport.nomContact.split("Id.");
    if(strings.length>1){
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
          if(this.varsGlobal.language.includes('English')){
            alert("It's saved.")
          }
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
        this.onSelectTax(); // select tax when re-init a transport
        this.camion=null
        this.trailer1=null
        this.trailer2=null
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
          if(this.varsGlobal.language.includes('English')){
            alert("It's saved.")
          }
          else alert("C'est enregistre.")
        }
        //await this.createVoyage() // creer un voyage
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
        this.onSelectTax(); // select tax when re-init a transport
        this.camion=null
        this.trailer1=null
        this.trailer2=null   
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

  createVoyage(){
    this.voyage.originLat=this.transport.originLat
    this.voyage.originLong=this.transport.originLong
    this.voyage.destLat=this.transport.destLat
    this.voyage.destLong=this.transport.destLong
    this.voyage.dateDepart = new Date(this.voyage.dateDepart)
    this.voyage.origin=this.transport.origin
    this.voyage.originAdresse=this.transport.originAdresse
    this.voyage.originVille=this.transport.originVille
    this.voyage.originProvince=this.transport.originProvince
    this.voyage.destination=this.transport.destination
    this.voyage.destAdresse=this.transport.destAdresse
    this.voyage.destVille=this.transport.destVille
    this.voyage.destProvince=this.transport.destProvince
    this.voyage.typeCamion=this.transport.typeCamion
    this.voyage.optionVoyage=this.transport.optionDemande
    this.voyage.idTransporter=8 // id of sosprestige by default
    this.voyagesService.saveVoyages(this.voyage).subscribe((data:Voyage)=>{
      if(this.varsGlobal.language.includes('English')){
        alert('A voyage was also created.')
      }
      else alert('Un voyage est aussi cree.')
      this.voyage=data
      this.transport.idVoyage=this.voyage.id
      this.transportsService.saveTransports(this.transport).subscribe(data=>{},err=>{console.log(err)})
    }, err=>{
      console.log(err)
    })
  }

  onPrint(heure){    
    console.log(heure)
    console.log('this.transport.timeCall : '+this.transport.timeCall)
    console.log('this.transport.timeResrvation : '+this.transport.timeResrvation)
  }

  //* calculer distance travel en kms
  async setDistanceTravel(address1: string, address2:string) { // in km
    this.transport.distance=null; // set distance to null, before calculate
    this.transport.loadsFee=null; // set loadsFee to null while calculating 
    let service = new google.maps.DistanceMatrixService;// = new google.maps.DistanceMatrixService()
    // calculate load distance - ld
    service.getDistanceMatrix({
      'origins': [address1], 'destinations': [address2], travelMode:google.maps.TravelMode.DRIVING
    }, (results: any) => {    
      if(this.mode==1){
        this.transport.distance= Math.round((results.rows[0].elements[0].distance.value)*0.621371/1000)  
      }
      else this.transport.distance= Math.round((results.rows[0].elements[0].distance.value)/1000)  
      // calculate price load actual and total price after distance
      // this.priceLoad(this.loadDetail, this.loadFrequent)
      // this.prixBase(this.transport.totalpoints)
    });  
    await this.sleep(2000);
    this.prixBase(this.transport.totalpoints)
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
        this.loadFrequentsService.loadFrequentsDeShipper(ent.id).subscribe((data:Array<LoadFrequent>)=>{
          this.loadFrequents=data.sort((a, b)=>{return a.nom.localeCompare(b.nom)});
        }, err=>{console.log(err)})
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
      //this.transportsService.getAllTransports().subscribe((data:Array<Transport>)=>{
      this.transportsService.getTransportsTransporter(Number(localStorage.getItem('idTransporter')))
      .subscribe((data:Array<Transport>)=>{
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
    let stringsd:string[]=location.href.split('/transport-client/')
    if(this.transport.emailIntervenant!=null && this.transport.emailIntervenant.length>10){
      this.em.emailDest=this.transport.emailIntervenant
      if(this.varsGlobal.language.includes('English')){
        this.em.titre="From : " + this.transport.originVille + '  -  To: ' + this.transport.destVille
      }
      else this.em.titre="De : " + this.transport.originVille + '  -  A: ' + this.transport.destVille
      this.em.content='<div><p> '+document.getElementById('toprint').innerHTML+
      " <br> <a href='"+ stringsd[0] +"/transport-client/"
      + (this.transport.id*100-5)   //1733  // replace by Number of Bon Transport
      +"'><h4>Detail</h4></a>" +" </p></div>"    
      this.bankClientsService.envoyerMail(this.em).subscribe(data=>{
        if(this.varsGlobal.language.includes('English')){
          alert('Email was sent to driver.')
        }
        else alert("Le courriel a ete envoye au chauffeur.")
        if(this.transport.emailContact.length>10){
          let em:EmailMessage=new EmailMessage();
          em.emailDest=this.transport.emailContact;  // email of professional
          if(this.varsGlobal.language.includes('English')){
            em.titre= "In progress - " + "From : " + this.transport.originVille + '  -  To: ' + this.transport.destVille
            em.content='<div><p> '+ em.titre + " <br>" + 
            "<div> #Num: " + this.transport.id+ " </div>"+
            '<div>'+
              '<div><br></div>'+
              '<div>Thank you for your collaboration.</div>'+
              '<div><br></div>'+
              '<div>Dispatch - '+this.transporter.nom+' </div>'+
              '<font face="garamond,serif"><b></b><font size="4"></font></font>'+
            '</div>'+
            '<div><font face="garamond,serif" size="4"><b>'+this.transporter.email+'</b></font></div>'+
            '<div><font face="garamond,serif" size="4"><b><br>'+this.transporter.tel+'</b></font></div>'+
            " </p></div>"
          }
          else{
            em.titre= "Encours traitement - " + "Transport De : " + this.transport.originVille + '  -  A: ' + this.transport.destVille
            em.content='<div><p> '+ em.titre + " <br>" + 
            "<div> #Bon: " + this.transport.id+ " </div>"+
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
          }
          
          this.bankClientsService.envoyerMail(em).subscribe(data=>{
            console.log('Le client professionnel recois aussi .')
          }, err=>{console.log(err)})
        }
        this.transport.sent=true;
        this.onSaveWithMessage();
        // this.back=0;
        // this.pagePresent=this.back+1;
        // this.forward=this.back+2
        // this.transport=new Transport();      
        // if(localStorage.getItem('fullName')!=null) this.transport.nomDispatch=localStorage.getItem('fullName')
        /*this.transportsService.saveTransports(this.transport).subscribe((data:Transport)=>{
          this.transport=data;
        }, 
          err=>{console.log(err)
        })
        this.gotoTop();//*/
      }, err=>{
        console.log(err)
      })//*/
    }
    else 
    {
      if(this.varsGlobal.language.includes('English')){
        alert("Verify drivers' email, please!!")
      }
      else alert("Verifier le courriel de chauffer, SVP!!!")
    }
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

  onPage1(){
    this.pagePresent=1;
    this.back=this.pagePresent-1;
    this.forward=this.pagePresent+1
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
  onPage9(){
    this.modifyModels=false;  // must be sure for close list templates
    if(this.transport.id==null){
      this.onSave();
    }
    this.pagePresent=9;
    this.back=this.pagePresent-1;
    this.forward=this.pagePresent+1
  }
  onPage10(){
    this.modifyModels=false;  // must be sure for close list templates
    if(this.transport.id==null){
      this.onSave();
    }
    this.pagePresent=10;
    this.back=this.pagePresent-1;
    this.forward=this.pagePresent+1
  }

  loadPriceChange(){
    let tempTotal=0;
    this.loadDetails.forEach(load=>{
      tempTotal+=load.price
    })
    this.transport.loadsFee=tempTotal
  }
  // testVar:Shipper=new Shipper();
  // textreturn(id:number){
  //   let s:Shipper=new Shipper();
  //   this.listShipper.forEach(sp=>{if(sp.id==id)s=sp})
  //   console.log('Shipper : ' + s.nom)
  //   return ' .aa.' + s.nom
  // }
  // onListFrequentChange(e){
  //   //this.extractLoadFrequent(e.target.value)
  //   alert('e : '+ e)
  //   alert('e.target.value : '+ e.target.value)
  //   //this.extractShipper(e.target.value)
  // }
  // extractLoadFrequent(l:LoadFrequent){
  //   alert('l.idTransporter + l.nom + l.description : '+ l.idTransporter +  ' - ' + l.nom +  ' - ' + l.description)
  // }
  // extractShipper(){
  //   //alert('Shipper : idTransporter + nom + tel : '+ this.testVar.idTransporter +  ' - ' + this.testVar.nom +  ' - ' + this.testVar.tel)
  // }

  // logout(){
  //   localStorage.clear();
  //   //this.router.navigateByUrl("");
  //   //this.router.navigateByUrl('/transporters/');
  //   this.router.navigate(['']);
  // }
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
