import { Component, OnInit } from '@angular/core';
import {Shipper} from '../model/shipper'
import { from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
//import { Address } from 'cluster';
import { Adresse } from '../model/adresse';
import { Contact } from '../model/contact';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  //user: User = new User();
  shipperUrl ='http://192.168.0.131:8080/shippers/';
  adresseUrl ='http://192.168.0.131:8080/adresses/';
  contactUrl ='http://192.168.0.131:8080/contacts/';
  shipper : Shipper = new Shipper();
  adresse : Adresse = new Adresse();
  contact : Contact = new Contact();

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
      //alert(data.toString());
      this.shipper = data;
      //alert("shipper id : "+this.shipper.id)
      console.log(this.shipper);
      this.createAdresse();
      this.createContact();
    });
  }

  createAdresse(){
    console.log(this.adresse)
    return this.http.post<Adresse>(this.adresseUrl, this.adresse)
    .subscribe( data => {
      alert("Adresse created successfully.");
    });
  }

  createContact(){
    console.log(this.contact)
    return this.http.post<Contact>(this.contactUrl, this.contact)
    .subscribe( data => {
      alert("Contact created successfully.");
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
