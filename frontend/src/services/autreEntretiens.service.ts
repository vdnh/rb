import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { AutreEntretien } from "../model/model.autreEntretien";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AutreEntretiensService{
  
    adServer="//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){

    }

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }
    
    autreEntretienDeCamion(idCamion:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/autreEntretienDeCamion?idCamion="+idCamion
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveAutreEntretiens(autreEntretien:AutreEntretien){
        this.loadTonken();
        return this.http.post(this.adServer+":8080/autreEntretiens", autreEntretien
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailAutreEntretien(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/autreEntretiens/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateAutreEntretien(id:number, c:AutreEntretien){
        this.loadTonken();
       return this.http.put(this.adServer+":8080/autreEntretiens/"+id, c
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteAutreEntretien(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8080/autreEntretiens/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}