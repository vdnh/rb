import { Component, OnInit } from '@angular/core';
//import { RouterExtensions } from "nativescript-angular/router";
import { AuthenticationService } from 'src/services/authentication.service';
import { Router } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit 
{
//*
  tasks:any;
  shippers:any;
  who:string="CamionExample";
  varMap:string= "https://www.google.com/maps?q=45.568806,+-73.918333";
  varMap2:string= "https://www.google.com/maps?q=45.569234,+-73.918440";

  constructor(private authService:AuthenticationService, private router:Router, private location:Location) { }

  ngOnInit() {
    //this.who=
    /*
    this.authService.getUserInfo().subscribe(data=>{
      console.log("Role name : "+ data.toString())
    },err=>{
      console.log("Role name : null")
    })//*/
    console.log("This is from task, must review to delete!!!")

  }
  myWindow: any;
  onPress(){
    //this.router.
    //this.myWindow.close();
    this.router.navigateByUrl("/");
    //this.location.back();
    //this.myWindow = window.open(this.varMap, "googleWindow");
    //this.myWindow.close();
    //window.close("googleWindow");
  }
  

}
