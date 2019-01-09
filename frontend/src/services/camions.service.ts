import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Camion } from "../model/model.camion";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CamionsService{
  
    adServer="//192.168.0.131";
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

    deleteCamion(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8080/camions/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}