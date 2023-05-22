import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { UserLogs } from "../model/model.userLogs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Observable } from 'rxjs';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class UserLogsService{adServer=myGlobals.adServer; //"//192.168.0.131";
private jwToken=null;

constructor(public http:HttpClient){

}

loadTonken(){
    this.jwToken=localStorage.getItem('tonken');
}

userLogsDeEntreprise(entrepriseId:number){
    this.loadTonken();
    return this.http.get(this.adServer+":8443/userLogsDeEntreprise?entrepriseId="+entrepriseId
    , {headers:new HttpHeaders({'Authorization':this.jwToken})})
    .pipe(map(res => {return res}));
}

saveUserLogs(userLogs:UserLogs){
    this.loadTonken();
    return this.http.post(this.adServer+":8443/userLogs",userLogs
    , {headers:new HttpHeaders({'Authorization':this.jwToken})})
    .pipe(map(res => {return res}));
}

getDetailUserLogs(id:number){
    this.loadTonken();
    return this.http.get(this.adServer+":8443/userLogs/"+id
    , {headers:new HttpHeaders({'Authorization':this.jwToken})})
    .pipe(map(res => {return res}));
}

updateUserLogs(id:number, userLogs:UserLogs){
    this.loadTonken();
   return this.http.put(this.adServer+":8443/userLogs/"+id, userLogs
   , {headers:new HttpHeaders({'Authorization':this.jwToken})})
   .pipe(map(res => {return res}));
}

deleteUserLogs(id:number){
    this.loadTonken();
    return this.http.delete(this.adServer+":8443/userLogs/"+id
    , {headers:new HttpHeaders({'Authorization':this.jwToken})})
    .pipe(map(res => {return res}));
}
}