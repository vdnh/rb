import { Injectable } from "@angular/core";
//import { Http } from "@angular/http";
import { map } from "rxjs/operators";
import { ExpenseFixed } from "../model/model.expenseFixed";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class ExpenseFixedService{

    adServer=myGlobals.adServer; //"//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){}

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }

    expenseFixedOfOwner(idOwner:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/expenseFixedOfOwner?idOwner="+idOwner
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveExpenseFixed(expenseFixed:ExpenseFixed){
        this.loadTonken();
        return this.http.post(this.adServer+":8443/expenseFixed",expenseFixed
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getExpenseFixed(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/expenseFixed/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateExpenseFixed(id:number, e:ExpenseFixed){
        this.loadTonken();
        return this.http.put(this.adServer+":8443/expenseFixed/"+id, e
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteExpenseFixed(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8443/expenseFixed/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}