import { Injectable } from "@angular/core";
//import "rxjs/Rx";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
//import { Role } from 'src/model/model.role';
//import {JwtHelper} from '@auth0/angular-jwt'
import * as myGlobals from './globals'; //<==== to use variables from globals.ts
import { AppUser } from 'src/model/model.appUser';

@Injectable()
export class AuthenticationService{
  
    private host:string=myGlobals.host; //"http://192.168.0.131:8080";
    private hostUserInfo:string=myGlobals.hostUserInfo; //"http://192.168.0.131:8080/users/";
    private jwToken=null;
    public role:string;
    private userName : string = "";

    constructor(private http:HttpClient){}

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }
    
    getAllAppUsers()    //
    {    
      this.loadTonken();
      return this.http.get(this.host+"/users", {headers:new HttpHeaders({'Authorization':this.jwToken})})
      .pipe(map(resp =>{
          return resp;
      }))
    }
    getAllUsersByIdUser(idUser:number){
      this.loadTonken();
      return this.http.get(this.host+"/users", {headers:new HttpHeaders({'Authorization':this.jwToken})})
      .pipe(map(resp =>{
          return resp;
      }))
    }

    modifyAppUser(appUser:AppUser){
      this.loadTonken();
      return this.http.post(this.host+"/userModify",appUser
      , {headers:new HttpHeaders({'Authorization':this.jwToken})})
      .pipe(map(res => {return res;}));
    }

    deleteAppUser(appUser:AppUser){
      this.loadTonken();
      return this.http.post(this.host+"/userDelete",appUser
      , {headers:new HttpHeaders({'Authorization':this.jwToken})})
      .pipe(map(res => {return res;}));
    }
    
    createAppUser(appUser:AppUser){
      this.loadTonken();
      return this.http.post(this.host+"/users",appUser
      , {headers:new HttpHeaders({'Authorization':this.jwToken})})
      .pipe(map(res => {return res;}));
    }

    login(user){
        this.userName=user.username;
        //console.log(this.userName);
        return this.http.post(this.host+"/login", user, { observe: 'response' });
    }

    loginDefaultDriver(user){
      //var user: any;
      //user.username="dispatch2";
      //user.password="dispatch2";
      this.userName=user.username;
      //console.log(this.userName);
      return this.http.post(this.host+"/login", user, { observe: 'response' });
  }

    getUserInfo(){
        //console.log("From authentication services, getUserInfo() : "+this.hostUserInfo+ this.userName + " "+this.jwToken)
        return this.http.get(this.hostUserInfo+ this.userName, {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
        //*/
    }

    saveTonken(jwtToken: string): any {
        localStorage.setItem('tonken', jwtToken);
        this.loadTonken();
      }

      getTasks(){
          if(this.jwToken==null) this.loadTonken()
          return this.http.get(this.host+"/tasks", {headers:new HttpHeaders({'Authorization':this.jwToken})});
      }

      getShippers(){
        //if(this.jwToken==null) this.loadTonken() // we don't need the authorization for access to shipper
        return this.http.get(this.host+"/shippers");//, {headers:new HttpHeaders({'Authorization':this.jwToken})});
      }

      logout(): any {
        localStorage.removeItem('tonken');
        this.jwToken=null;
      }
}
export interface User{
  username:string;
  password:string;
}