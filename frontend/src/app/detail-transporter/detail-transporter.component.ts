import { Component, OnInit } from '@angular/core';
import { Transporter } from '../../model/model.transporter';
import { TransportersService } from '../../services/transporters.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Alert } from 'selenium-webdriver';
import { Contact } from 'src/model/model.contact';
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

@Component({
  selector: 'app-detail-transoprter',
  templateUrl: './detail-transporter.component.html',
  styleUrls: ['./detail-transporter.component.css']
})
export class DetailTransporterComponent implements OnInit {
  quitButton:string='';
  quebec511:number=1;
  textQuebec511:string="Voir conditions de routes."
  camList:number=0;
  camAdd:number=0;
  coorInfos:number=0;
  coorAddAdresse:number=0;
  coorAddContact:number=0;
  modeCoordonnes:number=0;
  modeCamions:number=0;
  modeTableau:number=0;
  transporter:Transporter=new Transporter();
  id:number;
  mode:number=1;
  contacts:Array<Contact>;
  adresses:Array<Adresse>;
  addcontact:Contact=new Contact(); // to add more contact
  addadresse:Adresse=new Adresse(); // to add more adresse
  servicesOffre:ServicesOffre=new ServicesOffre();
  camions:Array<Camion>;
  addcamion:Camion=new Camion(); // to add more camion
  fichePhysiqueEntretien:FichePhysiqueEntretien= new FichePhysiqueEntretien();
  fichePhysiqueEntretienCont:FichePhysiqueEntretienCont = new FichePhysiqueEntretienCont();
  arrayEnts : Array<AutreEntretien>=new Array<AutreEntretien>();
  arrayArrayEnts:AutreEntretienList[] = []; //Array<AutreEntretien>[]=[];
  //entsAutre:AutreEntretienList=new AutreEntretienList();

  constructor(public activatedRoute:ActivatedRoute, public transportersService:TransportersService, public contactsService:ContactsService,
    public adressesService:AdressesService, public camionsService:CamionsService,  public fichePhysiquesService:FichePhysiquesService,
    public fichePhysiqueContsService:FichePhysiqueContsService, public autreEntretiensService:AutreEntretiensService, private router:Router){    
    this.id=activatedRoute.snapshot.params['id'];
  }

