import { Component, OnInit } from '@angular/core';
import { Camion } from 'src/model/model.camion';
import { ActivatedRoute, Router } from '@angular/router';
import { CamionsService } from 'src/services/camions.service';
import { FichePhysiqueEntretien } from 'src/model/model.fichePhysiqueEntretien';
import { FichePhysiqueEntretienCont } from 'src/model/model.fichePhysiqueEntretienCont';
import { FichePhysiquesService } from 'src/services/fichePhysiques.service';
import { FichePhysiqueContsService } from 'src/services/fichePhysiqueConts.service';

@Component({
  selector: 'app-camion',
  templateUrl: './camion.component.html',
  styleUrls: ['./camion.component.css']
})
export class CamionComponent implements OnInit {

  camion:Camion=new Camion();
  id:number;
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

  // fichePhysiqueEntretien:FichePhysiqueEntretien= new FichePhysiqueEntretien();
  // fichePhysiqueEntretienCont:FichePhysiqueEntretienCont = new FichePhysiqueEntretienCont();

  constructor(public activatedRoute:ActivatedRoute, public camionsService:CamionsService, public fichePhysiquesService:FichePhysiquesService,
  public fichePhysiqueContsService:FichePhysiqueContsService, private router:Router){    
    this.id=activatedRoute.snapshot.params['id'];
  }

  async ngOnInit() {
    await this.camionsService.getDetailCamion(this.id).subscribe((data:Camion)=>{
      this.camion=data;
      //this.mode=1;
      /* this.fichePhysiqueEntretien.idCamion=this.camion.id;
      this.fichePhysiqueEntretienCont.idCamion=this.camion.id;
      this.fichePhysiqueEntretien.numeroUnite=this.camion.unite;
      this.fichePhysiqueEntretien.marque=this.camion.marque;
      this.fichePhysiqueEntretien.modele=this.camion.modele;
      this.fichePhysiqueEntretien.annee=this.camion.annee;
      this.fichePhysiqueEntretien.km=this.camion.odometre;

      this.fichePhysiquesService.saveFichePhysiqueEntretiens(this.fichePhysiqueEntretien).subscribe(data=>{ });
      this.fichePhysiqueContsService.saveFichePhysiqueEntretienConts(this.fichePhysiqueEntretienCont).subscribe(data=>{ }); */
      //* 
      //console.log('differene in : '+ (this.camion.odometre - this.camion.odo1Fait));
      this.couleur01=this.codeCouleur(this.camion.odo1Fait, 25000)
      this.couleur02=this.codeCouleur(this.camion.odo2Fait, 50000)
      this.couleur03=this.codeCouleur(this.camion.odo3Fait, 100000)
      this.couleur04=this.codeCouleur(this.camion.odo4Fait, this.camion.filHydrolique)
      this.couleur05=this.codeCouleur(this.camion.odo5Fait, this.camion.filAntigel)
      this.couleur06=this.codeCouleur(this.camion.odo6Fait, this.camion.huileAntigel)
      this.couleur07=this.codeCouleur(this.camion.odo7Fait, this.camion.huileTransmission)
      this.couleur08=this.codeCouleur(this.camion.odo8Fait, this.camion.huileDifferentiel)
      this.couleur09=this.codeCouleurInspect();
      console.log('in : '+this.couleur01+' ' + this.couleur02+' '+ this.couleur03+' '+this.couleur04+' '
      +this.couleur05+' '+this.couleur06+' '+this.couleur07+' '+ this.couleur08+' '+ this.couleur09) 
    //*/
    }, err=>{
      console.log(err);
    });
    /*
    this.couleur01=this.codeCouleur(this.camion.odometre, this.camion.odo1Fait);
    this.couleur02=this.codeCouleur(this.camion.odometre, this.camion.odo2Fait);
    this.couleur03=this.codeCouleur(this.camion.odometre, this.camion.odo3Fait);
    this.couleur04=this.codeCouleur(this.camion.odometre, this.camion.odo4Fait);
    this.couleur05=this.codeCouleur(this.camion.odometre, this.camion.odo5Fait);
    this.couleur06=this.codeCouleur(this.camion.odometre, this.camion.odo6Fait);
    this.couleur07=this.codeCouleur(this.camion.odometre, this.camion.odo7Fait);//*
    //this.couleur08=this.codeCouleur(this.couleur08, this.camion.odo8Fait);
    //*
    console.log('out : '+this.couleur01 + this.couleur02+ this.couleur03+this.couleur04+this.couleur06+this.couleur05+this.couleur07+' test here: '
    +this.codeCouleur(this.couleur08, this.camion.odo8Fait, this.camion.huileDifferentiel))
    console.log('differene out : '+ this.camion.odometre+' - '+this.camion.odo1Fait)
    //*/
  }

