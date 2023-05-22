import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Shipper } from "../model/model.shipper";
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Observable } from 'rxjs';
//import { PageShipper } from 'src/model/model.pageShipper';
//import { Http, Headers, RequestOptions } from '@angular/http';
//import { HttpHeaders } from '@angular/common/http';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class ShippersService{
    
    adServer=myGlobals.adServer; //"//192.168.0.131";
    private jwToken=null;

    //headers: Headers = new Headers();
    //headers.append('Content-Type', 'application/json');
    //headers.append('Authorization', 'Bearer: 123213');
    //this.http.post('https://127.0.0.1:502', JSON.stringify(token), {headers: headers}).subscribe();

    constructor(public http:HttpClient){
        // this.headers = new Headers();
        // this.headers.append('content-type', 'application/json');
        // //this.headers.append('Authorization', 'Bearer: 123213');
    }

    loadTonken(){
        //console.log("I will read jwTonken, I'm from load ShippersService")
        this.jwToken = localStorage.getItem('tonken');
    }

    getShippers(motCle:string, page:number, size:number)    //:Observable<PageShipper>
        {    
        this.loadTonken();
        return this.http.get(this.adServer+":8443/chercherShippers?mc="+motCle+"&size="+size+
        "&page="+page, {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(resp =>{
            return resp;
        }))
    }

    getShippersByIdTransporter(motCle:string, id:number, page:number, size:number)    //:Observable<PageShipper>
        {    
        this.loadTonken();
        return this.http.get(this.adServer+":8443/chercherShippersByIdTransporter?mc="+motCle+"&id="+id+"&size="+size+
        "&page="+page, {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(resp =>{
            return resp;
        }))
    }

    getAllShippers()    //
        {    
        this.loadTonken();
        return this.http.get(this.adServer+":8443/shippers", {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(resp =>{
            return resp;
        }))
    }

    getShippersTransporter(id:number){    
        this.loadTonken();
        return this.http.get(this.adServer+":8443/shippersTransporter/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveShippers(shipper:Shipper){
        this.loadTonken();
        return this.http.post(this.adServer+":8443/shippers",shipper
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res;}));
    }

    getDetailShipper(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/shippers/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    deleteShipper(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8443/shippers/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res=> {return res}));
    }
    // for sign up no need authentication
    signUpShipper(shipper:Shipper){
        return this.http.post(this.adServer+":8443/shipperSignUp",shipper).pipe(map(res => {return res;}));
    }
}