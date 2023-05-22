import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { FileInspect } from "../model/model.fileInspect";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class FileInspectService{

    adServer=myGlobals.adServer; //"//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){}

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }
    
    fileInspectOfOwner(idOwner:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/fileInspectOfOwner?idOwner="+idOwner
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveFileInspect(fileInspect:FileInspect){
        this.loadTonken();
        return this.http.post(this.adServer+":8443/fileInspect",fileInspect
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getFileInspect(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/fileInspect/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateFileInspect(id:number, f:FileInspect){
        this.loadTonken();
        return this.http.put(this.adServer+":8443/fileInspect/"+id, f
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteFileInspect(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8443/fileInspect/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}