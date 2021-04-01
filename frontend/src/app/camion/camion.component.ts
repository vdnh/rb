import { Component, OnInit, ViewChild } from '@angular/core';
import { Camion } from 'src/model/model.camion';
import { ActivatedRoute, Router } from '@angular/router';
import { CamionsService } from 'src/services/camions.service';
import { FichePhysiqueEntretien } from 'src/model/model.fichePhysiqueEntretien';
import { FichePhysiqueEntretienCont } from 'src/model/model.fichePhysiqueEntretienCont';
import { FichePhysiquesService } from 'src/services/fichePhysiques.service';
import { FichePhysiqueContsService } from 'src/services/fichePhysiqueConts.service';
import { AutreEntretien } from 'src/model/model.autreEntretien';
import { AutreEntretiensService } from 'src/services/autreEntretiens.service';
import { Subscription, interval, timer } from 'rxjs';
import { Reparation } from 'src/model/model.reparation';
import { BonDeTravail } from 'src/model/model.bonDeTravail';
import { ReparationsService } from 'src/services/reparation.service';
import { BonDeTravailsService } from 'src/services/bonDeTravail.service';
import { Garantie } from 'src/model/model.garantie';
import { GarantiesService } from 'src/services/garantie.service';
import { VarsGlobal } from 'src/services/VarsGlobal';

@Component({
  selector: 'app-camion',
  templateUrl: './camion.component.html',
  styleUrls: ['./camion.component.css']
})
export class CamionComponent implements OnInit {

  today:Date;
  //** pour le BonDeTravail
  bonDeTravail:BonDeTravail=new BonDeTravail();
  bonDeTravails:Array<BonDeTravail>=[];
  reparation:Reparation=new Reparation();
  reparations:Array<Reparation>=[];
  bonDeTravailHistoire:BonDeTravail=new BonDeTravail();
  
  reparationHistoire:Reparation=new Reparation();
  reparationsHistoire:Array<Reparation>=[];
  // */
  //** parametres de la carte
  subscription : Subscription;
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  marker:google.maps.Marker; //=new google.maps.Marker();
  latitude:number=45;
  longitude:number=-73;
  iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
  carte: number=-1;
  carteText:string='' //'Reperer sur la carte'
  //*/
  modeInfos:number=0;
  modeFiche:number=0;
  modeEntretiens:number=0;
  modeDefinirEnt:number=0;
  modeBonDeTravail:number=0;
  modeListReparation:number=0;
  modeBonhist:number=0;
  modeListGarantie:number=0;

  pieceChercher:string="";  // par default on voit tous pieces garantie

  camionFr:Camion=new Camion();
  camionEn:Camion=new Camion();
  camion:Camion=new Camion();
  id:number;

  autreEntretien:AutreEntretien=new AutreEntretien(); // to add more entretien
  entretiens:Array<AutreEntretien>; // liste autreEntretien

  //mode:number=1;
  couleur01:string="btn-danger";
  couleur02:string="btn-warning";
  couleur03:string="btn-success";
  couleur04:string="btn-success";
  couleur05:string="btn-success";
  couleur06:string="btn-warning";
  couleur07:string="btn-success";
  couleur08:string="btn-warning";
  couleur09:string="btn-success";
  couleur10:string="btn-success";

  //fiche:FichePhysiqueEntretien=new FichePhysiqueEntretien();
  //ficheCont:FichePhysiqueEntretienCont=new FichePhysiqueEntretienCont();
  fiche:FichePhysiqueEntretien = new FichePhysiqueEntretien();
  ficheCont:FichePhysiqueEntretienCont = new FichePhysiqueEntretienCont();  

  //
  garanties:Array<Garantie>=[];
  addGarantie:Garantie=new Garantie();
  infoWindow: google.maps.InfoWindow;
  
  constructor(public activatedRoute:ActivatedRoute, public camionsService:CamionsService, public fichePhysiquesService:FichePhysiquesService,
  public fichePhysiqueContsService:FichePhysiqueContsService, public autreEntretiensService:AutreEntretiensService, private router:Router, 
  public reparationsService:ReparationsService, public bonDeTravailsService:BonDeTravailsService,
  public garantieService:GarantiesService, public varsGlobal : VarsGlobal){        
    this.id=activatedRoute.snapshot.params['id'];
    this.camionEn.message01="Change engine oil, oil filter, lubrication, brake adjustment.";
    this.camionEn.message02="Change air filter, fuel filter.";
    this.camionEn.message03="Change polene filter.";
    this.camionEn.message04="Change hydraulic filter.";
    this.camionEn.message05="Change anti-freeze filter.";
    this.camionEn.message06="Change anti-freeze.";
    this.camionEn.message07="Change oil transmission.";
    this.camionEn.message08="Change oil differentiel.";
  }

