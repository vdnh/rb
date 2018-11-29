import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calcule-prix',
  templateUrl: './calcule-prix.component.html',
  styleUrls: ['./calcule-prix.component.css']
})
export class CalculePrixComponent implements OnInit {

  // les details de marchandise
  longueur:number=0.00;
  largeur:number=0.00;
  hauteur:number=0.00;
  poids:number=0.00;
  valeur:number=0.00;
  distance:number=0.00;

  // le prix sugere
  prix:number=0.00;

  constructor() { }

  ngOnInit() {
  }
  onOk(){
    this.prix=this.longueur + this.largeur + this.hauteur + this.poids + this.valeur + this.distance;
  }
  

}
