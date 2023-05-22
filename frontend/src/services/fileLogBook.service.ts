import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { FileLogBook } from "../model/model.fileLogBook";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class FileLogBookService{

    adServer=myGlobals.adServer; //"//192.168.0.131";
    private jwToken=null;

    constructor(public http:HttpClient){}

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }
    getFileLogBookByOwner(idOwner:number, page:number, size:number)    
        {    
        this.loadTonken();
        return this.http.get(this.adServer+":8443/chercherFileLogBookByOwner?idOwner="+idOwner+
        "&page="+page+"&size="+size, {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(resp =>{
            return resp;
        }))
    }

    fileLogBookOfOwnerByDate(idOwner:number, dateFindText:string){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/fileLogBookOfOwnerByDate?idOwner="+idOwner
        +"&dateFindText="+dateFindText, {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
    fileLogBookOfOwner(idOwner:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/fileLogBookOfOwner?idOwner="+idOwner
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveFileLogBook(fileLogBook:FileLogBook){
        this.loadTonken();
        return this.http.post(this.adServer+":8443/fileLogBook",fileLogBook
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getFileLogBook(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/fileLogBook/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateFileLogBook(id:number, f:FileLogBook){
        this.loadTonken();
        return this.http.put(this.adServer+":8443/fileLogBook/"+id, f
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteFileLogBook(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8443/fileLogBook/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}