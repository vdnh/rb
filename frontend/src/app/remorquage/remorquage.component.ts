import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import {SignaturePad} from 'angular2-signaturepad/signature-pad';
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
import * as FileSaver from "file-saver";
import { ShipperParticuliersService } from 'src/services/shipperParticuliers.service';
import { ShipperParticulier } from 'src/model/model.shipperParticulier';
import { Transporter } from 'src/model/model.transporter';
import { TransportersService } from 'src/services/transporters.service';
import { VarsGlobal } from 'src/services/VarsGlobal';

@Component({
  selector: 'app-remorquage',
  templateUrl: './remorquage.component.html',
  styleUrls: ['./remorquage.component.css']
})
export class RemorquageComponent implements OnInit {

  //* pour checkBox list
  formGroup: FormGroup;
  serviceTypes = ["Leger", "Moyen", "Lourd"];
  // prix remorquage (bas - km - inclus)
  /*prixBase1=85.00;
  prixKm1=2.65;
  inclus1=5.00; 
  prixBase2=95.00;
  prixKm2=3.15;
  inclus2=5.00;
  prixBase3=105.00;
  prixKm3=3.80;
  inclus3=7.00;//*/
  modeGestionAppel=2;
  /*ent1:Entreprise={id:1, nom:'Honda Laval'}
  ent2:Entreprise={id:2, nom:'Albi Eustache'}
  ent3:Entreprise={id:3, nom:'Incendie Rosemere'}
  ent4:Entreprise={id:4, nom:'Hyundai Terrebonne'}
  listEntreprise=[this.ent1, this.ent2, this.ent3, this.ent4];
  listIdEntreprise=[1, 2, 3, 4];
  filteredEntreprises=this.listEntreprise;//*/

