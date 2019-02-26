import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { BonDeTravail } from "../model/model.bonDeTravail";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class BonDeTravailsService{
  
    adServer="//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){
    }

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }
    
    bonDeTravailDeCamion(idCamion:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/bonDeTravailsDeCamion?idCamion="+idCamion
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveBonDeTravail(bonDeTravail:BonDeTravail){
        this.loadTonken();
        return this.http.post(this.adServer+":8080/bonDeTravails", bonDeTravail
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailBonDeTravail(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/bonDeTravails/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateBonDeTravail(id:number, b:BonDeTravail){
        this.loadTonken();
       return this.http.put(this.adServer+":8080/bonDeTravails/"+id, b
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteBonDeTravail(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8080/bonDeTravails/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}