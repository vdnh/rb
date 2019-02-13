import { Component, OnInit } from '@angular/core';
import { Voyage } from 'src/model/model.voyage';
import { Transporter } from 'src/model/model.transporter';
import { Contact } from 'src/model/model.contact';
import { Adresse } from 'src/model/model.adresse';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsService } from 'src/services/contacts.service';
import { AdressesService } from 'src/services/adresses.service';
import { VoyagesService } from 'src/services/voyages.service';
import { TransportersService } from 'src/services/transporters.service';

@Component({
  selector: 'app-detail-voyage',
  templateUrl: './detail-voyage.component.html',
  styleUrls: ['./detail-voyage.component.css']
})
export class DetailVoyageComponent implements OnInit {

  role:string="";
  voyage:Voyage=new Voyage();
  transporter:Transporter=new Transporter();
  id:number; // this is the id of voyage
  mode:number=1;
  contacts:Array<Contact>;
  adresses:Array<Adresse>;

  constructor(public activatedRoute:ActivatedRoute, public contactsService:ContactsService,
    public adressesService:AdressesService, public voyagesService:VoyagesService, 
    public transportersService : TransportersService, public router:Router){    
    this.id=activatedRoute.snapshot.params['id'];
  }

  async ngOnInit() {
    //this.role=localStorage.getItem('role');
    await this.voyagesService.getDetailVoyage(this.id).subscribe((data:Voyage)=>{
      this.voyage=data;
     /*if(this.demande.roleDemander.includes('SHIPPER')){
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
      }//*/
      //if(this.demande.roleDemander.includes('TRANSPORTER')){
        this.transportersService.getDetailTransporter(this.voyage.idTransporter).subscribe((data:Transporter)=>{
          this.transporter=data;
        }, err=>{
          console.log(err);
        });
        this.contactsService.contactsDeTransporter(this.voyage.idTransporter).subscribe((data:Array<Contact>)=>{
          this.contacts=data;
        }, err=>{
          console.log(err);
        });
        this.adressesService.adressesDeTransporter(this.voyage.idTransporter).subscribe((data:Array<Adresse>)=>{
          this.adresses=data;
        }, err=>{
          console.log();
        });
      }
    //}
    , err=>{
      console.log(err)
    })
  }

}
