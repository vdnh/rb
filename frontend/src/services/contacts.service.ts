import { Injectable } from "@angular/core";
//import { Http } from "@angular/http";
import { map } from "rxjs/operators";
import { Contact } from "../model/model.contact";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ContactsService{

    adServer="//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){}

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }

    getContacts(motCle:string, page:number, size:number){
        return this.http.get(this.adServer+":8080/chercherContacts?mc="+motCle+"&size="+size+
        "&page="+page, {headers:new HttpHeaders({'Authorization':this.jwToken})});
    }

    contactsDeShipper(id_shipper:number){
        return this.http.get(this.adServer+":8080/contactsDeShipper?id_shipper="+id_shipper
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        //.pipe(map(res => res.json()));
    }

    contactsDeTransporter(id_transporter:number){
        return this.http.get(this.adServer+":8080/contactsDeTransporter?id_transporter="+id_transporter
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        //.pipe(map(res => res.json()));
    }

    saveContacts(contact:Contact){
        return this.http.post(this.adServer+":8080/contacts",contact
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        //.pipe(map(res => res.json()));
    }

    getDetailContact(id:number){
        return this.http.get(this.adServer+":8080/contacts/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        //.pipe(map(res => res.json()));
    }

    updateContact(id:number, c:Contact){
       return this.http.put(this.adServer+":8080/contacts/"+id, c
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       // .pipe(map(res => res.json()));
    }

    deleteContact(id:number){
        return this.http.delete(this.adServer+":8080/contacts/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        //.pipe(map(res=>res.json()));
    }
}