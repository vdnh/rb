import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { FichePhysiqueEntretienCont } from "../model/model.fichePhysiqueEntretienCont";
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Observable } from 'rxjs';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class FichePhysiqueContsService{
  
    adServer=myGlobals.adServer; //"//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){

    }

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }
    
    fichePhysiqueEntretienContDeCamion(idCamion:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/fichePhysiqueEntretienContDeCamion?idCamion="+idCamion
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveFichePhysiqueEntretienConts(fichePhysiqueEntretienCont:FichePhysiqueEntretienCont){
        this.loadTonken();
        return this.http.post(this.adServer+":8443/fichePhysiqueEntretienConts", fichePhysiqueEntretienCont
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailFichePhysiqueEntretienCont(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/fichePhysiqueEntretienConts/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateFichePhysiqueEntretienCont(id:number, c:FichePhysiqueEntretienCont){
        this.loadTonken();
       return this.http.put(this.adServer+":8443/fichePhysiqueEntretienConts/"+id, c
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteFichePhysiqueEntretienCont(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8443/fichePhysiqueEntretienConts/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}