  getLocalisation(){
    this.camionsService.getDetailCamion(this.id).subscribe((data:Camion)=>{
      //this.camion=data;
      //this.latitude = this.camion.latitude;
      //this.longitude= this.camion.longtitude
      console.log("from camion every 1 minute")
      this.marker.setMap(null);
      let location1 = new google.maps.LatLng(data.latitude, data.longtitude);
      this.marker = new google.maps.Marker({
        position: location1,
        map: this.map,
        //icon: "http://maps.google.com/mapfiles/kml/shapes/truck.png",
        title: data.unite,
        icon: {
          //url:"http://maps.google.com/mapfiles/kml/shapes/truck.png",
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale:4,
          rotation:this.camion.direction,
          fillOpacity: 1,
          fillColor: "#FFFFFF",
          strokeWeight: 2,
          strokeColor: "red",
        },
        
      });
      this.infoWindow = new google.maps.InfoWindow;
      //*  
      this.marker.addListener('click', (event)=>{
        var contentString:string=' Speed : ' + this.camion.speed;
        if(this.camion.stopDuration>0)
          contentString='Stopped : ' + this.showStopDuration(this.camion.stopDuration)
        // Replace the info window's content and position.
        this.infoWindow.setContent(contentString);
        this.infoWindow.setPosition(event.latLng);
        this.infoWindow.open(this.map);///
      })//*/
    }, err=>{
      console.log();
    })//*/
  }
  /*/test ngOnDestroy
    ngOnDestroy(){
      this.subscription.unsubscribe();
    }
  //*/
  async ngOnInit() {
    if(this.varsGlobal.language.includes('Francais'))
    {
      this.camion=this.camionFr;
      this.carteText = 'Reperer sur la carte'
    }
    else {
      this.camion=this.camionEn;
      this.carteText = 'Locate on the Map'
    }
    
    this.today=new Date();
    this.modeBonDeTravail=1;  // voir la partie Entretien-BonDetravail au premier
    this.modeFiche=0;
    this.modeEntretiens=0;
    this.modeDefinirEnt=0;
    await this.camionsService.getDetailCamion(this.id).subscribe((data:Camion)=>{
      this.camion=data;
      // this.couleur01=this.codeCouleur(this.camion.odo1Fait, this.camion.ent1)
      // this.couleur02=this.codeCouleur(this.camion.odo2Fait, this.camion.ent2)
      // this.couleur03=this.codeCouleur(this.camion.odo3Fait, this.camion.ent3)
      this.couleur01=this.codeCouleurEnt1(this.camion)
      this.couleur02=this.codeCouleurEnt2(this.camion)
      this.couleur03=this.codeCouleurEnt3(this.camion)
      this.couleur04=this.codeCouleur(this.camion.odo4Fait, this.camion.filHydrolique)
      this.couleur05=this.codeCouleur(this.camion.odo5Fait, this.camion.filAntigel)
      this.couleur06=this.codeCouleur(this.camion.odo6Fait, this.camion.huileAntigel)
      this.couleur07=this.codeCouleur(this.camion.odo7Fait, this.camion.huileTransmission)
      this.couleur08=this.codeCouleur(this.camion.odo8Fait, this.camion.huileDifferentiel)
      this.couleur09=this.codeCouleurInspect();
      this.couleur10=this.codeCouleurVignette();
      this.fiche.idCamion=this.camion.id;
      this.ficheCont.idCamion=this.camion.id;
      //this.bonDeTravail.idCamion=this.id;
      // console.log("camion.id : "+this.camion.id +" : "+this.camion.unite )
      // console.log("fiche.id_camion : "+this.fiche.idCamion)
      // console.log("ficheCont.id_camion : "+this.ficheCont.idCamion)
      this.fichePhysiquesService.fichePhysiqueEntretienDeCamion(this.fiche.idCamion).subscribe((data:FichePhysiqueEntretien)=>{
        this.fiche=data;
        if(data!=null)
          console.log("Existe fiche")
        else{
          console.log("pas de fiche")
          this.fiche = new FichePhysiqueEntretien();
          this.fiche.idCamion=this.camion.id;
          console.log("fiche.id_camion : "+this.fiche.idCamion)     
          //this.fichePhysiquesService.saveFichePhysiqueEntretiens(this.fiche) 
          this.fichePhysiquesService.saveFichePhysiqueEntretiens(this.fiche).subscribe((data:FichePhysiqueEntretien)=>{
            this.fiche=data;
            if(data!=null)
              console.log("Existe fiche")
            else
              console.log("pas de fiche")            
          }, err=>{
            console.log()
          })
        }  
      }, err=>{
        console.log();
      });
      this.fichePhysiqueContsService.fichePhysiqueEntretienContDeCamion(this.ficheCont.idCamion).subscribe((data:FichePhysiqueEntretienCont)=>{
        this.ficheCont=data;
        if(data!=null)
          console.log("Existe ficheCont")
        else{
          console.log("pas de ficheCont")
          this.ficheCont = new FichePhysiqueEntretienCont();
          this.ficheCont.idCamion=this.camion.id;
          console.log("ficheCont.id_camion : "+this.ficheCont.idCamion);
          this.fichePhysiqueContsService.saveFichePhysiqueEntretienConts(this.ficheCont).subscribe((data:FichePhysiqueEntretienCont)=>{
            this.ficheCont=data;
            if(data!=null)
              console.log("Existe ficheCont")
            else
              console.log("pas de ficheCont")            
          }, err=>{
            console.log()
          })
        }
      }, err=>{
        console.log();
      });
      this.autreEntretiensService.autreEntretienDeCamion(this.id).subscribe((data:Array<AutreEntretien>)=>{
        this.entretiens=data;
      }, err=>{
        console.log(err);
      });
      /*this.bonDeTravailsService.bonDeTravailDeCamion(this.id).subscribe((data:Array<BonDeTravail>)=>{
        this.bonDetravails=data;
      }, err=>{
        console.log(err);
      });//*/
      
    }, err=>{
      console.log(err);
    });
  }
  onInfos(){
    this.modeInfos=1;
    this.modeFiche=0;
    this.modeEntretiens=0;
    this.modeDefinirEnt=0;
    this.modeBonDeTravail=0;
    this.modeListReparation=0;
    this.modeListGarantie=0;
  }
  onFiche(){
    this.modeInfos=0;
    this.modeFiche=1;
    this.modeEntretiens=0;
    this.modeDefinirEnt=0;
    this.modeBonDeTravail=0;
    this.modeListReparation=0;
    this.modeListGarantie=0;
  }
  onEntretiens(){
    this.modeInfos=0;
    this.modeFiche=0;
    this.modeEntretiens=1;
    this.modeDefinirEnt=0;
    this.modeBonDeTravail=0;
    this.modeListReparation=0;
    this.modeListGarantie=0;
  }
  onBonDeTravail(){
    this.modeInfos=0;
    this.modeFiche=0;
    this.modeEntretiens=0;
    this.modeDefinirEnt=0;
    this.modeBonDeTravail=1;
    if(this.bonDeTravail.fini){  // 
      this.newBonDeTravail()
      this.reparations.length=0;  // vider la liste reparation
    }
    this.modeListReparation=0;
    this.modeListGarantie=0;
  }

  async onListGarantie(){
    this.modeInfos=0;
    this.modeFiche=0;
    this.modeEntretiens=0;
    this.modeDefinirEnt=0;
    this.modeBonDeTravail=0;
    this.modeListReparation=0;
    this.modeListGarantie=1;
    this.reparations.length=0;
    await this.bonDeTravailsService.bonDeTravailDeCamion(this.id).subscribe((data:Array<BonDeTravail>)=>{      
      data.sort((a, b) => {return new Date(a.date).getMilliseconds() - new Date(b.date).getMilliseconds()}); // sort date ascending
      data.forEach(bon=>{
        this.reparationsService.reparationDeBon(bon.id).subscribe((reps:Array<Reparation>)=>{
          reps.forEach(rep=>{
            if(rep.piece!=null && rep.piece.toLocaleUpperCase().includes(this.pieceChercher.toLocaleUpperCase())){
              this.reparations.push(rep)
              console.log('rep.piece : '+rep.piece)
            }  
          })
          this.reparations.sort((a, b) => {return b.id - a.id});
          //data.sort((a, b) => {return b.id - a.id}); // sort date descending - by idBonDeTravail - a and b are the BonDeTravail, data is the list of BonDeTravail
        }, err=>{
          console.log(err)
        })
      })
    }, err=>{
      console.log(err);
    })
    await this.garantieService.garantieDeCamion(this.camion.id).subscribe((data:Array<Garantie>)=>{
      this.garanties=data;
    }, err=>{
      console.log(err)
    })
  }
  
