import { Component, OnInit, ViewChild } from '@angular/core';
import { Transporter } from '../../model/model.transporter';
import { TransportersService } from '../../services/transporters.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from 'src/model/model.contact';
import { Chauffeur } from 'src/model/model.chauffeur';
import { Adresse } from 'src/model/model.adresse';
import { ContactsService } from '../../services/contacts.service';
import { AdressesService } from '../../services/adresses.service';
import { CamionsService } from '../../services/camions.service';
import { ServicesOffre } from 'src/model/model.servicesOffre';
import { Camion } from 'src/model/model.camion';
import { FichePhysiqueEntretien } from 'src/model/model.fichePhysiqueEntretien';
import { FichePhysiqueEntretienCont } from 'src/model/model.fichePhysiqueEntretienCont';
import { FichePhysiquesService } from 'src/services/fichePhysiques.service';
import { FichePhysiqueContsService } from 'src/services/fichePhysiqueConts.service';
import { AutreEntretien } from 'src/model/model.autreEntretien';
import { AutreEntretiensService } from 'src/services/autreEntretiens.service';
import { AutreEntretienList } from 'src/model/model.autreEntretienList';
import { Subscription, timer, interval } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ChauffeursService } from 'src/services/chauffeurs.service';
import * as myGlobals from 'src/services/globals';
import { PlanOrder } from 'src/model/model.planOrder';
import { PlanOrderService } from 'src/services/planOrder.service';
import { PlanPrice } from 'src/model/model.planPrice';
import { PlanPriceService } from 'src/services/planPrice.service';

@Component({
  selector: 'app-detail-transoprter',
  templateUrl: './detail-transporter.component.html',
  styleUrls: ['./detail-transporter.component.css']
})
export class DetailTransporterComponent implements OnInit {
  provinceList=myGlobals.provinceList ;
  //* for map flotte truck
  subscription : Subscription;
  subscriptionRefresh:Subscription;
  //transporter:Transporter=new Transporter();
  camionMap:Camion=new Camion();
  camionsSurMap:Array<Camion>=new Array<Camion>();
  idCamionMap:number=108;  // test wit Hino of SOS
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  markers=Array<google.maps.Marker>();
  carte:number=-1;
  carteText:string="Reperer sur la carte";
  iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
//*
  quitButton:string=''; //role
  quebec511:number=1;
  textQuebec511:string="Voir conditions de routes."
  avltrack:number=1;
  avltrackLink:string="http://client2.avltrack.com/main.cfm?==QMxADM"; //http://client2.avltrack.com/main.cfm?==QMxADM
  avltrackLinkTrust:any;
  textAvltrack:string="Voir la carte AvlTrack";
  camList:number=0;
  camAdd:number=0;
  coorInfos:number=0;
  coorAddAdresse:number=0;
  coorAddContact:number=0;
  coorAddChauffeur:number=0;
  modeCoordonnes:number=0;
  modeCamions:number=0;
  modeTableau:number=0;
  transporter:Transporter=new Transporter();
  
  planOrder:PlanOrder=new PlanOrder();
  listPlanOrders:Array<PlanOrder>=null;
  packsTrucks=0;
  packsClientsPros=0;
  packsTerminals=0;
  packsTrucksPrice:number;
  packsClientsProsPrice:number;
  packsTerminalsPrice:number;

  id:number;
  mode:number=1;
  contacts:Array<Contact>;
  chauffeurs:Array<Chauffeur>;
  adresses:Array<Adresse>;
  addcontact:Contact=new Contact(); // to add more contact
  addchauffeur:Chauffeur=new Chauffeur(); // to add more chauffeur
  addadresse:Adresse=new Adresse(); // to add more adresse
  servicesOffre:ServicesOffre=new ServicesOffre();
  camions:Array<Camion>;
  camionsBroker:Array<Camion>; // all brokers' camion 
  camionsInOperation:Array<Camion>; // all camion in service
  camionsOutOperation:Array<Camion>; // all camion out service or antecedent
  addcamion:Camion=new Camion(); // to add more camion
  fichePhysiqueEntretien:FichePhysiqueEntretien= new FichePhysiqueEntretien();
  fichePhysiqueEntretienCont:FichePhysiqueEntretienCont = new FichePhysiqueEntretienCont();
  arrayEnts : Array<AutreEntretien>=new Array<AutreEntretien>();
  arrayArrayEnts:AutreEntretienList[] = []; //Array<AutreEntretien>[]=[];
  //entsAutre:AutreEntretienList=new AutreEntretienList();

  infoWindow : any;
  planPrice: PlanPrice;

  constructor(public activatedRoute:ActivatedRoute, public transportersService:TransportersService, public contactsService:ContactsService,
    public adressesService:AdressesService, public camionsService:CamionsService,  public fichePhysiquesService:FichePhysiquesService,
    public fichePhysiqueContsService:FichePhysiqueContsService, public autreEntretiensService:AutreEntretiensService, private router:Router,
    public chauffeursService:ChauffeursService, public planOrderService:PlanOrderService,
    public planPriceService:PlanPriceService, private sanitizer:DomSanitizer)
  {  
    if(localStorage.getItem('idTransporter')!=undefined &&Number(localStorage.getItem('idTransporter'))>0)
      this.id = Number(localStorage.getItem('idTransporter'))
    else this.id=activatedRoute.snapshot.params['id'];
    this.avltrackLinkTrust=sanitizer.bypassSecurityTrustResourceUrl(this.avltrackLink)
  }

/*/test ngOnDestroy  -- pour quoi il ne marche pas comme ol est dans camion.component.ts
  ngOnDestroy(){
    if(this.carte==-1){
      //this.carteText='Voir la carte'
      this.subscription.unsubscribe();
    }
  }
//*/

