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
import { reduce } from 'rxjs/operators';

@Component({
  selector: 'app-detail-transoprter',
  templateUrl: './detail-transporter.component.html',
  styleUrls: ['./detail-transporter.component.css']
})
export class DetailTransporterComponent implements OnInit {
  //* for map flotte truck
  subscription : Subscription;
  //transporter:Transporter=new Transporter();
  camionMap:Camion=new Camion();
  camionsSurMap:Array<Camion>=new Array<Camion>();
  idCamionMap:number=108;  // test wit Hino of SOS
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  markers=Array<google.maps.Marker>();
  carte:number=-1;
  carteText:string="Voir la carte";
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
  camionsInOperation:Array<Camion>; // all camion in service
  addcamion:Camion=new Camion(); // to add more camion
  fichePhysiqueEntretien:FichePhysiqueEntretien= new FichePhysiqueEntretien();
  fichePhysiqueEntretienCont:FichePhysiqueEntretienCont = new FichePhysiqueEntretienCont();
  arrayEnts : Array<AutreEntretien>=new Array<AutreEntretien>();
  arrayArrayEnts:AutreEntretienList[] = []; //Array<AutreEntretien>[]=[];
  //entsAutre:AutreEntretienList=new AutreEntretienList();

  infoWindow : any;

  constructor(public activatedRoute:ActivatedRoute, public transportersService:TransportersService, public contactsService:ContactsService,
    public adressesService:AdressesService, public camionsService:CamionsService,  public fichePhysiquesService:FichePhysiquesService,
    public fichePhysiqueContsService:FichePhysiqueContsService, public autreEntretiensService:AutreEntretiensService, private router:Router,
    public chauffeursService:ChauffeursService, private sanitizer:DomSanitizer){    
    this.id=activatedRoute.snapshot.params['id'];
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
      console.log();
    });    

    this.camionsService.camionsDeTransporter(this.id).subscribe((data:Array<Camion>)=>{
      /*/this.camionsSurMap.length=0;
      data.forEach(camion=>{
        if(camion.uniteMonitor!=null && camion.monitor!=null)
          this.camionsSurMap.push(camion)
      })
      //*/
      this.camions=data;
      this.camionsInOperation = this.filterCamionOfStatus()
      this.camionsInOperation.forEach(async obj =>{
        await this.autreEntretiensService.autreEntretienDeCamion(obj.id).subscribe((data:Array<AutreEntretien>)=>{
          if(data!=null){
            
            let entsAutre:AutreEntretienList=new AutreEntretienList();
            
            entsAutre.entsList=data;
            entsAutre.unite=obj.unite;
            entsAutre.odometre=obj.odometre;
            if(entsAutre.entsList.length != 0)
              this.arrayArrayEnts.push(entsAutre);
          }
        }, err=>{
          console.log(err)
        })
      }, err=>{

      })//*/
    }, err=>{
      console.log();
    });
  }
  
  filterCamionOfStatus(){ // find all camions in service
    return this.camions.filter(camion=>camion.status==true)
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

  async addCamion(){
    this.addcamion.idTransporter=this.id;
    //*
    await this.camionsService.saveCamions(this.addcamion).subscribe((data:Camion)=>{
      this.addcamion=data;
      this.fichePhysiqueEntretien.idCamion=this.addcamion.id;
      this.fichePhysiqueEntretienCont.idCamion=this.addcamion.id;
      this.camionsService.camionsDeTransporter(this.id).subscribe((data:Array<Camion>)=>{
        this.camions=data;
      }, err=>{
        console.log();
      });
      this.fichePhysiquesService.saveFichePhysiqueEntretiens(this.fichePhysiqueEntretien).subscribe((data:FichePhysiqueEntretien)=>{ 
        console.log('fiche1 ok ' +  data.idCamion)
      }, err=>{
        console.log(err)
      });
      this.fichePhysiqueContsService.saveFichePhysiqueEntretienConts(this.fichePhysiqueEntretienCont).subscribe((data:FichePhysiqueEntretienCont)=>{
        console.log('fiche2 ok ' +  data.idCamion) 
      }, err=>{
        console.log(err)
      });
      this.addcamion=new Camion();
    }, err=>{
      console.log(err)
    })//*/
  }

  deleteCamion(id:number){
    //*
    this.camionsService.deleteCamion(id)
    .subscribe(data=>{
      this.camionsService.camionsDeTransporter(this.id).subscribe((data:Array<Camion>)=>{
        this.camions=data;
      }, err=>{
        console.log(err);
      });
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
      this.carteText='Voir la carte'
      this.subscription.unsubscribe();
    }
    else{
      this.carteText='Cacher la carte'    
      var numbers = timer(2000);
      numbers.subscribe(x =>{
        this.camionsService.camionsDeTransporter(this.id).subscribe((data:Array<Camion>)=>{
          data.forEach(camion=>{
            if(camion.status && (camion.uniteMonitor!=null && camion.monitor!=null) && (camion.uniteMonitor.length!=0 && 
              camion.monitor.length!=0) && (!camion.uniteMonitor.includes('no-gps'))) // !camion.uniteMonitor.includes('no-gps') - means : there isn't GPS
              this.camionsSurMap.push(camion)
          })
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
        }, err=>{
          console.log();
        })
      })      
    }
    //this.router.navigate(["/map-flotte", this.id]);
  }
  onChange(){
    console.log("You see camion : " + this.camionMap.unite)
    this.map.setCenter(new google.maps.LatLng(this.camionMap.latitude, this.camionMap.longtitude));
  }
  getLocalisation(){
    this.camionsService.camionsDeTransporter(this.id).subscribe((data:Array<Camion>)=>{
      let camionsSurMap:Array<Camion>=new Array<Camion>();
      data.forEach(camion=>{
        if(camion.status && (camion.uniteMonitor!=null && camion.monitor!=null) && (camion.uniteMonitor.length!=0 && camion.monitor.length!=0) && 
        (!camion.uniteMonitor.includes('no-gps'))) // !camion.uniteMonitor.includes('no-gps') - means : there isn't GPS
          camionsSurMap.push(camion)
      })
      this.camionsSurMap=camionsSurMap;
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
    }, err=>{
      console.log();
    })
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
    if(camion.ent1==0 || camion.ent1==null || camion.odometre==null)      
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
    if(camion.ent2==0 || camion.ent2==null || camion.odometre==null)
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
    if(camion.ent3==0 || camion.ent3==null || camion.odometre==null)
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
    if(odoAFaire==0 || odoAFaire==null || odometre==null)
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
    if(camion.ent1==0 || camion.ent1==null || camion.odometre==null)      
      return '';
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
    if(camion.ent2==0 || camion.ent2==null || camion.odometre==null)
      return '';
    if((camion.odometre-camion.odo2Fait)<(camion.ent2-5000))
      return "bon-etat";
    if((camion.odometre-camion.odo2Fait)<camion.ent2)
      return "attention";
    if((camion.odometre-camion.odo2Fait)>=camion.ent2)
      return "urgent";
    
      return "";
  }
  codeTextEnt3(camion:Camion){
    if(camion.ent3==0 || camion.ent3==null || camion.odometre==null)
      return '';
    if((camion.odometre-camion.odo3Fait)<(camion.ent3-5000))
      return "bon-etat";
    if((camion.odometre-camion.odo3Fait)<camion.ent3)
      return "attention";
    if((camion.odometre-camion.odo3Fait)>=camion.ent3)
      return "urgent";
    
      return "";
  }

  codeText(odometre, odoFait:number, odoAFaire:number){
    if(odoAFaire==0 || odoAFaire==null || odometre==null)
      return 'pas-data';
    if((odometre-odoFait)<(odoAFaire-5000))
      return "bon-etat";
    if((odometre-odoFait)<odoAFaire)
      return "attention";
    if((odometre-odoFait)>=odoAFaire)
      return "urgent";
    return "";
  }
  codeTextInspect(inspect6m:Date){
    if(inspect6m==null)
    {
      return 'pas-data';
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
    if(camion.ent1==0 || camion.ent1==null || camion.odometre==null)
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
    if(camion.ent2==0 || camion.ent2==null || camion.odometre==null)
      return true;
    if((camion.odometre-camion.odo2Fait)<(camion.ent2-5000))
      return true;
    return false;//*/
    //return true;
  }
  disableButton3(camion:Camion) : boolean{
    //*
    if(camion.ent3==0 || camion.ent3==null || camion.odometre==null)
      return true;
    if((camion.odometre-camion.odo3Fait)<(camion.ent3-5000))
      return true;
    return false;//*/
    //return true;
  }

  disableButton(odometre, odoFait:number, odoAFaire:number) : boolean{
    //*
    if(odoAFaire==0 || odoAFaire==null || odometre==null)
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

  onInspect6(camion:Camion){
    /*
    alert("Inspection aux 6 mois.");
    camion.inspect6m=new Date();
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
}
