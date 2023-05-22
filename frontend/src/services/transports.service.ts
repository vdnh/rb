import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Demande } from "../model/model.demande";
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Observable } from 'rxjs';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts
import { Transport } from 'src/model/model.transport';

@Injectable()
export class TransportsService{
  
    adServer=myGlobals.adServer; //"//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){

    }

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }

    getTransports(motCle:string, page:number, size:number)
        {    
        this.loadTonken();
        return this.http.get(this.adServer+":8443/chercherTransports?mc="+motCle+"&size="+size+
        "&page="+page, {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(resp =>{
            return resp;
        }))
    }

    //* fonctionnes for transport model
    getAllTransportModels()
    {    
        this.loadTonken();
        return this.http.get(this.adServer+":8443/transportModels", 
        {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(resp =>{
            return resp;
        }))
    }

    getTransportModelsEntreprise(idEntreprise:number)
    {    
        this.loadTonken();
        return this.http.get(this.adServer+":8443/transportModelsEntreprise/"+idEntreprise, 
        {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(resp =>{
            return resp;
        }))
    }
    saveTransportModels(t:Transport){
        this.loadTonken();
        return this.http.post(this.adServer+":8443/transportModels",t
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
    deleteTransportModel(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8443/transportModels/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
    // end for transport model*/
    
    getAllTransports()
    {    
        this.loadTonken();
        return this.http.get(this.adServer+":8443/transports", 
        {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(resp =>{
            return resp;
        }))
    }
    
    getTransportsTransporter(idTransporter:number)
    {    
        this.loadTonken();
        return this.http.get(this.adServer+":8443/transportsTransporter/"+idTransporter, 
        {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(resp =>{
            return resp;
        }))
    }
    // All commands transport of un transporter
    getCommandsTransportTransporter(idTransporter:number)
    {    
        this.loadTonken();
        return this.http.get(this.adServer+":8443/commandsTransportTransporter/"+idTransporter, 
        {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(resp =>{
            return resp;
        }))
    }
    // All commands transport of un transporter - Paged
    getCommandsTransportTransporterPaged(idTransporter:number, page:number, size:number)
    {    
        this.loadTonken();
        return this.http.get(this.adServer+":8443/commandsTransportTransporterPaged?idTransporter="+idTransporter+"&size="+size+
        "&page="+page, {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(resp =>{
            return resp;
        }))
    }
    
    // All evaluations transport of un transporter
    getEvaluationsTransportTransporter(idTransporter:number)
    {    
        this.loadTonken();
        return this.http.get(this.adServer+":8443/evaluationsTransportTransporter/"+idTransporter, 
        {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(resp =>{
            return resp;
        }))
    }
    
    // All commands transport of un transporter - Paged
    getEvaluationsTransportTransporterPaged(idTransporter:number, page:number, size:number)
    {    
        this.loadTonken();
        return this.http.get(this.adServer+":8443/evaluationsTransportTransporterPaged?idTransporter="+idTransporter+"&size="+size+
        "&page="+page, {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(resp =>{
            return resp;
        }))
    }
    // cleanEvaluationsTransportTransporter
    cleanEvaluationsTransportTransporter(idTransporter:number)
    {    
        this.loadTonken();
        return this.http.get(this.adServer+":8443/cleanEvaluationsTransportTransporter/"+idTransporter, 
        {headers:new HttpHeaders({'Authorization':this.jwToken})}).pipe()
    }

    getTransportsEntreprise(idEntreprise:number)
    {    
        this.loadTonken();
        return this.http.get(this.adServer+":8443/transportsEntreprise/"+idEntreprise, 
        {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(resp =>{
            return resp;
        }))
    }

    saveTransports(t:Transport){
        this.loadTonken();
        return this.http.post(this.adServer+":8443/transports",t
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailTransport(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/transports/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateTransport(id:number, t:Transport){
        this.loadTonken();
       return this.http.put(this.adServer+":8443/transports/"+id, t
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteTransport(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8443/transports/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}