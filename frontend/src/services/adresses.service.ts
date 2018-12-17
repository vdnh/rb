import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Adresse } from "../model/model.adresse";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PageAdresse } from 'src/model/model.pageAdresse';
import { Observable } from 'rxjs';

@Injectable()
export class AdressesService{
  
    adServer="//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){

    }

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }

    getAdresses(motCle:string, page:number, size:number):Observable<PageAdresse>{
        this.loadTonken();
        return this.http.get<PageAdresse>(this.adServer+":8080/chercherCodePostal?mc="+motCle+"&size="+size+
        "&page="+page, {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    adressesDeShipper(id_shipper:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/adressesDeShipper?id_shipper="+id_shipper
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
    
    adressesDeTransporter(id_transporter:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/adressesDeTransporter?id_transporter="+id_transporter
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveAdresses(adresse:Adresse){
        this.loadTonken();
        return this.http.post(this.adServer+":8080/adresses",adresse
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailAdresse(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/adresses/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateAdresse(id:number, a:Adresse){
        this.loadTonken();
       return this.http.put(this.adServer+":8080/adresses/"+id, a
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteAdresse(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8080/adresses/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}