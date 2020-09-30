import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Terminal } from "../model/model.terminal";
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Observable } from 'rxjs';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class TerminalsService{
  
    adServer=myGlobals.adServer; //"//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){

    }

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }
    
    terminalsDeTransporter(idTransporter:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/terminalsDeTransporter?idTransporter="+idTransporter
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveTerminals(terminal:Terminal){
        this.loadTonken();
        return this.http.post(this.adServer+":8080/terminals",terminal
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailTerminal(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/terminals/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateTerminal(id:number, c:Terminal){
        this.loadTonken();
       return this.http.put(this.adServer+":8080/terminals/"+id, c
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteTerminal(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8080/terminals/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}