  shipper:Shipper; //=new Shipper();
  listShipper=[];
  //filteredShippers=[]; //=this.listShipper;
  //firstFilteredShipper='' //new Shipper();
  taxList = myGlobals.taxList; // tax list of provinces' Canada  - example this.taxList['province'].gsthst
  taxProvince  = this.taxList[10]
  // taxtest = this.taxProvince.pst
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
    //'border': '2px dotted gray',
    //'canvasWidth': 'auto',
    //'canvasHeight': 'auto',
  };
  shipperParticulier: Shipper;
  transporter: Transporter;
  
  onSelectTax(){
    this.taxList.forEach(tp=>{
      if(tp.id.localeCompare(this.remorquage.taxProvince)==0)
        this.taxProvince=tp
    })
    //alert('province: '+this.taxProvince.id +' pst-tvq: '+ this.taxProvince.pst + ' gsthst: ' +this.taxProvince.gsthst)
  }
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
  centerCoord={lat:45.568806, lng:-73.918333}  // 

  today=new Date();
  modeHistoire: number=-1;
  modeExport: number=-1;  //to export
  dateExport: Date = null; // to export
  listRqs: Remorquage[]=[]; // appels waitting
  listRqsSent: Remorquage[]=[]; // appels sent
  listRqsFini: Remorquage[]=[]; // appels finished
  listRqsAnnule: Remorquage[]=[]; // appels annules
  contacts: Contact[];
  chauffeurs: Chauffeur[];
  chauffeur: Chauffeur;
  
  back=0;
  pagePresent=this.back+1;
  forward=this.back+2;
  particulier=false;
  compteClient=false;

  em:EmailMessage=new EmailMessage();
  camion:Camion;
  camions:Array<Camion>; // truck no gps
  camionsGps:Array<Camion>; // truck with Gps
  vehiculeModeles = []; //myGlobals.d2cmediaacura;
  marquesModeles = myGlobals.marquesModeles;
  colors = myGlobals.colors
  colorsEnglish = myGlobals.colorsEnglish
  
  marqueChange(){
    this.vehiculeModeles=[];
    this.marquesModeles.forEach(mm =>{
      if(this.remorquage.marque.includes(mm.marque))
        this.vehiculeModeles=mm.modeles
    })
  }

  constructor(public remorquagesService : RemorquagesService, 
    // public geocoding : GeocodingService, 
    public varsGlobal:VarsGlobal,
    private formBuilder:FormBuilder, public router:Router, 
    public contactsService:ContactsService,
    public shipperservice:ShippersService,
    public bankClientsService:BankClientsService, // use to send email
    private datePipe: DatePipe,
    public camionsService:CamionsService,
    public chauffeursService:ChauffeursService,
    public shipperParticuliersService:ShipperParticuliersService,
    public transportersService:TransportersService
    ) { 
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
  onBack(){
    if((this.back==1&&this.compteClient)||(this.particulier&&this.back==2)){
      this.back=0
      this.particulier=false;
      this.compteClient=false;
    }
    else if(this.pagePresent==10 && !this.remorquage.panne && !this.remorquage.accident)
      this.back=this.back-2; // contourner pagePresent=9, ne pas demander l'endroite de livraison
    else this.back=this.back-1;
    this.pagePresent=this.back+1;
    this.forward=this.back+2;
    //console.log('onBack(): '+ this.back +' '+this.pagePresent+' '+this.forward)
  }
  onForward(){
    if(this.pagePresent==8 && !this.remorquage.panne && !this.remorquage.accident)
      this.back=this.back+2; // contourner pagePresent=9, ne pas demander l'endroite de livraison
    else this.back=this.back+1;

    this.pagePresent=this.back+1;
    this.forward=this.back+2;
    //this.prixCalcul();
    this.typeServiceChange(this.remorquage.typeService);
    //console.log('onForward(): '+ this.back +' '+this.pagePresent+' '+this.forward)
  }
  
  problemService(){
    let probSer=" ";
    if(this.varsGlobal.language.includes('English')){
      if(this.remorquage.panne)
        probSer=probSer+"Breakdown, "
      if(this.remorquage.accident)
        probSer=probSer+"Accident, "
      if(this.remorquage.pullOut)
        probSer=probSer+"PullOut, "
      if(this.remorquage.debaragePorte)
        probSer=probSer+"Door Unclock, "
      if(this.remorquage.survoltage)
        probSer=probSer+"Boost, "
      if(this.remorquage.essence)
        probSer=probSer+"Gasoline, "
      if(this.remorquage.changementPneu)
        probSer=probSer+"Tire Change, "
    }
    else{
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
    }
    
    return probSer;
  }
  
  ifParticulier(){
    if(this.particulier){
      this.compteClient=false;
      this.back=2;
      this.pagePresent=this.back+1;
      this.forward=this.back+2;
      this.onSave();
      this.remorquage.idEntreprise=null;
      this.remorquage.nomEntreprise="";
      this.remorquage.nomContact="";
      this.remorquage.telContact="";
      this.remorquage.extTelContact="";
      this.remorquage.emailContact="";
      this.shipper= this.shipperParticulier //new Shipper();
      this.calculePrixbase()
      this.prixCalcul()
      //console.log('Particulier - begin with back=1: '+ this.back +' '+this.pagePresent+' '+this.forward);
    }
  }
  ifCompteClient(){
    if(this.compteClient){
      //this.shipperservice.getAllShippers().subscribe((data:Array<Shipper>)=>{
      this.shipperservice.getShippersTransporter(Number(localStorage.getItem('idTransporter')))
      .subscribe((data:Array<Shipper>)=>{
        this.listShipper=data;
        this.listShipper.sort((a,b)=>{
          return a.nom.localeCompare(b.nom)
        })
        this.particulier=false;
        this.back=1;
        this.pagePresent=this.back+1;
        this.forward=this.back+2;
        this.onSave();
        this.shipper= this.shipperParticulier //new Shipper();
        this.calculePrixbase()
        this.prixCalcul()
      }, err=>{
        console.log(err);
      })
      
      //this.setPrixParticulier()
      //console.log('CompteClient - begin with back=0: '+ this.back +' '+this.pagePresent+' '+this.forward);
    }
  }

  setPrixParticulier(){ // prix dans ficher model.shipper.ts sont des prix pareticuliers
    this.shipper= this.shipperParticulier //new Shipper();
  }

  async ngOnInit() {    
    // attacher idtransporter
    if(localStorage.getItem('idTransporter')!=undefined)
      this.remorquage.idTransporter=Number(localStorage.getItem('idTransporter'))

    // this.shipperParticuliersService.getDetailShipperParticulier(1).subscribe((data:ShipperParticulier)=>{
    //   this.shipperParticulier=data;
    //   this.shipper=this.shipperParticulier;
    // }, err=>{
    //   console.log(err);
    // });
    // begin taking list camions of SOSPrestige - Here 8 is the id of transporter SOSPrestige
    //this.remorquage.collecterArgent=this.remorquage.total-this.remorquage.porterAuCompte
    //if(localStorage.getItem('fullName')!=null) this.remorquage.nomDispatch=localStorage.getItem('fullName')
    if(localStorage.getItem('fullName')!=null) this.remorquage.nomDispatch=localStorage.getItem('fullName')
    //await this.camionsService.camionsDeTransporter(8).subscribe((data:Array<Camion>)=>{
    await this.camionsService.camionsDeTransporter(Number(localStorage.getItem('idTransporter')))
    .subscribe((data:Array<Camion>)=>{
      //this.camions = data
      // this will take camions with gps monitor
      this.camions=[];
      this.camionsGps=[];
      data.forEach(camion=>{
        if(!camion.trailer && !camion.outService && camion.status) // not trailer + not out ofservice + in operation
        {
          if(!camion.gps) this.camions.push(camion)
          if(camion.gps) this.camionsGps.push(camion)
        }          
      })
      // this.chauffeursService.chauffeursDeTransporter(8).subscribe((data:Array<Chauffeur>)=>{
      this.chauffeursService.chauffeursDeTransporter(Number(localStorage.getItem('idTransporter')))
      .subscribe((data:Array<Chauffeur>)=>{
        this.chauffeurs=data;
        this.chauffeurs.sort((a,b)=>{
          return a.nom.localeCompare(b.nom)
        })
      }, err=>{
        console.log(err);
      });
    }, err=>{
      console.log();
    })
    // end of taking list camion SOSPrestige
    /*
    await this.shipperservice.getAllShippers().subscribe((data:Array<Shipper>)=>{
      this.listShipper=data;
    }, err=>{
      console.log(err);
    })//*/
    var heure= this.remorquage.dateDepart.getHours().toString().length==2?this.remorquage.dateDepart.getHours().toString():'0'+this.remorquage.dateDepart.getHours().toString()
      //+':'+
    var minute= this.remorquage.dateDepart.getMinutes().toString().length==2?this.remorquage.dateDepart.getMinutes().toString():'0'+this.remorquage.dateDepart.getMinutes().toString()
    //if(this.remorquage.timeCall.length)
    this.remorquage.timeCall=heure+':'+minute
    // console.log('this.remorquage.timeCall : '+this.remorquage.timeCall)
    this.remorquage.typeService=this.serviceTypes[0];
    if(this.remorquage.taxProvince==null || this.remorquage.taxProvince.length==0)
      this.remorquage.taxProvince=this.provinceList[10] // Quebec is the province by default
    this.taxProvince = this.taxList[10]; // tax province is Quebec tax by default
    // console.log("this.remorquage.taxProvince: " + this.remorquage.taxProvince)
    // console.log("this.taxProvince.id: " + this.taxProvince.id)
    this.transportersService.getDetailTransporter(Number(localStorage.getItem('idTransporter')))
    .subscribe((data:Transporter)=>{
      this.transporter=data;
      // First get the price particular - then calculate price default
      this.shipperParticuliersService.getDetailShipperParticulierByIdTransporter(this.transporter.id)
      .subscribe((data:ShipperParticulier)=>{
        this.shipperParticulier=<Shipper>data;
        this.shipper=this.shipperParticulier;
        this.typeServiceChange(this.serviceTypes[0]);
      }, err=>{
        console.log(err);
      });
    });

    // // First get the price particular - then calculate price default
    // this.shipperParticuliersService.getDetailShipperParticulier(1).subscribe((data:ShipperParticulier)=>{
    //   this.shipperParticulier=<Shipper>data;
    //   this.shipper=this.shipperParticulier;
    //   this.typeServiceChange(this.serviceTypes[0]);
    // }, err=>{
    //   console.log(err);
    // });
    //this.typeServiceChange(this.serviceTypes[0]);
    //this.prixCalcul()
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

  contactChange(){
    let strings:Array<string>=this.remorquage.nomContact.split("Id.");
    let conId:number =  Number(strings[1])
    this.contacts.forEach(con=>{
      if(con.id==conId) 
      {
        this.remorquage.nomContact=con.prenom
        this.remorquage.telContact=con.tel.toString()
        this.remorquage.emailContact=con.email
      }
    })
  }
  
  async camionChange(){
    this.remorquage.idCamion=null; //before being found camion, set this.remorquage.idCamion=null
    let allCamions: Array<Camion>=[]
    allCamions = allCamions.concat(this.camionsGps, this.camions)
    let strings:Array<string>=this.remorquage.camionAttribue.split(".Id.");
    if(strings.length>1){
      let cId:number =  Number(strings[1])
      // console.log('cId: '+cId)
      await allCamions.forEach(c=>{
        if(c.id==cId) 
        {
          this.camion=c;
          this.remorquage.camionAttribue = strings[0].trim()
          this.remorquage.idCamion=this.camion.id
          //c.unite.trim() +' - ' +c.marque.trim() +' ' +c.modele.trim()
        }
      })
      if(cId!=this.camion.id)
        this.camion=null;
    }
    else this.camion=null;
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
              {
                if(this.varsGlobal.language.includes('English'))
                  alert("Do not locate this origin")
                if(this.varsGlobal.language.includes('Francais'))
                  alert("Ne pas trouver de coordonnees de ce origin")
              }
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
              {
                if(this.varsGlobal.language.includes('English'))
                  alert("Do not locate this destination")
                else alert("Ne pas trouver de coordonnees de cet destination")
              }
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
  //this.remorquagesService.getAllRemorquages().subscribe((data:Array<Remorquage>)=>{
  this.remorquagesService.getRemorquagesTransporter(Number(localStorage.getItem('idTransporter')))
  .subscribe((data:Array<Remorquage>)=>{
    this.listRqs=[]  //data;
    this.listRqsSent=[]
    this.listRqsFini=[]
    this.listRqsAnnule=[]
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
      else if (rq.driverNote.includes("!!Cancelled!!")) this.listRqsAnnule.push(rq)
      else if (rq.sent) this.listRqsSent.push(rq)
      else if (rq.valid) this.listRqs.push(rq)//*/
      
    })
  }, err=>{
    console.log(err)
  })
}

