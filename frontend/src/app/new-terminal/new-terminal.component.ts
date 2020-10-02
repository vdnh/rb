import { Component, OnInit } from '@angular/core';
import { Terminal } from 'src/model/model.terminal';

import { Shipper } from 'src/model/model.shipper';
import { ShippersService } from '../../services/shippers.service';
import { ContactsService } from '../../services/contacts.service';
import { Contact } from 'src/model/model.contact';
import { Adresse } from 'src/model/model.adresse';
import { AdressesService } from '../../services/adresses.service';
import { AuthenticationService } from 'src/services/authentication.service';
import { AppUser } from 'src/model/model.appUser';
import { Router } from '@angular/router';
import * as myGlobals from 'src/services/globals';
import { VarsGlobal } from 'src/services/VarsGlobal';
import { TerminalsService } from 'src/services/terminals.service';

@Component({
  selector: 'app-new-terminal',
  templateUrl: './new-terminal.component.html',
  styleUrls: ['./new-terminal.component.css']
})
export class NewTerminalComponent implements OnInit {

  // shipper:Shipper=new Shipper(); 
  terminal:Terminal=new Terminal();
  // mode:number=1;
  // contact:Contact=new Contact();
  // adresse:Adresse=new Adresse();
  appUser : AppUser = new AppUser();
  role:string="";
  
  listLoginName:Array<string>=[];
  
  // provinceList=myGlobals.provinceList ;
  // villeList= myGlobals.QuebecVilles; //villeList;
  // AlbertaVilles=myGlobals.AlbertaVilles;
  
  // BritishColumbiaVilles=myGlobals.BritishColumbiaVilles;
  
  // ManitobaVilles=myGlobals.ManitobaVilles;
  
  // NewBrunswickVilles=myGlobals.NewBrunswickVilles;
  
  // NewfoundlandLabradorVilles=myGlobals.NewfoundlandLabradorVilles;
  
  // NorthwestTerritoriesVilles=myGlobals.NorthwestTerritoriesVilles;
  
  // NovaScotiaVilles=myGlobals.NovaScotiaVilles;
  
  // NunavutVilles=myGlobals.NunavutVilles;
  
  // OntarioVilles=myGlobals.OntarioVilles;
  
  // PrinceEdwardIslandVilles=myGlobals.PrinceEdwardIslandVilles;
  
  // QuebecVilles=myGlobals.QuebecVilles;
  
  // SaskatchewanVilles=myGlobals.SaskatchewanVilles;
  
  // YukonVilles=myGlobals.YukonVilles;

  constructor(
    // public shippersService:ShippersService,
    
    public terminalsService:TerminalsService, 

    // public contactsService:ContactsService, 
    // public adressesService:AdressesService, 
    public authenticationService:AuthenticationService, 
    public varsGlobal:VarsGlobal,
    public router:Router) { }

  ngOnInit() {
    this.role=localStorage.getItem('role');
    // this.shipper.password='dispatch'; 
    this.terminal.password='terminal';
    if(localStorage.getItem('idTransporter')!=undefined) {
      // this.shipper.idTransporter=Number(localStorage.getItem('idTransporter'))
      this.appUser.idTransporter=Number(localStorage.getItem('idTransporter'))
      this.terminal.idTransporter=Number(localStorage.getItem('idTransporter'))
    }
    // this.adresse.province=this.provinceList[10];
    this.authenticationService.getAllAppUsers().subscribe((data:Array<AppUser>)=>{
      //this.listAppUsers=data;
      data.forEach(aU=>{
        this.listLoginName.push(aU.username)
      })

    }, err=>{console.log(err)})

  }

