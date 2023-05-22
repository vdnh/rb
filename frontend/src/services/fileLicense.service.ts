import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { FileLicense } from "../model/model.fileLicense";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class FileLicenseService{

    adServer=myGlobals.adServer; //"//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){}

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }
    
    fileLicenseOfOwner(idOwner:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/fileLicenseOfOwner?idOwner="+idOwner
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveFileLicense(fileLicense:FileLicense){
        this.loadTonken();
        return this.http.post(this.adServer+":8443/fileLicense",fileLicense
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getFileLicense(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/fileLicense/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateFileLicense(id:number, f:FileLicense){
        this.loadTonken();
        return this.http.put(this.adServer+":8443/fileLicense/"+id, f
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteFileLicense(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8443/fileLicense/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}