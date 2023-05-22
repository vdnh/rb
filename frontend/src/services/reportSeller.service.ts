import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Demande } from "../model/model.demande";
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Observable } from 'rxjs';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts
import { ReportSeller } from 'src/model/model.reportSeller';

@Injectable()
export class ReportSellerService{
  
    adServer=myGlobals.adServer; 
    private jwToken=null;

    constructor(public http:HttpClient){

    }

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }


    
    // getAllReportSellers()
    // {    
    //     this.loadTonken();
    //     return this.http.get(this.adServer+":8443/transports", 
    //     {headers:new HttpHeaders({'Authorization':this.jwToken})})
    //     .pipe(map(resp =>{
    //         return resp;
    //     }))
    // }
    
    getReportSellersTransporter(idTransporter:number)
    {    
        this.loadTonken();
        return this.http.get(this.adServer+":8443/reportsTransporter/"+idTransporter, 
        {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(resp =>{
            return resp;
        }))
    }

    getReportsSeller(idSeller:number)
    {    
        this.loadTonken();
        return this.http.get(this.adServer+":8443/reportsSeller/"+idSeller, 
        {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(resp =>{
            return resp;
        }))
    }

    saveReportSeller(r:ReportSeller){
        this.loadTonken();
        return this.http.post(this.adServer+":8443/reportSellers",r
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailReportSeller(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/reportSellers/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateReportSeller(id:number, r:ReportSeller){
        this.loadTonken();
       return this.http.put(this.adServer+":8443/reportSellers/"+id, r
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteReportSeller(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8443/reportSellers/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}