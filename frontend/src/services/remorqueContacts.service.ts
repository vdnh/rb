import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Demande } from "../model/model.demande";
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Observable } from 'rxjs';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts
import { Remorquage } from 'src/model/model.remorquage';

@Injectable()
export class RemorqueContactsService{
  
    adServer=myGlobals.adServer; //"//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){

    }

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }

    getRemorquages(motCle:string, page:number, size:number)
        {    
        this.loadTonken();
        return this.http.get(this.adServer+":8443/chercherRemorquages?mc="+motCle+"&size="+size+
        "&page="+page, {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(resp =>{
            return resp;
        }))
    }

    getAllRemorquages()
    {    
        this.loadTonken();
        return this.http.get(this.adServer+":8443/remorquages", 
        {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(resp =>{
            return resp;
        }))
    }

    saveRemorquages(r:Remorquage){
        this.loadTonken();
        return this.http.post(this.adServer+":8443/remorquages",r
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailRemorquage(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/remorquages/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateRemorquage(id:number, r:Remorquage){
        this.loadTonken();
       return this.http.put(this.adServer+":8443/remorquages/"+id, r
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteRemorquage(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8443/remorquages/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}