import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CTS';
  //static log=1;
  logout(){
    localStorage.clear();
    //this.log=1;
    window.open("http://localhost:4200/login")
    window.close();
  }
}
