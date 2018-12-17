import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/services/authentication.service';
import { Router } from '@angular/router';

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

  constructor(private authService:AuthenticationService, private router:Router) { }

  ngOnInit() {
    //this.who=
    this.authService.getUserInfo().subscribe(data=>{
      console.log("Role name : "+ data.toString())
    },err=>{
      console.log("Role name : null")
    })
    /*
    .subscribe(data=>{
      this.who=data.toString();
      console.log(this.who)
    }, err=>{
      console.log("I don't know who you are!!");
      //this.router.navigateByUrl('/login');  
    })//*/
    /*
    this.authService.getTasks().subscribe(data=>{
      this.tasks=data;
      console.log(this.tasks);
      }, err=>{
      //this.authService.logout();
      this.router.navigateByUrl('/login');
      });
    //*/
    /*
    this.authService.getShippers()
    .subscribe(shippers=>{this.shippers=shippers;
    console.log(this.shippers);
    }, err=>{
      this.router.navigateByUrl('/login');
    });
    //*/
  }
  myWindow: any;
  onPress(){
    //this.myWindow.close();
    this.myWindow = window.open(this.varMap, "googleWindow");
    //this.myWindow.close();
    //window.close("googleWindow");
  }
  

}
