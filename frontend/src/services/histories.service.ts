import { Injectable } from "@angular/core";
//import { Http } from "@angular/http";
import { map } from "rxjs/operators";
import { History } from "../model/model.history";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PageContact } from 'src/model/model.pageContact';
import { Observable } from 'rxjs';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class HistoriesService{

    adServer=myGlobals.adServer; //"//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){}

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }
    
    historiesOfOwner(idOwner:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/historyOfOwner?idOwner="+idOwner
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveHistory(history:History){
        this.loadTonken();
        return this.http.post(this.adServer+":8443/history",history
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getHistory(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/history/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateHistory(id:number, h:History){
        this.loadTonken();
        return this.http.put(this.adServer+":8443/history/"+id, h
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteHistory(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8443/history/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}