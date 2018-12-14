import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Transporter } from "../model/model.transporter";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class TransportersService{
    adServer="//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){}

    loadTonken(){
        this.jwToken = localStorage.getItem('tonken');
    }


    getTransporters(motCle:string, page:number, size:number){
        return this.http.get(this.adServer+":8080/chercherTransporters?mc="+motCle+"&size="+size+
        "&page="+page, {headers:new HttpHeaders({'Authorization':this.jwToken})})
        //.pipe(map(res => res.json()));
    }

    saveTransporters(transporter:Transporter){
        return this.http.post(this.adServer+":8080/transporters",transporter
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        //.pipe(map(res => res.json()));
    }

    getDetailTransporter(id:number){
        return this.http.get(this.adServer+":8080/transporters/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        //.pipe(map(res => res.json()));
    }

    deleteTransporter(id:number){
        return this.http.delete(this.adServer+":8080/transporters/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        //.pipe(map(res=>res.json()));
    }
}