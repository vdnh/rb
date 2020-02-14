import { Component, OnInit } from '@angular/core';
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

  constructor(public shippersService:ShippersService, public contactsService:ContactsService, 
    public adressesService:AdressesService, public authenticationService:AuthenticationService, public router:Router) { }

  ngOnInit() {
    this.role=localStorage.getItem('role');
    this.shipper.password='dispatch';
    this.adresse.province=this.provinceList[10];
    this.authenticationService.getAllAppUsers().subscribe((data:Array<AppUser>)=>{
      //this.listAppUsers=data;
      data.forEach(aU=>{
        this.listLoginName.push(aU.username)
      })

    }, err=>{console.log(err)})

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
    //this.showMap();
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

  onNameChange(){
    this.shipper.loginName=this.shipper.nom.trim().replace(/\s/g,"").toLowerCase();
  }
  
  onCreateUser(){
    this.appUser.username=this.shipper.loginName
    this.appUser.password=this.shipper.password
    this.appUser.roleSimple='DISPATCH'
    this.appUser.idUser=this.shipper.id.toString()
    this.appUser.entrepriseNom=this.shipper.nom
    this.authenticationService.createAppUser(this.appUser).subscribe((data:AppUser)=>{
      this.appUser = new AppUser();
      console.log('User was created.')
    }, err=>{
      console.log(err);
    });
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
  signUpShipper(){
    let exist=false; // this loginName doesn't exist yet
    this.listLoginName.forEach(loginName=>{
      if(loginName.includes(this.shipper.loginName)&&(loginName.length==this.shipper.loginName.length))
        {
          alert("Username existe deja. Choisir un autre username, SVP!");
          exist=true; // this loginName exist already
        }
    })
    if(this.shipper.password.length<4)
      alert('Password doit avoir au moins 4 characteres!')

    if(!exist && this.shipper.password.length>=4){
      this.shippersService.signUpShipper(this.shipper).subscribe((data:Shipper)=>{
        // this.mode=2;
        this.shipper=data;
        this.onCreateUser();
        this.contact.id_shipper=this.shipper.id;
        this.adresse.id_shipper=this.shipper.id;
        this.signUpContact();
        this.signUpAdresse();
        if(this.role.includes('DISPATCH')) this.router.navigate(['']);
        else this.router.navigate(['/shippers']);  //this.mode=2;
      }, err=>{
        console.log(err);
      });
    }
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
