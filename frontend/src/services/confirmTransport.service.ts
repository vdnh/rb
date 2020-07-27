import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Observable } from 'rxjs';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts
import { ConfirmTransport } from 'src/model/model.confirmTransport';

@Injectable()
export class ConfirmTransportService{
  
    adServer=myGlobals.adServer; //"//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){

    }

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }
    
    confirmTransportsDeTransporter(idTransporter:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/confirmTransportsDeTransporter?idTransporter="+idTransporter
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveConfirmTransports(confirmTransport:ConfirmTransport){
        this.loadTonken();
        return this.http.post(this.adServer+":8080/confirmTransports",confirmTransport
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailConfirmTransport(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/confirmTransports/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateConfirmTransport(id:number, c:ConfirmTransport){
        this.loadTonken();
       return this.http.put(this.adServer+":8080/confirmTransports/"+id, c
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteConfirmTransport(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8080/confirmTransports/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
    getConfirmTransportByFormNumero(idTransporter:number, formNumero:string){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/confirmTransportByFormNumero?idTransporter="+idTransporter+"&formNumero="+formNumero
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}