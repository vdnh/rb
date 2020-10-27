import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Camion } from "../model/model.camion";
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Observable } from 'rxjs';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class CamionsService{
  
    adServer=myGlobals.adServer; //"//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){

    }

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }
    
    camionsDeTransporter(idTransporter:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/camionsDeTransporter?idTransporter="+idTransporter
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveCamions(camion:Camion){
        this.loadTonken();
        return this.http.post(this.adServer+":8080/camions",camion
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailCamion(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/camions/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateCamion(id:number, c:Camion){
        this.loadTonken();
       return this.http.put(this.adServer+":8080/camions/"+id, c
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }
    
    // camionUpdateFromTerminal  url
    /*
    @Param("speed")Double speed,
    @Param("timeStop")Long timeStop,
    @Param("latitude")Double latitude,
    @Param("longtitude")Double longtitude,
    @Param("location")String location,
    @Param("direction")Double direction,
    @Param("odometre")Long odometre
    */
    updateCamionFromterminal(camionForRoute:CamionForRoute)
    {
        this.loadTonken();
        // ?mc="+motCle+"&size="+size+"&page="+page
        // return this.http.patch(this.adServer+":8080/camionUpdateFromTerminal",camionForRoute, {headers:new HttpHeaders({'Authorization':this.jwToken})})
        return this.http.post(this.adServer+":8080/camionUpdateFromTerminal",camionForRoute, 
        {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(
            map(res => {return res})
        );
    }

    deleteCamion(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8080/camions/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}

export class CamionForRoute {
    id:number;
    odometre:number;     
    longtitude:number;
    latitude:number;
    direction:number; // 0.00 - 359.99 -- north-east-south-west;    
    speed:number;
    timeStop:number; // the time when terminal stopped;  new Date().getTime()
    location:string; // address in AVL
}