  onFileUpLoad(event){
    let selectedFile : File=event.target.files[0];
    if(selectedFile){
      const reader = new FileReader();
      reader.onload = ()=>{this.camion.imgUrl=reader.result.toString();}
      reader.readAsDataURL(selectedFile)
    }
    else this.camion.imgUrl='';
  }
  
  async onListReparation(){
    //alert("La fonction s'en vient.")
    //* find list Bon De Travail
    await this.bonDeTravailsService.bonDeTravailDeCamion(this.id).subscribe((data:Array<BonDeTravail>)=>{
      //this.bonDeTravails.sort((a, b) => {return (a.date.valueOf() - b.date.valueOf())}); // sort date ascending
      //data.sort((a, b) => {return new Date(a.date).getMilliseconds() - new Date(b.date).getMilliseconds()}); // sort date ascending
      data.sort((a, b) => {return b.id - a.id}); // sort date descending - by idBonDeTravail
      this.bonDeTravails=data;
    }, err=>{
      console.log(err);
    })
    //*/
    this.modeInfos=0;
    this.modeFiche=0;
    this.modeEntretiens=0;
    this.modeDefinirEnt=0;
    this.modeBonDeTravail=0;
    this.modeListReparation=1;
    this.modeListGarantie=0;

    this.modeBonhist=0;
  }
  async onHistoireDetailler(bon:BonDeTravail){
    this.bonDeTravail=bon;
    this.bonDeTravailHistoire=bon;
    if(bon.fini==true){
      this.modeBonhist=1;
      await this.reparationsService.reparationDeBon(bon.id).subscribe((data:Array<Reparation>)=>{
        this.reparationsHistoire=data;
      }, err=>{
        console.log(err)
      })
    }
    else 
    {
      this.modeBonhist=0;
      this.onBonDeTravail()
      await this.reparationsService.reparationDeBon(bon.id).subscribe((data:Array<Reparation>)=>{
        this.reparations=data;
        //this.reparationsHistoire=data;
      }, err=>{
        console.log(err)
      })
    }  
  }

  async onHistoireDetaillerOnList(bon:BonDeTravail){ // new up date to view all history on list
    this.bonDeTravail=bon;
    this.bonDeTravailHistoire=bon;
    // if(bon.fini==true){
    this.modeBonhist=1;
    await this.reparationsService.reparationDeBon(bon.id).subscribe((data:Array<Reparation>)=>{
      this.reparationsHistoire=data;
    }, err=>{
      console.log(err)
    })
    //}
    // else 
    // {
    //   this.modeBonhist=0;
    //   this.onBonDeTravail()
    //   await this.reparationsService.reparationDeBon(bon.id).subscribe((data:Array<Reparation>)=>{
    //     this.reparations=data;
    //     //this.reparationsHistoire=data;
    //   }, err=>{
    //     console.log(err)
    //   })
    // }  
  }

  async onGarantieDetailler(idBon:number){
    //this.bonDeTravailHistoire=
    await this.bonDeTravailsService.getDetailBonDeTravail(idBon).subscribe((data:BonDeTravail)=>{
      //this.bonDeTravailHistoire=data;
      //this.onListReparation();
      this.modeListGarantie=0;
      this.modeListReparation=1;
      this.onHistoireDetailler(data);
    }, err=>{
      console.log(err)
    });
  }
  onDefinirEnt(){
    this.modeInfos=0;
    this.modeFiche=0;
    this.modeEntretiens=0;
    this.modeDefinirEnt=1;
    this.modeBonDeTravail=0;
    this.modeListReparation=0;
  }
  gotoDetailTransporter(id:number){
    this.router.navigate(['detail-transporter',id]);
  }
  gotoCamion(id:number){
    this.router.navigate(['camion',id]);
  }
  async saveCamion(){
    await this.camionsService.saveCamions(this.camion).subscribe(async (data:Camion)=>{
      this.camion=data;
      this.couleur01=this.codeCouleurEnt1(this.camion)
      this.couleur02=this.codeCouleurEnt2(this.camion)
      this.couleur03=this.codeCouleurEnt3(this.camion)
      this.couleur04=this.codeCouleur(this.camion.odo4Fait, this.camion.filHydrolique)
      this.couleur05=this.codeCouleur(this.camion.odo5Fait, this.camion.filAntigel)
      this.couleur06=this.codeCouleur(this.camion.odo6Fait, this.camion.huileAntigel)
      this.couleur07=this.codeCouleur(this.camion.odo7Fait, this.camion.huileTransmission)
      this.couleur08=this.codeCouleur(this.camion.odo8Fait, this.camion.huileDifferentiel)
      this.couleur09=this.codeCouleurInspect();
      this.couleur10=this.codeCouleurVignette();
    //*
    }, err=>{
      console.log(err);
    });//*/
      await this.fichePhysiquesService.saveFichePhysiqueEntretiens(this.fiche).subscribe((data:FichePhysiqueEntretien)=>{
        this.fiche=data;
        if(data!=null)
          console.log("Existe fiche")
        else
          console.log("pas de fiche")            
      }, err=>{
        console.log()
      })
      await this.fichePhysiqueContsService.saveFichePhysiqueEntretienConts(this.ficheCont).subscribe((data:FichePhysiqueEntretienCont)=>{
        this.ficheCont=data;
        if(data!=null)
          console.log("Existe fiche")
        else
          console.log("pas de fiche")            
      }, err=>{
        console.log()
      })
      await this.entretiens.forEach(obj => {
        this.autreEntretiensService.saveAutreEntretiens(obj).subscribe(data=>{
        }, err=>{
          console.log(err)
        })
      });
      // await this.bonDeTravailsService.saveBonDeTravail(this.bonDeTravail).subscribe(data=>{      
      // }, err=>{
      //   console.log()
      // });
      // await this.reparations.forEach(obj => {
      //   this.reparationsService.saveReparation(obj).subscribe(data=>{
      //   }, err=>{
      //     console.log(err)
      //   })
      // });
    /*
    }, err=>{
      console.log(err);
    });//*/
    this.router.navigate(['detail-transporter',this.camion.idTransporter]);
  }
  //*
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
  codeCouleur(odoFait:number, odoAFaire:number){
    if(odoAFaire==0 || odoAFaire==null || this.camion.odometre==null || this.camion.odometre==0)
      //console.log('btn-danger" [disabled]="true');
      return "";
    if((this.camion.odometre-odoFait)<(odoAFaire-5000))
      return "btn-success";
    if((this.camion.odometre-odoFait)<odoAFaire)
      return "btn-warning";
    if((this.camion.odometre-odoFait)>=odoAFaire)
      return "btn-danger";
    
      return "";
  }
  //*/
  codeCouleurVignette(){
    if(this.camion.vignetteSaaq==null)
      return '';    
    let date = new Date();
    let days = (date.getTime() - new Date(this.camion.vignetteSaaq).getTime())/24/60/60/1000;
    if (days<334)
      return "btn-success";
    if (days>=334 && days<364)
      return "btn-warning";
    if (days>=364)
      return "btn-danger";      
    return ""
  }

