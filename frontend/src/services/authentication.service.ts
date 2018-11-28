import { Injectable } from "@angular/core";
//import "rxjs/Rx";
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import {JwtHelper} from '@auth0/angular-jwt'

@Injectable()
export class AuthenticationService{
  
    private host:string="http://localhost:8080"
    private jwToken=null;
    private roles:Array<any>=[];
    constructor(private http:HttpClient){}

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }
    login(user){
        return this.http.post(this.host+"/login", user, { observe: 'response' });
    }

    saveTonken(jwtToken: string): any {
        localStorage.setItem('tonken', jwtToken);
        this.loadTonken();
      }

      getTasks(){
          if(this.jwToken==null) this.loadTonken()
          return this.http.get(this.host+"/tasks", {headers:new HttpHeaders({'Authorization':this.jwToken})});
      }

      logout(): any {
        localStorage.removeItem('tonken');
        this.jwToken=null;
      }
}