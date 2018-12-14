import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Adresse } from "../model/model.adresse";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class AdressesService{
  
    adServer="//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){

    }

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }

    getAdresses(motCle:string, page:number, size:number){
        return this.http.get(this.adServer+":8080/chercherCodePostal?mc="+motCle+"&size="+size+
        "&page="+page, {headers:new HttpHeaders({'Authorization':this.jwToken})})
        //.pipe(map(res => res.json()));
    }

    adressesDeShipper(id_shipper:number){
        return this.http.get(this.adServer+":8080/adressesDeShipper?id_shipper="+id_shipper
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        //.pipe(map(res => res.json()));
    }
    
    adressesDeTransporter(id_transporter:number){
        return this.http.get(this.adServer+":8080/adressesDeTransporter?id_transporter="+id_transporter
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        //.pipe(map(res => res.json()));
    }

    saveAdresses(adresse:Adresse){
        return this.http.post(this.adServer+":8080/adresses",adresse
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        //.pipe(map(res => res.json()));
    }

    getDetailAdresse(id:number){
        return this.http.get(this.adServer+":8080/adresses/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        //.pipe(map(res => res.json()));
    }

    updateAdresse(id:number, a:Adresse){
       return this.http.put(this.adServer+":8080/adresses/"+id, a
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        //.pipe(map(res => res.json()));
    }

    deleteAdresse(id:number){
        return this.http.delete(this.adServer+":8080/adresses/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        //.pipe(map(res=>res.json()));
    }
}