import { Component, OnInit } from '@angular/core';
import { Shipper } from 'src/model/model.shipper';
import { ShippersService } from '../../services/shippers.service';
import { ContactsService } from '../../services/contacts.service';
import { Contact } from 'src/model/model.contact';
import { Adresse } from 'src/model/model.adresse';
import { AdressesService } from '../../services/adresses.service';

@Component({
  selector: 'app-new-shipper',
  templateUrl: './new-shipper.component.html',
  styleUrls: ['./new-shipper.component.css']
})
export class NewShipperComponent implements OnInit {
  shipper:Shipper=new Shipper();
  mode:number=1;
  contact:Contact=new Contact();
  adresse:Adresse=new Adresse();
  constructor(public shippersService:ShippersService, public contactsService:ContactsService, public adressesService:AdressesService) { }

  ngOnInit() {
  }

  signUpShipper(){
    this.shippersService.signUpShipper(this.shipper).subscribe((data:Shipper)=>{
      this.mode=2;
      this.shipper=data;
      this.contact.id_shipper=this.shipper.id;
      this.adresse.id_shipper=this.shipper.id;
      this.signUpContact();
      this.signUpAdresse();
    }, err=>{
      console.log(err);
    });
  }

  signUpContact(){
    this.contactsService.signupContact(this.contact).subscribe((data:Contact)=>{
    }, err=>{
      console.log(err);
    })    
  }

  signUpAdresse(){
    this.adressesService.signUpAdresse(this.adresse).subscribe((data:Adresse)=>{

    }, err=>{
      console.log(err);
    })
  }
}