printBonDeRemorquage(cmpId){
  let envoy = document.getElementById('toprint').innerHTML;
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
    this.remorquage.horstax =this.remorquage.horstax + (this.remorquage.distance-this.remorquage.inclus)*this.remorquage.prixKm
  }
  if(this.remorquage.taxable){
    // this.remorquage.tps =await Math.round(this.remorquage.horstax*0.05*100)/100
    // this.remorquage.tvq =await Math.round(this.remorquage.horstax*0.09975*100)/100
    if(this.remorquage.taxProvince==null || this.remorquage.taxProvince.length==0)
      this.remorquage.taxProvince=this.provinceList[10] // Quebec is the province by default
    this.onSelectTax();
    // we must remember : tps is gsthst and tvq is pst
    this.remorquage.tps =Math.round(this.remorquage.horstax*this.taxProvince.gsthst)/100
    this.remorquage.tvq =Math.round(this.remorquage.horstax*this.taxProvince.pst)/100
  }
  else{
    this.remorquage.tps =0.00;
    this.remorquage.tvq =0.00;
  }
  this.remorquage.total=Math.round(this.remorquage.horstax*100)/100+this.remorquage.tvq+this.remorquage.tps
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
      if(this.varsGlobal.language.includes('English'))
        window.alert('Directions request failed due to ' + status);
      else window.alert("La demande d'itinéraire a échoué en raison de : " + status);
    }
  });
  //*/
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


