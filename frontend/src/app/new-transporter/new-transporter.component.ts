import { Component, OnInit } from '@angular/core';
import { Transporter } from 'src/model/model.transporter';
import { TransportersService } from '../../services/transporters.service';
import { Contact } from 'src/model/model.contact';
import { Adresse } from 'src/model/model.adresse';
import { AdressesService } from '../../services/adresses.service';
import { ContactsService } from '../../services/contacts.service';
import { VarsGlobal } from 'src/services/VarsGlobal';
import { Shipper } from 'src/model/model.shipper';
import { AppUser } from 'src/model/model.appUser';
import * as myGlobals from 'src/services/globals';

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
  
  shipper:Shipper=new Shipper();
  
  contacts:Array<Contact>=[];
  adresses:Array<Adresse>=[];
  
  appUser : AppUser = new AppUser();
  role:string="";
  //listAppUsers : Array<AppUser> = [];
  listLoginName:Array<string>=[];
  
  provinceList=myGlobals.provinceList ;
  villeList= myGlobals.QuebecVilles; //villeList;
  AlbertaVilles=myGlobals.AlbertaVilles;
  
  BritishColumbiaVilles=myGlobals.BritishColumbiaVilles;
  
  ManitobaVilles=myGlobals.ManitobaVilles;
  
  NewBrunswickVilles=myGlobals.NewBrunswickVilles;
  
  NewfoundlandLabradorVilles=myGlobals.NewfoundlandLabradorVilles;
  
  NorthwestTerritoriesVilles=myGlobals.NorthwestTerritoriesVilles;
  
  NovaScotiaVilles=myGlobals.NovaScotiaVilles;
  
  NunavutVilles=myGlobals.NunavutVilles;
  
  OntarioVilles=myGlobals.OntarioVilles;
  
  PrinceEdwardIslandVilles=myGlobals.PrinceEdwardIslandVilles;
  
  QuebecVilles=myGlobals.QuebecVilles;
  
  SaskatchewanVilles=myGlobals.SaskatchewanVilles;
  
  YukonVilles=myGlobals.YukonVilles;

  shippers: Array<Shipper>=[];

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
 
  // signUpContact(): any {
  //   this.contactsService.signupContact(this.contact).subscribe((data:Contact)=>{
  //     console.log("Created Contact")
  //     this.contact=new Contact()
  //   }, err=>{
  //     console.log(err);
  //   })
  // }

  signUpContact(){
    if(this.contacts.length>0)
      this.contacts.forEach(ct=>{
        ct.id_shipper=this.shipper.id;
        this.contactsService.signupContact(ct).subscribe((data:Contact)=>{}, 
        err=>{console.log(err);})   
      })  
  }

  reformTelEvent(tel:any){
    if(tel.target.value.indexOf('-')<0)
      {
        let sub1 = tel.target.value.substr(0,3)
        let sub2 = tel.target.value.substr(3,3)
        let sub3 = tel.target.value.substr(6,tel.target.value.length-6)
        tel.target.value=sub1+'-'+sub2+'-'+sub3
      }
    return tel.target.value;
  }

  async villeChange(){
    //*
    if(this.adresse.province!=null){
      // check the province to limit the cities
      if(this.adresse.province==this.provinceList[0])
        this.villeList=this.AlbertaVilles;
      if(this.adresse.province==this.provinceList[1])
        this.villeList=this.BritishColumbiaVilles;        
      if(this.adresse.province==this.provinceList[2])
        this.villeList=this.ManitobaVilles;
      if(this.adresse.province==this.provinceList[3])
        this.villeList=this.NewBrunswickVilles;    
      if(this.adresse.province==this.provinceList[4])
        this.villeList=this.NewfoundlandLabradorVilles;    
      if(this.adresse.province==this.provinceList[5])
        this.villeList=this.NorthwestTerritoriesVilles;
      if(this.adresse.province==this.provinceList[6])
        this.villeList=this.NovaScotiaVilles;
      if(this.adresse.province==this.provinceList[7])
        this.villeList=this.NunavutVilles;
      if(this.adresse.province==this.provinceList[8])
        this.villeList=this.OntarioVilles;
      if(this.adresse.province==this.provinceList[9])
        this.villeList=this.PrinceEdwardIslandVilles;
      if(this.adresse.province==this.provinceList[10])
        this.villeList=this.QuebecVilles;
      if(this.adresse.province==this.provinceList[11])
        this.villeList=this.SaskatchewanVilles;  
      if(this.adresse.province==this.provinceList[12])
        this.villeList=this.YukonVilles;
    }
  }

  addContact(){
    if(this.contact.nom.length>0 || this.contact.prenom.length>0)
    this.contacts.push(this.contact)
    this.contact=new Contact()
  }

  checkValidTransporter(){
    if(
      this.transporter.nom.length>0 && this.transporter.email.length>0 && this.transporter.tel.length>0
      &&
      this.adresse.rue.length>0 && this.adresse.ville.length>0 && this.adresse.province.length>0
      &&
      this.contacts.length>0
    )
    {
      return true;
    }
    return false;
  }
}
