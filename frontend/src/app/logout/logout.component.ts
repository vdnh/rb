import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
// declare  var app: AppComponent;
// declare var Fingerprint2: any;

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(public router:Router,) { }



  ngOnInit(){
    let langTemp = localStorage.getItem('language');
    localStorage.clear();
    localStorage.setItem('language', langTemp);
    // location.href=location.href.split("logout")[0]
    location.reload();
    // app.logout();
  }

}