  codeCouleurInspect(){
    if(this.camion.inspect6m==null)
      return '';    
    let date = new Date();
    let days = (date.getTime() - new Date(this.camion.inspect6m).getTime())/24/60/60/1000;
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
      if(this.varsGlobal.language.includes('Francais'))
        return 'pas-data';
      else return 'no-data'
    if((camion.odometre-camion.odo1Fait)<(camion.ent1-5000))
      if(this.varsGlobal.language.includes('Francais'))
        return 'bon-etat';
      else return 'good'  
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
      if(this.varsGlobal.language.includes('Francais'))
        return 'pas-data';
      else return 'no-data'
    if((camion.odometre-camion.odo2Fait)<(camion.ent2-5000))
      if(this.varsGlobal.language.includes('Francais'))
        return 'bon-etat';
      else return 'good'  
    if((camion.odometre-camion.odo2Fait)<camion.ent2)
      return "attention";
    if((camion.odometre-camion.odo2Fait)>=camion.ent2)
      return "urgent";
    
      return "";
  }
  codeTextEnt3(camion:Camion){
    if(camion.ent3==null || camion.ent3==0 || camion.odometre==null || camion.odometre==0)
      if(this.varsGlobal.language.includes('Francais'))
        return 'pas-data';
      else return 'no-data'
    if((camion.odometre-camion.odo3Fait)<(camion.ent3-5000))
      if(this.varsGlobal.language.includes('Francais'))
        return 'bon-etat';
      else return 'good'  
    if((camion.odometre-camion.odo3Fait)<camion.ent3)
      return "attention";
    if((camion.odometre-camion.odo3Fait)>=camion.ent3)
      return "urgent";
    
      return "";
  }

  codeText(odoFait:number, odoAFaire:number){
    //console.log("I am called. And odoAFait : " + odoAFaire)
    if(odoAFaire==0 || odoAFaire==null || this.camion.odometre==null || this.camion.odometre==0)
      if(this.varsGlobal.language.includes('Francais'))
        return 'pas-data';
      else return 'no-data'
    if((this.camion.odometre-odoFait)<(odoAFaire-5000))
      if(this.varsGlobal.language.includes('Francais'))
        return 'bon-etat';
      else return 'good'  
    if((this.camion.odometre-odoFait)<odoAFaire)
      return "attention";
    if((this.camion.odometre-odoFait)>=odoAFaire)
      return "urgent";
    return "";
  }

  codeTextVignette(){
    if(this.camion.vignetteSaaq==null)
    {
      if(this.varsGlobal.language.includes('Francais'))
        return 'pas-data';
      else return 'no-data'
    }
    let date = new Date();
    let days = (date.getTime() - new Date(this.camion.vignetteSaaq).getTime())/24/60/60/1000;
    if (days<334)
      if(this.varsGlobal.language.includes('Francais'))
        return 'bon-etat';
      else return 'good' 
    if (days>=334 && days<364)
      return "attention";
    if (days>=364)
      return "urgent";      
    return ""
  }

  codeTextInspect(){
    if(this.camion.inspect6m==null)
    {
      if(this.varsGlobal.language.includes('Francais'))
        return 'pas-data';
      else return 'no-data'
    }
    let date = new Date();
    let days = (date.getTime() - new Date(this.camion.inspect6m).getTime())/24/60/60/1000;
    if (days<152)
      if(this.varsGlobal.language.includes('Francais'))
        return 'bon-etat';
      else return 'good' 
    if (days>=152 && days<182)
      return "attention";
    if (days>=182)
      return "urgent";      
    return ""
  }

  disableButton1(camion:Camion):boolean{
    //if(camion.odo1Fait!=camion.odo2Fait)
      //return this.disableButton2(camion)
    if(camion.ent1==0 || camion.ent1==null || camion.odometre==null || camion.odometre==0)
      return true;
    if((camion.odometre-camion.odo1Fait)<(camion.ent1-5000))
      return true;
    return false;
  }
  disableButton2(camion:Camion):boolean{
    //if(camion.odo2Fait!=camion.odo3Fait)
      //return this.disableButton3(camion)
    if(camion.ent2==0 || camion.ent2==null || camion.odometre==null || camion.odometre==0)
      return true;
    if((camion.odometre-camion.odo2Fait)<(camion.ent2-5000))
      return true;
    return false;
  }
  disableButton3(camion:Camion) : boolean{
    if(camion.ent3==0 || camion.ent3==null || camion.odometre==null || camion.odometre==0)
      return true;
    if((camion.odometre-camion.odo3Fait)<(camion.ent3-5000))
      return true;
    return false;
  }

  disableButton(odoFait:number, odoAFaire:number) : boolean{
    if(odoAFaire==0 || odoAFaire==null || this.camion.odometre==null || this.camion.odometre==0)
      return true;
    if((this.camion.odometre-odoFait)<(odoAFaire-5000))
      return true;
    return false;
  }
  
  disableButtonVignette() : boolean{
    if(this.camion.vignetteSaaq==null)
      return true;
    let date = new Date();
    let days = (date.getTime() - new Date(this.camion.vignetteSaaq).getTime())/24/60/60/1000;
    if (days<334)
      return true;
    return false;
  }

  disableButtonInspect() : boolean{
    if(this.camion.inspect6m==null)
      return true;
    let date = new Date();
    let days = (date.getTime() - new Date(this.camion.inspect6m).getTime())/24/60/60/1000;
    if (days<152)
      return true;
    return false;
  }

