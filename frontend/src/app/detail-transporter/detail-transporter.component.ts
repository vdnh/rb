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

@Component({
  selector: 'app-detail-transoprter',
  templateUrl: './detail-transporter.component.html',
  styleUrls: ['./detail-transporter.component.css']
})
export class DetailTransporterComponent implements OnInit {
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
  
  constructor(public activatedRoute:ActivatedRoute, public transportersService:TransportersService, public contactsService:ContactsService,
    public adressesService:AdressesService, public camionsService:CamionsService,  public fichePhysiquesService:FichePhysiquesService,
    public fichePhysiqueContsService:FichePhysiqueContsService, private router:Router){    
    this.id=activatedRoute.snapshot.params['id'];
  }

  ngOnInit() {
    this.transportersService.getDetailTransporter(this.id).subscribe((data:Transporter)=>{
      this.transporter=data;
      this.mode=1;
      this.modeTableau=1;
      this.modeCamions=0;
      this.modeCoordonnes=0;
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
    }, err=>{
      console.log();
    });
  }
  saveTransporter(){
    this.transportersService.saveTransporters(this.transporter).subscribe(data=>{
      this.mode=2;
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
      console.log("data.id : "+ data.id)
      console.log("this.fichePhysiqueEntretien.idCamion : "+ this.fichePhysiqueEntretien.id_camion)
      console.log("this.fichePhysiqueEntretienCont.idCamion : "+ this.fichePhysiqueEntretienCont.id_camion)
      this.fichePhysiqueEntretien.id_camion=this.addcamion.id;
      this.fichePhysiqueEntretienCont.id_camion=this.addcamion.id;
      console.log("this.addCamion.id : "+ this.addcamion.id)
      console.log("this.fichePhysiqueEntretien.idCamion : "+ this.fichePhysiqueEntretien.id_camion)
      console.log("this.fichePhysiqueEntretienCont.idCamion : "+ this.fichePhysiqueEntretienCont.id_camion)
      this.camionsService.camionsDeTransporter(this.id).subscribe((data:Array<Camion>)=>{
        this.camions=data;
      }, err=>{
        console.log();
      });
      this.fichePhysiquesService.saveFichePhysiqueEntretiens(this.fichePhysiqueEntretien).subscribe((data:FichePhysiqueEntretien)=>{ 
        console.log('fiche1 ok ' +  data.id_camion)}, err=>{
        console.log(err)
      });
      this.fichePhysiqueContsService.saveFichePhysiqueEntretienConts(this.fichePhysiqueEntretienCont).subscribe((data:FichePhysiqueEntretienCont)=>{
        console.log('fiche2 ok ' +  data.id_camion) }, err=>{
        console.log(err)
      });
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

  codeCouleur(odometre, odoFait:number, odoAFaire:number){
    console.log("I am called.")
    if((odometre-odoFait)<(odoAFaire-5000))
      return "btn-success";
    if((odometre-odoFait)<odoAFaire)
      return "btn-warning";
    if((odometre-odoFait)>=odoAFaire)
      return "btn-danger";
    
      return "nothing";
  }
  //*/
  codeCouleurInspect(inspect6m:Date){
    /*
    Date date =Date.from(Instant.now());
        if(((date.getTime()-entretien.getInspect01().getTime())/24/60/60/1000)>=152)
            sb.append(MessagesConstants.inspec1).append(sdf.format(entretien.getInspect01())).append("<br>");
    //*/        
    let date = new Date();
    let days = (date.getTime() - new Date(inspect6m).getTime())/24/60/60/1000;
    console.log("Date de derniere inspection : "+ inspect6m);
    console.log("Nombre jours apres l'inspection : "+days)
    if (days<152)
      return "btn-success";
    if (days>=152)
      return "btn-warning";
    if (days>=182)
      return "btn-success";      
    return "nothing"
  }
  onEntretien01(camion:Camion){
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
    camion.odo2Fait=camion.odometre;
    camion.ent2Fait=new Date();
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

  onEntretien03(camion:Camion){
    camion.odo3Fait=camion.odometre;
    camion.ent3Fait=new Date();
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

  onEntretien04(camion:Camion){
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
  /*
  refresh(): void {
    window.location.reload();
  }//*/
}
