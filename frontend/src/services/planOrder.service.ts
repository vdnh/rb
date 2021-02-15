import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { PlanOrder } from "../model/model.planOrder";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class PlanOrderService{
    adServer=myGlobals.adServer; 
    private jwToken=null;

    constructor(public http:HttpClient){
    }

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }
    
    allPlanOrders(){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/planOrders"
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    planOrdersDeTransporter(idTransporter:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/planOrdersDeTransporter?idTransporter="+idTransporter
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    savePlanOrder(planOrder:PlanOrder){
        this.loadTonken();
        return this.http.post(this.adServer+":8080/planOrders", planOrder
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailPlanOrder(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/planOrders/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updatePlanOrders(id:number, p:PlanOrder){
        this.loadTonken();
       return this.http.put(this.adServer+":8080/planOrders/"+id, p
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deletePlanOrder(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8080/planOrders/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}