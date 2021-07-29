import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { MachineSpecs } from "../model/model.machineSpecs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as myGlobals from './globals'; //<==== to use variables from globals.ts

@Injectable()
export class MachineSpecsService{
  
    adServer=myGlobals.adServer; 
    private jwToken=null;

    constructor(public http:HttpClient){
    }

    loadTonken(){
        this.jwToken=localStorage.getItem('tonken');
    }
    
    // for each transporter - identified by idTransporter
    getAllLightMachines(idTransporter:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/allLightMachines?idTransporter="+idTransporter, {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    saveMachineSpecs(machineSpecs:MachineSpecs){
        this.loadTonken();
        return this.http.post(this.adServer+":8080/machines", machineSpecs
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    getDetailMachineSpecs(id:number){
        this.loadTonken();
        return this.http.get(this.adServer+":8080/machines/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }

    updateMachineSpecs(id:number, ms:MachineSpecs){
        this.loadTonken();
       return this.http.put(this.adServer+":8080/machines/"+id, ms
       , {headers:new HttpHeaders({'Authorization':this.jwToken})})
       .pipe(map(res => {return res}));
    }

    deleteMachineSpecs(id:number){
        this.loadTonken();
        return this.http.delete(this.adServer+":8080/machines/"+id
        , {headers:new HttpHeaders({'Authorization':this.jwToken})})
        .pipe(map(res => {return res}));
    }
}