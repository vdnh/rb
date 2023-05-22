import { Injectable } from "@angular/core";
//import { Http } from "@angular/http";
import { map } from "rxjs/operators";
import { Fuel } from "../model/model.fuel";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class FuelService{

    adServer=myGlobals.adServer; //"//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){}

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }

    fuelOfOwner(idOwner:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/fuelOfOwner?idOwner="+idOwner
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveFuel(fuel:Fuel){
        this.loadTonken();
        return this.http.post(this.adServer+":8443/fuel",fuel
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getFuel(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/fuel/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateFuel(id:number, f:Fuel){
        this.loadTonken();
        return this.http.put(this.adServer+":8443/fuel/"+id, f
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteFuel(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8443/fuel/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}