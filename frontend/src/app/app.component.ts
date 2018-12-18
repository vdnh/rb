import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CTS';
  constructor(private router:Router) { }
  logout(){
    localStorage.clear();
    //this.log=1;
    //window.open("http://192.168.0.131")
    this.router.navigateByUrl('/login');
    //window.close();
  }
}
