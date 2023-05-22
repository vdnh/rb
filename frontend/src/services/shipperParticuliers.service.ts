import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { ShipperParticulier } from "../model/model.shipperParticulier";
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class ShipperParticuliersService{
    
    adServer=myGlobals.adServer; //"//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){
    }

    loadTonken(){
        this.jwToken = localStorage.getItem('tonken');
    }

    getShipperParticuliers(motCle:string, page:number, size:number)    //:Observable<PageShipperParticulier>
        {    
        this.loadTonken();
        return this.http.get(this.adServer+":8443/chercherShipperParticuliers?mc="+motCle+"&size="+size+
        "&page="+page, {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(resp =>{
            return resp;
        }))
    }

    getAllShipperParticuliers()    //
        {    
        this.loadTonken();
        return this.http.get(this.adServer+":8443/shipperParticuliers", {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(resp =>{
            return resp;
        }))
    }
    saveShipperParticuliers(shipperParticulier:ShipperParticulier){
        this.loadTonken();
        return this.http.post(this.adServer+":8443/shipperParticuliers",shipperParticulier
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res;}));
    }

    getDetailShipperParticulier(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/shipperParticuliers/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailShipperParticulierByIdTransporter(idTransporter:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/shipperParticuliersByIdTransporter/"+idTransporter
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    deleteShipperParticulier(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8443/shipperParticuliers/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res=> {return res}));
    }
    // for sign up no need authentication
    signUpShipperParticulier(shipperParticulier:ShipperParticulier){
        return this.http.post(this.adServer+":8443/shipperParticulierSignUp",shipperParticulier).pipe(map(res => {return res;}));
    }
}