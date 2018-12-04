import { Injectable } from "@angular/core";
//import "rxjs/Rx";
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import {JwtHelper} from '@auth0/angular-jwt'

@Injectable()
export class AuthenticationService{
  
    private host:string="http://localhost:8080";
    private hostUserInfo:string="http://localhost:8080/userInfo/";
    private jwToken=null;
    private roles:Array<any>=[];
    private userName : string = "";

    constructor(private http:HttpClient){}

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }
    login(user){
        this.userName=user.username;
        //console.log(this.userName);
        return this.http.post(this.host+"/login", user, { observe: 'response' });
    }

    getUserInfo(){
        //return this.http.post(this.hostUserInfo, this.userName, { observe: 'response' });
        return this.http.get(this.hostUserInfo+ this.userName, {headers:new HttpHeaders({'Authorization':this.jwToken})});
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

      createShipper(){

      }

      logout(): any {
        localStorage.removeItem('tonken');
        this.jwToken=null;
      }
}