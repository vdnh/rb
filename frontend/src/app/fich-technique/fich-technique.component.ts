import { Component, OnInit } from '@angular/core';
import { FichePhysiqueEntretien } from 'src/model/model.fichePhysiqueEntretien';
import { FichePhysiqueEntretienCont } from 'src/model/model.fichePhysiqueEntretienCont';

@Component({
  selector: 'app-fich-technique',
  templateUrl: './fich-technique.component.html',
  styleUrls: ['./fich-technique.component.css']
})
export class FichTechniqueComponent implements OnInit {

  fiche:FichePhysiqueEntretien = new FichePhysiqueEntretien();
  ficheCont:FichePhysiqueEntretienCont = new FichePhysiqueEntretienCont();
  constructor() { }

  ngOnInit() {
  }

}