  ngOnInit() {
    this.transportersService.getDetailTransporter(this.id).subscribe((data:Transporter)=>{
      this.quitButton=localStorage.getItem('role')
      this.transporter=data;
      this.mode=1;
      this.modeTableau=1;
      this.modeCamions=0;
      this.modeCoordonnes=0;
      this.coorInfos=1;
      this.coorAddAdresse=0;
      this.coorAddContact=0;
      this.camList=1;
      this.camAdd=0;
    }, err=>{
      console.log(err);
    });
    this.contactsService.contactsDeTransporter(this.id).subscribe((data:Array<Contact>)=>{
      this.contacts=data;
    }, err=>{
      console.log(err);
    });
    this.adressesService.adressesDeTransporter(this.id).subscribe((data:Array<Adresse>)=>{
      this.adresses=data;
    }, err=>{
      console.log();
    });    

    this.camionsService.camionsDeTransporter(this.id).subscribe((data:Array<Camion>)=>{
      this.camions=data;
      //let entsAutre:AutreEntretienList=null;
      //*
      this.camions.forEach(async obj =>{
        //let entsAutre:AutreEntretienList=new AutreEntretienList();
        //entsAutre.unite="u-"+ obj.unite;
        await this.autreEntretiensService.autreEntretienDeCamion(obj.id).subscribe((data:Array<AutreEntretien>)=>{
          if(data!=null){
            
            let entsAutre:AutreEntretienList=new AutreEntretienList();
            
            entsAutre.entsList=data;
            entsAutre.unite=obj.unite;
            entsAutre.odometre=obj.odometre;
            //console.log("this.tailArray(entsAutre) : "+this.tailArray(entsAutre));
            /*data.forEach(d => {
              let autreEntretien:AutreEntretien=new AutreEntretien();
              autreEntretien=d;
              autreEntretien.unite="u-"+ obj.unite;
              this.arrayEnts.push(autreEntretien);
            })  //*/          

            //console.log("u-"+ obj.unite);
            //console.log("this.entsAutre.unite :"+this.entsAutre.unite)
            //console.log("this.entsAutre.length : " +  this.entsAutre.entsList.length)
            //console.log("this.entsAutre[0].kmtrage : " +  this.entsAutre.entsList[0].kmTrage);
            if(entsAutre.entsList.length != 0)
              this.arrayArrayEnts.push(entsAutre);
            //console.log("this.arrayArrayEnts.length : "+this.arrayArrayEnts.length);
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
    this.contactsService.saveContacts(this.addcontact).subscribe(data=>{
      alert("Contact added.");
      //this.refresh()
      this.contactsService.contactsDeTransporter(this.id).subscribe((data:Array<Contact>)=>{
        this.contacts=data;
      }, err=>{
        console.log(err);
      });
    }, err=>{
      console.log(err)
    })
  }

  deleteContact(id:number){
    this.contactsService.deleteContact(id)
    .subscribe(data=>{
      alert("Contact : "+this.addcontact.nom+" a ete supprime.");
      //this.refresh();
      this.contactsService.contactsDeTransporter(this.id).subscribe((data:Array<Contact>)=>{
        this.contacts=data;
      }, err=>{
        console.log(err);
      });
    }, err=>{
      console.log(err);
    });
  }

  addAdresse(){
    this.addadresse.id_transporter=this.id;
    this.adressesService.saveAdresses(this.addadresse).subscribe(data=>{
      alert("Adresse added.");
      //this.refresh()
      this.adressesService.adressesDeTransporter(this.id).subscribe((data:Array<Adresse>)=>{
        this.adresses=data;
      }, err=>{
        console.log();
      });
    }, err=>{
      console.log(err)
    })
  }

  deleteAdresse(id:number){
    this.adressesService.deleteAdresse(id)
    .subscribe(data=>{
      alert("Adresse : "+this.addadresse.num+" a ete supprime.");
      //this.refresh();
      this.adressesService.adressesDeTransporter(this.id).subscribe((data:Array<Adresse>)=>{
        this.adresses=data;
      }, err=>{
        console.log();
      });
    }, err=>{
      console.log(err);
    });
  }  

  async addCamion(){
    this.addcamion.idTransporter=this.id;
    //*
    await this.camionsService.saveCamions(this.addcamion).subscribe((data:Camion)=>{
      //console.log('test to see ');
      this.addcamion=data;
      //console.log("data.id : "+ data.id)
      //console.log("this.fichePhysiqueEntretien.idCamion : "+ this.fichePhysiqueEntretien.idCamion)
      //console.log("this.fichePhysiqueEntretienCont.idCamion : "+ this.fichePhysiqueEntretienCont.idCamion)
      this.fichePhysiqueEntretien.idCamion=this.addcamion.id;
      this.fichePhysiqueEntretienCont.idCamion=this.addcamion.id;
      //console.log("this.addCamion.id : "+ this.addcamion.id)
      //console.log("this.fichePhysiqueEntretien.idCamion : "+ this.fichePhysiqueEntretien.idCamion)
      //console.log("this.fichePhysiqueEntretienCont.idCamion : "+ this.fichePhysiqueEntretienCont.idCamion)
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
    
    /*
    this.fichePhysiquesService.saveFichePhysiqueEntretiens(this.fichePhysiqueEntretien).subscribe(data=>{ console.log('fiche1 ok')}, err=>{
        console.log(err)
      });
    this.fichePhysiqueContsService.saveFichePhysiqueEntretienConts(this.fichePhysiqueEntretienCont).subscribe(data=>{console.log('fiche2 ok') }, err=>{
        console.log(err)
      });
    //*/
  }

  deleteCamion(id:number){
    //*
    this.camionsService.deleteCamion(id)
    .subscribe(data=>{
      //alert("Camion : "+this.addadresse.num+" a ete supprime.");
      //this.refresh();
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

  myWindow: any;
  onPress(){
    //this.myWindow.close();
    //this.myWindow = window.open("http://192.168.0.131:8088/", "Ma Carte");
    this.router.navigateByUrl("/map");
    //this.myWindow.close();
    //window.close("googleWindow");
  }
  onQuebec511(){
    this.quebec511=-this.quebec511;
    if (this.quebec511==-1)
      this.textQuebec511="Cacher conditions de routes."
    else
    this.textQuebec511="Voir conditions de routes."
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
  }
  onCoorAddAdresse(){
    this.coorInfos=0;
    this.coorAddAdresse=1;
    this.coorAddContact=0;
  }
  onCoorAddContact(){
    this.coorInfos=0;
    this.coorAddAdresse=0;
    this.coorAddContact=1;
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
    if(camion.odo1Fait!=camion.odo2Fait)
      return this.codeCouleurEnt2(camion)
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
    if(camion.odo2Fait!=camion.odo3Fait)
      return this.codeCouleurEnt3(camion)
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
    if(camion.odo1Fait!=camion.odo2Fait)
      return this.codeTextEnt2(camion)
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
    if(camion.odo2Fait!=camion.odo3Fait)
      return this.codeTextEnt3(camion)
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
    if(camion.odo1Fait!=camion.odo2Fait)
      return this.disableButton2(camion)
    if(camion.ent1==0 || camion.ent1==null || camion.odometre==null)
      return true;
    if((camion.odometre-camion.odo1Fait)<(camion.ent1-5000))
      return true;
    return false;
  }
  disableButton2(camion:Camion):boolean{
    if(camion.odo2Fait!=camion.odo3Fait)
      return this.disableButton3(camion)
    if(camion.ent2==0 || camion.ent2==null || camion.odometre==null)
      return true;
    if((camion.odometre-camion.odo2Fait)<(camion.ent2-5000))
      return true;
    return false;
  }
  disableButton3(camion:Camion) : boolean{
    if(camion.ent3==0 || camion.ent3==null || camion.odometre==null)
      return true;
    if((camion.odometre-camion.odo3Fait)<(camion.ent3-5000))
      return true;
    return false;
  }

  disableButton(odometre, odoFait:number, odoAFaire:number) : boolean{
    if(odoAFaire==0 || odoAFaire==null || odometre==null)
      return true;
    if((odometre-odoFait)<(odoAFaire-5000))
      return true;
    return false;
  }
  disableButtonInspect(inspect6m:Date) : boolean{
    if(inspect6m==null)
      return true;
    let date = new Date();
    let days = (date.getTime() - new Date(inspect6m).getTime())/24/60/60/1000;
    if (days<152)
      return true;
    return false;
  }

  onEntretien01(camion:Camion){
    //let msg:string="test message\n test01 message\n test02 message\n";
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
    });
  }

  onEntretien02(camion:Camion){
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
    });
  }

  onEntretien03(camion:Camion){
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
    });
  }

  onEntretien04(camion:Camion){
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
    });
  }

  onEntretien05(camion:Camion){
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
    });
  }

  onEntretien06(camion:Camion){
    alert("Entretien 6 - Changement huile antigel");
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
    });
  }

  onEntretien07(camion:Camion){
    alert("Entretien 7 - Changement huile transmission");
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
    });
  }

  onEntretien08(camion:Camion){
    alert("Entretien 7 - Changement huile transmission");
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
    });
  }

  onInspect6(camion:Camion){
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
    });
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
    alert("Entretien : "+ entretien.nom);
    entretien.odoFait=odometre;
    entretien.dateFait=new Date();
    this.autreEntretiensService.saveAutreEntretiens(entretien).subscribe(data=>{
      this.codeCouleur(odometre, entretien.odoFait, entretien.kmTrage)
      /* this.camions.forEach(async obj =>{
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
        console.log(err);
      })          //*/
    }, err=>{
      console.log(err);
    });
  }
}
