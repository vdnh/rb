import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { AutreEntretien } from "../model/model.autreEntretien";
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Observable } from 'rxjs';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class AutreEntretiensService{
  
    adServer=myGlobals.adServer; //"//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){

    }

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }
    
    autreEntretienDeCamion(idCamion:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/autreEntretienDeCamion?idCamion="+idCamion
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveAutreEntretiens(autreEntretien:AutreEntretien){
        if(autreEntretien.dateFaitMiliseconds!=null && autreEntretien.dateFaitMiliseconds>0) 
            autreEntretien.dateFait = new Date(autreEntretien.dateFaitMiliseconds)
        this.loadTonken();
        return this.http.post(this.adServer+":8443/autreEntretiens", autreEntretien
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailAutreEntretien(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/autreEntretiens/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateAutreEntretien(id:number, c:AutreEntretien){
        this.loadTonken();
       return this.http.put(this.adServer+":8443/autreEntretiens/"+id, c
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteAutreEntretien(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8443/autreEntretiens/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
 }