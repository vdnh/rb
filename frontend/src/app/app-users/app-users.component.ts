import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { AppUser } from 'src/model/model.appUser';
import { AuthenticationService } from 'src/services/authentication.service';
import { Shipper } from 'src/model/model.shipper';
import { ShippersService } from 'src/services/shippers.service';
import { TransportersService } from 'src/services/transporters.service';
import { Transporter } from 'src/model/model.transporter';

@Component({
  selector: 'app-app-users',
  templateUrl: './app-users.component.html',
  styleUrls: ['./app-users.component.css']
})
export class AppUsersComponent implements OnInit {

  roleTypes = ["ADMIN", "SHIPPER", "TRANSPORTER", "DISPATCH", "TECHNICIEN", "CHAUFFEUR"];
  appUser : AppUser = new AppUser();
  appUserToMod : AppUser = new AppUser();
  appUserToDel : AppUser = new AppUser();
  listAppUsers : Array<AppUser> = [];
  passwordCheck=''
  passwordCheckToMod=''
  disabledIdUser=false;
  disabledIdSecond=false;
  listShippers: any[];
  listTrans: any[];
  listPros: any[];
  listPros2em: any[];
  
  onCreatUserTest(){
    console.log(this.appUser)
    alert('User a ete cree!!')
    this.appUser = new AppUser();
    this.passwordCheck='';
  }

  onCreatUser(){
    this.authenticationService.createAppUser(this.appUser).subscribe((data:AppUser)=>{
      this.appUser = new AppUser();
      this.passwordCheck='';
      console.log('User was created.')
    }, err=>{
      console.log(err);
    });
  }
  typeRoleChange(type){
    this.appUser.roleSimple=type
    if(this.appUser.roleSimple.includes('ADMIN')){
      this.disabledIdUser=true;
      this.disabledIdSecond=true;
    }
    else if(this.appUser.roleSimple.includes('SHIPPER')){
      this.disabledIdUser=false;
      this.disabledIdSecond=false;
      this.listPros=this.listShippers
      this.listPros2em=this.listTrans
    }
    else if(this.appUser.roleSimple.includes('TRANSPORTER')){
      this.disabledIdUser=false;
      this.disabledIdSecond=false;
      this.listPros=this.listTrans
      this.listPros2em=this.listShippers
    }
    else if(this.appUser.roleSimple.includes('DISPATCH')){
      this.disabledIdUser=false;
      this.disabledIdSecond=true; // reserve for future
    }
    else if(this.appUser.roleSimple.includes('TECHNICIEN')){
      this.disabledIdUser=false;
      this.disabledIdSecond=true; // reserve for future
    }
    else if(this.appUser.roleSimple.includes('CHAUFFEUR')){
      this.disabledIdUser=false;
      this.disabledIdSecond=true; // reserve for future
    }
  }
  constructor(public authenticationService:AuthenticationService,
    public shipperservice:ShippersService,
    public transporterservice:TransportersService,) { 

    }

  ngOnInit() {
    this.appUser.roleSimple=this.roleTypes[0];
    this.shipperservice.getAllShippers().subscribe(async (data:Array<Shipper>)=>{
      this.listShippers=data;
      await this.transporterservice.getAllTransporters().subscribe((data:Array<Transporter>)=>{
        this.listTrans=data;
        //this.listPros.push(this.listShippers)
        //this.listPros.push(this.listTrans)
        this.typeRoleChange(this.roleTypes[0]);
      }, err=>{
        console.log(err)
      })
    }, err=>{
      console.log(err)
    })
    this.authenticationService.getAllAppUsers().subscribe((data:Array<AppUser>)=>{
      this.listAppUsers=data;
    },
    err=>{
      console.log(err)
    })
  }
  
  idUserChange(){
    let strings:Array<string>=this.appUser.idUser.split(" ")
    this.appUser.idUser=strings[1]
    if(strings[0]=='Trans') this.listPros2em = this.listShippers
    else if(strings[0]=='Ship') this.listPros2em = this.listTrans
  }
  
  idSecondChange(){
    let strings:Array<string>=this.appUser.idSecond.split(" ")
    this.appUser.idSecond=strings[0]
  }

  onModifyUser(){
    this.authenticationService.modifyAppUser(this.appUserToMod).subscribe((data:AppUser)=>{
      //this.appUser = new AppUser();
      //this.passwordCheckToMod='';
      alert('User was modified.')
      console.log('User was modified.')
      this.authenticationService.getAllAppUsers().subscribe((data:Array<AppUser>)=>{
        this.listAppUsers=data;
      },
      err=>{
        console.log(err)
      })
    }, err=>{
      console.log(err);
    });
  }

  onDeleteUser(){
    this.authenticationService.deleteAppUser(this.appUserToMod).subscribe((data:AppUser)=>{
      //this.appUser = new AppUser();
      //this.passwordCheckToMod='';
      alert('User was deleted.')
      console.log('User was deleted.')
      this.authenticationService.getAllAppUsers().subscribe((data:Array<AppUser>)=>{
        this.listAppUsers=data;
      },
      err=>{
        console.log(err)
      })
    }, err=>{
      console.log(err);
    });
  }

}