  // async villeChange(){
  //   //*
  //   if(this.adresse.province!=null){
  //     // check the province to limit the cities
  //     if(this.adresse.province==this.provinceList[0])
  //       this.villeList=this.AlbertaVilles;
  //     if(this.adresse.province==this.provinceList[1])
  //       this.villeList=this.BritishColumbiaVilles;        
  //     if(this.adresse.province==this.provinceList[2])
  //       this.villeList=this.ManitobaVilles;
  //     if(this.adresse.province==this.provinceList[3])
  //       this.villeList=this.NewBrunswickVilles;    
  //     if(this.adresse.province==this.provinceList[4])
  //       this.villeList=this.NewfoundlandLabradorVilles;    
  //     if(this.adresse.province==this.provinceList[5])
  //       this.villeList=this.NorthwestTerritoriesVilles;
  //     if(this.adresse.province==this.provinceList[6])
  //       this.villeList=this.NovaScotiaVilles;
  //     if(this.adresse.province==this.provinceList[7])
  //       this.villeList=this.NunavutVilles;
  //     if(this.adresse.province==this.provinceList[8])
  //       this.villeList=this.OntarioVilles;
  //     if(this.adresse.province==this.provinceList[9])
  //       this.villeList=this.PrinceEdwardIslandVilles;
  //     if(this.adresse.province==this.provinceList[10])
  //       this.villeList=this.QuebecVilles;
  //     if(this.adresse.province==this.provinceList[11])
  //       this.villeList=this.SaskatchewanVilles;  
  //     if(this.adresse.province==this.provinceList[12])
  //       this.villeList=this.YukonVilles;
  //   }
  //   //this.showMap();
  // }
  
  // reformTelEvent(tel:any){
  //   if(tel.target.value.indexOf('-')<0)
  //     {
  //       let sub1 = tel.target.value.substr(0,3)
  //       let sub2 = tel.target.value.substr(3,3)
  //       let sub3 = tel.target.value.substr(6,tel.target.value.length-6)
  //       tel.target.value=sub1+'-'+sub2+'-'+sub3
  //     }
  //   return tel.target.value;
  // }

  onNameChange(){
    // this.shipper.loginName=this.shipper.nom.trim().replace(/\s/g,"").toLowerCase();
    this.terminal.loginName=this.terminal.name.trim().replace(/\s/g,"").toLowerCase();
  }
  
  onCreateUser(){
    // this.appUser.username=this.shipper.loginName
    // this.appUser.password=this.shipper.password

    this.appUser.username=this.terminal.loginName
    this.appUser.password=this.terminal.password
    this.appUser.roleSimple='TERMINAL'
    this.appUser.idUser=this.terminal.idTransporter.toString()
    // this.appUser.idUser=this.shipper.id.toString()
    // this.appUser.entrepriseNom=this.shipper.nom
    this.authenticationService.createAppUser(this.appUser).subscribe((data:AppUser)=>{
      this.appUser = new AppUser();
      console.log('User was created.')
    }, err=>{
      console.log(err);
    });
  }
  
  signUpTerminal(){
    let exist=false; // this loginName doesn't exist yet
    this.listLoginName.forEach(loginName=>{
      if(loginName.includes(this.terminal.loginName)&&(loginName.length==this.terminal.loginName.length))
        {
          alert("Username existed Already. Choose another Username, please!");
          exist=true; // this loginName exist already
        }
    })
    if(this.terminal.password.length<4)
      alert('Password must have at least 4 characteres!')

    if(!exist && this.terminal.password.length>=4){
      this.terminalsService.saveTerminals(this.terminal).subscribe((data:Terminal)=>{
        // this.mode=2;
        this.terminal=data;
        this.onCreateUser();
        // this.contact.id_shipper=this.shipper.id;
        // this.adresse.id_shipper=this.shipper.id;
        // this.signUpContact();
        // this.signUpAdresse();
        // if(this.role.includes('DISPATCH')) 
        //   this.router.navigate(['']);
        // else 
          this.router.navigate(['/terminals']);  //this.mode=2;
      }, err=>{
        console.log(err);
      });
    }
  }

  // signUpContact(){
  //   this.contactsService.signupContact(this.contact).subscribe((data:Contact)=>{
  //   }, err=>{
  //     console.log(err);
  //   })    
  // }

  // signUpAdresse(){
  //   this.adressesService.signUpAdresse(this.adresse).subscribe((data:Adresse)=>{

  //   }, err=>{
  //     console.log(err);
  //   })
  // }

}
