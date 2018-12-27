import { Component, OnInit } from '@angular/core';
import { Transporter } from '../../model/model.transporter';
import { TransportersService } from '../../services/transporters.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Alert } from 'selenium-webdriver';
import { Contact } from 'src/model/model.contact';
import { Adresse } from 'src/model/model.adresse';
import { ContactsService } from '../../services/contacts.service';
import { AdressesService } from '../../services/adresses.service';

@Component({
  selector: 'app-detail-transoprter',
  templateUrl: './detail-transporter.component.html',
  styleUrls: ['./detail-transporter.component.css']
})
export class DetailTransporterComponent implements OnInit {

  transporter:Transporter=new Transporter();
  id:number;
  mode:number=1;
  contacts:Array<Contact>;
  adresses:Array<Adresse>;
  addcontact:Contact=new Contact(); // to add more contact
  addadresse:Adresse=new Adresse(); // to add more adresse
  constructor(public activatedRoute:ActivatedRoute, public transportersService:TransportersService, public contactsService:ContactsService,
    public adressesService:AdressesService, private router:Router){    
    this.id=activatedRoute.snapshot.params['id'];
  }

  ngOnInit() {
    this.transportersService.getDetailTransporter(this.id).subscribe((data:Transporter)=>{
      this.transporter=data;
      this.mode=1;
    }, err=>{
      console.log(err);
    });
    this.contactsService.contactsDeTransporter(this.id).subscribe((data:Array<Contact>)=>{
      this.contacts=data;
    }, err=>{
      console.log(err);
    });
    this.adressesService.adressesDeTransporter(this.id).subscribe((data:Array<Adresse>)=>{
      this.adresses=data;
      // this.adresses.forEach(a=>{
      //   console.log("Adress : "+a.num+" "+a.rue )
      // })
    }, err=>{
      console.log();
    });    
  }
  saveTransporter(){
    this.transportersService.saveTransporters(this.transporter).subscribe(data=>{
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
    this.addcontact.id_transporter=this.id;
    this.contactsService.saveContacts(this.addcontact).subscribe(data=>{
      alert("Contact added.");
      this.refresh()
    }, err=>{
      console.log(err)
    })
  }

  deleteContact(id:number){
    this.contactsService.deleteContact(id)
    .subscribe(data=>{
      alert("Contact : "+this.addcontact.nom+" a ete supprime.");
      this.refresh();
    }, err=>{
      console.log(err);
    });
  }

  addAdresse(){
    this.addadresse.id_transporter=this.id;
    this.adressesService.saveAdresses(this.addadresse).subscribe(data=>{
      alert("Adresse added.");
      this.refresh()
    }, err=>{
      console.log(err)
    })
  }

  deleteAdresse(id:number){
    this.adressesService.deleteAdresse(id)
    .subscribe(data=>{
      alert("Adresse : "+this.addadresse.num+" a ete supprime.");
      this.refresh();
    }, err=>{
      console.log(err);
    });
  }  
 
  myWindow: any;
  onPress(){
    //this.myWindow.close();
    //this.myWindow = window.open("http://192.168.0.131:8088/", "Ma Carte");
    this.router.navigateByUrl("/map");
    //this.myWindow.close();
    //window.close("googleWindow");
  }
  
  refresh(): void {
    window.location.reload();
  }
}
