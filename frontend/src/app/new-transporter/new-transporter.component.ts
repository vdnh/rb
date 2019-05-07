import { Component, OnInit } from '@angular/core';
import { Transporter } from 'src/model/model.transporter';
import { TransportersService } from '../../services/transporters.service';
import { Contact } from 'src/model/model.contact';
import { Adresse } from 'src/model/model.adresse';
import { AdressesService } from '../../services/adresses.service';
import { ContactsService } from '../../services/contacts.service';

@Component({
  selector: 'app-new-transporter',
  templateUrl: './new-transporter.component.html',
  styleUrls: ['./new-transporter.component.css']
})
export class NewTransporterComponent implements OnInit {
  transporter:Transporter=new Transporter();
  mode:number=1;
  contact:Contact=new Contact();
  adresse:Adresse=new Adresse();
  constructor(public transportersService:TransportersService, public contactsService:ContactsService, public adressesService:AdressesService) { }

  ngOnInit() {
  }

  signUpTransporter(){
    this.transportersService.signUpTransporter(this.transporter).subscribe((data:Transporter)=>{
      this.mode=2;
      this.transporter=data;
      this.contact.id_transporter=this.transporter.id;
      this.adresse.id_transporter=this.transporter.id;
      this.signUpContact();
      this.signUpAdresse();
    }, err=>{
      console.log(err);
    })    
  }
  signUpAdresse(): any {
    this.adressesService.signUpAdresse(this.adresse).subscribe((data:Adresse)=>{
    }, err=>{
      console.log(err);
    })
  }
  signUpContact(): any {
    this.contactsService.signupContact(this.contact).subscribe((data:Contact)=>{
    }, err=>{
      console.log(err);
    })
  }
}
