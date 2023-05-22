import { Injectable } from "@angular/core";
//import { Http } from "@angular/http";
import { map } from "rxjs/operators";
import { Contact } from "../model/model.contact";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PageContact } from 'src/model/model.pageContact';
import { Observable } from 'rxjs';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class ContactsService{

    adServer=myGlobals.adServer; //"//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){}

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }

    getContacts(motCle:string, page:number, size:number):Observable<PageContact>{
        this.loadTonken();
        return this.http.get<PageContact>(this.adServer+":8443/chercherContacts?mc="+motCle+"&size="+size+
        "&page="+page, {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    contactsDeShipper(id_shipper:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/contactsDeShipper?id_shipper="+id_shipper
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    contactsDeTransporter(id_transporter:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/contactsDeTransporter?id_transporter="+id_transporter
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveContacts(contact:Contact){
        this.loadTonken();
        return this.http.post(this.adServer+":8443/contacts",contact
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailContact(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/contacts/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateContact(id:number, c:Contact){
        this.loadTonken();
        return this.http.put(this.adServer+":8443/contacts/"+id, c
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteContact(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8443/contacts/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    signupContact(contact:Contact){
        return this.http.post(this.adServer+":8443/contactSignUp",contact).pipe(map(res => {return res}));
    }
}