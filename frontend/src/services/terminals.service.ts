import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Terminal } from "../model/model.terminal";
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Observable } from 'rxjs';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts
import { FormBuilder } from '@angular/forms';
import { AuthenticationService } from './authentication.service';
import { AppComponent } from 'src/app/app.component';
// declare  var app: AppComponent;

@Injectable()
export class TerminalsService{
  
    adServer=myGlobals.adServer; //"//192.168.0.131";
    private jwToken=null;

    constructor(private authService:AuthenticationService, public http:HttpClient, 
        private fb:FormBuilder,){

    }
    
    app: AppComponent;
    tryingAskTonken=0;
    loadTonken(){ // 
        this.tryingAskTonken++;
        let timeStart = Number(localStorage.getItem('timeStart'));
        let presentTime = new Date().getTime(); // in millisecond
        // ask tonken each 21 hours, if always don't move, terminal will ask after 22 hours by terminal.component
        // test in 1m - 60000
        if((presentTime-timeStart)>(60000*60*21)) // 60000*60*21 = 1m*60*21 = 21h
        {
            let form = this.fb.group({
                username:localStorage.getItem('usernameLogin'),
                password:'terminal'
              })
            let user=form.value;
            this.authService.loginDefaultDriver(user).subscribe(resp=> {
                let jwtToken=resp.headers.get('Authorization');
                this.authService.saveTonken(jwtToken);
                this.jwToken=localStorage.getItem('tonken');
                localStorage.setItem('timeStart',presentTime.toString())  
                this.tryingAskTonken=0; // reset tryingAskTonken = 0
                console.log("Just ask again tonken!")
            },err=>{
                if(this.tryingAskTonken<4)  // we try 3 times
                {
                    this.loadTonken()
                }
                else{ // after 3 times, we logout to do not loose the data
                    let langTemp = localStorage.getItem('language');
                    localStorage.clear();
                    localStorage.setItem('language', langTemp);
                    location.reload();
                }
                // console.log(err);  
            });//*/

            
        }
         else this.jwToken=localStorage.getItem('tonken');
    }
    
    terminalsDeTransporter(idTransporter:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/terminalsDeTransporter?idTransporter="+idTransporter
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveTerminals(terminal:Terminal){
        this.loadTonken();
        return this.http.post(this.adServer+":8443/terminals",terminal
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailTerminal(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8443/terminals/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateTerminal(id:number, c:Terminal){
        this.loadTonken();
       return this.http.put(this.adServer+":8443/terminals/"+id, c
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteTerminal(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8443/terminals/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}