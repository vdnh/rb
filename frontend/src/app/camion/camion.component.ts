import { Component, OnInit } from '@angular/core';
import { Camion } from 'src/model/model.camion';
import { ActivatedRoute, Router } from '@angular/router';
import { CamionsService } from 'src/services/camions.service';

@Component({
  selector: 'app-camion',
  templateUrl: './camion.component.html',
  styleUrls: ['./camion.component.css']
})
export class CamionComponent implements OnInit {

  camion:Camion=new Camion();
  id:number;
  mode:number=1;
  couleur01:string="btn-danger";
  couleur02:string="btn-warning";
  couleur03:string="btn-success";
  couleur04:string="btn-success";
  couleur05:string="btn-success";
  couleur06:string="btn-warning";
  couleur07:string="btn-success";
  couleur08:string="btn-warning";
  couleur09:string="btn-success";

  constructor(public activatedRoute:ActivatedRoute, public camionsService:CamionsService, private router:Router){    
    this.id=activatedRoute.snapshot.params['id'];
  }

  ngOnInit() {
    this.camionsService.getDetailCamion(this.id).subscribe((data:Camion)=>{
      this.camion=data;
      this.mode=1;
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
    this.couleur07=this.codeCouleur(this.camion.odometre, this.camion.odo7Fait);
    this.couleur08=this.codeCouleur(this.camion.odometre, this.camion.odo8Fait);

    console.log(this.couleur01 + this.couleur02+ this.couleur03+this.couleur04+this.couleur06+this.couleur05+this.couleur07+this.couleur08)
    //*/
  }

  gotoDetailTransporter(id:number){
    this.router.navigate(['detail-transporter',id]);
  }

  saveCamion(){
    this.camionsService.saveCamions(this.camion).subscribe(data=>{
      this.mode=2;
    }, err=>{
      console.log(err);
    });
    this.gotoDetailTransporter(this.camion.idTransporter);
  }
  /*
  codeCouleur(odoActual:number, odoFait:number){
    if((odoActual-odoFait)<20000)
      return "btn-success";
    if((odoActual-odoFait)<25000)
      return "btn-warning";
    if((odoActual-odoFait)>25000)
      return "btn-danger";
    //return "";
  }
  //*/
  onPress(){
    this.router.navigateByUrl("/map");
  }
}
