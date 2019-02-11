import { Component, OnInit } from '@angular/core';
import { Transporter } from 'src/model/model.transporter';
import { Shipper } from 'src/model/model.shipper';
import { Demande } from 'src/model/model.demande';
import { Contact } from 'src/model/model.contact';
import { Adresse } from 'src/model/model.adresse';
import { ActivatedRoute, Router } from '@angular/router';
import { ShippersService } from '../../services/shippers.service';
import { TransportersService } from '../../services/transporters.service';
import { ContactsService } from '../../services/contacts.service';
import { forEach } from '@angular/router/src/utils/collection';
import { Location } from '@angular/common';
import { AdressesService } from '../../services/adresses.service';
import { DemandesService } from 'src/services/demandes.service';


@Component({
  selector: 'app-detail-demande',
  templateUrl: './detail-demande.component.html',
  styleUrls: ['./detail-demande.component.css']
})
export class DetailDemandeComponent implements OnInit {

  role:string="";
  demande:Demande=new Demande();
  shipper:Shipper=new Shipper();
  transporter:Transporter=new Transporter();
  id:number; // this is the id of shipper
  mode:number=1;
  contacts:Array<Contact>;
  adresses:Array<Adresse>;

  constructor(public activatedRoute:ActivatedRoute, public shippersService:ShippersService, public contactsService:ContactsService,
    public adressesService:AdressesService, public demandesService:DemandesService, 
    public transportersService : TransportersService, public router:Router){    
    this.id=activatedRoute.snapshot.params['id'];
  }

  async ngOnInit() {
    //this.role=localStorage.getItem('role');
    await this.demandesService.getDetailDemande(this.id).subscribe((data:Demande)=>{
      this.demande=data;
      if(this.demande.roleDemander.includes('SHIPPER')){
        this.shippersService.getDetailShipper(this.demande.idDemander).subscribe((data:Shipper)=>{
          this.shipper=data;
        }, err=>{
          console.log(err);
        });
        this.contactsService.contactsDeShipper(this.demande.idDemander).subscribe((data:Array<Contact>)=>{
          this.contacts=data;
        }, err=>{
          console.log(err);
        });
        this.adressesService.adressesDeShipper(this.demande.idDemander).subscribe((data:Array<Adresse>)=>{
          this.adresses=data;
        }, err=>{
          console.log();
        });
      }
      if(this.demande.roleDemander.includes('TRANSPORTER')){
        this.transportersService.getDetailTransporter(this.demande.idDemander).subscribe((data:Transporter)=>{
          this.transporter=data;
        }, err=>{
          console.log(err);
        });
        this.contactsService.contactsDeTransporter(this.demande.idDemander).subscribe((data:Array<Contact>)=>{
          this.contacts=data;
        }, err=>{
          console.log(err);
        });
        this.adressesService.adressesDeTransporter(this.demande.idDemander).subscribe((data:Array<Adresse>)=>{
          this.adresses=data;
        }, err=>{
          console.log();
        });
      }
    }
    , err=>{
      console.log(err)
    })
  }

}
