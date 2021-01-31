import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { PlanPrice } from "../model/model.planPrice";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class PlanPriceService{
    adServer=myGlobals.adServer; 
    private jwToken=null;

    constructor(public http:HttpClient){
    }

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }

    getAllPlanPrices(){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/planPrices", 
        {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(resp =>{
            return resp;
        }))
    }

    savePlanPrice(planPrice:PlanPrice){
        this.loadTonken();
        return this.http.post(this.adServer+":8080/planPrices", planPrice
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailPlanPrice(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/planPrices/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

}