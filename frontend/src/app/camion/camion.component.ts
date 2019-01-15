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

  modeInfos:number=0;
  modeFiche:number=0;
  modeEntretiens:number=0;

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
    this.modeInfos=1;
    this.modeFiche=0;
    this.modeEntretiens=0;
    await this.camionsService.getDetailCamion(this.id).subscribe((data:Camion)=>{
      this.camion=data;
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
  }
  onInfos(){
    this.modeInfos=1;
    this.modeFiche=0;
    this.modeEntretiens=0;
  }
  onFiche(){
    this.modeInfos=0;
    this.modeFiche=1;
    this.modeEntretiens=0;
  }
  onEntretiens(){
    this.modeInfos=0;
    this.modeFiche=0;
    this.modeEntretiens=1;
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
    if(odoAFaire==0 || odoAFaire==null || this.camion.odometre==null)
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
  codeCouleurInspect(){
    if(this.camion.inspect6m==null)
      return '';    
    let date = new Date();
    let days = (date.getTime() - new Date( this.camion.inspect6m).getTime())/24/60/60/1000;
    console.log("Nombre jours apres l'inspection : "+days)
    if (days<152)
      return "btn-success";
    if (days>=152)
      return "btn-warning";
    if (days>=182)
      return "btn-danger";      
    return ""
  }
  codeText(odoFait:number, odoAFaire:number){
    //console.log("I am called. And odoAFait : " + odoAFaire)
    if(odoAFaire==0 || odoAFaire==null || this.camion.odometre==null)
      return 'pas data';
    if((this.camion.odometre-odoFait)<(odoAFaire-5000))
      return "bon etat";
    if((this.camion.odometre-odoFait)<odoAFaire)
      return "warning";
    if((this.camion.odometre-odoFait)>=odoAFaire)
      return "danger";
    return "";
  }
  codeTextInspect(){
    if(this.camion.inspect6m==null)
    {
      return 'pas data';
    }
    let date = new Date();
    let days = (date.getTime() - new Date(this.camion.inspect6m).getTime())/24/60/60/1000;
    if (days<152)
      return "bon etat";
    if (days>=152)
      return "warning";
    if (days>=182)
      return "danger";      
    return ""
  }

  disableButton(odoFait:number, odoAFaire:number) : boolean{
    if(odoAFaire==0 || odoAFaire==null || this.camion.odometre==null)
      return true;
    if((this.camion.odometre-odoFait)<(odoAFaire-5000))
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
    alert("Entretien 1 - Changement huile moteur, filtre moteur, graissage, ajustement des freins");
    this.camion.odo1Fait=this.camion.odometre;
    this.camion.ent1Fait=new Date();
    this.camionsService.saveCamions(this.camion).subscribe(data=>{
      this.couleur01=this.codeCouleur(this.camion.odo1Fait, 25000);
    }, err=>{
      console.log(err);
    });
  }
  
  onEntretien02(){
    alert("Entretien 2 - Changement filtre a l'air, filtre a fuel");
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
    alert("Entretien 3 - Changement filtre a polene");
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
    alert("Entretien 4 - Changement filtre hydrolique");
    this.camion.odo4Fait=this.camion.odometre;
    this.camion.ent4Fait=new Date();
    this.camionsService.saveCamions(this.camion).subscribe(data=>{      
      this.couleur04=this.codeCouleur(this.camion.odo4Fait, this.camion.filHydrolique)
    }, err=>{
      console.log(err);
    });
  }
  
  onEntretien05(){
    alert("Entretien 5 - Changement filtre antigel");
    this.camion.odo5Fait=this.camion.odometre;
    this.camion.ent5Fait=new Date();
    this.camionsService.saveCamions(this.camion).subscribe(data=>{
      this.couleur05=this.codeCouleur(this.camion.odo5Fait, this.camion.filAntigel)
    }, err=>{
      console.log(err);
    });
  }

  onEntretien06(){
    alert("Entretien 6 - Changement huile antigel");
    this.camion.odo6Fait=this.camion.odometre;
    this.camion.ent6Fait=new Date();
    this.camionsService.saveCamions(this.camion).subscribe(data=>{
      this.couleur06=this.codeCouleur(this.camion.odo6Fait, this.camion.huileAntigel)
    }, err=>{
      console.log(err);
    });
  }

  onEntretien07(){
    alert("Entretien 7 - Changement huile transmission");
    this.camion.odo7Fait=this.camion.odometre;
    this.camion.ent7Fait=new Date();
    this.camionsService.saveCamions(this.camion).subscribe(data=>{
      this.couleur07=this.codeCouleur(this.camion.odo7Fait, this.camion.huileTransmission)
    }, err=>{
      console.log(err);
    });
  }

  onEntretien08(){
    alert("Entretien 8 - Changement huile differentiel");
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
  onPress(){
    this.router.navigateByUrl("/map");
  }
  refresh(): void {
    //window.location.reload();
    location.reload(true);
    //object.reload(forced)
  }
}