  onEntretien01(){
    if(this.varsGlobal.language.includes('Francais'))
      alert("Entretien 1 - Changement huile moteur, filtre moteur, graissage, ajustement des freins");
    else alert('Program 1 - Change engine oil, oil filter, lubrication, brake adjustment.')
    //let rep:Reparation=new Reparation();
    //rep.reparationEffectuer= this.camion.message01 //ent01.message
    //this.reparations.push(rep)
    this.reparation.reparationEffectuer= this.camion.message01 //ent01.message
    this.camion.odo1Fait=this.camion.odometre; //to test before dicide
    this.camion.ent1Fait=new Date(); //to test before dicide
    this.couleur01=this.codeCouleurEnt1(this.camion); // to test before dicide
    /* stop to test
    this.camion.odo1Fait=this.camion.odometre;
    this.camion.ent1Fait=new Date();
    this.camionsService.saveCamions(this.camion).subscribe(data=>{
      this.couleur01=this.codeCouleurEnt01(this.camion);
    }, err=>{
      console.log(err);
    });//*/
  }
  
  onEntretien02(){
    if(this.varsGlobal.language.includes('Francais'))
      alert("Entretien 2 - Changement filtre a l'air, filtre a fuel");
    else alert('Program 2 - Change air filter, fuel filter.')
    // let rep:Reparation=new Reparation();
    // rep.reparationEffectuer= this.camion.message02 //ent02.message
    // this.reparations.push(rep)
    this.reparation.reparationEffectuer= this.camion.message02 //ent02.message
    this.camion.odo2Fait=this.camion.odometre; //to test before dicide
    this.camion.ent2Fait=new Date(); //to test before dicide
    this.couleur02=this.codeCouleurEnt2(this.camion); // to test before dicide
    //this.onEntretien01(); // to test berfore dicide
    /* stop to test
    this.camion.odo2Fait=this.camion.odometre;
    this.camion.ent2Fait=new Date();
    this.camionsService.saveCamions(this.camion).subscribe(data=>{
      //this.refresh();
      //this.gotoDetailTransporter(this.camion.idTransporter);
      this.onEntretien01();
      this.couleur02=this.codeCouleurEnt2(this.camion);
    }, err=>{
      console.log(err);
    });//*/
  }

  onEntretien03(){
    if(this.varsGlobal.language.includes('Francais'))
      alert("Entretien 3 - Changement filtre a polene");
    else alert('Program 3 - Change polene filter.')
    // let rep:Reparation=new Reparation();
    // rep.reparationEffectuer= this.camion.message03 //ent03.message
    // this.reparations.push(rep)
    this.reparation.reparationEffectuer= this.camion.message03 //ent03.message
    this.camion.odo3Fait=this.camion.odometre; //to test before dicide
    this.camion.ent3Fait=new Date(); //to test before dicide
    this.couleur03=this.codeCouleurEnt3(this.camion); // to test before dicide
    //this.onEntretien02(); // to test before dicide
    /* stop to test
    this.camion.odo3Fait=this.camion.odometre;
    this.camion.ent3Fait=new Date();
    this.camionsService.saveCamions(this.camion).subscribe(data=>{
      //this.gotoDetailTransporter(this.camion.idTransporter);//this.refresh();
      this.onEntretien02();
      this.couleur03=this.codeCouleur(this.camion.odo3Fait, this.camion.ent3)
    }, err=>{
      console.log(err);
    });//*/
  }

  onEntretien04(){
    if(this.varsGlobal.language.includes('Francais')) 
      alert("Entretien 4 - Changement filtre hydrolique");
    else alert('Program 4 - Change hydraulic filter.')
    // let rep:Reparation=new Reparation();
    // rep.reparationEffectuer= this.camion.message04 //ent04.message
    // this.reparations.push(rep)
    this.reparation.reparationEffectuer= this.camion.message04 //ent04.message
    this.camion.odo4Fait=this.camion.odometre; //to test before dicide
    this.camion.ent4Fait=new Date(); //to test before dicide
    this.couleur04=this.codeCouleur(this.camion.odo4Fait, this.camion.filHydrolique); // to test before dicide
    /* stopper to test 
    this.camion.odo4Fait=this.camion.odometre;
    this.camion.ent4Fait=new Date();
    this.camionsService.saveCamions(this.camion).subscribe(data=>{      
      this.couleur04=this.codeCouleur(this.camion.odo4Fait, this.camion.filHydrolique)
    }, err=>{
      console.log(err);
    });//*/
  }
  
  onEntretien05(){
    if(this.varsGlobal.language.includes('Francais'))
      alert("Entretien 5 - Changement filtre antigel");
    else alert('Program 5 - Change anti-freeze filter.')
    let rep:Reparation=new Reparation();
    rep.reparationEffectuer= this.camion.message05 //ent05.message
    this.reparations.push(rep)
    this.reparation.reparationEffectuer= this.camion.message05 //ent05.message
    this.camion.odo5Fait=this.camion.odometre; //to test before dicide
    this.camion.ent5Fait=new Date(); //to test before dicide
    this.couleur05=this.codeCouleur(this.camion.odo5Fait, this.camion.filAntigel); // to test before dicide
    /*
    this.camion.odo5Fait=this.camion.odometre;
    this.camion.ent5Fait=new Date();
    this.camionsService.saveCamions(this.camion).subscribe(data=>{
      this.couleur05=this.codeCouleur(this.camion.odo5Fait, this.camion.filAntigel)
    }, err=>{
      console.log(err);
    });//*/
  }

  onEntretien06(){
    if(this.varsGlobal.language.includes('Francais'))
      alert("Entretien 6 - Changement huile antigel");
    else alert('Program 6 - Change anti-freeze.')
    // let rep:Reparation=new Reparation();
    // rep.reparationEffectuer= this.camion.message06 //ent06.message
    // this.reparations.push(rep)
    this.reparation.reparationEffectuer= this.camion.message06 //ent06.message
    this.camion.odo6Fait=this.camion.odometre; //to test before dicide
    this.camion.ent6Fait=new Date(); //to test before dicide
    this.couleur06=this.codeCouleur(this.camion.odo6Fait, this.camion.huileAntigel); // to test before dicide
    /*
    this.camion.odo6Fait=this.camion.odometre;
    this.camion.ent6Fait=new Date();
    this.camionsService.saveCamions(this.camion).subscribe(data=>{
      this.couleur06=this.codeCouleur(this.camion.odo6Fait, this.camion.huileAntigel)
    }, err=>{
      console.log(err);
    });//*/
  }

