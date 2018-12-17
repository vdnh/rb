import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Shipper } from "../model/model.shipper";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageShipper } from 'src/model/model.pageShipper';
//import { Http, Headers, RequestOptions } from '@angular/http';
//import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class ShippersService{
    
    adServer="//192.168.0.131";
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
        console.log("I will read jwTonken, I'm from load ShippersService")
        this.jwToken = localStorage.getItem('tonken');
    }

    getShippers(motCle:string, page:number, size:number)    //:Observable<PageShipper>
        {    
        //this.headers.append('Authorization', this.jwToken);
        this.loadTonken();
        /*return this.http.get<PageShipper>(this.adServer+":8080/chercherShippers?mc="+motCle+"&size="+size+
        "&page="+page, {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(resp =>{
            const data = resp;
            console.log("This is the content of Shippers come from database : "+data.content);
            return data;
        }))//*/
        return this.http.get(this.adServer+":8080/chercherShippers?mc="+motCle+"&size="+size+
        "&page="+page, {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(resp =>{
            //const data = resp;
            //console.log("This is the content of Shippers come from database : "+data.content);
            return resp;
        }))
    }

    saveShippers(shipper:Shipper){
        this.loadTonken();
        return this.http.post(this.adServer+":8080/shippers",shipper
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res;}));
    }

    getDetailShipper(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/shippers/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    deleteShipper(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8080/shippers/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        //.pipe(map(res=>res.json()));
    }
}