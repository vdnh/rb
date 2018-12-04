import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  tasks:any;
  shippers:any;
  who:string="Who";

  constructor(private authService:AuthenticationService, private router:Router) { }

  ngOnInit() {
    //this.who=
    this.authService.getUserInfo()
    .subscribe(data=>{
      this.tasks=data;
      console.log(this.tasks)
    }, err=>{
      console.log("I don't know who you are!!");
      //this.router.navigateByUrl('/login');  
    })
    //*
    this.authService.getTasks()
    .subscribe(data=>{
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

}
