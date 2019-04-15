import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Voyage } from "../model/model.voyage";
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Observable } from 'rxjs';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class VoyagesService{
  
    adServer=myGlobals.adServer; //"//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){

    }

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }
    
    getVoyages(motCle:string, page:number, size:number)
        {    
        this.loadTonken();
        return this.http.get(this.adServer+":8080/chercherVoyages?mc="+motCle+"&size="+size+
        "&page="+page, {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(resp =>{
            return resp;
        }))
    }

    voyagesDeTransporter(idTransporter:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/voyagesDeTransporter?idTransporter="+idTransporter
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
    
    matchingVoyagesa(typeCamion:string, optionVoyage:string, dateDepart:string){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/matchingVoyages?typeCamion="+typeCamion+"&optionVoyage="+optionVoyage+"&dateDepart="+dateDepart
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveVoyages(voyage:Voyage){
        this.loadTonken();
        return this.http.post(this.adServer+":8080/voyages",voyage
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailVoyage(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/voyages/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateVoyage(id:number, v:Voyage){
        this.loadTonken();
       return this.http.put(this.adServer+":8080/demandes/"+id, v
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteVoyage(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8080/voyages/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}