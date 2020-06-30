import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Repere } from "../model/model.repere";
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Observable } from 'rxjs';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class ReperesService{
  
    adServer=myGlobals.adServer; //"//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){

    }

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }
    
    reperesTransporter(idTransporter:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/reperesTransporter/"+idTransporter
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveReperes(repere:Repere){
        this.loadTonken();
        return this.http.post(this.adServer+":8080/reperes",repere
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailRepere(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/reperes/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateRepere(id:number, r:Repere){
        this.loadTonken();
       return this.http.put(this.adServer+":8080/reperes/"+id, r
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteRepere(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8080/reperes/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}