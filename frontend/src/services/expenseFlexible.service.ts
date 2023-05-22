import { Injectable } from "@angular/core";
//import { Http } from "@angular/http";
import { map } from "rxjs/operators";
import { ExpenseFlexible } from "../model/model.expenseFlexible";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class ExpenseFlexibleService{

    adServer=myGlobals.adServer; //"//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){}

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }

    expenseFlexibleOfOwner(idOwner:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/expenseFlexibleOfOwner?idOwner="+idOwner
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveExpenseFlexible(expenseFlexible:ExpenseFlexible){
        this.loadTonken();
        return this.http.post(this.adServer+":8443/expenseFlexible",expenseFlexible
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getExpenseFlexible(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/expenseFlexible/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateExpenseFlexible(id:number, e:ExpenseFlexible){
        this.loadTonken();
        return this.http.put(this.adServer+":8443/expenseFlexible/"+id, e
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteExpenseFlexible(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8443/expenseFlexible/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
} 