import { Component, OnInit } from '@angular/core';
import { Transporter } from 'src/model/model.transporter';
import { TransportersService } from '../../services/transporters.service';
import { Contact } from 'src/model/model.contact';
import { Adresse } from 'src/model/model.adresse';
import { AdressesService } from '../../services/adresses.service';
import { ContactsService } from '../../services/contacts.service';
import { VarsGlobal } from 'src/services/VarsGlobal';

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
  constructor(public transportersService:TransportersService, public contactsService:ContactsService, 
    public varsGlobal:VarsGlobal, public adressesService:AdressesService) { }

  ngOnInit() {
  }

  signUpTransporter(){
    this.transportersService.signUpTransporter(this.transporter).subscribe((data:Transporter)=>{
      // this.mode=2;
      console.log("Created Transporter")
      this.transporter=new Transporter();
      this.contact.id_transporter=data.id;
      this.adresse.id_transporter=data.id;
      
      const promise = ()=>{ return new Promise((resolve, reject)=>{
          // this.signUpAdresse();
          this.adressesService.signUpAdresse(this.adresse).subscribe((data:Adresse)=>{
            // console.log("Created Address")
            this.adresse= new Adresse();
            // console.log("Im before resolve");
            resolve('Ok, Im in resolve'); //()=>{this.signUpAdresse();})
          }, err=>{
            console.log(err);
          })
        });
      }
      promise().then((data)=>{
        // console.log("Im after of : " + data)
        this.signUpContact();
      })
      
      // this.signUpContact();
      // this.signUpAdresse();
    }, err=>{
      console.log(err);
    })    
  }
  signUpAdresse(): any {
    this.adressesService.signUpAdresse(this.adresse).subscribe((data:Adresse)=>{
      console.log("Created Address")
      this.adresse= new Adresse();
    }, err=>{
      console.log(err);
    })
  }
  signUpContact(): any {
    this.contactsService.signupContact(this.contact).subscribe((data:Contact)=>{
      console.log("Created Contact")
      this.contact=new Contact()
    }, err=>{
      console.log(err);
    })
  }

  checkValidTransporter(){
    if(
      this.transporter.nom.length>0 && this.transporter.email.length>0 && this.transporter.tel.length>0
      &&
      this.adresse.rue.length>0 && this.adresse.ville.length>0 && this.adresse.province.length>0
      &&
      this.contact.nom.length>0 && this.contact.prenom.length>0
    )
    {
      return true;
    }
    return false;
  }
}
