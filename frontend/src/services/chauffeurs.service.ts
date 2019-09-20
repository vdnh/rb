import { Injectable } from "@angular/core";
//import { Http } from "@angular/http";
import { map } from "rxjs/operators";
import { Chauffeur } from "../model/model.chauffeur";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PageContact } from 'src/model/model.pageContact';
import { Observable } from 'rxjs';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class ChauffeursService{

    adServer=myGlobals.adServer; //"//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){}

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }
    
    /*
    getChauffeurs(motCle:string, page:number, size:number):Observable<PageChauffeur>{
        this.loadTonken();
        return this.http.get<PageContact>(this.adServer+":8080/chercherChauffeurs?mc="+motCle+"&size="+size+
        "&page="+page, {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }//*/

    chauffeursDeTransporter(idTransporter:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/chauffeursDeTransporter?idTransporter="+idTransporter
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveChauffeurs(chauffeur:Chauffeur){
        this.loadTonken();
        return this.http.post(this.adServer+":8080/chauffeurs",chauffeur
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailChauffeur(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/chauffeurs/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateChauffeur(id:number, c:Chauffeur){
        this.loadTonken();
        return this.http.put(this.adServer+":8080/chauffeurs/"+id, c
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteChauffeur(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8080/chauffeurs/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    signupChauffeur(chauffeur:Chauffeur){
        return this.http.post(this.adServer+":8080/chauffeurSignUp",chauffeur).pipe(map(res => {return res}));
    }
}