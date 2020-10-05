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
import { CamionsService } from 'src/services/camions.service';
import { Camion } from 'src/model/model.camion';

@Component({
  selector: 'app-new-terminal',
  templateUrl: './new-terminal.component.html',
  styleUrls: ['./new-terminal.component.css']
})
export class NewTerminalComponent implements OnInit {

  truck:Camion;
  trucks:Camion[]; // list all trucks, but not trailer
  trucksGps:Camion[]; // list all trucks Gps
  trucksNoGps:Camion[]; // list all trucks NoGps
  terminal:Terminal=new Terminal();
  // mode:number=1;
  // contact:Contact=new Contact();
  // adresse:Adresse=new Adresse();
  appUser : AppUser = new AppUser();
  role:string="";
  
  listLoginName:Array<string>=[];
  
  
  constructor(
    // public shippersService:ShippersService,
    
    public terminalsService:TerminalsService, 
    public camionsService:CamionsService, 
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
    this.camionsService.camionsDeTransporter(Number(localStorage.getItem('idTransporter'))).subscribe((data:Array<Camion>)=>{
      this.trucks=data.sort((a,b)=>Number(a.unite)-Number(b.unite)).filter(x=>(
        !x.trailer && x.status && (x.idTerminal==null || x.idTerminal<=0)
        // we select truck that : no-trailer + in Exploit + not yet terminal
      ));
      this.trucksGps=this.trucks.filter(x=>(x.gps))
      this.trucksNoGps=this.trucks.filter(x=>(!x.gps))
    }, err=>{console.log(err)})

  }

  onSelectTruck(){
    if(this.truck!=null) this.terminal.idTruck=this.truck.id; // assign idtruck for this terminal
    else this.terminal.idTruck=null
  }

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
      // no truck when terminal inactivated
      if(!this.terminal.status) {
        this.terminal.idTruck=null
        this.truck=null
      }
      this.terminalsService.saveTerminals(this.terminal).subscribe((data:Terminal)=>{
        // this.mode=2;
        this.terminal=data;
        this.onCreateUser();
        if(this.truck!=null){
          this.truck.idTerminal=this.terminal.id; // set this terminal for the truck
          this.truck.nameTerminal=this.terminal.name
          this.camionsService.saveCamions(this.truck).subscribe((data:Camion)=>{
            this.truck=data
          })
        }
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
