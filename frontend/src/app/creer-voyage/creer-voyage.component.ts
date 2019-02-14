import { Component, OnInit } from '@angular/core';
import { VoyagesService } from 'src/services/voyages.service';
import { Voyage } from 'src/model/model.voyage';

@Component({
  selector: 'app-creer-voyage',
  templateUrl: './creer-voyage.component.html',
  styleUrls: ['./creer-voyage.component.css']
})
export class CreerVoyageComponent implements OnInit {

  today:Date; 
  voyage:Voyage=new Voyage();
  listRadius : Array<number> = [50, 100, 200, 300, 400, 500];
  constructor(public voyagesService : VoyagesService) { }

  ngOnInit() {
    this.today=new Date();
    console.log('this.today : '+this.today)
    this.voyage.idTransporter = Number(localStorage.getItem("userId"));
    this.voyage.nomTransporter = localStorage.getItem("nom");
  }

  onSaveVoyage(){
    this.voyage.dateDepart = new Date(this.voyage.dateDepart)
    this.voyagesService.saveVoyages(this.voyage).subscribe((data:Voyage)=>{
    }
    , err=>{
      console.log(err)
    })
  }

  onReset(){
    this.voyage=new Voyage();
    this.ngOnInit()
  }
}
