import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Transporter } from "../model/model.transporter";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class TransportersService{
    adServer=myGlobals.adServer; //"//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){}

    loadTonken(){
        this.jwToken = localStorage.getItem('tonken');
    }


    getTransporters(motCle:string, page:number, size:number){
        this.loadTonken();
        /*
        return this.http.get(this.adServer+":8080/chercherTransporters?mc="+motCle+"&size="+size+
        "&page="+page, {headers:new HttpHeaders({'Authorization':this.jwToken})})
        //.pipe(map(res => res.json()));//*/
        return this.http.get(this.adServer+":8080/chercherTransporters?mc="+motCle+"&size="+size+
        "&page="+page, {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res =>{
            return res;
        }))
    }

    saveTransporters(transporter:Transporter){
        this.loadTonken();
        return this.http.post(this.adServer+":8080/transporters",transporter
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailTransporter(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/transporters/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    deleteTransporter(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8080/transporters/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}