import { Component, OnInit } from '@angular/core';
import {Shipper} from '../model/shipper'
import { from } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  //user: User = new User();
  shipperUrl ='http://localhost:8080/shippers/';
  shipper : Shipper = new Shipper();
  constructor(private http:HttpClient) { }

  ngOnInit() {
  }
/*
  createUser(): void {
    this.userService.createUser(this.user)
        .subscribe( data => {
          alert("User created successfully.");
        });
  };//*/

  createShipper(){
    console.log(this.shipper)
    return this.http.post<Shipper>(this.shipperUrl, this.shipper)
    .subscribe( data => {
      alert("Shipper created successfully.");
    });
  }
  onRegister(shipper:Shipper){
    //this.dataService.login(dataForm)
    //.subscribe(resp=>{
        //let jwtToken=resp.headers.get('Authorization');
        //this.authService.saveTonken(jwtToken);
        //this.authService.getTasks();
    }

}
