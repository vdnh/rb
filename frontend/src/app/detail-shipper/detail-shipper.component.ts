import { Component, OnInit } from '@angular/core';
import { Shipper } from '../../model/model.shipper';
import { ShippersService } from '../../services/shippers.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Alert } from 'selenium-webdriver';
import { Contact } from 'src/model/model.contact';
import { ContactsService } from '../../services/contacts.service';
import { forEach } from '@angular/router/src/utils/collection';
import { Location } from '@angular/common';
import { Adresse } from 'src/model/model.adresse';
import { AdressesService } from '../../services/adresses.service';

@Component({
  selector: 'app-detail-shipper',
  templateUrl: './detail-shipper.component.html',
  styleUrls: ['./detail-shipper.component.css']
})
export class DetailShipperComponent implements OnInit {
  quitButton:string="";
  shipper:Shipper=new Shipper();
  id:number; // this is the id of shipper
  mode:number=1;
  contacts:Array<Contact>;
  adresses:Array<Adresse>;
  addcontact:Contact=new Contact(); // to add more contact
  addadresse:Adresse=new Adresse(); // to add more adresse
  constructor(public activatedRoute:ActivatedRoute, public shippersService:ShippersService, public contactsService:ContactsService,
    public adressesService:AdressesService){    
    this.id=activatedRoute.snapshot.params['id'];
    //this.id=Number(localStorage.getItem('userId'))
  }

  ngOnInit() {
    this.quitButton=localStorage.getItem('role');
    this.shippersService.getDetailShipper(this.id).subscribe((data:Shipper)=>{
      this.shipper=data;
      if(localStorage.getItem('role').includes('TRANSPORTER')){  // in the cas Transporter want to view detail contact
        this.mode=3;
      }
      else{ // in the cas Shipper want to view detail himsefl
        this.mode=1;
        localStorage.setItem('nom', this.shipper.nom);
        localStorage.setItem('tel', this.shipper.tel.toString());
        localStorage.setItem('email', this.shipper.email);
      }
    }, err=>{
      console.log(err);
    });
    this.contactsService.contactsDeShipper(this.id).subscribe((data:Array<Contact>)=>{
      this.contacts=data;
    }, err=>{
      console.log(err);
    });
    this.adressesService.adressesDeShipper(this.id).subscribe((data:Array<Adresse>)=>{
      this.adresses=data;
      // this.adresses.forEach(a=>{
      //   console.log("Adress : "+a.num+" "+a.rue )
      // })
    }, err=>{
      console.log();
    });
  }
  saveShipper(){
    this.shippersService.saveShippers(this.shipper).subscribe(data=>{
      //alert("Mise a jour.");
      this.mode=2;
    }, err=>{
      console.log(err);
    });
    this.contacts.forEach(obj => {
      this.contactsService.saveContacts(obj).subscribe(data=>{
      }, err=>{
        console.log(err)
      })
    });    
    this.adresses.forEach(obj => {
      this.adressesService.saveAdresses(obj).subscribe(data=>{
      }, err=>{
        console.log(err)
      })
    });
  }

  addContact(){
    this.addcontact.id_shipper=this.id;
    this.contactsService.saveContacts(this.addcontact).subscribe((data:Contact)=>{
      alert("Adresse added.");
      this.contacts.push(data)
    }, err=>{
      console.log(err)
    })
  }

  deleteContact(id:number){
    this.contactsService.deleteContact(id).subscribe((data:Contact)=>{
      alert("Contact : "+this.addcontact.nom+" a ete supprime.");
      this.contacts.splice(this.contacts.indexOf(data),1)
      //this.demandes.splice(this.demandes.indexOf(demande), 1)
    }, err=>{
      console.log(err);
    });
  }

  addAdresse(){
    this.addadresse.id_shipper=this.id;
    this.adressesService.saveAdresses(this.addadresse).subscribe((data:Adresse)=>{
      alert("Adresse added.");
      this.adresses.push(data)
    }, err=>{
      console.log(err)
    })
  }

  deleteAdresse(id:number){
    this.adressesService.deleteAdresse(id).subscribe((data:Adresse)=>{
      alert("Adresse : "+this.addadresse.num+" a ete supprime.");
      this.adresses.splice(this.adresses.indexOf(data),1)
    }, err=>{
      console.log(err);
    });
  }  

  refresh(): void {
    //window.location.reload();
  }
}