  onEntretien07(){
    if(this.varsGlobal.language.includes('Francais'))
      alert("Entretien 7 - Changement huile transmission");
    else alert('Program 7- Change oil transmission.')
    let rep:Reparation=new Reparation();
    rep.reparationEffectuer= this.camion.message07 //ent01.message
    this.reparations.push(rep)
    this.reparation.reparationEffectuer= this.camion.message07 //ent07.message
    this.camion.odo7Fait=this.camion.odometre; //to test before dicide
    this.camion.ent7Fait=new Date(); //to test before dicide
    this.couleur07=this.codeCouleur(this.camion.odo7Fait, this.camion.huileTransmission); // to test before dicide
    /*
    this.camion.odo7Fait=this.camion.odometre;
    this.camion.ent7Fait=new Date();
    this.camionsService.saveCamions(this.camion).subscribe(data=>{
      this.couleur07=this.codeCouleur(this.camion.odo7Fait, this.camion.huileTransmission)
    }, err=>{
      console.log(err);
    });//*/
  }

  onEntretien08(){
    if(this.varsGlobal.language.includes('Francais'))
      alert("Entretien 8 - Changement huile differentiel");
    else alert('Program 8 - Change oil differentiel.')
    // let rep:Reparation=new Reparation();
    // rep.reparationEffectuer= this.camion.message08 //ent01.message
    // this.reparations.push(rep)
    this.reparation.reparationEffectuer= this.camion.message08 //ent08.message
    this.camion.odo8Fait=this.camion.odometre; //to test before dicide
    this.camion.ent8Fait=new Date(); //to test before dicide
    this.couleur08=this.codeCouleur(this.camion.odo8Fait, this.camion.huileDifferentiel); // to test before dicide
    /*
    this.camion.odo8Fait=this.camion.odometre;
    this.camion.ent8Fait=new Date();
    this.camionsService.saveCamions(this.camion).subscribe(data=>{
      this.couleur08=this.codeCouleur(this.camion.odo8Fait, this.camion.huileDifferentiel)
    }, err=>{
      console.log(err);
    });//*/
  }

  onVignette(){
    if(this.varsGlobal.language.includes('Francais'))
    {
      alert('Vignette SAAQ 1 fois par an.');
      this.reparation.reparationEffectuer= 'Vignette SAAQ'
    }
    else {
      alert('License 1 time per year.')
      this.reparation.reparationEffectuer= 'License 1 time per year'
    }
    this.camion.vignetteSaaq=new Date();
    this.couleur10=this.codeCouleurVignette();
  }

  onInspect6(){
    if(this.varsGlobal.language.includes('Francais'))
    {
      alert('Inspection aux 6 mois.');
      this.reparation.reparationEffectuer= 'Inspection aux 6 mois.'
    }
    else {
      alert('Inspection every 6 months.')
      this.reparation.reparationEffectuer= 'Inspection every 6 months.'
    }
    this.camion.inspect6m=new Date();
    this.couleur09=this.codeCouleurInspect();
  }

  onAutreEntretien(entretien:AutreEntretien){    
    if(this.varsGlobal.language.includes('Francais'))
      alert("Entretien - "+entretien.nom);
    else alert("Program - "+entretien.nom);
    // let rep:Reparation=new Reparation();
    // rep.reparationEffectuer= entretien.message;
    // this.reparations.push(rep)
    this.reparation.reparationEffectuer= entretien.message
    entretien.odoFait=this.camion.odometre; //to test before dicide
    entretien.dateFait=new Date(); // to test before dicide
    /* stop to test
    entretien.odoFait=this.camion.odometre;
    entretien.dateFait=new Date();
    this.autreEntretiensService.saveAutreEntretiens(entretien).subscribe((data:AutreEntretien)=>{
      this.couleurAutreEntretien(entretien)
    }, err=>{
      console.log(err);
    });//*/
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
    
    //duration = days+' jour(s) '+hours+' heure(s) '+minutes+' minute(s) '

    return duration;
  }

