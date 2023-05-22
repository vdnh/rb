import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Message } from "../model/model.message";
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Observable } from 'rxjs';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class MessagesService{
    adServer=myGlobals.adServer; //"//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){

    }

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }
    
    getAllMessages()
    {    
        this.loadTonken();
        return this.http.get(this.adServer+":8443/messages", 
        {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(resp =>{
            return resp;
        }))
    }
    messageDemandeContacted(idSender:number, idDemande:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/messageDemandeContacted?idSender="+idSender+"&idDemande="+idDemande
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
    messageVoyageContacted(idSender:number, idVoyage:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/messageVoyageContacted?idSender="+idSender+"&idVoyage="+idVoyage
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
    messagesReceived(idReceiver:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/messagesReceived?idReceiver="+idReceiver
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
    
    messagesSent(idSender:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/messagesSent?idSender="+idSender
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveMessages(message:Message){
        this.loadTonken();
        return this.http.post(this.adServer+":8443/messages",message
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailMessage(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/messages/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateMessage(id:number, m:Message){
        this.loadTonken();
       return this.http.put(this.adServer+":8443/demandes/"+id, m
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteMessage(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8443/messages/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}