  ngOnInit() {
    this.planPriceService.getAllPlanPrices().subscribe((data:Array<PlanPrice>)=>{
      if(data!=null && data.length>0){
        this.planPrice=data[0]
      }
    }, err=>{console.log(err)})
    this.transportersService.getDetailTransporter(this.id).subscribe((data:Transporter)=>{
      this.quitButton=localStorage.getItem('role')
      this.transporter=data;
      if(localStorage.getItem('role').includes('SHIPPER')){  // in the cas Shipper want to view detail contact
        this.mode=3;
      }
      else if(localStorage.getItem('role').includes('DISPATCH')){  // in the cas Dispatch SOSPrestige want to modify drivers
        this.mode=4;
      }
      else{ // in the cas Transporter want to view detail himsefl
        this.mode=1;
        this.modeTableau=1;
        this.modeCamions=0;
        this.modeCoordonnes=0;
        this.coorInfos=1;
        this.coorAddAdresse=0;
        this.coorAddContact=0;
        this.camList=1;
        this.camAdd=0;
        localStorage.setItem('nom', this.transporter.nom);
        localStorage.setItem('tel', this.transporter.tel.toString());
        localStorage.setItem('email', this.transporter.email);
      }

    }, err=>{
      console.log(err);
    });
    this.contactsService.contactsDeTransporter(this.id).subscribe((data:Array<Contact>)=>{
      this.contacts=data;
    }, err=>{
      console.log(err);
    });
    this.chauffeursService.chauffeursDeTransporter(this.id).subscribe((data:Array<Chauffeur>)=>{
      this.chauffeurs=data;
    }, err=>{
      console.log(err);
    });
    this.adressesService.adressesDeTransporter(this.id).subscribe((data:Array<Adresse>)=>{
      this.adresses=data;
    }, err=>{
      console.log(err);
    });    

    this.planOrderService.planOrdersDeTransporter(this.id).subscribe((data:Array<PlanOrder>)=>{
      this.listPlanOrders=data.sort((b,a)=>{
        if(a.id>b.id)
          return 1;
        if(a.id<b.id)
          return -1;
        return 0;
      });
    }, err=>{
      console.log(err)
    })
    
    this.camionsService.camionsDeTransporter(this.id).subscribe(async (data:Array<Camion>)=>{
      /*/this.camionsSurMap.length=0;
      data.forEach(camion=>{
        if(camion.uniteMonitor!=null && camion.monitor!=null)
          this.camionsSurMap.push(camion)
      })
      //*/
      this.listNumberUnite=[] ;// empty the list number unite
      data.forEach(camion=>{
        this.listNumberUnite.push(camion.unite)
      })
      data.sort((a,b)=>{
        if(a.id>b.id)
          return 1;
        if(a.id<b.id)
          return -1;
        return 0;
      });
      this.camions= data

      this.camionsSurMap = await this.camions.filter(camion=>(camion.gps && camion.status))
        .sort((a,b)=>Number(a.unite)-Number(b.unite));
      this.camionsInOperation = await this.camions.filter(camion=>(!camion.broker && camion.status))
        .sort((a,b)=>Number(a.unite)-Number(b.unite));

      this.camionsOutOperation = await this.camions.filter(camion=>(!camion.broker && !camion.status)) //this.filterCamionOutOperation()
      this.camionsBroker= await this.camions.filter(camion=>(camion.broker))
      //  && camion.status
      await this.camionsInOperation.forEach(async (cam) => {
        await this.autreEntretiensService.autreEntretienDeCamion(cam.id).subscribe((data: Array<AutreEntretien>) => {
          if (data != null) {
            let entsAutre: AutreEntretienList = new AutreEntretienList();
            entsAutre.entsList = data;
            entsAutre.unite = cam.unite;
            entsAutre.odometre = cam.odometre;
            if (entsAutre.entsList.length != 0)
              this.arrayArrayEnts.push(entsAutre);
              this.arrayArrayEnts.sort((a,b)=>Number(a.unite)-Number(b.unite));
          }
        }, err => {
          console.log(err);
        });
        // this.arrayArrayEnts.sort((a,b)=>Number(a.unite)-Number(b.unite));
      }, err => {
      }) //*/
      // this.arrayArrayEnts= await this.arrayArrayEnts.sort((a,b)=>(Number(a.unite)-Number(b.unite)));
//*/
    }, err=>{
      console.log();
    });
    
    // refresh list camions every 2 minutes
    const source = interval(60000);
    this.subscriptionRefresh=source.subscribe(val=>{this.refreshListCamions()})
  }
  
  filterCamionInOperation(){ // find all camions in service
    return this.camions.filter(camion=>camion.status==true)
  }
  filterCamionOutOperation(){ // find all camions out service
    return this.camions.filter(camion=>camion.status==false)
  }

  // just for the dispatch modify profil of transporter (just save the change of transporter)
  modifiyTransporter(){
    this.transportersService.saveTransporters(this.transporter).subscribe(data=>{
      alert('Profile Modified.');
    }, err=>{
      console.log(err);
    });
  }

  saveTransporter(){
    this.transportersService.saveTransporters(this.transporter).subscribe(data=>{
      //this.mode=2;
      alert('Changement enregistre.');
    }, err=>{
      console.log(err);
    });
    this.contacts.forEach(obj => {
      this.contactsService.saveContacts(obj).subscribe(data=>{
      }, err=>{
        console.log(err)
      })
    });    
    this.chauffeurs.forEach(obj => {
      this.chauffeursService.saveChauffeurs(obj).subscribe(data=>{
      }, err=>{
        console.log(err)
      })
    });    
    this.adresses.forEach(obj => {
      this.adressesService.saveAdresses(obj).subscribe(data=>{
      }, err=>{
        console.log(err)
      })
    });
    this.camions.forEach(obj => {
      this.camionsService.saveCamions(obj).subscribe(data=>{
      }, err=>{
        console.log(err)
      })
    });
    // must add the command of modify servicesoffre
    // must add the command of modify camions   
  }

  addContact(){
    this.addcontact.id_transporter=this.id;
    this.contactsService.saveContacts(this.addcontact).subscribe((data:Contact)=>{
      alert("Contact added.");
      //this.refresh()
      this.contacts.push(data)
    }, err=>{
      console.log(err)
    })
  }

  addChauffeur(){
    this.addchauffeur.idTransporter=this.id;
    this.chauffeursService.saveChauffeurs(this.addchauffeur).subscribe((data:Chauffeur)=>{
      alert("Chauffeur added.");
      //this.refresh()
      this.chauffeurs.push(data)
    }, err=>{
      console.log(err)
    })
  }

  deleteContact(id:number){
    this.contactsService.deleteContact(id).subscribe((data:Contact)=>{
      alert("Contact : "+this.addcontact.nom+" a ete supprime.");
      this.contacts.splice(this.contacts.indexOf(data), 1)
    }, err=>{
      console.log(err);
    });
  }
  
  deleteChauffeur(id:number){
    this.chauffeursService.deleteChauffeur(id).subscribe((data:Chauffeur)=>{
      alert("Chauffeur : "+this.addchauffeur.nom+" a ete supprime.");
      this.chauffeurs.splice(this.chauffeurs.indexOf(data), 1)
    }, err=>{
      console.log(err);
    });
  }
  
