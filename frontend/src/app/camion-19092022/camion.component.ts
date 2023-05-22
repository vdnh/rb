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
import { Fuel } from 'src/model/model.fuel';
import { FuelService } from 'src/services/fuel.service';
import { ExpenseFixedService } from 'src/services/expenseFixed.service';
import { ExpenseFlexibleService } from 'src/services/expenseFlexible.service';
import { ExpenseFixed } from 'src/model/model.expenseFixed';
import { ExpenseFlexible } from 'src/model/model.expenseFlexible';

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
  modeExpense:number=0;

  pieceChercher:string="";  // par default on voit tous pieces garantie

  camionFr:Camion=new Camion();
  camionEn:Camion=new Camion();
  camion:Camion=new Camion();
  id:number;

  autreEntretien:AutreEntretien=new AutreEntretien(); // to add more entretien
  entretiens:Array<AutreEntretien>=[]; // liste autreEntretien

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
  public garantieService:GarantiesService, public varsGlobal : VarsGlobal, public fuelService: FuelService,
  public expenseFixedService: ExpenseFixedService, public expenseFlexibleService: ExpenseFlexibleService){        
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
  //test ngOnDestroy
    ngOnDestroy(){
      if(this.subscription!=null) 
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
    // here is when we create new camion from the page detail-transporter 
    if(this.id==null || this.id<=0)
    {
      this.modeBonDeTravail=0;  // ne pas voir la partie Entretien-BonDetravail au premier
      this.modeInfos=1; // voir la partie Infos au premier
      this.camion.idTransporter=Number (localStorage.getItem("idTransporter"))
    }
    else await this.camionsService.getDetailCamion(this.id).subscribe((data:Camion)=>{
      this.camion=data;
      this.bonDeTravail.odometre=this.camion.odometre
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
        this.entretiens.forEach(ent=>{ent.dateFait=this.showDateLocal(ent.dateFait)})
      }, err=>{
        console.log(err);
      });
      /*this.bonDeTravailsService.bonDeTravailDeCamion(this.id).subscribe((data:Array<BonDeTravail>)=>{
        this.bonDetravails=data;
      }, err=>{
        console.log(err);
      });//*/
      // check if expenseView true or false
      let expenseView = Number (localStorage.getItem('expenseView'))
      if (expenseView!=null && expenseView==1)
      {      
        this.onExpense()// show modeExpense first
        // and then delete expenseView in localStorage
        localStorage.removeItem('expenseView')
      }
      else this.modeBonDeTravail=1;  // voir la partie Entretien-BonDetravail au premier
    }, err=>{
      console.log(err);
    });
  }
  
  showDateLocal(d:Date){
    if(d!=null){
      console.log('showDateLocal - date entre : ' + d.toString())
      d=new Date(d)
      console.log('showDateLocal - date apres new Date(d) : ' + d.toString())
      // let dateLocal= new Date(d.getTime()+(new Date().getTimezoneOffset()*60000))
      // console.log('showDateLocal - date apres ajout Offset : ' + dateLocal.toString())
      // return dateLocal;
      return d
    }
    return null;
  }
    
  onInfos(){
    this.modeInfos=1;
    this.modeFiche=0;
    this.modeEntretiens=0;
    this.modeDefinirEnt=0;
    this.modeBonDeTravail=0;
    this.modeListReparation=0;
    this.modeListGarantie=0;
    this.modeExpense=0;
  }
  onFiche(){
    this.modeInfos=0;
    this.modeFiche=1;
    this.modeEntretiens=0;
    this.modeDefinirEnt=0;
    this.modeBonDeTravail=0;
    this.modeListReparation=0;
    this.modeListGarantie=0;
    this.modeExpense=0;
  }
  onEntretiens(){
    this.modeInfos=0;
    this.modeFiche=0;
    this.modeEntretiens=1;
    this.modeDefinirEnt=0;
    this.modeBonDeTravail=0;
    this.modeListReparation=0;
    this.modeListGarantie=0;
    this.modeExpense=0;
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
    this.modeExpense=0;
  }

  onExpense(){
    this.modeInfos=0;
    this.modeFiche=0;
    this.modeEntretiens=0;
    this.modeDefinirEnt=0;
    this.modeBonDeTravail=0;
    this.modeListReparation=0;
    this.modeListGarantie=0;
    this.modeExpense=1;
    // this.onStatis() // calculate statistic by default
    this.onFuelExpense()
  }

  async onListGarantie(){
    this.modeInfos=0;
    this.modeFiche=0;
    this.modeEntretiens=0;
    this.modeDefinirEnt=0;
    this.modeBonDeTravail=0;
    this.modeListReparation=0;
    this.modeListGarantie=1;
    this.modeExpense=0;
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
      this.bonDeTravails.forEach(async bon=>{
        await this.onHistoireDetaillerFindReparations(bon)
      })
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
    this.modeExpense=0;
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

  // show detail of workorder by his id
  onDetailOfWorkOrder(bonId:number){
    this.modeListReparation=1 
    this.modeExpense=0
    this.bonDeTravailsService.getDetailBonDeTravail(bonId).subscribe((data:BonDeTravail)=>{
      if(data!=null)
        this.onHistoireDetaillerOnList(data)
    })
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

  async onHistoireDetaillerFindReparations(bon:BonDeTravail){ 
    await this.reparationsService.reparationDeBon(bon.id).subscribe((data:Array<Reparation>)=>{
      if(bon.workDones==null) bon.workDones=''
      data.forEach(rep=>{
        if(rep.reparationEffectuer!=null && rep.reparationEffectuer.length>0)
          bon.workDones = bon.workDones +' \r\n ' + rep.reparationEffectuer
      });
    }, err=>{
      console.log(err)
    })
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
    this.modeExpense=0;
  }
  
  // must set: this.varsGlobal.dispatchSee=true to show all trucks
  gotoDetailTransporter(id:number){
    this.router.navigate(['detail-transporter',id], {skipLocationChange:true});
  }
  gotoCamion(id:number){
    this.router.navigate(['camion',id], {skipLocationChange:true});
  }
  saveCamion(){
    this.camionsService.saveCamions(this.camion).subscribe((data:Camion)=>{
      // this.camion=data;
      this.bonDeTravail.odometre=this.camion.odometre
      // here we try attach idCamion for fiche and ficheCont even if they exist already
      this.fiche.idCamion=this.camion.id
      this.ficheCont.idCamion=this.camion.id
      //
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
      this.fichePhysiquesService.saveFichePhysiqueEntretiens(this.fiche).subscribe((data:FichePhysiqueEntretien)=>{
        // this.fiche=data;
        // if(data!=null)
        //   console.log("Existe fiche")
        // else
        //   console.log("pas de fiche")            
      }, err=>{
        console.log(err)
      })
      this.fichePhysiqueContsService.saveFichePhysiqueEntretienConts(this.ficheCont).subscribe((data:FichePhysiqueEntretienCont)=>{
        // this.ficheCont=data;
        // if(data!=null)
        //   console.log("Existe fiche")
        // else
        //   console.log("pas de fiche")            
      }, err=>{
        console.log(err)
      })
      this.entretiens.forEach(obj => {
        // here we try attach idCamion for entretien even if they exist already
        obj.idCamion=this.camion.id
        this.autreEntretiensService.saveAutreEntretiens(obj).subscribe(data=>{
        }, err=>{
          console.log(err)
        })
      });
      alert('Ok')
    //*
    }, err=>{
      console.log(err);
    });//*/
      
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
    // this.router.navigate(['detail-transporter',this.camion.idTransporter], {skipLocationChange:true});
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
    this.addReparation() // add this repa to list repars directly
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
    this.addReparation() // add this repa to list repars directly
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
    this.addReparation() // add this repa to list repars directly
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
    this.addReparation() // add this repa to list repars directly
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
    // this.reparations.push(rep)
    this.reparation.reparationEffectuer= this.camion.message05 //ent05.message
    this.camion.odo5Fait=this.camion.odometre; //to test before dicide
    this.camion.ent5Fait=new Date(); //to test before dicide
    this.couleur05=this.codeCouleur(this.camion.odo5Fait, this.camion.filAntigel); // to test before dicide
    this.addReparation() // add this repa to list repars directly
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
    this.addReparation() // add this repa to list repars directly
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
    // this.reparations.push(rep)
    this.reparation.reparationEffectuer= this.camion.message07 //ent07.message
    this.camion.odo7Fait=this.camion.odometre; //to test before dicide
    this.camion.ent7Fait=new Date(); //to test before dicide
    this.couleur07=this.codeCouleur(this.camion.odo7Fait, this.camion.huileTransmission); // to test before dicide
    // console.log('Entretien 7 - before call addReparation- this.reparations.length: ' + this.reparations.length)
    this.addReparation() // add this repa to list repars directly
    // console.log('Entretien 7 - After call addReparation- this.reparations.length: ' + this.reparations.length)
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
    this.addReparation() // add this repa to list repars directly
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
    if(this.camion.vignetteLog==null) this.camion.vignetteLog=''
    this.camion.vignetteLog = this.camion.vignetteSaaq.getDate() +'-'+(this.camion.vignetteSaaq.getMonth()+1)+'-'+this.camion.vignetteSaaq.getFullYear() + ' \r\n' + this.camion.vignetteLog
    this.addReparation() // add this repa to list repars directly
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
    if(this.camion.inspect6mLog==null) this.camion.inspect6mLog=''
    this.camion.inspect6mLog = this.camion.inspect6m.getDate() +'-'+(this.camion.inspect6m.getMonth()+1)+'-'+this.camion.inspect6m.getFullYear() + ' \r\n' + this.camion.inspect6mLog
    this.addReparation() // add this repa to list repars directly
  }

  millisecondsToDate(entretien:AutreEntretien){
    entretien.dateFait=new Date(entretien.dateFaitMiliseconds)
  }
  dateToMilliseconds(entretien:AutreEntretien){
    // entretien.dateFait = new Date(event.target.value)
    // console.log('getUTCMilliseconds: ' + entretien.dateFait.getUTCMilliseconds())
    console.log('getTime: ' + new Date(entretien.dateFait).getTime() + 
    (new Date().getTimezoneOffset())*60*1000)
    entretien.dateFaitMiliseconds=new Date(entretien.dateFait).getTime() + 
    (new Date().getTimezoneOffset())*60*1000
    // entretien.dateFait.setTime(entretien.dateFaitMiliseconds)
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
    // entretien.dateFait=new Date(); // to test before dicide
    entretien.dateFaitMiliseconds=new Date().getTime(); // to test before dicide
    entretien.dateFait=new Date(entretien.dateFaitMiliseconds); // to test before dicide
    this.addReparation() // add this repa to list repars directly
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
    location.reload(); //location.reload(true);
    //object.reload(forced)
  }
  deleteEntretien(id:number){
    this.autreEntretiensService.deleteAutreEntretien(id).subscribe(data=>{
      this.autreEntretiensService.autreEntretienDeCamion(this.id).subscribe((data:Array<AutreEntretien>)=>{
        this.entretiens=data;
        this.entretiens.forEach(ent=>{ent.dateFait=this.showDateLocal(ent.dateFait)})
      }, err=>{
        console.log(err);
      });
    }, err=>{
      console.log(err);
    });
  }
  addEntretien(){
    if(this.id!=null && this.id>0) this.autreEntretien.idCamion=this.id;
    this.autreEntretiensService.saveAutreEntretiens(this.autreEntretien).subscribe((data:AutreEntretien)=>{
      // alert("Ok, it's added.");
      this.entretiens.push(data)
      // if(this.id==null || this.id==0) this.entretiens.push(data)
      // else this.autreEntretiensService.autreEntretienDeCamion(this.id).subscribe((data:Array<AutreEntretien>)=>{
      //   this.entretiens=data;
      // }, err=>{
      //   console.log(err);
      // });
      this.autreEntretien=new AutreEntretien(); // refresh entretien
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
  
  eFlex:ExpenseFlexible
  addReparation(){
    /*await this.bonDeTravailsService.saveBonDeTravail(this.bonDeTravail).subscribe((data:BonDeTravail)=>{
      this.bonDeTravail=data;
    }, err=>{
      console.log(err)
    })//*/
    this.reparation.odometre=this.camion.odometre
    let rep:Reparation=new Reparation();
    rep=this.reparation
    this.bonDeTravail.sousTotal += this.reparation.prix;
    this.bonDeTravail.tps = new Number((0.05*this.bonDeTravail.sousTotal).toFixed(2)).valueOf()
    this.bonDeTravail.tvq =  new Number((0.09975*this.bonDeTravail.sousTotal).toFixed(2)).valueOf()
    this.bonDeTravail.total=this.bonDeTravail.sousTotal+this.bonDeTravail.tps+this.bonDeTravail.tvq
    // console.log('Before add repar to list - this.reparations.length: ' + this.reparations.length)
    this.reparations.push(rep)
    // console.log('After add repar to list- this.reparations.length: ' + this.reparations.length)
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
    this.bonDeTravail.odometre=this.camion.odometre
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
      
      this.eFlex=new ExpenseFlexible()
      
      this.eFlex.dateDone=this.bonDeTravail.date
      this.eFlex.idOwner=this.camion.id
      this.eFlex.idWorkOrder=this.bonDeTravail.id  
      this.eFlex.fee=this.bonDeTravail.sousTotal
      this.eFlex.odo=this.bonDeTravail.odometre
      this.expenseFlexibleService.saveExpenseFlexible(this.eFlex).subscribe(()=>{},
        err=>{console.log();})
      // console.log("data.id : " + data.id)
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
      this.bonDeTravail=new BonDeTravail();   //data;    
      this.bonDeTravail.odometre=this.camion.odometre  
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
    if(this.bonDeTravail.date!=null){
      // alert('Ok, date is no-empty')
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
        this.bonDeTravail.id=data.id;
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
    else{
      if(this.varsGlobal.language.includes('Francais'))
        alert('Entrez la date, SVP!')
      else alert('Date cannot be empty!')
    }
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
    if(rep.id!=null && rep.id>0 && this.reparations.length<=1){
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

  couleurAutreEntretienWithOdo(entretien:AutreEntretien){
    if(entretien.kmTrage==0 || entretien.kmTrage==null || this.camion.odometre==null)
      return 1;
    if((this.camion.odometre-entretien.odoFait)<(entretien.kmTrage-entretien.kmAvertir))
      return 2;
    if((this.camion.odometre-entretien.odoFait)<entretien.kmTrage)
      return 3;
    if((this.camion.odometre-entretien.odoFait)>=entretien.kmTrage)
      return 4;
  
    return 0;
  }
  couleurAutreEntretienWithDate(entretien:AutreEntretien){
    if(entretien.daysTodo==null)
      return 1;    
    let date = new Date();
    let days = (date.getTime() - entretien.dateFaitMiliseconds)/24/60/60/1000;
    let daysToWarn=(entretien.daysToWarn!=null?entretien.daysToWarn:0)
    if (days<entretien.daysTodo - daysToWarn)
      return 2;
    if (days>=(entretien.daysTodo - daysToWarn) && days<entretien.daysTodo)
      return 3;
    if (days>=entretien.daysTodo)
      return 4;      
    return 0
  }
   
  couleurAutreEntretien(entretien:AutreEntretien){
    //*//
    let returnOfOdo = this.couleurAutreEntretienWithOdo(entretien)
    let returnOfDate = this.couleurAutreEntretienWithDate(entretien)
    let colorNumber = 0
    if(returnOfOdo>=returnOfDate) colorNumber = returnOfOdo
    else colorNumber = returnOfDate
    if(colorNumber==1)
      return "";
    if(colorNumber==2)
      return "btn-success";
    if(colorNumber==3)
      return "btn-warning";
    if(colorNumber==4)
      return "btn-danger";
    //*/
    /*//
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
    //*/
  }

  disableButtonAutreEntretienOfOdo(entretien:AutreEntretien){
    if(entretien.kmTrage==0 || entretien.kmTrage==null || this.camion.odometre==null)
      return true;
    if((this.camion.odometre-entretien.odoFait)<(entretien.kmTrage-entretien.kmAvertir))
      return true;
    return false;
  }
  disableButtonAutreEntretienOfDate(entretien:AutreEntretien){
    let daysToWarn=(entretien.daysToWarn!=null?entretien.daysToWarn:0)
    if(entretien.daysTodo==null)
      return true;    
    let date = new Date();
    let days = (date.getTime() - entretien.dateFaitMiliseconds)/24/60/60/1000;
    if (days<(entretien.daysTodo-daysToWarn))
      return true;
    if (days>=(entretien.daysTodo-daysToWarn) && days<entretien.daysTodo)
      return false;
    if (days>=entretien.daysTodo)
      return false;      
  }

  disableButtonAutreEntretien(entretien:AutreEntretien){
    return (this.disableButtonAutreEntretienOfOdo(entretien) && this.disableButtonAutreEntretienOfDate(entretien))
    /*//
    if(entretien.kmTrage==0 || entretien.kmTrage==null || this.camion.odometre==null)
      return true;
    if((this.camion.odometre-entretien.odoFait)<(entretien.kmTrage-entretien.kmAvertir))
      return true;
    return false;
    //*/
  }

  controlKmTrage(entretien:AutreEntretien){
    if(entretien.kmTrage==null || entretien.kmTrage==0 || entretien.kmAvertir>entretien.kmTrage){
      entretien.kmAvertir=entretien.kmTrage
    }
    if(entretien.kmTrage<=0){
      entretien.kmAvertir=entretien.kmTrage = null
    }
  }
  controlKmAvertir(entretien:AutreEntretien){
    if(entretien.kmTrage==null || entretien.kmTrage==0){
      entretien.kmAvertir=entretien.kmTrage
    }
    if(entretien.kmAvertir<=0){
      entretien.kmAvertir= null
    }
    else{
      if(entretien.kmAvertir>entretien.kmTrage){
        entretien.kmAvertir=entretien.kmTrage
      }
    }
  }
  controlDaysTodo(entretien:AutreEntretien){
    if(entretien.daysTodo==null || entretien.daysTodo==0 || entretien.daysToWarn>entretien.daysTodo){
      entretien.daysToWarn=entretien.daysTodo
    }
    if(entretien.daysTodo<=0){
      entretien.daysToWarn=entretien.daysTodo = null
    }
  }
  controlDaysToWarn(entretien:AutreEntretien){
    if(entretien.daysTodo==null || entretien.daysTodo==0){
      entretien.daysToWarn=entretien.daysTodo
    }
    if(entretien.daysToWarn<=0){
      entretien.daysToWarn= null
    }
    else{
      if(entretien.daysToWarn>entretien.daysTodo){
        entretien.daysToWarn=entretien.daysTodo
      }
    }
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

  // 1 gallon = 4.54609 liters
  l100kmToMpg(){
    // let litertoKm = 100/this.camion.l100km
    // this.camion.mpg = Math.round(litertoKm*4.54609*100)/100
  }
  mpgTol100km(){
    // let litertoKm = this.camion.mpg/4.54609
    // this.camion.l100km = Math.round(litertoKm*100*100)/100
  }

  statisExpense = true;
  fuelExpense = false;
  fixedExpense = false;
  flexibleExpense = false;
  // declare to find month actual and year actual
  monthActual= new Date().getMonth()
  yearActual= new Date().getFullYear()
  fuelsMonthActual:Array<Fuel>=[]
  fuelsYearActual:Array<Fuel>=[]
  priceFuelMonthActual
  priceFuelYearActual
  feeKmFuelMonthActual
  feeKmFuelYearActual

  expenseFixYearActual=0;
  expenseFlexibleYearActual=0;
  expenseFixMonthActual=0;
  expenseFlexibleMonthActual=0;
  expenseEveryDay=0;
  // expenseFlexibleTodayActual=0;
  //
  onStatis(){
    this.priceFuelMonthActual=0
    this.priceFuelYearActual=0
    this.feeKmFuelMonthActual=0
    this.feeKmFuelYearActual=0

    this.expenseFixYearActual=0;
    this.expenseFlexibleYearActual=0;
    this.expenseFixMonthActual=0;
    this.expenseFlexibleMonthActual=0;
    
    this.statisExpense = true;
    this.fuelExpense = false;
    this.fixedExpense = false;
    this.flexibleExpense = false;    

    let time0Month=0 // to count time feekm==0 or null per month
    let time0Year=0 // to count time feekm==0 or null per year
    
    this.fuelService.fuelOfOwner(this.camion.id).subscribe((data:Array<Fuel>)=>{
      if(data!=null && data.length>0){
        let d=new Date()
        let timeZone = d.getTimezoneOffset()
        data.forEach(dt=>{
          // console.log('Before:' +dt.dateDone)
          dt.dateDone = new Date(new Date(dt.dateDone).getTime()+timeZone*60*1000)
          if(dt.dateDone.getFullYear()-this.yearActual==0){
            this.fuelsYearActual.push(dt)
            //if(this.monthActual-dt.dateDone.getMonth()<=1)
            //(1000*60*60*24*31)) miliseconds equal 31 days
            if(new Date().getTime()-dt.dateDone.getTime()<=(1000*60*60*24*31))
              this.fuelsMonthActual.push(dt)
          }
          // console.log('after:' +dt.dateDone)
        })
        // console.log('fuelsYearActual: '+this.fuelsYearActual.length)
        // console.log('fuelsMonthActual: '+this.fuelsMonthActual.length)
        if(this.fuelsYearActual.length>0){
          this.priceFuelYearActual=0
          this.feeKmFuelYearActual=0
          this.fuelsYearActual.forEach(dt=>{
            // console.log('priceFuelYearActual in boucle : '+this.priceFuelYearActual)
            this.priceFuelYearActual = this.priceFuelYearActual + dt.price
            if(dt.feeKm==null || dt.feeKm ==0) time0Year +=1
            else this.feeKmFuelYearActual = this.feeKmFuelYearActual + dt.feeKm
          })
          this.priceFuelYearActual=Math.round(this.priceFuelYearActual/this.fuelsYearActual.length*100) /100
          this.feeKmFuelYearActual=Math.round(this.feeKmFuelYearActual/(this.fuelsYearActual.length-time0Year)*100) /100
        }
        if(this.fuelsMonthActual.length>0){
          this.priceFuelMonthActual=0
          this.feeKmFuelMonthActual=0
          this.fuelsMonthActual.forEach(dt=>{
            this.priceFuelMonthActual = this.priceFuelMonthActual + dt.price
            if(dt.feeKm==null || dt.feeKm ==0) time0Month +=1
            else this.feeKmFuelMonthActual = this.feeKmFuelMonthActual + dt.feeKm
          })
          this.priceFuelMonthActual=Math.round(this.priceFuelMonthActual/this.fuelsMonthActual.length*100) /100
          this.feeKmFuelMonthActual=Math.round(this.feeKmFuelMonthActual/(this.fuelsMonthActual.length-time0Month)*100) /100
        }
        // console.log('priceFuelYearActual: '+this.priceFuelYearActual)
        // console.log('priceFuelMonthActual: '+this.priceFuelMonthActual)
        // console.log('fuelsYearActual: '+this.fuelsYearActual.length)
        // console.log('fuelsMonthActual: '+this.fuelsMonthActual.length)
        // if(this.fuelsYearActual.length>0){
        //   this.feeKmFuelYearActual=0
        //   this.fuelsYearActual.forEach(dt=>{
        //     console.log('feeKmFuelYearActual in boucle : '+this.feeKmFuelYearActual)
        //     this.feeKmFuelYearActual = this.feeKmFuelYearActual + dt.feeKm
        //   })
        //   this.feeKmFuelYearActual=Math.round(this.feeKmFuelYearActual/this.fuelsYearActual.length*100) /100
        // }
        // if(this.fuelsMonthActual.length>0){
        //   this.feeKmFuelMonthActual=0
        //   this.fuelsMonthActual.forEach(dt=>{
        //     this.feeKmFuelMonthActual = this.feeKmFuelMonthActual + dt.feeKm
        //   })
        //   this.feeKmFuelMonthActual=Math.round(this.feeKmFuelMonthActual/this.fuelsMonthActual.length*100) /100
        // }
        // console.log('feeKmFuelYearActual: '+this.feeKmFuelYearActual)
        // console.log('feeKmFuelMonthActual: '+this.feeKmFuelMonthActual)
        this.fuels = data
        this.fuels.sort((b,a)=>{
          let res = new Date(a.dateDone).getTime() - new Date(b.dateDone).getTime()
          if(res==0) res = a.id - b.id
          return res
        })
        console.log('this.fuels[0].feeKm: ' + this.fuels[0].feeKm)
        if(this.fuels[0]!=null && this.fuels[0].feeKm!=null) this.feeFuelPerKmActuel = this.fuels[0].feeKm
        console.log('this.feeFuelPerKmActuel: ' + this.feeFuelPerKmActuel)
        this.dateLastFuel = new Date(this.fuels[0].dateDone)
        this.feeFuelPerKmActuel = this.fuels[0].price
      }      
    }, err=>{console.log(err)})
    
    // calculate expense fix
    this.expenseFixedService.expenseFixedOfOwner(this.camion.id).subscribe((data:Array<ExpenseFixed>)=>{
      if(data!=null && data.length>0){
        this.expenseFixeds = data
        // we need : months or year/12
        this.expenseFixeds.forEach(dt=>{
          if(dt.archived==null || !dt.archived){
            if(dt.perYear!=null&&dt.perYear>0) this.expenseFixYearActual+=dt.perYear
            if(dt.perMonth!=null&&dt.perMonth>0) this.expenseFixYearActual+=(dt.perMonth*12)
          }
        })
        this.expenseFixMonthActual=Math.round((this.expenseFixYearActual/12)*100) /100
      }
      // calculate expense flexible
      this.expenseFlexibleService.expenseFlexibleOfOwner(this.camion.id).subscribe((data:Array<ExpenseFlexible>)=>{
        if(data!=null && data.length>0){
          this.expenseFlexibles = data
          // we need date_done
          let d=new Date()
          let timeZone = d.getTimezoneOffset()
          data.forEach(dt=>{
            // console.log('Before:' +dt.dateDone)
            dt.dateDone = new Date(new Date(dt.dateDone).getTime()+timeZone*60*1000)
            if(dt.dateDone.getFullYear()-this.yearActual==0){
              this.expenseFlexibleYearActual+=dt.fee
            }
            if(new Date().getTime()-dt.dateDone.getTime()<=(1000*60*60*24*31)){
              this.expenseFlexibleMonthActual+=dt.fee
            }
          })
        }
        this.expenseEveryDay = Math.round(100*(this.expenseFixYearActual+this.expenseFlexibleYearActual)/365) /100
      }, err=>{console.log(err)})
    }, err=>{console.log(err)})

    // // calculate expense flexible
    // this.expenseFlexibleService.expenseFlexibleOfOwner(this.camion.id).subscribe((data:Array<ExpenseFlexible>)=>{
    //   if(data!=null && data.length>0){
    //     this.expenseFlexibles = data
    //     // we need date_done
    //     let d=new Date()
    //     let timeZone = d.getTimezoneOffset()
    //     data.forEach(dt=>{
    //       // console.log('Before:' +dt.dateDone)
    //       dt.dateDone = new Date(new Date(dt.dateDone).getTime()+timeZone*60*1000)
    //       if(dt.dateDone.getFullYear()-this.yearActual==0){
    //         this.expenseFlexibleYearActual+=dt.fee
    //       }
    //       if(new Date().getTime()-dt.dateDone.getTime()<=(1000*60*60*24*31)){
    //         this.expenseFlexibleMonthActual+=dt.fee
    //       }
    //     })
    //   }
    // }, err=>{console.log(err)})      

  }

  onFuelExpense(){
    this.statisExpense = false;
    this.fuelExpense = true;
    this.fixedExpense = false;
    this.flexibleExpense = false;     
    
    this.fuelService.fuelOfOwner(this.camion.id).subscribe((data:Array<Fuel>)=>{
      let d=new Date()
      let timeZone = d.getTimezoneOffset()
      data.forEach(dt=>{
        // console.log('Before:' +dt.dateDone)
        dt.dateDone = new Date(new Date(dt.dateDone).getTime()+timeZone*60*1000)
        // console.log('after:' +dt.dateDone)
      })
      this.fuels = data
      this.fuels.sort((b,a)=>{
         let res = new Date(a.dateDone).getTime() - new Date(b.dateDone).getTime()
         if(res==0) res = a.id - b.id
         return res
      })
    }, err=>{console.log(err)})
    
  }

  onFixedExpense(){
    this.statisExpense = false;
    this.fuelExpense = false;
    this.fixedExpense = true;    
    this.flexibleExpense = false;
    // let timeZone = new Date().getTimezoneOffset()*60000 
    this.expenseFixedService.expenseFixedOfOwner(this.camion.id).subscribe((data:Array<ExpenseFixed>)=>{
      this.expenseFixeds = data
      this.expenseFixeds.sort((b,a)=>{
        if(a.archived==null) a.archived=false
        if(b.archived==null) b.archived=false
        let res = Number(b.archived) - Number(a.archived)
        if(res==0) res = a.id - b.id
        return res
      })
      // .sort((b,a)=>{
      //    return a.id - b.id
      // })
    }, err=>{console.log(err)})
  }
  onFlexibleExpense(){
    this.statisExpense = false;
    this.fuelExpense = false;
    this.fixedExpense = false;
    this.flexibleExpense = true;
    this.expenseFlexibleService.expenseFlexibleOfOwner(this.camion.id).subscribe((data:Array<ExpenseFlexible>)=>{
      let d=new Date()
      let timeZone = d.getTimezoneOffset()
      data.forEach(dt=>{
        // console.log('Before:' +dt.dateDone)
        dt.dateDone = new Date(new Date(dt.dateDone).getTime()+timeZone*60*1000)
        // console.log('after:' +dt.dateDone)
      })
      this.expenseFlexibles = data
      this.expenseFlexibles.sort((b,a)=>{
         let res = new Date(a.dateDone).getTime() - new Date(b.dateDone).getTime()
         if(res==0) res = a.id - b.id
         return res
      })
    }, err=>{console.log(err)})      
  }

  feeFuelPerKmActuel:number;
  dateLastFuel:Date;
  addFuel:Fuel=new Fuel();
  fuels:Array<Fuel>=[]
  onAddFuel(){
    this.addFuel.idOwner = this.camion.id
    this.fuelService.saveFuel(this.addFuel).subscribe((data:Fuel)=>{
      this.addFuel.id=data.id
      this.fuels.push(this.addFuel)
      this.fuels.sort((b,a)=>{
        // return a.dateDone.getTime() -b.dateDone.getTime()
        return new Date(a.dateDone).getTime() - new Date(b.dateDone).getTime()
      })
      this.feeFuelPerKmActuel = this.fuels[0].feeKm
      this.dateLastFuel = new Date(this.fuels[0].dateDone)
      this.addFuel=new Fuel()
    }, err=>{
      alert('Cannot save this fuel, please check your system')
      console.log(err)
    })    
  }
  onDelFuel(fuel:Fuel){
    this.fuelService.deleteFuel(fuel.id).subscribe(()=>{
      this.fuels.splice(this.fuels.indexOf(fuel), 1)
    }, err=>{
      alert("Cannot delete this fuel, please check your system")
      console.log(err)
    })
  }
  onChangeLiters(){   
    if(this.camion.l100km!=null && this.camion.l100km>0) {
      // first calculate how many km per liter
      let kmsPerLit = 100 / this.camion.l100km
      this.addFuel.rangeKms = Math.round(this.addFuel.liters * kmsPerLit *100) / 100
      this.addFuel.feeKm = Math.round((this.addFuel.fee / this.addFuel.rangeKms)*100)/100
    }
    if(this.addFuel.fee!=null&&this.addFuel.fee>0&&this.addFuel.liters!=null&&this.addFuel.liters>0){
      // calculate $/l
      this.addFuel.price = Math.round((this.addFuel.fee / this.addFuel.liters)*100)/100
      this.addFuel.rangeKms = Math.round((this.addFuel.liters * (100/this.camion.l100km))*100)/100
    }
        
  }
  
  onChangeFee(){
    if(this.addFuel.fee!=null&&this.addFuel.fee>0&&this.addFuel.liters!=null&&this.addFuel.liters>0){
      // calculate $/l
      this.addFuel.price = Math.round((this.addFuel.fee / this.addFuel.liters)*100)/100
      if(this.addFuel.rangeKms!=null && this.addFuel.rangeKms>0)
        this.addFuel.feeKm = Math.round((this.addFuel.fee / this.addFuel.rangeKms)*100)/100
    }        
  }

  onChangeRangeKms(){
    if(this.addFuel.rangeKms!=null && this.addFuel.rangeKms>0)
        this.addFuel.feeKm = Math.round((this.addFuel.fee / this.addFuel.rangeKms)*100)/100
  }
  // start expensefixed
  addExpenseFixed:ExpenseFixed=new ExpenseFixed();
  expenseFixeds:Array<ExpenseFixed>=[]
  onAddExpenseFixed(){
    this.addExpenseFixed.idOwner = this.camion.id
    let timeZone = new Date().getTimezoneOffset()*60000
    let temp=this.addExpenseFixed
    this.expenseFixedService.saveExpenseFixed(this.addExpenseFixed).subscribe((data:ExpenseFixed)=>{
      temp.id=data.id
      // temp.dateSince=new Date(new Date(temp.dateSince).getTime()+timeZone)
      // temp.dateUntil=new Date(new Date(temp.dateUntil).getTime()+timeZone)
      this.expenseFixeds.push(temp)
      this.expenseFixeds.sort((b,a)=>{
        if(a.archived==null) a.archived=false
        if(b.archived==null) b.archived=false
        let res = Number(b.archived) - Number(a.archived)
        if(res==0) res = a.id - b.id
        return res
      })
      this.addExpenseFixed=new ExpenseFixed()
    }, err=>{
      alert('Cannot save this expense, please check your system')
      console.log(err)
    })    
  }
  onDelExpenseFixed(expenseFixed:ExpenseFixed){
    this.expenseFixedService.deleteExpenseFixed(expenseFixed.id).subscribe(()=>{
      this.expenseFixeds.splice(this.expenseFixeds.indexOf(expenseFixed), 1)
    }, err=>{
      alert("Cannot delete this expense, please check your system")
      console.log(err)
    })
  }
  onArchiveExpenseFix(expenseFixed:ExpenseFixed){
    expenseFixed.archived=true;
    this.expenseFixedService.saveExpenseFixed(expenseFixed).subscribe((data:ExpenseFixed)=>{
      this.onFixedExpense()
    }, err=>{
      alert("Cannot save this expense, please check your system")
      console.log(err)
    })
  }
  // end expensefixed

   // start expenseflexible
   addExpenseFlexible:ExpenseFlexible=new ExpenseFlexible();
   expenseFlexibles:Array<ExpenseFlexible>=[]
   onAddExpenseFlexibe(){
     this.addExpenseFlexible.idOwner = this.camion.id
     this.expenseFlexibleService.saveExpenseFlexible(this.addExpenseFlexible).subscribe((data:ExpenseFlexible)=>{
      let tempExFlex = this.addExpenseFlexible
      tempExFlex.id = data.id
       this.expenseFlexibles.push(tempExFlex)
       this.addExpenseFlexible=new ExpenseFlexible()
     }, err=>{
       alert('Cannot save this expense, please check your system')
       console.log(err)
     })    
   }
 
   onDelExpenseFlexible(expenseFlexible:ExpenseFlexible){
     this.expenseFlexibleService.deleteExpenseFlexible(expenseFlexible.id).subscribe(()=>{
       this.expenseFlexibles.splice(this.expenseFlexibles.indexOf(expenseFlexible), 1)
     }, err=>{
       alert("Cannot delete this expense, please check your system")
       console.log(err)
     })
   }
   // end expenseflexible
  
  histVignette(camion:Camion){
    let newLine = "\r\n"
    // let msAlert="Historique VignetteSAAQ: " //+camion.unite
    let msAlert="License 1 Year"
    if(this.varsGlobal.language.includes('Francais'))
      msAlert="VignetteSAAQ " +newLine+"(dd-mm-yyyy)"
    msAlert +=newLine
    if(camion.vignetteLog==null) camion.vignetteLog=''
    msAlert +=camion.vignetteLog
    // msAlert +=newLine
    // msAlert +=camion.vignetteSaaq
    alert(msAlert);
  }

  histInspec6m(camion:Camion){
    let newLine = "\r\n"
    // let msAlert="Historique Inspect 6 Mois: " //+camion.unite
    let msAlert="Inspect 6 Months"
    if(this.varsGlobal.language.includes('Francais'))
      msAlert="Inspect 6 Mois " +newLine+"(dd-mm-yyyy)"
    msAlert +=newLine
    if(camion.inspect6mLog==null) camion.inspect6mLog=''
    msAlert +=camion.inspect6mLog
    // msAlert +=newLine
    // msAlert +=camion.inspect6m
    alert(msAlert);
  }
}
