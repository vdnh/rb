import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Reparation } from "../model/model.reparation";
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Observable } from 'rxjs';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class ReparationsService{
  
    adServer=myGlobals.adServer; //"//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){
    }

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }
    
    reparationDeBon(idBon:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/reparationsDeBon?idBon="+idBon
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveReparation(reparation:Reparation){
        this.loadTonken();
        return this.http.post(this.adServer+":8443/reparations", reparation
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailReparation(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/reparations/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateReparation(id:number, r:Reparation){
        this.loadTonken();
       return this.http.put(this.adServer+":8443/reparations/"+id, r
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteReparation(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8443/reparations/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}