// // For input
//   filterInputEnt(event) {
//     console.log('event.target.value : ' + event.target.value)
//     //this.filteredEntreprises = []
//     this.filteredShippers = []
//     //this.firstFilteredShipper = '' //new Shipper();
//     for(let i = 0; i < this.listShipper.length; i++) {
//         let ent:Shipper = this.listShipper[i];
//         if(ent.nom.toLowerCase().indexOf(event.target.value.toLowerCase()) == 0) {
//           if(i==0) 
//             this.firstFilteredShipper=ent.nom;
//           console.log('firstFilteredShipper :'+ this.firstFilteredShipper)
//           this.filteredShippers.push(ent);
//           console.log(ent.nom)
//         }
//     }
//     let ent = this.listShipper.find(res=>
//       res.nom.toLowerCase().indexOf(this.remorquage.nomEntreprise.toLowerCase())==0 && 
//       res.nom.length==this.remorquage.nomEntreprise.length
//       )
//     if(ent!=null){
//       this.remorquage.nomEntreprise=ent.nom
//       this.prixBase1=ent.prixBase1;
//       this.inclus1=ent.inclus1;
//       this.prixKm1=ent.prixKm1;
//       this.prixBase2=ent.prixBase2;
//       this.inclus2=ent.inclus2;
//       this.prixKm2=ent.prixKm2;
//       this.prixBase3=ent.prixBase3;
//       this.inclus3=ent.inclus3;
//       this.prixKm3=ent.prixKm3;
//       this.typeServiceChange(this.remorquage.typeService);
//       this.contactsService.contactsDeShipper(ent.id).subscribe((data:Array<Contact>)=>{
//         this.contacts=data;
//       }, err=>{
//         console.log(err);
//       });
//     }
//   }
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
      var r = confirm("Are you sure the case was finished ?")
    else var r = confirm("Etes vous sur que ce cas est fini ?")
    if(r){
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
    if(this.varsGlobal.language.includes('English'))
      var r = confirm("Are you sure to cancel this case ?")
    else var r = confirm("Etes vous sur d'annuller ce cas ?")
    if(r){
      console.log("Le cas est annulle.")
      if(this.remorquage.id>0){
        this.remorquagesService.deleteRemorquage(this.remorquage.id).subscribe(data=>{
          // commence d'envoyer email
          if(this.remorquage.emailIntervenant!=null && this.remorquage.emailIntervenant.length>10){
            this.em.emailDest=this.remorquage.emailIntervenant
            if(this.varsGlobal.language.includes('English')){
              this.em.titre="Cancel #Num : " + this.remorquage.id.toString()
            this.em.content='<div><p> '+'Cancel #Num : ' + this.remorquage.id.toString()+' </p></div>'    
            }
            else{
              this.em.titre="Annuler #Bon : " + this.remorquage.id.toString()
            this.em.content='<div><p> '+'Annuler #Bon : ' + this.remorquage.id.toString()+' </p></div>'    
            }
            
            this.bankClientsService.envoyerMail(this.em).subscribe(data=>{
              if(this.varsGlobal.language.includes('English'))
                  alert("An email was also sent to driver")
              else alert("Un courriel annulation a ete aussi envoye au chauffeur.")
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
    if(this.varsGlobal.language.includes('English'))
      var r = confirm("Are you sure to delete this case ?")
    else var r = confirm("Etes vous sure de supprimer cet appel ?")
    if(r){      
      if(rq.id>0){
        this.remorquagesService.deleteRemorquage(rq.id).subscribe(data=>{
          this.listRqsAnnule.splice(this.listRqsAnnule.indexOf(rq),1)
          console.log("Le cas est supprime.")
          // if(rq.fini)
          //   this.listRqsFini.splice(this.listRqsFini.indexOf(rq),1)
          // else if(rq.sent)
          //   this.listRqsSent.splice(this.listRqsSent.indexOf(rq),1)
          // else this.listRqs.splice(this.listRqs.indexOf(rq),1)
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
    if(localStorage.getItem('fullName')!=null) this.remorquage.nomDispatch=localStorage.getItem('fullName')
    if(this.remorquage.id==null){
      this.remorquage.dateDepart=new Date()
      this.remorquage.timeCall= (new Date().getHours().toString().length==2?new Date().getHours().toString():'0'+new Date().getHours().toString())+':'+ 
        (new Date().getMinutes().toString().length==2?new Date().getMinutes().toString():'0'+new Date().getMinutes().toString())  //"00:00";
      this.remorquagesService.saveRemorquages(this.remorquage).subscribe((data:Remorquage)=>{
        this.remorquage=data;
      }, 
        err=>{console.log(err)
      })
    }
    /*
    this.remorquagesService.saveRemorquages(this.remorquage).subscribe((data:Remorquage)=>{
      this.remorquage=data;
    }, 
      err=>{console.log(err)
    })//*/
  }
  onSavePlusAlert(){
    this.remorquagesService.saveRemorquages(this.remorquage).subscribe((data:Remorquage)=>{ 
      this.back=0;
      this.pagePresent=this.back+1;
      this.forward=this.back+2
      this.particulier=false;
      this.compteClient=false;
      this.remorquage=new Remorquage();
      this.remorquage.idTransporter=Number(localStorage.getItem('idTransporter'))
    }, err=>{console.log(err)})
    if(this.varsGlobal.language.includes('English'))
      alert("It's saved")
    else alert("C'est enregistre.")

  }

  onReset(){
    if(this.varsGlobal.language.includes('English'))
      var r = confirm("Are you sure to cancel this case ?")
    else var r = confirm("Etes vous sur d'annuler cet appel ?")
    if(r) {
      this.back=0;
      this.pagePresent=this.back+1;
      this.forward=this.back+2
      this.particulier=false;
      this.compteClient=false;
      if(this.remorquage.id!=null){
        this.remorquagesService.deleteRemorquage(this.remorquage.id).subscribe(data=>{
          this.remorquage=new Remorquage();
        }, err=>{
          console.log(err)
        })
      }
      else this.remorquage=new Remorquage();      
    }
  }
  onConsulterClient(){
    // In consult the client we must clear the case actual
    this.back=0;
    this.pagePresent=this.back+1;
    this.forward=this.back+2
    this.particulier=false;
    this.compteClient=false;
    if(this.remorquage.id!=null){
      this.remorquagesService.deleteRemorquage(this.remorquage.id).subscribe(data=>{
        this.remorquage=new Remorquage();
      }, err=>{
        console.log(err)
      })
    }
    else this.remorquage=new Remorquage();      
    this.router.navigateByUrl('/detail-shipper/'+this.shipper.id);
    //routerLink="/detail-shipper/{{shipper.id}}" }
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
  // nomEntrepriseChange(ent){
  //   this.shipper=ent
  //   this.remorquage.nomEntreprise=ent.nom
  //   this.prixBase1=ent.prixBase1;
  //   this.inclus1=ent.inclus1;
  //   this.prixKm1=ent.prixKm1;
  //   this.prixBase2=ent.prixBase2;
  //   this.inclus2=ent.inclus2;
  //   this.prixKm2=ent.prixKm2;
  //   this.prixBase3=ent.prixBase3;
  //   this.inclus3=ent.inclus3;
  //   this.prixKm3=ent.prixKm3;
  //   this.typeServiceChange(this.remorquage.typeService);
  //   this.contactsService.contactsDeShipper(ent.id).subscribe((data:Array<Contact>)=>{
  //     this.contacts=data;
  //     console.log('this.contacts : ' + this.contacts)
  //   }, err=>{
  //     console.log(err);
  //   });
  // }
  async nomEntrepriseInputChange(){
    //console.log("this.remorquage.nomEntreprise : "+this.remorquage.nomEntreprise) 
    /**
      let ent = this.listEntreprise.find(res=>
      res.nom.includes(this.remorquage.nomEntreprise) && 
      res.nom.length==this.remorquage.nomEntreprise.length
      )
     */
    this.shipper = this.listShipper.find(res=>
      res.nom.includes(this.remorquage.nomEntreprise) && 
      res.nom.length==this.remorquage.nomEntreprise.length
      )
    if(this.shipper!=undefined){
      /*
      this.shipper=ent
      console.log('Trouve shipper prix for : '+this.shipper.nom)
      this.remorquage.idEntreprise=this.shipper.id
      this.remorquage.nomEntreprise=this.shipper.nom
      //*/
      //await this.typeServiceChange(this.remorquage.typeService);      
      await this.contactsService.contactsDeShipper(this.shipper.id).subscribe((data:Array<Contact>)=>{
        this.contacts=data;
        //this.shipper=ent
        console.log('Trouve shipper prix for : '+this.shipper.nom)
        this.remorquage.idEntreprise=this.shipper.id
        this.remorquage.nomEntreprise=this.shipper.nom
        //this.remorquage.prixBase=0.00;
        //this.remorquage.prixKm=0.00;
        // console.log('this.remorquage.prixBase before changed : '+this.remorquage.prixBase)
        // console.log('this.remorquage.prixKm before changed : '+this.remorquage.prixKm)
        this.typeServiceChange(this.remorquage.typeService);
        // console.log('this.remorquage.prixBase after changed : '+this.remorquage.prixBase)
        // console.log('this.remorquage.prixKm after changed : '+this.remorquage.prixKm)
      }, err=>{
        console.log(err);
      });
    }
    else {
      this.shipper= this.shipperParticulier //new Shipper();
      this.contacts=[];
      // console.log('Attention !!! - nomEntrepriseInputChange ne trouve pas Shipper.')
    }
    //this.firstFilteredShipper=this.remorquage.nomEntreprise
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
    // console.log('this.remorquage.prixBase in calculatePrixBase() before calculate : '+this.remorquage.prixBase)
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
      else//*/ 
      if(this.remorquage.prixBase==0) this.remorquage.prixBase=this.shipper.panne1
      // console.log('this.remorquage.prixBase in calculatePrixBase() - Leger : '+this.remorquage.prixBase)
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
      else//*/ 
      if(this.remorquage.prixBase==0) this.remorquage.prixBase=this.shipper.panne2
      // console.log('this.remorquage.prixBase in calculatePrixBase() - Moyen : '+this.remorquage.prixBase)
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
      else//*/ 
      if(this.remorquage.prixBase==0) this.remorquage.prixBase=this.shipper.panne3
      // console.log('this.remorquage.prixBase in calculatePrixBase() - Lourd : '+this.remorquage.prixBase)
    }
    // console.log('this.remorquage.prixBase in calculatePrixBase() after calculate : '+this.remorquage.prixBase)
  }
  typeServiceEnglish(text:string){ // i is index of typeService
    if(text.includes('Leger')) return 'Light'
    if(text.includes('Moyen')) return 'Medium'
    if(text.includes('Lourd')) return 'Heavy'
  }
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
      this.remorquage.prixBase=-1.00;
      this.remorquage.inclus=-1.00;
      this.remorquage.prixKm=-1.00;
    }
    //console.log('this.remorquage.prixBase in typyserviceChange() before prixCalcul() : '+this.remorquage.prixBase)
    //console.log('this.remorquage.prixKm in typyserviceChange() before prixCalcul() : '+this.remorquage.prixKm)
    this.prixCalcul()
    //console.log('this.remorquage.prixBase in typyserviceChange() after prixCalcul() : '+this.remorquage.prixBase)
    //console.log('this.remorquage.prixKm in typyserviceChange() after prixCalcul() : '+this.remorquage.prixKm)
  }

  onHistoire(){
    this.modeExport=-1;
    this.modeHistoire=-this.modeHistoire;
    if(this.modeHistoire==1){
      //this.remorquagesService.getAllRemorquages().subscribe((data:Array<Remorquage>)=>{
      this.remorquagesService.getRemorquagesTransporter(Number(localStorage.getItem('idTransporter')))
      .subscribe((data:Array<Remorquage>)=>{
        this.listRqs=[]  //data;
        this.listRqsSent=[]
        this.listRqsFini=[]
        this.listRqsAnnule=[]
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
          if (rq.fini) this.listRqsFini.push(rq)
          else if (rq.driverNote.includes("!!Cancelled!!")) this.listRqsAnnule.push(rq)
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
  
  //exporter en sage et excel
  dateToString(d:any){
    let yyyymmdd= d.toString().split('-')
    let date = yyyymmdd[2]
    let month = yyyymmdd[1]
    let year = yyyymmdd[0]
    let dateString=month+'-'+date+'-'+year
    return dateString;
  }
  
  rqsIndayToExport = []
  rqsInday = []
  findRqsExport(){
    this.rqsInday = []
    this.rqsIndayToExport = []
    //this.remorquagesService.getAllRemorquages().subscribe((data:Array<Remorquage>)=>{
    this.remorquagesService.getRemorquagesTransporter(Number(localStorage.getItem('idTransporter')))
    .subscribe((data:Array<Remorquage>)=>{
      data.sort((b, a)=>{
        if(a.id>b.id)
          return 1;
        if(a.id<b.id)
          return -1;
        return 0;
      })
      data.forEach(rq=>{
        if (rq.fini)
        {
          //console.log('dateReserve :  '+rq.dateReserve.toString())
          if(rq.dateReserve.toString().includes(this.dateExport.toString())){
            this.rqsInday.push(rq)
          }
        }
      })
      // if(this.rqsInday.length>0){
      //   console.log('Il y a  : '+ this.rqsInday.length + ' remorquages pour ce jour.')
      // }
      // else{
      //   alert("Il n'y a pas de Remorquage pour ce jour.")
      // }
    }, err=>{
      console.log(err)
    })
  }
  
  boxCheckAll=false;
  checkAll=false;

  addAll(event){
    this.rqsIndayToExport=[]
    let temp=this.rqsInday
    if(event.target.checked){
      this.boxCheckAll = true;
      console.log('addEvent - target.checked true - this.boxCheckAll : '+ this.boxCheckAll)
      this.checkAll=false;
      this.checkAll=true;
      this.checkAll=true;
      console.log('addEvent - target.checked true - this.checkAll : '+ this.checkAll)
      temp.forEach(r=>{
        this.rqsIndayToExport.push(r)
      })
      //this.rqsIndayToExport=temp
      console.log('Nombre remorquage a exporter : ' + this.rqsIndayToExport.length)
    }
    else{
      console.log('addEvent - target.checked false - this.boxCheckAll : '+ this.boxCheckAll)
      this.checkAll=false;
      this.rqsIndayToExport=[]
      console.log('Nombre remorquage a exporter : ' + this.rqsIndayToExport.length)
    }
  }
  addToExport(event, r:Remorquage){
    if(event.target.checked){
      this.rqsIndayToExport.push(r)
      console.log('addToExport True - Nombre remorquage a exporter : ' + this.rqsIndayToExport.length)
    }
    else{
      this.boxCheckAll=false;
      this.rqsIndayToExport.splice(this.rqsIndayToExport.indexOf(r), 1);
      console.log('addToExport False - Nombre remorquage a exporter : ' + this.rqsIndayToExport.length)
      console.log('this.boxCheckAll : '+this.boxCheckAll)
    }
  }
  
  onExporter(){    
    if(this.rqsIndayToExport.length>0){
      let textExcel='';
      let textSageHead=
        '<Version>\r\n'+  // ne pas changer
        '"12001","1"\r\n'+  // ne pas changer
        '</Version>\r\n'  // ne pas changer
      let textSage='';
  
      this.rqsIndayToExport.forEach(rq=>{
        if(rq.dateReserve.toString().includes(this.dateExport.toString())){
          textExcel = textExcel + rq.excel  //.replace("**fin**","\r\n")
          textSage = textSage + rq.sage //.replace("**fin**","\r\n")
        }
      })
      if(textExcel.length>0){
        let blobExcel = new Blob([textExcel], {
          type: "text/plain;charset=utf-8"
        });
        let filenameExcelExport = this.dateExport+"TousRemorquages"
        FileSaver.saveAs(blobExcel, filenameExcelExport+"-Export.txt");   
      }
      
      if(textSage.length>0){
        let blobSage = new Blob([textSageHead+textSage], {
          type: "text/plain;charset=utf-8"
        });
        let filenameSageExport = this.dateExport+"TousRemorquages"
        FileSaver.saveAs(blobSage, filenameSageExport+"-Export.IMP"); 
      }
    }
    else{
      if(this.varsGlobal.language.includes('English'))
        alert("There isn't towing today")
      else alert("Il n'y a pas de Remorquage pour ce jour.")
    }
  }

  onExporter_bk(){
    if(this.dateExport!=undefined){
      let textExcel='';
      let textSageHead=
        '<Version>\r\n'+  // ne pas changer
        '"12001","1"\r\n'+  // ne pas changer
        '</Version>\r\n'  // ne pas changer
      let textSage='';
      //console.log('dateExport :  '+this.dateExport.toString())
      //this.remorquagesService.getAllRemorquages().subscribe((data:Array<Remorquage>)=>{
      this.remorquagesService.getRemorquagesTransporter(Number(localStorage.getItem('idTransporter')))
      .subscribe((data:Array<Remorquage>)=>{
        data.sort((b, a)=>{
          if(a.id>b.id)
            return 1;
          if(a.id<b.id)
            return -1;
          return 0;
        })
        data.forEach(rq=>{
          if (rq.fini)
          {
            //console.log('dateReserve :  '+rq.dateReserve.toString())
            if(rq.dateReserve.toString().includes(this.dateExport.toString())){
              textExcel = textExcel + rq.excel  //.replace("**fin**","\r\n")
              textSage = textSage + rq.sage //.replace("**fin**","\r\n")
            }
          }
        })
        //console.log('textEcel :  '+textExcel)
        //console.log('textSage :  '+textSage)
        if(textExcel.length>0){
          let blobExcel = new Blob([textExcel], {
            type: "text/plain;charset=utf-8"
          });
          let filenameExcelExport = this.dateExport+"TousRemorquages"
          FileSaver.saveAs(blobExcel, filenameExcelExport+"-Export.txt");   
        }
        
        if(textSage.length>0){
          let blobSage = new Blob([textSageHead+textSage], {
            type: "text/plain;charset=utf-8"
          });
          let filenameSageExport = this.dateExport+"TousRemorquages"
          FileSaver.saveAs(blobSage, filenameSageExport+"-Export.IMP"); 
        }
        else{
          if(this.varsGlobal.language.includes('English'))
            alert("There isn't towing today")
          else alert("Il n'y a pas de Remorquage pour ce jour.")
        }
      }, err=>{
        console.log(err)
      })
    }
    else{
      if(this.varsGlobal.language.includes('English'))
        alert("You must choose the date to export")
      else alert('Il faut choisir le jour que vous voulez exporter.')
    }    
  }
  //

  onEnvoyer(){
    if(this.remorquage.emailIntervenant!=null && this.remorquage.emailIntervenant.length>10){
      let stringsd:string[]=location.href.split('/remorquage')
      this.em.emailDest=this.remorquage.emailIntervenant
      //this.em.titre="#Bon : " + this.remorquage.id.toString()
      this.em.titre="Case : " + this.remorquage.marque+' '+ this.remorquage.modele +' ' + this.remorquage.couleur
      this.em.content='<div><p> '+document.getElementById('toprint').innerHTML+
      " <br> <a href='"+stringsd[0]+"/remorquage-client/"
      + this.remorquage.id   //1733  // replace by Number of Bon Remorquage
      +"'><h4>DETAIL</h4></a>" +" </p></div>"    
      this.bankClientsService.envoyerMail(this.em).subscribe(data=>{
        //console.log('this.em.titre : ' + this.em.titre)
        //console.log('this.em.emailDest : '+ this.em.emailDest)
        //console.log('this.em.content : ' + this.em.content)
        if(this.varsGlobal.language.includes('English'))
          alert("Mesage was sent to driver")
        else alert("Le courriel a ete envoye au chauffeur.")
        if(this.remorquage.emailContact.length>10){
          let em:EmailMessage=new EmailMessage();
          em.emailDest=this.remorquage.emailContact;  // email of professional
          if(this.varsGlobal.language.includes('English')){
            em.titre= "In process - " + this.remorquage.marque+' '+ this.remorquage.modele +' ' + this.remorquage.couleur
          em.content='<div><p> '+ em.titre + " <br>" + 
            '<div>'+
              '<div><br></div>'+
              '<div>Thank you.</div>'+
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
          else{
            em.titre= "Encours traitement - " + this.remorquage.marque+' '+ this.remorquage.modele +' ' + this.remorquage.couleur
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
          }
          
          this.bankClientsService.envoyerMail(em).subscribe(data=>{
            console.log('Le client professionnel recois aussi .')
          }, err=>{console.log(err)})
        }
        this.remorquage.sent=true;
        this.onSavePlusAlert();
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
      {
        if(this.varsGlobal.language.includes('English'))
          alert("Enter the drivers' email address, please!!")
        alert("Entrer l'adresse email de chauffer, SVP!!!")
      }
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

  onPage2(){
    this.pagePresent=2;
    this.back=this.pagePresent-1;
    this.forward=this.pagePresent+1
  }
  onPage3(){
    this.pagePresent=3;
    this.back=this.pagePresent-1;
    this.forward=this.pagePresent+1
  }
  onPage4(){
    this.pagePresent=4;
    this.back=this.pagePresent-1;
    this.forward=this.pagePresent+1
  }
  onPage5(){
    this.pagePresent=5;
    this.back=this.pagePresent-1;
    this.forward=this.pagePresent+1
  }
  onPage6(){
    this.pagePresent=6;
    this.back=this.pagePresent-1;
    this.forward=this.pagePresent+1
  }
  onPage7(){
    this.pagePresent=7;
    this.back=this.pagePresent-1;
    this.forward=this.pagePresent+1
  }
  onPage8(){
    this.pagePresent=8;
    this.back=this.pagePresent-1;
    this.forward=this.pagePresent+1
  }
  onPage9(){
    this.pagePresent=9;
    this.back=this.pagePresent-1;
    this.forward=this.pagePresent+1
  }
  onPage10(){
    this.pagePresent=10;
    this.back=this.pagePresent-1;
    this.forward=this.pagePresent+1
  }
  onPage11(){
    this.pagePresent=11;
    this.back=this.pagePresent-1;
    this.forward=this.pagePresent+1
  }

  prixCalculWithHorsTax(){
    if(this.remorquage.taxable){
      if(this.remorquage.taxProvince==null || this.remorquage.taxProvince.length==0)
        this.remorquage.taxProvince=this.provinceList[10] // Quebec is the province by default
      this.onSelectTax();

      // this.remorquage.tps =Math.round(this.remorquage.horstax*0.05*100)/100
      // this.remorquage.tvq =Math.round(this.remorquage.horstax*0.09975*100)/100
      // we must remember : tps is gsthst and tvq is pst
      this.remorquage.tps =Math.round(this.remorquage.horstax*this.taxProvince.gsthst)/100
      this.remorquage.tvq =Math.round(this.remorquage.horstax*this.taxProvince.pst)/100
      this.remorquage.total= Math.round((this.remorquage.horstax+this.remorquage.tvq+this.remorquage.tps)*100)/100
    }
    else{
      this.remorquage.tps =0.00; 
      this.remorquage.tvq =0.00; 
      this.remorquage.total= this.remorquage.horstax; 
    }
  }

  horstaxChange(){
    if(this.remorquage.taxable){
      // this.remorquage.tps =Math.round(this.remorquage.horstax*0.05*100)/100
      // this.remorquage.tvq =Math.round(this.remorquage.horstax*0.09975*100)/100
      if(this.remorquage.taxProvince==null || this.remorquage.taxProvince.length==0)
        this.remorquage.taxProvince=this.provinceList[10] // Quebec is the province by default
      this.onSelectTax();
      // we must remember : tps is gsthst and tvq is pst
      this.remorquage.tps =Math.round(this.remorquage.horstax*this.taxProvince.gsthst)/100
      this.remorquage.tvq =Math.round(this.remorquage.horstax*this.taxProvince.pst)/100
    }
    else{
      this.remorquage.tps =0.00;
      this.remorquage.tvq =0.00;
    }
    this.remorquage.total=Math.round(this.remorquage.horstax*100)/100+this.remorquage.tvq+this.remorquage.tps
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
