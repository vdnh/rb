import { Injectable } from "@angular/core";
//import { Http } from "@angular/http";
import { map } from "rxjs/operators";
import { DriverLicense } from "../model/model.driverLicense";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PageContact } from 'src/model/model.pageContact';
import { Observable } from 'rxjs';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class DriverLicenseService{

    adServer=myGlobals.adServer; //"//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){}

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }
    
    driverLicensesOfOwner(idOwner:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/driverLicenseOfOwner?idOwner="+idOwner
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveDriverLicense(driver:DriverLicense){
        this.loadTonken();
        return this.http.post(this.adServer+":8443/driverLicense",driver
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDriverLicense(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/driverLicense/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateDriverLicense(id:number, d:DriverLicense){
        this.loadTonken();
        return this.http.put(this.adServer+":8443/driverLicense/"+id, d
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteDriverLicense(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8443/driverLicense/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}