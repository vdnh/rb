import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onRegister(dataForm){
    //this.dataService.login(dataForm)
    //.subscribe(resp=>{
        //let jwtToken=resp.headers.get('Authorization');
        //this.authService.saveTonken(jwtToken);
        //this.authService.getTasks();
    }

}
