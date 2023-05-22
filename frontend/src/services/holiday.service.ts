import { Injectable } from "@angular/core";
//import { Http } from "@angular/http";
import { map } from "rxjs/operators";
import { Holiday } from "../model/model.Holiday";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class HolidayService{

    adServer=myGlobals.adServer; //"//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){}

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }
    
    holidayOfOwner(idOwner:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/holidayOfOwner?idOwner="+idOwner
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveHoliday(holiday:Holiday){
        this.loadTonken();
        return this.http.post(this.adServer+":8443/holiday",holiday
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getHoliday(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/holiday/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateHoliday(id:number, h:Holiday){
        this.loadTonken();
        return this.http.put(this.adServer+":8443/expenseFixed/"+id, h
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteHoliday(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8443/holiday/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}