  gotoDetailTransporter(id:number){
    this.router.navigate(['detail-transporter',id]);
  }
  gotoCamion(id:number){
    this.router.navigate(['camion',id]);
  }
  saveCamion(){
    this.camionsService.saveCamions(this.camion).subscribe(data=>{
      //this.mode=2;
      this.couleur01=this.codeCouleur(this.camion.odo1Fait, 25000)
      this.couleur02=this.codeCouleur(this.camion.odo2Fait, 50000)
      this.couleur03=this.codeCouleur(this.camion.odo3Fait, 100000)
      this.couleur04=this.codeCouleur(this.camion.odo4Fait, this.camion.filHydrolique)
      this.couleur05=this.codeCouleur(this.camion.odo5Fait, this.camion.filAntigel)
      this.couleur06=this.codeCouleur(this.camion.odo6Fait, this.camion.huileAntigel)
      this.couleur07=this.codeCouleur(this.camion.odo7Fait, this.camion.huileTransmission)
      this.couleur08=this.codeCouleur(this.camion.odo8Fait, this.camion.huileDifferentiel)
      this.couleur09=this.codeCouleurInspect();
    }, err=>{
      console.log(err);
    });
    //this.gotoDetailTransporter(this.camion.idTransporter);
  }
  //*
  codeCouleur(odoFait:number, odoAFaire:number){
    if((this.camion.odometre-odoFait)<(odoAFaire-5000))
      return "btn-success";
    if((this.camion.odometre-odoFait)<odoAFaire)
      return "btn-warning";
    if((this.camion.odometre-odoFait)>=odoAFaire)
      return "btn-danger";
    
      return "nothing";
  }
  //*/
  codeCouleurInspect(){
    /*
    Date date =Date.from(Instant.now());
        if(((date.getTime()-entretien.getInspect01().getTime())/24/60/60/1000)>=152)
            sb.append(MessagesConstants.inspec1).append(sdf.format(entretien.getInspect01())).append("<br>");
    //*/        
    let date = new Date();
    let days = (date.getTime() - new Date( this.camion.inspect6m).getTime())/24/60/60/1000;
    console.log("Nombre jours apres l'inspection : "+days)
    if (days<152)
      return "btn-success";
    if (days>=152)
      return "btn-warning";
    if (days>=182)
      return "btn-success";      
    return "nothing"
  }
  
  onPress(){
    this.router.navigateByUrl("/map");
  }

  async onEntretien01(){
    this.camion.odo1Fait=this.camion.odometre;
    this.camion.ent1Fait=new Date();
    //this.saveCamion();
    await this.camionsService.saveCamions(this.camion).subscribe(data=>{
      //console.log("Entretien01 est fait.")
      //this.refresh();
      this.couleur01=this.codeCouleur(this.camion.odo1Fait, 25000);
      //this.gotoDetailTransporter(this.camion.idTransporter);
    }, err=>{
      console.log(err);
    });
    //console.log("onEntretien01")
    //this.router.navigate(['camion',this.camion.id]);
  }
  
  onEntretien02(){
    this.camion.odo2Fait=this.camion.odometre;
    this.camion.ent2Fait=new Date();
    this.camionsService.saveCamions(this.camion).subscribe(data=>{
      //this.refresh();
      //this.gotoDetailTransporter(this.camion.idTransporter);
      this.couleur02=this.codeCouleur(this.camion.odo2Fait, 50000);
    }, err=>{
      console.log(err);
    });
  }

  onEntretien03(){
    this.camion.odo3Fait=this.camion.odometre;
    this.camion.ent3Fait=new Date();
    this.camionsService.saveCamions(this.camion).subscribe(data=>{
      //this.gotoDetailTransporter(this.camion.idTransporter);//this.refresh();
      this.couleur03=this.codeCouleur(this.camion.odo3Fait, 100000)
    }, err=>{
      console.log(err);
    });
  }

  onEntretien04(){
    this.camion.odo4Fait=this.camion.odometre;
    this.camion.ent4Fait=new Date();
    this.camionsService.saveCamions(this.camion).subscribe(data=>{      
      this.couleur04=this.codeCouleur(this.camion.odo4Fait, this.camion.filHydrolique)
    }, err=>{
      console.log(err);
    });
  }
  
  onEntretien05(){
    this.camion.odo5Fait=this.camion.odometre;
    this.camion.ent5Fait=new Date();
    this.camionsService.saveCamions(this.camion).subscribe(data=>{
      this.couleur05=this.codeCouleur(this.camion.odo5Fait, this.camion.filAntigel)
    }, err=>{
      console.log(err);
    });
  }

  onEntretien06(){
    this.camion.odo6Fait=this.camion.odometre;
    this.camion.ent6Fait=new Date();
    this.camionsService.saveCamions(this.camion).subscribe(data=>{
      this.couleur06=this.codeCouleur(this.camion.odo6Fait, this.camion.huileAntigel)
    }, err=>{
      console.log(err);
    });
  }

  onEntretien07(){
    this.camion.odo7Fait=this.camion.odometre;
    this.camion.ent7Fait=new Date();
    this.camionsService.saveCamions(this.camion).subscribe(data=>{
      this.couleur07=this.codeCouleur(this.camion.odo7Fait, this.camion.huileTransmission)
    }, err=>{
      console.log(err);
    });
  }

  onEntretien08(){
    this.camion.odo8Fait=this.camion.odometre;
    this.camion.ent8Fait=new Date();
    this.camionsService.saveCamions(this.camion).subscribe(data=>{
      this.couleur08=this.codeCouleur(this.camion.odo8Fait, this.camion.huileDifferentiel)
    }, err=>{
      console.log(err);
    });
  }

  onInspect6(){
    //this.camion.odo8Fait=this.camion.odometre;
    this.camion.inspect6m=new Date();
    this.camionsService.saveCamions(this.camion).subscribe(data=>{
      this.couleur09=this.codeCouleurInspect();
    }, err=>{
      console.log(err);
    });
  }
  refresh(): void {
    //window.location.reload();
    location.reload(true);
    //object.reload(forced)
  }
}