  onPress(id:number){
    this.carte=-this.carte;
    if(this.carte==-1){
      if(this.varsGlobal.language.includes('Francais'))
        this.carteText = 'Reperer sur la carte'
      else this.carteText = 'Locate on the Map'
      this.subscription.unsubscribe();
    }
    else{
      if(this.varsGlobal.language.includes('Francais'))
        this.carteText='Fermer la carte'
      else this.carteText = 'Close the Map'
      var numbers = timer(2000);
      numbers.subscribe(x =>{
        this.camionsService.getDetailCamion(this.id).subscribe((data:Camion)=>{
          //this.camion=data;
          // if(data.status && (data.uniteMonitor!=null && data.monitor!=null) && (data.monitor.length!=0 && data.monitor.length!=0)){
          if(data.status && (data.gps || (data.idTerminal!=null && data.idTerminal>0))){
            //this.latitude = this.camion.latitude;
            //this.longitude= this.camion.longtitude
            //this.marker.setMap(null);
            let location1 = new google.maps.LatLng(data.latitude, data.longtitude);
            let mapProp = {
              center: new google.maps.LatLng(data.latitude, data.longtitude),
              zoom: 15,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
            this.marker = new google.maps.Marker({
              position: location1,
              map: this.map,
              //icon: "http://maps.google.com/mapfiles/kml/shapes/truck.png",
              title: data.unite,
              icon: {
                //url:"http://maps.google.com/mapfiles/kml/shapes/truck.png",
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale:4,
                rotation:this.camion.direction,
                fillOpacity: 1,
                fillColor: "#FFFFFF",
                strokeWeight: 2,
                strokeColor: "red",
              },
              
            });
            this.infoWindow = new google.maps.InfoWindow;
            //*  
            this.marker.addListener('click', (event)=>{
              var contentString:string=' Speed : ' + this.camion.speed;
              if(this.camion.stopDuration>0)
                contentString='Stopped : ' + this.showStopDuration(this.camion.stopDuration)
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
          if(this.varsGlobal.language.includes('Francais'))
            alert("Ce camion n'est pas suivi gps")
          else alert("This unit hasn't GPS")
        }, err=>{
          console.log();
        })//*/
      })  
      //this.router.navigate(['map', id]);
    }
  }
  refresh(): void {
    //window.location.reload();
    location.reload(true);
    //object.reload(forced)
  }
  deleteEntretien(id:number){
    this.autreEntretiensService.deleteAutreEntretien(id).subscribe(data=>{
      this.autreEntretiensService.autreEntretienDeCamion(this.id).subscribe((data:Array<AutreEntretien>)=>{
        this.entretiens=data;
      }, err=>{
        console.log(err);
      });
    }, err=>{
      console.log(err);
    });
  }
  addEntretien(){
    this.autreEntretien.idCamion=this.id;
    this.autreEntretiensService.saveAutreEntretiens(this.autreEntretien).subscribe(data=>{
      alert("Ok, it's added.");
      this.autreEntretiensService.autreEntretienDeCamion(this.id).subscribe((data:Array<AutreEntretien>)=>{
        this.entretiens=data;
      }, err=>{
        console.log(err);
      });
    }, err=>{
      console.log(err)
    })
  }
  prixChange(){
    let prixPieces=0.00, prixHeures = 0.00
    if(this.reparation.quantite>0 && this.reparation.prixUnite>0){
      prixPieces = new Number((this.reparation.quantite*this.reparation.prixUnite).toFixed(2)).valueOf();
    }
    if(this.reparation.heures>0 && this.reparation.taux>0){
      prixHeures = new Number((this.reparation.heures*this.reparation.taux).toFixed(2)).valueOf();
    }
    this.reparation.prix = prixPieces + prixHeures
    this.bonDeTravail.sousTotal =0.00; 
    this.reparations.forEach(async rep=>{
      this.bonDeTravail.sousTotal += rep.prix;
    })
    this.bonDeTravail.tps = new Number((0.05*this.bonDeTravail.sousTotal).toFixed(2)).valueOf()
    this.bonDeTravail.tvq =  new Number((0.09975*this.bonDeTravail.sousTotal).toFixed(2)).valueOf()
    this.bonDeTravail.total=this.bonDeTravail.sousTotal+this.bonDeTravail.tps+this.bonDeTravail.tvq    
  }

  repsPrixChange(){ 
    if(this.reparations.length>0){
      this.bonDeTravail.sousTotal =0.00;
      this.reparations.forEach(r=>{
        let prixPieces=0.00, prixHeures = 0.00
        if(r.quantite>0 && r.prixUnite>0){
          prixPieces = new Number((r.quantite*r.prixUnite).toFixed(2)).valueOf();
        }
        if(r.heures>0 && r.taux>0){
          prixHeures = new Number((r.heures*r.taux).toFixed(2)).valueOf();
        }
        if((prixPieces + prixHeures)>0) r.prix = prixPieces + prixHeures
        this.bonDeTravail.sousTotal += r.prix;
      })
      this.bonDeTravail.tps = new Number((0.05*this.bonDeTravail.sousTotal).toFixed(2)).valueOf()
      this.bonDeTravail.tvq =  new Number((0.09975*this.bonDeTravail.sousTotal).toFixed(2)).valueOf()
      this.bonDeTravail.total=this.bonDeTravail.sousTotal+this.bonDeTravail.tps+this.bonDeTravail.tvq
    }
    /*
    let prixPieces=0.00, prixHeures = 0.00
    if(this.reparation.quantite>0 && this.reparation.prixUnite>0){
      prixPieces = new Number((this.reparation.quantite*this.reparation.prixUnite).toFixed(2)).valueOf();
    }
    if(this.reparation.heures>0 && this.reparation.taux>0){
      prixHeures = new Number((this.reparation.heures*this.reparation.taux).toFixed(2)).valueOf();
    }
    this.reparation.prix = prixPieces + prixHeures
    this.bonDeTravail.sousTotal =0.00; 
    this.reparations.forEach(async rep=>{
      this.bonDeTravail.sousTotal += rep.prix;
    })
    this.bonDeTravail.tps = new Number((0.05*this.bonDeTravail.sousTotal).toFixed(2)).valueOf()
    this.bonDeTravail.tvq =  new Number((0.09975*this.bonDeTravail.sousTotal).toFixed(2)).valueOf()
    this.bonDeTravail.total=this.bonDeTravail.sousTotal+this.bonDeTravail.tps+this.bonDeTravail.tvq//*/    
  }
  
  addReparation(){
    /*await this.bonDeTravailsService.saveBonDeTravail(this.bonDeTravail).subscribe((data:BonDeTravail)=>{
      this.bonDeTravail=data;
    }, err=>{
      console.log(err)
    })//*/
    let rep:Reparation=new Reparation();
    rep=this.reparation
    this.bonDeTravail.sousTotal += this.reparation.prix;
    this.bonDeTravail.tps = new Number((0.05*this.bonDeTravail.sousTotal).toFixed(2)).valueOf()
    this.bonDeTravail.tvq =  new Number((0.09975*this.bonDeTravail.sousTotal).toFixed(2)).valueOf()
    this.bonDeTravail.total=this.bonDeTravail.sousTotal+this.bonDeTravail.tps+this.bonDeTravail.tvq
    this.reparations.push(rep)
    //this.bonDeTravail.sousTotal=0
    //this.reparations.forEach
    this.reparation=new Reparation();

    /*this.reparationsService.saveReparation(this.reparation).subscribe(data=>{
      alert("Reparation added.");
      /*this.reparationsService.reparationDeBon(this.bonDeTravail.id).subscribe((data:Array<Reparation>)=>{
        this.reparations=data;
      }, err=>{
        console.log(err);
      });///
    }, err=>{
      console.log(err)
    })//*/
  }
  
  newBonDeTravail(){
    this.bonDeTravail=new BonDeTravail();
    this.reparations=[];
  }
  
  finiBonDeTravail(){    
    //this.bonDeTravail.idCamion=this.id;
    //this.bonDeTravail.sousTotal =0.00; 
    this.bonDeTravail.fini=true; //finish, we can not add anymore.
    /*this.reparations.forEach(async rep=>{
      this.bonDeTravail.sousTotal += rep.prix;
    })//*/
    //this.bonDeTravail.tps = new Number((0.05*this.bonDeTravail.sousTotal).toFixed(2)).valueOf()
    //this.bonDeTravail.tvq =  new Number((0.09975*this.bonDeTravail.sousTotal).toFixed(2)).valueOf()
    //this.bonDeTravail.total=this.bonDeTravail.sousTotal+this.bonDeTravail.tps+this.bonDeTravail.tvq  
    //* faut pas cette bloc car elle sera fait dans camionService.saveCamion  
    this.bonDeTravailsService.saveBonDeTravail(this.bonDeTravail).subscribe((data:BonDeTravail)=>{
      this.bonDeTravail=new BonDeTravail();   //data;      
      console.log("data.id : " + data.id)
      this.entretiens.forEach(obj => {
        this.autreEntretiensService.saveAutreEntretiens(obj).subscribe(data=>{
        }, err=>{
          console.log(err)
        })
      });
      this.reparations.forEach(async rep=>{
        rep.idBon=data.id;
        rep.saved=true;
        await this.reparationsService.saveReparation(rep).subscribe((d:Reparation)=>{
          rep.id = d.id;
          //to empty the list reparations after save them
          this.reparations.splice(this.reparations.findIndex(x=>x==rep), 1); //test to remove reparation dans list reparation
        }, err=>{
          console.log(err);
        })
      })
    }, err=>{
      console.log(err)
    })//*/
    //* this code block is used to test before dicide
    this.camionsService.saveCamions(this.camion).subscribe(data=>{      
      console.log("Mise a jour camion apres valide le BonDeTravail")
    }, err=>{
      console.log(err);
    });
    //*/
  }

  validBonDeTravail(){
    this.bonDeTravail.idCamion=this.id;
    this.bonDeTravail.sousTotal =0.00; 
    this.reparations.forEach(async rep=>{
      this.bonDeTravail.sousTotal += rep.prix;
    })
    this.bonDeTravail.tps = new Number((0.05*this.bonDeTravail.sousTotal).toFixed(2)).valueOf()
    this.bonDeTravail.tvq =  new Number((0.09975*this.bonDeTravail.sousTotal).toFixed(2)).valueOf()
    this.bonDeTravail.total=this.bonDeTravail.sousTotal+this.bonDeTravail.tps+this.bonDeTravail.tvq    
    /*/this.bonDeTravail.sousTotal=0.00;
    this.reparations.forEach(rep=>{
      this.bonDeTravail.sousTotal += this.reparation.prix;
      this.bonDeTravail.tps = new Number((0.05*this.bonDeTravail.sousTotal).toFixed(2)).valueOf()
      this.bonDeTravail.tvq =  new Number((0.09975*this.bonDeTravail.sousTotal).toFixed(2)).valueOf()
      this.bonDeTravail.total=this.bonDeTravail.sousTotal+this.bonDeTravail.tps+this.bonDeTravail.tvq                  
    })//*/  
    //* faut pas cette bloc car elle sera fait dans camionService.saveCamion  
    this.bonDeTravailsService.saveBonDeTravail(this.bonDeTravail).subscribe((data:BonDeTravail)=>{
      //this.bonDeTravail=new BonDeTravail();   //data;      
      this.bonDeTravail=data;
      console.log("data.id : " + data.id)
      //console.log("this.bonDeTravail.id : " + this.bonDeTravail.id)
      //this.bonDeTravail.sousTotal =0.00; 
      this.entretiens.forEach(obj => {
        this.autreEntretiensService.saveAutreEntretiens(obj).subscribe(data=>{
        }, err=>{
          console.log(err)
        })
      });
      this.reparations.forEach(async rep=>{
        //this.bonDeTravail.sousTotal += rep.prix;
        rep.idBon=data.id;
        rep.saved=true;
        await this.reparationsService.saveReparation(rep).subscribe((d:Reparation)=>{
          rep.id = d.id;
          //to empty the list reparations after save them
          //this.reparations.splice(this.reparations.findIndex(x=>x==rep), 1); //test to remove reparation dans list reparation
        }, err=>{
          console.log(err);
        })
      })
      //this.bonDeTravail.tps = new Number((0.05*this.bonDeTravail.sousTotal).toFixed(2)).valueOf()
      //this.bonDeTravail.tvq =  new Number((0.09975*this.bonDeTravail.sousTotal).toFixed(2)).valueOf()
      //this.bonDeTravail.total=this.bonDeTravail.sousTotal+this.bonDeTravail.tps+this.bonDeTravail.tvq
      //this.reparations.length = 0;  // empty the list reparations
    }, err=>{
      console.log(err)
    })//*/
    //* this code block is used to test before dicide
    this.camionsService.saveCamions(this.camion).subscribe(data=>{      
      console.log("Mise a jour camion apres valide le BonDeTravail")
    }, err=>{
      console.log(err);
    });
    //*/
  }

  printBonDeTravail(cmpId){
    const printContent = document.getElementById(cmpId);
    //const WindowPrt = window.open('','','left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    const WindowPrt = window.open();
    WindowPrt.document.write('<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
    /*
    let printContents = document.getElementById(cmpId).innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;

    window.print();
    document.body.innerHTML=originalContents;//*/
  }
  
  deleteReparation(rep:Reparation){
    if(this.reparations.length<=1){
      if(this.varsGlobal.language.includes('Francais'))
        alert('On ne peut que modifier la reparation unique.')
      else alert('We can only modify the reparation')
    }
    else{
      this.reparations.splice(this.reparations.findIndex(x=>x==rep), 1); 
      this.prixChange();
    }
  }

  onDetailHistoire(bon : BonDeTravail){
    let repTemps : Array<Reparation> = [];
    this.bonDeTravailsService.bonDeTravailDeCamion(bon.id).subscribe((data:Array<Reparation>)=>{
      repTemps=data;
    }, err=>{
      console.log(err)
    })
    return repTemps;
  }

  couleurAutreEntretien(entretien:AutreEntretien){
    if(entretien.kmTrage==0 || entretien.kmTrage==null || this.camion.odometre==null)
      //console.log('btn-danger" [disabled]="true');
      return "";
    if((this.camion.odometre-entretien.odoFait)<(entretien.kmTrage-entretien.kmAvertir))
      return "btn-success";
    if((this.camion.odometre-entretien.odoFait)<entretien.kmTrage)
      return "btn-warning";
    if((this.camion.odometre-entretien.odoFait)>=entretien.kmTrage)
      return "btn-danger";
  
    return "";
  }
  disableButtonAutreEntretien(entretien:AutreEntretien){
    if(entretien.kmTrage==0 || entretien.kmTrage==null || this.camion.odometre==null)
      return true;
    if((this.camion.odometre-entretien.odoFait)<(entretien.kmTrage-entretien.kmAvertir))
      return true;
    return false;
  }

  onAddGarantie(){
    if(this.addGarantie.nom.length>0){
      let g=this.addGarantie;
      this.addGarantie.idCamion=this.camion.id;
      this.garantieService.saveGarantie(this.addGarantie).subscribe((data:Garantie)=>{
        g.id=data.id
        this.garanties.push(g);
      }, err=>{});
      this.addGarantie=new Garantie();
    }
  }
  onDeleteGarantie(g:Garantie){
    console.log('g:garantie : '+g.id)
    this.garanties.splice(this.garanties.indexOf(g), 1)
    this.garantieService.deleteGarantie(g.id).subscribe(data=>{},err=>{console.log(err)})
  }
}