  modifyChauffeur(ch:Chauffeur){
    this.chauffeursService.saveChauffeurs(ch).subscribe((data:Chauffeur)=>{
      alert("Chauffeur : "+this.addchauffeur.nom+" a ete modifie.");
      //this.chauffeurs.splice(this.chauffeurs.indexOf(data), 1)
    }, err=>{
      console.log(err);
    });
  }

  addAdresse(){
    this.addadresse.id_transporter=this.id;
    this.adressesService.saveAdresses(this.addadresse).subscribe((data:Adresse)=>{
      alert("Adresse added.");
      //this.refresh()
      this.adresses.push(data);
    }, err=>{
      console.log(err)
    })
  }

  deleteAdresse(id:number){
    this.adressesService.deleteAdresse(id).subscribe((data:Adresse)=>{
      alert("Adresse : "+this.addadresse.num+" a ete supprime.");
      //this.refresh();
      this.adresses.splice(this.adresses.indexOf(data), 1)
    }, err=>{
      console.log(err);
    });
  }  

  listNumberUnite:Array<string>=[];// collection of list number unite
  addCamion(){
    this.addcamion.idTransporter=this.id;
    if(this.addcamion.unite!=null && this.addcamion.unite.length>0){
      let exist=false; // this number unite doesn't exist yet
      this.listNumberUnite.forEach(nu=>{
        if(nu.includes(this.addcamion.unite)&&(nu.length==this.addcamion.unite.length))
          {
            alert("Numero Unite existe deja. Choisir un autre Numero Unite, SVP!");
            exist=true; // this Number unite exist already
          }
      })
      if(!exist){
        this.addcamion.idTransporter=this.transporter.id;
        this.camionsService.saveCamions(this.addcamion).subscribe((data:Camion)=>{
          this.listNumberUnite.push(data.unite)
          this.addcamion=new Camion();
          this.camions.push(data) // refresh list camions
          if(!data.broker) this.camionsInOperation.push(data)  // refresh list camionsInOperation
          this.fichePhysiqueEntretien.idCamion=data.id;
          this.fichePhysiqueEntretienCont.idCamion=data.id;
          this.fichePhysiquesService.saveFichePhysiqueEntretiens(this.fichePhysiqueEntretien).subscribe((data:FichePhysiqueEntretien)=>{             
            this.fichePhysiqueContsService.saveFichePhysiqueEntretienConts(this.fichePhysiqueEntretienCont).subscribe((data:FichePhysiqueEntretienCont)=>{              
              alert("Unite a ete bien ajoute.")              
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
      alert('Vous devez remplir des infos de cette unite.')
    }

    /*
    this.camionsService.saveCamions(this.addcamion).subscribe((data:Camion)=>{
      alert('Camion unite '+data.unite+' a ete ajoute.')
      this.camions.push(data) // refresh list camions
      if(!data.broker) this.camionsInOperation.push(data)  // refresh list camionsInOperation
      this.addcamion=data;
      this.fichePhysiqueEntretien.idCamion=this.addcamion.id;
      this.fichePhysiqueEntretienCont.idCamion=this.addcamion.id;
     
      this.fichePhysiquesService.saveFichePhysiqueEntretiens(this.fichePhysiqueEntretien).subscribe((data:FichePhysiqueEntretien)=>{ 
        console.log('fiche1 ok ' +  data.idCamion)
        this.fichePhysiqueContsService.saveFichePhysiqueEntretienConts(this.fichePhysiqueEntretienCont).subscribe((data:FichePhysiqueEntretienCont)=>{
          console.log('fiche2 ok ' +  data.idCamion) 
          this.addcamion=new Camion();
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

  deleteCamion(camion, camions:Array<Camion>){
    //*
    this.camionsService.deleteCamion(camion.id).subscribe(data=>{
      // this.camionsService.camionsDeTransporter(this.id).subscribe((data:Array<Camion>)=>{
      //   this.camions=data;
      // }, err=>{
      //   console.log(err);
      // });
      camions.splice(camions.indexOf(camion), 1)
    }, err=>{
      console.log(err);
    });//*/
  }  
  
  gotoDetailCamion(id:number){
    //console.log('this is test of camion detail');
    this.router.navigate(['camion',id]);
  }

  /* Just for test direct link
  testLinkDirect(){
    this.router.navigate(['detail-demande',1240]);
  }
  //*/

  myWindow: any;

  onPress(){
    this.carte=-this.carte;
    if(this.carte==-1){
      this.camionsSurMap=[];// to empty this list
      this.carteText='Reperer sur la carte'
      this.subscription.unsubscribe();
    }
    else{
      this.carteText='Fermer la carte'    
      var numbers = timer(2000);
      numbers.subscribe(x =>{
        // this.camionsService.camionsDeTransporter(this.id).subscribe((data:Array<Camion>)=>{
        //   data.forEach(camion=>{
        //     // if(camion.status && (camion.uniteMonitor!=null && camion.monitor!=null) && (camion.uniteMonitor.length!=0 && 
        //     //   camion.monitor.length!=0) && (!camion.uniteMonitor.includes('no-gps'))) // !camion.uniteMonitor.includes('no-gps') - means : there isn't GPS
        //     if(camion.status && camion.gps)
        //       this.camionsSurMap.push(camion)
        //   })
          let mapProp = {
            center: new google.maps.LatLng(45.568806, -73.918333),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
          this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
          this.camionsSurMap.forEach(camion=>{
            //console.log("camion.id : "+ camion.id)
            if(camion.uniteMonitor!=null && camion.monitor!=null){
              //this.marker.setMap(null);
              let location1 = new google.maps.LatLng(camion.latitude, camion.longtitude);          
              let marker = new google.maps.Marker({
                position: location1,
                map: this.map,
                icon: {
                  //url:"http://maps.google.com/mapfiles/kml/shapes/truck.png",
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  scale:4,
                  rotation:camion.direction,
                  fillOpacity: 1,
                  fillColor: "#FFFFFF",
                  strokeWeight: 2,
                  strokeColor: "red",
                },
                title: camion.unite
              });
              this.infoWindow = new google.maps.InfoWindow;
              marker.addListener('click', (event)=>{
                var contentString:string='unite : '+ camion.unite + '  -  Vitesse : ' + camion.speed;
                if(camion.stopDuration>0)
                  contentString='unite : '+ camion.unite + '  -  Arrete depuis : ' + this.showStopDuration(camion.stopDuration)//camion.stopDuration +' minutes.';
                // Replace the info window's content and position.
                this.infoWindow.setContent(contentString);
                this.infoWindow.setPosition(event.latLng);
                this.infoWindow.open(this.map);//*/
              })
              /*marker.setIcon({
                  url:"http://maps.google.com/mapfiles/kml/shapes/truck.png",
                  scale:0.1,
                  rotation:camion.direction,
                  fillColor:'red',
                })//*/
              this.markers.push(marker)
            }  
          })
          const source = interval(60000);
          this.subscription=source.subscribe(val=>{this.getLocalisation()})
        // }, err=>{
        //   console.log();
        // })
      })      
    }
    //this.router.navigate(["/map-flotte", this.id]);
  }
  onChange(){
    console.log("You see camion : " + this.camionMap.unite)
    this.map.setCenter(new google.maps.LatLng(this.camionMap.latitude, this.camionMap.longtitude));
  }

  refreshListCamions(){
    this.arrayArrayEnts=[]
    this.camionsService.camionsDeTransporter(this.id).subscribe(async (data:Array<Camion>)=>{
      this.listNumberUnite=[] ;// empty the list number unite
      data.forEach(camion=>{
        this.listNumberUnite.push(camion.unite)
      })
      data.sort((a,b)=>{
        if(a.id>b.id)
          return 1;
        if(a.id<b.id)
          return -1;
        return 0;
      });
      this.camions= data
      this.camionsSurMap = await this.camions.filter(camion=>(camion.gps && camion.status))
        .sort((a,b)=>Number(a.unite)-Number(b.unite));
      this.camionsInOperation = await this.camions.filter(camion=>(!camion.broker && camion.status))
        .sort((a,b)=>Number(a.unite)-Number(b.unite));
      this.camionsOutOperation = await this.camions.filter(camion=>(!camion.broker && !camion.status)) //this.filterCamionOutOperation()
      this.camionsBroker= await this.camions.filter(camion=>(camion.broker && camion.status))
      await this.camionsInOperation.forEach(async (cam) => {
        await this.autreEntretiensService.autreEntretienDeCamion(cam.id).subscribe((data: Array<AutreEntretien>) => {
          if (data != null) {
            let entsAutre: AutreEntretienList = new AutreEntretienList();
            entsAutre.entsList = data;
            entsAutre.unite = cam.unite;
            entsAutre.odometre = cam.odometre;
            if (entsAutre.entsList.length != 0)
              this.arrayArrayEnts.push(entsAutre);
              this.arrayArrayEnts.sort((a,b)=>Number(a.unite)-Number(b.unite));
          }
        }, err => {
          console.log(err);
        });
        // this.arrayArrayEnts.sort((a,b)=>Number(a.unite)-Number(b.unite));
      }, err => {
      }) //*/
      // this.arrayArrayEnts= await this.arrayArrayEnts.sort((a,b)=>(Number(a.unite)-Number(b.unite)));
//*/
    }, err=>{
      console.log();
    });
  }

  getLocalisation(){
    // this.camionsService.camionsDeTransporter(this.id).subscribe((data:Array<Camion>)=>{
      // let camionsSurMap:Array<Camion>=new Array<Camion>();
      // data.forEach(camion=>{
      //   // if(camion.status && (camion.uniteMonitor!=null && camion.monitor!=null) && (camion.uniteMonitor.length!=0 && camion.monitor.length!=0) && 
      //   // (!camion.uniteMonitor.includes('no-gps'))) // !camion.uniteMonitor.includes('no-gps') - means : there isn't GPS
      //   if(camion.status && camion.gps)
      //     camionsSurMap.push(camion)
      // })
      // this.camionsSurMap=camionsSurMap;
      //* demarsk the list of trucks
      this.markers.forEach(marker=>{
        marker.setMap(null);
        marker=null;
      })
      this.markers = [];
      //*/
      this.camionsSurMap.forEach(camion=>{
        //console.log("camion.id : "+ camion.id)
        if(camion.uniteMonitor!=null && camion.monitor!=null){
          let location1 = new google.maps.LatLng(camion.latitude, camion.longtitude);          
          let marker = new google.maps.Marker({
            position: location1,
            map: this.map,
            icon: {
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              //url:"http://maps.google.com/mapfiles/kml/shapes/truck.png",
              scale:4,
              rotation:camion.direction,
              fillOpacity: 1,
              fillColor: "#FFFFFF",
              strokeWeight: 2,
              strokeColor: "red",
            },
            title: camion.unite
          });
          this.infoWindow = new google.maps.InfoWindow;
          marker.addListener('click', (event)=>{
            var contentString:string='unite : '+ camion.unite + '  -  Vitesse : ' + camion.speed;
            if(camion.stopDuration>0)
              contentString='unite : '+ camion.unite + '  -  Arrete depuis : ' + this.showStopDuration(camion.stopDuration)//camion.stopDuration +' minutes.';
            // Replace the info window's content and position.
            this.infoWindow.setContent(contentString);
            this.infoWindow.setPosition(event.latLng);
            this.infoWindow.open(this.map);//*/
          })
          /*marker.setIcon({
            url:"http://maps.google.com/mapfiles/kml/shapes/truck.png",
            scale:0.1,
            rotation:camion.direction,
            fillColor:'red',
          })//*/
          this.markers.push(marker);
        }  
      })
    // }, err=>{
    //   console.log();
    // })
  }

  // to show the stop duration in day-hours-minute
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
    
    //duration = days+' jour(s) '+hours+' heure(s) '+minutes+' minute(s) '

    return duration;
  }
  onQuebec511(){
    this.quebec511=-this.quebec511;
    if (this.quebec511==-1)
      this.textQuebec511="Cacher conditions de routes."
    else
      this.textQuebec511="Voir conditions de routes."
  }
  onAvlTrack(){
    this.avltrack=-this.avltrack;
    if (this.avltrack==-1)
      this.textAvltrack="Cacher la carte AvlTrack."
    else
      this.textAvltrack="Voir la carte AvlTrack."
  }
  onCoordonnees(){
    this.modeTableau=0;
    this.modeCamions=0;
    this.modeCoordonnes=1;  
  }
  onCamions(){
    this.modeTableau=0;
    this.modeCamions=1;
    this.modeCoordonnes=0;      
  }
  onTableau(){
    this.modeTableau=1;
    this.modeCamions=0;
    this.modeCoordonnes=0;  
  }
  onCoorInfos(){
    this.coorInfos=1;
    this.coorAddAdresse=0;
    this.coorAddContact=0;
    this.coorAddChauffeur=0;
  }
  onCoorAddAdresse(){
    this.coorInfos=0;
    this.coorAddAdresse=1;
    this.coorAddContact=0;
    this.coorAddChauffeur=0;
  }
  onCoorAddContact(){
    this.coorInfos=0;
    this.coorAddAdresse=0;
    this.coorAddContact=1;
    this.coorAddChauffeur=0;
  }
  onCoorAddChauffeur(){
    this.coorInfos=0;
    this.coorAddAdresse=0;
    this.coorAddContact=0;
    this.coorAddChauffeur=1;
  }
  onCamList(){
    this.camList=1;
    this.camAdd=0;
  }
  onCamAdd(){
    this.camList=0;
    this.camAdd=1;
  }
  codeCouleurEnt1(camion:Camion){
    //if(camion.odo1Fait!=camion.odo2Fait)
      //return this.codeCouleurEnt2(camion)
    if(camion.ent1==0 || camion.ent1==null || camion.odometre==null || camion.odometre==0)      
      return '';
    if((camion.odometre-camion.odo1Fait)<(camion.ent1-5000))
      return "btn-success";
    if((camion.odometre-camion.odo1Fait)<camion.ent1)
      return "btn-warning";
    if((camion.odometre-camion.odo1Fait)>=camion.ent1)
      return "btn-danger";
    
      return "";
  }
  codeCouleurEnt2(camion:Camion){
    //if(camion.odo2Fait!=camion.odo3Fait)
      //return this.codeCouleurEnt3(camion)
    if(camion.ent2==0 || camion.ent2==null || camion.odometre==null || camion.odometre==0)
      //console.log('btn-danger" [disabled]="true');
      return '';
    if((camion.odometre-camion.odo2Fait)<(camion.ent2-5000))
      return "btn-success";
    if((camion.odometre-camion.odo2Fait)<camion.ent2)
      return "btn-warning";
    if((camion.odometre-camion.odo2Fait)>=camion.ent2)
      return "btn-danger";
    
      return "";
  }
  codeCouleurEnt3(camion:Camion){
    //console.log("I am called. And odoAFait : " + odoAFaire)
    if(camion.ent3==0 || camion.ent3==null || camion.odometre==null || camion.odometre==0)
      //console.log('btn-danger" [disabled]="true');
      return '';
    if((camion.odometre-camion.odo3Fait)<(camion.ent3-5000))
      return "btn-success";
    if((camion.odometre-camion.odo3Fait)<camion.ent3)
      return "btn-warning";
    if((camion.odometre-camion.odo3Fait)>=camion.ent3)
      return "btn-danger";
    
      return "";
  }

  codeCouleur(odometre, odoFait:number, odoAFaire:number){
    //console.log("I am called. And odoAFait : " + odoAFaire)
    if(odoAFaire==0 || odoAFaire==null || odometre==null || odometre==0)
      //console.log('btn-danger" [disabled]="true');
      return '';
    if((odometre-odoFait)<(odoAFaire-5000))
      return "btn-success";
    if((odometre-odoFait)<odoAFaire)
      return "btn-warning";
    if((odometre-odoFait)>=odoAFaire)
      return "btn-danger";
    
      return "";
  }
  //*/
  codeCouleurVignette(vignetteSaaq:Date){
    if(vignetteSaaq==null)
      return '';    
    let date = new Date();
    let days = (date.getTime() - new Date(vignetteSaaq).getTime())/24/60/60/1000;
    if (days<334)
      return "btn-success";
    if (days>=334 && days<364)
      return "btn-warning";
    if (days>=364)
      return "btn-danger";      
    return ""
  }
  codeCouleurInspect(inspect6m:Date){
    if(inspect6m==null)
      return '';    
    let date = new Date();
    let days = (date.getTime() - new Date(inspect6m).getTime())/24/60/60/1000;
    //console.log("Date de derniere inspection : "+ inspect6m);
    //console.log("Nombre jours apres l'inspection : "+days)
    if (days<152)
      return "btn-success";
    if (days>=152 && days<182)
      return "btn-warning";
    if (days>=182)
      return "btn-danger";      
    return ""
  }
  codeTextEnt1(camion:Camion){
    //if(camion.odo1Fait!=camion.odo2Fait)
      //return this.codeTextEnt2(camion)
    if(camion.ent1==null || camion.ent1==0 || camion.odometre==null || camion.odometre==0)      
      return 'pas_data';
    if((camion.odometre-camion.odo1Fait)<(camion.ent1-5000))
      return "bon-etat";
    if((camion.odometre-camion.odo1Fait)<camion.ent1)
      return "attention";
    if((camion.odometre-camion.odo1Fait)>=camion.ent1)
      return "urgent";
    
      return "";
  }
  codeTextEnt2(camion:Camion){
    //if(camion.odo2Fait!=camion.odo3Fait)
      //return this.codeTextEnt3(camion)
    if(camion.ent2==null || camion.ent2==0 || camion.odometre==null || camion.odometre==0)
      return 'pas_data';
    if((camion.odometre-camion.odo2Fait)<(camion.ent2-5000))
      return "bon-etat";
    if((camion.odometre-camion.odo2Fait)<camion.ent2)
      return "attention";
    if((camion.odometre-camion.odo2Fait)>=camion.ent2)
      return "urgent";
    
      return "";
  }
  codeTextEnt3(camion:Camion){
    if(camion.ent3==null || camion.ent3==0 || camion.odometre==null || camion.odometre==0)
      return 'pas_data';
    if((camion.odometre-camion.odo3Fait)<(camion.ent3-5000))
      return "bon-etat";
    if((camion.odometre-camion.odo3Fait)<camion.ent3)
      return "attention";
    if((camion.odometre-camion.odo3Fait)>=camion.ent3)
      return "urgent";
    
      return "";
  }

  codeText(odometre, odoFait:number, odoAFaire:number){
    if(odoAFaire==0 || odoAFaire==null || odometre==null || odometre==0)
      return 'pas_data';
    if((odometre-odoFait)<(odoAFaire-5000))
      return "bon-etat";
    if((odometre-odoFait)<odoAFaire)
      return "attention";
    if((odometre-odoFait)>=odoAFaire)
      return "urgent";
    return "";
  }
  
  codeTextVignette(vignetteSaaq:Date){
    if(vignetteSaaq==null)
    {
      return 'pas_data';
    }
    let date = new Date();
    let days = (date.getTime() - new Date(vignetteSaaq).getTime())/24/60/60/1000;
    if (days<334)
      return "bon-etat";
    if (days>=334 && days<364)
      return "attention";
    if (days>=364)
      return "urgent";      
    return ""
  }

  codeTextInspect(inspect6m:Date){
    if(inspect6m==null)
    {
      return 'pas_data';
    }
    let date = new Date();
    let days = (date.getTime() - new Date(inspect6m).getTime())/24/60/60/1000;
    //console.log('days in codeTextInspect : '+days)
    if (days<152)
      return "bon-etat";
    if (days>=152 && days<182)
      return "attention";
    if (days>=182)
      return "urgent";      
    return ""
  }

  disableButton1(camion:Camion):boolean{
    //*
    //if(camion.odo1Fait!=camion.odo2Fait)
      //return this.disableButton2(camion)
    if(camion.ent1==0 || camion.ent1==null || camion.odometre==null || camion.odometre==0)
      return true;
    if((camion.odometre-camion.odo1Fait)<(camion.ent1-5000))
      return true;
    return false;//*/
    //return true;
  }
  disableButton2(camion:Camion):boolean{
    //*
    //if(camion.odo2Fait!=camion.odo3Fait)
      //return this.disableButton3(camion)
    if(camion.ent2==0 || camion.ent2==null || camion.odometre==null || camion.odometre==0)
      return true;
    if((camion.odometre-camion.odo2Fait)<(camion.ent2-5000))
      return true;
    return false;//*/
    //return true;
  }
  disableButton3(camion:Camion) : boolean{
    //*
    if(camion.ent3==0 || camion.ent3==null || camion.odometre==null || camion.odometre==0)
      return true;
    if((camion.odometre-camion.odo3Fait)<(camion.ent3-5000))
      return true;
    return false;//*/
    //return true;
  }

  disableButton(odometre, odoFait:number, odoAFaire:number) : boolean{
    //*
    if(odoAFaire==0 || odoAFaire==null || odometre==null || odometre==0)
      return true;
    if((odometre-odoFait)<(odoAFaire-5000))
      return true;
    return false;//*/
    //return true;
  }
  // pour autre entretine
  codeCouleurAutre(odometre, odoFait:number, odoAFaire:number, kmAvertir:number){
    if(odoAFaire==0 || odoAFaire==null || odometre==null)
      //console.log('btn-danger" [disabled]="true');
      return '';
    if((odometre-odoFait)<(odoAFaire-kmAvertir))
      return "btn-success";
    if((odometre-odoFait)<odoAFaire)
      return "btn-warning";
    if((odometre-odoFait)>=odoAFaire)
      return "btn-danger";
    
      return "";
  } 
  disableButtonAutre(odometre, odoFait:number, odoAFaire:number, kmAvertir:number){
    if(odoAFaire==0 || odoAFaire==null || odometre==null)
      return true;
    if((odometre-odoFait)<(odoAFaire-kmAvertir))
      return true;
    return false;
  }
  //

  disableButtonVignette(vignetteSaaq:Date) : boolean{
    ///*
    if(vignetteSaaq==null)
      return true;
    let date = new Date();
    let days = (date.getTime() - new Date(vignetteSaaq).getTime())/24/60/60/1000;
    if (days<334)
      return true;
    return false;//*/
    //return true;
  }

  disableButtonInspect(inspect6m:Date) : boolean{
    ///*
    if(inspect6m==null)
      return true;
    let date = new Date();
    let days = (date.getTime() - new Date(inspect6m).getTime())/24/60/60/1000;
    if (days<152)
      return true;
    return false;//*/
    //return true;
  }

  onEntretien01(camion:Camion){
    //let msg:string="test message\n test01 message\n test02 message\n";
    /*
    alert("Entretien 1 - Changement huile moteur, filtre moteur, graissage, ajustement des freins. ");
    camion.odo1Fait=camion.odometre;
    camion.ent1Fait=new Date();
    this.camionsService.saveCamions(camion).subscribe(data=>{
      this.camionsService.camionsDeTransporter(this.id).subscribe((data:Array<Camion>)=>{
        this.camions=data;
      }, err=>{
        console.log();
      });    
    }, err=>{
      console.log(err);
    });//*/
    this.gotoDetailCamion(camion.id)
  }

  onEntretien02(camion:Camion){
    /*
    alert("Entretien 2 - Changement filtre a l'air, filtre a fuel");
    camion.odo2Fait=camion.odometre;
    camion.ent2Fait=new Date();
    this.camionsService.saveCamions(camion).subscribe(data=>{
      this.camionsService.camionsDeTransporter(this.id).subscribe((data:Array<Camion>)=>{
        this.camions=data;
        this.onEntretien01(camion)
      }, err=>{
        console.log();
      });    
    }, err=>{
      console.log(err);
    });//*/
    this.gotoDetailCamion(camion.id)
  }

  onEntretien03(camion:Camion){
    /*
    alert("Entretien 3 - Changement filtre a polene");
    camion.odo3Fait=camion.odometre;
    camion.ent3Fait=new Date();
    this.camionsService.saveCamions(camion).subscribe(data=>{
      this.camionsService.camionsDeTransporter(this.id).subscribe((data:Array<Camion>)=>{
        this.camions=data;
        this.onEntretien02(camion)
      }, err=>{
        console.log();
      });    
    }, err=>{
      console.log(err);
    });//*/
    this.gotoDetailCamion(camion.id)
  }

  onEntretien04(camion:Camion){
    /*
    alert("Entretien 4 - Changement filtre hydrolique");
    camion.odo4Fait=camion.odometre;
    camion.ent4Fait=new Date();
    this.camionsService.saveCamions(camion).subscribe(data=>{
      this.camionsService.camionsDeTransporter(this.id).subscribe((data:Array<Camion>)=>{
        this.camions=data;
      }, err=>{
        console.log();
      });    
    }, err=>{
      console.log(err);
    });//*/
    this.gotoDetailCamion(camion.id)
  }

  onEntretien05(camion:Camion){
    /*
    alert("Entretien 5 - Changement filtre antigel");
    camion.odo5Fait=camion.odometre;
    camion.ent5Fait=new Date();
    this.camionsService.saveCamions(camion).subscribe(data=>{
      this.camionsService.camionsDeTransporter(this.id).subscribe((data:Array<Camion>)=>{
        this.camions=data;
      }, err=>{
        console.log();
      });    
    }, err=>{
      console.log(err);
    });//*/
    this.gotoDetailCamion(camion.id)
  }

  onEntretien06(camion:Camion){
    /*
    alert("Entretien 6 - Changement huile antigel.");
    camion.odo6Fait=camion.odometre;
    camion.ent6Fait=new Date();
    this.camionsService.saveCamions(camion).subscribe(data=>{
      this.camionsService.camionsDeTransporter(this.id).subscribe((data:Array<Camion>)=>{
        this.camions=data;
      }, err=>{
        console.log();
      });    
    }, err=>{
      console.log(err);
    });//*/
    this.gotoDetailCamion(camion.id)
  }

  onEntretien07(camion:Camion){
    /*
    alert("Entretien 7 - Changement huile transmission.");
    camion.odo7Fait=camion.odometre;
    camion.ent7Fait=new Date();
    this.camionsService.saveCamions(camion).subscribe(data=>{
      this.camionsService.camionsDeTransporter(this.id).subscribe((data:Array<Camion>)=>{
        this.camions=data;
      }, err=>{
        console.log();
      });    
    }, err=>{
      console.log(err);
    });//*/
    this.gotoDetailCamion(camion.id)
  }

  onEntretien08(camion:Camion){
    /*
    alert("Entretien 8 - Changement huile differentiel.");
    camion.odo8Fait=camion.odometre;
    camion.ent8Fait=new Date();
    this.camionsService.saveCamions(camion).subscribe(data=>{
      this.camionsService.camionsDeTransporter(this.id).subscribe((data:Array<Camion>)=>{
        this.camions=data;
      }, err=>{
        console.log();
      });    
    }, err=>{
      console.log(err);
    });//*/
    this.gotoDetailCamion(camion.id)
  }
  
  onVignette(camion:Camion){
    this.gotoDetailCamion(camion.id)
  }

  onInspect6(camion:Camion){
    this.gotoDetailCamion(camion.id)
  }
  async autreEntretiens(camion:Camion){
    //let arrayEnts:Array<AutreEntretien>=null;
    //if(camion!=null){
      await this.autreEntretiensService.autreEntretienDeCamion(camion.id).subscribe((data:Array<AutreEntretien>)=>{
        //if(data!=null)
          this.arrayEnts= data;
          //return data;
      }, err=>{
        console.log();
     })
    //}
    //return this.arrayEnts;
  }
  toArray(answers:object){
    return Object.keys(answers).map(key => answers[key])
  }
  traiteHtml(){
    let html1:string;
    let html2:string;
    html1 = "<th>test from central"+"</th>";
    html2 = "<td>td from program"+"</td>";
    return html1+html2;
  }
  tailArray(a:AutreEntretienList){
    return a.entsList.length
  }
  onAutreEntretien(entretien:AutreEntretien, odometre:number){
    /*
    alert("Entretien : "+ entretien.nom);
    entretien.odoFait=odometre;
    entretien.dateFait=new Date();
    this.autreEntretiensService.saveAutreEntretiens(entretien).subscribe(data=>{
      this.codeCouleur(odometre, entretien.odoFait, entretien.kmTrage)
    }, err=>{
      console.log(err);
    });//*/
    this.gotoDetailCamion(entretien.idCamion)
  }

  onFileUpLoad(event){
    let selectedFile : File=event.target.files[0];
    if(selectedFile){
      const reader = new FileReader();
      reader.onload = ()=>{this.transporter.photo=reader.result.toString();}
      reader.readAsDataURL(selectedFile)
    }
    else this.transporter.photo='';
  }
  onChangeImage(){
    this.transporter.photo=""
  }

  remainRate = 1.00 // this is the rate days reste for extension
  extensionPlan = false;
  onExtension(){
    this.extensionPlan = !this.extensionPlan
    if(!this.flagNewPlan && this.extensionPlan){
      this.planOrder.planName="Extension"
      let timeLag = new Date().getTimezoneOffset() / 60 ;
      let timeEndDatePlan = this.transporter.dateEndingMillis; //new Date(this.transporter.endDatePlan).getTime()
      this.planOrder.dateEnding=new Date();
      this.planOrder.dateEnding.setTime(timeEndDatePlan + (timeLag*60*60*1000))
      
      let today = new Date();
      // let heure = today.getHours()
      // this.planOrder.dateEnding.setHours(heure)
      // console.log("new Date(this.transporter.endDatePlan).getTime()): "+ new Date(this.transporter.endDatePlan).getTime())
      // console.log("today.getTime(): " + today.getTime())
      this.remainRate = Math.round(((new Date(this.transporter.endDatePlan).getTime()-today.getTime())/1000/60/60/24
      / this.transporter.daysPlan)*100)/100
      // console.log("remainRate: " + this.remainRate)
    }
    
    if(!this.flagNewPlan && !this.extensionPlan){
      this.planOrder.planName=''
      this.packsTrucks=0;
      this.packsClientsPros=0;
      this.packsTerminals=0;
      this.remainRate=1.00
      this.planNameChange()
    }
  }

  disableExtension=false
  flagNewPlan=false
  newOrRenewPlan(){
    if(this.packsTrucks<0) this.packsTrucks=0;
    if(this.packsTerminals<0) this.packsTerminals=0;
    if(this.packsClientsPros<0) this.packsClientsPros=0;
    
    // in case extension
    if(this.planOrder.planName!=null && this.planOrder.planName.includes("Extension")){
      this.planOrder.trucks=(this.packsTrucks*this.planPrice.trucks)
      this.planOrder.terminals=(this.packsTerminals*this.planPrice.terminals)
      this.planOrder.clientsPros=(this.packsClientsPros*this.planPrice.clientsPros)
    }

    // in the case New Plan
    else if(!this.transporter.evaluation && (this.transporter.trucks==null || this.transporter.trucks==0)){
      this.disableExtension=true
      this.flagNewPlan=true
      this.planOrder.trucks=this.planPrice.trucks + (this.packsTrucks*this.planPrice.trucks)
      this.planOrder.terminals=this.planPrice.terminals + (this.packsTerminals*this.planPrice.terminals)
      this.planOrder.clientsPros=this.planPrice.clientsPros + (this.packsClientsPros*this.planPrice.clientsPros)      
    }
    
    // in the case Renew Plan    
    else{
      this.extensionPlan=false
      this.disableExtension=true
      this.planOrder.trucks= this.transporter.trucks; // (this.packsTrucks*this.planPrice.trucks)
      this.planOrder.terminals= this.transporter.terminals; // (this.packsTerminals*this.planPrice.terminals)
      this.planOrder.clientsPros= this.transporter.clientsPros; // (this.packsClientsPros*this.planPrice.clientsPros)

      this.planOrder.planName=this.transporter.planActual
    }

    this.planNameChange(); // to sur take the planName and price 
  }

  orderPlan(){
    this.planOrder.idTransporter=this.id
    // if(this.transporter.trucks>0)// && this.transporter.endDatePlan>new Date())
    //   this.planOrder.planName="Extension"
    this.planOrderService.savePlanOrder(this.planOrder).subscribe((data:PlanOrder)=>{
      this.planOrder=data;
      this.listPlanOrders.push(data)
      this.listPlanOrders.sort((b,a)=>{
        if(a.id>b.id)
          return 1;
        if(a.id<b.id)
          return -1;
        return 0;
      });
    }, err=>{console.log(err)})
  }

  planNameChange(){
    if(this.planOrder.planName!=null && !this.planOrder.planName.includes("Extension")){
      let today =new Date()
      let timeZone= new Date().getTimezoneOffset()
      let timeEndDatePlan = this.transporter.dateEndingMillis; //new Date(this.transporter.endDatePlan).getTime()
      console.log('timeZone: '+timeZone)
      let timeLag = timeZone/60
      console.log("timeLag: "+ timeLag )
      // in case new plan 
      if(this.flagNewPlan){ 
        today = this.planOrder.dateEnding = new Date();
      }
      
      // in case renew plan 
      if(!this.flagNewPlan){ 
        today = this.planOrder.dateEnding = new Date() ;// new Date(this.transporter.endDatePlan).setHours(today.getHours()+timeLag));
        this.planOrder.dateEnding.setTime(timeEndDatePlan + (timeLag*60*60*1000))
        today.setTime(timeEndDatePlan + (timeLag*60*60*1000))
        // let heure = today.getHours()
        // today.setHours(heure)
        // this.planOrder.dateEnding.setHours(heure)
        //this.planOrder.dateEnding.setHours(today.getHours()+timeLag);
      }

      if(this.planOrder.planName.includes("3 Months"))
      {
        this.planOrder.daysPlan=90; // 3 months
        this.planOrder.dateEnding.setMonth(today.getMonth()+3);
        this.planOrder.price=this.planPrice.price * 3 + 
          ((this.packsTrucks + this.packsClientsPros + this.packsTerminals) * this.planPrice.price)
        this.packsTrucksPrice = this.packsTrucks  * this.planPrice.price
        this.packsClientsProsPrice = this.packsClientsPros  * this.planPrice.price
        this.packsTerminalsPrice = this.packsTerminals  * this.planPrice.price
      }
      if(this.planOrder.planName.includes("1 Year")){
        this.planOrder.daysPlan=365; // 1 Year
        this.planOrder.dateEnding.setFullYear(today.getFullYear()+1);
        this.planOrder.price=this.planPrice.price * 3 * 3  + 
        ((this.packsTrucks + this.packsClientsPros + this.packsTerminals) * this.planPrice.price * 3)
        this.packsTrucksPrice = this.packsTrucks  * this.planPrice.price *3
        this.packsClientsProsPrice = this.packsClientsPros  * this.planPrice.price * 3
        this.packsTerminalsPrice = this.packsTerminals  * this.planPrice.price * 3
      }
        
      if(this.planOrder.planName.includes("2 Years")){
        this.planOrder.daysPlan=730; // 2 Years
        this.planOrder.dateEnding.setFullYear(today.getFullYear()+2);
        this.planOrder.price=this.planPrice.price * 3 * 5 + 
        ((this.packsTrucks + this.packsClientsPros + this.packsTerminals) * this.planPrice.price * 5)
        this.packsTrucksPrice = this.packsTrucks  * this.planPrice.price *5
        this.packsClientsProsPrice = this.packsClientsPros  * this.planPrice.price * 5
        this.packsTerminalsPrice = this.packsTerminals  * this.planPrice.price * 5
      }
      this.planOrder.dateEndingMillis=this.planOrder.dateEnding.getTime();
    }
    else if(this.planOrder.planName!=null && this.planOrder.planName.includes("Extension")){
      
      if(this.transporter.planActual.includes("3 Months"))
      {
        this.planOrder.daysPlan=90; // 3 months
        this.planOrder.price=this.remainRate * 
          ((this.packsTrucks + this.packsClientsPros + this.packsTerminals) * this.planPrice.price)
        this.packsTrucksPrice =this.remainRate * this.packsTrucks  * this.planPrice.price
        this.packsClientsProsPrice =this.remainRate * this.packsClientsPros  * this.planPrice.price
        this.packsTerminalsPrice =this.remainRate * this.packsTerminals  * this.planPrice.price
      }
      if(this.transporter.planActual.includes("1 Year")){
        this.planOrder.daysPlan=365; // 1 Year
        this.planOrder.price=this.remainRate * 
        ((this.packsTrucks + this.packsClientsPros + this.packsTerminals) * this.planPrice.price * 3)
        this.packsTrucksPrice =this.remainRate * this.packsTrucks  * this.planPrice.price *3
        this.packsClientsProsPrice =this.remainRate * this.packsClientsPros  * this.planPrice.price * 3
        this.packsTerminalsPrice =this.remainRate * this.packsTerminals  * this.planPrice.price * 3
      }
        
      if(this.transporter.planActual.includes("2 Years")){
        this.planOrder.daysPlan=730; // 2 Years
        this.planOrder.price=this.remainRate * 
        ((this.packsTrucks + this.packsClientsPros + this.packsTerminals) * this.planPrice.price * 5)
        this.packsTrucksPrice =this.remainRate * this.packsTrucks  * this.planPrice.price *5
        this.packsClientsProsPrice =this.remainRate * this.packsClientsPros  * this.planPrice.price * 5
        this.packsTerminalsPrice =this.remainRate * this.packsTerminals  * this.planPrice.price * 5
      }
    }
  }

  onFileUpLoadPlanOrder(event, po:PlanOrder){
    let selectedFile : File=event.target.files[0];
    if(selectedFile){
      const reader = new FileReader();
      reader.onload = ()=>{po.imgUrl=reader.result.toString();}
      reader.readAsDataURL(selectedFile)
    }
    else po.imgUrl='';
  }

  onModifyingPlanOrder(po:PlanOrder){
    this.planOrderService.savePlanOrder(po).subscribe((data:PlanOrder)=>{
      po=data;
    }, err=>{console.log(err)})
  }

  onDeletPlanOrder(pO:PlanOrder){
    if(pO.id!=null && pO.id>0) this.planOrderService.deletePlanOrder(pO.id).subscribe((data:PlanOrder)=>{
      this.listPlanOrders.splice(this.listPlanOrders.indexOf(data), 1)
    }, err=>{console.log()})
  }
}
