import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { LoadDetail } from "../model/model.loadDetail";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class LoadDetailsService{
  
    adServer=myGlobals.adServer; 
    private jwToken=null;

    constructor(public http:HttpClient){
    }

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }
    
    loadDetailsDeTransport(idTransport:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/loadDetailsDeTransport?idTransport="+idTransport
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveLoadDetail(loadDetail:LoadDetail){
        this.loadTonken();
        return this.http.post(this.adServer+":8080/loadDetails", loadDetail
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailLoadDetail(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/loadDetails/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateLoadDetail(id:number, l:LoadDetail){
        this.loadTonken();
       return this.http.put(this.adServer+":8080/loadDetails/"+id, l
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteLoadDetail(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8080/loadDetails/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}