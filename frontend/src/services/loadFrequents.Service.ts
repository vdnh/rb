import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { LoadFrequent } from "../model/model.loadFrequent";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class LoadFrequentsService{
  
    adServer=myGlobals.adServer; 
    private jwToken=null;

    constructor(public http:HttpClient){
    }

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }
    
    loadFrequentsDeTransporter(idTransporter:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/loadFrequentsDeTransporter?idTransporter="+idTransporter
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
    
    loadFrequentsDeShipper(idShipper:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/loadFrequentsDeShipper?idShipper="+idShipper
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
    saveLoadFrequent(loadFrequent:LoadFrequent){
        this.loadTonken();
        return this.http.post(this.adServer+":8080/loadFrequents", loadFrequent
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailLoadFrequent(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/loadFrequents/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateLoadFrequent(id:number, l:LoadFrequent){
        this.loadTonken();
       return this.http.put(this.adServer+":8080/loadFrequents/"+id, l
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteLoadFrequent(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8080/loadFrequents/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}