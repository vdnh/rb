import { Component, OnInit } from '@angular/core';
import { ShipperParticulier } from '../../model/model.shipperParticulier';
import { ShipperParticuliersService } from '../../services/shipperParticuliers.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

import { Contact } from 'src/model/model.contact';
import { ContactsService } from '../../services/contacts.service';

import { Adresse } from 'src/model/model.adresse';
import { AdressesService } from '../../services/adresses.service';
import { AuthenticationService } from 'src/services/authentication.service';
import { AppUser } from 'src/model/model.appUser';

@Component({
  selector: 'app-detail-shipper-particulier',
  templateUrl: './detail-shipper-particulier.component.html',
  styleUrls: ['./detail-shipper-particulier.component.css']
})
export class DetailShipperParticulierComponent implements OnInit {
  role:string="";
  shipperParticulier:ShipperParticulier=new ShipperParticulier();
  id:number; // this is the id of shipper
  //mode:number=1;
  contacts:Array<Contact>;
  adresses:Array<Adresse>;
  addcontact:Contact=new Contact(); // to add more contact
  addadresse:Adresse=new Adresse(); // to add more adresse
  appUser: AppUser;
  constructor(public authenticationService:AuthenticationService, public activatedRoute:ActivatedRoute, public shipperParticuliersService:ShipperParticuliersService, public contactsService:ContactsService,
    public adressesService:AdressesService, public router:Router){    
    this.id=activatedRoute.snapshot.params['id'];
    //this.id=Number(localStorage.getItem('userId'))
  }

  ngOnInit() {
    if(localStorage.getItem('idTransporter')==undefined){
      // this is finded by id dans ShipperParticulier
      this.role=localStorage.getItem('role');
      this.shipperParticuliersService.getDetailShipperParticulier(this.id).subscribe((data:ShipperParticulier)=>{
        if(data!=null) this.shipperParticulier=data;
      }, err=>{
        console.log(err);
      });
    }
    else{
      // this is finded by idTransporter
      this.shipperParticuliersService.getDetailShipperParticulierByIdTransporter(this.id).subscribe((data:ShipperParticulier)=>{
        if(data!=null) this.shipperParticulier=data;
      }, err=>{
        console.log(err);
      });
    }
    
  }

  printPriceList(cmpId){
    let envoy = document.getElementById('toprint').innerHTML;
    const printContent = document.getElementById(cmpId);
    const WindowPrt = window.open();
    WindowPrt.document.write('<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }

  saveShipperParticulier(){
    if(localStorage.getItem('idTransporter')!=undefined)
      this.shipperParticulier.idTransporter = Number(localStorage.getItem('idTransporter'));
    this.shipperParticuliersService.saveShipperParticuliers(this.shipperParticulier).subscribe(data=>{
      alert("C'est enregistre.")
      //this.router.navigate(['']);
    }, err=>{
      console.log(err);
    });
  }
}
