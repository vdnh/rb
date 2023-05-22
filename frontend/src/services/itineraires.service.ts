import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Itineraire } from "../model/model.itineraire";
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Observable } from 'rxjs';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class ItinerairesService{
  
    adServer=myGlobals.adServer; //"//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){

    }

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }
    // itineraireTransport
    itineraireDeTransport(idTransport:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/itineraireTransport/"+idTransport
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    itinerairesDeTransporter(idTransporter:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/itinerairesTransporter/"+idTransporter
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    itinerairesLegerDeTransporter(idTransporter:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/itinerairesLegerTransporter/"+idTransporter
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    itinerairesDeCamion(idCamion:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/itinerairesCamion/"+idCamion
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    itinerairesLegerDeCamion(idCamion:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/itinerairesLegerCamion/"+idCamion
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
    
    saveItineraires(itineraire:Itineraire){
        this.loadTonken();
        return this.http.post(this.adServer+":8443/itineraires",itineraire
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailItineraire(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/itineraires/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateItineraire(id:number, i:Itineraire){
        this.loadTonken();
       return this.http.put(this.adServer+":8443/itineraires/"+id, i
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteItineraire(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8443/itineraires/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}