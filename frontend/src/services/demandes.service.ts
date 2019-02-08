import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Demande } from "../model/model.demande";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class DemandesService{
  
    adServer="//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){

    }

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }
    
    demandesDeTransporter(idDemandeur:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/demandesDeTransporter?idDemandeur="+idDemandeur
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
    
    demandesDeShipper(idDemandeur:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/demandesDeShipper?idDemandeur="+idDemandeur
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveDemandes(demande:Demande){
        this.loadTonken();
        return this.http.post(this.adServer+":8080/demandes",demande
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailDemande(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/demandes/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateCamion(id:number, d:Demande){
        this.loadTonken();
       return this.http.put(this.adServer+":8080/demandes/"+id, d
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteDemande(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8080/demandes/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}