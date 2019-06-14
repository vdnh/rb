import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Garantie } from "../model/model.garantie";
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Observable } from 'rxjs';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class GarantiesService{
  
    adServer=myGlobals.adServer; //"//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){
    }

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }
    
    garantieDeCamion(idCamion:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/garantiesDeCamion?idCamion="+idCamion
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveGarantie(garantie:Garantie){
        this.loadTonken();
        return this.http.post(this.adServer+":8080/garanties", garantie
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailGarantie(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/garanties/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateGarantie(id:number, g:Garantie){
        this.loadTonken();
       return this.http.put(this.adServer+":8080/garanties/"+id, g
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteGarantie(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8080/garanties/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}