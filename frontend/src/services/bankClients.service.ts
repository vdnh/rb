import { Injectable } from "@angular/core";
//import { Http } from "@angular/http";
import { map } from "rxjs/operators";
import { BankClient } from "../model/model.bankClient";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PageContact } from 'src/model/model.pageContact';
import { Observable } from 'rxjs';
import { EmailMessage } from 'src/model/model.emailMessage';

@Injectable()
export class BankClientsService{

    adServer="//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){}

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }

    getBankClients(){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/bankClients"
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveClients(client:BankClient){
        this.loadTonken();
        return this.http.post(this.adServer+":8080/bankClients",client
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailClient(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/bankClients/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateClient(id:number, c:BankClient){
        this.loadTonken();
        return this.http.put(this.adServer+":8080/bankClients/"+id, c
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteClient(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8080/bankClients/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    envoyerMailToAll(em:EmailMessage){
        this.loadTonken();
        return this.http.post(this.adServer+":8080/emailToAll",em
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));

    }

    chercher(motCle:string)  
    {    
        this.loadTonken();
        return this.http.get(this.adServer+":8080/chercherClients?mc="+motCle
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(resp =>{
            return resp;
        }))
    }
}