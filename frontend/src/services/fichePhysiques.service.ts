import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { FichePhysiqueEntretien } from "../model/model.fichePhysiqueEntretien";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class FichePhysiquesService{
  
    adServer="//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){

    }

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }
    
    fichePhysiqueEntretienDeCamion(idCamion:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/fichePhysiqueEntretienDeCamion?idCamion="+idCamion
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveFichePhysiqueEntretiens(fichePhysiqueEntretien:FichePhysiqueEntretien){
        this.loadTonken();
        return this.http.post(this.adServer+":8080/fichePhysiqueEntretiens", fichePhysiqueEntretien
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailFichePhysiqueEntretien(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/fichePhysiqueEntretiens/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateFichePhysiqueEntretien(id:number, c:FichePhysiqueEntretien){
        this.loadTonken();
       return this.http.put(this.adServer+":8080/fichePhysiqueEntretiens/"+id, c
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteFichePhysiqueEntretien(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8080/fichePhysiqueEntretiens/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}