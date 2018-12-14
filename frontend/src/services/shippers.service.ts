import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Shipper } from "../model/model.shipper";
//import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, RequestOptions } from '@angular/http';
//import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class ShippersService{
    
    adServer="//192.168.0.131";
    private jwToken=null;

    headers: Headers = new Headers();
    //headers.append('Content-Type', 'application/json');
    //headers.append('Authorization', 'Bearer: 123213');
    //this.http.post('https://127.0.0.1:502', JSON.stringify(token), {headers: headers}).subscribe();

    constructor(public http:Http){
        this.headers = new Headers();
        this.headers.append('content-type', 'application/json');
        //this.headers.append('Authorization', 'Bearer: 123213');
    }

    loadTonken(){
        this.jwToken = localStorage.getItem('tonken');
    }

    getShippers(motCle:string, page:number, size:number){
        this.headers.append('Authorization', this.jwToken);
        return this.http.get(this.adServer+":8080/chercherShippers?mc="+motCle+"&size="+size+
        "&page="+page, {
            headers: this.headers
          })   //{headers:new HttpHeaders({'Authorization':this.jwToken})}
        .pipe(map(res => res.json()));
    }

    saveShippers(shipper:Shipper){
        return this.http.post(this.adServer+":8080/shippers",shipper)
        //, {headers:new HttpHeaders({'Authorization':this.jwToken})})
        //.pipe(map(res => res.json()));
    }

    getDetailShipper(id:number){
        return this.http.get(this.adServer+":8080/shippers/"+id)
        //, {headers:new HttpHeaders({'Authorization':this.jwToken})})
        //.pipe(map(res => res.json()));
    }

    deleteShipper(id:number){
        return this.http.delete(this.adServer+":8080/shippers/"+id)
        //, {headers:new HttpHeaders({'Authorization':this.jwToken})})
        //.pipe(map(res=>res.json()));
    }
}